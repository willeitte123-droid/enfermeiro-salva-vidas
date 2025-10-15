import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Siren, Clock, CheckCircle2 } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";

interface Profile {
  id: string;
}

const manchesterData = [
  { color: "Vermelho", level: "Emergência", time: "0 min", bgColor: "bg-red-500", textColor: "text-white", discriminators: ["Parada cardiorrespiratória", "Comprometimento de via aérea", "Respiração inadequada", "Choque", "Convulsão ativa"] },
  { color: "Laranja", level: "Muito Urgente", time: "10 min", bgColor: "bg-orange-500", textColor: "text-white", discriminators: ["Dor torácica severa", "Dispneia severa", "Alteração do nível de consciência", "Hemorragia incontrolável"] },
  { color: "Amarelo", level: "Urgente", time: "60 min", bgColor: "bg-yellow-400", textColor: "text-black", discriminators: ["Dor moderada", "Vômitos persistentes", "Crise hipertensiva sem sintomas graves", "Febre alta em paciente de risco"] },
  { color: "Verde", level: "Pouco Urgente", time: "120 min", bgColor: "bg-green-500", textColor: "text-white", discriminators: ["Dor leve", "Sintomas gripais sem gravidade", "Vômito e diarreia sem desidratação", "Necessidade de curativo"] },
  { color: "Azul", level: "Não Urgente", time: "240 min", bgColor: "bg-blue-500", textColor: "text-white", discriminators: ["Queixas crônicas sem agudização", "Necessidade de receita", "Reavaliação de exames", "Consulta de rotina"] },
];

const ManchesterScale = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
          <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Protocolo de Manchester</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/scales/manchester"
              itemType="Escala"
              itemTitle="Protocolo de Manchester"
            />
          )}
        </div>
        <p className="text-muted-foreground">Guia de referência para classificação de risco em serviços de urgência.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Níveis de Prioridade</CardTitle>
          <CardDescription>Clique em cada nível para ver os principais exemplos de discriminadores.</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {manchesterData.map(item => (
              <AccordionItem key={item.level} value={item.level} className="border-none">
                <AccordionTrigger className={`p-4 rounded-lg ${item.bgColor} ${item.textColor} hover:no-underline`}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <Siren className="h-5 w-5" />
                      <span className="font-bold text-lg">{item.color} ({item.level})</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>Até {item.time}</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 px-2">
                  <ul className="space-y-2">
                    {item.discriminators.map((disc, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{disc}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManchesterScale;