import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { timingSafeEqual } from "https://deno.land/std@0.177.0/crypto/timing_safe_equal.ts";
import { encode } from "https://deno.land/std@0.177.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

async function verifyKiwifySignature(req: Request, secret: string) {
  const url = new URL(req.url);
  const signature = url.searchParams.get('signature');
  const bodyText = await req.clone().text();

  if (!signature) {
    console.error("ERRO CRÍTICO: Parâmetro 'signature' não encontrado na URL.");
    return { isValid: false, body: null };
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), {
    name: "HMAC",
    hash: "SHA-256"
  }, false, ["sign"]);

  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(bodyText));
  const expectedSignature = new TextDecoder().decode(encode(new Uint8Array(mac)));

  const signaturesMatch = timingSafeEqual(encoder.encode(signature), encoder.encode(expectedSignature));

  if (!signaturesMatch) {
    console.warn("Falha na verificação da assinatura do webhook.");
  }

  return { isValid: signaturesMatch, body: JSON.parse(bodyText) };
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

  try {
    const KIWIFY_WEBHOOK_SECRET = Deno.env.get('KIWIFY_WEBHOOK_SECRET');
    if (!KIWIFY_WEBHOOK_SECRET) {
      throw new Error("A variável de ambiente KIWIFY_WEBHOOK_SECRET não está configurada.");
    }

    const { isValid, body } = await verifyKiwifySignature(req, KIWIFY_WEBHOOK_SECRET);

    if (!isValid) {
      return new Response('Assinatura inválida.', { status: 403, headers: corsHeaders });
    }

    const { email, evento, produto } = body;

    if (!email || !evento) {
      return new Response('Campos obrigatórios ausentes: email e evento', { status: 400, headers: corsHeaders });
    }

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
      }
    } else {
      detailsLog = `Evento '${evento}' não reconhecido. Nenhuma alteração realizada.`;
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ plan, status, access_expires_at })
      .eq('id', userId);

    if (updateError) {
      await supabaseAdmin.from('webhook_logs').insert({ email, evento, details: `Erro ao atualizar perfil: ${updateError.message}` });
      throw updateError;
    }

    await supabaseAdmin.from('webhook_logs').insert({ email, evento, details: detailsLog });

    return new Response(JSON.stringify({ success: true, message: detailsLog }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Erro no processamento do webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});