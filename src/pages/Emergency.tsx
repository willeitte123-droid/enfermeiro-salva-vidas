import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, Heart, Stethoscope, Siren, CheckCircle } from "lucide-react";

const Emergency = () => {
  const emergencies = [
    {
      title: "Parada Cardiorrespiratória (PCR)",
      icon: Heart,
      content: [
        "<strong>Verificar responsividade e respiração</strong> (máx 10s).",
        "Acionar ajuda (SAMU 192) e pegar o DEA.",
        "Iniciar compressões: <strong>30 compressões</strong> (100-120/min, 5-6 cm profundidade).",
        "Abrir vias aéreas e realizar <strong>2 ventilações</strong>.",
        "Manter ciclos <strong>30:2</strong> com mínimas interrupções.",
        "Instalar e seguir os comandos do <strong>DEA</strong> assim que disponível.",
        "Trocar o socorrista a cada 2 minutos para evitar fadiga."
      ]
    },
    {
      title: "Obstrução de Vias Aéreas (OVACE)",
      icon: AlertCircle,
      content: [
        "<strong>Obstrução Leve (tosse eficaz):</strong> Encorajar a tosse e monitorar.",
        "<strong>Obstrução Grave (consciente):</strong> Realizar <strong>5 golpes dorsais</strong> seguidos de <strong>5 compressões abdominais</strong> (Manobra de Heimlich).",
        "<strong>Gestantes/Obesos:</strong> Realizar compressões torácicas.",
        "<strong>Lactentes (<1 ano):</strong> Alternar 5 golpes dorsais com 5 compressões torácicas.",
        "Se a vítima ficar <strong>inconsciente</strong>, iniciar RCP imediatamente."
      ]
    },
    {
      title: "Choque Anafilático",
      icon: Siren,
      content: [
        "Reconhecer sinais: urticária, angioedema, dispneia, hipotensão.",
        "<strong>PRIMEIRA LINHA:</strong> Administrar <strong>Epinefrina 0,3-0,5 mg IM</strong> (1:1000) no vasto lateral da coxa.",
        "Posicionar paciente em decúbito dorsal com pernas elevadas.",
        "Garantir via aérea e ofertar <strong>O₂ 10-15 L/min</strong>.",
        "Obter 2 acessos venosos calibrosos e iniciar reposição volêmica com SF 0,9%.",
        "<strong>Medicações adjuvantes:</strong> Anti-histamínicos e Corticoides IV.",
        "Monitorização contínua e observação por 4-6 horas."
      ]
    },
    {
      title: "Crise Convulsiva",
      icon: AlertCircle,
      content: [
        "<strong>Durante a crise:</strong> Proteger a cabeça, afastar objetos, afrouxar roupas. <strong>NÃO</strong> conter e <strong>NÃO</strong> colocar nada na boca.",
        "Anotar o horário de início e observar as características.",
        "<strong>Após a crise:</strong> Posicionar em decúbito lateral (posição de recuperação).",
        "<strong>Estado de Mal Epiléptico (>5 min):</strong> Acionar ajuda, obter acesso venoso e administrar <strong>Benzodiazepínico IV</strong> (Diazepam ou Midazolam) conforme protocolo."
      ]
    },
    {
      title: "Hemorragia Externa Grave",
      icon: Heart,
      content: [
        "<strong>Pressão direta e firme</strong> sobre o ferimento com gaze ou pano limpo.",
        "Elevar o membro afetado (se não houver fratura).",
        "Se o sangramento persistir, aplicar um segundo curativo sobre o primeiro.",
        "<strong>Torniquete:</strong> Usar como último recurso em sangramentos massivos não controláveis. Aplicar 5-7 cm acima da lesão e anotar o horário.",
        "Monitorar sinais de <strong>choque hipovolêmico</strong> (taquicardia, palidez, sudorese, hipotensão)."
      ]
    },
    {
      title: "Hipoglicemia",
      icon: Stethoscope,
      content: [
        "Confirmar glicemia capilar (<strong><70 mg/dL</strong>).",
        "<strong>Paciente consciente:</strong> Oferecer 15g de carboidrato simples (ex: 150ml de suco). Reavaliar em 15 min (Regra dos 15).",
        "<strong>Paciente inconsciente:</strong> <strong>NÃO</strong> dar nada via oral. Obter acesso venoso e administrar <strong>Glicose 50% 25-50 mL IV</strong>.",
        "Sem acesso venoso: Administrar <strong>Glucagon 1 mg IM</strong>.",
        "Após recuperação, oferecer lanche com carboidrato complexo."
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Urgências e Emergências</h1>
        <p className="text-muted-foreground">Protocolos rápidos e diretos para atendimento de emergência</p>
      </div>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Atenção
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive/90">
            Este é um guia de referência rápida. Sempre siga os protocolos institucionais e busque 
            capacitação contínua (BLS/ACLS).
          </p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        {emergencies.map((emergency, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 bg-card shadow-sm">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <emergency.icon className="h-5 w-5 text-primary" />
                <span className="font-semibold text-left">{emergency.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 pt-4 pl-2">
                {emergency.content.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                    <span className="text-sm" dangerouslySetInnerHTML={{ __html: step }} />
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Emergency;