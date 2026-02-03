-- 1. Cria a coluna email se ela não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;
END $$;

-- 2. Insere/Atualiza o perfil Admin com permissão total
INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    role,
    status,
    plan,
    email,
    updated_at
)
VALUES (
    '4975ed96-8d71-433f-9d1d-8c81f4a3ce7c',
    'Nando',
    'Admin',
    'admin',
    'active',
    'premium',
    'nandorv3@gmail.com',
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    status = 'active',
    plan = 'premium',
    email = 'nandorv3@gmail.com',
    updated_at = NOW();