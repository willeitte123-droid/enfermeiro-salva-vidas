import { useState } from "react";
import SimuladoLobby from "@/components/simulado/SimuladoLobby";
import SimuladoQuiz from "@/components/simulado/SimuladoQuiz";
import SimuladoResultado from "@/components/simulado/SimuladoResultado";
import { Question } from "@/context/QuestionsContext";

interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
}

interface QuizConfig {
  numQuestions: number;
  totalTime: number;
}

interface QuizResults {
  userAnswers: UserAnswer[];
  questions: Question[];
  timeTaken: number;
}

const SimuladoPage = () => {
  const [gameState, setGameState] = useState<"lobby" | "quiz" | "results">("lobby");
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

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
    return <SimuladoQuiz numQuestions={quizConfig.numQuestions} totalTime={quizConfig.totalTime} onFinish={handleFinish} />;
  }

  if (gameState === "results" && quizResults) {
    return <SimuladoResultado userAnswers={quizResults.userAnswers} questions={quizResults.questions} timeTaken={quizResults.timeTaken} onRestart={handleRestart} />;
  }

  // Fallback to lobby
  return <SimuladoLobby onStart={handleStart} />;
};

export default SimuladoPage;