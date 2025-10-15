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
    hash: "SHA-1"
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

    const email = body.Customer?.email;
    const fullName = body.Customer?.full_name || '';
    const evento = body.webhook_event_type;
    const produto = body.Product?.product_name;
    const orderStatus = body.order?.order_status;

    if (!email || !evento) {
      return new Response('Campos obrigatórios ausentes no payload: Customer.email e webhook_event_type', { status: 400, headers: corsHeaders });
    }

    const canceledEvents = ["subscription_canceled", "subscription_late"];
    const approvedEvents = ["order_approved", "subscription_activated", "subscription_renewed"];
    
    const isApprovedEvent = approvedEvents.includes(evento.toLowerCase()) || orderStatus === 'paid';
    const isCanceledEvent = canceledEvents.includes(evento.toLowerCase()) || orderStatus === 'refunded' || orderStatus === 'expired';

    let userId;
    let detailsLog = '';

    const { data: existingUser, error: findUserError } = await supabaseAdmin.auth.admin.listUsers({ email: email });

    if (findUserError) throw findUserError;

    if (existingUser.users.length === 0) {
      if (isApprovedEvent) {
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');

        const { data: newUser, error: creationError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          email_confirm: true,
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
          }
        });

        if (creationError) {
          await supabaseAdmin.from('webhook_logs').insert({ email, evento, details: `Erro ao criar novo usuário: ${creationError.message}` });
          throw creationError;
        }
        userId = newUser.user.id;

        // Gera e envia o e-mail para definição de senha
        const { error: linkError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email: newUser.user.email,
        });

        if (linkError) {
          detailsLog = `Usuário criado, mas falha ao enviar e-mail de definição de senha: ${linkError.message}`;
        } else {
          detailsLog = 'Novo usuário criado. Um e-mail para definição de senha foi enviado.';
        }

      } else {
        await supabaseAdmin.from('webhook_logs').insert({ email, evento, details: 'Usuário não encontrado para evento de cancelamento/atraso. Nenhuma ação tomada.' });
        return new Response('User not found for this event.', { status: 200, headers: corsHeaders });
      }
    } else {
      userId = existingUser.users[0].id;
    }

    let plan = 'free';
    let status = 'pending';
    let access_expires_at = new Date().toISOString();

    if (isCanceledEvent) {
      plan = 'free';
      status = 'pending';
      access_expires_at = new Date().toISOString();
      detailsLog += ` Acesso removido. Status do usuário alterado para pendente.`;
    } else if (isApprovedEvent) {
      status = 'active';
      const lowerCaseProduto = produto?.toLowerCase() || '';

      if (lowerCaseProduto.includes('anual') || lowerCaseProduto === 'plataforma enfermagempro') {
        plan = 'Plano PRO Anual';
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 365);
        access_expires_at = expiryDate.toISOString();
        detailsLog += ` Plano PRO Anual ativado. Acesso até ${expiryDate.toLocaleDateString('pt-BR')}.`;
      } else if (lowerCaseProduto.includes('mensal')) {
        plan = 'Plano PRO Mensal';
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        access_expires_at = expiryDate.toISOString();
        detailsLog += ` Plano PRO Mensal ativado. Acesso até ${expiryDate.toLocaleDateString('pt-BR')}.`;
      } else {
        detailsLog += ` Produto '${produto}' não reconhecido. Nenhuma alteração de plano realizada.`;
      }
    } else {
      detailsLog += ` Evento '${evento}' não reconhecido. Nenhuma alteração realizada.`;
    }

    if (!detailsLog.includes("não reconhecido")) {
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ plan, status, access_expires_at })
        .eq('id', userId);

      if (updateError) {
        await supabaseAdmin.from('webhook_logs').insert({ email, evento, details: `Erro ao atualizar perfil: ${updateError.message}` });
        throw updateError;
      }
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