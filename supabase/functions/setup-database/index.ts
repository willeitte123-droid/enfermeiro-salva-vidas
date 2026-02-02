import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEFAULT_VIDEOS = [
  { id: "jHMqEVgDjd8", title: "PRINCÍPIOS E DIRETRIZES DO SUS - PREPARA ENFERMAGEM", author: "Enfermagem para Concursos", category: "Legislação do SUS", duration: "Aprox. 20 min" },
  { id: "TdlgCMJ3jHg", title: "LEI 8080/90 - DISPOSIÇÃO PRELIMINAR E DISPOSIÇÕES GERAIS - PREPARA ENFERMAGEM", author: "Enfermagem para Concursos", category: "Legislação do SUS", duration: "Aprox. 15 min" },
  { id: "76qaxgE2jK4", title: "LEI 8080/90 - OBJETIVOS E ATRIBUIÇÕES - PREPARA ENFERMAGEM", author: "Enfermagem para Concursos", category: "Legislação do SUS", duration: "Aprox. 12 min" },
  { id: "EI4IOCGh4ZU", title: "LEI 8080/90 - PRINCÍPIOS E DIRETRIZES - PREPARA ENFERMAGEM", author: "Enfermagem para Concursos", category: "Legislação do SUS", duration: "Aprox. 18 min" },
  { id: "DC1EEaXzJWY", title: "LEI 8142/90 - PREPARA ENFERMAGEM", author: "Enfermagem para Concursos", category: "Legislação do SUS", duration: "Aprox. 10 min" },
  { id: "3d-l0vl4oGs", title: "PNAB - Política Nacional de Atenção Básica (Portaria 2.436/2017) - Parte 1", author: "Prof. Especialista", category: "Saúde Pública", duration: "Aprox. 25 min" },
  { id: "5LyJQ2Q1UIY", title: "SAE - Sistematização da Assistência de Enfermagem - Resolução 358/2009 COFEN", author: "Prof. Especialista", category: "Fundamentos e SAE", duration: "Aprox. 20 min" },
  { id: "Hi_doaILEUk", title: "SAÚDE DA MULHER - POLÍTICA NACIONAL DE ATENÇÃO INTEGRAL À SAÚDE DA MULHER - PNAISM", author: "Prof. Especialista", category: "Saúde da Mulher", duration: "Aprox. 22 min" },
  { id: "xhPQbBu7YE0", title: "Central de Material e Esterilização - CME - RDC 15/2012 - Parte 1", author: "Prof. Especialista", category: "Biossegurança e CME", duration: "Aprox. 15 min" },
  { id: "obYQqvphdYY", title: "Central de Material e Esterilização - CME - RDC 15/2012 - Parte 2", author: "Prof. Especialista", category: "Biossegurança e CME", duration: "Aprox. 14 min" },
  { id: "JYcU8Uz65T8", title: "COMO MEDIR A PRESSÃO ARTERIAL? APRENDA A AFERIR A PRESSÃO ARTERIAL DA FORMA CERTA!", author: "Procedimentos de Enfermagem", category: "Procedimentos de enfermagem", duration: "Aprox. 12 min" },
  { id: "u56wwAPzt3E", title: "Passagem de sonda nasogástrica", author: "Procedimentos de Enfermagem", category: "Procedimentos de enfermagem", duration: "Aprox. 8 min" },
  { id: "bDfDvhCeYAU", title: "Aspiração de vias aéreas superiores", author: "Procedimentos de Enfermagem", category: "Procedimentos de enfermagem", duration: "Aprox. 10 min" },
  { id: "DYbVe-MNcuA", title: "Alimentação por sonda enteral", author: "Procedimentos de Enfermagem", category: "Procedimentos de enfermagem", duration: "Aprox. 6 min" },
  { id: "_RGZSo6lNjg", title: "Administração de Medicação Intramuscular", author: "Procedimentos de Enfermagem", category: "Procedimentos de enfermagem", duration: "Aprox. 8 min" },
  { id: "U4o5SG3-Kis", title: "Como RECONSTITUIR e DILUIR Medicamentos | Aula Prática (Atualizado 2025)", author: "Procedimentos de Enfermagem", category: "Procedimentos de enfermagem", duration: "Aprox. 10 min" }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const client = new Client(Deno.env.get('SUPABASE_DB_URL'));
    await client.connect();

    // 1. Criar Tabela se não existir
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

    // 2. Verificar quantos vídeos existem
    const result = await client.queryArray('SELECT COUNT(*) FROM public.videos');
    const count = Number(result.rows[0][0]);

    // 3. Se estiver vazia, inserir os vídeos padrão
    let insertedCount = 0;
    if (count === 0) {
      for (const video of DEFAULT_VIDEOS) {
        await client.queryArray(
          `INSERT INTO public.videos (youtube_id, title, author, category, duration, is_public) 
           VALUES ($1, $2, $3, $4, $5, true)`,
          [video.id, video.title, video.author, video.category, video.duration]
        );
        insertedCount++;
      }
    }

    await client.end();

    return new Response(JSON.stringify({ 
      success: true, 
      message: count === 0 ? `Banco de dados criado e ${insertedCount} vídeos restaurados com sucesso!` : `Banco de dados configurado. Já existem ${count} vídeos.` 
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