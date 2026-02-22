-- Atualiza a função de rastreamento de tempo para gravar também na tabela diária
CREATE OR REPLACE FUNCTION public.increment_user_activity(seconds_to_add integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    -- 1. Atualiza o tempo TOTAL (Acumulado histórico)
    INSERT INTO public.user_activity_time (user_id, total_seconds, last_active_at)
    VALUES (auth.uid(), seconds_to_add, NOW())
    ON CONFLICT (user_id)
    DO UPDATE SET 
        total_seconds = user_activity_time.total_seconds + seconds_to_add,
        last_active_at = NOW();

    -- 2. Atualiza o tempo DIÁRIO (Para gráficos e médias de hoje/ontem)
    INSERT INTO public.daily_activity_time (user_id, activity_date, seconds, updated_at)
    VALUES (auth.uid(), CURRENT_DATE, seconds_to_add, NOW())
    ON CONFLICT (user_id, activity_date)
    DO UPDATE SET 
        seconds = daily_activity_time.seconds + seconds_to_add,
        updated_at = NOW();
END;
$function$;