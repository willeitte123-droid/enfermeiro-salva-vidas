import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShieldCheck } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";

interface Profile {
  id: string;
}

const asaData = [
  { class: 1, definition: "Paciente saudável", examples: "Saudável, não fumante, consumo mínimo de álcool." },
  { class: 2, definition: "Paciente com doença sistêmica leve", examples: "Doença leve sem limitações funcionais. Ex: fumante, gestante, obeso (IMC < 40), DM ou HAS bem controlada." },
  { class: 3, definition: "Paciente com doença sistêmica grave", examples: "Limitação funcional significativa. Ex: DM ou HAS mal controlada, DPOC, história de IAM (>3 meses), marcapasso." },
  { class: 4, definition: "Paciente com doença sistêmica grave que é uma ameaça constante à vida", examples: "Ex: IAM recente (<3 meses), sepse, CIVD, insuficiência renal em diálise." },
  { class: 5, definition: "Paciente moribundo que não se espera que sobreviva sem a cirurgia", examples: "Ex: ruptura de aneurisma, trauma maciço, hemorragia intracraniana com efeito de massa." },
  { class: 6, definition: "Paciente com morte cerebral declarada cujos órgãos estão sendo removidos para doação", examples: "Doação de órgãos." },
];

const AsaScale = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [selectedClass, setSelectedClass] = useState(1);
  const [selectedItem, setSelectedItem] = useState(asaData.find(i => i.class === 1));

  useEffect(() => {
    setSelectedItem(asaData.find(i => i.class === selectedClass));
  }, [selectedClass]);

  const resetScale = () => {
    setSelectedClass(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Classificação do Estado Físico (ASA)</h1>
          <p className="text-muted-foreground">Avalie o risco pré-operatório do paciente.</p>
        </div>
        {profile && (
          <FavoriteButton
            userId={profile.id}
            itemId="/scales/asa"
            itemType="Escala"
            itemTitle="Classificação ASA"
          />
        )}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Selecione a Classe ASA</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={String(selectedClass)} onValueChange={(v) => setSelectedClass(Number(v))} className="space-y-2">
                {asaData.map(item => (
                  <Label key={item.class} className="flex items-start gap-4 p-4 rounded-md border hover:bg-accent cursor-pointer">
                    <RadioGroupItem value={String(item.class)} className="mt-1" />
                    <div className="flex-1">
                      <span className="font-semibold">ASA {item.class}: {item.definition}</span>
                      <p className="text-sm text-muted-foreground mt-1"><strong>Ex:</strong> {item.examples}</p>
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
              <CardDescription>Classe selecionada e definição.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-7xl font-bold text-primary">ASA {selectedItem?.class}</div>
              <div className="text-xl font-semibold">{selectedItem?.definition}</div>
              <p className="text-sm text-muted-foreground min-h-[60px]">
                <strong>Exemplos:</strong> {selectedItem?.examples}
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

export default AsaScale;