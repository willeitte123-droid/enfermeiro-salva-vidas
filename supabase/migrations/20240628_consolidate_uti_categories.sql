-- Unifica a categoria de Questões
UPDATE public.questions
SET category = 'Terapia Intensiva (UTI)'
WHERE category = 'UTI e Cuidados Críticos';

-- Unifica a categoria de Flashcards (caso exista)
UPDATE public.flashcards
SET deck_category = 'Terapia Intensiva (UTI)'
WHERE deck_category = 'UTI e Cuidados Críticos';