-- Inserção direta do perfil de Admin para o ID específico
INSERT INTO public.profiles (id, first_name, last_name, role, status, plan, email)
VALUES (
  '4975ed96-8d71-433f-9d1d-8c81f4a3ce7c',
  'Nando',
  'Admin',
  'admin',
  'active',
  'premium',
  'nandorv3@gmail.com'
)
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin',
  status = 'active',
  plan = 'premium';

-- Garantir que as políticas de segurança permitam que este usuário funcione
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_read_all_policy" ON public.profiles;
CREATE POLICY "profiles_read_all_policy" ON public.profiles FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
CREATE POLICY "profiles_insert_policy" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());