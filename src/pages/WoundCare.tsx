import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Bandage, Info, CheckCircle, Zap, XCircle, Search, 
  AlertTriangle, ShieldAlert, Scale, Clock, ArrowDown, ArrowUp, 
  Heart, Activity, Footprints, Microscope, Droplet, Scissors, Layers, 
  AlertOctagon, ScanLine, Ruler
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
    description: "Tecido conjuntivo novo, vascularizado e saudável.",
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
    description: "Camada de novas células epiteliais. Fase final.",
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
    description: "Tecido desvitalizado, úmido, aderido ao leito.",
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
    description: "Tecido morto, seco e duro. Impede a cicatrização.",
    objectives: "Amolecer e remover a escara através de desbridamento (autolítico, enzimático ou cirúrgico).",
    dressings: ["Hidrogel", "Papaína 10%", "Colagenase", "AGE"]
  },
  {
    name: "Sinais de Infecção",
    color: "Variável",
    borderColor: "border-purple-600",
    bgColor: "bg-purple-600",
    lightBg: "bg-purple-50 dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400",
    description: "Flogose (dor, calor, rubor, edema), pus, odor.",
    objectives: "Controlar a carga bacteriana, gerenciar o exsudato e tratar a infecção sistemicamente se necessário.",
    dressings: ["Alginato com prata", "Espuma com prata/PHMB", "Carvão ativado", "Iodo"]
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
  { stage: "Estágio 1", badgeColor: "bg-red-500", description: "Eritema não branqueável em pele intacta.", characteristics: ["Pele intacta com vermelhidão.", "Não desaparece à pressão."], objectives: "Aliviar a pressão, proteger a pele e manter a hidratação.", dressings: ["Filme transparente", "Placa hidrocoloide fina", "Ácidos Graxos Essenciais (AGE)"] },
  { stage: "Estágio 2", badgeColor: "bg-pink-500", description: "Perda da pele em sua espessura parcial (derme).", characteristics: ["Leito viável, rosa/vermelho, úmido.", "Pode ser uma bolha (flictena)."], objectives: "Manter ambiente úmido, proteger de contaminação e gerenciar exsudato.", dressings: ["Hidrocoloide", "Espuma de poliuretano", "Hidrogel", "Filme transparente"] },
  { stage: "Estágio 3", badgeColor: "bg-yellow-500", description: "Perda total da espessura da pele.", characteristics: ["Gordura visível.", "Pode haver esfacelo/necrose.", "Possíveis túneis/descolamentos."], objectives: "Desbridar, preencher espaço morto, gerenciar exsudato/infecção.", dressings: ["Alginato de cálcio", "Hidrofibra", "Espuma", "Hidrogel c/ alginato"] },
  { stage: "Estágio 4", badgeColor: "bg-gray-800", description: "Perda total com exposição de estruturas.", characteristics: ["Exposição de osso, tendão ou músculo.", "Alto risco de osteomielite."], objectives: "Controle intenso de infecção e proteção de estruturas.", dressings: ["Alginato c/ prata", "Hidrofibra c/ prata", "TPN"] },
  { stage: "Não Estadiável", badgeColor: "bg-black", description: "Perda total coberta por esfacelo/necrose.", characteristics: ["Base não visível devido à cobertura.", "Extensão do dano desconhecida."], objectives: "Desbridar para revelar a base e estadiar.", dressings: ["Hidrogel", "Colagenase", "Papaína", "Cirúrgico"] },
  { stage: "Tissular Profunda", badgeColor: "bg-purple-600", description: "Lesão sob a pele intacta.", characteristics: ["Área vermelho escura/púrpura.", "Não branqueia."], objectives: "Alívio total, monitoramento e proteção.", dressings: ["Espuma não adesiva", "Protetores de calcanhar", "Manter seco"] }
];

const diabeticFootData = {
  prevention: [
    "Inspeção diária dos pés (usar espelho).",
    "Higiene adequada (secar entre dedos).",
    "Hidratação (evitar entre dedos).",
    "Corte reto das unhas.",
    "Calçados confortáveis/sem costura.",
    "Nunca andar descalço.",
    "Controle rigoroso da glicemia."
  ],
  wagnerClassification: [
    { grade: "Grau 0", badgeColor: "bg-blue-500", description: "Pé em risco, sem úlcera.", characteristics: ["Pele intacta, calosidades, deformidades."], objectives: "Educação, alívio de pressão em calos, calçados adequados." },
    { grade: "Grau 1", badgeColor: "bg-green-500", description: "Úlcera superficial.", characteristics: ["Lesão parcial/total, apenas pele/subcutâneo."], objectives: "Alívio de pressão (offloading), desbridamento, meio úmido." },
    { grade: "Grau 2", badgeColor: "bg-yellow-500", description: "Úlcera profunda.", characteristics: ["Penetra tendão/osso, sem abscesso."], objectives: "Avaliar profundidade (probe to bone), desbridar, Raio-X." },
    { grade: "Grau 3", badgeColor: "bg-orange-500", description: "Úlcera profunda + infecção.", characteristics: ["Abscesso, osteomielite ou celulite."], objectives: "Cirurgia urgente (drenagem), culturas, antibiótico sistêmico." },
    { grade: "Grau 4", badgeColor: "bg-red-600", description: "Gangrena localizada.", characteristics: ["Necrose de parte do pé (dedos/antepé)."], objectives: "Avaliação vascular/cirúrgica, nível de amputação, estabilização." },
    { grade: "Grau 5", badgeColor: "bg-black", description: "Gangrena extensa.", characteristics: ["Necrose de todo o pé, sepse."], objectives: "Amputação maior de emergência, suporte de vida." }
  ],
  treatmentPillars: [
    { pillar: "Controle Glicêmico", description: "Fundamental para cicatrização." },
    { pillar: "Desbridamento", description: "Remoção de tecido necrótico." },
    { pillar: "Controle da Infecção", description: "Antimicrobianos locais/sistêmicos." },
    { pillar: "Manejo do Exsudato", description: "Equilíbrio da umidade." },
    { pillar: "Alívio da Pressão", description: "Offloading (palmilhas/calçados)." },
    { pillar: "Avaliação Vascular", description: "Verificar perfusão (pulsos/ITB)." }
  ]
};

// Novos Dados: Desbridamento e Biofilme
const debridementTypes = [
  { 
    type: "Autolítico", 
    icon: Droplet,
    mechanism: "Utiliza enzimas e umidade do próprio organismo para liquefazer o tecido desvitalizado. Promovido por curativos oclusivos/semioclusivos.", 
    indication: "Feridas com pouco esfacelo, pacientes sensíveis à dor, áreas de difícil acesso.",
    products: "Hidrogel, Hidrocoloide, Filmes, AGE.",
    pros: "Indolor, seletivo, fácil aplicação.",
    cons: "Lento (dias/semanas), risco de maceração se mal gerenciado."
  },
  { 
    type: "Enzimático (Químico)", 
    icon: FlaskConical,
    mechanism: "Aplicação tópica de enzimas exógenas que degradam o colágeno ou proteínas do tecido necrótico.", 
    indication: "Necrose ou esfacelo aderido, quando o autolítico é muito lento.",
    products: "Colagenase (Clostridiopeptidase A), Papaína (concentração varia com o tecido).",
    pros: "Mais rápido que o autolítico, seletivo (especialmente colagenase).",
    cons: "Custo, necessidade de troca diária (colagenase) ou frequente, potencial irritação (papaína)."
  },
  { 
    type: "Instrumental (Sharp)", 
    icon: Scissors,
    mechanism: "Remoção conservadora de tecido morto usando bisturi, tesoura ou cureta à beira do leito.", 
    indication: "Necrose espessa, esfacelo extenso, calosidades em pé diabético.",
    products: "Material cirúrgico estéril.",
    pros: "Rápido, converte ferida crônica em aguda.",
    cons: "Dor, risco de sangramento, exige competência técnica (Enfermeiro habilitado/Médico)."
  },
  { 
    type: "Mecânico", 
    icon: Layers,
    mechanism: "Uso de força física para remover tecido. Ex: Fricção, Irrigação de alta pressão, Wet-to-dry (úmido-seco).", 
    indication: "Em desuso como primeira linha devido ao trauma e dor.",
    products: "Gaze, soro fisiológico.",
    pros: "Baixo custo.",
    cons: "Não seletivo (remove tecido bom junto), doloroso, traumático."
  }
];

