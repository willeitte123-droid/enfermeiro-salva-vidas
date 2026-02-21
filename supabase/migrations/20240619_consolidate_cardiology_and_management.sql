-- Consolidação final das categorias de Cardiologia e Gerenciamento.

-- 1. Mover questões de emergência cardiológica para "Urgência e Emergência"
UPDATE public.questions
SET category = 'Urgência e Emergência'
WHERE category ILIKE 'Cardiologia e Emergência';

-- 2. Mover as demais questões de cardiologia e ECG para "Saúde do Adulto"
UPDATE public.questions
SET category = 'Saúde do Adulto'
WHERE category ILIKE 'Cardiologia e ECG'
   OR category ILIKE 'ECG'
   OR category ILIKE 'Cardiologia';

-- 3. Unificar todas as variações de Gerenciamento em "Administração em Enfermagem"
UPDATE public.questions
SET category = 'Administração em Enfermagem'
WHERE category ILIKE 'Legislação e Gerenciamento'
   OR category ILIKE 'Gerenciamento';