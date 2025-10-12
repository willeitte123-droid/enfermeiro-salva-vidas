import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Timer, FileText, Info, PlayCircle } from "lucide-react";

const SimuladoLobby = () => {
  const [numQuestions, setNumQuestions] = useState("20");
  const [timePerQuestion, setTimePerQuestion] = useState("2"); // in minutes
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/simulado/start", {
      state: {
        numQuestions: parseInt(numQuestions),
        totalTime: parseInt(numQuestions) * parseInt(timePerQuestion) * 60, // in seconds
      },
    });
  };

  const totalTimeMinutes = parseInt(numQuestions) * parseInt(timePerQuestion);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Área de Simulado</h1>
        <p className="text-muted-foreground">Prepare-se para os desafios reais. Configure e inicie seu simulado cronometrado.</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Configurar Simulado</CardTitle>
          <CardDescription>Ajuste os parâmetros para simular as condições do seu concurso ou prova.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="num-questions" className="flex items-center gap-2 font-semibold">
                <FileText className="h-5 w-5 text-primary" />
                Número de Questões
              </Label>
              <Select value={numQuestions} onValueChange={setNumQuestions}>
                <SelectTrigger id="num-questions"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Questões (Rápido)</SelectItem>
                  <SelectItem value="20">20 Questões (Padrão)</SelectItem>
                  <SelectItem value="50">50 Questões (Concurso)</SelectItem>
                  <SelectItem value="100">100 Questões (Residência)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time-per-question" className="flex items-center gap-2 font-semibold">
                <Timer className="h-5 w-5 text-primary" />
                Tempo por Questão
              </Label>
              <Select value={timePerQuestion} onValueChange={setTimePerQuestion}>
                <SelectTrigger id="time-per-question"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.5">1 minuto e 30 segundos</SelectItem>
                  <SelectItem value="2">2 minutos</SelectItem>
                  <SelectItem value="2.5">2 minutos e 30 segundos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <h3 className="font-semibold text-lg">Resumo do Simulado</h3>
            <p className="text-5xl font-bold text-primary my-4">{totalTimeMinutes}</p>
            <p className="text-muted-foreground">Minutos Totais</p>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Regras do Simulado</AlertTitle>
            <AlertDescription>
              O cronômetro iniciará assim que você clicar em "Iniciar" e não poderá ser pausado. As respostas não poderão ser alteradas após avançar para a próxima questão.
            </AlertDescription>
          </Alert>
          <Button onClick={handleStart} size="lg" className="w-full">
            <PlayCircle className="mr-2 h-5 w-5" />
            Iniciar Simulado
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SimuladoLobby;