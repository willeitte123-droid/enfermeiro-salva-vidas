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
    console.error("Signature parameter not found in URL.");
    return { isValid: false, body: null };
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, encoder.encode(bodyText));
  const expectedSignature = new TextDecoder().decode(encode(new Uint8Array(mac)));

  const signaturesMatch = timingSafeEqual(encoder.encode(signature), encoder.encode(expectedSignature));
  if (!signaturesMatch) console.warn("Webhook signature verification failed.");

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

  const log = async (email: string, evento: string, details: string) => {
    await supabaseAdmin.from('webhook_logs').insert({ email, evento, details });
  };

  try {
    const KIWIFY_WEBHOOK_SECRET = Deno.env.get('KIWIFY_WEBHOOK_SECRET');
    if (!KIWIFY_WEBHOOK_SECRET) throw new Error("KIWIFY_WEBHOOK_SECRET environment variable not set.");

    const { isValid, body } = await verifyKiwifySignature(req, KIWIFY_WEBHOOK_SECRET);
    if (!isValid) return new Response('Invalid signature.', { status: 403, headers: corsHeaders });

    const { Customer, webhook_event_type, order, Subscription, Product } = body;
    const email = Customer?.email;
    const fullName = Customer?.full_name || '';
    const evento = webhook_event_type;
    const orderStatus = order?.order_status;

    if (!email || !evento) {
      return new Response('Missing required fields: Customer.email and webhook_event_type', { status: 400, headers: corsHeaders });
    }

    const approvedEvents = ["order_approved", "subscription_activated", "subscription_renewed"];
    const canceledEvents = ["subscription_canceled", "subscription_late", "refunded", "expired"];
    
    const isApprovedEvent = approvedEvents.includes(evento.toLowerCase()) || orderStatus === 'paid';
    const isCanceledEvent = canceledEvents.includes(evento.toLowerCase()) || canceledEvents.includes(orderStatus);

    // --- ETAPA 1: ENCONTRAR OU CRIAR O USUÁRIO NA AUTH ---
    let user;
    const { data: { users }, error: findUserError } = await supabaseAdmin.auth.admin.listUsers({ email });
    if (findUserError) throw findUserError;

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    if (users.length === 0) {
      if (isApprovedEvent) {
        const { data: newUser, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
          email: email,
          password: crypto.randomUUID(), // Senha temporária segura
          email_confirm: true,
          user_metadata: {
            first_name: firstName,
            last_name: lastName
          }
        });

        if (createUserError) {
          await log(email, evento, `Erro ao CRIAR novo usuário na auth: ${createUserError.message}`);
          throw createUserError;
        }
        user = newUser.user;
        await log(email, evento, `Usuário criado na autenticação (ID: ${user.id}).`);

        const { error: recoveryError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: email,
        });
        if (recoveryError) {
            await log(email, evento, `Usuário criado, mas falha ao enviar e-mail de recuperação: ${recoveryError.message}`);
        } else {
            await log(email, evento, `E-mail de definição de senha enviado para o novo usuário.`);
        }
      } else {
        await log(email, evento, 'Usuário não encontrado para evento de cancelamento. Nenhuma ação tomada.');
        return new Response('User not found for cancellation event.', { status: 200, headers: corsHeaders });
      }
    } else {
      user = users[0];
    }

    // --- ETAPA 2: CRIAR/ATUALIZAR O PERFIL NA TABELA 'profiles' ---
    let profileData: any = {};
    let logDetails = '';

    if (isCanceledEvent) {
      profileData = {
        plan: 'free',
        status: 'inactive',
        access_expires_at: new Date().toISOString()
      };
      logDetails = 'Acesso removido. Status do usuário alterado para inativo.';
    } else if (isApprovedEvent) {
      profileData = {
        status: 'active',
        plan: Subscription?.plan?.name || Product?.product_name || 'Plano PRO',
        access_expires_at: Subscription?.customer_access?.access_until || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
      };
      logDetails = `Plano "${profileData.plan}" ativado para o usuário ${email}.`;
    } else {
      await log(email, evento, `Evento '${evento}' não reconhecido. Nenhuma ação tomada.`);
      return new Response('Event not handled.', { status: 200, headers: corsHeaders });
    }

    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        ...profileData
      }, { onConflict: 'id' });

    if (upsertError) {
      await log(email, evento, `Erro ao criar/atualizar perfil na tabela 'profiles': ${upsertError.message}`);
      throw upsertError;
    }

    await log(email, evento, `Sucesso: ${logDetails}`);

    return new Response(JSON.stringify({ success: true, message: logDetails }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Erro no processamento do webhook:", error);
    const email = "unknown";
    await log(email, 'error', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});