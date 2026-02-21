-- Segunda passagem de consolidação de categorias, com base no feedback do usuário.

-- 1. Unificar todas as variações de Saúde Mental em "Saúde Mental"
UPDATE public.questions
SET category = 'Saúde Mental'
WHERE category ILIKE 'Saúde Mental e Psiquiatria';

-- 2. Unificar todas as variações de Controle de Infecção em "Biossegurança e Controle de Infecção"
UPDATE public.questions
SET category = 'Biossegurança e Controle de Infecção'
WHERE category ILIKE 'Controle de Infecção (CME)'
   OR category ILIKE 'Controle de Infecção';