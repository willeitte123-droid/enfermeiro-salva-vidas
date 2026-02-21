-- Adiciona as tabelas de analytics à publicação do Supabase Realtime
-- Isso permite que o dashboard administrativo receba atualizações instantâneas
BEGIN;

  -- Verifica e adiciona access_logs se ainda não estiver
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'access_logs'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.access_logs;
    END IF;
  END
  $$;

  -- Verifica e adiciona daily_activity_time se ainda não estiver
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'daily_activity_time'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_activity_time;
    END IF;
  END
  $$;

COMMIT;