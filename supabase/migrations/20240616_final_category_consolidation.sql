-- Consolidação final de categorias com nomes parecidos, conforme feedback.

-- 1. Unificar todas as variações de SAE em "Fundamentos e SAE"
UPDATE public.questions
SET category = 'Fundamentos e SAE'
WHERE category ILIKE 'Sistematização (SAE)' OR category ILIKE 'SAE';

-- 2. Unificar "Princípios do SUS" em "Legislação do SUS"
UPDATE public.questions
SET category = 'Legislação do SUS'
WHERE category ILIKE 'Princípios do SUS';

-- 3. Unificar todas as variações de UTI em "Terapia Intensiva (UTI)"
UPDATE public.questions
SET category = 'Terapia Intensiva (UTI)'
WHERE category ILIKE 'UTI e Paciente Crítico'
   OR category ILIKE 'UTI Terapia Intensiva (UTI)'
   OR category ILIKE 'Paciente Crítico';

-- 4. Unificar "Emergência" em "Urgência e Emergência"
UPDATE public.questions
SET category = 'Urgência e Emergência'
WHERE category ILIKE 'Emergência';

-- 5. Bônus: Unificar "Farmacologia" em "Farmacologia e Cálculos" para consistência
UPDATE public.questions
SET category = 'Farmacologia e Cálculos'
WHERE category ILIKE 'Farmacologia';