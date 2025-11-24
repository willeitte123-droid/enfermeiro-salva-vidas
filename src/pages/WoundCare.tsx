import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bandage, Info, CheckCircle, Zap, XCircle, Search, 
  AlertTriangle, ShieldAlert, Scale, Clock, ArrowDown, ArrowUp, 
  Heart, Activity, Footprints, Microscope
} from "lucide-react";
import { cn } from "@/lib/utils";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
}

const tissueTypes = [
  {
    name: "Tecido de Granulação",
    color: "Vermelho vivo",
    borderColor: "border-red-500",
    bgColor: "bg-red-500",
    textColor: "text-white",
    description: "Tecido conjuntivo novo, vascularizado e saudável. Indica progressão da cicatrização.",
    objectives: "Manter o leito da ferida úmido, proteger contra traumas e promover a epitelização.",
    dressings: ["Espuma não adesiva", "Hidrocoloide", "Filme transparente", "Hidrogel", "AGE"]
  },
  {
    name: "Tecido de Epitelização",
    color: "Rosa pálido",
    borderColor: "border-pink-400",
    bgColor: "bg-pink-400",
    textColor: "text-white",
    description: "Camada de novas células epiteliais que migram das bordas da ferida. Fase final da cicatrização.",
    objectives: "Proteger o novo tecido frágil, manter a umidade e evitar maceração.",
    dressings: ["Filme transparente", "Hidrocoloide extrafino", "Curativo de silicone", "AGE"]
  },
  {
    name: "Esfacelo / Fibrina",
    color: "Amarelo",
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-500",
    textColor: "text-white",
    description: "Tecido desvitalizado, úmido, composto por fibrina, leucócitos e bactérias. Adere ao leito da ferida.",
    objectives: "Promover o desbridamento autolítico ou enzimático para remover o tecido não viável.",
    dressings: ["Hidrogel com alginato", "Colagenase", "Papaína", "Alginato de cálcio", "Hidrofibra"]
  },
  {
    name: "Necrose (Escara)",
    color: "Preto/Marrom",
    borderColor: "border-gray-800",
    bgColor: "bg-gray-800",
    textColor: "text-white",
    description: "Tecido morto, seco e duro (escara). Impede a cicatrização e pode mascarar infecções.",
    objectives: "Amolecer e remover a escara através de desbridamento (autolítico, enzimático ou cirúrgico).",
    dressings: ["Hidrogel", "Papaína 10%", "Colagenase", "AGE (para manter hidratado)"]
  },
  {
    name: "Sinais de Infecção",
    color: "Variável",
    borderColor: "border-purple-600",
    bgColor: "bg-purple-600",
    textColor: "text-white",
    description: "Presença de sinais flogísticos (dor, calor, rubor, edema), exsudato purulento, odor fétido e tecido friável.",
    objectives: "Controlar a carga bacteriana, gerenciar o exsudato e tratar a infecção sistemicamente se necessário.",
    dressings: ["Alginato com prata", "Espuma com prata/PHMB", "Carvão ativado com prata", "Coberturas com iodo"]
  }
];

