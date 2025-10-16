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

const fugulinData = [
  { id: "mental", title: "Estado Mental", options: [{ score: 1, text: "Orientado no tempo e espaço" }, { score: 2, text: "Períodos de desorientação" }, { score: 3, text: "Desorientado no tempo e espaço" }, { score: 4, text: "Inconsciente" }] },
  { id: "oxygenation", title: "Oxigenação", options: [{ score: 1, text: "Não depende de O2" }, { score: 2, text: "Uso intermitente de O2" }, { score: 3, text: "Uso contínuo de O2" }, { score: 4, text: "Ventilação mecânica" }] },
  { id: "vitals", title: "Sinais Vitais", options: [{ score: 1, text: "Controle de rotina (8/8h)" }, { score: 2, text: "Controle em intervalos de 6/6h" }, { score: 3, text: "Controle em intervalos de 4/4h ou menos" }, { score: 4, text: "Controle contínuo / PVC / PAI" }] },
  { id: "motility", title: "Motilidade", options: [{ score: 1, text: "Ativa" }, { score: 2, text: "Limitação de movimentos" }, { score: 3, text: "Incapaz de movimentar segmentos corporais" }, { score: 4, text: "Totalmente imóvel" }] },
  { id: "ambulation", title: "Deambulação", options: [{ score: 1, text: "Deambula" }, { score: 2, text: "Auxílio para deambular" }, { score: 3, text: "Transporte em cadeira de rodas" }, { score: 4, text: "Transporte em maca" }] },
  { id: "feeding", title: "Alimentação", options: [{ score: 1, text: "Autossuficiente" }, { score: 2, text: "Auxílio para alimentar-se" }, { score: 3, text: "Alimentação por sonda" }, { score: 4, text: "Jejum / Nutrição Parenteral" }] },
  { id: "bodyCare", title: "Cuidado Corporal", options: [{ score: 1, text: "Autossuficiente" }, { score: 2, text: "Auxílio no banho" }, { score: 3, text: "Banho no leito" }, { score: 4, text: "Necessita de 2 pessoas para o banho" }] },
  { id: "elimination", title: "Eliminação", options: [{ score: 1, text: "Independente" }, { score: 2, text: "Uso de comadre/papagaio" }, { score: 3, text: "Evacuações no leito" }, { score: 4, text: "Sonda vesical / Ostomias" }] },
  { id: "therapy", title: "Terapêutica", options: [{ score: 1, text: "Intramuscular / Oral" }, { score: 2, text: "Endovenoso intermitente" }, { score: 3, text: "Endovenoso contínuo" }, { score: 4, text: "Uso de drogas vasoativas" }] },
];

const FugulinScale = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [scores, setScores] = useState({ mental: 1, oxygenation: 1, vitals: 1, motility: 1, ambulation: 1, feeding: 1, bodyCare: 1, elimination: 1, therapy: 1 });
  const [totalScore, setTotalScore] = useState(9);

  useEffect(() => {
    const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
    setTotalScore(total);
  }, [scores]);

  const handleScoreChange = (category: string, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const getInterpretation = (score: number) => {
    if (score <= 12) return { text: "Cuidados Mínimos", color: "text-blue-600" };
    if (score <= 18) return { text: "Cuidados Intermediários", color: "text-green-600" };
    if (score <= 24) return { text: "Cuidados de Alta Dependência", color: "text-yellow-600" };
    if (score <= 30) return { text: "Cuidados Semi-Intensivos", color: "text-orange-600" };
    return { text: "Cuidados Intensivos", color: "text-red-600" };
  };

  const resetScale = () => {
    setScores({ mental: 1, oxygenation: 1, vitals: 1, motility: 1, ambulation: 1, feeding: 1, bodyCare: 1, elimination: 1, therapy: 1 });
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Escala de Fugulin</h1>
          <p className="text-muted-foreground">Classifique o paciente quanto ao grau de dependência da equipe de enfermagem.</p>
        </div>
        {profile && (
          <FavoriteButton
            userId={profile.id}
            itemId="/scales/fugulin"
            itemType="Escala"
            itemTitle="Escala de Fugulin"
          />
        )}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Accordion type="multiple" defaultValue={fugulinData.map(i => i.id)} className="space-y-4">
            {fugulinData.map(category => (
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
              <CardDescription>Pontuação total e classificação.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-7xl font-bold text-primary">{totalScore}</div>
              <div className={`text-2xl font-semibold ${interpretation.color}`}>{interpretation.text}</div>
              <p className="text-xs text-muted-foreground">
                Classificação do nível de cuidado necessário.
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

export default FugulinScale;