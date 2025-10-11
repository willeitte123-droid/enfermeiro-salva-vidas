import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bandage, Info, Droplet } from "lucide-react";

const WoundCare = () => {
  const tissueTypes = [
    {
      name: "Tecido de Granulação",
      color: "Vermelho vivo",
      description: "Tecido conjuntivo novo, vascularizado e saudável. Indica progressão da cicatrização.",
      objectives: "Manter o leito da ferida úmido, proteger contra traumas e promover a epitelização.",
      dressings: ["Espuma não adesiva", "Hidrocoloide", "Filme transparente", "Hidrogel", "AGE"]
    },
    {
      name: "Tecido de Epitelização",
      color: "Rosa pálido/translúcido",
      description: "Camada de novas células epiteliais que migram das bordas da ferida. Fase final da cicatrização.",
      objectives: "Proteger o novo tecido frágil, manter a umidade e evitar maceração.",
      dressings: ["Filme transparente", "Hidrocoloide extrafino", "Curativo de silicone", "AGE"]
    },
    {
      name: "Esfacelo / Fibrina",
      color: "Amarelo/Esbranquiçado",
      description: "Tecido desvitalizado, úmido, composto por fibrina, leucócitos e bactérias. Adere ao leito da ferida.",
      objectives: "Promover o desbridamento autolítico ou enzimático para remover o tecido não viável.",
      dressings: ["Hidrogel com alginato", "Colagenase", "Papaína", "Alginato de cálcio", "Hidrofibra"]
    },
    {
      name: "Necrose de Coagulação (Escara)",
      color: "Preto/Marrom",
      description: "Tecido morto, seco e duro (escara). Impede a cicatrização e pode mascarar infecções.",
      objectives: "Amolecer e remover a escara através de desbridamento (autolítico, enzimático ou cirúrgico).",
      dressings: ["Hidrogel", "Papaína 10%", "Colagenase", "AGE (para manter hidratado)"]
    },
    {
      name: "Sinais de Infecção",
      color: "Variável",
      description: "Presença de sinais flogísticos (dor, calor, rubor, edema), exsudato purulento, odor fétido e tecido friável.",
      objectives: "Controlar a carga bacteriana, gerenciar o exsudato e tratar a infecção sistemicamente se necessário.",
      dressings: ["Alginato com prata", "Espuma com prata/PHMB", "Carvão ativado com prata", "Coberturas com iodo (cadexômero)"]
    }
  ];

  const dressingTypes = [
    {
      name: "Hidrocoloide",
      indication: "Feridas limpas com exsudato leve a moderado, áreas de pressão.",
      action: "Forma um gel que mantém o ambiente úmido, promove desbridamento autolítico.",
      contraindication: "Não usar em feridas infectadas, com exposição óssea/tendínea ou em queimaduras de 3º grau."
    },
    {
      name: "Hidrogel",
      indication: "Feridas secas, com necrose ou esfacelo. Queimaduras.",
      action: "Hidrata o leito da ferida, amolece tecidos desvitalizados, facilitando o desbridamento autolítico.",
      contraindication: "Não indicado para feridas com alto exsudato (risco de maceração)."
    },
    {
      name: "Alginato de Cálcio e Sódio",
      indication: "Feridas com exsudato moderado a alto, cavitárias e sangrantes.",
      action: "Alta capacidade de absorção, forma um gel ao contato com o exsudato. Possui ação hemostática.",
      contraindication: "Não usar em feridas secas ou com necrose dura. Requer cobertura secundária."
    },
    {
      name: "Espuma de Poliuretano",
      indication: "Feridas com exsudato moderado a alto, proteção de proeminências ósseas.",
      action: "Absorvente, mantém o leito úmido, protege contra impacto e é termicamente isolante.",
      contraindication: "Não indicada para feridas secas ou com pouquíssimo exsudato."
    },
    {
      name: "Carvão Ativado com Prata",
      indication: "Feridas infectadas, com odor fétido e exsudativas.",
      action: "Controla o odor (carvão) e a infecção (prata). Absorve o exsudato.",
      contraindication: "Hipersensibilidade à prata. Não cortar a cobertura."
    },
    {
      name: "Coberturas com Prata",
      indication: "Feridas com infecção ou alto risco de infecção (colonização crítica).",
      action: "A prata tem ação antimicrobiana de amplo espectro. Disponível em espumas, alginatos, hidrofibras.",
      contraindication: "Hipersensibilidade. Uso por tempo limitado (geralmente até 14 dias) para evitar toxicidade."
    },
    {
      name: "Colagenase",
      indication: "Desbridamento enzimático de tecido necrótico ou esfacelo.",
      action: "Enzima que degrada seletivamente o colágeno desvitalizado, preservando o tecido de granulação.",
      contraindication: "Não usar com produtos que contenham prata, iodo ou metais pesados (inativam a enzima)."
    },
    {
      name: "AGE (Ácidos Graxos Essenciais)",
      indication: "Prevenção de lesões por pressão, hidratação de pele, feridas em fase de epitelização.",
      action: "Promove quimiotaxia, angiogênese e mantém o meio úmido.",
      contraindication: "Não usar em feridas muito exsudativas ou infectadas."
    },
    {
      name: "Filme Transparente",
      indication: "Fixação de cateteres, proteção de pele íntegra, cobertura de feridas superficiais sem exsudato.",
      action: "Barreira contra água e bactérias, permite a visualização do local.",
      contraindication: "Não usar em feridas exsudativas ou infectadas."
    },
    {
      name: "Bota de Unna",
      indication: "Úlceras venosas em membros inferiores, sem infecção.",
      action: "Bandagem compressiva que melhora o retorno venoso e promove a cicatrização.",
      contraindication: "Insuficiência arterial (ITB < 0.8), infecção ativa, ICC descompensada."
    },
    {
      name: "PHMB (Polihexanida)",
      indication: "Limpeza de feridas, tratamento de feridas colonizadas ou infectadas.",
      action: "Antisséptico de amplo espectro com baixa toxicidade celular. Quebra o biofilme.",
      contraindication: "Hipersensibilidade. Não usar em cartilagem hialina."
    },
    {
      name: "Terapia por Pressão Negativa (TPN)",
      indication: "Feridas complexas, agudas ou crônicas, com alto exsudato.",
      action: "Aplica pressão subatmosférica controlada, remove exsudato, reduz edema e estimula a granulação.",
      contraindication: "Necrose não desbridada, malignidade na ferida, fístulas não exploradas, osteomielite não tratada."
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Curativos e Tratamento de Feridas</h1>
        <p className="text-muted-foreground">Guia de avaliação de tecidos e seleção de coberturas apropriadas</p>
      </div>

      <Tabs defaultValue="tissues" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tissues">Avaliação da Ferida</TabsTrigger>
          <TabsTrigger value="dressings">Tipos de Cobertura</TabsTrigger>
        </TabsList>

        <TabsContent value="tissues" className="space-y-4">
          <Card className="border-primary/50 bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Princípios de Avaliação (TIME)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>T (Tissue - Tecido):</strong> Avaliar o tipo de tecido (granulação, necrose) e desbridar se necessário.</p>
              <p><strong>I (Infection/Inflammation - Infecção/Inflamação):</strong> Identificar e tratar a infecção/inflamação.</p>
              <p><strong>M (Moisture - Umidade):</strong> Manter o equilíbrio da umidade. Ferida seca precisa de hidratação, ferida exsudativa precisa de absorção.</p>
              <p><strong>E (Edge - Bordas):</strong> Avaliar e tratar as bordas da ferida para promover a epitelização.</p>
            </CardContent>
          </Card>

          {tissueTypes.map((tissue, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Bandage className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle>{tissue.name}</CardTitle>
                      <CardDescription className="mt-1">{tissue.description}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline">{tissue.color}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-primary mb-2">Objetivos do Tratamento</h4>
                  <p className="text-sm">{tissue.objectives}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Coberturas Recomendadas</h4>
                  <div className="flex flex-wrap gap-2">
                    {tissue.dressings.map((dressing, idx) => (
                      <Badge key={idx} variant="secondary">{dressing}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="dressings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="h-5 w-5 text-primary" />
                Tipos de Exsudato
              </CardTitle>
              <CardDescription>O tipo e o volume do exsudato guiam a escolha da cobertura.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-2 bg-muted rounded-lg"><strong>Seroso:</strong> Claro, aquoso.</div>
              <div className="p-2 bg-muted rounded-lg"><strong>Sanguinolento:</strong> Vermelho vivo, sanguinolento.</div>
              <div className="p-2 bg-muted rounded-lg"><strong>Serossanguinolento:</strong> Rosado, mistura de seroso e sanguíneo.</div>
              <div className="p-2 bg-muted rounded-lg"><strong>Purulento:</strong> Amarelado/esverdeado, espesso, indica infecção.</div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {dressingTypes.map((dressing, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{dressing.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm text-primary mb-1">Indicação</h4>
                    <p className="text-sm">{dressing.indication}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Ação</h4>
                    <p className="text-sm">{dressing.action}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-destructive mb-1">Contraindicação / Cuidado</h4>
                    <p className="text-sm">{dressing.contraindication}</p>
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

export default WoundCare;