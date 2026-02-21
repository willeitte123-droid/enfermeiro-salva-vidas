-- Script para consolidar e padronizar as categorias de questões,
-- eliminando duplicatas e nomes similares para melhorar a experiência de filtragem.

-- 1. Unifica todas as variações de "Feridas e Curativos"
UPDATE public.questions
SET category = 'Feridas e Curativos'
WHERE category IN ('Tratamento de Feridas', 'Curativos e Tratamento de Feridas', 'Curativos', 'Wound Care');

-- 2. Unifica "Centro Cirúrgico" e "CME"
UPDATE public.questions
SET category = 'Centro Cirúrgico e CME'
WHERE category IN ('Centro Cirúrgico', 'CME');

-- 3. Padroniza "Ética e Legislação"
UPDATE public.questions
SET category = 'Ética e Legislação Profissional'
WHERE category IN ('Ética', 'Ética e Legislação');

-- 4. Move "Obstetrícia" para "Saúde da Mulher"
UPDATE public.questions
SET category = 'Saúde da Mulher'
WHERE category = 'Obstetrícia';

-- 5. Padroniza "Urgência e Emergência"
UPDATE public.questions
SET category = 'Urgência e Emergência'
WHERE category = 'Emergências';

-- 6. Padroniza "Legislação do SUS"
UPDATE public.questions
SET category = 'Legislação do SUS'
WHERE category = 'SUS';

-- 7. Padroniza "Saúde do Adulto"
UPDATE public.questions
SET category = 'Saúde do Adulto'
WHERE category = 'Saúde do Adulto (Clínica Médica)';

-- 8. Padroniza "Biossegurança"
UPDATE public.questions
SET category = 'Biossegurança e Controle de Infecção'
WHERE category = 'Biossegurança';