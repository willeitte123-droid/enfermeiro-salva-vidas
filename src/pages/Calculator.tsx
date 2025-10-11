import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Droplet, Activity, Info, FlaskConical, BookOpen, CheckSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Calculator = () => {
  const [volume, setVolume] = useState("");
  const [time, setTime] = useState("");
  const [dropFactor, setDropFactor] = useState("20");

  const calculateDropRate = () => {
    const v = parseFloat(volume);
    const t = parseFloat(time);
    const factor = parseInt(dropFactor);

    if (!v || !t || !factor || v <= 0 || t <= 0) return null;

    const rate = (v * factor) / (t * 60);
    return rate.toFixed(1);
  };

  const calculateMlPerHour = () => {
    const v = parseFloat(volume);
    const t = parseFloat(time);
    if (!v || !t || v <= 0 || t <= 0) return null;
    return Math.round(v / t);
  };

  const result = calculateDropRate();
  const mlPerHour = calculateMlPerHour();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Calculadora de Gotejamento</h1>
        <p className="text-muted-foreground">Calcule velocidades de infusão para diferentes tipos de equipo</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-primary" />
              Dados da Infusão
            </CardTitle>
            <CardDescription>Insira os valores para calcular o gotejamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="volume">Volume (mL)</Label>
              <Input
                id="volume"
                type="number"
                placeholder="Ex: 500"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Tempo (horas)</Label>
              <Input
                id="time"
                type="number"
                placeholder="Ex: 8"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de Equipo</Label>
              <Select value={dropFactor} onValueChange={setDropFactor}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de equipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">Macrogotas - 20 gotas/mL</SelectItem>
                  <SelectItem value="60">Microgotas - 60 gotas/mL</SelectItem>
                  <SelectItem value="15">Equipo Pediátrico - 15 gotas/mL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/10 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Resultados
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {result !== null ? (
              <div className="space-y-6">
                <div className="text-center py-4 border-b border-primary/20">
                  <div className="text-6xl font-bold text-primary mb-2">{result}</div>
                  <div className="text-lg text-muted-foreground">
                    {dropFactor === "60" ? "microgotas/minuto" : "gotas/minuto"}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg shadow-sm">
                    <div className="text-2xl font-semibold text-foreground">{mlPerHour}</div>
                    <div className="text-sm text-muted-foreground mt-1">mL/hora</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg shadow-sm">
                    <div className="text-2xl font-semibold text-foreground">{dropFactor}</div>
                    <div className="text-sm text-muted-foreground mt-1">gotas/mL</div>
                  </div>
                </div>

                <Alert className="bg-primary/5 border-primary/20 text-primary-foreground">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-sm text-foreground">
                    Monitore regularmente a infusão e ajuste conforme necessário.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Preencha todos os campos para calcular
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-secondary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FlaskConical className="h-5 w-5 text-secondary"/> Fórmulas de Cálculo</CardTitle>
            <CardDescription>Entenda as fórmulas utilizadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-background/70 rounded-lg">
              <h3 className="font-semibold text-sm">Fórmula Geral</h3>
              <p className="font-mono text-xs text-muted-foreground">gotas/min = (Volume × Fator) ÷ (Tempo × 60)</p>
            </div>
            <div className="p-3 bg-background/70 rounded-lg">
              <h3 className="font-semibold text-sm">Macrogotas (20 gts/mL)</h3>
              <p className="text-xs text-muted-foreground">Simplificado: Volume ÷ (Tempo × 3)</p>
            </div>
            <div className="p-3 bg-background/70 rounded-lg">
              <h3 className="font-semibold text-sm">Microgotas (60 gts/mL)</h3>
              <p className="text-xs text-muted-foreground">Simplificado: Volume ÷ Tempo</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-accent-foreground"/> Guia de Uso</CardTitle>
            <CardDescription>Quando usar cada tipo de equipo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1 text-sm">
              <h4 className="font-semibold text-foreground">Macrogotas (20 gts/mL)</h4>
              <p className="text-muted-foreground">Infusões de maior volume, hidratação padrão, hemoderivados.</p>
            </div>
            <div className="space-y-1 text-sm">
              <h4 className="font-semibold text-foreground">Microgotas (60 gts/mL)</h4>
              <p className="text-muted-foreground">Medicações de precisão, drogas vasoativas, pediatria, restrição hídrica.</p>
            </div>
            <Alert className="bg-background/70">
              <CheckSquare className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>Importante:</strong> Sempre verifique o tipo de equipo antes de iniciar a infusão.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;