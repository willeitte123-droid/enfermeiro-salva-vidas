import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Conecta diretamente ao banco usando a string de conexão
    const client = new Client(Deno.env.get('SUPABASE_DB_URL'));
    await client.connect();

    // SCRIPT SQL DE EMERGÊNCIA
    // 1. Recria a função is_admin
    // 2. Recria admin_update_profile com SECURITY DEFINER (Bypassa RLS)
    // 3. Corrige políticas de acesso da tabela profiles
    await client.queryArray(`
      -- Função auxiliar
      CREATE OR REPLACE FUNCTION public.is_admin()
      RETURNS BOOLEAN
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      BEGIN
        RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
      END;
      $$;

      -- Função RPC de atualização (Correção do erro "new row violates row-level security")
      CREATE OR REPLACE FUNCTION public.admin_update_profile(
        target_user_id UUID,
        new_role TEXT,
        new_status TEXT,
        new_plan TEXT
      )
      RETURNS JSON
      LANGUAGE plpgsql
      SECURITY DEFINER
      SET search_path = public
      AS $$
      DECLARE
        result JSON;
      BEGIN
        -- Verifica se quem chama é admin
        IF NOT public.is_admin() THEN
          RAISE EXCEPTION 'Acesso negado: Apenas administradores.';
        END IF;

        -- Executa update
        UPDATE public.profiles
        SET 
          role = new_role,
          status = new_status,
          plan = new_plan,
          updated_at = NOW()
        WHERE id = target_user_id;

        SELECT row_to_json(p.*) INTO result FROM public.profiles p WHERE id = target_user_id;
        RETURN result;
      END;
      $$;

      -- Permissões de execução
      GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
      GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
      GRANT EXECUTE ON FUNCTION public.admin_update_profile(UUID, TEXT, TEXT, TEXT) TO authenticated;
      GRANT EXECUTE ON FUNCTION public.admin_update_profile(UUID, TEXT, TEXT, TEXT) TO service_role;

      -- Correção de RLS (Policies) na tabela Profiles
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

      -- Remove políticas antigas que podem estar conflitando
      DROP POLICY IF EXISTS "profiles_read_all_policy" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
      DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
      DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

      -- Política de Leitura: Admins veem tudo, usuários veem a si mesmos (ou tudo se for perfil público, ajustável)
      CREATE POLICY "profiles_read_all_policy" ON public.profiles
      FOR SELECT TO authenticated
      USING (true);

      -- Política de Update: O usuário pode editar a si mesmo, ou o Admin pode editar qualquer um
      CREATE POLICY "profiles_update_policy" ON public.profiles
      FOR UPDATE TO authenticated
      USING (id = auth.uid() OR public.is_admin())
      WITH CHECK (id = auth.uid() OR public.is_admin());
    `);

    await client.end();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Permissões de banco de dados corrigidas com sucesso!" 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Erro na Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});