const dressingTypes = [
    { name: "Hidrocoloide", indication: "Feridas limpas com exsudato leve a moderado, áreas de pressão, prevenção de LPP.", action: "Forma um gel que mantém o ambiente úmido, promove desbridamento autolítico e protege a ferida.", changeInterval: "Até 7 dias, ou quando houver saturação/extravasamento do gel.", contraindication: "Não usar em feridas infectadas, com exposição óssea/tendínea, queimaduras de 3º grau ou em pacientes com pele muito frágil." },
    { name: "Hidrogel", indication: "Feridas secas, com necrose ou esfacelo. Queimaduras de 1º e 2º grau. Alívio da dor.", action: "Hidrata o leito da ferida, amolece tecidos desvitalizados, facilitando o desbridamento autolítico.", changeInterval: "A cada 24 a 72 horas, dependendo da saturação da cobertura secundária.", contraindication: "Não indicado para feridas com alto exsudato (risco de maceração). Requer cobertura secundária." },
    { name: "Alginato de Cálcio", indication: "Feridas com exsudato moderado a alto, cavitárias, sangrantes e infectadas (versão com prata).", action: "Derivado de algas marinhas, alta capacidade de absorção, forma um gel ao contato com o exsudato. Possui ação hemostática.", changeInterval: "A cada 24 a 72 horas, ou quando saturado. Não deixar secar no leito da ferida.", contraindication: "Não usar em feridas secas ou com necrose dura. Requer cobertura secundária." },
    { name: "Hidrofibra (com ou sem prata)", indication: "Feridas com exsudato moderado a alto, incluindo feridas cavitárias.", action: "Tecnologia de gelificação vertical. Absorve o exsudato e o transforma em um gel coeso, minimizando a maceração da pele perilesional.", changeInterval: "Até 7 dias, ou quando saturado. A versão com prata não deve exceder 14 dias de uso contínuo.", contraindication: "Não usar em feridas secas. Requer cobertura secundária." },
    { name: "Espuma de Poliuretano", indication: "Feridas com exsudato moderado a alto, proteção de proeminências ósseas, terapia compressiva.", action: "Absorvente, mantém o leito úmido, protege contra impacto e é termicamente isolante. Pode ter borda de silicone.", changeInterval: "Até 7 dias, ou quando houver saturação (geralmente visível em 75% da cobertura).", contraindication: "Não indicada para feridas secas ou com pouquíssimo exsudato." },
    { name: "Carvão Ativado com Prata", indication: "Feridas infectadas, com odor fétido e exsudativas.", action: "Controla o odor (carvão) e a infecção (prata). Absorve o exsudato e as bactérias.", changeInterval: "Até 7 dias, dependendo da saturação e do controle do odor.", contraindication: "Hipersensibilidade à prata. Não cortar a cobertura. Requer cobertura secundária." },
    { name: "Coberturas com Prata", indication: "Feridas com infecção ou alto risco de infecção (colonização crítica).", action: "A prata tem ação antimicrobiana de amplo espectro. Disponível em espumas, alginatos, hidrofibras, etc.", changeInterval: "Geralmente de 3 a 7 dias. O uso contínuo não deve exceder 14 dias sem reavaliação.", contraindication: "Hipersensibilidade. Uso por tempo limitado para evitar toxicidade e resistência." },
    { name: "PHMB (Polihexanida)", indication: "Limpeza de feridas, tratamento de feridas colonizadas, infectadas ou com biofilme.", action: "Antisséptico de amplo espectro com baixa toxicidade celular. Eficaz contra biofilme.", changeInterval: "Depende da cobertura primária associada, geralmente de 24 a 72 horas.", contraindication: "Hipersensibilidade. Não usar em cartilagem hialina, cérebro ou meninges." },
    { name: "Colagenase", indication: "Desbridamento enzimático de tecido necrótico ou esfacelo.", action: "Enzima que degrada seletivamente o colágeno desvitalizado, preservando o tecido de granulação.", changeInterval: "A cada 24 horas para garantir a atividade enzimática.", contraindication: "Não usar com produtos que contenham prata, iodo ou metais pesados (inativam a enzima). Requer umidade para agir." },
    { name: "Papaína", indication: "Desbridamento químico/enzimático de tecido necrótico e esfacelo.", action: "Enzima proteolítica que degrada tecido desvitalizado. A concentração varia conforme o tipo de tecido (ex: 2-4% para esfacelo, 6-10% para necrose).", changeInterval: "A cada 12 a 24 horas, dependendo da concentração e do tipo de tecido.", contraindication: "Não usar em tecido de granulação. Inativada por metais pesados. Requer prescrição e preparo cuidadoso." },
    { name: "AGE (Ácidos Graxos Essenciais)", indication: "Prevenção de lesões por pressão, hidratação de pele, feridas em fase de epitelização.", action: "Promove quimiotaxia, angiogênese e mantém o meio úmido. Melhora a elasticidade da pele.", changeInterval: "A cada 12 a 24 horas.", contraindication: "Não usar em feridas muito exsudativas ou infectadas. Não é um desbridante." },
    { name: "Filme Transparente", indication: "Fixação de cateteres, proteção de pele íntegra, cobertura de feridas superficiais sem exsudato (ex: Estágio 1 de LPP).", action: "Barreira semipermeável (permite trocas gasosas) contra água e bactérias, permite a visualização do local.", changeInterval: "Até 7 dias, ou se houver descolamento ou acúmulo de fluido.", contraindication: "Não usar em feridas exsudativas, infectadas ou em pele frágil." },
    { name: "Gaze Não Aderente (Rayon)", indication: "Feridas limpas com baixo exsudato, queimaduras, áreas doadoras de enxerto.", action: "Interface que previne a aderência do curativo secundário ao leito da ferida, protegendo o tecido novo.", changeInterval: "A cada troca de curativo secundário, geralmente a cada 24 a 48 horas.", contraindication: "Não é absorvente. Não deve ser usada sozinha em feridas exsudativas." },
    { name: "Curativos de Silicone", indication: "Pele frágil e sensível, prevenção de lesões por fricção, feridas em fase de epitelização, tratamento de cicatrizes hipertróficas.", action: "Adesivo suave que minimiza a dor e o trauma na troca do curativo. Pode ser reposicionado.", changeInterval: "Pode permanecer por até 7 dias, dependendo do exsudato e da integridade da cobertura.", contraindication: "Não indicado para feridas com alto exsudato ou infecção." },
    { name: "Mel Medicinal", indication: "Feridas agudas e crônicas, colonizadas ou infectadas, com odor.", action: "Ação antimicrobiana de amplo espectro, anti-inflamatória, promove desbridamento autolítico e controla o odor.", changeInterval: "A cada 24 a 72 horas, dependendo do volume de exsudato.", contraindication: "Hipersensibilidade ao mel. Usar apenas produtos de grau médico, esterilizados." },
    { name: "Bota de Unna", indication: "Úlceras venosas em membros inferiores, sem infecção.", action: "Bandagem compressiva inelástica impregnada com óxido de zinco que melhora o retorno venoso e promove a cicatrização.", changeInterval: "Pode permanecer por até 7 dias, se não houver saturação ou sinais de infecção.", contraindication: "Insuficiência arterial (ITB < 0.8), infecção ativa, ICC descompensada." },
    { name: "Terapia por Pressão Negativa (TPN)", indication: "Feridas complexas, agudas ou crônicas, com alto exsudato, enxertos de pele.", action: "Aplica pressão subatmosférica controlada, remove exsudato, reduz edema, estimula a granulação e aproxima as bordas.", changeInterval: "A troca do curativo (espuma/gaze) é realizada a cada 48 a 72 horas.", contraindication: "Necrose não desbridada, malignidade na ferida, fístulas não exploradas, osteomielite não tratada." }
];

