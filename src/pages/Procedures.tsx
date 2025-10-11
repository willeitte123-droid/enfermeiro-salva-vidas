import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Syringe, Droplets, Info, AirVent, Bandage, CheckSquare, GitBranchPlus, Beaker, Bone, Scissors } from "lucide-react";

const procedures = [
  {
    title: "Sondagem Vesical de Demora (SVD)",
    icon: ClipboardList,
    color: "text-blue-500",
    openColor: "text-blue-600",
    description: "Inserção de um cateter na bexiga para drenagem contínua de urina.",
    materials: [
      "Pacote de cateterismo estéril", "Luvas estéreis", "Sonda de Foley", "Xilocaína gel", "Seringa 10/20ml", "Água destilada", "Clorexidina aquosa", "Bolsa coletora"
    ],
    steps: [
      "Explicar o procedimento e garantir privacidade.",
      "Realizar higiene íntima.",
      "Abrir campo estéril e calçar luvas estéreis.",
      "Realizar antissepsia da região genital.",
      "Lubrificar e introduzir a sonda até o retorno de urina.",
      "Insuflar o balonete com água destilada.",
      "Conectar à bolsa coletora e fixar a sonda.",
      "Registrar o procedimento e características da urina."
    ],
    observations: "Técnica estritamente asséptica é crucial para prevenir ITU. Nunca force a passagem da sonda. Documente o volume do balonete."
  },
  {
    title: "Acesso Venoso Periférico (AVP)",
    icon: Syringe,
    color: "text-red-500",
    openColor: "text-red-600",
    description: "Punção de uma veia periférica para administração de fluidos e medicamentos.",
    materials: [
      "Cateter sobre agulha (Jelco)", "Luvas de procedimento", "Garrote", "Swab com álcool 70%", "Curativo transparente", "Seringa com SF 0,9%"
    ],
    steps: [
      "Escolher a veia (distal para proximal, membro não dominante).",
      "Aplicar garrote e realizar antissepsia (aguardar secar).",
      "Puncionar com bisel para cima (15-30º).",
      "Observar refluxo sanguíneo, progredir o cateter e remover a agulha.",
      "Soltar o garrote e conectar o equipo/polifix.",
      "Testar perviedade com flush de SF 0,9%.",
      "Fixar com curativo transparente e identificar o acesso.",
      "Descartar perfurocortante adequadamente."
    ],
    observations: "Evitar articulações. Não puncionar membros com fístula, esvaziamento ganglionar ou lesões. Trocar apenas com indicação clínica."
  },
  {
    title: "Inserção de Cateter Central de Inserção Periférica (PICC)",
    icon: GitBranchPlus,
    color: "text-indigo-500",
    openColor: "text-indigo-600",
    description: "Procedimento estéril para inserção de um cateter venoso central através de uma veia periférica.",
    materials: [
      "Kit PICC completo", "Ultrassom com probe linear", "Campo estéril amplo", "Anestésico local (Lidocaína)", "Equipamentos de proteção individual (EPI) completos"
    ],
    steps: [
      "Obter consentimento informado.",
      "Avaliar a rede venosa com ultrassom (veias basílica, braquial, cefálica).",
      "Realizar paramentação cirúrgica completa.",
      "Realizar antissepsia ampla do membro.",
      "Anestesiar o local da punção.",
      "Puncionar a veia guiado por ultrassom (Técnica de Seldinger).",
      "Introduzir o fio-guia, seguido pelo introdutor/dilatador.",
      "Inserir o cateter PICC até a medida pré-estabelecida.",
      "Confirmar o posicionamento (padrão-ouro: radiografia de tórax).",
      "Realizar curativo estéril com fixador específico."
    ],
    observations: "Procedimento avançado que exige capacitação e certificação específica. Seguir rigorosamente os protocolos institucionais e as resoluções do COFEN."
  },
  {
    title: "Punção Arterial para Gasometria",
    icon: Beaker,
    color: "text-cyan-500",
    openColor: "text-cyan-600",
    description: "Coleta de sangue arterial para análise de gases sanguíneos, pH e eletrólitos.",
    materials: [
      "Seringa específica para gasometria (com heparina)", "Luvas de procedimento", "Antisséptico", "Gaze estéril", "Dispositivo de proteção para agulha"
    ],
    steps: [
      "Realizar o Teste de Allen modificado para avaliar a circulação colateral (se puncionar a artéria radial).",
      "Localizar o pulso arterial (radial, braquial ou femoral).",
      "Realizar antissepsia do local.",
      "Puncionar a artéria em um ângulo de 45-60º (radial) ou 90º (femoral).",
      "Coletar 1-2 mL de sangue (a seringa se encherá com a pressão arterial).",
      "Remover a agulha e aplicar compressão firme no local por 5-10 minutos.",
      "Remover bolhas de ar da seringa, vedá-la e encaminhar ao laboratório imediatamente (em gelo, se necessário)."
    ],
    observations: "Evitar puncionar locais com lesões, fístulas ou infecções. A compressão pós-punção é vital para evitar hematomas."
  },
  {
    title: "Acesso Intraósseo (AIO)",
    icon: Bone,
    color: "text-orange-500",
    openColor: "text-orange-600",
    description: "Punção da cavidade medular óssea para infusão de fluidos e drogas em emergências.",
    materials: [
      "Dispositivo de inserção (ex: EZ-IO, BIG)", "Agulha de calibre apropriado", "Antisséptico", "Seringa com SF 0,9%", "Equipo de infusão"
    ],
    steps: [
      "Identificar o sítio de inserção (ex: tíbia proximal, úmero proximal).",
      "Realizar antissepsia rigorosa do local.",
      "Inserir o dispositivo de punção perpendicularmente ao osso até sentir a perda de resistência.",
      "Remover o mandril e conectar uma seringa.",
      "Aspirar para confirmar a presença de medula óssea (nem sempre visível).",
      "Realizar flush com 10ml de SF 0,9% (pode exigir pressão).",
      "Fixar o dispositivo e iniciar a infusão (pode ser necessário pressurizador)."
    ],
    observations: "Indicado em emergências (PCR, choque) quando o acesso venoso não é obtido rapidamente. É uma ponte temporária até um acesso definitivo ser estabelecido."
  },
  {
    title: "Sutura de Feridas Simples",
    icon: Scissors,
    color: "text-gray-500",
    openColor: "text-gray-600",
    description: "Aproximação das bordas de feridas cutâneas limpas e superficiais.",
    materials: [
      "Kit de sutura estéril (porta-agulha, pinça, tesoura)", "Fio de sutura apropriado", "Anestésico local", "Seringa e agulha", "Antisséptico", "Campo estéril"
    ],
    steps: [
      "Avaliar a ferida (profundidade, contaminação, corpos estranhos).",
      "Realizar anestesia local infiltrativa.",
      "Limpar e irrigar a ferida abundantemente com SF 0,9%.",
      "Realizar a aproximação das bordas da ferida.",
      "Executar a técnica de sutura (ex: pontos simples interrompidos).",
      "Limpar a área suturada e aplicar curativo oclusivo.",
      "Orientar o paciente sobre os cuidados e o retorno para retirada dos pontos."
    ],
    observations: "Realizado por enfermeiros com capacitação específica, conforme protocolos institucionais. Indicado para feridas lineares, limpas e sem perda de tecido."
  },
  {
    title: "Sondagem Nasogástrica/Enteral (SNG/SNE)",
    icon: Droplets,
    color: "text-green-500",
    openColor: "text-green-600",
    description: "Inserção de sonda pelo nariz até o estômago/intestino para alimentação ou drenagem.",
    materials: [
      "Sonda (calibre adequado)", "Luvas", "Xilocaína gel", "Seringa 20ml", "Fita adesiva", "Estetoscópio", "Tira de pH"
    ],
    steps: [
      "Posicionar paciente em Fowler (cabeceira 45-90º).",
      "Medir a sonda (nariz -> lóbulo da orelha -> apêndice xifoide).",
      "Lubrificar e introduzir a sonda, solicitando deglutição.",
      "Verificar posicionamento: aspirar conteúdo gástrico e testar pH (≤ 5.5).",
      "<strong>Padrão-ouro:</strong> solicitar radiografia para confirmar antes do uso.",
      "Fixar a sonda e registrar o procedimento."
    ],
    observations: "Se o paciente tossir ou apresentar dispneia, retire a sonda imediatamente. O método de ausculta com injeção de ar é inseguro e não recomendado."
  },
  {
    title: "Aspiração de Vias Aéreas",
    icon: AirVent,
    color: "text-purple-500",
    openColor: "text-purple-600",
    description: "Remoção de secreções da árvore traqueobrônquica.",
    materials: [
      "Sonda de aspiração estéril", "Luva estéril", "Fonte de vácuo (80-120 mmHg)", "Frasco coletor", "Gaze estéril", "SF 0,9% ou AD"
    ],
    steps: [
      "Hiperoxigenar o paciente por 1-2 minutos.",
      "Calçar luva estéril na mão dominante.",
      "Conectar a sonda e introduzir desligada até encontrar resistência.",
      "Aplicar aspiração intermitente, com movimentos rotacionais, ao retirar a sonda.",
      "O procedimento não deve exceder <strong>15 segundos</strong>.",
      "Reoxigenar o paciente entre as aspirações.",
      "Registrar aspecto e volume da secreção."
    ],
    observations: "Técnica estritamente asséptica. Monitorar SpO2 e FC durante todo o procedimento. Aspirar primeiro a via aérea artificial, depois a boca/nariz com outra sonda."
  },
  {
    title: "Curativo Simples",
    icon: Bandage,
    color: "text-teal-500",
    openColor: "text-teal-600",
    description: "Limpeza e proteção de feridas limpas com baixo potencial de infecção.",
    materials: [
      "Pacote de curativo estéril", "Luvas de procedimento", "Soro fisiológico 0,9% morno", "Cobertura secundária", "Fita adesiva"
    ],
    steps: [
      "Remover o curativo antigo e avaliar a ferida.",
      "Calçar novas luvas ou usar técnica asséptica com pinças.",
      "Limpar a ferida com gaze umedecida em SF 0,9%.",
      "Realizar a limpeza sempre da <strong>área menos contaminada para a mais contaminada</strong> (centro para as bordas).",
      "Secar as bordas da ferida com gaze seca.",
      "Aplicar a cobertura secundária estéril e fixar.",
      "Registrar o procedimento e a evolução da ferida."
    ],
    observations: "Sempre registrar as características da lesão para acompanhar a evolução. Feridas com sinais de infecção exigem avaliação e coberturas específicas."
  }
];

const Procedures = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Guia de Procedimentos</h1>
        <p className="text-muted-foreground">Checklists passo a passo para os principais procedimentos de enfermagem</p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {procedures.map((proc, index) => {
          const Icon = proc.icon;
          return (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 bg-card shadow-sm">
              <AccordionTrigger className="group hover:no-underline text-left">
                <div className="flex items-center gap-4">
                  <Icon className={`h-6 w-6 ${proc.color} flex-shrink-0 transition-colors group-data-[state=open]:${proc.openColor}`} />
                  <div>
                    <h3 className="font-semibold text-lg">{proc.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{proc.description}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                <div>
                  <h4 className="font-semibold text-primary mb-3">Materiais Essenciais</h4>
                  <div className="flex flex-wrap gap-2">
                    {proc.materials.map((material, i) => (
                      <Badge key={i} variant="secondary">{material}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-primary mb-3">Passo a Passo</h4>
                  <ol className="space-y-3">
                    {proc.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <CheckSquare className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span dangerouslySetInnerHTML={{ __html: step }} />
                      </li>
                    ))}
                  </ol>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle className="font-semibold">Pontos Críticos</AlertTitle>
                  <AlertDescription>
                    {proc.observations}
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
};

export default Procedures;