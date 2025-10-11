import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, CheckCircle, HelpCircle, Stethoscope, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";

const EcgGuide = () => {
  const rhythms = [
    {
      name: "Ritmo Sinusal Normal",
      criteria: ["Ritmo: Regular", "Frequência: 60-100 bpm", "Onda P: Presente, precede cada QRS", "Intervalo PR: 0,12-0,20s", "Complexo QRS: < 0,12s"],
      causes: ["Normalidade."],
      nursing_implications: ["Monitorar e registrar. É o ritmo de base."]
    },
    {
      name: "Taquicardia Sinusal",
      criteria: ["Critérios de ritmo sinusal", "Frequência: > 100 bpm"],
      causes: ["Febre, dor, ansiedade, hipovolemia, hipóxia, medicamentos (cafeína, adrenalina)."],
      nursing_implications: ["Tratar a causa base. Avaliar a estabilidade hemodinâmica do paciente."]
    },
    {
      name: "Bradicardia Sinusal",
      criteria: ["Critérios de ritmo sinusal", "Frequência: < 60 bpm"],
      causes: ["Atletas, sono, uso de betabloqueadores, bloqueios AV, isquemia."],
      nursing_implications: ["Avaliar se o paciente está sintomático (tontura, síncope, hipotensão). Se sintomático, preparar Atropina."]
    },
    {
      name: "Fibrilação Atrial (FA)",
      criteria: ["Ritmo: Irregularmente irregular", "Frequência: Variável", "Onda P: Ausente (substituída por ondas 'f')", "Intervalo PR: Não mensurável", "Complexo QRS: Geralmente estreito"],
      causes: ["HAS, DAC, ICC, valvopatias, pós-operatório de cirurgia cardíaca."],
      nursing_implications: ["Risco de formação de trombos e AVC. Monitorar frequência cardíaca e avaliar necessidade de anticoagulação e controle de frequência."]
    },
    {
      name: "Flutter Atrial",
      criteria: ["Ritmo: Regular ou irregular", "Frequência: Atrial 250-350 bpm, ventricular variável", "Onda P: Ausente (substituída por ondas 'F' em dente de serra)", "Complexo QRS: Geralmente estreito"],
      causes: ["Semelhantes à FA (DAC, DPOC, ICC)."],
      nursing_implications: ["Semelhantes à FA. Risco de instabilidade hemodinâmica se a resposta ventricular for muito alta."]
    }
  ];

  const lethalRhythms = [
    {
      name: "Fibrilação Ventricular (FV)",
      description: "Atividade elétrica caótica e desorganizada. O coração 'treme' e não bombeia sangue.",
      treatment: "RCP de alta qualidade e desfibrilação imediata."
    },
    {
      name: "Taquicardia Ventricular sem Pulso (TVSP)",
      description: "Ritmo ventricular rápido e organizado, mas sem pulso central. O coração bate tão rápido que não há tempo para enchimento.",
      treatment: "RCP de alta qualidade e desfibrilação imediata."
    },
    {
      name: "Atividade Elétrica Sem Pulso (AESP)",
      description: "Presença de um ritmo organizado no monitor, mas o paciente não tem pulso. Dissociação eletromecânica.",
      treatment: "RCP de alta qualidade, adrenalina e busca ativa pelas causas reversíveis (5Hs e 5Ts)."
    },
    {
      name: "Assistolia",
      description: "Ausência completa de atividade elétrica ('linha reta').",
      treatment: "RCP de alta qualidade, adrenalina e busca por causas reversíveis. Confirmar em mais de uma derivação."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Guia Rápido de ECG</h1>
        <p className="text-muted-foreground">Interpretação de eletrocardiograma para enfermagem.</p>
      </div>

      <Tabs defaultValue="fundamentals" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="fundamentals">Fundamentos</TabsTrigger>
          <TabsTrigger value="rhythms">Ritmos Comuns</TabsTrigger>
          <TabsTrigger value="lethal">Arritmias Letais</TabsTrigger>
          <TabsTrigger value="ischemia">Isquemia e Infarto</TabsTrigger>
        </TabsList>

        <TabsContent value="fundamentals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Posicionamento dos Eletrodos</CardTitle>
              <CardDescription>A correta colocação é o primeiro passo para um bom ECG.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" defaultValue={["precordial", "peripheral"]}>
                <AccordionItem value="precordial">
                  <AccordionTrigger className="font-semibold">Derivações Precordiais (Tórax)</AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <ul className="space-y-2 text-sm">
                      <li><strong>V1:</strong> 4º espaço intercostal (EIC), à direita do esterno.</li>
                      <li><strong>V2:</strong> 4º EIC, à esquerda do esterno.</li>
                      <li><strong>V3:</strong> A meio caminho entre V2 e V4.</li>
                      <li><strong>V4:</strong> 5º EIC, na linha hemiclavicular esquerda.</li>
                      <li><strong>V5:</strong> 5º EIC, na linha axilar anterior esquerda.</li>
                      <li><strong>V6:</strong> 5º EIC, na linha axilar média esquerda.</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="peripheral">
                  <AccordionTrigger className="font-semibold">Derivações Periféricas (Membros)</AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <ul className="space-y-2 text-sm">
                      <li><strong>RA (Vermelho):</strong> Braço direito.</li>
                      <li><strong>LA (Amarelo):</strong> Braço esquerdo.</li>
                      <li><strong>LL (Verde):</strong> Perna esquerda.</li>
                      <li><strong>RL (Preto):</strong> Perna direita (eletrodo terra).</li>
                      <li className="pt-2"><em>Mnemônico: "<strong>F</strong>lamengo <strong>S</strong>empre <strong>G</strong>anha <strong>n</strong>o <strong>B</strong>rasil" (sentido horário, começando do braço direito).</em></li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><HeartPulse className="h-5 w-5 text-primary"/> Ondas e Intervalos Normais</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Componente</TableHead>
                    <TableHead>O que representa</TableHead>
                    <TableHead>Valores Normais</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>Onda P</TableCell><TableCell>Despolarização atrial</TableCell><TableCell>Arredondada, < 2,5mm altura</TableCell></TableRow>
                  <TableRow><TableCell>Intervalo PR</TableCell><TableCell>Condução do nó AV</TableCell><TableCell>0,12 - 0,20 segundos</TableCell></TableRow>
                  <TableRow><TableCell>Complexo QRS</TableCell><TableCell>Despolarização ventricular</TableCell><TableCell>< 0,12 segundos</TableCell></TableRow>
                  <TableRow><TableCell>Segmento ST</TableCell><TableCell>Início da repolarização ventricular</TableCell><TableCell>Isoelétrico</TableCell></TableRow>
                  <TableRow><TableCell>Onda T</TableCell><TableCell>Repolarização ventricular</TableCell><TableCell>Assimétrica, positiva</TableCell></TableRow>
                  <TableRow><TableCell>Intervalo QT</TableCell><TableCell>Sístole elétrica ventricular</TableCell><TableCell>Varia com a FC (corrigido: QTc < 0,44s)</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rhythms" className="grid md:grid-cols-2 gap-4">
          {rhythms.map((rhythm, index) => (
            <Card key={index}>
              <CardHeader><CardTitle>{rhythm.name}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-600"/> Critérios</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {rhythm.criteria.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><HelpCircle className="h-4 w-4 text-blue-600"/> Causas Comuns</h4>
                  <p className="text-sm">{rhythm.causes}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2"><Stethoscope className="h-4 w-4 text-purple-600"/> Implicações de Enfermagem</h4>
                  <p className="text-sm">{rhythm.nursing_implications}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="lethal" className="space-y-4">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5"/> Ritmos de Parada Cardíaca</CardTitle>
              <CardDescription className="text-destructive/90">Identificação e tratamento imediato são cruciais.</CardDescription>
            </CardHeader>
          </Card>
          <div className="grid md:grid-cols-2 gap-4">
            {lethalRhythms.map((rhythm, index) => (
              <Card key={index} className="border-l-4 border-destructive">
                <CardHeader><CardTitle>{rhythm.name}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{rhythm.description}</p>
                  <div>
                    <h4 className="font-semibold text-sm mb-1 text-destructive">Tratamento Imediato</h4>
                    <p className="text-sm font-semibold" dangerouslySetInnerHTML={{ __html: rhythm.treatment }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ischemia" className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-red-600"/> Supradesnível do Segmento ST</CardTitle>
              <CardDescription>Indica <strong>lesão transmural</strong> (infarto agudo do miocárdio - IAMCSST). É uma emergência!</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Parede</TableHead><TableHead>Leads Afetadas</TableHead></TableRow></TableHeader>
                <TableBody>
                  <TableRow><TableCell>Inferior</TableCell><TableCell>DII, DIII, aVF</TableCell></TableRow>
                  <TableRow><TableCell>Septal</TableCell><TableCell>V1, V2</TableCell></TableRow>
                  <TableRow><TableCell>Anterior</TableCell><TableCell>V3, V4</TableCell></TableRow>
                  <TableRow><TableCell>Lateral</TableCell><TableCell>DI, aVL, V5, V6</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingDown className="h-5 w-5 text-amber-600"/> Infradesnível do Segmento ST</CardTitle>
              <CardDescription>Indica <strong>isquemia subendocárdica</strong> (angina instável ou IAMSSST).</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">O infradesnível de ST, especialmente quando acompanhado de dor torácica, é um sinal de alerta para Síndrome Coronariana Aguda. O paciente necessita de monitorização e tratamento imediatos.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EcgGuide;