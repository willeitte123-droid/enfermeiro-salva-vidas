CREATE OR REPLACE FUNCTION public.get_question_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    total_count integer;
    category_counts json;
    banca_counts json;
BEGIN
    -- Contagem total
    SELECT count(*) INTO total_count FROM questions;

    -- Contagem por Categoria
    SELECT json_agg(t) INTO category_counts FROM (
        SELECT category, count(*) as count
        FROM questions
        GROUP BY category
        ORDER BY count DESC
    ) t;

    -- Contagem por Banca (Top 20)
    SELECT json_agg(t) INTO banca_counts FROM (
        SELECT COALESCE(banca, 'Não Informada') as banca, count(*) as count
        FROM questions
        GROUP BY banca
        ORDER BY count DESC
        LIMIT 20
    ) t;

    RETURN json_build_object(
        'total', total_count,
        'by_category', COALESCE(category_counts, '[]'::json),
        'by_banca', COALESCE(banca_counts, '[]'::json)
    );
END;
$$;