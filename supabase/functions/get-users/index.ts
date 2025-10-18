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
    console.log("Function get-users invoked.");

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    console.log("Supabase admin client created.");

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Authorization header missing.");
      throw new Error('Cabeçalho de autorização ausente');
    }
    const jwt = authHeader.replace('Bearer ', '');
    
    console.log("Attempting to get user from JWT.");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt);
    if (userError) {
      console.error("Error getting user from JWT:", userError);
      throw userError;
    }
    if (!user) {
      console.error("User not found for the provided JWT.");
      throw new Error('Usuário não encontrado ou token inválido');
    }
    console.log(`User found: ${user.id}`);

    console.log(`Checking role for user: ${user.id}`);
    const { data: role, error: roleError } = await supabaseAdmin.rpc('get_user_role', { user_id: user.id });
    if (roleError) {
      console.error("Error calling get_user_role RPC:", roleError);
      throw roleError;
    }
    console.log(`User role is: ${role}`);

    if (role !== 'admin') {
      console.warn(`Permission denied for user ${user.id} with role ${role}.`);
      return new Response(JSON.stringify({ error: 'Acesso negado: somente administradores.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("User is admin. Fetching all user details.");
    const { data: users, error: rpcError } = await supabaseAdmin.rpc('get_all_user_details');
    if (rpcError) {
      console.error("Error calling get_all_user_details RPC:", rpcError);
      throw rpcError;
    }
    console.log(`Successfully fetched ${users ? users.length : 0} users.`);

    return new Response(JSON.stringify({ users }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Critical error in get-users function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});