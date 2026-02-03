-- 1. Garante que AMBOS os usuários sejam admins e tenham perfis criados
DO $$
DECLARE
    user_email text;
    target_id uuid;
BEGIN
    FOREACH user_email IN ARRAY ARRAY['nandorv3@gmail.com', 'willeitte123@gmail.com']
    LOOP
        -- Busca ID
        SELECT id INTO target_id FROM auth.users WHERE email = user_email;
        
        IF target_id IS NOT NULL THEN
            -- Atualiza ou Cria Perfil como ADMIN
            INSERT INTO public.profiles (id, first_name, last_name, role, status, plan, updated_at)
            VALUES (
                target_id, 
                'Admin', 
                'User', 
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
                
            RAISE NOTICE 'Permissões de Admin aplicadas para: %', user_email;
        END IF;
    END LOOP;
END $$;

-- 2. Reescreve a função de atualização para IGNORAR RLS (Security Definer)
-- Isso resolve o problema do "sucesso falso". Agora a função tem poder total.
CREATE OR REPLACE FUNCTION public.admin_update_profile(
    target_user_id uuid, 
    new_role text, 
    new_status text, 
    new_plan text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- IMPORTANTE: Roda com permissões de superusuário
SET search_path = public -- Segurança
AS $$
DECLARE
    result JSON;
    caller_is_admin boolean;
BEGIN
    -- Verifica se quem chamou é admin (camada de segurança manual)
    SELECT (role = 'admin') INTO caller_is_admin 
    FROM public.profiles 
    WHERE id = auth.uid();

    IF caller_is_admin IS NOT TRUE THEN
        RAISE EXCEPTION 'Acesso negado: Você não é administrador.';
    END IF;

    -- Executa update
    UPDATE public.profiles
    SET 
        role = new_role,
        status = new_status,
        plan = new_plan,
        updated_at = NOW()
    WHERE id = target_user_id;

    -- Retorna os dados atualizados para confirmar que funcionou
    SELECT row_to_json(p.*) INTO result FROM public.profiles p WHERE id = target_user_id;
    
    RETURN result;
END;
$$;

-- 3. Cria uma política de segurança explícita para Admins editarem todos
-- Isso garante que Updates diretos (fora da função) também funcionem
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;

CREATE POLICY "Admins can update any profile" ON public.profiles
FOR UPDATE
TO authenticated
USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
)
WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
);