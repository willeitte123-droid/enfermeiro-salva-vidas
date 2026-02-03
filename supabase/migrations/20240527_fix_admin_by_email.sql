-- Bloco anônimo para buscar o ID correto e atualizar
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- 1. Busca o ID na tabela de autenticação (auth.users) pelo email
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'nandorv3@gmail.com';

    -- 2. Se encontrou o usuário, aplica o Admin no perfil
    IF target_user_id IS NOT NULL THEN
        -- Tenta atualizar se já existir
        UPDATE public.profiles
        SET 
            role = 'admin',
            status = 'active',
            plan = 'premium',
            updated_at = NOW()
        WHERE id = target_user_id;

        -- Se não atualizou nenhuma linha (perfil não existia), insere um novo
        IF NOT FOUND THEN
            INSERT INTO public.profiles (id, first_name, last_name, role, status, plan, updated_at)
            VALUES (target_user_id, 'Nando', 'Admin', 'admin', 'active', 'premium', NOW());
        END IF;

        RAISE NOTICE 'Sucesso: Usuário % (ID %) agora é Admin.', 'nandorv3@gmail.com', target_user_id;
    ELSE
        RAISE NOTICE 'Erro: Email nandorv3@gmail.com não encontrado na tabela de usuários.';
    END IF;
END $$;