-- Atualiza todos os flashcards da categoria antiga para a nova nomenclatura padronizada
UPDATE public.flashcards
SET deck_category = 'Fundamentos de Enfermagem'
WHERE deck_category = 'Fundamentos';