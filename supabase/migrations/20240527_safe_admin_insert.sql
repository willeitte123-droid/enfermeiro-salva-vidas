-- Inserção segura respeitando as colunas existentes
-- Removemos a coluna 'email' deste comando para evitar o erro anterior

INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    role,
    status,
    plan,
    updated_at
)
VALUES (
    '4975ed96-8d71-433f-9d1d-8c81f4a3ce7c', -- Seu ID
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

-- Garante que a política de segurança (RLS) permita você ler seu próprio perfil
-- Caso a política esteja restrita demais
DROP POLICY IF EXISTS "Enable all access for admin users" ON public.profiles;
CREATE POLICY "Enable all access for admin users" ON public.profiles
    FOR ALL
    TO authenticated
    USING (auth.uid() = id OR role = 'admin')
    WITH CHECK (auth.uid() = id OR role = 'admin');