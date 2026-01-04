import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HeartPulse, AlertTriangle, MapPin, Waves, Clock, Zap, Repeat, Activity, Syringe, Stethoscope, Thermometer } from "lucide-react";
import EcgStrip from "@/components/EcgStrip";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
}

const EcgGuide = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Guia', title: 'Guia Rápido de ECG', path: '/ecg', icon: 'BookHeart' });
  }, [addActivity]);

  const shockableRhythms = [
    {
      name: "Fibrilação Ventricular (FV)",
      svgPath: "M0,30 q3,-8 6,2 q3,10 6,-2 q3,-12 6,0 q3,8 6,-4 q3,-12 6,2 q3,10 6,-2 q3,-12 6,0 q3,8 6,-4 q3,-12 6,2 q3,10 6,-2 q3,-12 6,0 q3,8 6,-4 q3,-12 6,2 q3,10 6,-2 q3,-12 6,0 q3,8 6,-4",
      description: "Atividade elétrica ventricular totalmente caótica. O coração apenas 'treme' e não ejeta sangue.",
      criteria: ["Ritmo: Irregular/Caótico", "Frequência: Impossível contar", "Onda P: Ausente", "QRS: Não identificável", "Linha de base: Ondulatória grosseira ou fina"],
      action: "CHOQUE IMEDIATO",
      drugs: ["Adrenalina 1mg (3-5 min)", "Amiodarona 300mg (1ª) / 150mg (2ª)"],
      priority: "Desfibrilação"
    },
    {
      name: "Taquicardia Ventricular s/ Pulso (TVSP)",
      svgPath: "M0,30 q5,-30 10,0 q5,30 10,0 q5,-30 10,0 q5,30 10,0 q5,-30 10,0 q5,30 10,0 q5,-30 10,0 q5,30 10,0 q5,-30 10,0 q5,30 10,0 q5,-30 10,0 q5,30 10,0 q5,-30 10,0 q5,30 10,0 q5,-30 10,0",
      description: "Ritmo ventricular rápido organizado. Ocorre reentrada ou automatismo anormal. Sem pulso detectável.",
      criteria: ["Ritmo: Regular", "Frequência: > 100 bpm (geralmente > 150)", "Onda P: Dissociada ou ausente", "QRS: Alargado (> 0,12s)", "Morfologia: Dentes de serra largos"],
      action: "CHOQUE IMEDIATO",
      drugs: ["Adrenalina 1mg (3-5 min)", "Amiodarona 300mg (1ª) / 150mg (2ª)"],
      priority: "Desfibrilação"
    }
  ];

  const nonShockableRhythms = [
    {
      name: "Assistolia",
      svgPath: "M0,30 l50,0.5 l50,-0.5 l50,0.2 l50,-0.4 l50,0.1 l50,-0.2 l50,0",
      description: "Ausência total de atividade elétrica ventricular. Prognóstico reservado.",
      criteria: ["Linha reta (ou quase)", "Sem QRS", "Pode haver Onda P isolada (raro)", "IMPORTANTE: Protocolo da Linha Reta (Checar Cabos, Ganho, Derivação)"],
      action: "RCP + ADRENALINA PRECOCE",
      drugs: ["Adrenalina 1mg (assim que possível)", "Repetir a cada 3-5 min"],
      priority: "Compressões de Alta Qualidade"
    },
    {
      name: "Atividade Elétrica Sem Pulso (AESP)",
      svgPath: "M0,30 l20,0 q5,-25 10,0 q5,25 10,0 l20,0 l20,0 q5,-25 10,0 q5,25 10,0 l20,0 l20,0 q5,-25 10,0 q5,25 10,0 l20,0",
      description: "Qualquer ritmo organizado (exceto FV/TV) no monitor, mas o paciente NÃO tem pulso palpável.",
      criteria: ["Pode parecer Sinusal, Bradicardia, FA, etc.", "A chave é clínica: SEM PULSO CENTRAL", "Dissociação Eletromecânica"],
      action: "RCP + ADRENALINA PRECOCE",
      drugs: ["Adrenalina 1mg (assim que possível)", "Repetir a cada 3-5 min"],
      priority: "Identificar Causas (5Hs e 5Ts)"
    }
  ];

  const causes5H = [
    { title: "Hipovolemia", detail: "Hemorragia, desidratação. Tto: Volume/Sangue." },
    { title: "Hipóxia", detail: "Falta de O2. Tto: Via aérea avançada + O2." },
    { title: "Hidrogênio (Acidose)", detail: "Acidose metabólica. Tto: Ventilação / Bicarbonato (se indicado)." },
    { title: "Hipo/Hipercalemia", detail: "K+ baixo ou alto. Tto: Reposição ou Gluconato de Cálcio/Insulina." },
    { title: "Hipotermia", detail: "Baixa temperatura. Tto: Reaquecimento." }
  ];

  const causes5T = [
    { title: "Tensão (Pneumotórax)", detail: "Hipertensivo. Tto: Descompressão torácica." },
    { title: "Tamponamento Cardíaco", detail: "Líquido no pericárdio. Tto: Pericardiocentese." },
    { title: "Toxinas", detail: "Drogas/Venenos. Tto: Antídotos específicos." },
    { title: "Trombose Pulmonar (TEP)", detail: "Embolia. Tto: Fibrinólise/Embolectomia." },
    { title: "Trombose Coronária (IAM)", detail: "Infarto. Tto: Angioplastia (pós-RCE)." }
  ];

  const waveComponents = [
    { id: "p-wave", title: "Onda P", value: "< 2,5mm", icon: Waves, color: "text-blue-500", description: "Representa a despolarização dos átrios. Normalmente é arredondada e positiva em DII. Uma onda P ausente pode indicar Fibrilação Atrial. Ondas P apiculadas ('P pulmonale') podem sugerir sobrecarga atrial direita, enquanto ondas P entalhadas ('P mitrale') podem indicar sobrecarga atrial esquerda." },
    { id: "pr-interval", title: "Intervalo PR", value: "0,12-0,20s", icon: Clock, color: "text-green-500", description: "Mede o tempo do início da onda P ao início do complexo QRS. Representa o tempo que o impulso leva para viajar do nó sinusal até o nó atrioventricular (AV). Um PR curto (<0,12s) pode indicar vias de pré-excitação (ex: Wolff-Parkinson-White). Um PR longo (>0,20s) indica um bloqueio atrioventricular (BAV) de 1º grau." },
    { id: "qrs-complex", title: "Complexo QRS", value: "< 0,12s", icon: Zap, color: "text-red-500", description: "Representa a despolarização dos ventrículos. Um QRS estreito (<0,12s) indica que o impulso se originou acima dos ventrículos (supraventricular). Um QRS largo (≥0,12s) sugere uma origem ventricular do impulso (ex: Taquicardia Ventricular) ou um distúrbio de condução (ex: Bloqueio de Ramo)." },
    { id: "st-segment", title: "Segmento ST", value: "Isoelétrico", icon: HeartPulse, color: "text-purple-500", description: "Período entre o fim do QRS e o início da onda T. Um <strong>supradesnivelamento do segmento ST</strong> é um sinal clássico de Infarto Agudo do Miocárdio com Supra de ST (IAMCSST). Um <strong>infradesnivelamento do segmento ST</strong> pode indicar isquemia miocárdica (angina) ou um IAM sem Supra de ST." },
    { id: "t-wave", title: "Onda T", value: "Assimétrica", icon: Waves, color: "text-orange-500", description: "Representa a repolarização dos ventrículos. <strong>Ondas T apiculadas e simétricas</strong> são um sinal precoce e crítico de hipercalemia (excesso de potássio). <strong>Ondas T invertidas</strong> podem ser um sinal de isquemia miocárdica." },
    { id: "qt-interval", title: "Intervalo QT", value: "< 0,44s (corrigido)", icon: Repeat, color: "text-teal-500", description: "Representa a duração total da atividade elétrica ventricular. Seu valor deve ser corrigido pela frequência cardíaca (QTc). Um <strong>intervalo QT prolongado</strong> é perigoso, pois aumenta o risco de arritmias ventriculares graves, como Torsades de Pointes. Vários medicamentos podem prolongar o QT." },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Guia Rápido de ECG</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/ecg"
              itemType="Guia"
              itemTitle="Guia Rápido de ECG"
            />
          )}
        </div>
        <p className="text-muted-foreground">Interpretação de eletrocardiograma para enfermagem.</p>
      </div>

      <Tabs defaultValue="fundamentals" className="space-y-4">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-card p-2 shadow-sm">
          <TabsList className="flex w-max space-x-2 h-auto bg-transparent p-0">
            <TabsTrigger value="fundamentals" className="px-4 py-2 text-green-700 hover:bg-green-50 data-[state=active]:bg-green-600 data-[state=active]:text-white font-semibold rounded-md transition-colors">Fundamentos</TabsTrigger>
            <TabsTrigger value="lethal" className="px-4 py-2 text-red-700 hover:bg-red-50 data-[state=active]:bg-red-600 data-[state=active]:text-white font-semibold rounded-md transition-colors">Arritmias Letais (PCR)</TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* --- ABA DE FUNDAMENTOS --- */}
        <TabsContent value="fundamentals" className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/> Posicionamento dos Eletrodos</CardTitle>
              <CardDescription>A correta colocação é o primeiro passo para um bom ECG.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8 pt-4">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-center">Derivações Precordiais (Tórax)</h3>
                <div className="relative max-w-[250px] mx-auto">
                  <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                    <path d="M60,0 C60,15 75,20 100,20 C125,20 140,15 140,0 L160,0 L200,40 L190,220 L10,220 L0,40 L40,0 Z" className="fill-amber-100 dark:fill-amber-900/20 stroke-amber-300 dark:stroke-amber-700" />
                    <path d="M65,25 C80,35 120,35 135,25" fill="none" className="stroke-amber-400 dark:stroke-amber-600" strokeWidth="4" strokeLinecap="round" />
                    <path d="M100,25 L100,120" fill="none" className="stroke-amber-400 dark:stroke-amber-600" strokeWidth="8" strokeLinecap="round" />
                    <path d="M50,70 C70,65 130,65 150,70" fill="none" className="stroke-amber-300 dark:stroke-amber-700" strokeWidth="2" /><text x="45" y="70" className="text-[8px] fill-muted-foreground">3ª</text>
                    <path d="M45,90 C65,85 135,85 155,90" fill="none" className="stroke-amber-300 dark:stroke-amber-700" strokeWidth="2" /><text x="40" y="90" className="text-[8px] fill-muted-foreground">4ª</text>
                    <path d="M40,110 C60,105 140,105 160,110" fill="none" className="stroke-amber-300 dark:stroke-amber-700" strokeWidth="2" /><text x="35" y="110" className="text-[8px] fill-muted-foreground">5ª</text>
                    <path d="M35,130 C55,125 145,125 165,130" fill="none" className="stroke-amber-300 dark:stroke-amber-700" strokeWidth="2" /><text x="30" y="130" className="text-[8px] fill-muted-foreground">6ª</text>
                    <text x="180" y="83" className="text-[8px] fill-muted-foreground">4º EIC</text>
                    <text x="185" y="103" className="text-[8px] fill-muted-foreground">5º EIC</text>
                    <g className="cursor-pointer group" onClick={() => alert('V1: 4º espaço intercostal, à direita do esterno.')}><circle cx="90" cy="80" r="8" className="fill-primary group-hover:scale-110 transition-transform"/><text x="90" y="84" textAnchor="middle" className="fill-primary-foreground text-[8px] font-bold">V1</text></g>
                    <g className="cursor-pointer group" onClick={() => alert('V2: 4º espaço intercostal, à esquerda do esterno.')}><circle cx="110" cy="80" r="8" className="fill-primary group-hover:scale-110 transition-transform"/><text x="110" y="84" textAnchor="middle" className="fill-primary-foreground text-[8px] font-bold">V2</text></g>
                    <g className="cursor-pointer group" onClick={() => alert('V4: 5º espaço intercostal, na linha hemiclavicular.')}><circle cx="125" cy="100" r="8" className="fill-primary group-hover:scale-110 transition-transform"/><text x="125" y="104" textAnchor="middle" className="fill-primary-foreground text-[8px] font-bold">V4</text></g>
                    <g className="cursor-pointer group" onClick={() => alert('V3: A meio caminho entre V2 e V4.')}><circle cx="117.5" cy="90" r="8" className="fill-primary group-hover:scale-110 transition-transform"/><text x="117.5" y="94" textAnchor="middle" className="fill-primary-foreground text-[8px] font-bold">V3</text></g>
                    <g className="cursor-pointer group" onClick={() => alert('V5: 5º EIC, na linha axilar anterior.')}><circle cx="145" cy="105" r="8" className="fill-primary group-hover:scale-110 transition-transform"/><text x="145" y="109" textAnchor="middle" className="fill-primary-foreground text-[8px] font-bold">V5</text></g>
                    <g className="cursor-pointer group" onClick={() => alert('V6: 5º EIC, na linha axilar média.')}><circle cx="165" cy="110" r="8" className="fill-primary group-hover:scale-110 transition-transform"/><text x="165" y="114" textAnchor="middle" className="fill-primary-foreground text-[8px] font-bold">V6</text></g>
                  </svg>
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
                        <p dangerouslySetInnerHTML={{ __html: comp.description }} />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- ABA DE ARRITMIAS LETAIS (REFORMULADA) --- */}
        <TabsContent value="lethal" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Ritmos Chocáveis */}
            <div className="space-y-4">
              <div className="bg-red-600/10 border-l-4 border-red-600 p-3 rounded-r-lg">
                <h3 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                  <Zap className="h-5 w-5 fill-current" /> RITMOS CHOCÁVEIS
                </h3>
                <p className="text-xs text-muted-foreground mt-1">A desfibrilação é a prioridade absoluta.</p>
              </div>
              
              {shockableRhythms.map((rhythm, index) => (
                <Card key={index} className="border-red-200 dark:border-red-900/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                  <CardHeader className="bg-gradient-to-r from-red-50 to-transparent dark:from-red-950/20 py-3">
                    <CardTitle className="text-base text-red-800 dark:text-red-300">{rhythm.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <EcgStrip path={rhythm.svgPath} />
                    
                    <Accordion type="single" collapsible className="w-full border rounded-lg bg-card/50">
                      <AccordionItem value="details" className="border-0">
                        <AccordionTrigger className="px-3 py-2 text-sm font-semibold hover:no-underline hover:bg-accent/50">
                          Critérios de Identificação
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                          <ul className="space-y-1 mt-2">
                            {rhythm.criteria.map((c, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" /> {c}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <Badge variant="destructive" className="animate-pulse font-bold">{rhythm.action}</Badge>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">{rhythm.priority}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {rhythm.drugs.map((drug, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-2 py-1 rounded">
                            <Syringe className="h-3 w-3" /> {drug}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Ritmos Não Chocáveis */}
            <div className="space-y-4">
              <div className="bg-blue-600/10 border-l-4 border-blue-600 p-3 rounded-r-lg">
                <h3 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <Activity className="h-5 w-5" /> NÃO CHOCÁVEIS
                </h3>
                <p className="text-xs text-muted-foreground mt-1">Foco em RCP de alta qualidade e causas.</p>
              </div>

              {nonShockableRhythms.map((rhythm, index) => (
                <Card key={index} className="border-blue-200 dark:border-blue-900/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 py-3">
                    <CardTitle className="text-base text-blue-800 dark:text-blue-300">{rhythm.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <EcgStrip path={rhythm.svgPath} />
                    
                    <Accordion type="single" collapsible className="w-full border rounded-lg bg-card/50">
                      <AccordionItem value="details" className="border-0">
                        <AccordionTrigger className="px-3 py-2 text-sm font-semibold hover:no-underline hover:bg-accent/50">
                          Critérios de Identificação
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                          <ul className="space-y-1 mt-2">
                            {rhythm.criteria.map((c, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" /> {c}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <Badge className="bg-blue-600 hover:bg-blue-700 font-bold">{rhythm.action}</Badge>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">{rhythm.priority}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {rhythm.drugs.map((drug, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            <Syringe className="h-3 w-3" /> {drug}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Seção 5Hs e 5Ts */}
          <Card className="border-t-4 border-t-amber-500 shadow-md">
            <CardHeader className="bg-amber-50/50 dark:bg-amber-950/10 pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-amber-700 dark:text-amber-400">
                <Stethoscope className="h-5 w-5" /> Causas Reversíveis (5Hs e 5Ts)
              </CardTitle>
              <CardDescription>A chave para o sucesso na ressuscitação de AESP e Assistolia.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x border-t">
                
                {/* 5Hs */}
                <div className="p-4 space-y-3">
                  <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                    <Droplet className="h-4 w-4" /> 5 Hs (Fisiológicos)
                  </h4>
                  <ul className="space-y-2">
                    {causes5H.map((cause, i) => (
                      <li key={i} className="text-sm border-l-2 border-primary/30 pl-3 py-0.5">
                        <span className="font-bold block">{cause.title}</span>
                        <span className="text-xs text-muted-foreground">{cause.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 5Ts */}
                <div className="p-4 space-y-3">
                  <h4 className="font-bold text-primary flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4" /> 5 Ts (Mecânicos/Tóxicos)
                  </h4>
                  <ul className="space-y-2">
                    {causes5T.map((cause, i) => (
                      <li key={i} className="text-sm border-l-2 border-primary/30 pl-3 py-0.5">
                        <span className="font-bold block">{cause.title}</span>
                        <span className="text-xs text-muted-foreground">{cause.detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EcgGuide;