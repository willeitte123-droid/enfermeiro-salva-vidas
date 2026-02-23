-- Criação da tabela de progresso de casos clínicos se não existir
CREATE TABLE IF NOT EXISTS public.user_case_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    case_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, case_id)
);

-- Habilitar RLS
ALTER TABLE public.user_case_progress ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_case_progress' AND policyname = 'Users can view own case progress') THEN
        CREATE POLICY "Users can view own case progress" ON public.user_case_progress
            FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_case_progress' AND policyname = 'Users can insert own case progress') THEN
        CREATE POLICY "Users can insert own case progress" ON public.user_case_progress
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_case_progress' AND policyname = 'Users can update own case progress') THEN
        CREATE POLICY "Users can update own case progress" ON public.user_case_progress
            FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END
$$;