import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Syringe, Droplets, Info, AirVent, Bandage } from "lucide-react";

const procedures = [
  {
    title: "Sondagem Vesical de Demora (SVD)",
    icon: ClipboardList,
    description: "Inserção de um cateter na bexiga para drenagem contínua de urina.",
    materials: [
      "Pacote de cateterismo vesical estéril", "Luvas estéreis e de procedimento", "Sonda de Foley (calibre adequado)",
      "Anestésico tópico (ex: Xilocaína gel)", "Seringa 10ml", "Água destilada", "Clorexidina aquosa",
      "Gaze estéril", "Cuba redonda estéril", "Bolsa coletora de urina (sistema fechado)", "Fita adesiva hipoalergênica"
    ],
    steps: [
      "Higienizar as mãos.",
      "Reunir e preparar todo o material.",
      "Explicar o procedimento ao paciente e garantir privacidade.",
      "Posicionar o paciente (decúbito dorsal com pernas flexionadas e afastadas para mulheres; decúbito dorsal para homens).",
      "Calçar luvas de procedimento e realizar a higiene íntima.",
      "Abrir o pacote de cateterismo em campo estéril.",
      "Calçar as luvas estéreis.",
      "Realizar antissepsia da região genital com clorexidina aquosa.",
      "Lubrificar a ponta da sonda com o anestésico.",
      "Introduzir a sonda pela uretra até o retorno de urina.",
      "Insuflar o balonete com água destilada (volume conforme fabricante).",
      "Tracionar levemente a sonda para confirmar a fixação.",
      "Conectar a sonda à bolsa coletora.",
      "Fixar a sonda na coxa (mulheres) ou abdômen inferior (homens).",
      "Descartar materiais, higienizar as mãos e registrar o procedimento."
    ],
    observations: "Técnica estritamente asséptica é crucial para prevenir infecção. Nunca force a passagem da sonda. Documente o volume de água destilada no balonete."
  },
  {
    title: "Acesso Venoso Periférico (AVP)",
    icon: Syringe,
    description: "Punção de uma veia periférica para administração de fluidos e medicamentos.",
    materials: [
      "Cateter sobre agulha (calibre adequado)", "Luvas de procedimento", "Garrote", "Algodão com álcool 70%",
      "Dispositivo de fixação (curativo transparente)", "Seringa com SF 0,9% para teste (flush)", "Polifix/extensor (opcional)"
    ],
    steps: [
      "Higienizar as mãos e reunir o material.",
      "Explicar o procedimento ao paciente.",
      "Escolher a veia (preferencialmente em membro não dominante, distal para proximal).",
      "Calçar as luvas de procedimento.",
      "Aplicar o garrote (10-15 cm acima do local de punção).",
      "Realizar a antissepsia do local com álcool 70%.",
      "Realizar a punção com o bisel da agulha voltado para cima (ângulo de 15-30º).",
      "Observar o refluxo de sangue na câmara do cateter.",
      "Progredir apenas o cateter plástico, enquanto retira a agulha (guia).",
      "Soltar o garrote.",
      "Conectar o equipo ou polifix.",
      "Realizar o flush com SF 0,9% para testar a perviedade.",
      "Fixar o cateter com o curativo transparente.",
      "Identificar o acesso com data, hora e nome do profissional.",
      "Descartar materiais perfurocortantes e registrar o procedimento."
    ],
    observations: "Evitar áreas de articulação. Não puncionar membros com fístula arteriovenosa, esvaziamento ganglionar ou lesões. Trocar o acesso conforme protocolo institucional (geralmente 72-96h)."
  },
  {
    title: "Sondagem Nasogástrica/Nasoenteral (SNG/SNE)",
    icon: Droplets,
    description: "Inserção de uma sonda através do nariz até o estômago ou intestino para alimentação ou drenagem.",
    materials: [
      "Sonda (calibre adequado)", "Luvas de procedimento", "Anestésico tópico (Xilocaína gel)", "Seringa 20ml",
      "Gaze", "Copo com água (se paciente consciente)", "Estetoscópio", "Fita adesiva hipoalergênica"
    ],
    steps: [
      "Higienizar as mãos e reunir o material.",
      "Explicar o procedimento ao paciente.",
      "Posicionar o paciente em Fowler ou semi-Fowler.",
      "Medir a sonda (ponta do nariz -> lóbulo da orelha -> apêndice xifoide).",
      "Calçar as luvas e lubrificar a ponta da sonda.",
      "Introduzir a sonda em uma narina, solicitando que o paciente degluta (se possível).",
      "Avançar a sonda até a marca pré-definida.",
      "Verificar o posicionamento (ausculta com injeção de ar, aspiração de conteúdo gástrico).",
      "Fixar a sonda no nariz.",
      "Solicitar radiografia para confirmar o posicionamento (padrão-ouro) antes de iniciar a dieta.",
      "Descartar materiais e registrar o procedimento."
    ],
    observations: "Se o paciente apresentar tosse, cianose ou dispneia, retire a sonda imediatamente. A confirmação radiológica é obrigatória para sondas nasoenterais."
  },
  {
    title: "Aspiração de Vias Aéreas (Sistema Aberto)",
    icon: AirVent,
    description: "Remoção de secreções da árvore traqueobrônquica através de um cateter de aspiração.",
    materials: [
      "Sonda de aspiração estéril (calibre ≤ 50% do diâmetro da cânula)", "Luva estéril e de procedimento",
      "Fonte de vácuo", "Frasco de aspiração", "Gaze estéril", "Soro fisiológico ou água destilada (para lubrificação)"
    ],
    steps: [
      "Higienizar as mãos e reunir o material.",
      "Explicar o procedimento ao paciente (se consciente).",
      "Aumentar a FiO2 do paciente por 1-2 minutos antes do procedimento (hiperoxigenação).",
      "Calçar a luva de procedimento na mão não dominante e a estéril na dominante.",
      "Conectar a sonda de aspiração ao sistema de vácuo com a mão não dominante.",
      "Introduzir a sonda desligada, sem aspirar, até encontrar resistência.",
      "Retirar a sonda 1-2 cm.",
      "Aplicar a aspiração de forma intermitente, com movimentos rotacionais.",
      "O procedimento de aspiração não deve exceder 15 segundos.",
      "Avaliar a necessidade de nova aspiração, permitindo que o paciente se recupere entre elas.",
      "Descartar a sonda e luvas, e registrar o procedimento (aspecto e volume da secreção)."
    ],
    observations: "Técnica estritamente asséptica. Monitorar a saturação de oxigênio e a frequência cardíaca do paciente durante todo o procedimento. Aspirar primeiro a cânula/tubo, depois a boca/nariz se necessário."
  },
  {
    title: "Curativo Simples",
    icon: Bandage,
    description: "Limpeza e proteção de feridas limpas, com baixo potencial de infecção.",
    materials: [
      "Pacote de curativo estéril (pinça, gaze)", "Luvas de procedimento", "Soro fisiológico 0,9%",
      "Cobertura secundária (gaze, atadura)", "Fita adesiva hipoalergênica"
    ],
    steps: [
      "Higienizar as mãos e reunir o material.",
      "Explicar o procedimento ao paciente.",
      "Calçar as luvas de procedimento.",
      "Remover o curativo antigo com cuidado.",
      "Observar o aspecto da ferida (tecido, exsudato, odor).",
      "Descartar as luvas e higienizar as mãos novamente.",
      "Abrir o pacote de curativo estéril.",
      "Umedecer a gaze com soro fisiológico 0,9%.",
      "Limpar a ferida do centro para as bordas (do menos para o mais contaminado).",
      "Usar uma nova gaze para cada movimento.",
      "Secar as bordas da ferida com gaze seca.",
      "Aplicar a cobertura secundária.",
      "Fixar com fita adesiva.",
      "Descartar materiais e registrar o procedimento e a evolução da ferida."
    ],
    observations: "Sempre registrar as características da lesão para acompanhar a evolução. Se houver sinais de infecção (calor, rubor, edema, exsudato purulento), o curativo não é mais considerado 'simples' e a conduta deve ser reavaliada."
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
        {procedures.map((proc, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 bg-card">
            <AccordionTrigger className="hover:no-underline text-left">
              <div className="flex items-center gap-4">
                <proc.icon className="h-6 w-6 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-lg">{proc.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{proc.description}</p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-6">
              <div>
                <h4 className="font-semibold text-primary mb-3">Materiais Necessários</h4>
                <div className="flex flex-wrap gap-2">
                  {proc.materials.map((material, i) => (
                    <Badge key={i} variant="secondary">{material}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-primary mb-3">Passo a Passo (Checklist)</h4>
                <ol className="space-y-3 list-decimal list-inside">
                  {proc.steps.map((step, i) => (
                    <li key={i} className="text-sm leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle className="font-semibold">Observações Importantes</AlertTitle>
                <AlertDescription>
                  {proc.observations}
                </AlertDescription>
              </Alert>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Procedures;