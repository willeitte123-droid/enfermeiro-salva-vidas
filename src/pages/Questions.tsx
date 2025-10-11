import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2, Lightbulb } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  category: string;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/questions.json');
        if (!response.ok) {
          throw new Error('Falha ao carregar as questões.');
        }
        const data: Question[] = await response.json();
        setQuestions(data.sort(() => Math.random() - 0.5));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;
    
    setShowExplanation(true);
    
    if (!answeredQuestions.includes(currentQuestion)) {
      if (selectedAnswer === questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
      setAnsweredQuestions([...answeredQuestions, currentQuestion]);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer("");
    setShowExplanation(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuestions([...questions].sort(() => Math.random() - 0.5));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-4 text-muted-foreground">Carregando questões...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (questions.length === 0) {
    return <p>Nenhuma questão encontrada.</p>;
  }

  const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Banca de Questões</h1>
        <p className="text-muted-foreground">
          Teste seus conhecimentos com questões de concurso comentadas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <Badge variant="secondary">{questions[currentQuestion].category}</Badge>
            <CardDescription>
              Pontuação: <strong>{score} / {answeredQuestions.length}</strong>
            </CardDescription>
          </div>
          <CardTitle className="text-lg">
            Questão {currentQuestion + 1}
          </CardTitle>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">
              {questions[currentQuestion].question}
            </h3>
            
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              disabled={showExplanation}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option) => (
                <Label
                  key={option.id}
                  htmlFor={option.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    showExplanation
                      ? option.id === questions[currentQuestion].correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-950 font-semibold"
                        : option.id === selectedAnswer
                        ? "border-red-500 bg-red-50 dark:bg-red-950"
                        : "border-border"
                      : "border-border hover:border-primary hover:bg-accent"
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <span className="flex-1 text-foreground">
                    <span className="font-bold">{option.id})</span> {option.text}
                  </span>
                  {showExplanation && option.id === questions[currentQuestion].correctAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  {showExplanation && option.id === selectedAnswer && option.id !== questions[currentQuestion].correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </Label>
              ))}
            </RadioGroup>
          </div>

          {showExplanation && (
            <Alert className={`border-2 ${
              isCorrect ? "border-green-500" : "border-red-500"
            }`}>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle className="font-semibold">
                {isCorrect ? "Resposta Correta!" : "Resposta Incorreta"}
              </AlertTitle>
              <AlertDescription>
                <strong>Gabarito: {questions[currentQuestion].correctAnswer}.</strong> {questions[currentQuestion].explanation}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            {!showExplanation ? (
              <Button
                onClick={handleAnswerSubmit}
                disabled={!selectedAnswer}
                className="w-full md:w-auto"
              >
                Responder
              </Button>
            ) : (
              <>
                {currentQuestion < questions.length - 1 ? (
                  <Button onClick={handleNextQuestion} className="w-full md:w-auto">
                    Próxima Questão
                  </Button>
                ) : (
                  <Button onClick={resetQuiz} className="w-full md:w-auto">
                    Finalizar e Reiniciar
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Questions;