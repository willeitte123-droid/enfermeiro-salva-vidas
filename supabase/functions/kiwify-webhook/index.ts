import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
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
      console.error("Falha ao registrar log:", e.message);
    }
  };

  let emailForLog = "unknown";
  let eventForLog = "unknown";

  try {
    const body = await req.json();
    const email = body?.Customer?.email;
    emailForLog = email || "no_email_found";
    eventForLog = body?.webhook_event_type || "no_event_type";

    if (!email) {
      await log(emailForLog, eventForLog, "ERRO: Email não encontrado no corpo do webhook.");
      throw new Error("Email not found in webhook body.");
    }

    const approvedEvents = ["order_approved", "subscription_activated", "subscription_renewed"];
    const orderStatus = body?.order?.order_status;
    const isApprovedEvent = approvedEvents.includes(eventForLog.toLowerCase()) || orderStatus === 'paid';

    if (!isApprovedEvent) {
        await log(emailForLog, eventForLog, `Evento '${eventForLog}' ignorado. Nenhuma ação de criação de usuário necessária.`);
        return new Response(JSON.stringify({ message: "Event ignored." }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });
    }

    // Lógica simplificada: Tentar convidar o usuário diretamente.
    // Se o usuário já existir, o Supabase reenviará o convite.
    await log(emailForLog, eventForLog, "Tentando enviar convite de criação de usuário...");
    const { data: newUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    if (inviteError) {
      await log(emailForLog, eventForLog, `ERRO CRÍTICO ao tentar enviar convite: ${inviteError.message}`);
      throw inviteError;
    }

    if (!newUser || !newUser.user) {
      await log(emailForLog, eventForLog, "ERRO CRÍTICO: A função de convite foi executada sem erro, mas não retornou um usuário.");
      throw new Error("inviteUserByEmail succeeded but returned no user object.");
    }

    // Se chegamos aqui, o usuário foi criado ou o convite foi reenviado com sucesso.
    // Agora, podemos prosseguir com a criação/atualização do perfil.
    const fullName = body?.Customer?.full_name || '';
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const planName = body?.Subscription?.plan?.name || body?.Product?.product_name || 'Plano PRO';
    const expiresAt = body?.Subscription?.customer_access?.access_until || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

    const { error: upsertProfileError } = await supabaseAdmin.from('profiles').upsert({
        id: newUser.user.id,
        first_name: firstName,
        last_name: lastName,
        status: 'active',
        plan: planName,
        access_expires_at: expiresAt
    }, { onConflict: 'id' });

    if (upsertProfileError) {
        await log(emailForLog, eventForLog, `AVISO: Usuário criado na auth, mas falha ao criar/atualizar perfil: ${upsertProfileError.message}`);
        // Não lançamos um erro aqui, pois a criação do usuário foi o passo crítico.
    }

    await log(emailForLog, eventForLog, `SUCESSO: Convite enviado/reenviado para ${email}. Perfil criado/atualizado.`);

    return new Response(JSON.stringify({ success: true, message: `Invite sent/resent for user ${newUser.user.id}` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("ERRO GERAL no webhook:", error);
    await log(emailForLog, eventForLog, `ERRO GERAL: ${error.message}`);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});