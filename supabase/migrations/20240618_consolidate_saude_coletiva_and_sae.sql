-- Passagem final de consolidação de categorias, com base no feedback preciso do usuário.

-- 1. Unificar todas as variações de Saúde Coletiva em "Saúde Pública e Imunização"
UPDATE public.questions
SET category = 'Saúde Pública e Imunização'
WHERE category ILIKE 'Saúde Coletiva'
   OR category ILIKE 'Saúde Coletiva e SUS';

-- 2. Unificar todas as variações de SAE em "Fundamentos e SAE"
UPDATE public.questions
SET category = 'Fundamentos e SAE'
WHERE category ILIKE 'SAE e Processo de Enfermagem'
   OR category ILIKE 'Sistematização da Assistência';