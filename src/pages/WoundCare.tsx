import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bandage, Info, CheckCircle, Zap, XCircle, Search, 
  AlertTriangle, ShieldAlert, Scale, Clock, ArrowDown, ArrowUp, 
  Heart, Activity, Footprints, Microscope, Droplet
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
    lightBg: "bg-red-50 dark:bg-red-900/20",
    textColor: "text-red-600 dark:text-red-400",
    description: "Tecido conjuntivo novo, vascularizado e saudável. Indica progressão da cicatrização.",
    objectives: "Manter o leito da ferida úmido, proteger contra traumas e promover a epitelização.",
    dressings: ["Espuma não adesiva", "Hidrocoloide", "Filme transparente", "Hidrogel", "AGE"]
  },
  {
    name: "Tecido de Epitelização",
    color: "Rosa pálido",
    borderColor: "border-pink-400",
    bgColor: "bg-pink-400",
    lightBg: "bg-pink-50 dark:bg-pink-900/20",
    textColor: "text-pink-600 dark:text-pink-400",
    description: "Camada de novas células epiteliais que migram das bordas da ferida. Fase final da cicatrização.",
    objectives: "Proteger o novo tecido frágil, manter a umidade e evitar maceração.",
    dressings: ["Filme transparente", "Hidrocoloide extrafino", "Curativo de silicone", "AGE"]
  },
  {
    name: "Esfacelo / Fibrina",
    color: "Amarelo",
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-500",
    lightBg: "bg-yellow-50 dark:bg-yellow-900/20",
    textColor: "text-yellow-600 dark:text-yellow-400",
    description: "Tecido desvitalizado, úmido, composto por fibrina, leucócitos e bactérias. Adere ao leito da ferida.",
    objectives: "Promover o desbridamento autolítico ou enzimático para remover o tecido não viável.",
    dressings: ["Hidrogel com alginato", "Colagenase", "Papaína", "Alginato de cálcio", "Hidrofibra"]
  },
  {
    name: "Necrose (Escara)",
    color: "Preto/Marrom",
    borderColor: "border-gray-800",
    bgColor: "bg-gray-800",
    lightBg: "bg-gray-100 dark:bg-gray-800",
    textColor: "text-gray-700 dark:text-gray-300",
    description: "Tecido morto, seco e duro (escara). Impede a cicatrização e pode mascarar infecções.",
    objectives: "Amolecer e remover a escara através de desbridamento (autolítico, enzimático ou cirúrgico).",
    dressings: ["Hidrogel", "Papaína 10%", "Colagenase", "AGE (para manter hidratado)"]
  },
  {
    name: "Sinais de Infecção",
    color: "Variável",
    borderColor: "border-purple-600",
    bgColor: "bg-purple-600",
    lightBg: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400",
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
      {/* Modern Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Bandage className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Curativos e Feridas</h1>
          </div>
          <p className="max-w-2xl text-emerald-100 text-sm sm:text-base mb-4">
            Avaliação de lesões, estadiamento e guia completo para seleção de coberturas.
          </p>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 translate-y-1/4 -translate-x-1/4 rounded-full bg-emerald-400/20 blur-2xl" />
        
        {profile && (
          <div className="absolute top-4 right-4 z-20">
            <FavoriteButton
              userId={profile.id}
              itemId="/wound-care"
              itemType="Guia"
              itemTitle="Guia de Curativos"
              className="text-white hover:text-yellow-300"
            />
          </div>
        )}
      </div>

      <Tabs defaultValue="tissues" className="w-full">
        {/* Modern Horizontal Scrollable Pills for Tabs */}
        <ScrollArea className="w-full whitespace-nowrap rounded-xl border-0 bg-transparent mb-6">
          <TabsList className="flex w-max space-x-2 h-auto bg-transparent p-1">
            <TabsTrigger value="tissues" className="rounded-full border border-border/50 px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 data-[state=active]:border-sky-200 dark:data-[state=active]:bg-sky-900/40 dark:data-[state=active]:text-sky-300 dark:data-[state=active]:border-sky-700 hover:bg-accent">
              <Microscope className="mr-2 h-4 w-4" /> Avaliação
            </TabsTrigger>
            <TabsTrigger value="pressure-injury" className="rounded-full border border-border/50 px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-red-100 data-[state=active]:text-red-700 data-[state=active]:border-red-200 dark:data-[state=active]:bg-red-900/40 dark:data-[state=active]:text-red-300 dark:data-[state=active]:border-red-700 hover:bg-accent">
              <ShieldAlert className="mr-2 h-4 w-4" /> Lesão por Pressão
            </TabsTrigger>
            <TabsTrigger value="diabetic-foot" className="rounded-full border border-border/50 px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200 dark:data-[state=active]:bg-amber-900/40 dark:data-[state=active]:text-amber-300 dark:data-[state=active]:border-amber-700 hover:bg-accent">
              <Footprints className="mr-2 h-4 w-4" /> Pé Diabético
            </TabsTrigger>
            <TabsTrigger value="vascular-ulcers" className="rounded-full border border-border/50 px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 data-[state=active]:border-violet-200 dark:data-[state=active]:bg-violet-900/40 dark:data-[state=active]:text-violet-300 dark:data-[state=active]:border-violet-700 hover:bg-accent">
              <Activity className="mr-2 h-4 w-4" /> Úlceras Vasculares
            </TabsTrigger>
            <TabsTrigger value="dressings" className="rounded-full border border-border/50 px-4 py-2 text-sm font-medium transition-all data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 dark:data-[state=active]:bg-emerald-900/40 dark:data-[state=active]:text-emerald-300 dark:data-[state=active]:border-emerald-700 hover:bg-accent">
              <Bandage className="mr-2 h-4 w-4" /> Guia de Coberturas
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>

        <TabsContent value="tissues" className="mt-4 space-y-6">
          {/* Modern TIME Principle Card */}
          <Card className="overflow-hidden border-l-4 border-l-primary shadow-md">
            <div className="bg-primary/5 p-4 border-b border-primary/10">
              <h3 className="flex items-center gap-2 text-lg font-bold text-primary">
                <Info className="h-5 w-5" />Princípios TIME
              </h3>
            </div>
            <CardContent className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card border rounded-lg p-3 text-center shadow-sm">
                <span className="block text-2xl font-black text-primary mb-1">T</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Tecido</span>
              </div>
              <div className="bg-card border rounded-lg p-3 text-center shadow-sm">
                <span className="block text-2xl font-black text-primary mb-1">I</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Infecção</span>
              </div>
              <div className="bg-card border rounded-lg p-3 text-center shadow-sm">
                <span className="block text-2xl font-black text-primary mb-1">M</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Umidade</span>
              </div>
              <div className="bg-card border rounded-lg p-3 text-center shadow-sm">
                <span className="block text-2xl font-black text-primary mb-1">E</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Bordas</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col gap-3">
              {tissueTypes.map((tissue) => (
                <button
                  key={tissue.name}
                  onClick={() => setSelectedTissue(tissue)}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200 hover:shadow-md",
                    selectedTissue.name === tissue.name
                      ? `${tissue.lightBg} ${tissue.borderColor} ring-1 ring-inset ${tissue.borderColor.replace('border-', 'ring-')}`
                      : "bg-card hover:bg-accent"
                  )}
                >
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110", tissue.bgColor, "text-white")}>
                    <Bandage className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn("font-semibold text-sm leading-tight", tissue.textColor)}>{tissue.name}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{tissue.color}</p>
                  </div>
                  {selectedTissue.name === tissue.name && (
                    <div className={cn("absolute right-2 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full", tissue.bgColor)} />
                  )}
                </button>
              ))}
            </div>
            <div className="md:col-span-2">
              <Card className={cn("shadow-lg border-t-4 h-full", selectedTissue.borderColor)}>
                <CardHeader className={cn("pb-4", selectedTissue.lightBg)}>
                  <CardTitle className={cn("text-xl", selectedTissue.textColor)}>{selectedTissue.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-foreground/80">{selectedTissue.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-primary mb-2 uppercase tracking-wider">
                      <CheckCircle className="h-4 w-4" /> Objetivos
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">{selectedTissue.objectives}</p>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                      <Bandage className="h-4 w-4" /> Indicações
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTissue.dressings.map((dressing, idx) => (
                        <Badge key={idx} variant="secondary" className="px-3 py-1 text-xs font-medium bg-secondary/50 hover:bg-secondary/70">{dressing}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pressure-injury" className="mt-4 space-y-6">
          <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-destructive text-lg">
                <ShieldAlert className="h-5 w-5" />Prevenção é a Chave
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="flex items-center gap-2 bg-background p-2 rounded border"><Clock className="h-4 w-4 text-destructive"/> Mudança de decúbito (2h)</div>
                <div className="flex items-center gap-2 bg-background p-2 rounded border"><ArrowDown className="h-4 w-4 text-destructive"/> Superfícies de alívio</div>
                <div className="flex items-center gap-2 bg-background p-2 rounded border"><Droplet className="h-4 w-4 text-destructive"/> Hidratação da pele</div>
                <div className="flex items-center gap-2 bg-background p-2 rounded border"><Activity className="h-4 w-4 text-destructive"/> Nutrição adequada</div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-3">
            {pressureInjuryStages.map((item) => (
              <div key={item.stage} className="group border rounded-xl bg-card shadow-sm hover:shadow-md transition-all overflow-hidden">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-0">
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
                      <div className="flex items-center gap-3 w-full text-left">
                        <Badge className={cn("text-white text-xs px-2.5 py-1 min-w-[80px] justify-center shrink-0", item.badgeColor)}>{item.stage}</Badge>
                        <span className="font-semibold text-sm md:text-base">{item.description}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-0">
                      <div className="grid md:grid-cols-2 gap-4 pt-3 border-t mt-2">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-xs font-bold text-muted-foreground uppercase mb-1">Características</h4>
                            <ul className="list-disc pl-4 text-sm text-foreground/80 space-y-1 marker:text-muted-foreground">
                              {item.characteristics.map((char, i) => <li key={i}>{char}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-primary uppercase mb-1">Objetivos</h4>
                            <p className="text-sm text-foreground/80">{item.objectives}</p>
                          </div>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg h-fit">
                          <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Coberturas Recomendadas</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {item.dressings.map((dressing, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs bg-background">{dressing}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="diabetic-foot" className="mt-4 space-y-6">
          <Card className="border-l-4 border-l-destructive shadow-md bg-gradient-to-r from-destructive/5 to-transparent">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-destructive text-lg">
                <ShieldAlert className="h-5 w-5" />Prevenção e Educação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                {diabeticFootData.prevention.slice(0, 6).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-destructive/60 shrink-0 mt-0.5"/>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Footprints className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-bold text-lg text-amber-800 dark:text-amber-200">Classificação de Wagner</h3>
            </div>
            
            <div className="grid gap-3">
              {diabeticFootData.wagnerClassification.map((item) => (
                <div key={item.grade} className="border rounded-xl bg-card shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-0">
                      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/30">
                        <div className="flex items-center gap-3 w-full text-left">
                          <Badge className={cn("text-white text-xs px-2.5 py-1 w-16 justify-center shrink-0 font-bold", item.badgeColor)}>{item.grade}</Badge>
                          <span className="font-semibold text-sm md:text-base text-foreground/90">{item.description}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-0">
                        <div className="pt-3 border-t mt-1 space-y-3">
                          <div>
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1">Características</span>
                            <ul className="list-disc pl-4 text-sm text-foreground/80 space-y-1 marker:text-muted-foreground">
                              {item.characteristics.map((char, i) => <li key={i}>{char}</li>)}
                            </ul>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide block mb-1">Conduta / Objetivos</span>
                            <p className="text-sm text-foreground/90 leading-relaxed">{item.objectives}</p>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="vascular-ulcers" className="mt-4 space-y-6">
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-base sm:text-lg">
                <Scale className="h-5 w-5" />Índice Tornozelo-Braquial (ITB)
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Fórmula: <strong>Maior PS Tornozelo ÷ Maior PS Braquial</strong></CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b-blue-200 dark:border-b-blue-800">
                      <TableHead className="text-blue-900 dark:text-blue-100 font-bold">Valor ITB</TableHead>
                      <TableHead className="text-blue-900 dark:text-blue-100 font-bold">Interpretação</TableHead>
                      <TableHead className="text-blue-900 dark:text-blue-100 font-bold">Conduta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-xs sm:text-sm">
                    <TableRow className="hover:bg-blue-100/50 dark:hover:bg-blue-900/50 border-b-blue-100 dark:border-b-blue-900/50">
                      <TableCell className="font-semibold">{'>'} 1.3</TableCell><TableCell>Não compressível</TableCell><TableCell>Investigar</TableCell>
                    </TableRow>
                    <TableRow className="bg-green-100/50 dark:bg-green-900/20 border-b-green-200 dark:border-b-green-900/30">
                      <TableCell className="font-semibold text-green-800 dark:text-green-300">0.9 - 1.3</TableCell><TableCell>Normal</TableCell><TableCell>Compressão OK</TableCell>
                    </TableRow>
                    <TableRow className="bg-yellow-100/50 dark:bg-yellow-900/20 border-b-yellow-200 dark:border-b-yellow-900/30">
                      <TableCell className="font-semibold text-yellow-800 dark:text-yellow-300">0.5 - 0.8</TableCell><TableCell>DAP Leve/Mod.</TableCell><TableCell>Compressão leve</TableCell>
                    </TableRow>
                    <TableRow className="bg-red-100/50 dark:bg-red-900/20 border-b-red-200 dark:border-b-red-900/30">
                      <TableCell className="font-semibold text-red-800 dark:text-red-300">{'<'} 0.5</TableCell><TableCell>DAP Grave</TableCell><TableCell className="font-bold text-destructive">SEM COMPRESSÃO</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Úlcera Venosa */}
            <Card className="border-t-4 border-t-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20 pb-4">
                <CardTitle className="text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Heart className="h-6 w-6" /> Úlcera Venosa
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5 text-sm">
                <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Causa</span>
                  <p className="font-medium">Insuficiência Venosa Crônica</p>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Lesão</span>
                  <p className="text-muted-foreground">Terço distal, superficial, bordas irregulares, muito exsudato, leito vermelho.</p>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Pele</span>
                  <p className="text-muted-foreground">Dermatite ocre, edema, lipodermoesclerose.</p>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Dor</span>
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <ArrowUp className="h-4 w-4" /> Melhora elevando
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white w-full justify-center py-2 text-sm">
                    Conduta: Compressão + Elevação
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Úlcera Arterial */}
            <Card className="border-t-4 border-t-red-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-red-50/50 dark:bg-red-950/20 pb-4">
                <CardTitle className="text-red-700 dark:text-red-400 flex items-center gap-2">
                  <Activity className="h-6 w-6" /> Úlcera Arterial
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5 text-sm">
                <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Causa</span>
                  <p className="font-medium">Doença Arterial Periférica (Isquemia)</p>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Lesão</span>
                  <p className="text-muted-foreground">Pontas dos dedos/maléolo, profunda, "saca-bocado", leito pálido/seco.</p>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Pele</span>
                  <p className="text-muted-foreground">Fria, pálida, brilhante, sem pelos, unhas espessas, pulso ausente.</p>
                </div>
                <div className="grid grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="text-xs font-bold text-muted-foreground uppercase">Dor</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-red-500 font-medium"><ArrowUp className="h-4 w-4" /> Piora elevando</div>
                    <div className="flex items-center gap-2 text-green-600 font-medium"><ArrowDown className="h-4 w-4" /> Melhora pendendo</div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Badge className="bg-red-600 hover:bg-red-700 text-white w-full justify-center py-2 text-sm mb-1">
                    CONTRAINDICADO COMPRESSÃO!
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dressings" className="mt-4 space-y-6">
          <div className="sticky top-4 z-10 bg-background/95 backdrop-blur pb-4 border-b mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cobertura (ex: Hidrocoloide, Prata, Carvão)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 shadow-sm"
              />
            </div>
          </div>

          {filteredDressings.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredDressings.map((dressing, index) => {
                const itemId = `/wound-care#${dressing.name.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                  <Card key={index} className="border shadow-sm hover:shadow-md transition-all hover:border-emerald-200 dark:hover:border-emerald-800">
                    <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                          <Bandage className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <CardTitle className="text-base font-bold">{dressing.name}</CardTitle>
                      </div>
                      {profile && (
                        <FavoriteButton
                          userId={profile.id}
                          itemId={itemId}
                          itemType="Cobertura"
                          itemTitle={dressing.name}
                          isInitiallyFavorited={favoriteSet.has(itemId)}
                          isLoading={isLoadingFavorites}
                          className="h-8 w-8 -mt-1 -mr-2"
                        />
                      )}
                    </CardHeader>
                    <CardContent className="p-4 pt-2 space-y-3">
                      <Accordion type="single" collapsible className="w-full border rounded-md bg-muted/20">
                        <AccordionItem value="details" className="border-0">
                          <AccordionTrigger className="px-3 py-2 text-xs font-medium hover:no-underline">Ver Detalhes</AccordionTrigger>
                          <AccordionContent className="px-3 pb-3 pt-0 space-y-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3"/> Indicação</span>
                              <p className="text-sm text-foreground/90 leading-snug">{dressing.indication}</p>
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase text-blue-600 flex items-center gap-1"><Zap className="h-3 w-3"/> Ação</span>
                              <p className="text-sm text-foreground/90 leading-snug">{dressing.action}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <div>
                                <span className="text-[10px] font-bold uppercase text-cyan-600 flex items-center gap-1 mb-1"><Clock className="h-3 w-3"/> Troca</span>
                                <p className="text-xs text-muted-foreground">{dressing.changeInterval}</p>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold uppercase text-amber-600 flex items-center gap-1 mb-1"><AlertTriangle className="h-3 w-3"/> Cuidado</span>
                                <p className="text-xs text-muted-foreground">{dressing.contraindication}</p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card><CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Search className="h-8 w-8 opacity-20" />
              <p>Nenhuma cobertura encontrada.</p>
            </CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WoundCare;