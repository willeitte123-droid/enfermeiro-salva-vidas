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

const katzData = [
  { id: "bathing", title: "Tomar Banho", options: [{ score: 1, text: "Independente: toma banho sozinho ou precisa de ajuda apenas para lavar uma parte específica (ex: costas)." }, { score: 0, text: "Dependente: precisa de ajuda para mais de uma parte do corpo ou para entrar/sair do banho." }] },
  { id: "dressing", title: "Vestir-se", options: [{ score: 1, text: "Independente: pega as roupas e se veste sozinho, exceto amarrar sapatos." }, { score: 0, text: "Dependente: não consegue se vestir sozinho ou permanece parcialmente despido." }] },
  { id: "toileting", title: "Uso do Vaso Sanitário", options: [{ score: 1, text: "Independente: vai ao banheiro, se limpa e se ajeita sem ajuda." }, { score: 0, text: "Dependente: precisa de ajuda para ir ao banheiro e se limpar." }] },
  { id: "transferring", title: "Transferência", options: [{ score: 1, text: "Independente: entra e sai da cama e da cadeira sem ajuda." }, { score: 0, text: "Dependente: precisa de ajuda para se mover da cama para a cadeira." }] },
  { id: "continence", title: "Continência", options: [{ score: 1, text: "Independente: controle total da bexiga e do intestino." }, { score: 0, text: "Dependente: incontinência parcial ou total." }] },
  { id: "feeding", title: "Alimentação", options: [{ score: 1, text: "Independente: leva a comida do prato à boca sem ajuda (exceto cortar carne)." }, { score: 0, text: "Dependente: precisa de ajuda para se alimentar." }] },
];

const KatzScale = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [scores, setScores] = useState({ bathing: 1, dressing: 1, toileting: 1, transferring: 1, continence: 1, feeding: 1 });
  const [totalScore, setTotalScore] = useState(6);

  useEffect(() => {
    const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
    setTotalScore(total);
  }, [scores]);

  const handleScoreChange = (category: string, value: number) => {
    setScores(prev => ({ ...prev, [category]: value }));
  };

  const getInterpretation = (score: number) => {
    if (score === 6) return { text: "Independente", color: "text-green-600" };
    if (score >= 4) return { text: "Dependência Moderada", color: "text-yellow-600" };
    return { text: "Dependência Acentuada", color: "text-red-600" };
  };

  const resetScale = () => {
    setScores({ bathing: 1, dressing: 1, toileting: 1, transferring: 1, continence: 1, feeding: 1 });
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Índice de Katz</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/scales/katz"
              itemType="Escala"
              itemTitle="Índice de Katz"
            />
          )}
        </div>
        <p className="text-muted-foreground">Avalie a independência funcional para as Atividades Básicas de Vida Diária (AVDs).</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Accordion type="multiple" defaultValue={katzData.map(i => i.id)} className="space-y-4">
            {katzData.map(category => (
              <AccordionItem key={category.id} value={category.id}>
                <AccordionTrigger className="font-semibold">{category.title} ({scores[category.id as keyof typeof scores]})</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup value={String(scores[category.id as keyof typeof scores])} onValueChange={(v) => handleScoreChange(category.id, Number(v))} className="p-2 space-y-2">
                    {category.options.map(item => (
                      <Label key={item.score} className="flex items-start gap-3 p-3 rounded-md border hover:bg-accent cursor-pointer">
                        <RadioGroupItem value={String(item.score)} className="mt-1" />
                        <div className="flex-1">
                          <span className="font-semibold">{item.score === 1 ? "Independente" : "Dependente"}</span>
                          <p className="text-sm text-muted-foreground">{item.text}</p>
                        </div>
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
              <CardDescription>Pontuação total e nível de dependência.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-7xl font-bold text-primary">{totalScore}</div>
              <div className={`text-2xl font-semibold ${interpretation.color}`}>{interpretation.text}</div>
              <p className="text-xs text-muted-foreground">
                Pontuação máxima: 6. Quanto menor a pontuação, maior a dependência.
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

export default KatzScale;