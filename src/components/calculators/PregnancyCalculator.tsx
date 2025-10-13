import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, addDays, addMonths, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

const PregnancyCalculator = () => {
  const [dum, setDum] = useState<Date | undefined>(undefined);
  const [dpp, setDpp] = useState<string | null>(null);
  const [gestationalAge, setGestationalAge] = useState<string | null>(null);

  useEffect(() => {
    if (dum) {
      // Calculate DPP using Naegele's Rule
      const dppDate = addMonths(addDays(dum, 7), 9);
      setDpp(format(dppDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }));

      // Calculate Gestational Age
      const today = new Date();
      const totalDays = differenceInDays(today, dum);
      if (totalDays >= 0) {
        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;
        setGestationalAge(`${weeks} semanas e ${days} dias`);
      } else {
        setGestationalAge(null);
      }
    } else {
      setDpp(null);
      setGestationalAge(null);
    }
  }, [dum]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculadora Gestacional</CardTitle>
        <CardDescription>Calcule a Data Provável do Parto (DPP) e a Idade Gestacional (IG) a partir da DUM.</CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4 flex flex-col justify-center">
          <p className="font-medium">Selecione a Data da Última Menstruação (DUM):</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dum && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dum ? format(dum, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dum}
                onSelect={setDum}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-4">
          <Card className="bg-primary/10 p-6 text-center h-full flex flex-col justify-center">
            <div className="border-b border-primary/20 pb-4">
              <p className="text-sm text-muted-foreground">Data Provável do Parto (DPP)</p>
              <p className="text-2xl font-bold text-primary">{dpp || "--"}</p>
            </div>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground">Idade Gestacional (Hoje)</p>
              <p className="text-2xl font-bold text-primary">{gestationalAge || "--"}</p>
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default PregnancyCalculator;