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
    // Passo 1: Obter o corpo da requisição e registrar imediatamente.
    const body = await req.json();
    await log("debug", "body_received", `Corpo recebido: ${JSON.stringify(body)}`);

    // Passo 2: Extrair o e-mail.
    const email = body?.Customer?.email;
    emailForLog = email || "no_email_found";
    eventForLog = body?.webhook_event_type || "no_event_type";

    if (!email) {
      await log(emailForLog, eventForLog, "ERRO: Email não encontrado no corpo do webhook.");
      throw new Error("Email not found in webhook body.");
    }
    await log(emailForLog, eventForLog, `Email extraído com sucesso: ${email}`);

    // Passo 3: Verificar se o usuário já existe.
    const { data: { users }, error: findUserError } = await supabaseAdmin.auth.admin.listUsers({ email });
    if (findUserError) {
      await log(emailForLog, eventForLog, `ERRO ao verificar existência do usuário: ${findUserError.message}`);
      throw findUserError;
    }

    if (users.length > 0) {
      await log(emailForLog, eventForLog, "Usuário já existe na tabela auth.users. Nenhuma ação de criação foi tomada.");
      return new Response(JSON.stringify({ message: "User already exists." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Passo 4: Tentar criar o usuário. Este é o ponto crítico.
    await log(emailForLog, eventForLog, "Usuário não encontrado. Tentando criar na tabela auth.users...");
    const { data: newUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    // Passo 5: Verificar o resultado da tentativa de criação.
    if (inviteError) {
      await log(emailForLog, eventForLog, `ERRO CRÍTICO ao tentar criar usuário: ${inviteError.message}`);
      throw inviteError;
    }

    if (!newUser || !newUser.user) {
      await log(emailForLog, eventForLog, "ERRO CRÍTICO: A função inviteUserByEmail foi executada sem erro, mas não retornou um usuário.");
      throw new Error("inviteUserByEmail succeeded but returned no user object.");
    }

    // Passo 6: Se for bem-sucedido, registrar claramente.
    await log(emailForLog, eventForLog, `SUCESSO: Usuário criado na tabela auth.users com ID: ${newUser.user.id}. O e-mail de convite deve ser enviado.`);

    return new Response(JSON.stringify({ success: true, message: `User created with ID: ${newUser.user.id}` }), {
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