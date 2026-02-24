CREATE OR REPLACE FUNCTION public.increment_daily_activity(seconds_to_add integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.daily_activity_time (user_id, activity_date, seconds, updated_at)
    VALUES (auth.uid(), CURRENT_DATE, seconds_to_add, NOW())
    ON CONFLICT (user_id, activity_date)
    DO UPDATE SET 
        seconds = daily_activity_time.seconds + seconds_to_add,
        updated_at = NOW();
END;
$$;