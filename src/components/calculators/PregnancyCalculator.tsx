import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, RefreshCw, Baby, BookOpen, ClipboardList } from "lucide-react";
import { format, addDays, addMonths, differenceInDays, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const PregnancyCalculator = () => {
  // Estado para o cálculo por DUM
  const [dum, setDum] = useState<Date | undefined>(undefined);
  const [dppByDum, setDppByDum] = useState<string | null>(null);
  const [gestationalAgeByDum, setGestationalAgeByDum] = useState<string | null>(null);
  const [trimesterByDum, setTrimesterByDum] = useState<string | null>(null);

  // Estado para o cálculo por USG
  const [usgDate, setUsgDate] = useState<Date | undefined>(undefined);
  const [usgWeeks, setUsgWeeks] = useState<string>("");
  const [usgDays, setUsgDays] = useState<string>("");
  const [dppByUsg, setDppByUsg] = useState<string | null>(null);
  const [gestationalAgeByUsg, setGestationalAgeByUsg] = useState<string | null>(null);
  const [trimesterByUsg, setTrimesterByUsg] = useState<string | null>(null);
  const [estimatedDum, setEstimatedDum] = useState<string | null>(null);

  // Lógica de cálculo para DUM
  useEffect(() => {
    if (dum) {
      const dppDate = addMonths(addDays(dum, 7), 9);
      setDppByDum(format(dppDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }));

      const today = new Date();
      const totalDays = differenceInDays(today, dum);
      if (totalDays >= 0) {
        const weeks = Math.floor(totalDays / 7);
        const days = totalDays % 7;
        setGestationalAgeByDum(`${weeks} semanas e ${days} dias`);

        if (weeks < 14) setTrimesterByDum("1º Trimestre");
        else if (weeks < 28) setTrimesterByDum("2º Trimestre");
        else setTrimesterByDum("3º Trimestre");
      } else {
        setGestationalAgeByDum(null);
        setTrimesterByDum(null);
      }
    } else {
      setDppByDum(null);
      setGestationalAgeByDum(null);
      setTrimesterByDum(null);
    }
  }, [dum]);

  // Lógica de cálculo para USG
  useEffect(() => {
    const weeks = parseInt(usgWeeks);
    const days = parseInt(usgDays);

    if (usgDate && !isNaN(weeks) && !isNaN(days) && weeks >= 0 && days >= 0 && days < 7) {
      const totalDaysAtUsg = weeks * 7 + days;
      const estimatedDumDate = subDays(usgDate, totalDaysAtUsg);
      setEstimatedDum(format(estimatedDumDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }));

      const dppDate = addDays(estimatedDumDate, 280);
      setDppByUsg(format(dppDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }));

      const today = new Date();
      const totalDays = differenceInDays(today, estimatedDumDate);

      if (totalDays >= 0) {
        const currentWeeks = Math.floor(totalDays / 7);
        const currentDays = totalDays % 7;
        setGestationalAgeByUsg(`${currentWeeks} semanas e ${currentDays} dias`);

        if (currentWeeks < 14) setTrimesterByUsg("1º Trimestre");
        else if (currentWeeks < 28) setTrimesterByUsg("2º Trimestre");
        else setTrimesterByUsg("3º Trimestre");
      } else {
        setGestationalAgeByUsg(null);
        setTrimesterByUsg(null);
      }
    } else {
      setDppByUsg(null);
      setGestationalAgeByUsg(null);
      setTrimesterByUsg(null);
      setEstimatedDum(null);
    }
  }, [usgDate, usgWeeks, usgDays]);

  const resetDumCalculator = () => {
    setDum(undefined);
  };

  const resetUsgCalculator = () => {
    setUsgDate(undefined);
    setUsgWeeks("");
    setUsgDays("");
  };

  return (
    <>
      <Card className="bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-pink-700 dark:text-pink-300">
            <Baby />
            Calculadora Gestacional
          </CardTitle>
          <CardDescription className="text-pink-900/80 dark:text-pink-200/80">
            Calcule a DPP e a Idade Gestacional (IG) a partir da DUM ou de um Ultrassom (USG).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dum" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dum">Cálculo por DUM</TabsTrigger>
              <TabsTrigger value="usg">Cálculo por USG</TabsTrigger>
            </TabsList>
            <TabsContent value="dum" className="mt-6 space-y-6">
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
              <Card className="bg-background/70 p-6 text-center">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:border-r border-border sm:pr-4">
                    <p className="text-sm text-muted-foreground">Data Provável do Parto (DPP)</p>
                    <p className="text-2xl font-bold text-primary">{dppByDum || "--"}</p>
                  </div>
                  <div className="sm:border-r border-border sm:pr-4">
                    <p className="text-sm text-muted-foreground">Idade Gestacional (Hoje)</p>
                    <p className="text-2xl font-bold text-primary">{gestationalAgeByDum || "--"}</p>
                  </div>
                  <div className="sm:pl-4">
                    <p className="text-sm text-muted-foreground">Trimestre Atual</p>
                    <p className="text-2xl font-bold text-primary">{trimesterByDum || "--"}</p>
                  </div>
                </div>
              </Card>
              <Button variant="outline" onClick={resetDumCalculator} className="w-full"><RefreshCw className="h-4 w-4 mr-2" />Limpar</Button>
            </TabsContent>
            <TabsContent value="usg" className="mt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data do Ultrassom</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !usgDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {usgDate ? format(usgDate, "PPP", { locale: ptBR }) : <span>Escolha uma data</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={usgDate} onSelect={setUsgDate} initialFocus locale={ptBR} /></PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Idade Gestacional no USG</Label>
                  <div className="flex items-center gap-2">
                    <Input type="number" placeholder="Semanas" value={usgWeeks} onChange={(e) => setUsgWeeks(e.target.value)} />
                    <Input type="number" placeholder="Dias" value={usgDays} onChange={(e) => setUsgDays(e.target.value)} max={6} />
                  </div>
                </div>
              </div>
              <Card className="bg-background/70 p-6 text-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="lg:border-r border-border lg:pr-4"><p className="text-sm text-muted-foreground">DPP</p><p className="text-xl font-bold text-primary">{dppByUsg || "--"}</p></div>
                  <div className="lg:border-r border-border lg:pr-4"><p className="text-sm text-muted-foreground">IG Atual</p><p className="text-xl font-bold text-primary">{gestationalAgeByUsg || "--"}</p></div>
                  <div className="lg:border-r border-border lg:pr-4"><p className="text-sm text-muted-foreground">Trimestre</p><p className="text-xl font-bold text-primary">{trimesterByUsg || "--"}</p></div>
                  <div className="lg:pl-4"><p className="text-sm text-muted-foreground">DUM Estimada</p><p className="text-xl font-bold text-primary">{estimatedDum || "--"}</p></div>
                </div>
              </Card>
              <Button variant="outline" onClick={resetUsgCalculator} className="w-full"><RefreshCw className="h-4 w-4 mr-2" />Limpar</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary"/> Informações Clínicas Relevantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>• O cálculo por DUM (Regra de Naegele) assume um ciclo menstrual regular de 28 dias.</p>
          <p>• O ultrassom do <strong>primeiro trimestre</strong> (idealmente entre 7 e 12 semanas, usando o Comprimento Cabeça-Nádega - CCN) é o método mais acurado para datar a gestação e deve ser usado para corrigir a DUM se a discrepância for {'>'} 7 dias.</p>
          
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