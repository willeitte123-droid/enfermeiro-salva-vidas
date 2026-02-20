-- 1. Tabela para registrar cada visualização de página (Hits)
CREATE TABLE IF NOT EXISTS public.access_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS para access_logs
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own logs" ON public.access_logs
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all logs" ON public.access_logs
FOR SELECT TO authenticated USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 2. Tabela para registrar tempo diário (Daily Active Time)
CREATE TABLE IF NOT EXISTS public.daily_activity_time (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE DEFAULT CURRENT_DATE,
    seconds INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, activity_date)
);

-- RLS para daily_activity_time
ALTER TABLE public.daily_activity_time ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert/update their own daily time" ON public.daily_activity_time
FOR ALL TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can view daily time" ON public.daily_activity_time
FOR SELECT TO authenticated USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 3. Atualizar a função de incremento de tempo para salvar no histórico diário também
CREATE OR REPLACE FUNCTION public.increment_user_activity(seconds_to_add integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- Atualiza o total geral (existente)
    INSERT INTO public.user_activity_time (user_id, total_seconds, last_active_at)
    VALUES (auth.uid(), seconds_to_add, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET 
        total_seconds = user_activity_time.total_seconds + seconds_to_add,
        last_active_at = NOW();

    -- Atualiza o histórico diário (novo)
    INSERT INTO public.daily_activity_time (user_id, activity_date, seconds, updated_at)
    VALUES (auth.uid(), CURRENT_DATE, seconds_to_add, NOW())
    ON CONFLICT (user_id, activity_date)
    DO UPDATE SET 
        seconds = daily_activity_time.seconds + seconds_to_add,
        updated_at = NOW();
END;
$function$;