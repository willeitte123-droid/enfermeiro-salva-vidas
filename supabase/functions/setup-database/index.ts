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
    // Conecta diretamente ao Postgres usando a variável de ambiente do Supabase
    const client = new Client(Deno.env.get('SUPABASE_DB_URL'));
    await client.connect();

    // Executa o SQL para criar a tabela e as políticas
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
      
      -- Políticas de Segurança (RLS) - Bloco DO para evitar erros se já existirem
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Public videos are viewable by everyone') THEN
              CREATE POLICY "Public videos are viewable by everyone" ON public.videos FOR SELECT USING (is_public = true);
          END IF;

          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Admins can view all videos') THEN
              CREATE POLICY "Admins can view all videos" ON public.videos FOR SELECT TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Admins can insert videos') THEN
              CREATE POLICY "Admins can insert videos" ON public.videos FOR INSERT TO authenticated WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
          END IF;

          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Admins can update videos') THEN
              CREATE POLICY "Admins can update videos" ON public.videos FOR UPDATE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
          END IF;

          IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'videos' AND policyname = 'Admins can delete videos') THEN
              CREATE POLICY "Admins can delete videos" ON public.videos FOR DELETE TO authenticated USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');
          END IF;
      END
      $$;
    `);

    await client.end();

    return new Response(JSON.stringify({ success: true, message: "Tabela de vídeos configurada com sucesso!" }), {
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