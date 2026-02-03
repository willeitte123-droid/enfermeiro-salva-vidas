-- Migração para corrigir acesso do usuário nandorv3@gmail.com
-- Força o status para ativo e o plano para Pro Anual com validade de 1 ano

UPDATE public.profiles
SET 
  status = 'active',
  plan = 'Plano Pro anual',
  access_expires_at = (now() + interval '1 year'),
  plan_start_date = now()
FROM auth.users
WHERE profiles.id = auth.users.id 
  AND auth.users.email = 'nandorv3@gmail.com';