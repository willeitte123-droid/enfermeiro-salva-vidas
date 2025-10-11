import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Droplet, Activity, Info } from "lucide-react";

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
              <Label htmlFor="factor">Tipo de Equipo</Label>
              <select
                id="factor"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={dropFactor}
                onChange={(e) => setDropFactor(e.target.value)}
              >
                <option value="20">Macrogotas - 20 gotas/mL (adulto)</option>
                <option value="60">Microgotas - 60 gotas/mL (precisão)</option>
                <option value="15">Equipo Pediátrico - 15 gotas/mL</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Resultados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result !== null ? (
              <div className="space-y-6">
                <div className="text-center py-4 border-b">
                  <div className="text-5xl font-bold text-primary mb-2">{result}</div>
                  <div className="text-lg text-muted-foreground">
                    {dropFactor === "60" ? "microgotas/minuto" : "gotas/minuto"}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl font-semibold text-foreground">{mlPerHour}</div>
                    <div className="text-sm text-muted-foreground mt-1">mL/hora</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <div className="text-2xl font-semibold text-foreground">{dropFactor}</div>
                    <div className="text-sm text-muted-foreground mt-1">fator do equipo</div>
                  </div>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Monitore regularmente a infusão e ajuste conforme necessário. 
                    Sempre confira com dois profissionais em medicações de alto risco.
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
        <Card>
          <CardHeader>
            <CardTitle>Fórmulas de Cálculo</CardTitle>
            <CardDescription>Entenda as fórmulas utilizadas para cada tipo de equipo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Fórmula Geral</h3>
                <Badge variant="outline">Universal</Badge>
              </div>
              <p className="font-mono text-sm">gotas/min = (Volume × Fator) ÷ (Tempo × 60)</p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Macrogotas</h3>
                <Badge variant="secondary">20 gts/mL</Badge>
              </div>
              <p className="font-mono text-sm">gotas/min = (Volume × 20) ÷ (Tempo × 60)</p>
              <p className="text-xs text-muted-foreground mt-2">Simplificado: Volume ÷ (Tempo × 3)</p>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Microgotas</h3>
                <Badge variant="secondary">60 gts/mL</Badge>
              </div>
              <p className="font-mono text-sm">μgts/min = (Volume × 60) ÷ (Tempo × 60)</p>
              <p className="text-xs text-muted-foreground mt-2">Simplificado: Volume ÷ Tempo</p>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Equipo Pediátrico</h3>
                <Badge variant="secondary">15 gts/mL</Badge>
              </div>
              <p className="font-mono text-sm">gotas/min = (Volume × 15) ÷ (Tempo × 60)</p>
              <p className="text-xs text-muted-foreground mt-2">Simplificado: Volume ÷ (Tempo × 4)</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Guia de Uso dos Equipos</CardTitle>
            <CardDescription>Quando usar cada tipo de equipo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 border border-primary/20 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Macrogotas (20 gts/mL)</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Infusões de maior volume (&gt;100 mL)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Hidratação venosa padrão</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Hemoderivados e hemocomponentes</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border border-secondary/20 rounded-lg">
                <h4 className="font-semibold text-secondary mb-2">Microgotas (60 gts/mL)</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Medicações que exigem controle rigoroso</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Drogas vasoativas e inotrópicos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Pacientes com restrição hídrica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-0.5">•</span>
                    <span>Neonatologia e pediatria</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border border-muted-foreground/20 rounded-lg">
                <h4 className="font-semibold text-muted-foreground mb-2">Equipo Pediátrico (15 gts/mL)</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-0.5">•</span>
                    <span>Uso específico em pediatria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground mt-0.5">•</span>
                    <span>Menor volume por gota</span>
                  </li>
                </ul>
              </div>
            </div>

            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <strong>Importante:</strong> Sempre verifique o tipo de equipo antes de iniciar a infusão. 
                O erro na identificação pode causar administração incorreta do volume.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Calculator;
