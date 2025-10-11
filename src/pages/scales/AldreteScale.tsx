import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RefreshCw } from "lucide-react";

const aldreteData = [
  { id: "activity", title: "Atividade Motora", options: [{ score: 2, text: "Move 4 membros" }, { score: 1, text: "Move 2 membros" }, { score: 0, text: "Move 0 membros" }] },
  { id: "respiration", title: "Respiração", options: [{ score: 2, text: "Respira profundamente e tosse" }, { score: 1, text: "Dispneia ou respiração limitada" }, { score: 0, text: "Apneia" }] },
  { id: "circulation", title: "Circulação", options: [{ score: 2, text: "PA ± 20% do nível pré-anestésico" }, { score: 1, text: "PA ± 20-49% do nível pré-anestésico" }, { score: 0, text: "PA ± 50% do nível pré-anestésico" }] },
  { id: "consciousness", title: "Consciência", options: [{ score: 2, text: "Totalmente desperto" }, { score: 1, text: "Desperta ao chamado" }, { score: 0, text: "Não responde" }] },
  { id: "saturation", title: "Saturação de O₂", options: [{ score: 2, text: "SpO₂ > 92% em ar ambiente" }, { score: 1, text: "Necessita de O₂ para manter SpO₂ > 90%" }, { score: 0, text: "SpO₂ < 90% mesmo com O₂" }] },
];

const AldreteScale = () => {
  const [scores, setScores] = useState({ activity: 2, respiration: 2, circulation: 2, consciousness: 2, saturation: 2 });
  const [totalScore, setTotalScore] = useState(10);

  useEffect(() => {
    const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
    setTotalScore(total);
  }, [scores]);

  const handleScoreChange = (category: string, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const getInterpretation = (score: number) => {
    if (score >= 9) return { text: "Condições de alta da SRPA", color: "text-green-600" };
    return { text: "Necessita de maior vigilância", color: "text-yellow-600" };
  };

  const resetScale = () => {
    setScores({ activity: 2, respiration: 2, circulation: 2, consciousness: 2, saturation: 2 });
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Índice de Aldrete e Kroulik</h1>
        <p className="text-muted-foreground">Avalie as condições do paciente para alta da Sala de Recuperação Pós-Anestésica (SRPA).</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Accordion type="multiple" defaultValue={aldreteData.map(i => i.id)} className="space-y-4">
            {aldreteData.map(category => (
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
              <CardDescription>Pontuação total e interpretação.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-7xl font-bold text-primary">{totalScore}</div>
              <div className={`text-2xl font-semibold ${interpretation.color}`}>{interpretation.text}</div>
              <p className="text-xs text-muted-foreground">
                Pontuação máxima: 10.
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

export default AldreteScale;