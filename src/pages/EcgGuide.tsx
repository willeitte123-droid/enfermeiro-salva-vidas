import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HeartPulse, AlertTriangle, MapPin, Waves, Clock, Zap, Repeat } from "lucide-react";
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

  const waveComponents = [
    { id: "p-wave", title: "Onda P", value: "< 2,5mm", icon: Waves, color: "text-blue-500", description: "Representa a despolarização dos átrios. Deve ser arredondada e positiva na maioria das derivações." },
    { id: "pr-interval", title: "Intervalo PR", value: "0,12-0,20s", icon: Clock, color: "text-green-500", description: "Mede o tempo desde o início da despolarização atrial até o início da despolarização ventricular. Representa a condução através do nó AV." },
    { id: "qrs-complex", title: "Complexo QRS", value: "< 0,12s", icon: Zap, color: "text-red-500", description: "Representa a despolarização dos ventrículos. Um QRS largo indica um distúrbio na condução ventricular." },
    { id: "st-segment", title: "Segmento ST", value: "Isoelétrico", icon: HeartPulse, color: "text-purple-500", description: "Período entre a despolarização e a repolarização ventricular. Alterações (supra/infra) são cruciais para identificar isquemia e infarto." },
    { id: "t-wave", title: "Onda T", value: "Assimétrica", icon: Waves, color: "text-orange-500", description: "Representa a repolarização dos ventrículos. Deve ser positiva e assimétrica. Ondas T apiculadas ou invertidas podem indicar isquemia ou distúrbios eletrolíticos." },
    { id: "qt-interval", title: "Intervalo QT", value: "< 0,44s (corrigido)", icon: Repeat, color: "text-teal-500", description: "Representa a sístole elétrica ventricular (despolarização + repolarização). O prolongamento aumenta o risco de arritmias ventriculares graves." },
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

        <TabsContent value="fundamentals" className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/> Posicionamento dos Eletrodos</CardTitle>
              <CardDescription>A correta colocação é o primeiro passo para um bom ECG.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 pt-4">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-center">Derivações Precordiais (Tórax)</h3>
                <div className="relative w-48 h-64 mx-auto bg-blue-50 dark:bg-blue-900/20 rounded-t-full border-2 border-blue-200 dark:border-blue-800">
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-2 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" aria-label="Esterno"></div>
                  <div className="absolute top-16 right-[calc(50%+10px)] w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" title="V1: 4º EIC, à direita do esterno.">V1</div>
                  <div className="absolute top-16 left-[calc(50%+10px)] w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" title="V2: 4º EIC, à esquerda do esterno.">V2</div>
                  <div className="absolute top-24 left-[calc(50%-45px)] w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" title="V4: 5º EIC, na linha hemiclavicular.">V4</div>
                  <div className="absolute top-20 left-[calc(50%-10px)] w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" title="V3: Entre V2 e V4.">V3</div>
                  <div className="absolute top-28 left-[calc(50%-70px)] w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" title="V5: 5º EIC, na linha axilar anterior.">V5</div>
                  <div className="absolute top-32 left-[calc(50%-95px)] w-5 h-5 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground" title="V6: 5º EIC, na linha axilar média.">V6</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 text-center">Derivações Periféricas (Membros)</h3>
                <div className="grid grid-cols-2 grid-rows-2 gap-4 max-w-xs mx-auto">
                  <div className="p-4 bg-red-500 text-white rounded-lg flex flex-col items-center justify-center shadow-lg">
                    <span className="font-bold text-lg">RA</span>
                    <span className="text-xs">Braço Direito</span>
                  </div>
                  <div className="p-4 bg-yellow-400 text-black rounded-lg flex flex-col items-center justify-center shadow-lg">
                    <span className="font-bold text-lg">LA</span>
                    <span className="text-xs">Braço Esquerdo</span>
                  </div>
                  <div className="p-4 bg-black text-white rounded-lg flex flex-col items-center justify-center shadow-lg">
                    <span className="font-bold text-lg">RL</span>
                    <span className="text-xs">Perna Direita</span>
                  </div>
                  <div className="p-4 bg-green-500 text-white rounded-lg flex flex-col items-center justify-center shadow-lg">
                    <span className="font-bold text-lg">LL</span>
                    <span className="text-xs">Perna Esquerda</span>
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground mt-4 italic">Mnemônico: "Flamengo Sempre Ganha no Brasil"</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><HeartPulse className="h-5 w-5 text-primary"/> Anatomia de um Batimento</CardTitle>
              <CardDescription>Entenda cada componente do traçado de ECG normal.</CardDescription>
            </CardHeader>
            <CardContent>
              <EcgStrip path="M0,30 l30,0 q5,-10 10,0 l10,0 q2,20 4,-40 q2,60 4,-20 l10,0 q5,15 15,0 l30,0" viewBox="0 0 122 60" />
              <Accordion type="single" collapsible className="w-full">
                {waveComponents.map(comp => {
                  const Icon = comp.icon;
                  return (
                    <AccordionItem value={comp.id} key={comp.id}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${comp.color}`} />
                          <span className="font-semibold">{comp.title}</span>
                          <span className="text-sm text-muted-foreground">({comp.value})</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {comp.description}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
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