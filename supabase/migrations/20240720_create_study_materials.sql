-- Criar a tabela de materiais de estudo
CREATE TABLE IF NOT EXISTS public.study_materials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size TEXT,
    page_count INTEGER,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Segurança)
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso para a tabela
CREATE POLICY "Materials are viewable by authenticated users" ON public.study_materials
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can insert materials" ON public.study_materials
    FOR INSERT TO authenticated WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can update materials" ON public.study_materials
    FOR UPDATE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

CREATE POLICY "Admins can delete materials" ON public.study_materials
    FOR DELETE TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Criar o Bucket de Storage para os PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('concurso_pdfs', 'concurso_pdfs', true) ON CONFLICT DO NOTHING;

-- Políticas de acesso para o Storage (Apenas usuários autenticados podem ver os PDFs)
CREATE POLICY "Users can view PDFs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'concurso_pdfs');
CREATE POLICY "Admins can insert PDFs" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'concurso_pdfs' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update PDFs" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'concurso_pdfs' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete PDFs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'concurso_pdfs' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));