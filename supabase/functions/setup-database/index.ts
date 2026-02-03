import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const TARGET_EMAIL = 'nandorv3@gmail.com';

    console.log(`Buscando usuário: ${TARGET_EMAIL}`);

    // 1. Busca o ID real do usuário pelo email usando RPC ou Auth Admin
    let targetUserId = null;

    // Tentativa A: Via RPC (se existir)
    const { data: rpcId, error: rpcError } = await supabaseAdmin.rpc('get_user_id_by_email', { email_input: TARGET_EMAIL });
    if (!rpcError && rpcId) {
        targetUserId = rpcId;
        console.log("ID encontrado via RPC:", targetUserId);
    } else {
        // Tentativa B: Via Auth Admin (List Users) - Fallback
        console.log("RPC falhou ou não retornou ID. Tentando listUsers...");
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (!listError && users) {
             const foundUser = users.find(u => u.email === TARGET_EMAIL);
             if (foundUser) targetUserId = foundUser.id;
        }
    }

    if (!targetUserId) {
        throw new Error(`Usuário ${TARGET_EMAIL} não encontrado no sistema de autenticação.`);
    }

    console.log(`Aplicando permissões de Admin para ID: ${targetUserId}`);

    // 2. Atualiza o perfil com o ID correto
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: targetUserId,
        first_name: 'Nando',
        last_name: 'Admin',
        role: 'admin',
        status: 'active',
        plan: 'premium',
        // email: TARGET_EMAIL, // Removido para evitar erro de coluna inexistente
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Erro no Supabase Admin:", error);
      throw new Error(`Falha ao atualizar perfil: ${error.message}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Perfil atualizado com sucesso para o ID ${targetUserId}!`,
      data 
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 200 
    });

  } catch (error) {
    console.error("Erro geral na função:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 500 
    });
  }
});