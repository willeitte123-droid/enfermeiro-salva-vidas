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
  const [totalTime, setTotalTime] = useState("40");

  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/simulado/start", {
      state: {
        numQuestions: parseInt(numQuestions),
        totalTime: parseInt(totalTime) * 60, // in seconds
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Área de Simulado
        </h1>
        <p className="text-muted-foreground">Prepare-se para os desafios reais. Configure e inicie seu simulado cronometrado.</p>
      </div>

      <Card className="shadow-lg bg-gradient-to-br from-primary/10 to-secondary/10">
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
              <Label htmlFor="total-time" className="flex items-center gap-2 font-semibold">
                <Timer className="h-5 w-5 text-primary" />
                Tempo Total (minutos)
              </Label>
              <Select value={totalTime} onValueChange={setTotalTime}>
                <SelectTrigger id="total-time"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20 minutos</SelectItem>
                  <SelectItem value="40">40 minutos</SelectItem>
                  <SelectItem value="100">100 minutos</SelectItem>
                  <SelectItem value="200">200 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-primary/20 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-inner">
            <h3 className="font-semibold text-lg text-primary-foreground">Resumo do Simulado</h3>
            <div className="flex items-baseline gap-4">
                <div>
                    <p className="text-6xl font-bold text-white my-2">{numQuestions}</p>
                    <p className="text-primary-foreground/80">Questões</p>
                </div>
                <div>
                    <p className="text-6xl font-bold text-white my-2">{totalTime}</p>
                    <p className="text-primary-foreground/80">Minutos</p>
                </div>
            </div>
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
          <Button onClick={handleStart} size="lg" className="w-full text-lg font-bold py-6">
            <PlayCircle className="mr-2 h-6 w-6" />
            Iniciar Simulado
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SimuladoLobby;