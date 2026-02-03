-- INSERÇÃO DIRETA E FORÇADA DO PERFIL
-- Isso vai criar a linha na tabela profiles para o seu ID de usuário
INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    status,
    plan,
    updated_at
)
VALUES (
    '4975ed96-8d71-433f-9d1d-8c81f4a3ce7c',
    'nandorv3@gmail.com',
    'Nando',
    'Admin',
    'admin',
    'active',
    'premium',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    status = 'active',
    plan = 'premium',
    updated_at = NOW();

-- LIBERAÇÃO TOTAL DE ACESSO (Temporária para garantir que você entre)
-- Cria uma política que permite tudo na tabela profiles para destravar o login
DROP POLICY IF EXISTS "emergency_admin_access" ON public.profiles;
CREATE POLICY "emergency_admin_access" ON public.profiles
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);