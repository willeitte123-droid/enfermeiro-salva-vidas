import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Timer, FileText, Info, PlayCircle, Building2 } from "lucide-react";

interface SimuladoLobbyProps {
  onStart: (config: { numQuestions: number; totalTime: number; banca: string }) => void;
}

const SimuladoLobby = ({ onStart }: SimuladoLobbyProps) => {
  const [numQuestions, setNumQuestions] = useState("20");
  const [totalTime, setTotalTime] = useState("40");
  const [selectedBanca, setSelectedBanca] = useState("Todas");

  const handleStart = () => {
    onStart({
      numQuestions: parseInt(numQuestions),
      totalTime: parseInt(totalTime) * 60, // in seconds
      banca: selectedBanca,
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
              <Label htmlFor="banca" className="flex items-center gap-2 font-semibold">
                <Building2 className="h-5 w-5 text-primary" />
                Banca Examinadora
              </Label>
              <Select value={selectedBanca} onValueChange={setSelectedBanca}>
                <SelectTrigger id="banca"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todas">Todas as Bancas</SelectItem>
                  <SelectItem value="IBFC">IBFC (EBSERH)</SelectItem>
                  <SelectItem value="Vunesp">Vunesp</SelectItem>
                  <SelectItem value="Cebraspe">Cebraspe/Cespe</SelectItem>
                  <SelectItem value="FGV">FGV</SelectItem>
                  <SelectItem value="Instituto Mais">Instituto Mais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="total-time" className="flex items-center gap-2 font-semibold">
                <Timer className="h-5 w-5 text-primary" />
                Tempo Total
              </Label>
              <Select value={totalTime} onValueChange={setTotalTime}>
                <SelectTrigger id="total-time"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20 minutos</SelectItem>
                  <SelectItem value="40">40 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                  <SelectItem value="180">3 horas</SelectItem>
                  <SelectItem value="240">4 horas</SelectItem>
                  <SelectItem value="300">5 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="bg-emerald-600 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-inner text-white space-y-4">
            <h3 className="font-semibold text-lg border-b border-white/20 pb-2 w-full">Resumo do Simulado</h3>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 w-full">
                <div>
                    <p className="text-4xl font-bold">{numQuestions}</p>
                    <p className="text-sm opacity-80">Questões</p>
                </div>
                <div>
                    <p className="text-4xl font-bold">{totalTime}</p>
                    <p className="text-sm opacity-80">Minutos</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/20 w-full">
                <p className="text-sm opacity-80 uppercase tracking-wider text-[10px]">Banca Selecionada</p>
                <p className="text-xl font-bold truncate">{selectedBanca === 'Todas' ? 'Multibancas' : selectedBanca}</p>
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