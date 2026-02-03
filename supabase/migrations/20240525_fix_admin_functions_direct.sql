-- Recriar função auxiliar de verificação de admin
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

-- Conceder permissão de execução
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Recriar função de atualização de perfil administrativa (com bypass de RLS)
CREATE OR REPLACE FUNCTION public.admin_update_profile(
  target_user_id UUID,
  new_role TEXT,
  new_status TEXT,
  new_plan TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Garante que execute com permissões de superusuário
SET search_path = public
AS $$
DECLARE
  current_user_role TEXT;
  result JSON;
BEGIN
  -- Verifica permissão do usuário atual
  SELECT role INTO current_user_role FROM public.profiles WHERE id = auth.uid();
  
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Acesso negado: Apenas administradores podem executar esta ação.';
  END IF;

  -- Executa a atualização
  UPDATE public.profiles
  SET 
    role = new_role,
    status = new_status,
    plan = new_plan,
    -- Atualiza expiração se ativado
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

-- Conceder permissão de execução
GRANT EXECUTE ON FUNCTION public.admin_update_profile(UUID, TEXT, TEXT, TEXT) TO authenticated;

-- Reforçar políticas RLS para garantir que admins não sejam bloqueados
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- Criar política de atualização que permite explicitamente admins
CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE TO authenticated
USING (id = auth.uid() OR is_admin())
WITH CHECK (id = auth.uid() OR is_admin());