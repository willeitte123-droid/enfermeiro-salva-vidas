import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bandage, Info, Droplet, CheckCircle, Zap, XCircle, Search, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import FavoriteButton from "@/components/FavoriteButton";

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
    { name: "Hidrocoloide", indication: "Feridas limpas com exsudato leve a moderado, áreas de pressão.", action: "Forma um gel que mantém o ambiente úmido, promove desbridamento autolítico.", contraindication: "Não usar em feridas infectadas, com exposição óssea/tendínea ou em queimaduras de 3º grau." },
    { name: "Hidrogel", indication: "Feridas secas, com necrose ou esfacelo. Queimaduras.", action: "Hidrata o leito da ferida, amolece tecidos desvitalizados, facilitando o desbridamento autolítico.", contraindication: "Não indicado para feridas com alto exsudato (risco de maceração)." },
    { name: "Alginato de Cálcio", indication: "Feridas com exsudato moderado a alto, cavitárias e sangrantes.", action: "Alta capacidade de absorção, forma um gel ao contato com o exsudato. Possui ação hemostática.", contraindication: "Não usar em feridas secas ou com necrose dura. Requer cobertura secundária." },
    { name: "Espuma de Poliuretano", indication: "Feridas com exsudato moderado a alto, proteção de proeminências ósseas.", action: "Absorvente, mantém o leito úmido, protege contra impacto e é termicamente isolante.", contraindication: "Não indicada para feridas secas ou com pouquíssimo exsudato." },
    { name: "Carvão Ativado com Prata", indication: "Feridas infectadas, com odor fétido e exsudativas.", action: "Controla o odor (carvão) e a infecção (prata). Absorve o exsudato.", contraindication: "Hipersensibilidade à prata. Não cortar a cobertura." },
    { name: "Coberturas com Prata", indication: "Feridas com infecção ou alto risco de infecção (colonização crítica).", action: "A prata tem ação antimicrobiana de amplo espectro. Disponível em espumas, alginatos, hidrofibras.", contraindication: "Hipersensibilidade. Uso por tempo limitado (geralmente até 14 dias) para evitar toxicidade." },
    { name: "Colagenase", indication: "Desbridamento enzimático de tecido necrótico ou esfacelo.", action: "Enzima que degrada seletivamente o colágeno desvitalizado, preservando o tecido de granulação.", contraindication: "Não usar com produtos que contenham prata, iodo ou metais pesados (inativam a enzima)." },
    { name: "AGE (Ácidos Graxos Essenciais)", indication: "Prevenção de lesões por pressão, hidratação de pele, feridas em fase de epitelização.", action: "Promove quimiotaxia, angiogênese e mantém o meio úmido.", contraindication: "Não usar em feridas muito exsudativas ou infectadas." },
    { name: "Filme Transparente", indication: "Fixação de cateteres, proteção de pele íntegra, cobertura de feridas superficiais sem exsudato.", action: "Barreira contra água e bactérias, permite a visualização do local.", contraindication: "Não usar em feridas exsudativas ou infectadas." },
    { name: "Bota de Unna", indication: "Úlceras venosas em membros inferiores, sem infecção.", action: "Bandagem compressiva que melhora o retorno venoso e promove a cicatrização.", contraindication: "Insuficiência arterial (ITB < 0.8), infecção ativa, ICC descompensada." },
    { name: "PHMB (Polihexanida)", indication: "Limpeza de feridas, tratamento de feridas colonizadas ou infectadas.", action: "Antisséptico de amplo espectro com baixa toxicidade celular. Quebra o biofilme.", contraindication: "Hipersensibilidade. Não usar em cartilagem hialina." },
    { name: "Terapia por Pressão Negativa (TPN)", indication: "Feridas complexas, agudas ou crônicas, com alto exsudato.", action: "Aplica pressão subatmosférica controlada, remove exsudato, reduz edema e estimula a granulação.", contraindication: "Necrose não desbridada, malignidade na ferida, fístulas não exploradas, osteomielite não tratada." }
];

const WoundCare = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [selectedTissue, setSelectedTissue] = useState(tissueTypes[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDressings = useMemo(() => {
    return dressingTypes.filter(dressing =>
      dressing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dressing.indication.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dressing.action.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="w-10 flex-shrink-0" /> {/* Spacer */}
        <div className="flex-1 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
            Curativos e Tratamento de Feridas
          </h1>
          <p className="text-muted-foreground">Guia de avaliação de tecidos e seleção de coberturas apropriadas</p>
        </div>
        <div className="w-10 flex-shrink-0">
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/wound-care"
              itemType="Guia"
              itemTitle="Guia de Curativos"
            />
          )}
        </div>
      </div>

      <Tabs defaultValue="tissues" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tissues" className="text-green-700 data-[state=active]:bg-green-600 data-[state=active]:text-white font-semibold">Avaliação da Ferida</TabsTrigger>
          <TabsTrigger value="dressings" className="text-blue-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white font-semibold">Tipos de Cobertura</TabsTrigger>
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

          <div className="grid md:grid-cols-2 gap-4">
            {filteredDressings.map((dressing, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader><CardTitle className="text-lg">{dressing.name}</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" /><div><h4 className="font-semibold text-sm text-green-700 mb-1">Indicação</h4><p className="text-sm">{dressing.indication}</p></div></div>
                  <div className="flex items-start gap-3"><Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" /><div><h4 className="font-semibold text-sm text-blue-700 mb-1">Ação</h4><p className="text-sm">{dressing.action}</p></div></div>
                  <div className="flex items-start gap-3"><AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" /><div><h4 className="font-semibold text-sm text-amber-700 mb-1">Contraindicação / Cuidado</h4><p className="text-sm">{dressing.contraindication}</p></div></div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredDressings.length === 0 && (
            <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhuma cobertura encontrada para "{searchTerm}"</CardContent></Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WoundCare;