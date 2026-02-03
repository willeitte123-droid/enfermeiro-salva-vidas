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
    // Usando a Service Role Key para ter acesso total ao banco (bypass RLS)
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

    const TARGET_USER_ID = '4975ed96-8d71-433f-9d1d-8c81f4a3ce7c';
    const TARGET_EMAIL = 'nandorv3@gmail.com';

    console.log(`Tentando criar/atualizar perfil para: ${TARGET_USER_ID}`);

    // Tenta fazer o UPSERT (Inserir ou Atualizar) diretamente na tabela profiles
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: TARGET_USER_ID,
        first_name: 'Nando',
        last_name: 'Admin',
        role: 'admin',
        status: 'active',
        plan: 'premium',
        email: TARGET_EMAIL,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error("Erro no Supabase Admin:", error);
      throw new Error(`Falha ao criar perfil: ${error.message}`);
    }

    console.log("Perfil criado com sucesso:", data);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Perfil de Admin criado com sucesso! A página irá recarregar.",
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