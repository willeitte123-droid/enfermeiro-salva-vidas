import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HeartPulse, AlertTriangle } from "lucide-react";
import EcgStrip from "@/components/EcgStrip";

const EcgGuide = () => {
  const lethalRhythms = [
    {
      name: "Fibrilação Ventricular (FV)",
      svgPath: "M0,30 q3,-8 6,2 q3,10 6,-2 q3,-12 6,0 q3,8 6,-4 q3,-12 6,2 q3,10 6,-2 q3,-12 6,0 q3,8 6,-4 q3,-12 6,2 q3,10 6,-2 q3,-12 6,0 q3,8 6,-4 q3,-12 6,2 q3,10 6,-2 q3,-12 6,0 q3,8 6,-4",
      description: "Atividade elétrica caótica e desorganizada. O coração 'treme' e não bombeia sangue.",
      treatment: "RCP de alta qualidade e desfibrilação imediata."
    },
    {
      name: "Taquicardia Ventricular sem Pulso (TVSP)",
      svgPath: "M0,30 q5,-30 10,0 q5,30 10,0 q5,-30 10,0 q5,30 10,0 q5,-30 10,0 q5,30 10,0 q5,-30 10,0 q5,30 10,0 q5,-30 10,0 q5,30 10,0 q5,-30 10,0 q5,30 10,0 q5,-30 10,0 q5,30 10,0 q5,-30 10,0",
      description: "Ritmo ventricular rápido e organizado, mas sem pulso central. O coração bate tão rápido que não há tempo para enchimento.",
      treatment: "RCP de alta qualidade e desfibrilação imediata."
    },
    {
      name: "Atividade Elétrica Sem Pulso (AESP)",
      svgPath: "M0,30 l20,0 q5,-25 10,0 q5,25 10,0 l20,0 l20,0 q5,-25 10,0 q5,25 10,0 l20,0 l20,0 q5,-25 10,0 q5,25 10,0 l20,0",
      description: "Presença de um ritmo organizado no monitor, mas o paciente não tem pulso. Dissociação eletromecânica.",
      treatment: "RCP de alta qualidade, adrenalina e busca ativa pelas causas reversíveis (5Hs e 5Ts)."
    },
    {
      name: "Assistolia",
      svgPath: "M0,30 l50,0.5 l50,-0.5 l50,0.2 l50,-0.4 l50,0.1 l50,-0.2",
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fundamentals">Fundamentos</TabsTrigger>
          <TabsTrigger value="lethal">Arritmias Letais</TabsTrigger>
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
                  <TableRow><TableCell>Onda P</TableCell><TableCell>Despolarização atrial</TableCell><TableCell>Arredondada, &lt; 2,5mm altura</TableCell></TableRow>
                  <TableRow><TableCell>Intervalo PR</TableCell><TableCell>Condução do nó AV</TableCell><TableCell>0,12 - 0,20 segundos</TableCell></TableRow>
                  <TableRow><TableCell>Complexo QRS</TableCell><TableCell>Despolarização ventricular</TableCell><TableCell>&lt; 0,12 segundos</TableCell></TableRow>
                  <TableRow><TableCell>Segmento ST</TableCell><TableCell>Início da repolarização ventricular</TableCell><TableCell>Isoelétrico</TableCell></TableRow>
                  <TableRow><TableCell>Onda T</TableCell><TableCell>Repolarização ventricular</TableCell><TableCell>Assimétrica, positiva</TableCell></TableRow>
                  <TableRow><TableCell>Intervalo QT</TableCell><TableCell>Sístole elétrica ventricular</TableCell><TableCell>Varia com a FC (corrigido: QTc &lt; 0,44s)</TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
                  <EcgStrip path={rhythm.svgPath} />
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
      </Tabs>
    </div>
  );
};

export default EcgGuide;