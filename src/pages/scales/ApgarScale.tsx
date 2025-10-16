import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RefreshCw, Baby, HeartPulse, Smile, Armchair, Wind } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";

interface Profile {
  id: string;
}

const apgarData = [
  { id: "appearance", title: "Aparência (Cor da Pele)", icon: Baby, options: [{ score: 0, text: "Cianótico ou pálido" }, { score: 1, text: "Corpo róseo e extremidades cianóticas (acrocianose)" }, { score: 2, text: "Completamente róseo" }] },
  { id: "pulse", title: "Pulso (Frequência Cardíaca)", icon: HeartPulse, options: [{ score: 0, text: "Ausente" }, { score: 1, text: "Abaixo de 100 bpm" }, { score: 2, text: "Acima de 100 bpm" }] },
  { id: "grimace", title: "Gesticulação (Irritabilidade Reflexa)", icon: Smile, options: [{ score: 0, text: "Sem resposta" }, { score: 1, text: "Careta ou choro fraco ao estímulo" }, { score: 2, text: "Choro forte, tosse ou espirro ao estímulo" }] },
  { id: "activity", title: "Atividade (Tônus Muscular)", icon: Armchair, options: [{ score: 0, text: "Flácido, sem movimentos" }, { score: 1, text: "Alguma flexão das extremidades" }, { score: 2, text: "Movimentos ativos" }] },
  { id: "respiration", title: "Respiração (Esforço Respiratório)", icon: Wind, options: [{ score: 0, text: "Ausente" }, { score: 1, text: "Lenta, irregular, choro fraco" }, { score: 2, text: "Boa, choro forte" }] },
];

const ApgarScale = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [scores, setScores] = useState({
    appearance: 2,
    pulse: 2,
    grimace: 2,
    activity: 2,
    respiration: 2,
  });
  const [totalScore, setTotalScore] = useState(10);

  useEffect(() => {
    const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
    setTotalScore(total);
  }, [scores]);

  const handleScoreChange = (category: string, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const getInterpretation = (score: number) => {
    if (score >= 7) return { text: "Boa vitalidade", color: "text-green-600" };
    if (score >= 4) return { text: "Anoxia moderada", color: "text-yellow-600" };
    return { text: "Anoxia grave", color: "text-red-600" };
  };

  const resetScale = () => {
    setScores({ appearance: 2, pulse: 2, grimace: 2, activity: 2, respiration: 2 });
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Índice de Apgar</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/scales/apgar"
              itemType="Escala"
              itemTitle="Índice de Apgar"
            />
          )}
        </div>
        <p className="text-muted-foreground">Avalie a vitalidade do recém-nascido no 1º e 5º minuto de vida.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Accordion type="multiple" defaultValue={apgarData.map(i => i.id)} className="space-y-4">
            {apgarData.map(category => {
              const Icon = category.icon;
              return (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="font-semibold">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {category.title} ({scores[category.id as keyof typeof scores]})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <RadioGroup
                      value={String(scores[category.id as keyof typeof scores])}
                      onValueChange={(v) => handleScoreChange(category.id, Number(v))}
                      className="p-2 space-y-2"
                    >
                      {category.options.map(item => (
                        <Label key={item.score} className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent cursor-pointer">
                          <RadioGroupItem value={String(item.score)} />
                          <span>({item.score}) {item.text}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
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
                Avaliação realizada no 1º e 5º minuto. Se &lt; 7 no 5º min, reavaliar a cada 5 min por até 20 min.
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

export default ApgarScale;