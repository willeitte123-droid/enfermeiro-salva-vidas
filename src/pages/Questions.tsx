import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
        // O Vite permite importar JSON diretamente, mas para simular um fetch e ser mais robusto:
        const response = await fetch('/src/data/questions.json');
        if (!response.ok) {
          throw new Error('Falha ao carregar as questões.');
        }
        const data: Question[] = await response.json();
        // Embaralhar as questões para uma nova experiência a cada vez
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

  const handlePreviousQuestion = () => {
    setSelectedAnswer("");
    setShowExplanation(false);
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
    // Re-embaralhar as questões
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-2">Banca de Questões</h1>
        <p className="text-muted-foreground">
          Teste seus conhecimentos em enfermagem com questões comentadas
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardDescription>
              Questão {currentQuestion + 1} de {questions.length}
            </CardDescription>
            <CardDescription>
              Pontuação: {score} / {answeredQuestions.length}
            </CardDescription>
          </div>
          <CardTitle className="text-sm font-medium text-primary">
            {questions[currentQuestion].category}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {questions[currentQuestion].question}
            </h3>
            
            <RadioGroup
              value={selectedAnswer}
              onValueChange={setSelectedAnswer}
              disabled={showExplanation}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option) => (
                <div
                  key={option.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    showExplanation
                      ? option.id === questions[currentQuestion].correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : option.id === selectedAnswer
                        ? "border-red-500 bg-red-50 dark:bg-red-950"
                        : "border-border"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label
                    htmlFor={option.id}
                    className="flex-1 cursor-pointer text-foreground"
                  >
                    <span className="font-medium">{option.id}.</span> {option.text}
                  </Label>
                  {showExplanation && option.id === questions[currentQuestion].correctAnswer && (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  )}
                  {showExplanation && option.id === selectedAnswer && option.id !== questions[currentQuestion].correctAnswer && (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          {showExplanation && (
            <div className={`p-4 rounded-lg border ${
              isCorrect
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-red-500 bg-red-50 dark:bg-red-950"
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {isCorrect ? "Resposta Correta!" : "Resposta Incorreta"}
                  </h4>
                  <p className="text-sm text-foreground">
                    <strong>Gabarito: {questions[currentQuestion].correctAnswer}</strong>
                  </p>
                  <p className="text-sm text-foreground mt-2">
                    {questions[currentQuestion].explanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Anterior
            </Button>
            
            <div className="flex gap-3">
              {!showExplanation ? (
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={!selectedAnswer}
                >
                  Responder
                </Button>
              ) : (
                <>
                  {currentQuestion < questions.length - 1 ? (
                    <Button onClick={handleNextQuestion}>
                      Próxima Questão
                    </Button>
                  ) : (
                    <Button onClick={resetQuiz}>
                      Reiniciar Questionário
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Questions;