import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient, User } from 'https://esm.sh/@supabase/supabase-js@2';
import { timingSafeEqual } from "https://deno.land/std@0.177.0/crypto/timing_safe_equal.ts";
import { encode } from "https://deno.land/std@0.177.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Helper to verify Kiwify's signature
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

  let emailForLog = "unknown";

  try {
    const KIWIFY_WEBHOOK_SECRET = Deno.env.get('KIWIFY_WEBHOOK_SECRET');
    if (!KIWIFY_WEBHOOK_SECRET) throw new Error("KIWIFY_WEBHOOK_SECRET environment variable not set.");

    const { isValid, body } = await verifyKiwifySignature(req, KIWIFY_WEBHOOK_SECRET);
    if (!isValid) return new Response('Invalid signature.', { status: 403, headers: corsHeaders });

    const { Customer, webhook_event_type, order, Subscription, Product } = body;
    const email = Customer?.email;
    emailForLog = email || "unknown";
    const fullName = Customer?.full_name || '';
    const evento = webhook_event_type;
    const orderStatus = order?.order_status;

    if (!email || !evento) {
      await log(emailForLog, evento || 'unknown', `Webhook recebido sem email ou tipo de evento.`);
      return new Response('Missing required fields', { status: 400, headers: corsHeaders });
    }

    const approvedEvents = ["order_approved", "subscription_activated", "subscription_renewed"];
    const canceledEvents = ["subscription_canceled", "subscription_late", "refunded", "expired"];
    
    const isApprovedEvent = approvedEvents.includes(evento.toLowerCase()) || orderStatus === 'paid';
    const isCanceledEvent = canceledEvents.includes(evento.toLowerCase()) || canceledEvents.includes(orderStatus);

    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    let user: User | null = null;
    let logDetails = '';

    // Tenta encontrar o usuário na autenticação
    const { data: { users }, error: findUserError } = await supabaseAdmin.auth.admin.listUsers({ email });
    if (findUserError) throw findUserError;

    if (isApprovedEvent) {
      const planName = Subscription?.plan?.name || Product?.product_name || 'Plano PRO';
      const expiresAt = Subscription?.customer_access?.access_until || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();

      if (users.length === 0) {
        // --- CRIAÇÃO DE NOVO USUÁRIO ---
        const { data: newUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
        if (inviteError || !newUser?.user) {
          throw new Error(`Falha ao convidar novo usuário na auth: ${inviteError?.message || 'Usuário não retornado.'}`);
        }
        user = newUser.user;
        logDetails = `Usuário criado na auth.users. `;
      } else {
        user = users[0];
        logDetails = `Usuário já existente na auth.users. `;
      }

      // --- UPSERT (INSERIR OU ATUALIZAR) O PERFIL ---
      const { error: upsertProfileError } = await supabaseAdmin.from('profiles').upsert({
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        status: 'active',
        plan: planName,
        access_expires_at: expiresAt
      }, { onConflict: 'id' });

      if (upsertProfileError) {
        throw new Error(`Falha ao inserir/atualizar perfil: ${upsertProfileError.message}`);
      }
      
      logDetails += `Perfil criado/atualizado com plano "${planName}".`;

    } else if (isCanceledEvent) {
      if (users.length > 0) {
        user = users[0];
        const { error: updateProfileError } = await supabaseAdmin.from('profiles').update({
          plan: 'free',
          status: 'inactive',
          access_expires_at: new Date().toISOString()
        }).eq('id', user.id);
        if (updateProfileError) throw new Error(`Falha ao cancelar plano: ${updateProfileError.message}`);
        
        logDetails = 'Acesso removido. Status do usuário alterado para inativo.';
      } else {
        logDetails = 'Usuário não encontrado para evento de cancelamento. Nenhuma ação tomada.';
      }
    } else {
      logDetails = `Evento '${evento}' não reconhecido. Nenhuma ação tomada.`;
    }

    await log(email, evento, `Sucesso: ${logDetails}`);
    return new Response(JSON.stringify({ success: true, message: logDetails }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Erro no processamento do webhook:", error);
    await log(emailForLog, 'error', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});