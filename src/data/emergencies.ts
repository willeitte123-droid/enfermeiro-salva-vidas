import { Heart, Wind, Brain, AlertCircle, Siren, Stethoscope, Thermometer, Shield, Activity } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ContentLine {
  text: string;
}

interface EmergencyItem {
  title: string;
  icon: LucideIcon;
  color: string;
  openColor: string;
  content: ContentLine[];
}

interface EmergencyCategory {
  category: string;
  color: string;
  items: EmergencyItem[];
}

export const emergencyProtocols: EmergencyCategory[] = [
  {
    category: "Emergências Cardiovasculares",
    color: "text-red-600",
    items: [
      {
        title: "Parada Cardiorrespiratória (PCR)",
        icon: Heart,
        color: "text-red-600",
        openColor: "text-red-700",
        content: [
          { text: "<div class='p-2 bg-blue-100 dark:bg-blue-900/20 rounded-md font-semibold text-blue-800 dark:text-blue-300 mb-3'>Atendimento Pré-Hospitalar (SBV)</div>" },
          { text: "<strong>1. Segurança do Local:</strong> Garanta que a cena é segura para você e para a vítima." },
          { text: "<strong>2. Responsividade:</strong> Chame e toque nos ombros da vítima. 'Senhor, senhor, está me ouvindo?'." },
          { text: "<strong>3. Acione Ajuda:</strong> Peça para alguém ligar para o serviço de emergência (192) e trazer um DEA." },
          { text: "<strong>4. Cheque Pulso e Respiração:</strong> Verifique o pulso carotídeo e a respiração simultaneamente por 5-10 segundos." },
          { text: "<strong>5. Inicie RCP de Alta Qualidade:</strong> Se não houver pulso ou respiração, inicie ciclos de <Badge variant='destructive'>30 compressões : 2 ventilações</Badge>.<ul class='pl-5 mt-2 space-y-1 list-disc'><li>Frequência: <Badge>100-120/min</Badge></li><li>Profundidade: <Badge>5-6 cm</Badge></li><li>Permita o retorno completo do tórax.</li><li>Minimize as interrupções.</li></ul>" },
          { text: "<strong>6. Use o DEA:</strong> Assim que o DEA chegar, ligue-o e siga as instruções. Aplique as pás e afaste-se para análise e choque, se indicado. Reinicie a RCP imediatamente após o choque." },
          { text: "<hr class='my-4'/>" },
          { text: "<div class='p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-md font-semibold text-indigo-800 dark:text-indigo-300 mb-3'>Atendimento Intra-Hospitalar (SAVC)</div>" },
          { text: "<strong>1. Inicie RCP e Suporte:</strong> Comece a RCP de alta qualidade, oferte O₂ a 100% e conecte o monitor/desfibrilador." },
          { text: "<strong>2. Análise do Ritmo (a cada 2 min):</strong> Pause a RCP brevemente para analisar o ritmo." },
          { text: "<strong>Ritmos Chocáveis (FV/TV sem pulso):</strong><ul class='pl-5 mt-2 space-y-1 list-disc'><li><strong>CHOQUE:</strong> Aplique choque (<Badge>120-200J bifásico</Badge>).</li><li>Reinicie a RCP imediatamente por <Badge>2 minutos</Badge>.</li><li>Obtenha acesso IV ou IO.</li><li>Após o 2º choque, administre <strong>Adrenalina</strong> <Badge variant='destructive'>1 mg IV/IO</Badge> a cada 3-5 min.</li><li>Após o 3º choque, considere <strong>Amiodarona</strong> <Badge variant='destructive'>300 mg IV/IO</Badge> em bolus (dose subsequente: 150 mg).</li></ul>" },
          { text: "<strong>Ritmos Não Chocáveis (AESP/Assistolia):</strong><ul class='pl-5 mt-2 space-y-1 list-disc'><li><strong>NÃO CHOQUE.</strong></li><li>Administre <strong>Adrenalina</strong> <Badge variant='destructive'>1 mg IV/IO</Badge> o mais rápido possível, repetindo a cada 3-5 min.</li><li>Reinicie a RCP imediatamente por <Badge>2 minutos</Badge>.</li><li><strong>BUSQUE E TRATE AS CAUSAS REVERSÍVEIS (5 Hs e 5 Ts).</strong></li></ul>" },
          { text: "<hr class='my-4'/>" },
          { text: "<div class='p-2 bg-amber-100 dark:bg-amber-900/20 rounded-md font-semibold text-amber-800 dark:text-amber-300 mb-3'>Causas Reversíveis (5 Hs e 5 Ts)</div>" },
          { text: "<ul class='pl-5 space-y-1 list-disc'><li><strong>5 Hs:</strong> Hipovolemia, Hipóxia, Hidrogênio (acidose), Hipo/Hipercalemia, Hipotermia.</li><li><strong>5 Ts:</strong> Tensão no tórax (pneumotórax), Tamponamento cardíaco, Toxinas, Trombose pulmonar, Trombose coronariana.</li></ul>" }
        ]
      },
      {
        title: "Infarto Agudo do Miocárdio (IAM)",
        icon: Heart,
        color: "text-red-500",
        openColor: "text-red-600",
        content: [
          { text: "<strong>1. Reconhecimento:</strong> Dor torácica súbita, em aperto, irradiando para MSE/mandíbula, sudorese, náuseas." },
          { text: "<strong>2. Atendimento Imediato:</strong> Repouso, monitorização (ECG, SpO₂, PA), obter acesso venoso." },
          { text: "<strong>3. ECG de 12 Derivações:</strong> Realizar e interpretar em <Badge>até 10 minutos</Badge> da chegada. Procurar por supra de ST." },
          { text: "<strong>4. Mnemônico MONA (ajustado):</strong><ul class='pl-5 mt-2 space-y-1 list-disc'><li><strong>O</strong>xigênio: Se SpO₂ <Badge>< 94%</Badge>.</li><li><strong>A</strong>AS: <Badge variant='destructive'>150-300 mg</Badge> mastigável (se não houver contraindicação).</li><li><strong>N</strong>itrato: <Badge variant='destructive'>Isossorbida 5mg SL</Badge> se PA sistólica > 90 mmHg e sem uso de sildenafil/tadalafil.</li><li><strong>M</strong>orfina: <Badge variant='destructive'>2-4 mg IV</Badge> para dor refratária ao nitrato.</li></ul>" },
          { text: "<strong>5. Terapia de Reperfusão (IAMCSST):</strong> Encaminhar para angioplastia primária (ATC) ou trombólise o mais rápido possível." }
        ]
      },
    ]
  },
  {
    category: "Emergências Neurológicas",
    color: "text-violet-600",
    items: [
      {
        title: "Acidente Vascular Cerebral (AVC)",
        icon: Brain,
        color: "text-violet-500",
        openColor: "text-violet-600",
        content: [
          { text: "<strong>1. Reconhecimento Rápido (Escala de Cincinnati/FAST):</strong><ul class='pl-5 mt-2 space-y-1 list-disc'><li><strong>F</strong>ace (Face): Peça para sorrir, observe assimetria.</li><li><strong>A</strong>rms (Braços): Peça para estender os braços, observe queda de um deles.</li><li><strong>S</strong>peech (Fala): Peça para repetir uma frase, observe fala arrastada/incompreensível.</li><li><strong>T</strong>ime (Tempo): Se houver 1 sinal, ligue para a emergência imediatamente.</li></ul>" },
          { text: "<strong>2. Atendimento Inicial:</strong> Manter vias aéreas, ofertar O₂ se SpO₂ < 94%, monitorizar, obter acesso venoso, verificar glicemia capilar (hipoglicemia mimetiza AVC)." },
          { text: "<strong>3. Transporte Imediato:</strong> Levar para um centro de AVC. Anotar o horário exato do início dos sintomas." },
          { text: "<strong>4. No Hospital:</strong> Tomografia de Crânio de emergência para diferenciar AVC isquêmico de hemorrágico." },
          { text: "<strong>5. Terapia Trombolítica (AVC Isquêmico):</strong> Se elegível, administrar Alteplase (rt-PA) na janela de <Badge variant='destructive'>até 4,5 horas</Badge> do início dos sintomas." }
        ]
      },
      {
        title: "Crise Convulsiva",
        icon: AlertCircle,
        color: "text-yellow-500",
        openColor: "text-yellow-600",
        content: [
          { text: "<strong>Durante a crise:</strong> Proteger a cabeça, afastar objetos, afrouxar roupas. <strong>NÃO</strong> conter e <strong>NÃO</strong> colocar nada na boca." },
          { text: "Anotar o horário de início e observar as características." },
          { text: "<strong>Após a crise:</strong> Posicionar em decúbito lateral (posição de recuperação)." },
          { text: "<strong>Estado de Mal Epiléptico (>5 min):</strong> Acionar ajuda, obter acesso venoso e administrar <Badge variant='destructive'>Benzodiazepínico IV</Badge> (Diazepam ou Midazolam) conforme protocolo." }
        ]
      },
    ]
  },
  {
    category: "Emergências Respiratórias",
    color: "text-cyan-600",
    items: [
      {
        title: "Obstrução de Vias Aéreas (OVACE)",
        icon: AlertCircle,
        color: "text-orange-500",
        openColor: "text-orange-600",
        content: [
          { text: "<strong>Obstrução Leve (tosse eficaz):</strong> Encorajar a tosse e monitorar." },
          { text: "<strong>Obstrução Grave (consciente):</strong> Realizar <Badge variant='destructive'>5 golpes dorsais</Badge> seguidos de <Badge variant='destructive'>5 compressões abdominais</Badge> (Manobra de Heimlich)." },
          { text: "<strong>Gestantes/Obesos:</strong> Realizar compressões torácicas." },
          { text: "<strong>Lactentes (<1 ano):</strong> Alternar 5 golpes dorsais com 5 compressões torácicas." },
          { text: "Se a vítima ficar <strong>inconsciente</strong>, iniciar RCP imediatamente." }
        ]
      },
      {
        title: "Crise Asmática Grave",
        icon: Wind,
        color: "text-cyan-500",
        openColor: "text-cyan-600",
        content: [
          { text: "<strong>1. Reconhecimento:</strong> Dispneia intensa, sibilância, uso de musculatura acessória, dificuldade para falar, taquicardia." },
          { text: "<strong>2. Posição e Oxigênio:</strong> Sentar o paciente, ofertar O₂ para manter SpO₂ <Badge>> 94%</Badge>." },
          { text: "<strong>3. Broncodilatador de Curta Ação:</strong> Administrar <Badge variant='destructive'>Salbutamol (Aerolin)</Badge> via nebulização ou spray com espaçador, em doses repetidas." },
          { text: "<strong>4. Corticosteroide Sistêmico:</strong> Administrar <Badge variant='destructive'>Hidrocortisona IV</Badge> ou <Badge variant='destructive'>Prednisona VO</Badge> precocemente." },
          { text: "<strong>5. Anticolinérgico:</strong> Associar <Badge variant='destructive'>Brometo de Ipratrópio (Atrovent)</Badge> à nebulização com Salbutamol." },
          { text: "<strong>6. Sulfato de Magnésio:</strong> Considerar em casos refratários, <Badge variant='destructive'>2g IV</Badge> em 20 minutos." }
        ]
      },
    ]
  },
  {
    category: "Emergências Metabólicas e Sistêmicas",
    color: "text-green-600",
    items: [
      {
        title: "Choque Anafilático",
        icon: Siren,
        color: "text-purple-600",
        openColor: "text-purple-700",
        content: [
          { text: "Reconhecer sinais: urticária, angioedema, dispneia, hipotensão." },
          { text: "<strong>PRIMEIRA LINHA:</strong> Administrar <Badge variant='destructive'>Epinefrina 0,3-0,5 mg IM</Badge> (1:1000) no vasto lateral da coxa." },
          { text: "Posicionar paciente em decúbito dorsal com pernas elevadas." },
          { text: "Garantir via aérea e ofertar <Badge variant='destructive'>O₂ 10-15 L/min</Badge>." },
          { text: "Obter 2 acessos venosos calibrosos e iniciar reposição volêmica com SF 0,9%." },
          { text: "<strong>Medicações adjuvantes:</strong> Anti-histamínicos e Corticoides IV." },
          { text: "Monitorização contínua e observação por 4-6 horas." }
        ]
      },
      {
        title: "Hipoglicemia",
        icon: Stethoscope,
        color: "text-blue-500",
        openColor: "text-blue-600",
        content: [
          { text: "Confirmar glicemia capilar (<Badge variant='destructive'><70 mg/dL</Badge>)." },
          { text: "<strong>Paciente consciente:</strong> Oferecer 15g de carboidrato simples (ex: 150ml de suco). Reavaliar em 15 min (Regra dos 15)." },
          { text: "<strong>Paciente inconsciente:</strong> <strong>NÃO</strong> dar nada via oral. Obter acesso venoso e administrar <Badge variant='destructive'>Glicose 50% 25-50 mL IV</Badge>." },
          { text: "Sem acesso venoso: Administrar <Badge variant='destructive'>Glucagon 1 mg IM</Badge>." },
          { text: "Após recuperação, oferecer lanche com carboidrato complexo." }
        ]
      },
      {
        title: "Cetoacidose Diabética (CAD)",
        icon: Activity,
        color: "text-green-500",
        openColor: "text-green-600",
        content: [
          { text: "<strong>1. Reconhecimento:</strong> Hiperglicemia (>250), acidose (pH<7.3), cetonas positivas. Sinais: hálito cetônico, respiração de Kussmaul, desidratação." },
          { text: "<strong>2. Hidratação Vigorosa:</strong> Iniciar com <Badge variant='destructive'>SF 0,9% 1000 mL</Badge> na primeira hora. Manter reposição conforme o déficit hídrico." },
          { text: "<strong>3. Insulinoterapia:</strong> Iniciar <Badge variant='destructive'>Insulina Regular 0,1 U/kg/h</Badge> em bomba de infusão contínua (BIC)." },
          { text: "<strong>4. Reposição de Potássio (K+):</strong> <strong>ESSENCIAL.</strong> Iniciar reposição de K+ quando o nível sérico estiver < 5,2 mEq/L, antes ou junto com a insulina." },
          { text: "<strong>5. Monitorização:</strong> Glicemia capilar horária, eletrólitos e gasometria a cada 2-4h." }
        ]
      },
    ]
  },
  {
    category: "Trauma e Ambiente",
    color: "text-amber-600",
    items: [
      {
        title: "Abordagem Primária ao Trauma (ABCDE)",
        icon: Shield,
        color: "text-amber-500",
        openColor: "text-amber-600",
        content: [
          { text: "<strong>A - Airway (Vias Aéreas com controle cervical):</strong> Perviedade, aspiração, colar cervical." },
          { text: "<strong>B - Breathing (Respiração e Ventilação):</strong> Expor tórax, avaliar frequência, simetria, ofertar O₂." },
          { text: "<strong>C - Circulation (Circulação com controle de hemorragia):</strong> Checar pulso, perfusão, cor da pele. Conter hemorragias externas." },
          { text: "<strong>D - Disability (Estado Neurológico):</strong> Avaliar nível de consciência (Glasgow) e pupilas." },
          { text: "<strong>E - Exposure (Exposição com controle de hipotermia):</strong> Despir o paciente para exame completo, mas prevenir a perda de calor." }
        ]
      },
      {
        title: "Hemorragia Externa Grave",
        icon: Heart,
        color: "text-red-500",
        openColor: "text-red-600",
        content: [
          { text: "<strong>Pressão direta e firme</strong> sobre o ferimento com gaze ou pano limpo." },
          { text: "Elevar o membro afetado (se não houver fratura)." },
          { text: "Se o sangramento persistir, aplicar um segundo curativo sobre o primeiro." },
          { text: "<strong>Torniquete:</strong> Usar como último recurso em sangramentos massivos não controláveis. Aplicar 5-7 cm acima da lesão e anotar o horário." },
          { text: "Monitorar sinais de <strong>choque hipovolêmico</strong> (taquicardia, palidez, sudorese, hipotensão)." }
        ]
      },
      {
        title: "Queimaduras",
        icon: Thermometer,
        color: "text-amber-500",
        openColor: "text-amber-600",
        content: [
          { text: "<strong>1. Segurança e Interrupção:</strong> Afastar a vítima da fonte de calor. Apagar o fogo (rolar no chão)." },
          { text: "<strong>2. Resfriamento:</strong> Irrigar a área queimada com <Badge>água corrente em temperatura ambiente</Badge> por 10-20 minutos. <strong>NÃO</strong> usar gelo." },
          { text: "<strong>3. Cobertura:</strong> Cobrir a lesão com pano limpo e seco. Não usar pomadas ou cremes." },
          { text: "<strong>4. Reposição Volêmica (Grandes Queimados):</strong> Usar a <strong>Fórmula de Parkland</strong> para calcular o volume de Ringer Lactato nas primeiras 24h: <Badge variant='destructive'>4 mL x Peso (kg) x %SCQ</Badge>. Infundir metade nas primeiras 8h e o restante nas 16h seguintes." }
        ]
      },
    ]
  }
];