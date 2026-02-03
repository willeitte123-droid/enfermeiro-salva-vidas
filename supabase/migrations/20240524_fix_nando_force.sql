-- Força a atualização do usuário nandorv3@gmail.com
-- Vincula com a tabela auth.users para garantir que estamos pegando o ID correto
UPDATE public.profiles
SET 
  status = 'active',
  plan = 'Plano Pro anual',
  access_expires_at = (now() + interval '1 year'),
  plan_start_date = now()
FROM auth.users
WHERE profiles.id = auth.users.id 
  AND auth.users.email = 'nandorv3@gmail.com';

-- Garantia de RLS para Admins (caso a política existente esteja falhando)
-- Removemos políticas antigas conflitantes se necessário e recriamos a permissão de UPDATE total para admins
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);