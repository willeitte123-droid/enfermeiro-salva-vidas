import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { timingSafeEqual } from "https://deno.land/std@0.177.0/crypto/timing_safe_equal.ts";
import { encode } from "https://deno.land/std@0.177.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-kiwify-signature'
};

// Função para verificar a assinatura do webhook da Kiwify via parâmetro de URL e SHA-1
async function verifyKiwifySignature(req: Request, secret: string) {
  const url = new URL(req.url);
  const signature = url.searchParams.get('signature');
  const bodyText = await req.clone().text();

  if (!signature) {
    console.error("ERRO CRÍTICO: Parâmetro 'signature' não encontrado na URL.");
    return { isValid: false, bodyText };
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );

  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(bodyText));
  const expectedSignature = new TextDecoder().decode(encode(new Uint8Array(mac)));

  const isValid = timingSafeEqual(encoder.encode(signature), encoder.encode(expectedSignature));

  if (!isValid) {
    console.warn('Falha na verificação da assinatura.');
  }

  return { isValid, bodyText };
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { auth: { persistSession: false } }
  );

  const log = async (email: string, evento: string, details: string) => {
    try {
      await supabaseAdmin.from('webhook_logs').insert({ email, evento, details });
    } catch (e) {
      console.error("CRITICAL: Failed to write to webhook_logs table.", e.message);
    }
  };

  let emailForLog = "unknown";
  let eventForLog = "unknown";

  try {
    const kiwifySecret = Deno.env.get('KIWIFY_WEBHOOK_SECRET');
    if (!kiwifySecret) {
      throw new Error("KIWIFY_WEBHOOK_SECRET is not set in Supabase secrets.");
    }

    const { isValid, bodyText } = await verifyKiwifySignature(req, kiwifySecret);
    if (!isValid) {
      throw new Error("Invalid webhook signature.");
    }

    const body = JSON.parse(bodyText);
    // Normaliza o email removendo espaços em branco e convertendo para minúsculas
    const rawEmail = body?.Customer?.email;
    const email = rawEmail ? rawEmail.trim().toLowerCase() : null;
    
    emailForLog = email || "no_email_found";
    eventForLog = body?.webhook_event_type || "no_event_type";

    if (!email) {
      await log(emailForLog, eventForLog, "ERRO: Email não encontrado no corpo do webhook.");
      throw new Error("Email not found in webhook body.");
    }

    const approvedEvents = ["order_approved", "subscription_activated", "subscription_renewed"];
    const canceledEvents = ["subscription_canceled", "subscription_late", "refunded", "expired"];
    const orderStatus = body?.order?.order_status;
    
    const isApprovedEvent = approvedEvents.includes(eventForLog.toLowerCase()) || orderStatus === 'paid';
    const isCanceledEvent = canceledEvents.includes(eventForLog.toLowerCase()) || (orderStatus && canceledEvents.includes(orderStatus.toLowerCase()));

    if (isCanceledEvent) {
      const { data: { users }, error: findUserError } = await supabaseAdmin.auth.admin.listUsers({ email });
      if (findUserError) throw findUserError;

      if (users.length > 0) {
        const user = users[0];
        const { error: updateProfileError } = await supabaseAdmin.from('profiles').update({
          plan: 'free',
          status: 'suspended',
          access_expires_at: new Date().toISOString()
        }).eq('id', user.id);

        if (updateProfileError) throw new Error(`Falha ao atualizar perfil para cancelar acesso: ${updateProfileError.message}`);
        
        await log(emailForLog, eventForLog, `SUCESSO: Acesso removido para o ID ${user.id}. Status alterado para suspended.`);
        return new Response(JSON.stringify({ success: true, message: `Access revoked for ${email}` }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
      } else {
        await log(emailForLog, eventForLog, 'AVISO: Usuário não encontrado para evento de cancelamento. Nenhuma ação tomada.');
        return new Response(JSON.stringify({ message: "User not found for cancellation event." }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
      }

    } else if (isApprovedEvent) {
      let user;
      // Busca exata pelo email normalizado
      const { data: { users }, error: findUserError } = await supabaseAdmin.auth.admin.listUsers({ email });
      if (findUserError) throw findUserError;

      if (users.length > 0) {
        user = users[0];
        await log(emailForLog, eventForLog, `INFO: Usuário encontrado (ID: ${user.id}). Atualizando plano.`);
      } else {
        await log(emailForLog, eventForLog, 'INFO: Usuário não encontrado. Enviando convite.');
        const { data: newUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
        if (inviteError) {
          // Se o convite falhar porque o usuário já existe (caso de race condition ou erro na busca), tenta buscar novamente
          if (inviteError.message.includes('already been registered')) {
             const { data: { users: existingUsers } } = await supabaseAdmin.auth.admin.listUsers({ email });
             if (existingUsers.length > 0) {
                 user = existingUsers[0];
                 await log(emailForLog, eventForLog, `INFO: Usuário recuperado após erro de convite (ID: ${user.id}).`);
             } else {
                 throw new Error(`Falha ao convidar e ao buscar usuário existente: ${inviteError.message}`);
             }
          } else {
             throw new Error(`Falha ao convidar novo usuário: ${inviteError.message}`);
          }
        } else {
            // Convite enviado com sucesso, busca o usuário criado
            const { data: { users: newUsers }, error: findAgainError } = await supabaseAdmin.auth.admin.listUsers({ email });
            if (findAgainError || newUsers.length === 0) {
                throw findAgainError || new Error("Falha ao encontrar o usuário recém-convidado.");
            }
            user = newUsers[0];
        }
      }

      const fullName = body?.Customer?.full_name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const planName = body?.Subscription?.plan?.name || body?.Product?.product_name || 'Plano PRO';
      
      // Se o plano vier com 'anual' ou similar, garantimos a formatação correta se necessário, 
      // mas aqui confiamos no payload ou no fallback
      
      const expiresAt = body?.Subscription?.customer_access?.access_until || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

      // Usamos upsert para garantir que o registro em profiles exista e seja atualizado
      const { error: upsertProfileError } = await supabaseAdmin.from('profiles').upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          status: 'active', // Força o status ativo
          plan: planName,
          access_expires_at: expiresAt
      }, { onConflict: 'id' });

      if (upsertProfileError) {
        await log(emailForLog, eventForLog, `AVISO: Falha ao atualizar tabela profiles para o ID ${user.id}: ${upsertProfileError.message}`);
        throw new Error(`Falha ao atualizar perfil: ${upsertProfileError.message}`);
      }

      await log(emailForLog, eventForLog, `SUCESSO: Perfil do ID ${user.id} atualizado para "${planName}" e status "active".`);
      return new Response(JSON.stringify({ success: true, message: `Access granted for ${email}` }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

    } else {
      await log(emailForLog, eventForLog, `Evento '${eventForLog}' ignorado.`);
      return new Response(JSON.stringify({ message: "Event ignored." }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

  } catch (error) {
    console.error("ERRO GERAL no webhook:", error);
    await log(emailForLog, eventForLog, `ERRO GERAL: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});