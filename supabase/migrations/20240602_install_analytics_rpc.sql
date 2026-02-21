-- Função para instalar as tabelas de analytics via Frontend
CREATE OR REPLACE FUNCTION public.install_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- 1. Criar tabela access_logs
    CREATE TABLE IF NOT EXISTS public.access_logs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        path TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Habilitar RLS access_logs
    ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

    -- Políticas access_logs (Drop para evitar erro se já existir)
    DROP POLICY IF EXISTS "Users can insert their own logs" ON public.access_logs;
    CREATE POLICY "Users can insert their own logs" ON public.access_logs
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view all logs" ON public.access_logs;
    CREATE POLICY "Admins can view all logs" ON public.access_logs
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

    -- 2. Criar tabela daily_activity_time
    CREATE TABLE IF NOT EXISTS public.daily_activity_time (
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        activity_date DATE DEFAULT CURRENT_DATE,
        seconds INT DEFAULT 0,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (user_id, activity_date)
    );

    -- Habilitar RLS daily_activity_time
    ALTER TABLE public.daily_activity_time ENABLE ROW LEVEL SECURITY;

    -- Políticas daily_activity_time
    DROP POLICY IF EXISTS "Users can insert/update their own daily time" ON public.daily_activity_time;
    CREATE POLICY "Users can insert/update their own daily time" ON public.daily_activity_time
    FOR ALL TO authenticated USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Admins can view daily time" ON public.daily_activity_time;
    CREATE POLICY "Admins can view daily time" ON public.daily_activity_time
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

    -- 3. Função auxiliar de incremento (só atualiza se já existir a tabela)
    -- NOTA: Como a função increment_user_activity já existe ou será criada, 
    -- vamos recriá-la aqui para garantir que ela escreva na tabela diária.
END;
$$;

-- Recriar a função de incremento para garantir que ela preencha a tabela diária
CREATE OR REPLACE FUNCTION public.increment_user_activity(seconds_to_add integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Garante que a tabela existe antes de tentar inserir (evita erro em runtime se a install não rodou)
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'daily_activity_time') THEN
        INSERT INTO public.daily_activity_time (user_id, activity_date, seconds, updated_at)
        VALUES (auth.uid(), CURRENT_DATE, seconds_to_add, NOW())
        ON CONFLICT (user_id, activity_date)
        DO UPDATE SET 
            seconds = daily_activity_time.seconds + seconds_to_add,
            updated_at = NOW();
    END IF;

    -- Lógica antiga (Total Geral)
    INSERT INTO public.user_activity_time (user_id, total_seconds, last_active_at)
    VALUES (auth.uid(), seconds_to_add, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET 
        total_seconds = user_activity_time.total_seconds + seconds_to_add,
        last_active_at = NOW();
END;
$function$;