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
    const client = new Client(Deno.env.get('SUPABASE_DB_URL'));
    await client.connect();

    // ID do usuário fornecido
    const TARGET_USER_ID = '4975ed96-8d71-433f-9d1d-8c81f4a3ce7c';

    await client.queryArray(`
      -- 1. Garante que as funções de admin existam
      CREATE OR REPLACE FUNCTION public.is_admin()
      RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
      BEGIN
        RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
      END;
      $$;

      -- 2. Correção de RLS para permitir leitura/escrita correta
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      
      DROP POLICY IF EXISTS "profiles_read_all_policy" ON public.profiles;
      CREATE POLICY "profiles_read_all_policy" ON public.profiles FOR SELECT TO authenticated USING (true);

      DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
      CREATE POLICY "profiles_update_policy" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR public.is_admin());

      DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
      CREATE POLICY "profiles_insert_policy" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

      -- 3. INSERÇÃO FORÇADA DO PERFIL DO NANDO (O PULO DO GATO)
      INSERT INTO public.profiles (id, first_name, last_name, role, status, plan, email)
      VALUES (
        '${TARGET_USER_ID}',
        'Nando',
        'Admin',
        'admin',
        'active',
        'premium',
        'nandorv3@gmail.com'
      )
      ON CONFLICT (id) DO UPDATE
      SET 
        role = 'admin',
        status = 'active',
        plan = 'premium';
    `);

    await client.end();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Perfil de Admin criado/reparado com sucesso!" 
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 });
  }
});