// Novos Dados: LPP x IAD
const differentialDiagnosis = [
  { feature: "Causa Principal", lpp: "Pressão e cisalhamento (Isquemia).", iad: "Umidade e irritação química (Urina/Fezes)." },
  { feature: "Localização Típica", lpp: "Sobre proeminências ósseas (sacro, calcâneo, trocânter).", iad: "Regiões de dobras, perianal, glúteos (onde a fralda toca)." },
  { feature: "Apresentação", lpp: "Bordas definidas, pode ter necrose/esfacelo, profundidade variável.", iad: "Bordas difusas/irregulares, vermelhidão brilhante, erosão superficial ('assadura')." },
  { feature: "Cor", lpp: "Vermelho/Púrpura (não branqueável) ou Preto/Amarelo.", iad: "Vermelho vivo/Rosado, pode ter áreas brancas (maceração)." },
  { feature: "Sintomas", lpp: "Dor localizada, desconforto à pressão.", iad: "Dor em queimação, ardor, prurido." },
  { feature: "Prevenção", lpp: "Mudança de decúbito, superfícies de suporte.", iad: "Higiene frequente, cremes de barreira, fraldas de alta absorção." }
];

import { FlaskConical } from "lucide-react";

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
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      {/* Modern Gradient Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Bandage className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Curativos e Feridas</h1>
          </div>
          <p className="max-w-2xl text-emerald-100 text-xs sm:text-sm md:text-base mb-4">
            Avaliação de lesões, estadiamento e guia completo de coberturas.
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
        {/* Modern Horizontal Scrollable Pills for Tabs with Layout Constraints */}
        <div className="w-full max-w-[calc(100vw-2rem)] mx-auto">
          <ScrollArea className="w-full whitespace-nowrap rounded-xl border-0 bg-transparent mb-4">
            <TabsList className="flex w-max space-x-2 h-auto bg-transparent p-1">
              <TabsTrigger value="tissues" className="rounded-full border border-border/50 px-3 py-1.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 data-[state=active]:border-sky-200 dark:data-[state=active]:bg-sky-900/40 dark:data-[state=active]:text-sky-300 dark:data-[state=active]:border-sky-700 hover:bg-accent">
                <Microscope className="mr-1.5 h-3.5 w-3.5" /> Avaliação
              </TabsTrigger>
              <TabsTrigger value="pressure-injury" className="rounded-full border border-border/50 px-3 py-1.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-red-100 data-[state=active]:text-red-700 data-[state=active]:border-red-200 dark:data-[state=active]:bg-red-900/40 dark:data-[state=active]:text-red-300 dark:data-[state=active]:border-red-700 hover:bg-accent">
                <ShieldAlert className="mr-1.5 h-3.5 w-3.5" /> LPP
              </TabsTrigger>
              <TabsTrigger value="diff-dx" className="rounded-full border border-border/50 px-3 py-1.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=active]:border-orange-200 dark:data-[state=active]:bg-orange-900/40 dark:data-[state=active]:text-orange-300 dark:data-[state=active]:border-orange-700 hover:bg-accent">
                <ScanLine className="mr-1.5 h-3.5 w-3.5" /> Diferencial (LPP x IAD)
              </TabsTrigger>
              <TabsTrigger value="debridement" className="rounded-full border border-border/50 px-3 py-1.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200 dark:data-[state=active]:bg-purple-900/40 dark:data-[state=active]:text-purple-300 dark:data-[state=active]:border-purple-700 hover:bg-accent">
                <Scissors className="mr-1.5 h-3.5 w-3.5" /> Desbridamento
              </TabsTrigger>
              <TabsTrigger value="dressings" className="rounded-full border border-border/50 px-3 py-1.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 data-[state=active]:border-emerald-200 dark:data-[state=active]:bg-emerald-900/40 dark:data-[state=active]:text-emerald-300 dark:data-[state=active]:border-emerald-700 hover:bg-accent">
                <Bandage className="mr-1.5 h-3.5 w-3.5" /> Coberturas
              </TabsTrigger>
              <TabsTrigger value="diabetic-foot" className="rounded-full border border-border/50 px-3 py-1.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 data-[state=active]:border-amber-200 dark:data-[state=active]:bg-amber-900/40 dark:data-[state=active]:text-amber-300 dark:data-[state=active]:border-amber-700 hover:bg-accent">
                <Footprints className="mr-1.5 h-3.5 w-3.5" /> Pé Diabético
              </TabsTrigger>
              <TabsTrigger value="vascular-ulcers" className="rounded-full border border-border/50 px-3 py-1.5 text-xs sm:text-sm font-medium transition-all data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700 data-[state=active]:border-violet-200 dark:data-[state=active]:bg-violet-900/40 dark:data-[state=active]:text-violet-300 dark:data-[state=active]:border-violet-700 hover:bg-accent">
                <Activity className="mr-1.5 h-3.5 w-3.5" /> Úlceras
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>

        {/* TAB 1: AVALIAÇÃO DE TECIDOS */}
        <TabsContent value="tissues" className="mt-2 space-y-6">
          {/* Card Princípios TIME */}
          <Card className="overflow-hidden border-l-4 border-l-primary shadow-md">
            <div className="bg-primary/5 p-3 border-b border-primary/10">
              <h3 className="flex items-center gap-2 text-sm sm:text-lg font-bold text-primary">
                <Info className="h-4 w-4 sm:h-5 sm:w-5" />Princípios TIME
              </h3>
            </div>
            <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-card border rounded-lg p-2 text-center shadow-sm">
                <span className="block text-xl sm:text-2xl font-black text-primary mb-0.5">T</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide">Tecido</span>
              </div>
              <div className="bg-card border rounded-lg p-2 text-center shadow-sm">
                <span className="block text-xl sm:text-2xl font-black text-primary mb-0.5">I</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide">Infecção</span>
              </div>
              <div className="bg-card border rounded-lg p-2 text-center shadow-sm">
                <span className="block text-xl sm:text-2xl font-black text-primary mb-0.5">M</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide">Umidade</span>
              </div>
              <div className="bg-card border rounded-lg p-2 text-center shadow-sm">
                <span className="block text-xl sm:text-2xl font-black text-primary mb-0.5">E</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wide">Bordas</span>
              </div>
            </CardContent>
          </Card>

          {/* Dica de Mensuração (Novo) */}
          <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-sm sm:text-base text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <Ruler className="h-4 w-4" /> Técnica de Mensuração: Método do Relógio
              </CardTitle>
            </CardHeader>
            <CardContent className="py-3 px-4 text-xs sm:text-sm text-muted-foreground">
              <p>Para descrever túneis (sinus) e descolamentos (undermining), imagine a ferida como um relógio, onde a <strong>cabeça do paciente é às 12:00</strong> e os <strong>pés às 06:00</strong>.</p>
              <div className="mt-2 p-2 bg-background/50 rounded border border-blue-100 dark:border-blue-800 text-xs font-mono">
                Exemplo: "Túnel de 3cm às 09:00" (Lado direito do paciente, se vista frontal).
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Seletor de Tecido */}
            <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3">
              {tissueTypes.map((tissue) => (
                <button
                  key={tissue.name}
                  onClick={() => setSelectedTissue(tissue)}
                  className={cn(
                    "group relative flex flex-col lg:flex-row items-center lg:items-center gap-2 lg:gap-3 rounded-xl border p-2 lg:p-3 text-center lg:text-left transition-all duration-200 hover:shadow-md",
                    selectedTissue.name === tissue.name
                      ? `${tissue.lightBg} ${tissue.borderColor} ring-1 ring-inset ${tissue.borderColor.replace('border-', 'ring-')}`
                      : "bg-card hover:bg-accent"
                  )}
                >
                  <div className={cn("flex h-8 w-8 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110", tissue.bgColor, "text-white")}>
                    <Bandage className="h-4 w-4 lg:h-5 lg:w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn("font-semibold text-xs lg:text-sm leading-tight", tissue.textColor)}>{tissue.name}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium hidden lg:block">{tissue.color}</p>
                  </div>
                  {selectedTissue.name === tissue.name && (
                    <div className={cn("absolute right-2 top-2 lg:top-1/2 lg:-translate-y-1/2 h-1.5 w-1.5 rounded-full", tissue.bgColor)} />
                  )}
                </button>
              ))}
            </div>
            
            {/* Detalhes do Tecido */}
            <div className="lg:col-span-2">
              <Card className={cn("shadow-lg border-t-4 h-full", selectedTissue.borderColor)}>
                <CardHeader className={cn("p-4 lg:pb-4", selectedTissue.lightBg)}>
                  <CardTitle className={cn("text-lg lg:text-xl", selectedTissue.textColor)}>{selectedTissue.name}</CardTitle>
                  <CardDescription className="text-xs lg:text-sm font-medium text-foreground/80">{selectedTissue.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 space-y-4 lg:space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-xs lg:text-sm font-bold text-primary mb-2 uppercase tracking-wider">
                      <CheckCircle className="h-3.5 w-3.5 lg:h-4 lg:w-4" /> Objetivos
                    </h4>
                    <p className="text-xs lg:text-sm leading-relaxed text-muted-foreground">{selectedTissue.objectives}</p>
                  </div>
                  <div>
                    <h4 className="flex items-center gap-2 text-xs lg:text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                      <Bandage className="h-3.5 w-3.5 lg:h-4 lg:w-4" /> Indicações
                    </h4>
                    <div className="flex flex-wrap gap-1.5 lg:gap-2">
                      {selectedTissue.dressings.map((dressing, idx) => (
                        <Badge key={idx} variant="secondary" className="px-2 py-0.5 lg:px-3 lg:py-1 text-[10px] lg:text-xs font-medium bg-secondary/50 hover:bg-secondary/70">{dressing}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: LPP */}
        <TabsContent value="pressure-injury" className="mt-4 space-y-4">
          <Card className="border-destructive/20 bg-destructive/5 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-destructive text-sm sm:text-lg">
                <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5" />Prevenção é a Chave
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-xs sm:text-sm text-muted-foreground font-medium">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 pt-2">
                <div className="flex items-center gap-2 bg-background p-2 rounded border"><Clock className="h-3.5 w-3.5 text-destructive"/> Mudança decúbito (2h)</div>
                <div className="flex items-center gap-2 bg-background p-2 rounded border"><ArrowDown className="h-3.5 w-3.5 text-destructive"/> Superfícies de alívio</div>
                <div className="flex items-center gap-2 bg-background p-2 rounded border"><Droplet className="h-3.5 w-3.5 text-destructive"/> Hidratação da pele</div>
                <div className="flex items-center gap-2 bg-background p-2 rounded border"><Activity className="h-3.5 w-3.5 text-destructive"/> Nutrição adequada</div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-2 sm:space-y-3">
            {pressureInjuryStages.map((item) => (
              <div key={item.stage} className="group border rounded-xl bg-card shadow-sm hover:shadow-md transition-all overflow-hidden">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-0">
                    <AccordionTrigger className="px-3 py-3 sm:px-4 hover:no-underline hover:bg-muted/30">
                      <div className="flex items-center gap-2 sm:gap-3 w-full text-left">
                        <Badge className={cn("text-white text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 min-w-[70px] justify-center shrink-0", item.badgeColor)}>{item.stage}</Badge>
                        <span className="font-semibold text-xs sm:text-sm md:text-base line-clamp-1 sm:line-clamp-none">{item.description}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 sm:px-4 pb-4 pt-0">
                      <div className="grid md:grid-cols-2 gap-3 sm:gap-4 pt-3 border-t mt-1">
                        <div className="space-y-2 sm:space-y-3">
                          <div>
                            <h4 className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase mb-1">Características</h4>
                            <ul className="list-disc pl-4 text-xs sm:text-sm text-foreground/80 space-y-0.5 marker:text-muted-foreground">
                              {item.characteristics.map((char, i) => <li key={i}>{char}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-[10px] sm:text-xs font-bold text-primary uppercase mb-1">Objetivos</h4>
                            <p className="text-xs sm:text-sm text-foreground/80">{item.objectives}</p>
                          </div>
                        </div>
                        <div className="bg-muted/30 p-2.5 sm:p-3 rounded-lg h-fit">
                          <h4 className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase mb-2">Coberturas Recomendadas</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {item.dressings.map((dressing, idx) => (
                              <Badge key={idx} variant="outline" className="text-[10px] bg-background border-border/60">{dressing}</Badge>
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

        {/* TAB 3: DIAGNÓSTICO DIFERENCIAL (NOVA) */}
        <TabsContent value="diff-dx" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertOctagon className="h-5 w-5 text-orange-500" />
                LPP vs. IAD (Dermatite Associada à Incontinência)
              </CardTitle>
              <CardDescription>
                Distinção crucial para a escolha do tratamento correto. IAD é frequentemente confundida com LPP Estágio 1 ou 2.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[100px]">Característica</TableHead>
                      <TableHead className="text-red-600 font-bold">Lesão por Pressão (LPP)</TableHead>
                      <TableHead className="text-orange-600 font-bold">Dermatite (IAD)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {differentialDiagnosis.map((item, index) => (
                      <TableRow key={index} className="text-xs sm:text-sm">
                        <TableCell className="font-medium bg-muted/20">{item.feature}</TableCell>
                        <TableCell>{item.lpp}</TableCell>
                        <TableCell>{item.iad}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900 text-xs sm:text-sm text-muted-foreground">
                <strong>Dica de Ouro:</strong> Se a lesão estiver em uma dobra de pele ou onde a fralda toca, provavelmente é IAD. Se estiver exatamente sobre o osso (sacro), provavelmente é LPP. Ambas podem coexistir.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: DESBRIDAMENTO (NOVA) */}
        <TabsContent value="debridement" className="mt-4 space-y-6">
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                <AlertOctagon className="h-5 w-5" /> O Inimigo Oculto: Biofilme
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                Biofilme é uma comunidade de bactérias envolta por uma matriz protetora que adere ao leito da ferida. É a principal causa de feridas estagnadas (não cicatrizam).
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-background">Invisível a olho nu</Badge>
                <Badge variant="secondary" className="bg-background">Resistente a antibióticos</Badge>
                <Badge variant="secondary" className="bg-background">Requer desbridamento frequente</Badge>
                <Badge variant="secondary" className="bg-background">Usar PHMB ou Prata</Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {debridementTypes.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-center gap-3 space-y-0">
                    <div className="p-2 bg-muted rounded-full">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base font-bold">{item.type}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs sm:text-sm space-y-3">
                    <p className="text-muted-foreground">{item.mechanism}</p>
                    
                    <div className="grid grid-cols-[70px_1fr] gap-2 items-baseline">
                      <span className="font-bold text-green-600 text-[10px] uppercase">Indicação</span>
                      <span>{item.indication}</span>
                    </div>
                    
                    <div className="grid grid-cols-[70px_1fr] gap-2 items-baseline">
                      <span className="font-bold text-blue-600 text-[10px] uppercase">Produtos</span>
                      <span>{item.products}</span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <div className="flex-1 bg-green-50 dark:bg-green-950/30 p-2 rounded text-[10px]">
                        <span className="font-bold text-green-700 block mb-1">Vantagens</span>
                        {item.pros}
                      </div>
                      <div className="flex-1 bg-red-50 dark:bg-red-950/30 p-2 rounded text-[10px]">
                        <span className="font-bold text-red-700 block mb-1">Desvantagens</span>
                        {item.cons}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* TAB 5: PÉ DIABÉTICO */}
        <TabsContent value="diabetic-foot" className="mt-4 space-y-4">
          <Card className="border-l-4 border-l-destructive shadow-md bg-gradient-to-r from-destructive/5 to-transparent">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-destructive text-sm sm:text-lg">
                <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5" />Prevenção e Educação
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="grid sm:grid-cols-2 gap-1.5 text-xs sm:text-sm text-muted-foreground">
                {diabeticFootData.prevention.slice(0, 6).map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive/60 shrink-0 mt-0.5"/>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Footprints className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-bold text-base sm:text-lg text-amber-800 dark:text-amber-200">Classificação de Wagner</h3>
            </div>
            
            <div className="grid gap-2 sm:gap-3">
              {diabeticFootData.wagnerClassification.map((item) => (
                <div key={item.grade} className="border rounded-xl bg-card shadow-sm hover:shadow-md transition-all overflow-hidden">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-0">
                      <AccordionTrigger className="px-3 py-3 sm:px-4 hover:no-underline hover:bg-muted/30">
                        <div className="flex items-center gap-2 sm:gap-3 w-full text-left">
                          <Badge className={cn("text-white text-[10px] sm:text-xs w-12 sm:w-16 justify-center shrink-0 font-bold", item.badgeColor)}>{item.grade}</Badge>
                          <span className="font-semibold text-xs sm:text-sm md:text-base text-foreground/90">{item.description}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 sm:px-4 pb-4 pt-0">
                        <div className="pt-3 border-t mt-1 space-y-3">
                          <div>
                            <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-1">Características</span>
                            <ul className="list-disc pl-4 text-xs sm:text-sm text-foreground/80 space-y-0.5 marker:text-muted-foreground">
                              {item.characteristics.map((char, i) => <li key={i}>{char}</li>)}
                            </ul>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-900/20 p-2.5 sm:p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                            <span className="text-[10px] sm:text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide block mb-1">Conduta / Objetivos</span>
                            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">{item.objectives}</p>
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

        {/* TAB 6: ÚLCERAS */}
        <TabsContent value="vascular-ulcers" className="mt-4 space-y-4">
          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-sm sm:text-lg">
                <Scale className="h-4 w-4 sm:h-5 sm:w-5" />Índice Tornozelo-Braquial (ITB)
              </CardTitle>
              <CardDescription className="text-[10px] sm:text-xs">Fórmula: <strong>Maior PS Tornozelo ÷ Maior PS Braquial</strong></CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto w-full">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b-blue-200 dark:border-b-blue-800">
                      <TableHead className="text-blue-900 dark:text-blue-100 font-bold h-8 text-xs sm:text-sm">Valor ITB</TableHead>
                      <TableHead className="text-blue-900 dark:text-blue-100 font-bold h-8 text-xs sm:text-sm">Interpretação</TableHead>
                      <TableHead className="text-blue-900 dark:text-blue-100 font-bold h-8 text-xs sm:text-sm">Conduta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-[10px] sm:text-sm">
                    <TableRow className="hover:bg-blue-100/50 dark:hover:bg-blue-900/50 border-b-blue-100 dark:border-b-blue-900/50">
                      <TableCell className="font-semibold py-2">{'>'} 1.3</TableCell><TableCell className="py-2">Não compressível</TableCell><TableCell className="py-2">Investigar</TableCell>
                    </TableRow>
                    <TableRow className="bg-green-100/50 dark:bg-green-900/20 border-b-green-200 dark:border-b-green-900/30">
                      <TableCell className="font-semibold text-green-800 dark:text-green-300 py-2">0.9 - 1.3</TableCell><TableCell className="py-2">Normal</TableCell><TableCell className="py-2">Compressão OK</TableCell>
                    </TableRow>
                    <TableRow className="bg-yellow-100/50 dark:bg-yellow-900/20 border-b-yellow-200 dark:border-b-yellow-900/30">
                      <TableCell className="font-semibold text-yellow-800 dark:text-yellow-300 py-2">0.5 - 0.8</TableCell><TableCell className="py-2">DAP Leve/Mod.</TableCell><TableCell className="py-2">Compressão leve</TableCell>
                    </TableRow>
                    <TableRow className="bg-red-100/50 dark:bg-red-900/20 border-b-red-200 dark:border-b-red-900/30">
                      <TableCell className="font-semibold text-red-800 dark:text-red-300 py-2">{'<'} 0.5</TableCell><TableCell className="py-2">DAP Grave</TableCell><TableCell className="font-bold text-destructive py-2">SEM COMPRESSÃO</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Úlcera Venosa */}
            <Card className="border-t-4 border-t-blue-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-blue-50/50 dark:bg-blue-950/20 p-4 pb-3">
                <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2 text-sm sm:text-base">
                  <Heart className="h-5 w-5" /> Úlcera Venosa
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="font-bold text-blue-600 uppercase text-[10px] sm:text-xs">Causa</span>
                  <p className="font-medium">Insuficiência Venosa Crônica</p>
                </div>
                <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] sm:text-xs">Lesão</span>
                  <p className="text-muted-foreground">Terço distal, superficial, bordas irregulares, muito exsudato.</p>
                </div>
                <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] sm:text-xs">Pele</span>
                  <p className="text-muted-foreground">Dermatite ocre, edema, lipodermoesclerose.</p>
                </div>
                <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] sm:text-xs">Dor</span>
                  <div className="flex items-center gap-2 text-green-600 font-medium">
                    <ArrowUp className="h-3.5 w-3.5" /> Melhora elevando
                  </div>
                </div>
                <div className="pt-2 border-t border-blue-100 dark:border-blue-900 mt-2">
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white w-full justify-center py-1.5 text-[10px] sm:text-xs">
                    Conduta: Compressão + Elevação
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Úlcera Arterial */}
            <Card className="border-t-4 border-t-red-500 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-red-50/50 dark:bg-red-950/20 p-4 pb-3">
                <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2 text-sm sm:text-base">
                  <Activity className="h-5 w-5" /> Úlcera Arterial
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="font-bold text-red-600 uppercase text-[10px] sm:text-xs">Causa</span>
                  <p className="font-medium">Doença Arterial (Isquemia)</p>
                </div>
                <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] sm:text-xs">Lesão</span>
                  <p className="text-muted-foreground">Pontas dos dedos/maléolo, profunda, "saca-bocado", seca.</p>
                </div>
                <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] sm:text-xs">Pele</span>
                  <p className="text-muted-foreground">Fria, pálida, brilhante, sem pelos, unhas espessas.</p>
                </div>
                <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[100px_1fr] gap-2 items-baseline">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] sm:text-xs">Dor</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-red-500 font-medium"><ArrowUp className="h-3.5 w-3.5" /> Piora elevando</div>
                    <div className="flex items-center gap-2 text-green-600 font-medium"><ArrowDown className="h-3.5 w-3.5" /> Melhora pendendo</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-red-100 dark:border-red-900 mt-2">
                  <Badge className="bg-red-600 hover:bg-red-700 text-white w-full justify-center py-1.5 text-[10px] sm:text-xs">
                    CONTRAINDICADO COMPRESSÃO!
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 7: COBERTURAS */}
        <TabsContent value="dressings" className="mt-4 space-y-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cobertura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-sm"
            />
          </div>

          {filteredDressings.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {filteredDressings.map((dressing, index) => {
                const itemId = `/wound-care#${dressing.name.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                  <Accordion type="single" collapsible key={index}>
                    <AccordionItem value={`item-${index}`} className="border rounded-lg px-3 bg-card shadow-sm">
                      <div className="flex items-center py-1">
                        <AccordionTrigger className="flex-1 group hover:no-underline text-left py-3">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 rounded-md shrink-0">
                              <Bandage className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
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
                        <div className="flex gap-2"><CheckCircle className="h-4 w-4 text-green-600 shrink-0" /><div className="flex-1"><span className="font-bold text-green-700 block mb-0.5 text-[10px] uppercase">Indicação</span>{dressing.indication}</div></div>
                        <div className="flex gap-2"><Zap className="h-4 w-4 text-blue-600 shrink-0" /><div className="flex-1"><span className="font-bold text-blue-700 block mb-0.5 text-[10px] uppercase">Ação</span>{dressing.action}</div></div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="flex gap-2"><Clock className="h-4 w-4 text-cyan-600 shrink-0" /><div className="flex-1"><span className="font-bold text-cyan-700 block mb-0.5 text-[10px] uppercase">Troca</span>{dressing.changeInterval}</div></div>
                          <div className="flex gap-2"><AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" /><div className="flex-1"><span className="font-bold text-amber-700 block mb-0.5 text-[10px] uppercase">Cuidado</span>{dressing.contraindication}</div></div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </div>
          ) : (
            <Card><CardContent className="py-12 text-center text-muted-foreground flex flex-col items-center gap-2">
              <Search className="h-8 w-8 opacity-20" />
              <p className="text-sm">Nenhuma cobertura encontrada.</p>
            </CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WoundCare;