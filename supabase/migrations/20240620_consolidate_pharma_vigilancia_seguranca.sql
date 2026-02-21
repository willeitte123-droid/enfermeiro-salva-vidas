-- Consolidação final das categorias de Farmacologia, Vigilância e Segurança do Paciente.

-- 1. Unificar todas as variações de Farmacologia em "Farmacologia e Cálculos"
UPDATE public.questions
SET category = 'Farmacologia e Cálculos'
WHERE category ILIKE 'Farmacologia e Alta Vigilância'
   OR category ILIKE 'Farmacologia e Segurança do Paciente';

-- 2. Unificar todas as variações de Vigilância em "Saúde Pública e Imunização"
UPDATE public.questions
SET category = 'Saúde Pública e Imunização'
WHERE category ILIKE 'Vigilância Epidemiológica'
   OR category ILIKE 'Vigilância Sanitária';

-- 3. Unificar "Segurança do Paciente" em "Administração em Enfermagem"
UPDATE public.questions
SET category = 'Administração em Enfermagem'
WHERE category ILIKE 'Segurança do Paciente';