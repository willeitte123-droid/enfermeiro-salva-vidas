import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Syringe, Droplets, Info, AirVent, Bandage, CheckSquare } from "lucide-react";

const procedures = [
  {
    title: "Sondagem Vesical de Demora (SVD)",
    icon: ClipboardList,
    color: "text-blue-500",
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
    title: "Sondagem Nasogástrica/Enteral (SNG/SNE)",
    icon: Droplets,
    color: "text-green-500",
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
              <AccordionTrigger className="hover:no-underline text-left">
                <div className="flex items-center gap-4">
                  <Icon className={`h-6 w-6 ${proc.color} flex-shrink-0`} />
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