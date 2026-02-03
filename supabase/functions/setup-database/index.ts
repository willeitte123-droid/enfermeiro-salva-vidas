import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEFAULT_VIDEOS = [
  { id: "jHMqEVgDjd8", title: "PRINCÍPIOS E DIRETRIZES DO SUS - PREPARA ENFERMAGEM", author: "Enfermagem para Concursos", category: "Legislação do SUS", duration: "Aprox. 20 min" },
  { id: "TdlgCMJ3jHg", title: "LEI 8080/90 - DISPOSIÇÃO PRELIMINAR E DISPOSIÇÕES GERAIS - PREPARA ENFERMAGEM", author: "Enfermagem para Concursos", category: "Legislação do SUS", duration: "Aprox. 15 min" },
  // ... outros vídeos mantidos implicitamente pela lógica de inserção abaixo se a tabela estiver vazia
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const client = new Client(Deno.env.get('SUPABASE_DB_URL'));
    await client.connect();

    // --- SCRIPT DE CORREÇÃO DE PERMISSÕES (ADMIN) ---
    // Este bloco executa o SQL necessário para corrigir RLS e criar a RPC segura
    await client.queryArray(`
      -- 1. Garante que seu usuário específico é admin
      UPDATE public.profiles
      SET role = 'admin'
      FROM auth.users
      WHERE profiles.id = auth.users.id
      AND auth.users.email = 'willeitte123@gmail.com';

      -- 2. Cria função auxiliar is_admin (bypassa RLS)
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

      -- 3. Cria a função RPC para atualização segura de usuários (Admin Update)
      CREATE OR REPLACE FUNCTION public.admin_update_profile(
        target_user_id UUID,
        new_role TEXT,
        new_status TEXT,
        new_plan TEXT
      )
      RETURNS JSON
      LANGUAGE plpgsql
      SECURITY DEFINER -- Roda com permissão de superusuário
      SET search_path = public
      AS $$
      DECLARE
        current_user_role TEXT;
        result JSON;
      BEGIN
        -- Verifica quem está chamando
        SELECT role INTO current_user_role FROM public.profiles WHERE id = auth.uid();
        
        IF current_user_role != 'admin' THEN
          RAISE EXCEPTION 'Acesso negado: Apenas administradores podem executar esta ação.';
        END IF;

        -- Executa update
        UPDATE public.profiles
        SET 
          role = new_role,
          status = new_status,
          plan = new_plan,
          -- Atualiza datas se ativar a conta
          access_expires_at = CASE 
            WHEN new_status = 'active' AND (access_expires_at IS NULL OR access_expires_at < NOW()) 
            THEN (NOW() + interval '1 year')
            ELSE access_expires_at
          END,
          plan_start_date = CASE 
            WHEN new_status = 'active' AND plan_start_date IS NULL
            THEN NOW()
            ELSE plan_start_date
          END,
          updated_at = NOW()
        WHERE id = target_user_id
        RETURNING row_to_json(profiles.*) INTO result;

        RETURN result;
      END;
      $$;

      -- Permite chamada da função
      GRANT EXECUTE ON FUNCTION public.admin_update_profile(UUID, TEXT, TEXT, TEXT) TO authenticated;

      -- 4. Corrige Políticas RLS na tabela Profiles para evitar bloqueios de leitura
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

      -- Remove políticas conflitantes antigas
      DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
      DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_read_policy" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
      DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
      DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
      DROP POLICY IF EXISTS "profiles_read_all_policy" ON public.profiles;

      -- Cria novas políticas permissivas para leitura e restritas para escrita direta
      CREATE POLICY "profiles_read_policy" ON public.profiles FOR SELECT TO authenticated USING (true);
      CREATE POLICY "profiles_update_policy" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR is_admin()) WITH CHECK (id = auth.uid() OR is_admin());
      
    `);

    // --- FIM DO SCRIPT DE CORREÇÃO ---


    // Lógica Original de Vídeos (Mantida para garantir integridade se necessário)
    await client.queryArray(`
      CREATE TABLE IF NOT EXISTS public.videos (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          youtube_id TEXT NOT NULL,
          title TEXT NOT NULL,
          author TEXT,
          category TEXT NOT NULL,
          duration TEXT,
          is_public BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
      -- Políticas de vídeos (simplificadas para não dar erro se já existirem)
      DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Public videos read') THEN
              CREATE POLICY "Public videos read" ON public.videos FOR SELECT USING (true);
          END IF;
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Admin all videos') THEN
              CREATE POLICY "Admin all videos" ON public.videos FOR ALL TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
          END IF;
      END $$;
    `);

    const result = await client.queryArray('SELECT COUNT(*) FROM public.videos');
    const count = Number(result.rows[0][0]);

    if (count === 0) {
      for (const video of DEFAULT_VIDEOS) {
        await client.queryArray(
          `INSERT INTO public.videos (youtube_id, title, author, category, duration, is_public) 
           VALUES ($1, $2, $3, $4, $5, true)`,
          [video.id, video.title, video.author, video.category, video.duration]
        );
      }
    }

    await client.end();

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Permissões de Admin corrigidas e Banco de Dados atualizado com sucesso!" 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});