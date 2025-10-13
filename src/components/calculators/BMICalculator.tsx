import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState({ text: "", color: "" });

  useEffect(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (w > 0 && h > 0) {
      const heightInMeters = h / 100;
      const calculatedBmi = w / (heightInMeters * heightInMeters);
      setBmi(calculatedBmi);

      if (calculatedBmi < 18.5) {
        setInterpretation({ text: "Abaixo do peso", color: "text-yellow-600" });
      } else if (calculatedBmi < 25) {
        setInterpretation({ text: "Peso Normal", color: "text-green-600" });
      } else if (calculatedBmi < 30) {
        setInterpretation({ text: "Sobrepeso", color: "text-yellow-600" });
      } else if (calculatedBmi < 35) {
        setInterpretation({ text: "Obesidade Grau I", color: "text-orange-600" });
      } else if (calculatedBmi < 40) {
        setInterpretation({ text: "Obesidade Grau II", color: "text-red-600" });
      } else {
        setInterpretation({ text: "Obesidade Grau III", color: "text-red-700" });
      }
    } else {
      setBmi(null);
      setInterpretation({ text: "", color: "" });
    }
  }, [weight, height]);

  const resetCalculator = () => {
    setWeight("");
    setHeight("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cálculo de IMC (Índice de Massa Corporal)</CardTitle>
        <CardDescription>Insira o peso e a altura para calcular o IMC.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input id="weight" type="number" placeholder="Ex: 70" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="height">Altura (cm)</Label>
            <Input id="height" type="number" placeholder="Ex: 175" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <Button variant="outline" onClick={resetCalculator} className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Limpar
          </Button>
        </div>
        <Card className="bg-primary/10 flex flex-col items-center justify-center p-6 text-center">
          {bmi !== null ? (
            <>
              <p className="text-sm text-muted-foreground">Seu IMC é</p>
              <p className="text-6xl font-bold text-primary my-2">{bmi.toFixed(1)}</p>
              <p className={cn("text-xl font-semibold", interpretation.color)}>{interpretation.text}</p>
            </>
          ) : (
            <p className="text-muted-foreground">Aguardando dados...</p>
          )}
        </Card>
      </CardContent>
    </Card>
  );
};

export default BMICalculator;