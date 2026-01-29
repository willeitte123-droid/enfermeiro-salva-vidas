import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import SimuladoLobby from "@/components/simulado/SimuladoLobby";
import SimuladoQuiz from "@/components/simulado/SimuladoQuiz";
import SimuladoResultado from "@/components/simulado/SimuladoResultado";
import { Question } from "@/context/QuestionsContext";
import { useActivityTracker } from "@/hooks/useActivityTracker";

interface Profile {
  id: string;
}

interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
}

interface QuizConfig {
  numQuestions: number;
  totalTime: number;
  banca: string;
  category?: string;
}

interface QuizResults {
  userAnswers: UserAnswer[];
  questions: Question[];
  timeTaken: number;
}

const SimuladoPage = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [gameState, setGameState] = useState<"lobby" | "quiz" | "results">("lobby");
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Área de Simulado', path: '/simulado', icon: 'Timer' });
  }, [addActivity]);

  const handleStart = (config: QuizConfig) => {
    setQuizConfig(config);
    setGameState("quiz");
  };

  const handleFinish = (results: QuizResults) => {
    setQuizResults(results);
    setGameState("results");
  };

  const handleRestart = () => {
    setQuizConfig(null);
    setQuizResults(null);
    setGameState("lobby");
  };

  if (gameState === "lobby") {
    return <SimuladoLobby onStart={handleStart} />;
  }

  if (gameState === "quiz" && quizConfig) {
    return (
      <SimuladoQuiz 
        numQuestions={quizConfig.numQuestions} 
        totalTime={quizConfig.totalTime} 
        banca={quizConfig.banca}
        category={quizConfig.category}
        userId={profile?.id}
        onFinish={handleFinish} 
      />
    );
  }

  if (gameState === "results" && quizResults) {
    return <SimuladoResultado userAnswers={quizResults.userAnswers} questions={quizResults.questions} timeTaken={quizResults.timeTaken} onRestart={handleRestart} />;
  }

  // Fallback to lobby
  return <SimuladoLobby onStart={handleStart} />;
};

export default SimuladoPage;