import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, RefreshCw, Info } from "lucide-react";
import { format, addDays, addMonths, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const PregnancyCalculator = () => {
  const [dum, setDum] = useState<Date | undefined>(undefined);
  const [dpp, setDpp] = useState<string | null>(null);
  const [gestationalAge, setGestationalAge] = useState<string | null>(null);
  const [trimester, setTrimester] = useState<string | null>(null);

  useEffect(() => {
    if (dum) {
      const dppDate = addMonths(addDays(dum, 7), 9);
      setDpp(format(dppDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }));

      const today = new Date();
      const totalDays = differenceInDays(today, dum);
      if (totalDays >= 0) {
        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;
        setGestationalAge(`${weeks} semanas e ${days} dias`);

        if (weeks < 14) setTrimester("1º Trimestre");
        else if (weeks < 28) setTrimester("2º Trimestre");
        else setTrimester("3º Trimestre");
      } else {
        setGestationalAge(null);
        setTrimester(null);
      }
    } else {
      setDpp(null);
      setGestationalAge(null);
      setTrimester(null);
    }
  }, [dum]);

  const resetCalculator = () => {
    setDum(undefined);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Calculadora Gestacional</CardTitle>
          <CardDescription>Calcule a DPP e a Idade Gestacional (IG) a partir da DUM.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Data da Última Menstruação (DUM)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal mt-2", !dum && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dum ? format(dum, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dum} onSelect={setDum} initialFocus locale={ptBR} /></PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <Card className="bg-primary/10 p-6 text-center">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:border-r border-primary/20 sm:pr-4">
                  <p className="text-sm text-muted-foreground">Data Provável do Parto (DPP)</p>
                  <p className="text-2xl font-bold text-primary">{dpp || "--"}</p>
                </div>
                <div className="sm:border-r border-primary/20 sm:pr-4">
                  <p className="text-sm text-muted-foreground">Idade Gestacional (Hoje)</p>
                  <p className="text-2xl font-bold text-primary">{gestationalAge || "--"}</p>
                </div>
                <div className="sm:pl-4">
                  <p className="text-sm text-muted-foreground">Trimestre Atual</p>
                  <p className="text-2xl font-bold text-primary">{trimester || "--"}</p>
                </div>
              </div>
            </Card>
            <Button variant="outline" onClick={resetCalculator} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary"/> Observações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• O cálculo por DUM (Regra de Naegele) assume um ciclo menstrual regular de 28 dias. Para ciclos irregulares, o cálculo por USG é mais confiável.</p>
          <p>• O ultrassom do <strong>primeiro trimestre</strong> (idealmente entre 7 e 12 semanas) é o método mais acurado para datar a gestação.</p>
          <p>• <strong>1º Trimestre:</strong> até 13 semanas e 6 dias.</p>
          <p>• <strong>2º Trimestre:</strong> de 14 semanas a 27 semanas e 6 dias.</p>
          <p>• <strong>3º Trimestre:</strong> a partir de 28 semanas.</p>
          <p>• <strong>Termo:</strong> Uma gestação é considerada 'a termo' entre 39 semanas e 40 semanas e 6 dias.</p>
        </CardContent>
      </Card>
    </>
  );
};

export default PregnancyCalculator;