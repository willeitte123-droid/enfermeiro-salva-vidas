import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useOutletContext } from "react-router-dom";
import { Syringe, Calculator, Siren, Scale, Lightbulb, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  role: string;
  status: string;
  first_name?: string;
  last_name?: string;
}

interface Question {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
}

const quickAccessLinks = [
  { title: "Gotejamento", icon: Calculator, path: "/calculator", description: "Calcule taxas de infusão." },
  { title: "Medicamentos", icon: Syringe, path: "/medications", description: "Guia rápido de fármacos." },
  { title: "Escalas Clínicas", icon: Scale, path: "/scales", description: "Avaliações padronizadas." },
  { title: "Emergências", icon: Siren, path: "/emergency", description: "Protocolos de emergência." },
];

const clinicalTips = [
  "Lembre-se: a Escala de Coma de Glasgow avalia o nível de consciência, não o diagnóstico neurológico.",
  "Na PCR, a qualidade das compressões é mais importante que a velocidade. 'Comprima forte e rápido' (100-120/min).",
  "Sempre verifique a compatibilidade de medicamentos antes de administrá-los na mesma linha endovenosa.",
  "A hipoglicemia pode mimetizar sintomas neurológicos. Sempre verifique a glicemia capilar em pacientes com alteração de consciência.",
  "O antídoto para intoxicação por opioides é a Naloxona. Para benzodiazepínicos, é o Flumazenil.",
];

const Dashboard = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [dailyQuestion, setDailyQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => {
        setAllQuestions(data);
        setDailyQuestion(data[Math.floor(Math.random() * data.length)]);
      });
  }, []);

  const handleSelectOption = (optionId: string) => {
    if (showAnswer) return;
    setSelectedOption(optionId);
    setShowAnswer(true);
  };

  const loadNewQuestion = () => {
    setSelectedOption(null);
    setShowAnswer(false);
    setDailyQuestion(allQuestions[Math.floor(Math.random() * allQuestions.length)]);
  };

  const randomTip = useMemo(() => clinicalTips[Math.floor(Math.random() * clinicalTips.length)], []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Olá, {profile?.first_name || 'Profissional'}!</h1>
          <p className="text-muted-foreground mt-2">Bem-vindo(a) de volta ao seu ambiente de estudo e trabalho.</p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Acesso Rápido</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickAccessLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link to={link.path} key={link.title}>
                  <Card className="h-full hover:bg-accent hover:border-primary transition-all group">
                    <CardContent className="flex flex-col items-center justify-center text-center p-4">
                      <div className="p-3 bg-primary/10 rounded-lg mb-3 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
                      </div>
                      <p className="font-semibold text-sm">{link.title}</p>
                      <p className="text-xs text-muted-foreground">{link.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Questão do Dia</CardTitle>
            <CardDescription>Teste seu conhecimento.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {dailyQuestion ? (
              <>
                <p className="text-sm font-semibold">{dailyQuestion.question}</p>
                <div className="space-y-2">
                  {dailyQuestion.options.map((opt) => {
                    const isCorrect = opt.id === dailyQuestion.correctAnswer;
                    const isSelected = opt.id === selectedOption;
                    return (
                      <Button
                        key={opt.id}
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left h-auto py-2",
                          showAnswer && isCorrect && "bg-green-100 border-green-300 text-green-800 hover:bg-green-200",
                          showAnswer && isSelected && !isCorrect && "bg-red-100 border-red-300 text-red-800 hover:bg-red-200"
                        )}
                        onClick={() => handleSelectOption(opt.id)}
                      >
                        <span className="font-bold mr-2">{opt.id})</span>
                        <span className="flex-1 whitespace-normal">{opt.text}</span>
                        {showAnswer && isCorrect && <CheckCircle className="h-4 w-4 ml-2 text-green-600" />}
                        {showAnswer && isSelected && !isCorrect && <XCircle className="h-4 w-4 ml-2 text-red-600" />}
                      </Button>
                    );
                  })}
                </div>
                {showAnswer && (
                  <div className="p-3 bg-muted rounded-md text-sm">
                    <p><strong>Gabarito: {dailyQuestion.correctAnswer}.</strong> {dailyQuestion.explanation}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Carregando questão...</p>
            )}
          </CardContent>
          <CardContent className="flex gap-2">
            <Button variant="secondary" onClick={loadNewQuestion} className="w-full">Nova Questão</Button>
            <Button asChild className="w-full">
              <Link to="/questions">Ver Todas <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Dica Clínica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">"{randomTip}"</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;