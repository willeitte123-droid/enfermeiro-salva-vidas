import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";

interface Profile {
  id: string;
}

const rassData = [
  { score: 4, term: "Combativo", description: "Agressivo, violento, perigo imediato para a equipe." },
  { score: 3, term: "Muito Agitado", description: "Puxa ou remove tubos e cateteres; agressivo." },
  { score: 2, term: "Agitado", description: "Movimentos excessivos e sem propósito; briga com o ventilador." },
  { score: 1, term: "Inquieto", description: "Ansioso, mas sem movimentos agressivos ou vigorosos." },
  { score: 0, term: "Alerta e Calmo", description: "Normal." },
  { score: -1, term: "Sonolento", description: "Não totalmente alerta, mas desperta com estímulo verbal (contato visual > 10s)." },
  { score: -2, term: "Sedação Leve", description: "Desperta com estímulo verbal (contato visual < 10s)." },
  { score: -3, term: "Sedação Moderada", description: "Movimento ou abertura ocular ao estímulo verbal, mas sem contato visual." },
  { score: -4, term: "Sedação Profunda", description: "Nenhuma resposta ao estímulo verbal, mas movimento ou abertura ocular ao estímulo físico." },
  { score: -5, term: "Não Despertável", description: "Nenhuma resposta a estímulo verbal ou físico." },
];

const RassScale = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [score, setScore] = useState(0);
  const [selectedItem, setSelectedItem] = useState(rassData.find(i => i.score === 0));

  useEffect(() => {
    setSelectedItem(rassData.find(i => i.score === score));
  }, [score]);

  const resetScale = () => {
    setScore(0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Escala de Agitação e Sedação de Richmond (RASS)</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/scales/rass"
              itemType="Escala"
              itemTitle="Escala de RASS"
            />
          )}
        </div>
        <p className="text-muted-foreground">Avalie o nível de agitação ou sedação de pacientes críticos.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Nível de Consciência</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={String(score)} onValueChange={(v) => setScore(Number(v))} className="space-y-2">
                {rassData.map(item => (
                  <Label key={item.score} className="flex items-start gap-4 p-4 rounded-md border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={String(item.score)} className="mt-1" />
                    <div className="flex-1">
                      <span className="font-semibold">({item.score > 0 ? `+${item.score}` : item.score}) {item.term}</span>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>Pontuação e classificação.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-7xl font-bold text-primary">{score > 0 ? `+${score}` : score}</div>
              <div className="text-2xl font-semibold">{selectedItem?.term}</div>
              <p className="text-sm text-muted-foreground min-h-[40px]">
                {selectedItem?.description}
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

export default RassScale;