import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RefreshCw } from "lucide-react";

const morseData = [
  { id: "history", title: "Histórico de Quedas", options: [{ score: 0, text: "Não" }, { score: 25, text: "Sim" }] },
  { id: "secondaryDiagnosis", title: "Diagnóstico Secundário", options: [{ score: 0, text: "Não" }, { score: 15, text: "Sim" }] },
  { id: "ambulatoryAid", title: "Auxílio para Deambular", options: [{ score: 0, text: "Nenhum / Acamado / Cadeira de rodas" }, { score: 15, text: "Muletas / Bengala / Andador" }, { score: 30, text: "Apoia-se nos móveis" }] },
  { id: "ivTherapy", title: "Terapia Endovenosa", options: [{ score: 0, text: "Não" }, { score: 20, text: "Sim (com dispositivo salinizado/heparinizado)" }] },
  { id: "gait", title: "Marcha", options: [{ score: 0, text: "Normal / Acamado / Imóvel" }, { score: 10, text: "Fraca" }, { score: 20, text: "Comprometida / Cambaleante" }] },
  { id: "mentalStatus", title: "Estado Mental", options: [{ score: 0, text: "Consciente de suas capacidades" }, { score: 15, text: "Superestima / Esquece as limitações" }] },
];

const MorseScale = () => {
  const [scores, setScores] = useState({ history: 0, secondaryDiagnosis: 0, ambulatoryAid: 0, ivTherapy: 0, gait: 0, mentalStatus: 0 });
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
    setTotalScore(total);
  }, [scores]);

  const handleScoreChange = (category: string, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const getInterpretation = (score: number) => {
    if (score >= 45) return { text: "Alto Risco", color: "text-red-600" };
    if (score >= 25) return { text: "Risco Baixo a Moderado", color: "text-yellow-600" };
    return { text: "Sem Risco", color: "text-green-600" };
  };

  const resetScale = () => {
    setScores({ history: 0, secondaryDiagnosis: 0, ambulatoryAid: 0, ivTherapy: 0, gait: 0, mentalStatus: 0 });
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Escala de Morse</h1>
        <p className="text-muted-foreground">Avalie o risco de queda do paciente.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Accordion type="multiple" defaultValue={morseData.map(i => i.id)} className="space-y-4">
            {morseData.map(category => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="font-semibold">{category.title} ({scores[category.id as keyof typeof scores]})</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup value={String(scores[category.id as keyof typeof scores])} onValueChange={(v) => handleScoreChange(category.id, Number(v))} className="p-2 space-y-2">
                    {category.options.map(item => (
                      <Label key={item.score} className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent cursor-pointer">
                        <RadioGroupItem value={String(item.score)} />
                        <span>({item.score}) {item.text}</span>
                      </Label>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>Pontuação total e nível de risco.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-7xl font-bold text-primary">{totalScore}</div>
              <div className={`text-2xl font-semibold ${interpretation.color}`}>{interpretation.text}</div>
              <p className="text-xs text-muted-foreground">
                Implementar plano de prevenção de quedas conforme o risco.
              </p>
              <Button variant="outline" onClick={resetScale} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reiniciar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MorseScale;