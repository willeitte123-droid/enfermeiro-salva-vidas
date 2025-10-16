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

const glasgowData = {
  ocular: [
    { score: 4, text: "Espontânea" },
    { score: 3, text: "Ao comando verbal" },
    { score: 2, text: "À pressão" },
    { score: 1, text: "Nenhuma" },
  ],
  verbal: [
    { score: 5, text: "Orientado" },
    { score: 4, text: "Confuso" },
    { score: 3, text: "Palavras inapropriadas" },
    { score: 2, text: "Sons incompreensíveis" },
    { score: 1, text: "Nenhuma" },
  ],
  motor: [
    { score: 6, text: "Obedece a comandos" },
    { score: 5, text: "Localiza a dor" },
    { score: 4, text: "Retirada inespecífica (flexão normal)" },
    { score: 3, text: "Flexão anormal (decorticação)" },
    { score: 2, text: "Extensão anormal (descerebração)" },
    { score: 1, text: "Nenhuma" },
  ],
  pupil: [
    { score: 2, text: "Ambas não reativas" },
    { score: 1, text: "Apenas uma reativa" },
    { score: 0, text: "Ambas reativas" },
  ],
};

const GlasgowScale = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [ocularScore, setOcularScore] = useState(4);
  const [verbalScore, setVerbalScore] = useState(5);
  const [motorScore, setMotorScore] = useState(6);
  const [pupilScore, setPupilScore] = useState(0);
  const [totalScore, setTotalScore] = useState(15);

  useEffect(() => {
    const score = ocularScore + verbalScore + motorScore - pupilScore;
    setTotalScore(score);
  }, [ocularScore, verbalScore, motorScore, pupilScore]);

  const getInterpretation = (score: number) => {
    if (score >= 13) return { text: "Leve", color: "text-green-600" };
    if (score >= 9) return { text: "Moderado", color: "text-yellow-600" };
    return { text: "Grave", color: "text-red-600" };
  };

  const resetScale = () => {
    setOcularScore(4);
    setVerbalScore(5);
    setMotorScore(6);
    setPupilScore(0);
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Escala de Coma de Glasgow (ECG-P)</h1>
          <p className="text-muted-foreground">Avalie o nível de consciência e a reatividade pupilar.</p>
        </div>
        {profile && (
          <FavoriteButton
            userId={profile.id}
            itemId="/scales/glasgow"
            itemType="Escala"
            itemTitle="Escala de Coma de Glasgow"
          />
        )}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Accordion type="multiple" defaultValue={["ocular", "verbal", "motor", "pupil"]} className="space-y-4">
            {/* Ocular */}
            <AccordionItem value="ocular">
              <AccordionTrigger className="font-semibold">Abertura Ocular ({ocularScore})</AccordionTrigger>
              <AccordionContent>
                <RadioGroup value={String(ocularScore)} onValueChange={(v) => setOcularScore(Number(v))} className="p-2 space-y-2">
                  {glasgowData.ocular.map(item => (
                    <Label key={item.score} className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value={String(item.score)} />
                      <span>({item.score}) {item.text}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
            {/* Verbal */}
            <AccordionItem value="verbal">
              <AccordionTrigger className="font-semibold">Resposta Verbal ({verbalScore})</AccordionTrigger>
              <AccordionContent>
                <RadioGroup value={String(verbalScore)} onValueChange={(v) => setVerbalScore(Number(v))} className="p-2 space-y-2">
                  {glasgowData.verbal.map(item => (
                    <Label key={item.score} className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value={String(item.score)} />
                      <span>({item.score}) {item.text}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
            {/* Motor */}
            <AccordionItem value="motor">
              <AccordionTrigger className="font-semibold">Resposta Motora ({motorScore})</AccordionTrigger>
              <AccordionContent>
                <RadioGroup value={String(motorScore)} onValueChange={(v) => setMotorScore(Number(v))} className="p-2 space-y-2">
                  {glasgowData.motor.map(item => (
                    <Label key={item.score} className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value={String(item.score)} />
                      <span>({item.score}) {item.text}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
            {/* Pupil */}
            <AccordionItem value="pupil">
              <AccordionTrigger className="font-semibold">Reatividade Pupilar (-{pupilScore})</AccordionTrigger>
              <AccordionContent>
                <RadioGroup value={String(pupilScore)} onValueChange={(v) => setPupilScore(Number(v))} className="p-2 space-y-2">
                  {glasgowData.pupil.map(item => (
                    <Label key={item.score} className="flex items-center gap-3 p-3 rounded-md border hover:bg-accent cursor-pointer">
                      <RadioGroupItem value={String(item.score)} />
                      <span>({item.score}) {item.text}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>Pontuação final e classificação.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-7xl font-bold text-primary">{totalScore}</div>
              <div className={`text-2xl font-semibold ${interpretation.color}`}>{interpretation.text}</div>
              <p className="text-xs text-muted-foreground">
                ECG-P = Ocular ({ocularScore}) + Verbal ({verbalScore}) + Motor ({motorScore}) - Pupilar ({pupilScore})
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

export default GlasgowScale;