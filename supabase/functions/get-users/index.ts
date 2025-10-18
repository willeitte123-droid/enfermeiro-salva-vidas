import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Cria um cliente Supabase com a chave de serviço para privilégios de administrador
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // 1. Obtém o usuário a partir do token JWT no cabeçalho da requisição
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt);
    if (userError || !user) {
      throw userError || new Error('User not found or invalid token');
    }

    // 2. Verifica se o usuário é um administrador diretamente da tabela 'profiles'
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // Isso pode acontecer se o usuário não tiver uma entrada de perfil.
      console.error(`Error fetching profile for user ${user.id}:`, profileError);
      throw new Error(`Could not verify user role: ${profileError.message}`);
    }

    // 3. Se o usuário não for um administrador, retorna um erro de acesso negado
    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Acesso negado: somente administradores.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Se o usuário for um administrador, busca todos os detalhes dos usuários usando a função RPC
    const { data: users, error: rpcError } = await supabaseAdmin.rpc('get_all_user_details');
    if (rpcError) {
      throw rpcError;
    }

    // Retorna a lista de usuários com sucesso
    return new Response(JSON.stringify({ users }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error in get-users Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});