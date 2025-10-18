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
      throw new Error('Cabeçalho de autorização ausente');
    }
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt);
    if (userError || !user) {
      throw userError || new Error('Usuário não encontrado ou token inválido');
    }

    // 2. Verifica se o usuário é um administrador chamando a função RPC 'get_user_role'
    const { data: role, error: roleError } = await supabaseAdmin.rpc('get_user_role', { user_id: user.id });

    if (roleError) {
      throw roleError;
    }

    // 3. Se o usuário não for um administrador, retorna um erro de acesso negado
    if (role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Acesso negado: somente administradores.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Se o usuário for um administrador, busca todos os detalhes dos usuários
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
    console.error("Erro na Edge Function get-users:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});