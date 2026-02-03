-- 1. Forçar Role de Admin para o seu usuário (Garantia)
UPDATE public.profiles
SET role = 'admin'
FROM auth.users
WHERE profiles.id = auth.users.id
AND auth.users.email = 'willeitte123@gmail.com';

-- 2. Derrubar função antiga para recriar limpa
DROP FUNCTION IF EXISTS public.admin_update_profile;

-- 3. Criar a função RPC Robusta
CREATE OR REPLACE FUNCTION public.admin_update_profile(
  target_user_id UUID,
  new_role TEXT,
  new_status TEXT,
  new_plan TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Roda com permissões de admin do banco
SET search_path = public
AS $$
DECLARE
  caller_role TEXT;
  updated_row JSON;
  row_count INT;
BEGIN
  -- Verificar se quem chama é admin
  SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  
  IF caller_role IS DISTINCT FROM 'admin' THEN
    RAISE EXCEPTION 'Acesso negado. Você não é administrador.';
  END IF;

  -- Executar o Update
  UPDATE public.profiles
  SET 
    role = new_role,
    status = new_status,
    plan = new_plan,
    updated_at = NOW()
  WHERE id = target_user_id
  RETURNING row_to_json(profiles.*) INTO updated_row;

  -- Verificar se algo foi realmente alterado
  GET DIAGNOSTICS row_count = ROW_COUNT;
  
  IF row_count = 0 THEN
    RAISE EXCEPTION 'Erro: Usuário não encontrado ou a atualização falhou silenciosamente.';
  END IF;

  RETURN updated_row;
END;
$$;

-- 4. Garantir permissões de execução
GRANT EXECUTE ON FUNCTION public.admin_update_profile(UUID, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_profile(UUID, TEXT, TEXT, TEXT) TO service_role;

-- 5. Garantir que as políticas RLS permitam leitura
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política de leitura irrestrita para usuários autenticados (necessário para o admin ler antes de editar)
DROP POLICY IF EXISTS "profiles_read_policy" ON public.profiles;
CREATE POLICY "profiles_read_policy" ON public.profiles FOR SELECT TO authenticated USING (true);