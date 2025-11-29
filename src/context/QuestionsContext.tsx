import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

export interface Question {
  id: number;
  category: string;
  banca?: string; // Novo campo opcional
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

// Este provedor será removido, mas o hook e a interface ainda podem ser úteis temporariamente.
// A lógica de fetch será movida para os componentes individuais.
export const QuestionsProvider = ({ children }: { children: ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A lógica de fetch foi removida para evitar o carregamento em massa.
  // Os componentes agora buscarão seus próprios dados.

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