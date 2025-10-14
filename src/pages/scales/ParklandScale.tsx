import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw, Droplets, Info } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Profile {
  id: string;
}

const ParklandScale = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [weight, setWeight] = useState("");
  const [surfaceArea, setSurfaceArea] = useState("");
  const [results, setResults] = useState({
    totalVolume: 0,
    first8hVolume: 0,
    first8hRate: 0,
    next16hVolume: 0,
    next16hRate: 0,
  });

  useEffect(() => {
    const w = parseFloat(weight);
    const sa = parseFloat(surfaceArea);

    if (w > 0 && sa > 0) {
      const totalVolume = 4 * w * sa;
      const first8hVolume = totalVolume / 2;
      const first8hRate = first8hVolume / 8;
      const next16hVolume = totalVolume / 2;
      const next16hRate = next16hVolume / 16;
      setResults({ totalVolume, first8hVolume, first8hRate, next16hVolume, next16hRate });
    } else {
      setResults({ totalVolume: 0, first8hVolume: 0, first8hRate: 0, next16hVolume: 0, next16hRate: 0 });
    }
  }, [weight, surfaceArea]);

  const resetScale = () => {
    setWeight("");
    setSurfaceArea("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Fórmula de Parkland</h1>
          <p className="text-muted-foreground">Calcule a reposição volêmica com Ringer Lactato para grandes queimados.</p>
        </div>
        {profile && (
          <FavoriteButton
            userId={profile.id}
            itemId="/scales/parkland"
            itemType="Escala"
            itemTitle="Fórmula de Parkland"
          />
        )}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dados do Paciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input id="weight" type="number" placeholder="Ex: 70" value={weight} onChange={(e) => setWeight(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surfaceArea">Superfície Corporal Queimada (%)</Label>
                <Input id="surfaceArea" type="number" placeholder="Ex: 36" value={surfaceArea} onChange={(e) => setSurfaceArea(e.target.value)} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Info className="h-4 w-4"/> Regra dos Nove (Adultos)</CardTitle>
              <CardDescription>Referência rápida para estimar a %SCQ.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Área do Corpo</TableHead><TableHead className="text-right">%</TableHead></TableRow></TableHeader>
                <TableBody>
                  <TableRow><TableCell>Cabeça e Pescoço</TableCell><TableCell className="text-right">9%</TableCell></TableRow>
                  <TableRow><TableCell>Tronco Anterior</TableCell><TableCell className="text-right">18%</TableCell></TableRow>
                  <TableRow><TableCell>Tronco Posterior</TableCell><TableCell className="text-right">18%</TableCell></TableRow>
                  <TableRow><TableCell>Cada Membro Superior</TableCell><TableCell className="text-right">9%</TableCell></TableRow>
                  <TableRow><TableCell>Cada Membro Inferior</TableCell><TableCell className="text-right">18%</TableCell></TableRow>
                  <TableRow><TableCell>Genitália</TableCell><TableCell className="text-right">1%</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card className="sticky top-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-300">Plano de Hidratação</CardTitle>
              <CardDescription className="text-red-900/80 dark:text-red-200/80">Volume de Ringer Lactato a ser infundido.</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Volume Total em 24h</p>
                <p className="text-4xl font-bold text-primary">{results.totalVolume.toFixed(0)} mL</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Primeiras 8 horas</p>
                <p className="text-2xl font-semibold text-primary">{results.first8hVolume.toFixed(0)} mL</p>
                <p className="text-lg font-bold text-primary/80">~ {results.first8hRate.toFixed(0)} mL/h</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Próximas 16 horas</p>
                <p className="text-2xl font-semibold text-primary">{results.next16hVolume.toFixed(0)} mL</p>
                <p className="text-lg font-bold text-primary/80">~ {results.next16hRate.toFixed(0)} mL/h</p>
              </div>
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

export default ParklandScale;