const pressureInjuryStages = [
  { stage: "Estágio 1", badgeColor: "bg-red-500", description: "Eritema não branqueável em pele intacta.", characteristics: ["Área localizada de pele intacta com vermelhidão que não desaparece à pressão.", "Pode apresentar alteração de temperatura, consistência e sensibilidade."], objectives: "Aliviar a pressão, proteger a pele e manter a hidratação.", dressings: ["Filme transparente", "Placa hidrocoloide fina", "Ácidos Graxos Essenciais (AGE)"] },
  { stage: "Estágio 2", badgeColor: "bg-pink-500", description: "Perda da pele em sua espessura parcial com exposição da derme.", characteristics: ["Leito da ferida viável, rosa/vermelho, úmido.", "Pode se apresentar como uma bolha (flictena) intacta ou rompida."], objectives: "Manter um ambiente úmido para cicatrização, proteger de contaminação e gerenciar exsudato.", dressings: ["Hidrocoloide", "Espuma de poliuretano", "Hidrogel", "Filme transparente"] },
  { stage: "Estágio 3", badgeColor: "bg-yellow-500", description: "Perda da pele em sua espessura total.", characteristics: ["Gordura (tecido adiposo) é visível.", "Pode haver presença de esfacelo ou necrose.", "Pode ocorrer descolamento (solapamento) e túneis."], objectives: "Desbridar tecido não viável, preencher espaço morto, gerenciar exsudato e infecção.", dressings: ["Alginato de cálcio (se exsudativa)", "Hidrofibra", "Espuma", "Hidrogel com alginato (para desbridar)"] },
  { stage: "Estágio 4", badgeColor: "bg-gray-800", description: "Perda da pele e tecidos em sua espessura total.", characteristics: ["Exposição direta da fáscia, músculo, tendão, ligamento, cartilagem ou osso.", "Esfacelo e/ou necrose são comuns.", "Alto risco de osteomielite."], objectives: "Mesmos do Estágio 3, com foco intenso no controle de infecção e proteção de estruturas expostas.", dressings: ["Alginato com prata", "Hidrofibra com prata", "Terapia por Pressão Negativa (TPN)"] },
  { stage: "Não Estadiável", badgeColor: "bg-black", description: "Perda total da espessura da pele e tecidos não visível.", characteristics: ["A extensão do dano não pode ser confirmada porque está encoberta por esfacelo ou necrose.", "A base da lesão não é visível."], objectives: "Desbridar o tecido necrótico para revelar a base da ferida e determinar o estágio real.", dressings: ["Hidrogel", "Colagenase", "Papaína", "Desbridamento cirúrgico"] },
  { stage: "Lesão por Pressão Tissular Profunda (LTP)", badgeColor: "bg-purple-600", description: "Lesão em tecido mole sob a pele intacta.", characteristics: ["Área localizada de coloração vermelho escura, marrom ou púrpura, que não branqueia.", "Pode evoluir rapidamente para uma lesão de espessura total."], objectives: "Alívio total da pressão, monitoramento rigoroso e proteção da pele. Não desbridar se a pele estiver intacta.", dressings: ["Espuma não adesiva", "Protetores de calcanhar", "Manter seco e protegido"] }
];

