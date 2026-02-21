-- Consolidação final das categorias de Vigilância em Saúde e Clínica Médica.

-- 1. Unificar "Vigilância em Saúde" em "Saúde Pública e Imunização"
UPDATE public.questions
SET category = 'Saúde Pública e Imunização'
WHERE category ILIKE 'Vigilância em Saúde';

-- 2. Unificar "Clínica Médica" e "Clínica Médica e Cirúrgica" em "Saúde do Adulto"
UPDATE public.questions
SET category = 'Saúde do Adulto'
WHERE category ILIKE 'Clínica Médica'
   OR category ILIKE 'Clínica Médica e Cirúrgica';