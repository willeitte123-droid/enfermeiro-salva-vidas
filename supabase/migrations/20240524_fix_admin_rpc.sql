-- 1. Garante novamente que seu usuário é admin
UPDATE public.profiles
SET role = 'admin'
FROM auth.users
WHERE profiles.id = auth.users.id
AND auth.users.email = 'willeitte123@gmail.com';

-- 2. Cria a função de atualização administrativa (SECURITY DEFINER = roda com poderes de superusuário)
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
  current_user_role TEXT;
  result JSON;
BEGIN
  -- Verifica a role do usuário que está CHAMANDO a função
  SELECT role INTO current_user_role
  FROM public.profiles
  WHERE id = auth.uid();

  -- Se não for admin, bloqueia
  IF current_user_role != 'admin' THEN
    RAISE EXCEPTION 'Acesso negado: Apenas administradores podem executar esta ação.';
  END IF;

  -- Executa a atualização ignorando RLS da tabela (pois é Security Definer)
  UPDATE public.profiles
  SET 
    role = new_role,
    status = new_status,
    plan = new_plan,
    -- Lógica de datas: Se ativando e data vencida/nula, dá 1 ano
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
  WHERE id = target_user_id
  RETURNING row_to_json(profiles.*) INTO result;

  IF result IS NULL THEN
     RAISE EXCEPTION 'Usuário não encontrado para atualização.';
  END IF;

  RETURN result;
END;
$$;

-- 3. Permite que usuários autenticados chamem a função (a verificação de admin é feita DENTRO dela)
GRANT EXECUTE ON FUNCTION public.admin_update_profile(UUID, TEXT, TEXT, TEXT) TO authenticated;