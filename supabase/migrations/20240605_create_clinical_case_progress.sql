-- Create table for tracking clinical case progress
CREATE TABLE IF NOT EXISTS public.user_case_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    case_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, case_id)
);

-- Enable RLS
ALTER TABLE public.user_case_progress ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own case progress" 
ON public.user_case_progress 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert/update their own case progress" 
ON public.user_case_progress 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own case progress" 
ON public.user_case_progress 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id);