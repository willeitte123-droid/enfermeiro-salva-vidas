import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bandage, Info } from "lucide-react";

const WoundCare = () => {
  const tissueTypes = [
    {
      name: "Tecido de Granulação",
      color: "Vermelho/Rosa",
      description: "Tecido saudável em processo de cicatrização, rico em vasos sanguíneos",
      dressings: [
        "Hidrocoloide",
        "Alginato de cálcio",
        "Hidrogel",
        "Filme transparente",
        "Espuma de poliuretano"
      ],
      objectives: "Manter ambiente úmido e proteger o tecido"
    },
    {
      name: "Tecido Fibrinoso",
      color: "Amarelo",
      description: "Camada de fibrina e exsudato, indica necessidade de desbridamento",
      dressings: [
        "Hidrogel (para desbridamento autolítico)",
        "Alginato de cálcio",
        "Hidrocoloide",
        "Papaína",
        "Colagenase"
      ],
      objectives: "Facilitar desbridamento e remover tecido desvitalizado"
    },
    {
      name: "Tecido Necrótico",
      color: "Preto/Marrom",
      description: "Tecido morto, escara seca ou úmida que impede cicatrização",
      dressings: [
        "Hidrogel (para amolecimento)",
        "Desbridamento cirúrgico/instrumental",
        "Papaína 10%",
        "AGE (Ácidos Graxos Essenciais)"
      ],
      objectives: "Remover tecido necrótico completamente antes de outras coberturas"
    },
    {
      name: "Tecido Esfacelado",
      color: "Branco/Cinza",
      description: "Tecido desvitalizado úmido, geralmente aderido à ferida",
      dressings: [
        "Hidrogel",
        "Hidrocoloide",
        "Papaína 2-6%",
        "Colagenase"
      ],
      objectives: "Promover desbridamento autolítico e preparar leito da ferida"
    },
    {
      name: "Tecido Epitelial",
      color: "Rosa claro/branco pérola",
      description: "Tecido de reepitelização, fase final da cicatrização",
      dressings: [
        "Filme transparente",
        "Hidrocoloide fino",
        "AGE",
        "Silicone"
      ],
      objectives: "Proteger nova pele e prevenir trauma mecânico"
    }
  ];

  const dressingTypes = [
    {
      name: "Hidrocoloide",
      indication: "Feridas limpas com pouco exsudato, tecido de granulação",
      characteristics: "Absorve exsudato, mantém umidade, promove desbridamento autolítico"
    },
    {
      name: "Hidrogel",
      indication: "Feridas secas, necrose, tecido esfacelado",
      characteristics: "Hidrata, facilita desbridamento, alivia dor"
    },
    {
      name: "Alginato de Cálcio",
      indication: "Feridas com médio a grande exsudato",
      characteristics: "Alta absorção, hemostático, forma gel ao contato com exsudato"
    },
    {
      name: "Espuma de Poliuretano",
      indication: "Feridas exsudativas, proteção de proeminências ósseas",
      characteristics: "Absorvente, térmica, confortável"
    },
    {
      name: "Papaína",
      indication: "Desbridamento químico, tecido necrótico ou esfacelado",
      characteristics: "Enzimático, diferentes concentrações (2% a 10%)"
    },
    {
      name: "Carvão Ativado",
      indication: "Feridas infectadas ou com odor",
      characteristics: "Absorve bactérias e odor, controla infecção"
    },
    {
      name: "Filme Transparente",
      indication: "Proteção de pele íntegra, feridas superficiais",
      characteristics: "Impermeável a líquidos, permeável a gases"
    },
    {
      name: "AGE (Ácidos Graxos Essenciais)",
      indication: "Prevenção e tratamento de lesões, pele ressecada",
      characteristics: "Mantém umidade, promove cicatrização, nutritivo"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Curativos e Tipos de Tecido</h1>
        <p className="text-muted-foreground">Guia de identificação de tecidos e coberturas apropriadas</p>
      </div>

      <Tabs defaultValue="tissues" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tissues">Tipos de Tecido</TabsTrigger>
          <TabsTrigger value="dressings">Coberturas</TabsTrigger>
        </TabsList>

        <TabsContent value="tissues" className="space-y-4">
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
          <Card className="border-primary/50 bg-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Princípios de Seleção
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Avaliar tipo de tecido, quantidade de exsudato e sinais de infecção</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Manter ambiente úmido favorece cicatrização</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Trocar curativo conforme saturação ou protocolo institucional</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Documentar evolução da ferida a cada troca</span>
                </li>
              </ul>
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
                    <h4 className="font-semibold text-sm text-muted-foreground mb-1">Características</h4>
                    <p className="text-sm">{dressing.characteristics}</p>
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
