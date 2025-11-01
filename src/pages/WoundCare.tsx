import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bandage, Info, Droplet, CheckCircle, Zap, XCircle, Search, AlertTriangle, ShieldAlert, Scale, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  { stage: "Estágio 2", badgeColor: "bg-pink-500", description: "Perda da pele em sua espessura parcial com exposição da derme.", characteristics: ["Leito da ferida viável, rosa ou vermelho, úmido.", "Pode se apresentar como uma bolha (flictena) intacta ou rompida."], objectives: "Manter um ambiente úmido para cicatrização, proteger de contaminação e gerenciar exsudato.", dressings: ["Hidrocoloide", "Espuma de poliuretano", "Hidrogel", "Filme transparente"] },
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
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Curativos e Tratamento de Feridas</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/wound-care"
              itemType="Guia"
              itemTitle="Guia de Curativos"
            />
          )}
        </div>
        <p className="text-muted-foreground">Guia de avaliação de tecidos e seleção de coberturas apropriadas</p>
      </div>

      <Tabs defaultValue="tissues" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 h-auto bg-transparent p-0">
          <TabsTrigger value="tissues" className="py-2 font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 data-[state=active]:bg-sky-600 data-[state=active]:text-white rounded-md dark:bg-sky-900/50 dark:text-sky-300 dark:hover:bg-sky-900/70 data-[state=active]:dark:bg-sky-600">Avaliação da Ferida</TabsTrigger>
          <TabsTrigger value="pressure-injury" className="py-2 font-semibold text-red-700 bg-red-50 hover:bg-red-100 data-[state=active]:bg-red-600 data-[state=active]:text-white rounded-md dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900/70 data-[state=active]:dark:bg-red-600">Lesão por Pressão</TabsTrigger>
          <TabsTrigger value="diabetic-foot" className="py-2 font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 data-[state=active]:bg-amber-600 data-[state=active]:text-white rounded-md dark:bg-amber-900/50 dark:text-amber-300 dark:hover:bg-amber-900/70 data-[state=active]:dark:bg-amber-600">Pé Diabético</TabsTrigger>
          <TabsTrigger value="vascular-ulcers" className="py-2 font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 data-[state=active]:bg-violet-600 data-[state=active]:text-white rounded-md dark:bg-violet-900/50 dark:text-violet-300 dark:hover:bg-violet-900/70 data-[state=active]:dark:bg-violet-600">Úlceras Vasculares</TabsTrigger>
          <TabsTrigger value="dressings" className="py-2 font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 data-[state=active]:bg-emerald-600 data-[state=active]:text-white rounded-md dark:bg-emerald-900/50 dark:text-emerald-300 dark:hover:bg-emerald-900/70 data-[state=active]:dark:bg-emerald-600">Tipos de Cobertura</TabsTrigger>
        </TabsList>

        <TabsContent value="tissues" className="space-y-4">
          <Card className="border-primary/50 bg-accent">
            <CardHeader><CardTitle className="flex items-center gap-2"><Info className="h-5 w-5 text-primary" />Princípios de Avaliação (TIME)</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>T (Tissue - Tecido):</strong> Avaliar o tipo de tecido e desbridar se necessário.</p>
              <p><strong>I (Infection/Inflammation - Infecção):</strong> Identificar e tratar a infecção/inflamação.</p>
              <p><strong>M (Moisture - Umidade):</strong> Manter o equilíbrio da umidade (hidratar ou absorver).</p>
              <p><strong>E (Edge - Bordas):</strong> Avaliar e tratar as bordas para promover a epitelização.</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-2">
              {tissueTypes.map((tissue) => (
                <div
                  key={tissue.name}
                  onClick={() => setSelectedTissue(tissue)}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3",
                    selectedTissue.name === tissue.name
                      ? `${tissue.borderColor} ring-2 ring-primary bg-accent`
                      : "border-transparent hover:bg-accent"
                  )}
                >
                  <div className={cn("p-2 rounded-full", tissue.bgColor)}>
                    <Bandage className={cn("h-5 w-5", tissue.textColor)} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tissue.name}</h3>
                    <Badge variant="outline" className={tissue.borderColor}>{tissue.color}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="md:col-span-2">
              <Card className="sticky top-6 shadow-lg">
                <CardHeader className={cn("rounded-t-lg", selectedTissue.bgColor, selectedTissue.textColor)}>
                  <CardTitle>{selectedTissue.name}</CardTitle>
                  <CardDescription className={cn("text-sm", selectedTissue.textColor, "opacity-80")}>{selectedTissue.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-2">Objetivos do Tratamento</h4>
                    <p className="text-sm">{selectedTissue.objectives}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Coberturas Recomendadas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTissue.dressings.map((dressing, idx) => (
                        <Badge key={idx} variant="secondary">{dressing}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pressure-injury" className="space-y-4">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="h-5 w-5" />Prevenção é a Chave</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-destructive/90">
              <p><strong>• Reposicionamento:</strong> Mudança de decúbito a cada 2 horas.</p>
              <p><strong>• Superfícies de Suporte:</strong> Uso de colchões e almofadas de alívio de pressão.</p>
              <p><strong>• Cuidados com a Pele:</strong> Manter a pele limpa, seca e hidratada. Gerenciar a umidade.</p>
              <p><strong>• Nutrição:</strong> Garantir aporte calórico e proteico adequado.</p>
            </CardContent>
          </Card>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {pressureInjuryStages.map((item) => (
              <AccordionItem key={item.stage} value={item.stage} className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Badge className={cn("text-white", item.badgeColor)}>{item.stage}</Badge>
                    <span className="font-semibold text-left">{item.description}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <div><h4 className="font-semibold text-sm mb-2">Características</h4><ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {item.characteristics.map((char, i) => <li key={i}>{char}</li>)}
                  </ul></div>
                  <div><h4 className="font-semibold text-sm text-primary mb-2">Objetivos do Tratamento</h4><p className="text-sm">{item.objectives}</p></div>
                  <div><h4 className="font-semibold text-sm mb-2">Coberturas Sugeridas</h4><div className="flex flex-wrap gap-2">
                    {item.dressings.map((dressing, idx) => <Badge key={idx} variant="secondary">{dressing}</Badge>)}
                  </div></div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent value="diabetic-foot" className="space-y-4">
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert className="h-5 w-5" />Prevenção e Educação</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-destructive/90">
              {diabeticFootData.prevention.map((item, index) => (
                <p key={index}><strong>• {item.split(':')[0]}:</strong>{item.split(':')[1]}</p>
              ))}
            </CardContent>
          </Card>
          <Accordion type="single" collapsible className="w-full space-y-3">
            <CardHeader className="px-0"><CardTitle>Classificação de Wagner</CardTitle><CardDescription>Estadiamento da gravidade da lesão no pé diabético.</CardDescription></CardHeader>
            {diabeticFootData.wagnerClassification.map((item) => (
              <AccordionItem key={item.grade} value={item.grade} className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Badge className={cn("text-white", item.badgeColor)}>{item.grade}</Badge>
                    <span className="font-semibold text-left">{item.description}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 space-y-4">
                  <div><h4 className="font-semibold text-sm mb-2">Características</h4><ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {item.characteristics.map((char, i) => <li key={i}>{char}</li>)}
                  </ul></div>
                  <div><h4 className="font-semibold text-sm text-primary mb-2">Objetivos do Tratamento</h4><p className="text-sm">{item.objectives}</p></div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <Card>
            <CardHeader><CardTitle>Pilares do Tratamento</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              {diabeticFootData.treatmentPillars.map((item, index) => (
                <div key={index} className="p-3 bg-muted rounded-md">
                  <h4 className="font-semibold text-sm text-primary">{item.pillar}</h4>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vascular-ulcers" className="space-y-4">
          <Card className="border-blue-500/50 bg-blue-50 dark:bg-blue-950">
            <CardHeader><CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400"><Scale className="h-5 w-5" />Índice Tornozelo-Braquial (ITB)</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">O ITB é <strong>essencial</strong> para diferenciar úlceras e, principalmente, para indicar ou contraindicar a terapia compressiva. É calculado pela fórmula: <strong>Maior Pressão Sistólica do Tornozelo ÷ Maior Pressão Sistólica Braquial</strong>.</p>
              <Table><TableHeader><TableRow><TableHead>Valor do ITB</TableHead><TableHead>Interpretação</TableHead><TableHead>Conduta</TableHead></TableRow></TableHeader>
                <TableBody>
                  <TableRow><TableCell className="font-semibold">{'>'} 1.3</TableCell><TableCell>Artérias não compressíveis (calcificadas)</TableCell><TableCell>Investigar com outros métodos</TableCell></TableRow>
                  <TableRow className="bg-green-100 dark:bg-green-900/30"><TableCell className="font-semibold">0.9 - 1.3</TableCell><TableCell>Normal</TableCell><TableCell>Terapia compressiva segura</TableCell></TableRow>
                  <TableRow className="bg-yellow-100 dark:bg-yellow-900/30"><TableCell className="font-semibold">0.5 - 0.8</TableCell><TableCell>Doença Arterial Periférica (DAP) Leve a Moderada</TableCell><TableCell>Compressão modificada/leve, com cautela</TableCell></TableRow>
                  <TableRow className="bg-red-100 dark:bg-red-900/30"><TableCell className="font-semibold">{'<'} 0.5</TableCell><TableCell>DAP Grave</TableCell><TableCell><strong>Terapia compressiva CONTRAINDICADA</strong></TableCell></TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="grid md:grid-cols-2 gap-6">
            <Card><CardHeader><CardTitle className="text-blue-600">Úlcera Venosa</CardTitle></CardHeader><CardContent className="space-y-4">
              <div><h4 className="font-semibold text-sm mb-2">Características</h4><ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li><strong>Localização:</strong> Terço inferior da perna (área da "bota"), principalmente maléolo medial.</li>
                <li><strong>Aparência:</strong> Bordas irregulares, superficial, leito com tecido de granulação ou fibrina.</li>
                <li><strong>Exsudato:</strong> Moderado a alto.</li>
                <li><strong>Pele ao Redor:</strong> Edema, dermatite de estase, hiperpigmentação ocre.</li>
                <li><strong>Dor:</strong> Melhora com a elevação dos membros.</li>
                <li><strong>Pulsos:</strong> Presentes e normais.</li>
              </ul></div>
              <div><h4 className="font-semibold text-sm text-primary mb-2">Pilares do Tratamento</h4><ul className="list-disc pl-5 space-y-1 text-sm">
                <li className="font-bold">Terapia Compressiva (padrão-ouro).</li>
                <li>Elevação dos membros.</li>
                <li>Controle do exsudato e proteção da pele perilesional.</li>
              </ul></div>
              <div><h4 className="font-semibold text-sm mb-2">Coberturas Sugeridas</h4><div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Bota de Unna</Badge><Badge variant="secondary">Alginato de Cálcio</Badge><Badge variant="secondary">Espuma</Badge><Badge variant="secondary">Hidrofibra</Badge>
              </div></div>
            </CardContent></Card>
            <Card><CardHeader><CardTitle className="text-red-600">Úlcera Arterial</CardTitle></CardHeader><CardContent className="space-y-4">
              <div><h4 className="font-semibold text-sm mb-2">Características</h4><ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li><strong>Localização:</strong> Extremidades (dedos, calcanhar), proeminências ósseas, maléolo lateral.</li>
                <li><strong>Aparência:</strong> Bordas bem definidas ("em saca-bocado"), leito pálido ou necrótico.</li>
                <li><strong>Exsudato:</strong> Mínimo ou ausente.</li>
                <li><strong>Pele ao Redor:</strong> Pálida, fria, sem pelos, unhas espessadas.</li>
                <li><strong>Dor:</strong> Intensa, piora com a elevação dos membros (dor em repouso).</li>
                <li><strong>Pulsos:</strong> Diminuídos ou ausentes.</li>
              </ul></div>
              <div><h4 className="font-semibold text-sm text-primary mb-2">Pilares do Tratamento</h4><ul className="list-disc pl-5 space-y-1 text-sm">
                <li className="font-bold">Avaliação vascular e revascularização.</li>
                <li>Manter o leito seco se houver necrose seca e estável.</li>
                <li>Evitar desbridamento agressivo sem avaliação vascular.</li>
              </ul></div>
              <div className="border-l-4 border-destructive pl-4"><h4 className="font-semibold text-sm text-destructive mb-2">CUIDADO CRÍTICO</h4><p className="text-sm font-bold text-destructive">A TERAPIA COMPRESSIVA É ABSOLUTAMENTE CONTRAINDICADA!</p></div>
            </CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="dressings" className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por tipo de cobertura, indicação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {filteredDressings.length > 0 ? (
            <div className="space-y-4">
              {filteredDressings.map((dressing, index) => {
                const itemId = `/wound-care#${dressing.name.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                  <Accordion type="single" collapsible key={index}>
                    <AccordionItem value={`item-${index}`} className="border rounded-lg px-4 bg-card shadow-sm">
                      <div className="flex items-center">
                        <AccordionTrigger className="flex-1 group hover:no-underline text-left py-0">
                          <div className="flex items-center gap-3 py-4">
                            <Bandage className="h-5 w-5 text-primary" />
                            <p className="font-semibold text-left">{dressing.name}</p>
                          </div>
                        </AccordionTrigger>
                        <div className="pl-4">
                          {profile && (
                            <FavoriteButton
                              userId={profile.id}
                              itemId={itemId}
                              itemType="Cobertura"
                              itemTitle={dressing.name}
                              isInitiallyFavorited={favoriteSet.has(itemId)}
                              isLoading={isLoadingFavorites}
                            />
                          )}
                        </div>
                      </div>
                      <AccordionContent className="pt-4 space-y-4">
                        <div className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /><div><h4 className="font-semibold text-sm text-green-700 mb-1">Indicação</h4><p className="text-sm">{dressing.indication}</p></div></div>
                        <div className="flex items-start gap-3"><Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /><div><h4 className="font-semibold text-sm text-blue-700 mb-1">Ação</h4><p className="text-sm">{dressing.action}</p></div></div>
                        <div className="flex items-start gap-3"><Clock className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" /><div><h4 className="font-semibold text-sm text-cyan-700 mb-1">Período de Troca</h4><p className="text-sm">{dressing.changeInterval}</p></div></div>
                        <div className="flex items-start gap-3"><AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" /><div><h4 className="font-semibold text-sm text-amber-700 mb-1">Contraindicação / Cuidado</h4><p className="text-sm">{dressing.contraindication}</p></div></div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </div>
          ) : (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma cobertura encontrada para "{searchTerm}"</CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WoundCare;