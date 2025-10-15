import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface Question {
  id: number;
  category: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

interface QuestionsContextType {
  questions: Question[];
  isLoading: boolean;
  error: string | null;
}

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const QuestionsProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data, error: dbError } = await supabase
          .from('questions')
          .select('*')
          .order('id', { ascending: true });

        if (dbError) {
          throw dbError;
        }
        
        // A coluna 'options' é JSONB, o Supabase client já faz o parse.
        setQuestions(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido ao buscar as questões.";
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <QuestionsContext.Provider value={{ questions, isLoading, error }}>
      {children}
    </QuestionsContext.Provider>
  );
};

export const useQuestions = () => {
  const context = useContext(QuestionsContext);
  if (context === undefined) {
    throw new Error('useQuestions deve ser usado dentro de um QuestionsProvider');
  }
  return context;
};