-- 1. Garante que o usuário willeitte123@gmail.com é admin
UPDATE public.profiles
SET role = 'admin'
FROM auth.users
WHERE profiles.id = auth.users.id
AND auth.users.email = 'willeitte123@gmail.com';

-- 2. Cria uma função segura para verificar se é admin
-- SECURITY DEFINER garante que a função rode com permissão máxima, evitando bloqueios
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$;

-- 3. Atualiza a política de segurança da tabela profiles
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (
  is_admin() OR auth.uid() = id
);