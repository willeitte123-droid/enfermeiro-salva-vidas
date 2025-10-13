import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, RefreshCw, Info, Baby, BookOpen, ClipboardList } from "lucide-react";
import { format, addDays, addMonths, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
      <Card className="bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-pink-700 dark:text-pink-300">
            <Baby />
            Calculadora Gestacional
          </CardTitle>
          <CardDescription className="text-pink-900/80 dark:text-pink-200/80">Calcule a DPP e a Idade Gestacional (IG) a partir da DUM.</CardDescription>
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
            <Card className="bg-background/70 p-6 text-center">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:border-r border-border sm:pr-4">
                  <p className="text-sm text-muted-foreground">Data Provável do Parto (DPP)</p>
                  <p className="text-2xl font-bold text-primary">{dpp || "--"}</p>
                </div>
                <div className="sm:border-r border-border sm:pr-4">
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
          <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary"/> Informações Clínicas Relevantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>• O cálculo por DUM (Regra de Naegele) assume um ciclo menstrual regular de 28 dias.</p>
          <p>• O ultrassom do <strong>primeiro trimestre</strong> (idealmente entre 7 e 12 semanas, usando o Comprimento Cabeça-Nádega - CCN) é o método mais acurado para datar a gestação e deve ser usado para corrigir a DUM se a discrepância for > 7 dias.</p>
          
          <h3 className="font-semibold text-foreground pt-4 flex items-center gap-2"><ClipboardList className="h-4 w-4 text-primary"/> Marcos Gestacionais por Trimestre</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>1º Trimestre (até 13s 6d)</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Exames Iniciais:</strong> Tipagem/Rh, Coombs Indireto, Hemograma, Glicemia de Jejum, Sorologias (HIV, VDRL, HBsAg, Toxo, Rubéola, CMV), Urina I e Urocultura.</li>
                  <li><strong>Orientação:</strong> Iniciar <strong>Ácido fólico</strong> para prevenção de defeitos do tubo neural.</li>
                  <li><strong>USG Obstétrico:</strong> Confirma gestação tópica, datação e avaliação da translucência nucal (11-14s).</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>2º Trimestre (14s a 27s 6d)</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Teste de Glicose (TOTG 75g):</strong> Rastreio de Diabetes Gestacional, realizado entre 24 e 28 semanas.</li>
                  <li><strong>USG Morfológico:</strong> Avaliação detalhada da anatomia fetal, realizado entre 20 e 24 semanas.</li>
                  <li><strong>Vacinação:</strong> Iniciar esquema com dT e Hepatite B se não imunizada. dTpa a partir de 20 semanas.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>3º Trimestre (a partir de 28s)</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Repetir Sorologias:</strong> VDRL, HIV, HBsAg conforme protocolo.</li>
                  <li><strong>Pesquisa de Streptococo B:</strong> Coleta de swab vaginal e retal entre 35 e 37 semanas.</li>
                  <li><strong>Monitoramento:</strong> Avaliação da vitalidade fetal (mobilograma, cardiotocografia), altura uterina e pressão arterial.</li>
                  <li><strong>Orientação:</strong> Sinais de trabalho de parto, plano de parto e aleitamento materno.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Classificação da Idade Gestacional ao Nascer</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Classificação</TableHead>
                <TableHead>Idade Gestacional</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow><TableCell>Pré-termo</TableCell><TableCell>&lt; 37 semanas</TableCell></TableRow>
              <TableRow><TableCell>Termo Precoce</TableCell><TableCell>37s 0d a 38s 6d</TableCell></TableRow>
              <TableRow className="bg-green-50 dark:bg-green-900/30"><TableCell className="font-semibold">Termo Completo</TableCell><TableCell className="font-semibold">39s 0d a 40s 6d</TableCell></TableRow>
              <TableRow><TableCell>Termo Tardio</TableCell><TableCell>41s 0d a 41s 6d</TableCell></TableRow>
              <TableRow><TableCell>Pós-termo</TableCell><TableCell>≥ 42 semanas</TableCell></TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default PregnancyCalculator;