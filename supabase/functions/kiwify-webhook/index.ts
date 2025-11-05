import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-kiwify-signature'
};

// Função para verificar a assinatura do webhook usando a nova biblioteca
const verifySignature = (body: string, signature: string, secret: string): boolean => {
  const hash = hmac("sha256", secret, body, "hex");
  return hash === signature;
};

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

    const signature = req.headers.get('X-Kiwify-Signature');
    if (!signature) {
      throw new Error("X-Kiwify-Signature header is missing.");
    }

    const rawBody = await req.text();
    if (!verifySignature(rawBody, signature, kiwifySecret)) {
      throw new Error("Invalid webhook signature.");
    }

    const body = JSON.parse(rawBody);
    const email = body?.Customer?.email;
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
    const isCanceledEvent = canceledEvents.includes(eventForLog.toLowerCase()) || canceledEvents.includes(orderStatus);

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
        
        await log(emailForLog, eventForLog, 'SUCESSO: Acesso do usuário removido. Plano alterado para free e status para suspended.');
        return new Response(JSON.stringify({ success: true, message: `Access revoked for ${email}` }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
      } else {
        await log(emailForLog, eventForLog, 'AVISO: Usuário não encontrado para evento de cancelamento. Nenhuma ação tomada.');
        return new Response(JSON.stringify({ message: "User not found for cancellation event." }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
      }

    } else if (isApprovedEvent) {
      const { data: newUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
      if (inviteError && !inviteError.message.includes('User already registered')) throw inviteError;

      const { data: { users }, error: findUserError } = await supabaseAdmin.auth.admin.listUsers({ email });
      if (findUserError || users.length === 0) throw findUserError || new Error("User not found after invite.");
      const user = users[0];

      const fullName = body?.Customer?.full_name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const planName = body?.Subscription?.plan?.name || body?.Product?.product_name || 'Plano PRO';
      const expiresAt = body?.Subscription?.customer_access?.access_until || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

      const { error: upsertProfileError } = await supabaseAdmin.from('profiles').upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          status: 'active',
          plan: planName,
          access_expires_at: expiresAt
      }, { onConflict: 'id' });

      if (upsertProfileError) await log(emailForLog, eventForLog, `AVISO: Usuário criado/convidado, mas falha ao criar/atualizar perfil: ${upsertProfileError.message}`);

      await log(emailForLog, eventForLog, `SUCESSO: Convite enviado/reenviado. Perfil criado/atualizado para o plano "${planName}".`);
      return new Response(JSON.stringify({ success: true, message: `Access granted for ${email}` }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

    } else {
      await log(emailForLog, eventForLog, `Evento '${eventForLog}' não é de aprovação nem de cancelamento. Ignorado.`);
      return new Response(JSON.stringify({ message: "Event ignored." }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

  } catch (error) {
    console.error("ERRO GERAL no webhook:", error);
    await log(emailForLog, eventForLog, `ERRO GERAL: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});