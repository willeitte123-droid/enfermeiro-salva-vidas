import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RefreshCw } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";

interface Profile {
  id: string;
}

const bradenData = [
  {
    id: "sensory",
    title: "Percepção Sensorial",
    options: [
      { score: 1, text: "Completamente limitado" },
      { score: 2, text: "Muito limitado" },
      { score: 3, text: "Ligeiramente limitado" },
      { score: 4, text: "Nenhuma limitação" },
    ],
  },
  {
    id: "moisture",
    title: "Umidade",
    options: [
      { score: 1, text: "Completamente molhado" },
      { score: 2, text: "Muito molhado" },
      { score: 3, text: "Ocasionalmente molhado" },
      { score: 4, text: "Raramente molhado" },
    ],
  },
  {
    id: "activity",
    title: "Atividade",
    options: [
      { score: 1, text: "Acamado" },
      { score: 2, text: "Confinado à cadeira" },
      { score: 3, text: "Deambula ocasionalmente" },
      { score: 4, text: "Deambula frequentemente" },
    ],
  },
  {
    id: "mobility",
    title: "Mobilidade",
    options: [
      { score: 1, text: "Completamente imóvel" },
      { score: 2, text: "Muito limitado" },
      { score: 3, text: "Ligeiramente limitado" },
      { score: 4, text: "Nenhuma limitação" },
    ],
  },
  {
    id: "nutrition",
    title: "Nutrição",
    options: [
      { score: 1, text: "Muito pobre" },
      { score: 2, text: "Provavelmente inadequada" },
      { score: 3, text: "Adequada" },
      { score: 4, text: "Excelente" },
    ],
  },
  {
    id: "friction",
    title: "Fricção e Cisalhamento",
    options: [
      { score: 1, text: "Problema" },
      { score: 2, text: "Problema potencial" },
      { score: 3, text: "Nenhum problema aparente" },
    ],
  },
];

const BradenScale = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [scores, setScores] = useState({
    sensory: 4,
    moisture: 4,
    activity: 4,
    mobility: 4,
    nutrition: 4,
    friction: 3,
  });
  const [totalScore, setTotalScore] = useState(23);

  useEffect(() => {
    const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
    setTotalScore(total);
  }, [scores]);

  const handleScoreChange = (category: string, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const getInterpretation = (score: number) => {
    if (score <= 9) return { text: "Risco Muito Alto", color: "text-red-700" };
    if (score <= 12) return { text: "Risco Alto", color: "text-red-600" };
    if (score <= 14) return { text: "Risco Moderado", color: "text-yellow-600" };
    if (score <= 18) return { text: "Risco Leve", color: "text-green-600" };
    return { text: "Sem Risco", color: "text-blue-600" };
  };

  const resetScale = () => {
    setScores({ sensory: 4, moisture: 4, activity: 4, mobility: 4, nutrition: 4, friction: 3 });
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Escala de Braden</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/scales/braden"
              itemType="Escala"
              itemTitle="Escala de Braden"
            />
          )}
        </div>
        <p className="text-muted-foreground">Avalie o risco para desenvolvimento de lesão por pressão.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Accordion type="multiple" defaultValue={bradenData.map(i => i.id)} className="space-y-4">
            {bradenData.map(category => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="font-semibold">{category.title} ({scores[category.id as keyof typeof scores]})</AccordionTrigger>
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
                Pontuação máxima: 23. Quanto menor a pontuação, maior o risco.
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

export default BradenScale;