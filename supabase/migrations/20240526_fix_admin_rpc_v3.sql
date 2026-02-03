-- Recriação forçada das funções administrativas com permissões de superusuário (SECURITY DEFINER)

-- 1. Remove versões anteriores para evitar conflitos
DROP FUNCTION IF EXISTS public.admin_update_profile(uuid, text, text, text);
DROP FUNCTION IF EXISTS public.is_admin();

-- 2. Cria função auxiliar is_admin
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

-- 3. Cria função de atualização de perfil administrativa
CREATE OR REPLACE FUNCTION public.admin_update_profile(
  target_user_id UUID,
  new_role TEXT,
  new_status TEXT,
  new_plan TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  -- Verificação de segurança
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Acesso negado: Apenas administradores.';
  END IF;

  -- Executa update ignorando RLS
  UPDATE public.profiles
  SET 
    role = new_role,
    status = new_status,
    plan = new_plan,
    access_expires_at = CASE 
      WHEN new_status = 'active' AND (access_expires_at IS NULL OR access_expires_at < NOW()) 
      THEN (NOW() + interval '1 year')
      ELSE access_expires_at
    END,
    plan_start_date = CASE 
      WHEN new_status = 'active' AND plan_start_date IS NULL
      THEN NOW()
      ELSE plan_start_date
    END,
    updated_at = NOW()
  WHERE id = target_user_id;

  -- Retorna o perfil atualizado
  SELECT row_to_json(p.*) INTO result FROM public.profiles p WHERE id = target_user_id;
  
  RETURN result;
END;
$$;

-- 4. Concede permissões de execução
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;
GRANT EXECUTE ON FUNCTION public.admin_update_profile(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_profile(UUID, TEXT, TEXT, TEXT) TO service_role;

-- 5. Atualiza Políticas RLS da tabela Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Garante que o admin possa ler tudo (para listar usuários)
DROP POLICY IF EXISTS "profiles_read_all_policy" ON public.profiles;
CREATE POLICY "profiles_read_all_policy" ON public.profiles
FOR SELECT TO authenticated
USING (true);

-- Garante que o admin possa atualizar via API direta se necessário (embora a RPC acima seja preferível)
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE TO authenticated
USING (id = auth.uid() OR public.is_admin())
WITH CHECK (id = auth.uid() OR public.is_admin());