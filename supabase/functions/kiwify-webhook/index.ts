import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

// Este é o seu token secreto. A Kiwify deve enviá-lo em cada requisição.
const KIWIFY_TOKEN = 'qvohpes8b0r'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Lida com a requisição de pre-flight do CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { email, evento, produto, token } = body

    // 1. Validação de Segurança
    if (token !== KIWIFY_TOKEN) {
      return new Response('Unauthorized', { status: 403, headers: corsHeaders })
    }

    if (!email || !evento) {
      return new Response('Campos obrigatórios ausentes: email e evento', { status: 400, headers: corsHeaders })
    }

    // Usa a Chave de Serviço para realizar operações de administrador
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // 2. Encontra o usuário pelo email
    const { data: authUserData, error: authUserError } = await supabaseAdmin.auth.admin.listUsers({ email: email });
    if (authUserError || !authUserData || authUserData.users.length === 0) {
        await supabaseAdmin.from('webhook_logs').insert({ email, evento, details: `Erro: Usuário não encontrado com o email ${email}` });
        return new Response('User not found', { status: 404, headers: corsHeaders });
    }
    const userId = authUserData.users[0].id;

    let plan = 'free';
    let status = 'pending';
    let access_expires_at = new Date().toISOString();
    let detailsLog = '';

    // 3. Processa o evento
    const canceledEvents = ["assinatura cancelada", "assinatura atrasada"];
    const approvedEvents = ["assinatura renovada", "assinatura aprovada", "compra aprovada"];

    if (canceledEvents.includes(evento.toLowerCase())) {
      plan = 'free';
      status = 'pending';
      access_expires_at = new Date().toISOString();
      detailsLog = `Acesso removido. Status do usuário alterado para pendente.`;
    } else if (approvedEvents.includes(evento.toLowerCase())) {
      status = 'active';
      if (produto === 'Plano PRO Anual') {
        plan = 'Plano PRO Anual';
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 365);
        access_expires_at = expiryDate.toISOString();
        detailsLog = `Plano PRO Anual ativado. Acesso até ${expiryDate.toLocaleDateString('pt-BR')}.`;
      } else if (produto === 'Plano PRO Mensal') {
        plan = 'Plano PRO Mensal';
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        access_expires_at = expiryDate.toISOString();
        detailsLog = `Plano PRO Mensal ativado. Acesso até ${expiryDate.toLocaleDateString('pt-BR')}.`;
      } else {
        detailsLog = `Produto '${produto}' não reconhecido. Nenhuma alteração de plano realizada.`;
        await supabaseAdmin.from('webhook_logs').insert({ email, evento, details: detailsLog });
        return new Response('Product not recognized', { status: 200, headers: corsHeaders });
      }
    } else {
        detailsLog = `Evento '${evento}' não reconhecido. Nenhuma alteração realizada.`;
        await supabaseAdmin.from('webhook_logs').insert({ email, evento, details: detailsLog });
        return new Response('Event not recognized', { status: 200, headers: corsHeaders });
    }

    // Atualiza o perfil do usuário
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ plan, status, access_expires_at })
      .eq('id', userId)

    if (updateError) {
      await supabaseAdmin.from('webhook_logs').insert({ email, evento, details: `Erro ao atualizar perfil: ${updateError.message}` });
      throw updateError;
    }

    // 4. Registra o log do processamento bem-sucedido
    await supabaseAdmin.from('webhook_logs').insert({ email, evento, details: detailsLog });

    return new Response(JSON.stringify({ success: true, message: detailsLog }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})