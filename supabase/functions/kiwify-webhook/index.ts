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
      const { data: { users }, error: findUserError } = await supabaseAdmin.auth.admin.listUsers({ email });
      if (findUserError) throw findUserError;

      if (users.length > 0) {
        const user = users[0];
        await supabaseAdmin.from('profiles').update({
          plan: 'free',
          status: 'suspended',
          access_expires_at: new Date().toISOString()
        }).eq('id', user.id);
        
        await log(emailForLog, eventForLog, `SUCESSO: Acesso removido (ID: ${user.id}).`);
        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
      } else {
        await log(emailForLog, eventForLog, 'AVISO: Usuário não encontrado para cancelamento.');
        return new Response(JSON.stringify({ message: "User not found." }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
      }

    } else if (isApprovedEvent) {
      let user;
      const { data: { users }, error: findUserError } = await supabaseAdmin.auth.admin.listUsers({ email });
      if (findUserError) throw findUserError;

      if (users.length > 0) {
        user = users[0];
        await log(emailForLog, eventForLog, `INFO: Usuário existente (ID: ${user.id}).`);
      } else {
        await log(emailForLog, eventForLog, 'INFO: Criando novo usuário (convite).');
        const { data: newUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
        if (inviteError) {
           // Tenta recuperar caso tenha falhado por race condition
           if (inviteError.message.includes('already been registered')) {
              const { data: { users: retryUsers } } = await supabaseAdmin.auth.admin.listUsers({ email });
              if (retryUsers.length > 0) user = retryUsers[0];
              else throw new Error(`Falha ao convidar/recuperar usuário: ${inviteError.message}`);
           } else {
              throw new Error(`Falha no convite: ${inviteError.message}`);
           }
        } else {
            // Recupera o usuário recém criado para garantir que temos o ID correto
            const { data: { users: newUsers } } = await supabaseAdmin.auth.admin.listUsers({ email });
            if (!newUsers.length) throw new Error("Usuário convidado não encontrado.");
            user = newUsers[0];
        }
      }

      const fullName = body?.Customer?.full_name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const planName = body?.Subscription?.plan?.name || body?.Product?.product_name || 'Plano PRO';
      const expiresAt = body?.Subscription?.customer_access?.access_until || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

      // Tenta UPDATE primeiro para garantir que estamos alterando o registro existente
      const { error: updateError, count } = await supabaseAdmin.from('profiles').update({
          first_name: firstName,
          last_name: lastName,
          status: 'active',
          plan: planName,
          access_expires_at: expiresAt
      }).eq('id', user.id).select(); // Select retorna os dados atualizados

      let finalAction = "UPDATE";

      // Se o UPDATE não afetou linhas (perfil não existe), fazemos INSERT
      if (!updateError && count === 0) {
          finalAction = "INSERT";
          const { error: insertError } = await supabaseAdmin.from('profiles').insert({
              id: user.id,
              first_name: firstName,
              last_name: lastName,
              status: 'active',
              plan: planName,
              access_expires_at: expiresAt
          });
          if (insertError) throw insertError;
      } else if (updateError) {
          throw updateError;
      }

      // LEITURA DE CONFIRMAÇÃO
      const { data: confirmData } = await supabaseAdmin.from('profiles').select('status, plan').eq('id', user.id).single();
      
      await log(emailForLog, eventForLog, `SUCESSO (${finalAction}): ID ${user.id}. DB Confirma: Status=${confirmData?.status}, Plano=${confirmData?.plan}`);
      
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

    } else {
      await log(emailForLog, eventForLog, 'Evento ignorado.');
      return new Response(JSON.stringify({ message: "Ignored" }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

  } catch (error) {
    console.error("ERRO:", error);
    await log(emailForLog, eventForLog, `ERRO: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});