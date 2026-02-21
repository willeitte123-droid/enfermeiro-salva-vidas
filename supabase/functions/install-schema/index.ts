import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Client } from 'https://deno.land/x/postgres@v0.17.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const INSTALL_SQL = `
-- 1. Tabela para registrar visualização de página
CREATE TABLE IF NOT EXISTS public.access_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'access_logs' AND policyname = 'Users can insert their own logs') THEN
        CREATE POLICY "Users can insert their own logs" ON public.access_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'access_logs' AND policyname = 'Admins can view all logs') THEN
        CREATE POLICY "Admins can view all logs" ON public.access_logs FOR SELECT TO authenticated USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END
$$;

-- 2. Tabela para registrar tempo diário
CREATE TABLE IF NOT EXISTS public.daily_activity_time (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE DEFAULT CURRENT_DATE,
    seconds INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, activity_date)
);

ALTER TABLE public.daily_activity_time ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_activity_time' AND policyname = 'Users can insert/update their own daily time') THEN
        CREATE POLICY "Users can insert/update their own daily time" ON public.daily_activity_time FOR ALL TO authenticated USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'daily_activity_time' AND policyname = 'Admins can view daily time') THEN
        CREATE POLICY "Admins can view daily time" ON public.daily_activity_time FOR SELECT TO authenticated USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END
$$;

-- 3. Função de instalação (Stub para evitar erros futuros no frontend se chamado)
CREATE OR REPLACE FUNCTION public.install_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $func$
BEGIN
   -- Tables already created directly
   RETURN; 
END;
$func$;
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const dbUrl = Deno.env.get('SUPABASE_DB_URL');
    if (!dbUrl) throw new Error('SUPABASE_DB_URL not found');

    const client = new Client(dbUrl);
    await client.connect();

    await client.queryArray(INSTALL_SQL);
    await client.end();

    return new Response(JSON.stringify({ success: true, message: "Tabelas criadas com sucesso!" }), {
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