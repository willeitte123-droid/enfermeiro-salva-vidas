-- 1. Garante que o usuário willeitte123@gmail.com é admin
UPDATE public.profiles
SET role = 'admin'
FROM auth.users
WHERE profiles.id = auth.users.id
AND auth.users.email = 'willeitte123@gmail.com';

-- 2. Cria função de verificação de admin segura (bypassa RLS para checar a role)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER -- Roda com permissão de superusuário
SET search_path = public
AS $$
BEGIN
  -- Verifica se o usuário atual tem a role 'admin' na tabela profiles
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;

-- 3. Limpeza de políticas antigas (para evitar conflitos)
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_all_policy" ON public.profiles;

-- 4. Criar Política de LEITURA (SELECT)
-- Admins veem tudo. Usuários veem todos (necessário para ranking) ou apenas o seu.
-- Aqui deixaremos permissivo para leitura para garantir que o admin consiga ler o retorno do update.
CREATE POLICY "profiles_read_policy" ON public.profiles
FOR SELECT TO authenticated
USING ( true );

-- 5. Criar Política de ATUALIZAÇÃO (UPDATE)
-- O usuário pode editar a si mesmo. O Admin pode editar qualquer um.
CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE TO authenticated
USING ( 
  id = auth.uid() OR is_admin() 
)
WITH CHECK ( 
  id = auth.uid() OR is_admin() 
);

-- 6. Política de INSERÇÃO (INSERT) - Apenas sistema ou via trigger de auth, mas admin pode precisar
CREATE POLICY "profiles_insert_policy" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK ( 
  id = auth.uid() OR is_admin() 
);