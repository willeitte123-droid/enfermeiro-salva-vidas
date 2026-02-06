import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { timingSafeEqual } from "https://deno.land/std@0.177.0/crypto/timing_safe_equal.ts";
import { encode } from "https://deno.land/std@0.177.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-kiwify-signature'
};

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
      console.log(`[LOG] ${evento}: ${details}`);
    } catch (e) {
      console.error("CRITICAL: Failed to write to webhook_logs table.", e.message);
    }
  };

  let emailForLog = "unknown";
  let eventForLog = "unknown";

  try {
    const kiwifySecret = Deno.env.get('KIWIFY_WEBHOOK_SECRET');
    if (!kiwifySecret) throw new Error("KIWIFY_WEBHOOK_SECRET not set.");

    const { isValid, bodyText } = await verifyKiwifySignature(req, kiwifySecret);
    if (!isValid) throw new Error("Invalid webhook signature.");

    const body = JSON.parse(bodyText);
    const rawEmail = body?.Customer?.email;
    const email = rawEmail ? rawEmail.trim().toLowerCase() : null;
    
    emailForLog = email || "no_email_found";
    eventForLog = body?.webhook_event_type || "no_event_type";

    if (!email) {
      await log(emailForLog, eventForLog, "ERRO: Email não encontrado.");
      throw new Error("Email not found.");
    }

    const approvedEvents = ["order_approved", "subscription_activated", "subscription_renewed"];
    const canceledEvents = ["subscription_canceled", "subscription_late", "refunded", "expired"];
    const orderStatus = body?.order?.order_status;
    
    const isApprovedEvent = approvedEvents.includes(eventForLog.toLowerCase()) || orderStatus === 'paid';
    const isCanceledEvent = canceledEvents.includes(eventForLog.toLowerCase()) || (orderStatus && canceledEvents.includes(orderStatus.toLowerCase()));

    if (isCanceledEvent) {
      const { data: userId, error: rpcError } = await supabaseAdmin.rpc('get_user_id_by_email', { email_input: email });
      
      if (userId) {
        await supabaseAdmin.from('profiles').update({
          plan: 'free',
          status: 'suspended',
          access_expires_at: new Date().toISOString()
        }).eq('id', userId);
        
        await log(emailForLog, eventForLog, `SUCESSO: Acesso removido para o ID ${userId}.`);
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
      } else {
        await log(emailForLog, eventForLog, 'AVISO: Usuário não encontrado para cancelamento.');
        return new Response(JSON.stringify({ message: "User not found." }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
      }

    } else if (isApprovedEvent) {
      let userId;
      // 1. Tenta buscar usuário existente
      const { data: existingUserId } = await supabaseAdmin.rpc('get_user_id_by_email', { email_input: email });

      if (existingUserId) {
        userId = existingUserId;
        await log(emailForLog, eventForLog, `INFO: Usuário já existe (ID: ${userId}). Apenas atualizando plano.`);
      } else {
        await log(emailForLog, eventForLog, 'INFO: Usuário novo. Criando conta...');
        
        // 2. Cria o usuário VERIFICADO (email_confirm: true)
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            email_confirm: true, // Importante: Já marca como verificado
            user_metadata: { full_name: body?.Customer?.full_name || '' }
        });
        
        if (createError) {
           await log(emailForLog, eventForLog, `ERRO CRÍTICO ao criar usuário: ${createError.message}`);
           throw createError;
        }

        userId = newUser.user.id;
        
        // 3. Pequeno delay para garantir propagação no banco de dados do Supabase
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 4. Envia o email de Reset de Senha (Template Personalizado)
        const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
            redirectTo: 'https://enfermagem-pro.lovable.app/update-password'
        });

        if (resetError) {
             await log(emailForLog, eventForLog, `ERRO ao enviar email de senha: ${resetError.message}`);
        } else {
             await log(emailForLog, eventForLog, 'SUCESSO: Email de definição de senha enviado.');
        }
      }

      // 5. Atualiza Perfil (Profile)
      const fullName = body?.Customer?.full_name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const planName = body?.Subscription?.plan?.name || body?.Product?.product_name || 'Plano PRO';
      const expiresAt = body?.Subscription?.customer_access?.access_until || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

      const { error: upsertProfileError } = await supabaseAdmin.from('profiles').upsert({
          id: userId,
          first_name: firstName,
          last_name: lastName,
          status: 'active',
          plan: planName,
          access_expires_at: expiresAt,
          plan_start_date: new Date().toISOString()
      }, { onConflict: 'id' });

      if (upsertProfileError) {
        await log(emailForLog, eventForLog, `ERRO: Falha no upsert do perfil: ${upsertProfileError.message}`);
      } else {
        await log(emailForLog, eventForLog, `SUCESSO: ID ${userId} atualizado para "${planName}".`);
      }

      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

    } else {
      await log(emailForLog, eventForLog, 'Evento ignorado.');
      return new Response(JSON.stringify({ message: "Ignored" }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

  } catch (error) {
    console.error("ERRO:", error);
    // Tenta logar o erro no banco se possível
    try { await supabaseAdmin.from('webhook_logs').insert({ email: emailForLog, evento: eventForLog, details: `CRITICAL ERROR: ${error.message}` }); } catch {}
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});