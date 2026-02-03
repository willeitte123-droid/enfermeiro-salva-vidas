-- 1. Função auxiliar para verificar se é admin (com bypass de RLS)
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

-- Permissão de execução para usuários autenticados
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2. Recria a função de atualização administrativa (SECURITY DEFINER é a chave aqui)
DROP FUNCTION IF EXISTS public.admin_update_profile(uuid, text, text, text);

CREATE OR REPLACE FUNCTION public.admin_update_profile(
  target_user_id UUID,
  new_role TEXT,
  new_status TEXT,
  new_plan TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Executa com privilégios de superusuário do banco
SET search_path = public
AS $$
DECLARE
  current_user_role TEXT;
  result JSON;
BEGIN
  -- Verifica se quem está chamando a função é realmente um admin
  SELECT role INTO current_user_role FROM public.profiles WHERE id = auth.uid();
  
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Acesso negado: Apenas administradores podem executar esta ação.';
  END IF;

  -- Executa o update ignorando as políticas RLS da tabela (pois é SECURITY DEFINER)
  UPDATE public.profiles
  SET 
    role = new_role,
    status = new_status,
    plan = new_plan,
    -- Atualiza expiração apenas se a conta estiver sendo ativada
    access_expires_at = CASE 
      WHEN new_status = 'active' AND (access_expires_at IS NULL OR access_expires_at < NOW()) 
      THEN (NOW() + interval '1 year')
      ELSE access_expires_at
    END,
    -- Define data de início se não existir e estiver ativando
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

-- Permissão de execução
GRANT EXECUTE ON FUNCTION public.admin_update_profile(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- 3. Atualização das Políticas de Segurança (RLS) da tabela Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove política antiga restritiva se existir
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- Cria nova política que permite explicitamente que admins façam UPDATE via API direta também
CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE TO authenticated
USING (id = auth.uid() OR is_admin())
WITH CHECK (id = auth.uid() OR is_admin());