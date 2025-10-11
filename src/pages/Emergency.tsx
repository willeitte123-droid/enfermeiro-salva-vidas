import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, Heart, Stethoscope, Siren, CheckCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const Emergency = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const emergencies = [
    {
      title: "Parada Cardiorrespiratória (PCR)",
      icon: Heart,
      color: "text-red-600",
      openColor: "text-red-700",
      content: [
        "<div class='p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md font-semibold text-blue-800 dark:text-blue-300 mb-3'>Atendimento Pré-Hospitalar (SBV)</div>",
        "<ul>",
        "<li><strong>1. Segurança do Local:</strong> Garanta que a cena é segura para você e para a vítima.</li>",
        "<li><strong>2. Responsividade:</strong> Chame e toque nos ombros da vítima. 'Senhor, senhor, está me ouvindo?'.</li>",
        "<li><strong>3. Acione Ajuda:</strong> Peça para alguém ligar para o serviço de emergência (192) e trazer um DEA.</li>",
        "<li><strong>4. Cheque Pulso e Respiração:</strong> Verifique o pulso carotídeo e a respiração simultaneamente por 5-10 segundos.</li>",
        "<li><strong>5. Inicie RCP de Alta Qualidade:</strong> Se não houver pulso ou respiração, inicie ciclos de <Badge variant='destructive'>30 compressões : 2 ventilações</Badge>.<ul><li>Frequência: <Badge>100-120/min</Badge></li><li>Profundidade: <Badge>5-6 cm</Badge></li><li>Permita o retorno completo do tórax.</li><li>Minimize as interrupções.</li></ul></li>",
        "<li><strong>6. Use o DEA:</strong> Assim que o DEA chegar, ligue-o e siga as instruções. Aplique as pás e afaste-se para análise e choque, se indicado. Reinicie a RCP imediatamente após o choque.</li>",
        "</ul>",
        "<hr class='my-4'/>",
        "<div class='p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-md font-semibold text-indigo-800 dark:text-indigo-300 mb-3'>Atendimento Intra-Hospitalar (SAVC)</div>",
        "<ul>",
        "<li><strong>1. Inicie RCP e Suporte:</strong> Comece a RCP de alta qualidade, oferte O₂ a 100% e conecte o monitor/desfibrilador.</li>",
        "<li><strong>2. Análise do Ritmo (a cada 2 min):</strong> Pause a RCP brevemente para analisar o ritmo.</li>",
        "<li><strong>Ritmos Chocáveis (FV/TV sem pulso):</strong><ul><li><strong>CHOQUE:</strong> Aplique choque (<Badge>120-200J bifásico</Badge>).</li><li>Reinicie a RCP imediatamente por <Badge>2 minutos</Badge>.</li><li>Obtenha acesso IV ou IO.</li><li>Após o 2º choque, administre <strong>Adrenalina</strong> <Badge variant='destructive'>1 mg IV/IO</Badge> a cada 3-5 min.</li><li>Após o 3º choque, considere <strong>Amiodarona</strong> <Badge variant='destructive'>300 mg IV/IO</Badge> em bolus (dose subsequente: 150 mg).</li></ul></li>",
        "<li><strong>Ritmos Não Chocáveis (AESP/Assistolia):</strong><ul><li><strong>NÃO CHOQUE.</strong></li><li>Administre <strong>Adrenalina</strong> <Badge variant='destructive'>1 mg IV/IO</Badge> o mais rápido possível, repetindo a cada 3-5 min.</li><li>Reinicie a RCP imediatamente por <Badge>2 minutos</Badge>.</li><li><strong>BUSQUE E TRATE AS CAUSAS REVERSÍVEIS (5 Hs e 5 Ts).</strong></li></ul></li>",
        "</ul>",
        "<hr class='my-4'/>",
        "<div class='p-2 bg-amber-100 dark:bg-amber-900/20 rounded-md font-semibold text-amber-800 dark:text-amber-300 mb-3'>Causas Reversíveis (5 Hs e 5 Ts)</div>",
        "<ul>",
        "<li><strong>H</strong>ipovolemia, <strong>H</strong>ipóxia, <strong>H</strong>idrogênio (acidose), <strong>H</strong>ipo/<strong>H</strong>ipercalemia, <strong>H</strong>ipotermia.</li>",
        "<li><strong>T</strong>ensão no tórax (pneumotórax), <strong>T</strong>amponamento cardíaco, <strong>T</strong>oxinas, <strong>T</strong>rombose pulmonar, <strong>T</strong>rombose coronariana.</li>",
        "</ul>"
      ]
    },
    {
      title: "Obstrução de Vias Aéreas (OVACE)",
      icon: AlertCircle,
      color: "text-orange-500",
      openColor: "text-orange-600",
      content: [
        "<strong>Obstrução Leve (tosse eficaz):</strong> Encorajar a tosse e monitorar.",
        "<strong>Obstrução Grave (consciente):</strong> Realizar <Badge variant='destructive'>5 golpes dorsais</Badge> seguidos de <Badge variant='destructive'>5 compressões abdominais</Badge> (Manobra de Heimlich).",
        "<strong>Gestantes/Obesos:</strong> Realizar compressões torácicas.",
        "<strong>Lactentes (<1 ano):</strong> Alternar 5 golpes dorsais com 5 compressões torácicas.",
        "Se a vítima ficar <strong>inconsciente</strong>, iniciar RCP imediatamente."
      ]
    },
    {
      title: "Choque Anafilático",
      icon: Siren,
      color: "text-purple-600",
      openColor: "text-purple-700",
      content: [
        "Reconhecer sinais: urticária, angioedema, dispneia, hipotensão.",
        "<strong>PRIMEIRA LINHA:</strong> Administrar <Badge variant='destructive'>Epinefrina 0,3-0,5 mg IM</Badge> (1:1000) no vasto lateral da coxa.",
        "Posicionar paciente em decúbito dorsal com pernas elevadas.",
        "Garantir via aérea e ofertar <Badge variant='destructive'>O₂ 10-15 L/min</Badge>.",
        "Obter 2 acessos venosos calibrosos e iniciar reposição volêmica com SF 0,9%.",
        "<strong>Medicações adjuvantes:</strong> Anti-histamínicos e Corticoides IV.",
        "Monitorização contínua e observação por 4-6 horas."
      ]
    },
    {
      title: "Crise Convulsiva",
      icon: AlertCircle,
      color: "text-yellow-500",
      openColor: "text-yellow-600",
      content: [
        "<strong>Durante a crise:</strong> Proteger a cabeça, afastar objetos, afrouxar roupas. <strong>NÃO</strong> conter e <strong>NÃO</strong> colocar nada na boca.",
        "Anotar o horário de início e observar as características.",
        "<strong>Após a crise:</strong> Posicionar em decúbito lateral (posição de recuperação).",
        "<strong>Estado de Mal Epiléptico (>5 min):</strong> Acionar ajuda, obter acesso venoso e administrar <Badge variant='destructive'>Benzodiazepínico IV</Badge> (Diazepam ou Midazolam) conforme protocolo."
      ]
    },
    {
      title: "Hemorragia Externa Grave",
      icon: Heart,
      color: "text-red-500",
      openColor: "text-red-600",
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
      color: "text-blue-500",
      openColor: "text-blue-600",
      content: [
        "Confirmar glicemia capilar (<Badge variant='destructive'><70 mg/dL</Badge>).",
        "<strong>Paciente consciente:</strong> Oferecer 15g de carboidrato simples (ex: 150ml de suco). Reavaliar em 15 min (Regra dos 15).",
        "<strong>Paciente inconsciente:</strong> <strong>NÃO</strong> dar nada via oral. Obter acesso venoso e administrar <Badge variant='destructive'>Glicose 50% 25-50 mL IV</Badge>.",
        "Sem acesso venoso: Administrar <Badge variant='destructive'>Glucagon 1 mg IM</Badge>.",
        "Após recuperação, oferecer lanche com carboidrato complexo."
      ]
    }
  ];

  const filteredEmergencies = emergencies.filter(emergency =>
    emergency.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emergency.content.join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Urgências e Emergências</h1>
        <p className="text-muted-foreground">Protocolos rápidos e diretos para atendimento de emergência</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por emergência (ex: PCR, choque...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
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

      <div className="grid md:grid-cols-2 gap-4">
        {filteredEmergencies.map((emergency, index) => {
          const Icon = emergency.icon;
          return (
            <Accordion type="single" collapsible key={index}>
              <AccordionItem value={`item-${index}`} className="border rounded-lg px-4 bg-card shadow-sm">
                <AccordionTrigger className="group hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 ${emergency.color} transition-colors group-data-[state=open]:${emergency.openColor}`} />
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
            </Accordion>
          );
        })}
      </div>
      {filteredEmergencies.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhuma emergência encontrada para "{searchTerm}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Emergency;