const diabeticFootData = {
  prevention: [
    "Inspeção diária dos pés (usar espelho se necessário).",
    "Higiene adequada (lavar e secar bem, especialmente entre os dedos).",
    "Hidratação da pele (evitar áreas interdigitais).",
    "Corte reto das unhas, sem remover cutículas.",
    "Uso de calçados confortáveis e adequados, sem costuras internas.",
    "Nunca andar descalço.",
    "Controle rigoroso da glicemia."
  ],
  wagnerClassification: [
    { grade: "Grau 0", badgeColor: "bg-blue-500", description: "Pé em risco, sem úlcera.", characteristics: ["Pele intacta, mas com calosidades, deformidades ósseas ou neuropatia/vasculopatia."], objectives: "Educação intensiva do paciente sobre autocuidados. Implementar medidas de alívio de pressão em áreas de calosidade. Indicar calçados e palmilhas adequadas para redistribuir a carga plantar." },
    { grade: "Grau 1", badgeColor: "bg-green-500", description: "Úlcera superficial.", characteristics: ["Lesão de espessura parcial ou total, limitada à pele e tecido subcutâneo."], objectives: "Alívio total da pressão na área ulcerada (offloading). Desbridamento de tecido necrótico ou hiperqueratose. Manter ambiente úmido para cicatrização com coberturas adequadas. Controle rigoroso da glicemia." },
    { grade: "Grau 2", badgeColor: "bg-yellow-500", description: "Úlcera profunda.", characteristics: ["A lesão penetra até tendão, cápsula articular ou osso, sem abscesso ou osteomielite."], objectives: "Avaliação da profundidade da lesão e envolvimento de estruturas profundas (sondagem cuidadosa). Desbridamento completo. Manter meio úmido e controle de exsudato. Considerar exames de imagem (Raio-X) para descartar osteomielite." },
    { grade: "Grau 3", badgeColor: "bg-orange-500", description: "Úlcera profunda com infecção.", characteristics: ["Presença de abscesso, osteomielite ou celulite extensa."], objectives: "Intervenção cirúrgica urgente para drenagem de abscesso e desbridamento amplo. Coleta de culturas de tecido profundo. Iniciar antibioticoterapia sistêmica de amplo espectro. Controle metabólico agressivo." },
    { grade: "Grau 4", badgeColor: "bg-red-600", description: "Gangrena localizada.", characteristics: ["Necrose de uma parte do pé, como dedos ou antepé."], objectives: "Avaliação vascular e cirúrgica de emergência para determinar o nível de amputação necessário. Controle da infecção local e sistêmica. Estabilização clínica do paciente." },
    { grade: "Grau 5", badgeColor: "bg-black", description: "Gangrena extensa.", characteristics: ["Necrose de todo o pé, com infecção sistêmica (sepse)."], objectives: "Intervenção cirúrgica de emergência (amputação maior) para controle do foco infeccioso e salvar a vida. Suporte hemodinâmico e tratamento agressivo da sepse. Cuidados paliativos podem ser considerados." }
  ],
  treatmentPillars: [
    { pillar: "Controle Glicêmico", description: "Fundamental para a cicatrização e prevenção de novas lesões." },
    { pillar: "Desbridamento", description: "Remoção de todo tecido necrótico e desvitalizado para reduzir a carga bacteriana e permitir a cicatrização." },
    { pillar: "Controle da Infecção", description: "Uso de coberturas antimicrobianas e antibioticoterapia sistêmica conforme avaliação." },
    { pillar: "Manejo do Exsudato", description: "Utilizar coberturas que mantenham o equilíbrio da umidade, absorvendo o excesso de exsudato sem ressecar o leito." },
    { pillar: "Alívio da Pressão (Offloading)", description: "Essencial para permitir a cicatrização. Uso de palmilhas, calçados especiais ou dispositivos de imobilização." },
    { pillar: "Avaliação Vascular", description: "Verificar a perfusão do membro. A revascularização pode ser necessária para a cicatrização." }
  ]
};

