-- Script para uma segunda rodada de consolidação de categorias,
-- agrupando temas correlatos para otimizar a estrutura de filtros.

-- 1. Unifica "Sistematização da Assistência (SAE)" com "Fundamentos de Enfermagem"
UPDATE public.questions
SET category = 'Fundamentos e SAE'
WHERE category IN ('Fundamentos de Enfermagem', 'Sistematização da Assistência (SAE)');

-- 2. Unifica "Cálculo de Medicação" com "Farmacologia"
UPDATE public.questions
SET category = 'Farmacologia e Cálculos'
WHERE category IN ('Farmacologia', 'Cálculo de Medicação');

-- 3. Unifica "Imunização (PNI)" com "Saúde Pública"
UPDATE public.questions
SET category = 'Saúde Pública e Imunização'
WHERE category IN ('Saúde Pública', 'Imunização (PNI)');