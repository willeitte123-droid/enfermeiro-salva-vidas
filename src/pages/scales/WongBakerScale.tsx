import { useState } from "react";
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

const facesData = [
  { score: 0, emoji: "😊", description: "Sem dor", color: "bg-green-100 border-green-300" },
  { score: 2, emoji: "🙂", description: "Dói um pouco", color: "bg-lime-100 border-lime-300" },
  { score: 4, emoji: "😐", description: "Dói um pouco mais", color: "bg-yellow-100 border-yellow-300" },
  { score: 6, emoji: "😕", description: "Dói ainda mais", color: "bg-orange-100 border-orange-300" },
  { score: 8, emoji: "😟", description: "Dói muito", color: "bg-red-100 border-red-300" },
  { score: 10, emoji: "😭", description: "Dói o máximo possível", color: "bg-red-200 border-red-400" },
];

const WongBakerScale = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [score, setScore] = useState(0);

  const selectedFace = facesData.find(f => f.score === score);

  const resetScale = () => {
    setScore(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Escala de Faces de Wong-Baker</h1>
          <p className="text-muted-foreground">Avalie a intensidade da dor de forma visual.</p>
        </div>
        {profile && (
          <FavoriteButton
            userId={profile.id}
            itemId="/scales/wong-baker"
            itemType="Escala"
            itemTitle="Escala de Faces de Wong-Baker"
          />
        )}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Selecione a face que melhor representa a dor</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={String(score)} onValueChange={(v) => setScore(Number(v))}>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {facesData.map(face => (
                    <Label key={face.score} className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all ${face.color} ${score === face.score ? 'ring-2 ring-primary ring-offset-2' : ''}`}>
                      <RadioGroupItem value={String(face.score)} className="sr-only" />
                      <div className="text-6xl mb-2">{face.emoji}</div>
                      <span className="font-semibold text-center text-sm text-foreground">({face.score}) {face.description}</span>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resultado</CardTitle>
              <CardDescription>Pontuação de dor selecionada.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-7xl font-bold text-primary">{selectedFace?.score}</div>
              <div className="text-6xl">{selectedFace?.emoji}</div>
              <div className="text-2xl font-semibold">{selectedFace?.description}</div>
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

export default WongBakerScale;