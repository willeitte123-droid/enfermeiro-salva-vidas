-- Consolidação final de categorias de especialidades clínicas, procedimentos e políticas de saúde.

-- 1. Unificar especialidades clínicas em "Saúde do Adulto"
UPDATE public.questions
SET category = 'Saúde do Adulto'
WHERE category ILIKE 'Nefrologia'
   OR category ILIKE 'Oncologia'
   OR category ILIKE 'Neurologia'
   OR category ILIKE 'Cuidados Paliativos'
   OR category ILIKE 'Hemoterapia'
   OR category ILIKE 'Nutrição Clínica';

-- 2. Unificar "Procedimentos" e "Fundamentos" em "Fundamentos de Enfermagem"
UPDATE public.questions
SET category = 'Fundamentos de Enfermagem'
WHERE category ILIKE 'Procedimentos'
   OR category ILIKE 'Fundamentos';

-- 3. Unificar "Políticas de Saúde (SUS)" em "Legislação do SUS"
UPDATE public.questions
SET category = 'Legislação do SUS'
WHERE category ILIKE 'Políticas de Saúde (SUS)';