const WoundCare = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [selectedTissue, setSelectedTissue] = useState(tissueTypes[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Guia', title: 'Curativos e Tratamento de Feridas', path: '/wound-care', icon: 'Bandage' });
  }, [addActivity]);

  const { data: favoritesData, isLoading: isLoadingFavorites } = useQuery({
    queryKey: ['favorites', profile?.id, 'Cobertura'],
    queryFn: async () => {
      if (!profile) return [];
      const { data, error } = await supabase
        .from('user_favorites')
        .select('item_id')
        .eq('user_id', profile.id)
        .eq('item_type', 'Cobertura');
      if (error) throw error;
      return data.map(f => f.item_id);
    },
    enabled: !!profile,
  });

  const favoriteSet = useMemo(() => new Set(favoritesData || []), [favoritesData]);

  const filteredDressings = useMemo(() => {
    return dressingTypes.filter(dressing =>
      dressing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dressing.indication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dressing.action.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div className="text-center px-2">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Curativos e Feridas</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/wound-care"
              itemType="Guia"
              itemTitle="Guia de Curativos"
              className="text-primary"
            />
          )}
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">Avaliação de lesões, estadiamento e guia completo para seleção de coberturas.</p>
      </div>

      <Tabs defaultValue="tissues" className="w-full">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-card p-2 shadow-sm">
          <TabsList className="flex w-max space-x-2 h-auto bg-transparent p-0">
            <TabsTrigger value="tissues" className="py-2 font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 data-[state=active]:bg-sky-600 data-[state=active]:text-white rounded-md transition-all dark:bg-sky-900/30 dark:text-sky-400 dark:data-[state=active]:bg-sky-600 dark:data-[state=active]:text-white">
              <Microscope className="mr-2 h-4 w-4" /> Avaliação
            </TabsTrigger>
            <TabsTrigger value="pressure-injury" className="py-2 font-semibold text-red-700 bg-red-50 hover:bg-red-100 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md transition-all dark:bg-red-900/30 dark:text-red-400 dark:data-[state=active]:bg-red-600 dark:data-[state=active]:text-white">
              <ShieldAlert className="mr-2 h-4 w-4" /> Lesão por Pressão
            </TabsTrigger>
            <TabsTrigger value="diabetic-foot" className="py-2 font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-md transition-all dark:bg-amber-900/30 dark:text-amber-400 dark:data-[state=active]:bg-amber-600 dark:data-[state=active]:text-white">
              <Footprints className="mr-2 h-4 w-4" /> Pé Diabético
            </TabsTrigger>
            <TabsTrigger value="vascular-ulcers" className="py-2 font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-md transition-all dark:bg-violet-900/30 dark:text-violet-400 dark:data-[state=active]:bg-violet-600 dark:data-[state=active]:text-white">
              <Activity className="mr-2 h-4 w-4" /> Úlceras Vasculares
            </TabsTrigger>
            <TabsTrigger value="dressings" className="py-2 font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md transition-all dark:bg-emerald-900/30 dark:text-emerald-400 dark:data-[state=active]:bg-emerald-600 dark:data-[state=active]:text-white">
              <Bandage className="mr-2 h-4 w-4" /> Guia de Coberturas
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="tissues" className="mt-4 space-y-4">
          <Card className="border-primary/30 bg-accent/50 mb-4">
            <CardHeader className="p-4 py-3"><CardTitle className="flex items-center gap-2 text-sm sm:text-lg"><Info className="h-4 w-4 text-primary" />Princípios TIME</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-xs sm:text-sm p-4 pt-0">
              <p><strong>T:</strong> Tecido | <strong>I:</strong> Infecção | <strong>M:</strong> Umidade | <strong>E:</strong> Bordas</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-1 grid grid-cols-2 md:grid-cols-1 gap-2">
              {tissueTypes.map((tissue) => (
                <div
                  key={tissue.name}
                  onClick={() => setSelectedTissue(tissue)}
                  className={cn(
                    "p-2 sm:p-3 rounded-lg border cursor-pointer transition-all flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left h-full sm:h-auto justify-center sm:justify-start",
                    selectedTissue.name === tissue.name
                      ? `${tissue.borderColor} ring-1 ring-primary bg-accent`
                      : "border-transparent hover:bg-accent/50 bg-card"
                  )}
                >
                  <div className={cn("p-1.5 rounded-full shrink-0", tissue.bgColor)}>
                    <Bandage className={cn("h-4 w-4", tissue.textColor)} />
                  </div>
                  <div className="min-w-0 flex flex-col items-center sm:items-start">
                    <h3 className="font-semibold text-xs sm:text-sm leading-tight">{tissue.name}</h3>
                    <Badge variant="outline" className={cn("text-[9px] h-4 px-1 mt-1 w-fit", tissue.borderColor)}>{tissue.color}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:col-span-2">
              <Card className="shadow-md border-t-4 md:sticky md:top-6" style={{ borderTopColor: selectedTissue.bgColor.replace('bg-', 'text-').includes('red') ? '#ef4444' : selectedTissue.bgColor.replace('bg-', 'text-').includes('pink') ? '#f472b6' : selectedTissue.bgColor.replace('bg-', 'text-').includes('yellow') ? '#eab308' : selectedTissue.bgColor.replace('bg-', 'text-').includes('gray') ? '#1f2937' : '#9333ea' }}>
                <CardHeader className={cn("p-4 bg-muted/10")}>
                  <CardTitle className="text-base sm:text-lg">{selectedTissue.name}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm mt-1">{selectedTissue.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <h4 className="font-semibold text-xs text-primary mb-1 uppercase tracking-wider">Objetivos</h4>
                    <p className="text-sm text-muted-foreground">{selectedTissue.objectives}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs mb-2 uppercase tracking-wider">Indicações</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTissue.dressings.map((dressing, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px] sm:text-xs font-normal">{dressing}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pressure-injury" className="mt-4 space-y-4">
          <Card className="border-destructive/30 bg-destructive/5 mb-4">
            <CardHeader className="p-4 py-3"><CardTitle className="flex items-center gap-2 text-destructive text-sm sm:text-base"><ShieldAlert className="h-4 w-4" />Prevenção é a Chave</CardTitle></CardHeader>
            <CardContent className="p-4 pt-0 text-xs sm:text-sm text-destructive/90">
              <ul className="list-disc pl-4 space-y-1">
                <li>Mudança de decúbito (2h/2h).</li>
                <li>Superfícies de suporte (colchões).</li>
                <li>Hidratação da pele.</li>
                <li>Nutrição adequada.</li>
              </ul>
            </CardContent>
          </Card>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {pressureInjuryStages.map((item) => (
              <AccordionItem key={item.stage} value={item.stage} className="border rounded-lg px-3 bg-card shadow-sm">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-3 w-full">
                    <Badge className={cn("text-white text-[10px] sm:text-xs w-16 justify-center shrink-0", item.badgeColor)}>{item.stage}</Badge>
                    <span className="font-semibold text-left text-xs sm:text-sm line-clamp-2">{item.description}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 space-y-3 text-xs sm:text-sm">
                  <div><h4 className="font-bold mb-1">Características</h4><ul className="list-disc pl-4 text-muted-foreground">
                    {item.characteristics.map((char, i) => <li key={i}>{char}</li>)}
                  </ul></div>
                  <div><h4 className="font-bold text-primary mb-1">Objetivos</h4><p>{item.objectives}</p></div>
                  <div><h4 className="font-bold mb-2">Coberturas</h4><div className="flex flex-wrap gap-1.5">
                    {item.dressings.map((dressing, idx) => <Badge key={idx} variant="outline" className="text-[10px]">{dressing}</Badge>)}
                  </div></div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="diabetic-foot" className="mt-4 space-y-4">
          <Card className="border-destructive/30 bg-destructive/5 mb-4">
            <CardHeader className="p-4 py-3"><CardTitle className="flex items-center gap-2 text-destructive text-sm sm:text-base"><ShieldAlert className="h-4 w-4" />Prevenção e Educação</CardTitle></CardHeader>
            <CardContent className="p-4 pt-0 text-xs sm:text-sm text-destructive/90">
              <ul className="list-disc pl-4 space-y-1">
                {diabeticFootData.prevention.slice(0, 4).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Accordion type="single" collapsible className="w-full space-y-2">
            <div className="px-1 mb-2"><h3 className="font-bold text-base">Classificação de Wagner</h3></div>
            {diabeticFootData.wagnerClassification.map((item) => (
              <AccordionItem key={item.grade} value={item.grade} className="border rounded-lg px-3 bg-card shadow-sm">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-3 w-full">
                    <Badge className={cn("text-white text-[10px] sm:text-xs w-14 justify-center shrink-0", item.badgeColor)}>{item.grade}</Badge>
                    <span className="font-semibold text-left text-xs sm:text-sm">{item.description}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 space-y-3 text-xs sm:text-sm">
                  <div><h4 className="font-bold mb-1">Características</h4><ul className="list-disc pl-4 text-muted-foreground">
                    {item.characteristics.map((char, i) => <li key={i}>{char}</li>)}
                  </ul></div>
                  <div><h4 className="font-bold text-primary mb-1">Objetivos</h4><p>{item.objectives}</p></div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="vascular-ulcers" className="mt-4 space-y-4">
          <Card className="border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/30 mb-4">
            <CardHeader className="p-4 py-3"><CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-sm sm:text-base"><Scale className="h-4 w-4" />Índice Tornozelo-Braquial (ITB)</CardTitle></CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              <p className="text-xs text-muted-foreground">Fórmula: <strong>Maior PS Tornozelo ÷ Maior PS Braquial</strong>.</p>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <Table className="min-w-[400px]">
                  <TableHeader><TableRow><TableHead className="w-24">Valor ITB</TableHead><TableHead>Interpretação</TableHead><TableHead>Conduta</TableHead></TableRow></TableHeader>
                  <TableBody className="text-xs sm:text-sm">
                    <TableRow><TableCell className="font-semibold">{'>'} 1.3</TableCell><TableCell>Não compressível</TableCell><TableCell>Investigar</TableCell></TableRow>
                    <TableRow className="bg-green-100/50 dark:bg-green-900/20"><TableCell className="font-semibold">0.9 - 1.3</TableCell><TableCell>Normal</TableCell><TableCell>Compressão OK</TableCell></TableRow>
                    <TableRow className="bg-yellow-100/50 dark:bg-yellow-900/20"><TableCell className="font-semibold">0.5 - 0.8</TableCell><TableCell>DAP Leve/Mod.</TableCell><TableCell>Compressão leve</TableCell></TableRow>
                    <TableRow className="bg-red-100/50 dark:bg-red-900/20"><TableCell className="font-semibold">{'<'} 0.5</TableCell><TableCell>DAP Grave</TableCell><TableCell className="font-bold text-destructive">SEM COMPRESSÃO</TableCell></TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Úlcera Venosa */}
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="p-4 bg-blue-50 dark:bg-blue-900/20">
                <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2 text-base">
                  <Heart className="h-5 w-5" /> Úlcera Venosa
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-sm">
                <div>
                  <span className="font-bold text-blue-600 block mb-1">Causa Principal:</span>
                  <p className="text-muted-foreground">Insuficiência Venosa Crônica (hipertensão venosa).</p>
                </div>
                <div>
                  <span className="font-bold block mb-1">Características da Lesão:</span>
                  <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                    <li><strong>Local:</strong> Terço distal da perna (polaina), maléolo medial.</li>
                    <li><strong>Aparência:</strong> Superficial, bordas irregulares.</li>
                    <li><strong>Leito:</strong> Vermelho (tecido de granulação), úmido, <strong>muito exsudato</strong>.</li>
                  </ul>
                </div>
                <div>
                  <span className="font-bold block mb-1">Pele Perilesional:</span>
                  <p className="text-muted-foreground"><strong>Dermatite ocre</strong> (manchas acastanhadas), edema, lipodermoesclerose (pele endurecida), eczema.</p>
                </div>
                <div>
                  <span className="font-bold block mb-1">Dor:</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ArrowUp className="h-4 w-4 text-green-500" /> Melhora com a elevação das pernas.
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Sensação de peso ou queimação.</p>
                </div>
                <div className="pt-2 border-t border-blue-100 dark:border-blue-900">
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white w-full justify-center py-1.5">
                    Conduta: Compressão + Elevação
                  </Badge>
                  <p className="text-xs text-center mt-2 text-muted-foreground">Bota de Unna ou Terapia Compressiva (se ITB {'>'} 0.8).</p>
                </div>
              </CardContent>
            </Card>

            {/* Úlcera Arterial */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="p-4 bg-red-50 dark:bg-red-900/20">
                <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2 text-base">
                  <Activity className="h-5 w-5" /> Úlcera Arterial
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-sm">
                <div>
                  <span className="font-bold text-red-600 block mb-1">Causa Principal:</span>
                  <p className="text-muted-foreground">Doença Arterial Periférica (Isquemia/Falta de fluxo).</p>
                </div>
                <div>
                  <span className="font-bold block mb-1">Características da Lesão:</span>
                  <ul className="list-disc pl-4 text-muted-foreground space-y-1">
                    <li><strong>Local:</strong> Pontas dos dedos, maléolo lateral, áreas de trauma.</li>
                    <li><strong>Aparência:</strong> Profunda, "saca-bocado" (bordas regulares).</li>
                    <li><strong>Leito:</strong> Pálido, necrótico ou esfacelo seco. <strong>Pouco exsudato</strong>.</li>
                  </ul>
                </div>
                <div>
                  <span className="font-bold block mb-1">Pele Perilesional:</span>
                  <p className="text-muted-foreground">Fria, pálida ou cianótica, lisa, brilhante, <strong>sem pelos</strong>, unhas espessas. Pulso diminuído ou ausente.</p>
                </div>
                <div>
                  <span className="font-bold block mb-1">Dor:</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ArrowUp className="h-4 w-4 text-red-500" /> Piora com a elevação e ao caminhar (claudicação).
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <ArrowDown className="h-4 w-4 text-green-500" /> Melhora pendendo a perna.
                  </div>
                </div>
                <div className="pt-2 border-t border-red-100 dark:border-red-900">
                  <Badge className="bg-red-600 hover:bg-red-700 text-white w-full justify-center py-1.5 mb-1">
                    CONTRAINDICADO COMPRESSÃO!
                  </Badge>
                  <p className="text-xs text-center text-muted-foreground">Requer avaliação vascular urgente para revascularização. Manter aquecido.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dressings" className="mt-4 space-y-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cobertura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 text-sm"
            />
          </div>

          {filteredDressings.length > 0 ? (
            <div className="space-y-3">
              {filteredDressings.map((dressing, index) => {
                const itemId = `/wound-care#${dressing.name.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                  <Accordion type="single" collapsible key={index}>
                    <AccordionItem value={`item-${index}`} className="border rounded-lg px-3 bg-card shadow-sm">
                      <div className="flex items-center py-1">
                        <AccordionTrigger className="flex-1 group hover:no-underline text-left py-3">
                          <div className="flex items-center gap-3">
                            <Bandage className="h-4 w-4 text-primary shrink-0" />
                            <p className="font-semibold text-left text-xs sm:text-sm">{dressing.name}</p>
                          </div>
                        </AccordionTrigger>
                        <div className="pl-2">
                          {profile && (
                            <FavoriteButton
                              userId={profile.id}
                              itemId={itemId}
                              itemType="Cobertura"
                              itemTitle={dressing.name}
                              isInitiallyFavorited={favoriteSet.has(itemId)}
                              isLoading={isLoadingFavorites}
                              className="h-8 w-8"
                            />
                          )}
                        </div>
                      </div>
                      <AccordionContent className="pt-2 pb-4 space-y-3 border-t border-border/40 mt-1 text-xs sm:text-sm">
                        <div className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-600 shrink-0" /><div className="flex-1"><span className="font-bold text-green-700 block mb-0.5">Indicação</span>{dressing.indication}</div></div>
                        <div className="flex gap-2"><Zap className="h-4 w-4 text-blue-600 shrink-0" /><div className="flex-1"><span className="font-bold text-blue-700 block mb-0.5">Ação</span>{dressing.action}</div></div>
                        <div className="flex gap-2"><Clock className="h-4 w-4 text-cyan-600 shrink-0" /><div className="flex-1"><span className="font-bold text-cyan-700 block mb-0.5">Troca</span>{dressing.changeInterval}</div></div>
                        <div className="flex gap-2"><AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" /><div className="flex-1"><span className="font-bold text-amber-700 block mb-0.5">Cuidado</span>{dressing.contraindication}</div></div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </div>
          ) : (
            <Card><CardContent className="py-12 text-center text-muted-foreground text-sm">Nenhuma cobertura encontrada</CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WoundCare;