import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FlaskConical, Syringe, Activity, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FavoriteButton from "@/components/FavoriteButton";

interface Profile {
  id: string;
}

const DoseCalculator = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  // State for Simple Dose Calculator
  const [prescribedDose, setPrescribedDose] = useState("");
  const [prescribedUnit, setPrescribedUnit] = useState("mg");
  const [availableDose, setAvailableDose] = useState("");
  const [availableUnit, setAvailableUnit] = useState("mg");
  const [availableVolume, setAvailableVolume] = useState("");
  const [simpleResult, setSimpleResult] = useState<string | null>(null);

  // State for Infusion Pump Calculator
  const [infusionVolume, setInfusionVolume] = useState("");
  const [infusionTime, setInfusionTime] = useState("");
  const [infusionTimeUnit, setInfusionTimeUnit] = useState("hours");
  const [infusionResult, setInfusionResult] = useState<string | null>(null);

  // State for Vasoactive Drug Calculator
  const [vasoDose, setVasoDose] = useState("");
  const [vasoWeight, setVasoWeight] = useState("");
  const [vasoDrugAmount, setVasoDrugAmount] = useState("");
  const [vasoDrugUnit, setVasoDrugUnit] = useState("mg");
  const [vasoSolutionVolume, setVasoSolutionVolume] = useState("");
  const [vasoResult, setVasoResult] = useState<string | null>(null);
  const [vasoConcentration, setVasoConcentration] = useState<string | null>(null);

  const convertToMg = (value: number, unit: string) => {
    if (unit === "g") return value * 1000;
    if (unit === "mcg") return value / 1000;
    return value;
  };

  const convertToMcg = (value: number, unit: string) => {
    if (unit === "g") return value * 1000000;
    if (unit === "mg") return value * 1000;
    return value;
  };

  // Effect for Simple Dose Calculation
  useEffect(() => {
    const pDose = parseFloat(prescribedDose);
    const aDose = parseFloat(availableDose);
    const aVol = parseFloat(availableVolume);

    if (pDose > 0 && aDose > 0 && aVol > 0) {
      const pDoseInMg = convertToMg(pDose, prescribedUnit);
      const aDoseInMg = convertToMg(aDose, availableUnit);
      const result = (pDoseInMg / aDoseInMg) * aVol;
      setSimpleResult(result.toFixed(2));
    } else {
      setSimpleResult(null);
    }
  }, [prescribedDose, prescribedUnit, availableDose, availableUnit, availableVolume]);

  // Effect for Infusion Pump Calculation
  useEffect(() => {
    const iVol = parseFloat(infusionVolume);
    const iTime = parseFloat(infusionTime);

    if (iVol > 0 && iTime > 0) {
      const timeInHours = infusionTimeUnit === "minutes" ? iTime / 60 : iTime;
      const result = iVol / timeInHours;
      setInfusionResult(result.toFixed(1));
    } else {
      setInfusionResult(null);
    }
  }, [infusionVolume, infusionTime, infusionTimeUnit]);

  // Effect for Vasoactive Drug Calculation
  useEffect(() => {
    const vDose = parseFloat(vasoDose);
    const vWeight = parseFloat(vasoWeight);
    const vDrugAmount = parseFloat(vasoDrugAmount);
    const vSolutionVolume = parseFloat(vasoSolutionVolume);

    if (vDose > 0 && vWeight > 0 && vDrugAmount > 0 && vSolutionVolume > 0) {
      const totalDoseMcgMin = vDose * vWeight;
      const totalDrugInMcg = convertToMcg(vDrugAmount, vasoDrugUnit);
      const concentrationMcgMl = totalDrugInMcg / vSolutionVolume;
      const rateMlMin = totalDoseMcgMin / concentrationMcgMl;
      const rateMlHour = rateMlMin * 60;

      setVasoConcentration(concentrationMcgMl.toFixed(2));
      setVasoResult(rateMlHour.toFixed(1));
    } else {
      setVasoResult(null);
      setVasoConcentration(null);
    }
  }, [vasoDose, vasoWeight, vasoDrugAmount, vasoDrugUnit, vasoSolutionVolume]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Calculadora de Doses</h1>
          <p className="text-muted-foreground">Calcule doses, diluições e taxas de infusão com precisão.</p>
        </div>
        {profile && (
          <FavoriteButton
            userId={profile.id}
            itemId="/tools/dose-calculator"
            itemType="Ferramenta"
            itemTitle="Calculadora de Doses"
          />
        )}
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Esta ferramenta é um auxílio. <strong>SEMPRE</strong> confira os cálculos e siga os protocolos da sua instituição. A responsabilidade final é do profissional.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="simple" className="w-full">
        <TabsList className="grid w-full grid-cols-3 gap-2">
          <TabsTrigger value="simple" className="py-2 font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 data-[state=active]:bg-blue-600 data-[state=active]:text-white rounded-md">Dose Simples</TabsTrigger>
          <TabsTrigger value="pump" className="py-2 font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md">Bomba de Infusão</TabsTrigger>
          <TabsTrigger value="vasoactive" className="py-2 font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-md">Drogas Vasoativas</TabsTrigger>
        </TabsList>

        {/* Simple Dose Calculator */}
        <TabsContent value="simple">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Syringe className="h-5 w-5 text-primary" />Cálculo de Dose Simples</CardTitle>
              <CardDescription>Calcule o volume a ser administrado a partir da dose prescrita e da apresentação disponível.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Prescrição</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="Dose" value={prescribedDose} onChange={e => setPrescribedDose(e.target.value)} />
                    <Select value={prescribedUnit} onValueChange={setPrescribedUnit}>
                      <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="g">g</SelectItem><SelectItem value="mg">mg</SelectItem><SelectItem value="mcg">mcg</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Apresentação Disponível</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="Concentração" value={availableDose} onChange={e => setAvailableDose(e.target.value)} />
                    <Select value={availableUnit} onValueChange={setAvailableUnit}>
                      <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="g">g</SelectItem><SelectItem value="mg">mg</SelectItem><SelectItem value="mcg">mcg</SelectItem></SelectContent>
                    </Select>
                    <Input type="number" placeholder="Volume (mL)" value={availableVolume} onChange={e => setAvailableVolume(e.target.value)} />
                  </div>
                </div>
              </div>
              <Card className="bg-primary/10 flex flex-col items-center justify-center p-6">
                <p className="text-sm text-muted-foreground mb-2">Administrar</p>
                <p className="text-5xl font-bold text-primary">{simpleResult || "--"}</p>
                <p className="text-lg text-muted-foreground">mL</p>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Infusion Pump Calculator */}
        <TabsContent value="pump">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-primary" />Bomba de Infusão Contínua (BIC)</CardTitle>
              <CardDescription>Calcule a velocidade de infusão em mL/hora.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="infusion-volume">Volume Total (mL)</Label>
                  <Input id="infusion-volume" type="number" placeholder="Ex: 1000" value={infusionVolume} onChange={e => setInfusionVolume(e.target.value)} />
                </div>
                <div>
                  <Label>Tempo Total</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="Ex: 8" value={infusionTime} onChange={e => setInfusionTime(e.target.value)} />
                    <Select value={infusionTimeUnit} onValueChange={setInfusionTimeUnit}>
                      <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="hours">Horas</SelectItem><SelectItem value="minutes">Minutos</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Card className="bg-primary/10 flex flex-col items-center justify-center p-6">
                <p className="text-sm text-muted-foreground mb-2">Velocidade de Infusão</p>
                <p className="text-5xl font-bold text-primary">{infusionResult || "--"}</p>
                <p className="text-lg text-muted-foreground">mL/h</p>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vasoactive Drug Calculator */}
        <TabsContent value="vasoactive">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FlaskConical className="h-5 w-5 text-primary" />Drogas Vasoativas (mcg/kg/min)</CardTitle>
              <CardDescription>Calcule a velocidade de infusão para drogas prescritas em mcg/kg/min.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Dose Prescrita (mcg/kg/min)</Label>
                  <Input type="number" placeholder="Ex: 0.1" value={vasoDose} onChange={e => setVasoDose(e.target.value)} />
                </div>
                <div>
                  <Label>Peso do Paciente (kg)</Label>
                  <Input type="number" placeholder="Ex: 70" value={vasoWeight} onChange={e => setVasoWeight(e.target.value)} />
                </div>
                <div>
                  <Label>Diluição da Droga</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="Qtd. Droga" value={vasoDrugAmount} onChange={e => setVasoDrugAmount(e.target.value)} />
                    <Select value={vasoDrugUnit} onValueChange={setVasoDrugUnit}>
                      <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="g">g</SelectItem><SelectItem value="mg">mg</SelectItem><SelectItem value="mcg">mcg</SelectItem></SelectContent>
                    </Select>
                    <Input type="number" placeholder="Volume Final (mL)" value={vasoSolutionVolume} onChange={e => setVasoSolutionVolume(e.target.value)} />
                  </div>
                </div>
              </div>
              <Card className="bg-primary/10 flex flex-col items-center justify-center p-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Velocidade de Infusão</p>
                  <p className="text-5xl font-bold text-primary">{vasoResult || "--"}</p>
                  <p className="text-lg text-muted-foreground">mL/h</p>
                </div>
                <div className="text-center border-t border-primary/20 pt-4 w-full">
                  <p className="text-xs text-muted-foreground">Concentração da Solução</p>
                  <p className="text-lg font-semibold text-primary">{vasoConcentration || "--"} mcg/mL</p>
                </div>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DoseCalculator;