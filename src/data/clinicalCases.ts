export interface CaseNode {
  id: string;
  text: string;
  options: CaseOption[];
  vitals?: {
    hr: number; // Heart Rate
    bp: string; // Blood Pressure
    spo2: number; // Saturation
    resp: number; // Respiratory Rate
    temp: number; // Temperature
    status: "stable" | "warning" | "critical" | "dead" | "recovered";
  };
  feedback?: string; // Educational content displayed after making a choice leading here
}

export interface CaseOption {
  label: string;
  nextNodeId: string;
  type: "assessment" | "intervention" | "medication" | "critical";
}

export interface ClinicalCase {
  id: string;
  title: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  category: "Urgência" | "UTI" | "Clínica" | "Pediatria" | "Obstetrícia" | "Fundamentos";
  description: string;
  initialNodeId: string;
  nodes: Record<string, CaseNode>;
}

export const CLINICAL_CASES: ClinicalCase[] = [
  // --- NOVOS CASOS: FUNDAMENTOS E PROCEDIMENTOS (CORRIGIDOS) ---
  {
    id: "sne-seguranca",
    title: "Segurança na Sonda Nasoenteral",
    difficulty: "Iniciante",
    category: "Fundamentos",
    description: "Paciente em uso de SNE apresenta sinal de deslocamento da sonda. Qual a conduta segura antes de iniciar a dieta?",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Sr. Roberto, 75 anos, AVC sequela, em uso de Sonda Nasoenteral (Dobbhoff) para dieta. Você entra no quarto para instalar o frasco de dieta das 12h.\n\nVocê nota que a fixação da sonda está solta e a marcação de referência na narina está 5cm mais externa do que o registrado ontem (a sonda 'saiu' um pouco).\n\nO paciente apresenta tosse leve e está dispneico.",
        vitals: { hr: 98, bp: "130/80", spo2: 92, resp: 24, temp: 36.5, status: "warning" },
        options: [
          { label: "Realizar teste de ausculta (injetar ar) e, se ouvir borbulho, iniciar dieta", nextNodeId: "ausculta_error", type: "assessment" },
          { label: "Reintroduzir a sonda os 5cm que faltam 'às cegas' e iniciar", nextNodeId: "blind_push_error", type: "intervention" },
          { label: "Suspender dieta, manter jejum e solicitar Raio-X de controle", nextNodeId: "xray_success", type: "intervention" }
        ]
      },
      "ausculta_error": {
        id: "ausculta_error",
        text: "Você realizou a ausculta epigástrica, ouviu o ruído de ar e iniciou a dieta.\n\nMinutos depois, o paciente começou a tossir violentamente, ficou cianótico e a saturação caiu para 75%.\n\nO som da ausculta foi transmitido, mas a ponta da sonda estava na entrada da traqueia ou esôfago alto. O paciente sofreu broncoaspiração maciça de dieta.",
        vitals: { hr: 140, bp: "150/90", spo2: 75, resp: 40, temp: 36.5, status: "critical" },
        feedback: "ERRO CRÍTICO: O teste de ausculta NÃO é seguro para confirmar posicionamento de sondas enterais finas (Dobbhoff), pois o som pode ser transmitido dos pulmões ou esôfago. O Padrão-Ouro é o Raio-X ou teste de pH (se validado na instituição).",
        options: []
      },
      "blind_push_error": {
        id: "blind_push_error",
        text: "Ao reintroduzir a sonda sem o fio guia e sem visão, a ponta flexível se enrolou na orofaringe ou migrou para a via aérea.\n\nVocê iniciou a dieta achando que estava no estômago. O paciente broncoaspirou imediatamente, evoluindo para pneumonia aspirativa grave.",
        vitals: { hr: 130, bp: "140/90", spo2: 80, resp: 35, temp: 36.5, status: "critical" },
        feedback: "ERRO: Nunca reintroduza uma sonda deslocada às cegas. Se a sonda saiu significativamente, o protocolo é: suspender dieta, avaliar necessidade de repassagem total ou confirmação radiológica da posição atual.",
        options: []
      },
      "xray_success": {
        id: "xray_success",
        text: "Conduta perfeita. Você suspendeu a dieta e solicitou o RX.\n\nO exame mostrou a ponta da sonda no esôfago médio (risco altíssimo de aspiração se a dieta fosse ligada). A sonda foi repassada com técnica correta e um novo RX confirmou a posição no duodeno.\n\nDieta liberada com segurança.",
        vitals: { hr: 85, bp: "120/80", spo2: 96, resp: 18, temp: 36.5, status: "recovered" },
        feedback: "A segurança do paciente vem primeiro. Na dúvida sobre a posição da sonda (fixação solta, marcação alterada), nunca infunda nada até ter certeza radiológica.",
        options: []
      }
    }
  },
  {
    id: "svd-hbp",
    title: "Sondagem Vesical Difícil",
    difficulty: "Intermediário",
    category: "Fundamentos",
    description: "Paciente idoso com retenção urinária e histórico de próstata aumentada. Desafio técnico na sondagem.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Sr. Antônio, 82 anos, chega ao PS com 'bexigoma' (retenção urinária aguda), dor intensa hipogástrica e agitação. Histórico de Hiperplasia Prostática Benigna (HPB) não tratada.\n\nMédico prescreve Sondagem Vesical de Demora (SVD). Você prepara o material estéril.",
        vitals: { hr: 110, bp: "160/100", spo2: 96, resp: 22, temp: 36.5, status: "warning" },
        options: [
          { label: "Lubrificar a ponta da sonda e tentar passar rapidamente para aliviar a dor", nextNodeId: "trauma_urethra", type: "intervention" },
          { label: "Injetar 10-15ml de Xilocaína gel na uretra e aguardar 3-5min", nextNodeId: "technique_correct", type: "intervention" },
          { label: "Usar uma sonda mais fina (12Fr) achando que passará mais fácil", nextNodeId: "thin_probe_fail", type: "intervention" }
        ]
      },
      "trauma_urethra": {
        id: "trauma_urethra",
        text: "A uretra não foi lubrificada/anestesiada adequadamente em toda sua extensão. O paciente contraiu o esfíncter por dor.\n\nVocê forçou a passagem contra a resistência da próstata e causou uma falsa via (perfuração uretral). Sangramento intenso pelo meato (uretrorragia) e a sonda não drenou urina.",
        vitals: { hr: 125, bp: "170/100", spo2: 96, resp: 24, temp: 36.5, status: "warning" },
        feedback: "Em homens, a injeção intrauretral de gel anestésico (seringa de 20ml sem agulha) e o tempo de latência são obrigatórios para distender a uretra, anestesiar e lubrificar.",
        options: [
          { label: "Suspender procedimento, não tentar novamente e chamar Urologia", nextNodeId: "urology_call", type: "assessment" },
          { label: "Tentar passar a sonda novamente com mais força", nextNodeId: "critical_trauma", type: "critical" }
        ]
      },
      "thin_probe_fail": {
        id: "thin_probe_fail",
        text: "Sondas muito finas (<14Fr) são muito flexíveis. Ao encontrar a resistência da próstata aumentada, a sonda dobrou dentro da uretra e não progrediu, causando dor e trauma leve.\n\nO paciente continua com bexigoma.",
        vitals: { hr: 115, bp: "160/100", spo2: 96, resp: 22, temp: 36.5, status: "warning" },
        feedback: "Paradoxalmente, em casos de HPB, sondas de calibre médio/maior (16-18Fr) ou ponta de Coudé (ponta curva e rígida) têm mais firmeza para vencer a obstrução prostática sem dobrar.",
        options: [
           { label: "Trocar material e tentar com técnica correta (gel + calibre 16/18)", nextNodeId: "technique_correct", type: "intervention" },
           { label: "Tentar empurrar a sonda fina com mais força", nextNodeId: "trauma_urethra", type: "critical" }
        ]
      },
      "technique_correct": {
        id: "technique_correct",
        text: "Você injetou 15ml de gel anestésico na uretra e aguardou 5 minutos com o pênis pinçado. A uretra distendeu e anestesiou.\n\nA sonda 16Fr passou suavemente pela próstata. Houve saída de 1200ml de urina clara. O paciente sentiu alívio imediato.",
        vitals: { hr: 80, bp: "130/80", spo2: 97, resp: 16, temp: 36.5, status: "recovered" },
        feedback: "Excelente! A técnica correta e a paciência na anestesia local são o segredo da sondagem masculina atraumática.",
        options: []
      },
      "urology_call": {
        id: "urology_call",
        text: "O Urologista avaliou e confirmou lesão de uretra (falsa via). O paciente precisou ir ao Centro Cirúrgico para cistoscopia de emergência e sondagem guiada por fio guia.\n\nEmbora o paciente esteja vivo, o procedimento de enfermagem causou um dano (iatrogenia) que exigiu intervenção cirúrgica.",
        vitals: { hr: 100, bp: "140/90", spo2: 96, resp: 20, temp: 36.5, status: "critical" },
        feedback: "Uretrorragia é sinal de trauma grave. Diante de resistência, nunca force. A prevenção (técnica adequada) é o único caminho.",
        options: []
      },
      "critical_trauma": {
        id: "critical_trauma",
        text: "Você insistiu no erro. A lesão uretral se transformou em ruptura completa. O paciente desenvolveu hematoma perineal extenso e infecção grave (Síndrome de Fournier) dias depois.",
        vitals: { hr: 140, bp: "180/110", spo2: 95, resp: 30, temp: 37.0, status: "critical" },
        options: []
      }
    }
  },
  {
    id: "lpp-cobertura",
    title: "Curativo em Lesão Infectada",
    difficulty: "Intermediário",
    category: "Fundamentos",
    description: "Escolha da cobertura adequada para uma lesão sacral infectada.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Dona Joana, acamada. Apresenta Lesão por Pressão (LPP) sacral Estágio 3.\n\nCaracterísticas da ferida: Cavitária (profunda), exsudato purulento abundante, odor fétido e bordas com eritema (sinais de infecção).\n\nQual o plano de tratamento tópico?",
        vitals: { hr: 90, bp: "120/80", spo2: 96, resp: 18, temp: 37.8, status: "stable" },
        options: [
          { label: "Limpeza SF 0,9% + Placa de Hidrocoloide", nextNodeId: "hydrocolloid_fail", type: "intervention" },
          { label: "Limpeza SF 0,9% + Carvão Ativado com Prata", nextNodeId: "charcoal_success", type: "intervention" },
          { label: "Limpeza SF 0,9% + Hidrogel", nextNodeId: "hydrogel_fail", type: "intervention" }
        ]
      },
      "hydrocolloid_fail": {
        id: "hydrocolloid_fail",
        text: "O Hidrocoloide é oclusivo. Em ferida infectada e com muito exsudato, ele reteve as bactérias e secreção (efeito estufa) e macerou as bordas.\n\nA paciente evoluiu com aumento da área de necrose, febre alta e sepse de foco cutâneo.",
        vitals: { hr: 120, bp: "90/60", spo2: 94, resp: 24, temp: 39.0, status: "critical" },
        feedback: "Regra básica: Hidrocoloide é CONTRAINDICADO em feridas infectadas ou com exsudato abundante.",
        options: []
      },
      "hydrogel_fail": {
        id: "hydrogel_fail",
        text: "O Hidrogel tem função de doar umidade. A ferida já estava muito úmida (exsudato abundante).\n\nO resultado foi maceração extensa da pele perilesional, aumentando o tamanho da ferida. Além disso, o hidrogel simples não combate a infecção/odor.",
        vitals: { hr: 95, bp: "120/80", spo2: 96, resp: 18, temp: 38.0, status: "warning" },
        feedback: "Hidrogel é indicado para feridas secas ou com necrose que precisa ser amolecida. Não para feridas muito exsudativas e infectadas.",
        options: [
           { label: "Trocar para cobertura absorvente com prata (Carvão/Alginato)", nextNodeId: "charcoal_success", type: "intervention" },
           { label: "Manter Hidrogel e fechar com gaze", nextNodeId: "infection_worsens", type: "critical" }
        ]
      },
      "infection_worsens": {
          id: "infection_worsens",
          text: "A infecção não foi controlada e o excesso de umidade macerou ainda mais a pele. A ferida aumentou e a paciente entrou em sepse.",
          vitals: { hr: 110, bp: "90/60", spo2: 94, resp: 24, temp: 39.2, status: "critical" },
          options: []
      },
      "charcoal_success": {
        id: "charcoal_success",
        text: "Excelente escolha. O Carvão Ativado controla o odor e absorve o exsudato. A Prata combate a infecção local (bactericida).\n\nApós 48h de uso, o odor desapareceu, o exsudato diminuiu e o tecido de granulação começou a aparecer.\n\nSinais vitais normalizaram.",
        vitals: { hr: 80, bp: "120/80", spo2: 98, resp: 16, temp: 36.8, status: "recovered" },
        feedback: "Para feridas infectadas, exsudativas e com odor, o Carvão com Prata é uma das melhores opções de primeira linha. Alginato com Prata também seria uma boa opção.",
        options: []
      }
    }
  },

  // --- CASOS EXISTENTES (Mantidos abaixo) ---
  {
    id: "tce-cushing",
    title: "Herniação Cerebral Iminente",
    difficulty: "Avançado",
    category: "UTI",
    description: "Paciente com TCE grave apresenta deterioração súbita. Os sinais vitais enganam quem não conhece a Tríade de Cushing.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Paciente jovem, TCE grave pós-acidente moto (D3 de UTI). Sedação suspensa para avaliação.\n\nSubitamente, o monitor dispara. Pupila direita dilatou (Midríase - Anisocoria).\n\nSSVV: PA 220/110 mmHg | FC 45 bpm (Bradicardia) | FR Irregular (Cheyne-Stokes).",
        vitals: { hr: 45, bp: "220/110", spo2: 98, resp: 10, temp: 37.0, status: "warning" },
        options: [
          { label: "Administrar Nitroprussiato (Nipride) para baixar a PA urgente", nextNodeId: "hypotension_death", type: "medication" },
          { label: "Administrar Atropina para corrigir a Bradicardia", nextNodeId: "atropine_useless", type: "medication" },
          { label: "Hiperventilação transitória + Manitol + Cabeceira elevada", nextNodeId: "icp_control", type: "intervention" }
        ]
      },
      "hypotension_death": {
        id: "hypotension_death",
        text: "ERRO CRÍTICO.\n\nA hipertensão era um reflexo de defesa (Reflexo de Cushing) para manter o sangue chegando ao cérebro contra a alta pressão intracraniana (PIC).\n\nAo baixar a PA, você matou a Perfusão Cerebral (PPC = PAM - PIC). O cérebro isque miou e herniou fatalmente.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.5, status: "dead" },
        feedback: "A Tríade de Cushing (Hipertensão + Bradicardia + Resp. Irregular) indica HIC grave. Nunca baixe a pressão sem monitorar a PIC ou tratar a causa.",
        options: []
      },
      "atropine_useless": {
        id: "atropine_useless",
        text: "A atropina não teve efeito. A bradicardia é central (compressão do tronco encefálico), não cardíaca.\n\nEnquanto você tentava tratar o coração, o cérebro herniou (uncus comprimiu o tronco). O paciente parou.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.5, status: "dead" },
        feedback: "Não trate o sinal vital isolado. Entenda o contexto neurológico.",
        options: []
      },
      "icp_control": {
        id: "icp_control",
        text: "SALVOU A VIDA.\n\nVocê reconheceu a herniação uncal. A hiperventilação (alvo PCO2 30-35) causa vasoconstrição cerebral e reduz a PIC agudamente.\n\nO Manitol 'puxou' líquido do cérebro. A pupila voltou ao normal e o paciente foi para TC/Cirurgia descompressiva a tempo.",
        vitals: { hr: 80, bp: "140/90", spo2: 98, resp: 16, temp: 36.5, status: "recovered" },
        options: []
      }
    }
  },
  {
    id: "trauma-pelve-sonda",
    title: "Sondagem em Trauma Pélvico",
    difficulty: "Avançado",
    category: "Urgência",
    description: "Vítima de atropelamento com fratura de pelve instável. O médico solicita sondagem vesical, mas há um sinal de alerta.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Paciente masculino, 25 anos, atropelado. Fratura de pelve instável ('livro aberto'). Médico solicita SVD para monitorar diurese.\n\nAo expor a genitália para o procedimento, você nota sangue vivo no meato uretral (uretrorragia) e hematoma perineal.",
        vitals: { hr: 120, bp: "90/60", spo2: 95, resp: 22, temp: 36.5, status: "warning" },
        options: [
          { label: "Não realizar o procedimento e comunicar o médico (Suspeita de Lesão Uretral)", nextNodeId: "correct_action", type: "assessment" },
          { label: "Tentar passar a sonda com bastante xilocaína e cuidado", nextNodeId: "urethral_tear", type: "intervention" },
          { label: "Usar uma sonda de calibre menor (fina) para passar melhor", nextNodeId: "urethral_tear", type: "intervention" }
        ]
      },
      "urethral_tear": {
        id: "urethral_tear",
        text: "Ao tentar introduzir a sonda, você encontrou resistência e o paciente gritou de dor. Houve saída de mais sangue.\n\nVocê transformou uma lesão parcial de uretra em uma ruptura total, criando um falso trajeto. O paciente precisará de cirurgia complexa.",
        vitals: { hr: 140, bp: "100/60", spo2: 95, resp: 28, temp: 36.5, status: "critical" },
        feedback: "Uretrorragia em trauma pélvico é CONTRAINDICAÇÃO ABSOLUTA para sondagem vesical cega. É necessário uretrocistografia retrógrada ou cistostomia.",
        options: []
      },
      "correct_action": {
        id: "correct_action",
        text: "Conduta correta! O médico concordou e solicitou avaliação da Urologia.\n\nFoi realizada uma Cistostomia Suprapúbica de urgência. O paciente foi monitorado adequadamente sem agravar as lesões.",
        vitals: { hr: 110, bp: "100/70", spo2: 96, resp: 20, temp: 36.5, status: "recovered" },
        options: []
      }
    }
  },
  {
    id: "retirada-cvc",
    title: "Retirada de Cateter Central",
    difficulty: "Intermediário",
    category: "Clínica",
    description: "Paciente de alta vai retirar o Cateter Venoso Central (CVC) de subclávia. A técnica incorreta pode ser fatal.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Sr. João teve alta da UTI e vai retirar o CVC duplo lúmen da veia subclávia direita.\n\nEle está sentado na poltrona, conversando e respirando ar ambiente.\n\nComo você procede com a retirada?",
        vitals: { hr: 80, bp: "120/80", spo2: 98, resp: 16, temp: 36.5, status: "stable" },
        options: [
          { label: "Retirar com o paciente sentado, pedindo para ele respirar fundo", nextNodeId: "air_embolism", type: "intervention" },
          { label: "Posicionar em Trendelenburg (ou zero), pedir Valsalva e ocluir imediatamente", nextNodeId: "safe_removal", type: "intervention" },
          { label: "Retirar lentamente enquanto aspira com uma seringa", nextNodeId: "unnecessary_risk", type: "intervention" }
        ]
      },
      "air_embolism": {
        id: "air_embolism",
        text: "Ao retirar o cateter com o paciente sentado e inspirando (pressão negativa no tórax), o ar entrou rapidamente pela veia.\n\nO paciente apresentou dispneia súbita, cianose e perdeu a consciência (Embolia Gasosa Maciça).",
        vitals: { hr: 150, bp: "60/40", spo2: 70, resp: 40, temp: 36.5, status: "warning" },
        feedback: "Nunca retire CVC de jugular/subclávia com paciente sentado ou inspirando. O risco de embolia gasosa é altíssimo.",
        options: [
           { label: "Decúbito Lateral Esquerdo + Trendelenburg + O2 100%", nextNodeId: "rescue_maneuver", type: "intervention" },
           { label: "Colocar sentado e dar O2", nextNodeId: "embolism_death", type: "critical" }
        ]
      },
      "safe_removal": {
        id: "safe_removal",
        text: "Perfeito. O decúbito zero/Trendelenburg aumenta a pressão venosa, evitando a entrada de ar. A manobra de Valsalva (prender a respiração forçando) também protege.\n\nCurativo oclusivo realizado. Paciente sem intercorrências.",
        vitals: { hr: 82, bp: "120/80", spo2: 98, resp: 16, temp: 36.5, status: "recovered" },
        options: []
      },
      "unnecessary_risk": {
        id: "unnecessary_risk",
        text: "Aspirar não é a técnica padrão e retirar lentamente aumenta o tempo de exposição do orifício ao ar.\n\nO paciente não teve embolia por sorte, mas a técnica foi inadequada. Você colocou o paciente em risco desnecessário.",
        vitals: { hr: 90, bp: "125/80", spo2: 97, resp: 18, temp: 36.5, status: "stable" },
        feedback: "A retirada deve ser rápida e contínua, seguida de compressão e oclusão imediata.",
        options: [
           { label: "Observar paciente e realizar curativo oclusivo", nextNodeId: "safe_removal", type: "intervention" }
        ]
      },
      "rescue_maneuver": {
          id: "rescue_maneuver",
          text: "A Manobra de Durant (DLE + Trendelenburg) tenta prender o ar no ápice do ventrículo direito, impedindo que vá para o pulmão.\n\nO paciente estabilizou precariamente e foi para a UTI. O erro técnico causou um evento adverso grave.",
          vitals: { hr: 130, bp: "90/60", spo2: 88, resp: 28, temp: 36.5, status: "critical" },
          options: []
      },
      "embolism_death": {
          id: "embolism_death",
          text: "Sentar o paciente facilitou a migração do ar para o cérebro (embolia paradoxal se FOP) ou bloqueio pulmonar total. PCR irreversível.",
          vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.5, status: "dead" },
          options: []
      }
    }
  },
  {
    id: "administracao-kcl",
    title: "Segurança na Infusão de Potássio",
    difficulty: "Iniciante",
    category: "UTI",
    description: "Prescrição médica solicita reposição de Potássio (KCl) para paciente com hipocalemia grave.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Paciente com K+ 2.5 mEq/L (Hipocalemia). Prescrição: 'KCl 19,1% 1 ampola (10ml) EV agora'.\n\nComo você administra?",
        vitals: { hr: 90, bp: "110/70", spo2: 96, resp: 18, temp: 36.5, status: "stable" },
        options: [
          { label: "Diluir em 100ml de SF 0,9% e infundir em 1 hora (Bomba de Infusão)", nextNodeId: "correct_infusion", type: "intervention" },
          { label: "Administrar em Bolus (direto na veia) lentamente", nextNodeId: "lethal_injection", type: "critical" },
          { label: "Diluir em 20ml e fazer em 10 minutos", nextNodeId: "cardiac_arrest_risk", type: "critical" }
        ]
      },
      "lethal_injection": {
        id: "lethal_injection",
        text: "ERRO FATAL. O Potássio em bolus causa despolarização maciça do miocárdio.\n\nO paciente gritou de dor no braço e entrou em PCR em Assistolia imediatamente. Não houve retorno à circulação.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.5, status: "dead" },
        feedback: "NUNCA, sob hipótese alguma, administre KCl endovenoso em bolus. É uma injeção letal.",
        options: []
      },
      "cardiac_arrest_risk": {
        id: "cardiac_arrest_risk",
        text: "A concentração e velocidade ainda são muito altas. O paciente apresentou arritmias graves e flebite química intensa.\n\nFoi necessário parar a infusão e iniciar protocolo de PCR.",
        vitals: { hr: 30, bp: "40/20", spo2: 80, resp: 10, temp: 36.5, status: "critical" },
        options: []
      },
      "correct_infusion": {
        id: "correct_infusion",
        text: "Correto. O KCl deve ser sempre diluído e infundido lentamente (máximo 10-20 mEq/h em acesso periférico).\n\nO potássio subiu para 3.5 sem intercorrências.",
        vitals: { hr: 80, bp: "115/75", spo2: 98, resp: 16, temp: 36.5, status: "recovered" },
        options: []
      }
    }
  },
  {
    id: "aspiracao-vias-aereas",
    title: "Técnica de Aspiração Traqueal",
    difficulty: "Intermediário",
    category: "UTI",
    description: "Paciente intubado apresenta queda de saturação e secreção visível no tubo. Procedimento de aspiração.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Paciente em VM, sedado. Monitor dispara alarme: SpO2 88%. Você ausculta roncos difusos e vê secreção no tubo.\n\nVai realizar a aspiração (sistema aberto).",
        vitals: { hr: 100, bp: "130/80", spo2: 88, resp: 24, temp: 37.0, status: "warning" },
        options: [
          { label: "Introduzir a sonda aspirando para pegar tudo no caminho", nextNodeId: "mucosa_trauma", type: "intervention" },
          { label: "Hiperoxigenar (O2 100%), introduzir sem aspirar, tracionar e aspirar girando (<15s)", nextNodeId: "correct_suction", type: "intervention" },
          { label: "Aspirar demoradamente (30-40s) para limpar bem de uma vez", nextNodeId: "vagal_bradycardia", type: "intervention" }
        ]
      },
      "mucosa_trauma": {
        id: "mucosa_trauma",
        text: "Aspirar enquanto introduz a sonda causa 'ventosa' na mucosa traqueal, provocando sangramento e edema.\n\nA secreção agora vem misturada com sangue vivo.",
        vitals: { hr: 110, bp: "135/85", spo2: 90, resp: 26, temp: 37.0, status: "warning" },
        feedback: "Introduza a sonda suavemente até sentir resistência, recue 1cm e SÓ ENTÃO aplique vácuo na retirada.",
        options: [
           { label: "Interromper e hiperoxigenar", nextNodeId: "correct_suction", type: "intervention" },
           { label: "Continuar aspirando", nextNodeId: "mucosa_bleeding", type: "critical" }
        ]
      },
      "mucosa_bleeding": {
          id: "mucosa_bleeding",
          text: "O sangramento se intensificou, formando rolhas que obstruíram parcialmente o tubo. O paciente dessaturou gravemente.",
          vitals: { hr: 140, bp: "150/90", spo2: 70, resp: 35, temp: 37.0, status: "critical" },
          options: []
      },
      "vagal_bradycardia": {
        id: "vagal_bradycardia",
        text: "Aspiração prolongada causou hipóxia severa e estímulo vagal.\n\nO paciente fez bradicardia súbita (FC 35) e hipotensão.",
        vitals: { hr: 35, bp: "60/40", spo2: 75, resp: 10, temp: 37.0, status: "warning" },
        feedback: "O tempo de aspiração não deve exceder 10-15 segundos. O paciente não respira enquanto você aspira.",
        options: [
           { label: "Parar, reconectar ventilador e dar O2 100%", nextNodeId: "rescue_brady", type: "intervention" },
           { label: "Administrar Atropina", nextNodeId: "atropine_rescue", type: "medication" }
        ]
      },
      "rescue_brady": {
          id: "rescue_brady",
          text: "Após reconectar e oxigenar, a FC subiu para 90 e a saturação recuperou. Foi um susto desnecessário, mas o paciente recuperou.",
          vitals: { hr: 90, bp: "110/70", spo2: 95, resp: 18, temp: 37.0, status: "recovered" },
          options: []
      },
      "atropine_rescue": {
          id: "atropine_rescue",
          text: "A atropina corrigiu a frequência, mas a hipóxia continuou até você reconectar o oxigênio. A causa primária era hipóxia/vagal, não cardíaca pura. Paciente recuperou.",
          vitals: { hr: 100, bp: "120/70", spo2: 96, resp: 20, temp: 37.0, status: "recovered" },
          options: []
      },
      "correct_suction": {
        id: "correct_suction",
        text: "Técnica perfeita. A hiperoxigenação prévia protegeu contra hipóxia. A retirada giratória limpou a secreção sem lesar a mucosa.\n\nSaturação subiu para 98% e os roncos desapareceram.",
        vitals: { hr: 90, bp: "120/80", spo2: 98, resp: 16, temp: 37.0, status: "recovered" },
        options: []
      }
    }
  },
  {
    id: "coleta-hemocultura",
    title: "Coleta de Hemocultura",
    difficulty: "Iniciante",
    category: "Clínica",
    description: "Paciente com suspeita de sepse. O médico solicita 2 pares de hemoculturas.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Dona Lúcia, 60 anos, febre de origem indeterminada. Pedido: 'Coletar 2 pares de Hemocultura'.\n\nEla tem um acesso venoso periférico salinizado no braço direito.\n\nComo você procede?",
        vitals: { hr: 100, bp: "110/70", spo2: 96, resp: 20, temp: 38.5, status: "stable" },
        options: [
          { label: "Coletar 1 par do acesso existente e 1 par de nova punção", nextNodeId: "catheter_contamination", type: "intervention" },
          { label: "Realizar 2 punções novas em sítios diferentes, com antissepsia rigorosa", nextNodeId: "correct_collection", type: "intervention" },
          { label: "Coletar apenas 1 par para poupar a paciente", nextNodeId: "low_sensitivity", type: "assessment" }
        ]
      },
      "catheter_contamination": {
        id: "catheter_contamination",
        text: "A amostra do cateter antigo veio positiva para 'Staphylococcus epidermidis' (pele), enquanto a punção nova veio negativa.\n\nO médico tratou como infecção por conta do falso positivo, usando antibiótico forte desnecessariamente (risco de resistência e toxicidade).",
        vitals: { hr: 90, bp: "110/70", spo2: 97, resp: 18, temp: 37.0, status: "stable" },
        feedback: "Hemoculturas não devem ser coletadas de cateteres periféricos existentes, pois eles são colonizados. Sempre punção nova.",
        options: [
           { label: "Avisar o médico sobre a coleta do cateter", nextNodeId: "medical_review", type: "assessment" },
           { label: "Não avisar e deixar tratar", nextNodeId: "antibiotic_resistance", type: "critical" }
        ]
      },
      "medical_review": {
          id: "medical_review",
          text: "O médico suspendeu o antibiótico ao saber que uma amostra veio do cateter (provável contaminação). Solicitou nova coleta adequada.",
          vitals: { hr: 95, bp: "110/70", spo2: 97, resp: 18, temp: 37.5, status: "recovered" },
          options: []
      },
      "antibiotic_resistance": {
          id: "antibiotic_resistance",
          text: "A paciente desenvolveu infecção por fungo devido ao uso prolongado de antibióticos desnecessários.",
          vitals: { hr: 110, bp: "100/60", spo2: 95, resp: 22, temp: 38.0, status: "warning" },
          options: []
      },
      "low_sensitivity": {
        id: "low_sensitivity",
        text: "A coleta de apenas 1 par reduz a sensibilidade do exame em 20-30%.\n\nA bacteremia era intermitente e você 'errou o alvo'. O exame veio falso negativo e a sepse não foi tratada adequadamente. O atraso no diagnóstico correto piorou o prognóstico.",
        vitals: { hr: 120, bp: "90/60", spo2: 92, resp: 24, temp: 39.0, status: "critical" },
        feedback: "O padrão-ouro são 2 ou 3 pares (4 a 6 frascos) de sítios diferentes para aumentar a chance de pegar a bactéria.",
        options: []
      },
      "correct_collection": {
        id: "correct_collection",
        text: "Você usou clorexidina alcoólica, esperou secar e puncionou dois braços diferentes.\n\nResultado fidedigno: E. coli multissensível. O tratamento foi guiado corretamente e a paciente teve alta.",
        vitals: { hr: 80, bp: "120/80", spo2: 98, resp: 16, temp: 36.5, status: "recovered" },
        options: []
      }
    }
  },
  {
    id: "eap-hipertensivo",
    title: "Edema Agudo de Pulmão",
    difficulty: "Avançado",
    category: "Urgência",
    description: "Paciente chega com dispneia súbita, 'afogando-se' em secreção e hipertensão severa.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Sr. Mário, 68 anos, ICC prévia. Chega trazido pelo SAMU sentado na maca, agônico, com muita falta de ar. Tosse com expectoração rósea espumosa.\n\nExame: Estertores crepitantes até ápices pulmonares (ambos os lados).\n\nSSVV: PA 220/120 mmHg | FC 110 bpm | SpO2 82% (aa) | FR 35.",
        vitals: { hr: 110, bp: "220/120", spo2: 82, resp: 35, temp: 36.5, status: "warning" },
        options: [
          { label: "Sentar o paciente (pernas pendentes) + O2 + Furosemida/Nitrato", nextNodeId: "management_correct", type: "intervention" },
          { label: "Deitar o paciente para melhorar o retorno venoso", nextNodeId: "position_error", type: "intervention" },
          { label: "Administrar Betabloqueador para baixar a FC", nextNodeId: "betablocker_error", type: "medication" }
        ]
      },
      "management_correct": {
        id: "management_correct",
        text: "Você posicionou o paciente sentado (diminui retorno venoso), instalou VNI (Ventilação Não Invasiva) ou máscara reservatório e iniciou vasodilatador (Tridil) + Diurético conforme prescrição.\n\nA pré e pós-carga diminuíram, aliviando o coração.\n\n30 min depois: PA 160/90, SpO2 94%, paciente mais calmo.",
        vitals: { hr: 90, bp: "160/90", spo2: 94, resp: 22, temp: 36.5, status: "recovered" },
        options: []
      },
      "position_error": {
        id: "position_error",
        text: "Ao deitar o paciente (decúbito dorsal), o retorno venoso aumentou subitamente, encharcando ainda mais os pulmões.\n\nO paciente evoluiu para PCR imediata por hipóxia refratária.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.5, status: "dead" },
        feedback: "No EAP, o paciente DEVE ficar sentado (Fowler alto ou pernas pendentes) para reduzir a pré-carga.",
        options: []
      },
      "betablocker_error": {
        id: "betablocker_error",
        text: "O betabloqueador reduziu a contratilidade cardíaca em um coração que já estava falhando agudamente.\n\nO paciente entrou em Choque Cardiogênico grave.",
        vitals: { hr: 50, bp: "70/40", spo2: 80, resp: 40, temp: 36.0, status: "warning" },
        feedback: "Betabloqueadores são contraindicados na fase aguda descompensada da IC ('paciente úmido e frio' ou com baixo débito).",
        options: [
           { label: "Suspender BB e iniciar Dobutamina", nextNodeId: "management_correct", type: "intervention" },
           { label: "Aumentar dose do Betabloqueador", nextNodeId: "shock_death", type: "critical" }
        ]
      },
      "shock_death": {
          id: "shock_death",
          text: "O coração parou em diástole por falência de bomba. Óbito.",
          vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
          options: []
      }
    }
  },
  {
    id: "iam-com-supra",
    title: "Dor Torácica no Pronto Socorro",
    difficulty: "Intermediário",
    category: "Urgência",
    description: "Paciente masculino, 58 anos, chega referindo dor precordial opressiva iniciada há 40 minutos. Seu objetivo é estabilizar e diagnosticar corretamente.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Paciente Sr. João, 58 anos, dá entrada na sala de emergência. Queixa-se de 'aperto no peito' irradiado para o braço esquerdo e mandíbula, acompanhado de náuseas e sudorese fria. Início há 40 min.\n\nEle está ansioso e pálido.\n\nSinais Vitais Iniciais: FC: 110 bpm | PA: 160/100 mmHg | SpO2: 94% em aa.",
        vitals: { hr: 110, bp: "160/100", spo2: 94, resp: 22, temp: 36.5, status: "warning" },
        options: [
          { label: "Administrar Oxigênio (O2) em máscara 10L/min", nextNodeId: "o2_high", type: "intervention" },
          { label: "Solicitar e realizar ECG de 12 derivações imediatamente", nextNodeId: "ecg_done", type: "assessment" },
          { label: "Administrar Morfina 4mg IV para alívio da dor", nextNodeId: "morphine_early", type: "medication" }
        ]
      },
      "o2_high": {
        id: "o2_high",
        text: "Você instala O2 em alto fluxo. O paciente refere leve melhora da dispneia, mas a dor continua intensa.\n\n⚠️ Atenção: Protocolos atuais indicam O2 apenas se SpO2 < 90-94% ou dispneia. O excesso de O2 pode causar vasoconstrição coronariana.\n\nO tempo está passando.",
        vitals: { hr: 108, bp: "158/98", spo2: 99, resp: 20, temp: 36.5, status: "warning" },
        options: [
          { label: "Realizar ECG de 12 derivações", nextNodeId: "ecg_done", type: "assessment" },
          { label: "Puncionar acesso venoso e coletar enzimas", nextNodeId: "access_done", type: "intervention" }
        ]
      },
      "morphine_early": {
        id: "morphine_early",
        text: "Você administra a morfina. A dor do paciente diminui consideravelmente (EVA 8 -> 3). Ele parece mais calmo.\n\nPorém, ao mascarar a dor antes do diagnóstico, você perdeu um parâmetro clínico importante de gravidade e reperfusão. Além disso, a morfina pode reduzir a absorção de antiplaquetários orais.",
        vitals: { hr: 95, bp: "140/90", spo2: 93, resp: 18, temp: 36.5, status: "warning" },
        options: [
          { label: "Liberar o paciente para casa (Gastrite?)", nextNodeId: "discharge_error", type: "critical" },
          { label: "Agora sim, fazer o ECG", nextNodeId: "ecg_done", type: "assessment" }
        ]
      },
      "ecg_done": {
        id: "ecg_done",
        text: "O ECG é impresso em menos de 10 minutos (Meta!).\n\nResultado: Supradesnivelamento do segmento ST de 3mm em DII, DIII e aVF.\n\nDiagnóstico: IAM com Supra de ST (Parede Inferior).",
        vitals: { hr: 112, bp: "150/90", spo2: 94, resp: 22, temp: 36.5, status: "warning" },
        options: [
          { label: "Iniciar Protocolo MONAB e preparar para Angioplastia/Trombólise", nextNodeId: "monab_success", type: "intervention" },
          { label: "Aguardar resultado da Troponina para confirmar", nextNodeId: "wait_troponin", type: "assessment" }
        ]
      },
      "access_done": {
        id: "access_done",
        text: "Acesso garantido e exames coletados. Porém, o ECG ainda não foi feito e o tempo porta-eletro estourou (> 10 min).\n\nO paciente volta a queixar-se de piora da dor.",
        vitals: { hr: 115, bp: "165/105", spo2: 93, resp: 24, temp: 36.5, status: "warning" },
        options: [
          { label: "Realizar ECG agora", nextNodeId: "ecg_done", type: "assessment" },
          { label: "Administrar analgesia antes do ECG", nextNodeId: "morphine_early", type: "medication" }
        ]
      },
      "wait_troponin": {
        id: "wait_troponin",
        text: "ERRO GRAVE.\n\nVocê decidiu esperar a Troponina (que demora 40-60 min). No IAM com Supra de ST, o diagnóstico é ELETROCARDIOGRÁFICO. Tempo é músculo.\n\nO paciente evolui com instabilidade elétrica e Fibrilação Ventricular.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
        feedback: "Jamais aguarde marcadores de necrose miocárdica se o ECG já mostra Supra de ST. A terapia de reperfusão deve ser imediata.",
        options: []
      },
      "discharge_error": {
        id: "discharge_error",
        text: "ERRO FATAL.\n\nO paciente teve alta com diagnóstico presuntivo de gastrite. Sofreu uma PCR em casa 2 horas depois e faleceu.",
        vitals: { hr: 0, bp: "00/00", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
        feedback: "Dor torácica no PS deve ser investigada com ECG seriado e enzimas. Nunca dispense sem descartar síndrome coronariana aguda.",
        options: []
      },
      "monab_success": {
        id: "monab_success",
        text: "PARABÉNS!\n\nVocê identificou o IAM com Supra, não perdeu tempo com condutas desnecessárias e ativou a hemodinâmica (ou trombólise). O paciente recebeu AAS, Clopidogrel, Anticoagulação e foi para o cateterismo.\n\nArtéria coronária direita desobstruída com sucesso. Função ventricular preservada.",
        vitals: { hr: 78, bp: "120/80", spo2: 97, resp: 16, temp: 36.5, status: "recovered" },
        feedback: "O tempo porta-eletro < 10 min e o tempo porta-balão < 90 min são os indicadores de qualidade essenciais no IAM.",
        options: []
      }
    }
  },
  {
    id: "hipoglicemia-enfermaria",
    title: "Alteração de Consciência Súbita",
    difficulty: "Iniciante",
    category: "Clínica",
    description: "Paciente diabético em uso de insulina apresenta confusão mental e sudorese profusa na enfermaria.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Sr. José, 62 anos, DM2 em uso de Insulina NPH e Regular. Você o encontra no leito agitado, confuso e com sudorese fria profusa. A hora do almoço atrasou.\n\nSSVV: FC 115 | PA 130/80 | SpO2 96%.",
        vitals: { hr: 115, bp: "130/80", spo2: 96, resp: 20, temp: 36.0, status: "warning" },
        options: [
          { label: "Verificar Glicemia Capilar (HGT) imediatamente", nextNodeId: "check_hgt", type: "assessment" },
          { label: "Administrar a Insulina Regular prescrita para o almoço", nextNodeId: "insulin_error", type: "medication" },
          { label: "Conter o paciente mecanicamente (agitação)", nextNodeId: "restraint_error", type: "intervention" }
        ]
      },
      "check_hgt": {
        id: "check_hgt",
        text: "HGT realizado: 42 mg/dL.\n\nO paciente ainda está consciente, mas confuso e com dificuldade para engolir.",
        vitals: { hr: 118, bp: "125/75", spo2: 96, resp: 20, temp: 36.0, status: "warning" },
        options: [
          { label: "Oferecer suco de laranja com açúcar (VO)", nextNodeId: "oral_risk", type: "intervention" },
          { label: "Puncionar acesso e administrar Glicose 50% IV", nextNodeId: "glucose_iv", type: "medication" }
        ]
      },
      "insulin_error": {
        id: "insulin_error",
        text: "ERRO GRAVE! Você administrou insulina em um paciente que já estava hipoglicêmico.\n\nA glicemia caiu para níveis indetectáveis (< 20 mg/dL). O paciente convulsionou e entrou em coma profundo.",
        vitals: { hr: 140, bp: "90/50", spo2: 85, resp: 10, temp: 36.0, status: "critical" },
        feedback: "Nunca administre insulina em paciente com alteração de consciência sem checar a glicemia antes.",
        options: []
      },
      "restraint_error": {
        id: "restraint_error",
        text: "Você conteve o paciente, interpretando a agitação como psiquiátrica. A hipoglicemia continuou agindo no cérebro (neuroglicopenia).\n\nApós 30 minutos, o paciente 'acalmou' porque entrou em coma hipoglicêmico.",
        vitals: { hr: 50, bp: "80/40", spo2: 90, resp: 8, temp: 35.5, status: "critical" },
        options: [
          { label: "Verificar HGT agora", nextNodeId: "check_hgt", type: "assessment" }
        ]
      },
      "oral_risk": {
        id: "oral_risk",
        text: "Como o paciente estava confuso e com disfagia leve, ele engasgou com o suco.\n\nEvoluiu com broncoaspiração, queda da saturação e necessidade de aspiração de vias aéreas, complicando o quadro.",
        vitals: { hr: 130, bp: "140/90", spo2: 85, resp: 30, temp: 36.0, status: "warning" },
        feedback: "Em pacientes com rebaixamento do nível de consciência ou disfagia, a via oral é contraindicada pelo risco de aspiração. Use a via IV.",
        options: [
          { label: "Realizar Glicose IV agora", nextNodeId: "glucose_iv", type: "medication" },
          { label: "Aspirar vias aéreas e dar O2", nextNodeId: "aspiration_pneumonia", type: "critical" }
        ]
      },
      "aspiration_pneumonia": {
          id: "aspiration_pneumonia",
          text: "A pneumonia aspirativa foi grave. O paciente foi intubado e foi para UTI.",
          vitals: { hr: 120, bp: "100/60", spo2: 88, resp: 28, temp: 38.0, status: "critical" },
          options: []
      },
      "glucose_iv": {
        id: "glucose_iv",
        text: "Você administrou 2 a 4 ampolas de Glicose 50% IV em bolus.\n\nEm poucos minutos, o paciente recuperou a consciência, a sudorese cessou e ele perguntou o que aconteceu.\n\nHGT de controle (15 min depois): 120 mg/dL.",
        vitals: { hr: 80, bp: "120/80", spo2: 98, resp: 16, temp: 36.5, status: "recovered" },
        feedback: "A Glicose 50% IV é o tratamento de escolha para hipoglicemia grave sintomática em ambiente hospitalar.",
        options: []
      }
    }
  },
  {
    id: "sepse-foco-urinario",
    title: "Febre e Hipotensão no Idoso",
    difficulty: "Intermediário",
    category: "Clínica",
    description: "Paciente idosa institucionalizada chega com história de febre e prostração. Identificação de Sepse.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Dona Maria, 82 anos, vem do asilo. História de urina com odor forte há 3 dias. Hoje ficou sonolenta e teve febre.\n\nSSVV: PA 90/50 | FC 115 | FR 26 | Temp 38.5°C | SpO2 92%.\n\nqSOFA positivo (PAS<100, FR>22, Alteração Mental).",
        vitals: { hr: 115, bp: "90/50", spo2: 92, resp: 26, temp: 38.5, status: "warning" },
        options: [
          { label: "Abrir Protocolo de Sepse (Pacote da 1ª Hora)", nextNodeId: "sepsis_bundle", type: "intervention" },
          { label: "Administrar Dipirona e observar a febre baixar", nextNodeId: "dipyrone_only", type: "medication" },
          { label: "Coletar Urocultura e aguardar resultado em casa", nextNodeId: "discharge_sepsis", type: "critical" }
        ]
      },
      "dipyrone_only": {
        id: "dipyrone_only",
        text: "A febre baixou, mas a hipotensão piorou (choque séptico). Você perdeu a hora de ouro.\n\nA paciente evoluiu com oligúria e acidose metabólica.",
        vitals: { hr: 130, bp: "70/40", spo2: 88, resp: 30, temp: 36.0, status: "critical" },
        options: [
          { label: "Iniciar ressuscitação volêmica agressiva agora", nextNodeId: "late_resuscitation", type: "intervention" }
        ]
      },
      "sepsis_bundle": {
        id: "sepsis_bundle",
        text: "Você iniciou o pacote: 1. Lactato; 2. Hemoculturas; 3. Antibiótico amplo espectro; 4. Volume (30ml/kg de cristalóide) para hipotensão.\n\nApós 1000ml de Ringer Lactato, a PA foi para 100/60 mmHg e a FC para 95 bpm.",
        vitals: { hr: 95, bp: "100/60", spo2: 95, resp: 20, temp: 37.5, status: "stable" },
        options: [
          { label: "Manter monitorização e aguardar exames", nextNodeId: "sepsis_success", type: "assessment" },
          { label: "Suspender hidratação para não encharcar o pulmão", nextNodeId: "stop_fluids_early", type: "intervention" }
        ]
      },
      "discharge_sepsis": {
        id: "discharge_sepsis",
        text: "Você mandou uma paciente séptica para casa. Ela faleceu durante a noite por falência de múltiplos órgãos.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 0, status: "dead" },
        feedback: "Sepse é emergência médica. qSOFA positivo ou sinais de disfunção orgânica exigem internação imediata.",
        options: []
      },
      "late_resuscitation": {
        id: "late_resuscitation",
        text: "A ressuscitação tardia não foi suficiente para reverter a lesão renal e o choque. A paciente precisou de UTI, Diálise e Noradrenalina em doses altas. Prognóstico reservado.",
        vitals: { hr: 120, bp: "85/50", spo2: 90, resp: 28, temp: 36.5, status: "critical" },
        options: []
      },
      "stop_fluids_early": {
        id: "stop_fluids_early",
        text: "Ao suspender o volume precocemente, a perfusão tecidual caiu novamente. Lactato subiu de 2 para 4 mmol/L.\n\nOtimização volêmica guiada por metas é essencial.",
        vitals: { hr: 110, bp: "90/50", spo2: 94, resp: 24, temp: 37.0, status: "warning" },
        options: [
          { label: "Retomar volume e considerar vasopressor se necessário", nextNodeId: "sepsis_bundle", type: "intervention" },
          { label: "Iniciar diurético (Furosemida)", nextNodeId: "kidney_failure", type: "critical" }
        ]
      },
      "kidney_failure": {
          id: "kidney_failure",
          text: "O diurético em paciente hipovolêmico causou NTA (Necrose Tubular Aguda). Paciente em anúria e choque refratário.",
          vitals: { hr: 130, bp: "70/40", spo2: 90, resp: 30, temp: 37.0, status: "critical" },
          options: []
      },
      "sepsis_success": {
        id: "sepsis_success",
        text: "Conduta exemplar. A antibioticoterapia precoce e a reposição volêmica adequada estabilizaram a hemodinâmica.\n\nA paciente foi internada na enfermaria, urinou bem e está lúcida.",
        vitals: { hr: 80, bp: "120/70", spo2: 97, resp: 16, temp: 36.5, status: "recovered" },
        options: []
      }
    }
  },
  {
    id: "choque-septico",
    title: "Paciente Hipotenso na UTI",
    difficulty: "Avançado",
    category: "UTI",
    description: "Paciente internado por pneumonia evolui com rebaixamento do nível de consciência e hipotensão. Manejo do Choque Séptico.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Dona Maria, 72 anos, D5 de internação por Pneumonia. O técnico chama você: 'A paciente está estranha, sonolenta e a pressão caiu'.\n\nAo exame: Sonolenta, pele quente, tempo de enchimento capilar 4 seg.\n\nSSVV: PA 80/40 mmHg | FC 125 bpm | SpO2 88% | Tax 38.5°C.",
        vitals: { hr: 125, bp: "80/40", spo2: 88, resp: 28, temp: 38.5, status: "warning" },
        options: [
          { label: "Iniciar Noradrenalina imediata em acesso periférico", nextNodeId: "nora_perif", type: "medication" },
          { label: "Expansão Volêmica (Ringer Lactato 30ml/kg) + O2", nextNodeId: "volume_ok", type: "intervention" },
          { label: "Administrar Dipirona para febre e observar", nextNodeId: "dipirona_only", type: "medication" }
        ]
      },
      "dipirona_only": {
        id: "dipirona_only",
        text: "Você tratou a febre, mas ignorou a hipotensão e a hipoperfusão.\n\nA paciente evoluiu para Choque Séptico refratário e Parada Cardiorrespiratória em AESP.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 37.0, status: "dead" },
        feedback: "Hipotensão + Taquicardia + Infecção = Sinais claros de Sepse/Choque Séptico. Requer ação imediata (Hour-1 Bundle).",
        options: []
      },
      "nora_perif": {
        id: "nora_perif",
        text: "Você iniciou o vasopressor precocemente. A pressão subiu para 100/60 mmHg.\n\nPorém, a paciente ainda está 'vazia' (hipovolêmica). O vasopressor 'espreme' vasos vazios, piorando a microcirculação a longo prazo se não houver volume.\n\nAlém disso, iniciou em acesso periférico sem diluição adequada, causando necrose tecidual no braço.",
        vitals: { hr: 130, bp: "100/60", spo2: 90, resp: 26, temp: 38.2, status: "warning" },
        options: [
          { label: "Realizar expansão volêmica agora + Coletar Lactato/Culturas", nextNodeId: "late_rescue", type: "intervention" },
          { label: "Aumentar a dose da Noradrenalina", nextNodeId: "ischemia_limb", type: "critical" }
        ]
      },
      "ischemia_limb": {
          id: "ischemia_limb",
          text: "A dose alta em acesso periférico causou vasoconstrição extrema e necrose extensa do membro superior. A paciente precisará de amputação.",
          vitals: { hr: 140, bp: "140/90", spo2: 90, resp: 30, temp: 38.0, status: "critical" },
          options: []
      },
      "volume_ok": {
        id: "volume_ok",
        text: "Excelente. Você ofertou oxigênio (aumentando SpO2) e iniciou a reposição volêmica agressiva (30ml/kg) conforme diretrizes da Surviving Sepsis Campaign.\n\nEnquanto o volume corre, você solicitou: Lactato, Hemoculturas e iniciou o Antibiótico na primeira hora.\n\nApós 1000ml de volume, a PA foi para 90/60 mmHg, mas ainda limítrofe.",
        vitals: { hr: 110, bp: "90/60", spo2: 96, resp: 22, temp: 38.0, status: "stable" },
        options: [
          { label: "Manter apenas volume até normalizar PA", nextNodeId: "volume_overload", type: "intervention" },
          { label: "Iniciar Vasopressor (Noradrenalina) e avaliar resposta", nextNodeId: "sepsis_success", type: "medication" }
        ]
      },
      "volume_overload": {
        id: "volume_overload",
        text: "Você infundiu 4 litros de soro. A paciente começou a estertorar (edema agudo de pulmão) e precisou ser intubada, sem melhora significativa da PA média.",
        vitals: { hr: 120, bp: "85/50", spo2: 85, resp: 35, temp: 37.8, status: "critical" },
        feedback: "Se o paciente não responde ao volume inicial, não insista indefinidamente. Inicie o vasopressor para garantir PAM >= 65 mmHg.",
        options: []
      },
      "late_rescue": {
        id: "late_rescue",
        text: "Você corrigiu a conduta, mas houve atraso. A paciente estabilizou, mas a necrose no braço pelo extravasamento da noradrenalina exigirá desbridamento cirúrgico.",
        vitals: { hr: 100, bp: "110/70", spo2: 95, resp: 20, temp: 37.5, status: "recovered" },
        feedback: "Vasopressores idealmente em acesso central. Se periférico, use veia calibrosa, diluição correta e por curto período.",
        options: []
      },
      "sepsis_success": {
        id: "sepsis_success",
        text: "CONDUTA PERFEITA.\n\nVocê seguiu o 'Hour-1 Bundle': Lactato medido, Culturas antes do ATB, ATB amplo espectro, Volume inicial e Vasopressor para manter PAM >= 65 mmHg.\n\nA paciente recuperou o nível de consciência, a diurese melhorou e o lactato começou a cair (clareamento).",
        vitals: { hr: 88, bp: "115/75", spo2: 98, resp: 18, temp: 37.0, status: "recovered" },
        options: []
      }
    }
  },
  {
    id: "asma-pediatrica",
    title: "Crise Asmática na Emergência",
    difficulty: "Intermediário",
    category: "Pediatria",
    description: "Menino de 6 anos chega com desconforto respiratório importante e sibilância audível. Mãe relata uso irregular da bombinha.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Pedro, 6 anos, trazido pelo mãe. Histórico de asma. Há 2 dias com tosse, hoje piorou o cansaço.\n\nExame: Tiragem subcostal, batimento de asa de nariz, sibilância difusa, fala entrecortada.\n\nSSVV: FC 140 bpm | FR 40 irpm | SpO2 89% (ar ambiente) | Temp 37.0°C.",
        vitals: { hr: 140, bp: "100/60", spo2: 89, resp: 40, temp: 37.0, status: "warning" },
        options: [
          { label: "Oxigênio sob máscara + Salbutamol (Beta-2) inalatório imediato", nextNodeId: "beta2_o2", type: "intervention" },
          { label: "Intubação Orotraqueal Imediata (IOT)", nextNodeId: "iot_early", type: "critical" },
          { label: "Solicitar Raio-X de Tórax e Gasometria antes de tratar", nextNodeId: "delay_exam", type: "assessment" }
        ]
      },
      "beta2_o2": {
        id: "beta2_o2",
        text: "Você iniciou O2 para manter Sat > 94% e fez 3 ciclos de Salbutamol (puff com espaçador ou nebulização) a cada 20 min.\n\nReavaliação após 1 hora: Criança ainda dispneica, mas saturação melhorou para 93% com O2. Murmúrio vesicular ainda reduzido.",
        vitals: { hr: 135, bp: "100/60", spo2: 93, resp: 35, temp: 37.0, status: "warning" },
        options: [
          { label: "Associar Corticoide Sistêmico (Prednisolona VO ou Metilprednisolona IV)", nextNodeId: "corticoid_added", type: "medication" },
          { label: "Suspender medicações e observar", nextNodeId: "stop_meds", type: "critical" }
        ]
      },
      "corticoid_added": {
        id: "corticoid_added",
        text: "Excelente. O corticoide é fundamental na crise moderada/grave para reduzir a inflamação da via aérea (efeito inicia em 2-4h). Você manteve os broncodilatadores.\n\nApós 4 horas, Pedro está brincando no leito, sem tiragem, SpO2 96% em ar ambiente.",
        vitals: { hr: 100, bp: "100/60", spo2: 96, resp: 22, temp: 36.8, status: "recovered" },
        feedback: "O manejo da asma grave inclui: O2, Beta-2 agonista de curta (Salbutamol) repetido, Ipratrópio (em casos graves) e Corticoide sistêmico precoce.",
        options: []
      },
      "iot_early": {
        id: "iot_early",
        text: "Você optou por intubar uma criança em crise asmática sem tentar resgate farmacológico.\n\nDurante o procedimento, houve laringoespasmo grave e hipóxia profunda, evoluindo para bradicardia.",
        vitals: { hr: 60, bp: "50/30", spo2: 60, resp: 0, temp: 36.5, status: "warning" },
        feedback: "A IOT na asma é a última linha. É um procedimento de altíssimo risco. Tente ventilar com máscara e ambu + O2 100%.",
        options: [
           { label: "Ventilar com bolsa-válvula-máscara e O2 100%", nextNodeId: "cpr_asthma", type: "intervention" },
           { label: "Tentar reintubar imediatamente", nextNodeId: "cardiac_arrest_death", type: "critical" }
        ]
      },
      "cardiac_arrest_death": {
          id: "cardiac_arrest_death",
          text: "A tentativa repetida de intubação em hipóxia causou PCR em assistolia. Óbito.",
          vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
          options: []
      },
      "cpr_asthma": {
          id: "cpr_asthma",
          text: "A criança respondeu à ventilação de resgate, a FC subiu e a saturação melhorou para 85%. Foi transferida para UTI.",
          vitals: { hr: 120, bp: "90/60", spo2: 85, resp: 0, temp: 36.0, status: "critical" },
          options: []
      },
      "delay_exam": {
          id: "delay_exam",
          text: "Você enviou a criança instável para o Raio-X. No caminho, a hipóxia piorou significativamente.\n\nO tratamento da asma é clínico e imediato. Exames não devem atrasar o broncodilatador.",
          vitals: { hr: 160, bp: "90/50", spo2: 82, resp: 50, temp: 37.0, status: "warning" },
          options: [
              { label: "Retornar e iniciar protocolo de asma grave agora", nextNodeId: "beta2_o2", type: "intervention" },
              { label: "Esperar o resultado do Raio-X", nextNodeId: "respiratory_failure", type: "critical" }
          ]
      },
      "respiratory_failure": {
          id: "respiratory_failure",
          text: "A demora causou fadiga muscular respiratória. A criança entrou em insuficiência respiratória franca e parou.",
          vitals: { hr: 40, bp: "60/30", spo2: 70, resp: 8, temp: 37.0, status: "critical" },
          options: []
      },
      "stop_meds": {
          id: "stop_meds",
          text: "Você suspendeu o tratamento precocemente. O efeito do broncodilatador passou e a obstrução retornou pior (efeito rebote).",
          vitals: { hr: 150, bp: "95/55", spo2: 85, resp: 45, temp: 37.0, status: "warning" },
          options: [
               { label: "Reiniciar protocolo agressivo + Magnésio IV", nextNodeId: "corticoid_added", type: "intervention" },
               { label: "Dar alta para casa", nextNodeId: "return_critical", type: "critical" }
          ]
      },
      "return_critical": {
          id: "return_critical",
          text: "A criança voltou 2 horas depois em parada respiratória.",
          vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
          options: []
      }
    }
  },
  {
    id: "cetoacidose",
    title: "Descompensação Diabética",
    difficulty: "Intermediário",
    category: "Clínica",
    description: "Jovem de 22 anos, DM1, chega com náuseas, dor abdominal e respiração profunda. Glicemia 'HI' no aparelho.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Lucas, 22 anos, DM1. Relata que parou insulina há 2 dias por falta de dinheiro. Chega desidratado, sonolento, hálito de 'maçã podre'.\n\nSSVV: FC 118 | PA 100/60 | FR 28 (Kussmaul) | HGT: Hi (>600).",
        vitals: { hr: 118, bp: "100/60", spo2: 96, resp: 28, temp: 36.5, status: "warning" },
        options: [
          { label: "Hidratação Venosa (SF 0,9%) 1000ml na 1ª hora", nextNodeId: "hydration", type: "intervention" },
          { label: "Insulina Regular 10UI IV em bolus imediato", nextNodeId: "insulin_bolus_error", type: "medication" },
          { label: "Bicarbonato de Sódio IV para corrigir acidose", nextNodeId: "bicarb_error", type: "medication" }
        ]
      },
      "hydration": {
        id: "hydration",
        text: "Você iniciou a hidratação vigorosa. Isso é crucial para perfusão e baixar a glicemia inicialmente.\n\nExames chegam: pH 7.15 | Bic 10 | Glicemia 550 | Potássio (K+) 3.0 mEq/L.",
        vitals: { hr: 100, bp: "110/70", spo2: 97, resp: 24, temp: 36.5, status: "stable" },
        options: [
          { label: "Iniciar Insulina Regular em Bomba (0,1 UI/kg/h)", nextNodeId: "insulin_k_error", type: "medication" },
          { label: "Repor Potássio antes de iniciar a Insulina", nextNodeId: "reple_k", type: "intervention" }
        ]
      },
      "reple_k": {
        id: "reple_k",
        text: "Decisão correta! Como o K+ está < 3.3, a insulina faria o potássio entrar na célula, causando hipocalemia fatal.\n\nVocê repôs K+ por 1 hora. Novo K+: 4.0. Agora iniciou a Insulina.\n\n4 horas depois: Glicemia 200, pH 7.32, paciente lúcido.",
        vitals: { hr: 80, bp: "120/80", spo2: 98, resp: 16, temp: 36.5, status: "recovered" },
        options: [],
        feedback: "Pilares da CAD: Volume, Potássio (checar antes da insulina) e Insulina."
      },
      "insulin_k_error": {
        id: "insulin_k_error",
        text: "ERRO CRÍTICO.\n\nO paciente tinha K+ de 3.0. Ao dar insulina, o K+ caiu para 1.5.\n\nO monitor mostra Arritmia Ventricular grave -> PCR.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
        feedback: "NUNCA inicie insulina na CAD se o Potássio estiver < 3.3 mEq/L. Reponha K+ primeiro!",
        options: []
      },
      "insulin_bolus_error": {
          id: "insulin_bolus_error",
          text: "Você fez insulina sem hidratar e sem ver o potássio. A glicemia caiu rápido, mas a desidratação persistiu e o risco de hipocalemia não foi avaliado.\n\nO paciente hipotendeu e fez uma arritmia leve.",
          vitals: { hr: 140, bp: "70/40", spo2: 90, resp: 30, temp: 36.5, status: "warning" },
          options: [
              { label: "Suspender insulina, Volume + K+", nextNodeId: "hydration", type: "intervention" },
              { label: "Repetir insulina", nextNodeId: "hypokalemia_arrest", type: "critical" }
          ]
      },
      "hypokalemia_arrest": {
          id: "hypokalemia_arrest",
          text: "A insulina repetida baixou o potássio criticamente. PCR em FV.",
          vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
          options: []
      },
      "bicarb_error": {
          id: "bicarb_error",
          text: "O uso de Bicarbonato na CAD só é indicado se pH < 6.9. O uso desnecessário piora a acidose intracelular e o edema cerebral.\n\nO paciente rebaixou o nível de consciência.",
          vitals: { hr: 110, bp: "100/60", spo2: 95, resp: 12, temp: 36.5, status: "warning" },
          feedback: "Bicarbonato não é tratamento de rotina para cetoacidose.",
          options: [
               { label: "Focar na Hidratação e Insulina", nextNodeId: "hydration", type: "intervention" },
               { label: "Dar mais bicarbonato", nextNodeId: "cerebral_edema", type: "critical" }
          ]
      },
      "cerebral_edema": {
          id: "cerebral_edema",
          text: "O excesso de bicarbonato e a mudança rápida de osmolaridade causaram edema cerebral fatal.",
          vitals: { hr: 40, bp: "200/100", spo2: 90, resp: 6, temp: 37.0, status: "dead" },
          options: []
      }
    }
  },
  {
    id: "trauma-xabcde",
    title: "Acidente de Moto - Hemorragia",
    difficulty: "Avançado",
    category: "Urgência",
    description: "Motociclista, 25 anos, colisão frontal. Sangramento ativo importante em membro inferior direito.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Cena segura. Paciente no chão, gemendo. Amputação traumática parcial de perna direita com sangramento arterial pulsátil (esguicho).\n\nSSVV: FC 140 | PA 70/40 | SpO2 88% | Pele pálida e fria.",
        vitals: { hr: 140, bp: "70/40", spo2: 88, resp: 28, temp: 35.5, status: "warning" },
        options: [
          { label: "Aplicar Torniquete imediatamente acima da lesão (X)", nextNodeId: "torniquete", type: "intervention" },
          { label: "Puncionar dois acessos venosos calibrosos (C)", nextNodeId: "acesso_fail", type: "intervention" },
          { label: "Intubar para proteger via aérea (A)", nextNodeId: "iot_fail", type: "critical" }
        ]
      },
      "torniquete": {
        id: "torniquete",
        text: "Torniquete aplicado e apertado até parar o sangramento. A 'torneira' fechou.\n\nAgora você segue: A (Vias aéreas pérvias), B (O2 suplementar), C (Reposição volêmica aquecida).\n\nA PA subiu para 90/60 mmHg.",
        vitals: { hr: 110, bp: "90/60", spo2: 96, resp: 20, temp: 36.0, status: "stable" },
        options: [
          { label: "Transporte rápido para cirurgia + Ácido Tranexâmico", nextNodeId: "tranexamic", type: "medication" },
          { label: "Retirar o torniquete para ver se parou", nextNodeId: "tourniquet_off", type: "critical" }
        ]
      },
      "tranexamic": {
        id: "tranexamic",
        text: "Paciente recebeu volume controlado (hipotensão permissiva) e antifibrinolítico.\n\nChegou ao centro cirúrgico estável para controle definitivo.\n\nVocê salvou a vida dele aplicando o XABCDE corretamente.",
        vitals: { hr: 90, bp: "100/70", spo2: 98, resp: 16, temp: 36.5, status: "recovered" },
        options: []
      },
      "acesso_fail": {
        id: "acesso_fail",
        text: "Enquanto você tentava puncionar veias colabadas (difíceis pelo choque), o paciente perdeu mais 1 litro de sangue pela perna.\n\nEntrou em PCR por hipovolemia grave.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 35.0, status: "dead" },
        feedback: "No trauma com hemorragia exsanguinante, o 'X' (controle do sangramento) vem antes de tudo. Não adianta dar volume se o balde está furado.",
        options: []
      },
      "iot_fail": {
          id: "iot_fail",
          text: "A sedação para intubação tirou o tônus simpático que mantinha o paciente vivo. A PA zerou imediatamente após a indução (Colapso Cardiovascular).\n\nAlém disso, o sangramento na perna continuou.",
          vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 35.0, status: "dead" },
          feedback: "Prioridades! Controle a hemorragia antes de procedimentos que podem instabilizar o paciente.",
          options: []
      },
      "tourniquet_off": {
          id: "tourniquet_off",
          text: "Ao soltar o torniquete fora do centro cirúrgico, o paciente voltou a sangrar massivamente e os coágulos formados se soltaram.\n\nChoque descompensado.",
          vitals: { hr: 150, bp: "60/30", spo2: 85, resp: 30, temp: 35.5, status: "warning" },
          options: [
              { label: "Reaplicar torniquete e correr para CC", nextNodeId: "torniquete", type: "intervention" },
              { label: "Manter solto e comprimir com gaze", nextNodeId: "bleed_out", type: "critical" }
          ]
      },
      "bleed_out": {
          id: "bleed_out",
          text: "A compressão manual não foi suficiente para a artéria femoral rompida. Exsanguinação fatal.",
          vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 35.0, status: "dead" },
          options: []
      }
    }
  },
  {
    id: "hpp-obstetricia",
    title: "Hemorragia Pós-Parto (HPP)",
    difficulty: "Avançado",
    category: "Obstetrícia",
    description: "Puerpera imediata apresenta sangramento vaginal intenso após parto normal. O tempo de resposta define o prognóstico.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Ana, 28 anos, G2P2, parto normal há 30 minutos. Recém-nascido no colo. Você nota lençol encharcado de sangue vivo.\n\nExame: Paciente pálida, queixando de tontura. Útero amolecido acima da cicatriz umbilical.\n\nSSVV: FC 110 | PA 90/60.",
        vitals: { hr: 110, bp: "90/60", spo2: 96, resp: 20, temp: 36.5, status: "warning" },
        options: [
          { label: "Massagem Uterina Externa + Ocitocina IV/IM Imediata", nextNodeId: "massagem_ocitocina", type: "intervention" },
          { label: "Colocar em Trendelenburg e aumentar hidratação", nextNodeId: "trendelenburg_only", type: "intervention" },
          { label: "Solicitar tipagem sanguínea e aguardar médico", nextNodeId: "wait_doctor", type: "assessment" }
        ]
      },
      "massagem_ocitocina": {
        id: "massagem_ocitocina",
        text: "Você realizou a Massagem Bimanual (manobra de Hamilton) e administrou Ocitocina. O sangramento diminuiu, mas o útero ainda relaxa quando você para a massagem.\n\nDiagnóstico provável: Atonia Uterina (causa de 70% das HPPs).",
        vitals: { hr: 105, bp: "95/60", spo2: 97, resp: 18, temp: 36.5, status: "warning" },
        options: [
          { label: "Administrar Ácido Tranexâmico + Misoprostol Retal", nextNodeId: "second_line_meds", type: "medication" },
          { label: "Continuar apenas com massagem", nextNodeId: "massage_fail", type: "intervention" }
        ]
      },
      "second_line_meds": {
        id: "second_line_meds",
        text: "Com a associação do antifibrinolítico (Tranexâmico) e a segunda linha de uterotônicos (Misoprostol), o útero contraiu firmemente (Globo de segurança de Pinard).\n\nO sangramento parou. Você repôs cristaloide aquecido.",
        vitals: { hr: 90, bp: "110/70", spo2: 98, resp: 16, temp: 36.5, status: "recovered" },
        feedback: "A sequência do manejo da HPP (Atonia): Massagem + Ocitocina -> Ácido Tranexâmico -> Misoprostol/Ergotamina -> Balão de Bakri -> Cirurgia.",
        options: []
      },
      "trendelenburg_only": {
        id: "trendelenburg_only",
        text: "A posição melhorou o retorno venoso momentaneamente, mas a causa (Atonia) não foi tratada. O útero continua sangrando massivamente (como uma torneira aberta).\n\nPaciente entra em choque grau III.",
        vitals: { hr: 140, bp: "70/40", spo2: 90, resp: 30, temp: 36.0, status: "warning" },
        options: [
          { label: "Iniciar protocolo de Transfusão Maciça e Massagem agora", nextNodeId: "late_rescue_hpp", type: "intervention" },
          { label: "Aguardar contração espontânea", nextNodeId: "shock_irreversible", type: "critical" }
        ]
      },
      "shock_irreversible": {
          id: "shock_irreversible",
          text: "A perda sanguínea massiva levou a choque irreversível e coagulopatia. Óbito.",
          vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 35.0, status: "dead" },
          options: []
      },
      "wait_doctor": {
        id: "wait_doctor",
        text: "Enquanto você aguardava ou preenchia papéis, a paciente perdeu mais 1000ml de sangue.\n\nA HPP mata em minutos. A enfermagem deve iniciar o manejo (massagem/ocitocina) imediatamente.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 35.0, status: "dead" },
        feedback: "Na HPP, a 'Hora de Ouro' é na verdade o 'Minuto de Ouro'. Atonia uterina exige ação mecânica e farmacológica imediata.",
        options: []
      },
      "late_rescue_hpp": {
        id: "late_rescue_hpp",
        text: "A paciente foi levada às pressas para Histerectomia de emergência. Sobreviveu, mas perdeu o útero e precisou de UTI.",
        vitals: { hr: 120, bp: "90/50", spo2: 95, resp: 24, temp: 36.0, status: "stable" },
        feedback: "O atraso no tratamento da atonia frequentemente leva à perda do órgão ou morte.",
        options: []
      },
      "massage_fail": {
        id: "massage_fail",
        text: "A massagem sozinha não foi suficiente para manter o tônus. O sangramento voltou a aumentar, exigindo medidas invasivas.",
        vitals: { hr: 125, bp: "85/50", spo2: 94, resp: 22, temp: 36.5, status: "warning" },
        options: [
           { label: "Escalonar para Misoprostol/Ergotamina", nextNodeId: "second_line_meds", type: "medication" },
           { label: "Aumentar apenas a Ocitocina", nextNodeId: "uterus_fatigue", type: "critical" }
        ]
      },
      "uterus_fatigue": {
          id: "uterus_fatigue",
          text: "Os receptores de ocitocina saturaram. O útero não responde mais e o sangramento continua. Histerectomia será necessária.",
          vitals: { hr: 130, bp: "80/40", spo2: 92, resp: 24, temp: 36.5, status: "critical" },
          options: []
      }
    }
  },
  {
    id: "avc-agudo",
    title: "AVC: O Tempo é Cérebro",
    difficulty: "Intermediário",
    category: "Urgência",
    description: "Senhora de 65 anos apresenta desvio de rima labial e perda de força súbita no braço direito.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Dona Lúcia, 65 anos, hipertensa. Estava almoçando quando 'a boca tortou' e o braço direito caiu. Fala enrolada (disartria). Chega ao PS 40 minutos após os sintomas.\n\nSSVV: PA 190/100 mmHg | FC 88 bpm | HGT 110 mg/dL.",
        vitals: { hr: 88, bp: "190/100", spo2: 96, resp: 18, temp: 36.5, status: "warning" },
        options: [
          { label: "Acionar Código AVC e encaminhar para Tomografia (TC) Imediata", nextNodeId: "tc_scan", type: "intervention" },
          { label: "Administrar Captopril SL para baixar a pressão antes de tudo", nextNodeId: "pressure_drop_error", type: "medication" },
          { label: "Aguardar melhora espontânea (pode ser paralisia de Bell)", nextNodeId: "wait_error", type: "assessment" }
        ]
      },
      "tc_scan": {
        id: "tc_scan",
        text: "TC de Crânio realizada em 15 minutos (Meta!).\n\nResultado: Ausência de sangramento (AVC Isquêmico). O médico indica Trombólise (Alteplase).\n\nA PA está 190/100. Para trombolisar, a PA deve estar abaixo de 185/110.",
        vitals: { hr: 90, bp: "190/100", spo2: 96, resp: 18, temp: 36.5, status: "warning" },
        options: [
          { label: "Administrar Anti-hipertensivo venoso (ex: Nitroprussiato/Labetalol) suavemente", nextNodeId: "thrombolysis_success", type: "medication" },
          { label: "Iniciar Trombólise mesmo com a PA alta", nextNodeId: "bleed_complication", type: "critical" }
        ]
      },
      "pressure_drop_error": {
        id: "pressure_drop_error",
        text: "Você baixou a pressão para 130/80 bruscamente. No AVC isquêmico, a hipertensão é um mecanismo de defesa para manter a perfusão cerebral na área de penumbra.\n\nAo baixar a pressão, a área de infarto aumentou. A paciente perdeu a fala completamente (Afasia).",
        vitals: { hr: 80, bp: "130/80", spo2: 96, resp: 16, temp: 36.5, status: "critical" },
        feedback: "No AVC agudo, só tratamos a PA se > 220/120 (ou > 185/110 se for trombolisar). A redução deve ser lenta e controlada.",
        options: []
      },
      "wait_error": {
        id: "wait_error",
        text: "Você esperou 3 horas. Os sintomas persistiram. Quando a TC foi feita, já havia passado a janela terapêutica de 4,5h para trombólise.\n\nA paciente ficou com sequelas motoras definitivas que poderiam ter sido evitadas.",
        vitals: { hr: 80, bp: "180/100", spo2: 96, resp: 16, temp: 36.5, status: "stable" },
        feedback: "Tempo é cérebro. Cada minuto perdido no AVC significa milhões de neurônios mortos.",
        options: []
      },
      "thrombolysis_success": {
        id: "thrombolysis_success",
        text: "PA controlada para 175/95 mmHg. Trombólise iniciada dentro da janela.\n\n1 hora após o fim da infusão, a paciente recuperou a força no braço e a fala. O déficit neurológico foi revertido.",
        vitals: { hr: 80, bp: "160/90", spo2: 98, resp: 16, temp: 36.5, status: "recovered" },
        options: []
      },
      "bleed_complication": {
        id: "bleed_complication",
        text: "Ao trombolisar com PA > 185/110, o risco de transformação hemorrágica aumenta drasticamente.\n\nA paciente evoluiu com cefaleia súbita e rebaixamento do nível de consciência (AVC Hemorrágico secundário).",
        vitals: { hr: 60, bp: "210/120", spo2: 92, resp: 10, temp: 36.5, status: "critical" },
        feedback: "Respeitar os critérios de exclusão e parâmetros de segurança da trombólise é vital.",
        options: []
      }
    }
  },
  {
    id: "reacao-transfusional",
    title: "Reação Transfusional no Leito",
    difficulty: "Intermediário",
    category: "Clínica",
    description: "Paciente em enfermaria recebendo Concentrado de Hemácias começa a apresentar sintomas 15 minutos após o início.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Sr. Carlos, internado por anemia grave, recebe CH. A infusão começou há 15 minutos.\n\nEle chama você referindo 'dor nas costas', calafrios e sensação de morte iminente. Você nota a urina na bolsa coletora ficando escura.\n\nSSVV: FC 130 | PA 80/50 | Tax 38.8°C.",
        vitals: { hr: 130, bp: "80/50", spo2: 92, resp: 24, temp: 38.8, status: "warning" },
        options: [
          { label: "Interromper a transfusão IMEDIATAMENTE e manter acesso com SF 0,9%", nextNodeId: "stop_transfusion", type: "intervention" },
          { label: "Diminuir o gotejamento e administrar Dipirona para a febre", nextNodeId: "slow_down_error", type: "medication" },
          { label: "Acelerar a infusão para terminar logo", nextNodeId: "speed_up_error", type: "critical" }
        ]
      },
      "stop_transfusion": {
        id: "stop_transfusion",
        text: "Você parou o sangue, trocou o equipo e manteve a veia aberta com Soro Fisiológico.\n\nNotificou o médico e o Banco de Sangue. Checou os dados da bolsa novamente e percebeu erro na identificação (Troca de bolsa).\n\nO paciente está estabilizando com volume e corticoide.",
        vitals: { hr: 110, bp: "95/60", spo2: 95, resp: 20, temp: 38.0, status: "stable" },
        options: [
          { label: "Enviar bolsa e amostras de sangue/urina ao laboratório", nextNodeId: "investigation", type: "assessment" },
          { label: "Reiniciar transfusão lentamente", nextNodeId: "second_reaction", type: "critical" }
        ]
      },
      "second_reaction": {
          id: "second_reaction",
          text: "A reação hemolítica recomeçou imediatamente com maior gravidade. Choque e CIVD.",
          vitals: { hr: 140, bp: "60/40", spo2: 85, resp: 30, temp: 39.5, status: "critical" },
          options: []
      },
      "slow_down_error": {
        id: "slow_down_error",
        text: "Você apenas diminuiu o gotejamento. O paciente continuou recebendo o sangue incompatível.\n\nA reação hemolítica aguda evoluiu para Coagulação Intravascular Disseminada (CIVD) e Insuficiência Renal Aguda. O paciente faleceu.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 39.0, status: "dead" },
        feedback: "Qualquer sinal de reação transfusional exige a PARADA IMEDIATA da infusão. Não trate apenas o sintoma.",
        options: []
      },
      "speed_up_error": {
        id: "speed_up_error",
        text: "Acelerar a infusão aumentou a carga de hemoglobina livre e complexos antígeno-anticorpo. O choque foi fulminante.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 39.5, status: "dead" },
        feedback: "Nunca acelere uma infusão se o paciente apresenta queixas.",
        options: []
      },
      "investigation": {
        id: "investigation",
        text: "As amostras confirmaram incompatibilidade ABO. Graças à sua interrupção rápida (nos primeiros 15 min), a quantidade infundida foi pequena.\n\nO paciente recuperou-se sem sequelas renais permanentes.",
        vitals: { hr: 80, bp: "120/80", spo2: 98, resp: 16, temp: 36.5, status: "recovered" },
        feedback: "A dupla checagem à beira-leito (Dois profissionais conferindo bolsa e pulseira) é a melhor prevenção para este erro.",
        options: []
      }
    }
  },
  {
    id: "pneumotorax-trauma",
    title: "Trauma Torácico Fechado",
    difficulty: "Avançado",
    category: "Urgência",
    description: "Vítima de agressão física com dor torácica intensa e dificuldade respiratória progressiva. Sem exames de imagem disponíveis.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Jovem, 20 anos, vítima de espancamento (socos e chutes). Queixa-se de muita dor no hemitórax direito e falta de ar que está piorando rapidamente.\n\nExame: Turgência Jugular presente. Ausculta: Murmúrio Vesicular abolido à direita. Percussão: Hipertimpânico à direita.\n\nSSVV: FC 130 | PA 80/50 | SpO2 85% | FR 32.",
        vitals: { hr: 130, bp: "80/50", spo2: 85, resp: 32, temp: 36.5, status: "warning" },
        options: [
          { label: "Realizar Descompressão Torácica com agulha (2º ou 5º EIC)", nextNodeId: "needle_decompression", type: "intervention" },
          { label: "Solicitar Raio-X de Tórax urgente", nextNodeId: "xray_death", type: "assessment" },
          { label: "Intubar (IOT) devido à hipóxia grave", nextNodeId: "intubation_worsens", type: "critical" }
        ]
      },
      "needle_decompression": {
        id: "needle_decompression",
        text: "Você identificou clinicamente o Pneumotórax Hipertensivo (Choque Obstrutivo). Inseriu um jelco 14 no 2º EIC (linha hemiclavicular) ou 5º EIC (linha axilar anterior).\n\nOuviu-se um 'shhh' de saída de ar.\n\nSSVV: FC 100 | PA 110/70 | SpO2 94%.",
        vitals: { hr: 100, bp: "110/70", spo2: 94, resp: 20, temp: 36.5, status: "stable" },
        options: [
          { label: "Preparar material para Drenagem Torácica selada em água", nextNodeId: "chest_tube", type: "intervention" },
          { label: "Retirar a agulha pois o paciente melhorou", nextNodeId: "remove_needle_error", type: "critical" }
        ]
      },
      "xray_death": {
        id: "xray_death",
        text: "Enquanto o paciente era posicionado para o Raio-X, ele fez uma PCR em AESP.\n\nO Pneumotórax Hipertensivo é um diagnóstico CLÍNICO. Não se deve esperar imagem para tratar se o paciente está instável.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
        feedback: "Hipotensão + Turgência Jugular + Ausência de Murmúrio = Choque Obstrutivo. Ação imediata necessária.",
        options: []
      },
      "intubation_worsens": {
        id: "intubation_worsens",
        text: "Você intubou. A ventilação com pressão positiva aumentou a pressão dentro do tórax, transformando o pneumotórax em hipertensivo grave, colapsando a veia cava.\n\nO paciente parou imediatamente após a intubação.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
        feedback: "Nunca intube um pneumotórax hipertensivo antes de descomprimir (drenar/puncionar) o tórax.",
        options: []
      },
      "chest_tube": {
        id: "chest_tube",
        text: "Dreno de tórax inserido no 5º espaço intercostal. Oscilação presente no selo d'água. Pulmão reexpandido.\n\nPaciente estabilizado e encaminhado para observação.",
        vitals: { hr: 85, bp: "120/80", spo2: 98, resp: 16, temp: 36.5, status: "recovered" },
        options: []
      },
      "remove_needle_error": {
        id: "remove_needle_error",
        text: "Ao retirar a agulha sem o dreno definitivo, o ar voltou a acumular (efeito válvula). O paciente chocou novamente em minutos.",
        vitals: { hr: 140, bp: "60/40", spo2: 80, resp: 40, temp: 36.5, status: "warning" },
        options: [
          { label: "Puncionar novamente", nextNodeId: "needle_decompression", type: "intervention" },
          { label: "Intubar", nextNodeId: "tension_recurrence", type: "critical" }
        ]
      },
      "tension_recurrence": {
          id: "tension_recurrence",
          text: "Intubação com pneumotórax hipertensivo não drenado = PCR.",
          vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
          options: []
      }
    }
  },
  {
    id: "status-epilepticus",
    title: "Estado de Mal Epiléptico",
    difficulty: "Intermediário",
    category: "Urgência",
    description: "Paciente em crise convulsiva tônico-clônica generalizada há mais de 5 minutos na sala de espera.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Homem, 40 anos, cai na sala de espera convulsionando. Tônico-clônico generalizado. A crise já dura 8 minutos contínuos (Status Epilepticus).\n\nAcesso venoso obtido com dificuldade.\n\nSSVV: FC 130 | SpO2 88% | Cianose labial.",
        vitals: { hr: 130, bp: "140/90", spo2: 88, resp: 0, temp: 37.0, status: "warning" },
        options: [
          { label: "Administrar Diazepam 10mg IV lento (1ª Linha)", nextNodeId: "benzo_ok", type: "medication" },
          { label: "Administrar Fenitoína IV direto (2ª Linha)", nextNodeId: "phenytoin_slow", type: "medication" },
          { label: "Colocar cânula de Guedel à força para abrir o boca", nextNodeId: "guedel_error", type: "intervention" }
        ]
      },
      "benzo_ok": {
        id: "benzo_ok",
        text: "A crise cessou após 2 minutos do Diazepam. O paciente está em fase pós-ictal (sonolento), respirando melhor com O2 suplementar.\n\nAgora precisamos prevenir a recorrência.",
        vitals: { hr: 100, bp: "130/80", spo2: 95, resp: 18, temp: 37.0, status: "stable" },
        options: [
          { label: "Hidantalização (Fenitoína 20mg/kg) diluída em SF 0,9%", nextNodeId: "hidantal_ok", type: "medication" },
          { label: "Liberar para casa assim que acordar", nextNodeId: "discharge_seizure", type: "critical" }
        ]
      },
      "phenytoin_slow": {
        id: "phenytoin_slow",
        text: "A Fenitoína demora cerca de 20 minutos para infundir (risco de arritmia se rápido). Durante esse tempo, o paciente continuou convulsionando, sofrendo dano cerebral hipóxico.",
        vitals: { hr: 150, bp: "160/100", spo2: 80, resp: 0, temp: 37.5, status: "warning" },
        feedback: "A 1ª linha para PARAR a crise é sempre um Benzodiazepínico (ação rápida). A Fenitoína serve para evitar que ela volte.",
        options: [
          { label: "Fazer Diazepam agora", nextNodeId: "benzo_ok", type: "medication" },
          { label: "Aguardar o término da fenitoína", nextNodeId: "brain_damage", type: "critical" }
        ]
      },
      "brain_damage": {
          id: "brain_damage",
          text: "A crise durou 30 minutos. O paciente sofreu lesão cerebral hipóxica irreversível e aspiração pulmonar.",
          vitals: { hr: 140, bp: "180/100", spo2: 80, resp: 0, temp: 38.0, status: "critical" },
          options: []
      },
      "guedel_error": {
        id: "guedel_error",
        text: "Ao tentar forçar a abertura da boca no trismo, você quebrou dois dentes do paciente, que foram aspirados. A obstrução da via aérea piorou.",
        vitals: { hr: 160, bp: "180/110", spo2: 70, resp: 0, temp: 37.0, status: "critical" },
        feedback: "Nunca introduza objetos na boca durante a crise. Apenas lateralize a cabeça e proteja de traumas.",
        options: []
      },
      "hidantal_ok": {
        id: "hidantal_ok",
        text: "Dose de ataque realizada corretamente (em SF 0,9%, pois precipita em glicose). Paciente desperta confuso mas estável. Encaminhado para TC e avaliação neurológica.",
        vitals: { hr: 80, bp: "120/80", spo2: 98, resp: 16, temp: 37.0, status: "recovered" },
        options: []
      },
      "discharge_seizure": {
        id: "discharge_seizure",
        text: "O paciente teve nova crise na porta do hospital, bateu a cabeça e sofreu um TCE grave.",
        vitals: { hr: 100, bp: "120/80", spo2: 95, resp: 18, temp: 37.0, status: "critical" },
        feedback: "Status epilepticus exige investigação e observação hospitalar.",
        options: []
      }
    }
  },
  {
    id: "tep-pos-op",
    title: "Dispneia Súbita no Pós-Operatório",
    difficulty: "Avançado",
    category: "Clínica",
    description: "Paciente no 3º dia de pós-operatório de Artroplastia de Quadril apresenta falta de ar súbita e dor torácica.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Sr. Antônio, 70 anos, 3º DPO de Prótese de Quadril. Chama a enfermagem referindo falta de ar súbita e dor no peito ao respirar.\n\nExame: Pulmões LIMPOS à ausculta. Panturrilha direita empastada.\n\nSSVV: FC 120 | PA 100/60 | SpO2 86% | FR 30.",
        vitals: { hr: 120, bp: "100/60", spo2: 86, resp: 30, temp: 36.5, status: "warning" },
        options: [
          { label: "Oxigênio + Heparina (Suspeita de TEP)", nextNodeId: "heparin_start", type: "medication" },
          { label: "Furosemida IV (Suspeita de Edema Agudo)", nextNodeId: "lasix_error", type: "medication" },
          { label: "Nebulização com Berotec (Suspeita de Broncoespasmo)", nextNodeId: "nebulization_delay", type: "medication" }
        ]
      },
      "heparin_start": {
        id: "heparin_start",
        text: "A suspeita clínica de Tromboembolismo Pulmonar (TEP) foi precisa (DPO ortopédico + Dispneia súbita + Pulmão limpo + TVP provável).\n\nIniciada anticoagulação plena e O2. Paciente estabilizou SpO2 em 94%.",
        vitals: { hr: 100, bp: "110/70", spo2: 94, resp: 22, temp: 36.5, status: "stable" },
        options: [
          { label: "Encaminhar para Angiotomografia de Tórax (Confirmar)", nextNodeId: "angiotc_confirm", type: "assessment" },
          { label: "Adicionar AAS", nextNodeId: "bleeding_risk", type: "medication" }
        ]
      },
      "bleeding_risk": {
          id: "bleeding_risk",
          text: "AAS não é tratamento para TEP e aumenta risco de sangramento em pós-operatório. Mas a heparina evitou o pior.",
          vitals: { hr: 100, bp: "110/70", spo2: 94, resp: 22, temp: 36.5, status: "stable" },
          options: [
               { label: "Seguir para AngioTC", nextNodeId: "angiotc_confirm", type: "assessment" }
          ]
      },
      "lasix_error": {
        id: "lasix_error",
        text: "Você administrou diurético. Como não era congestão (pulmão estava limpo!), a volemia caiu.\n\nO TEP maciço depende de pré-carga para manter o débito do VD. O paciente fez hipotensão severa (Choque Obstrutivo).",
        vitals: { hr: 140, bp: "60/30", spo2: 80, resp: 40, temp: 36.5, status: "warning" },
        feedback: "Cuidado! Ausculta limpa com hipóxia grave sugere TEP, não EAP. Diurético pode ser fatal no TEP maciço.",
        options: [
          { label: "Volume rápido e Noradrenalina", nextNodeId: "shock_rescue", type: "intervention" },
          { label: "Dar mais Lasix", nextNodeId: "cardiac_arrest", type: "critical" }
        ]
      },
      "cardiac_arrest": {
          id: "cardiac_arrest",
          text: "Choque obstrutivo irreversível. PCR.",
          vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
          options: []
      },
      "nebulization_delay": {
        id: "nebulization_delay",
        text: "A nebulização não resolveu nada (não havia broncoespasmo). Durante o procedimento, o paciente piorou a hipóxia e evoluiu para PCR.",
        vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
        feedback: "Sibilos localizados podem ocorrer no TEP, mas 'pulmão limpo' com hipóxia grave é a chave.",
        options: []
      },
      "angiotc_confirm": {
        id: "angiotc_confirm",
        text: "AngioTC confirmou falha de enchimento na artéria pulmonar direita. O tratamento precoce evitou a progressão para choque e morte. O paciente teve alta após 10 dias anticoagulado.",
        vitals: { hr: 80, bp: "120/80", spo2: 96, resp: 16, temp: 36.5, status: "recovered" },
        options: []
      },
      "shock_rescue": {
        id: "shock_rescue",
        text: "O paciente foi estabilizado a duras penas na UTI e precisou de trombólise sistêmica (alto risco de sangramento na cirurgia do quadril). Sobreviveu com sequelas renais.",
        vitals: { hr: 110, bp: "90/60", spo2: 92, resp: 24, temp: 36.5, status: "recovered" },
        options: []
      }
    }
  },
  {
    id: "queda-anticoagulante",
    title: "Queda em Idoso Anticoagulado",
    difficulty: "Intermediário",
    category: "Urgência",
    description: "Paciente em uso de Varfarina cai no banheiro. Aparentemente está bem, mas o risco é invisível.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Sr. Pedro, 75 anos, FA crônica em uso de Varfarina (Marevan). Escorregou no banheiro e bateu a cabeça levemente. Chega caminhando, GCS 15.\n\nFamília pergunta se pode levá-lo para casa.",
        vitals: { hr: 80, bp: "140/80", spo2: 97, resp: 16, temp: 36.5, status: "stable" },
        options: [
          { label: "Dar alta com orientações de vigilância (GCS 15)", nextNodeId: "discharge_hematoma", type: "critical" },
          { label: "Manter em observação e solicitar TC de Crânio urgente", nextNodeId: "tc_scan_success", type: "assessment" }
        ]
      },
      "discharge_hematoma": {
        id: "discharge_hematoma",
        text: "O paciente foi para casa. Durante a noite, o pequeno sangramento subdural aumentou (devido à anticoagulação).\n\nEle foi encontrado torporoso pela manhã. Retornou com anisocoria e coma.",
        vitals: { hr: 50, bp: "190/110", spo2: 92, resp: 10, temp: 36.0, status: "critical" },
        feedback: "TCE em idoso anticoagulado é TC de Crânio obrigatória, mesmo com exame neurológico normal inicial.",
        options: []
      },
      "tc_scan_success": {
        id: "tc_scan_success",
        text: "A TC mostrou um pequeno hematoma subdural laminar. O INR estava 4.5 (supraterapêutico).\n\nO paciente foi internado para reversão da anticoagulação e monitorização. O hematoma não expandiu e ele teve alta segura em 48h.",
        vitals: { hr: 80, bp: "135/80", spo2: 98, resp: 16, temp: 36.5, status: "recovered" },
        options: []
      }
    }
  },
  {
    id: "extravasamento-quimio",
    title: "Extravasamento de Quimioterápico",
    difficulty: "Avançado",
    category: "Clínica",
    description: "Durante a infusão de Doxorrubicina (vesicante), paciente queixa-se de ardência no local do acesso.",
    initialNodeId: "start",
    nodes: {
      "start": {
        id: "start",
        text: "Paciente em quimioterapia ambulatorial recebendo Doxorrubicina (vesicante) em acesso periférico no dorso da mão. Refere queimação local.\n\nVocê observa edema leve e vermelhidão ao redor do cateter.",
        vitals: { hr: 88, bp: "120/80", spo2: 98, resp: 18, temp: 36.5, status: "stable" },
        options: [
          { label: "Lavar o acesso com 10ml de SF 0,9% para desobstruir", nextNodeId: "flush_error", type: "intervention" },
          { label: "Parar infusão, aspirar pelo cateter e retirar acesso", nextNodeId: "stop_aspirate", type: "intervention" },
          { label: "Diminuir a velocidade da infusão e observar", nextNodeId: "slow_error", type: "critical" }
        ]
      },
      "flush_error": {
        id: "flush_error",
        text: "Ao injetar soro ('flush'), você empurrou o quimioterápico vesicante para os tecidos vizinhos, aumentando a área de lesão.\n\nO paciente evoluiu com necrose extensa do dorso da mão e perda funcional.",
        vitals: { hr: 100, bp: "130/80", spo2: 98, resp: 20, temp: 36.5, status: "critical" },
        feedback: "NUNCA faça flush se houver suspeita de extravasamento. Isso espalha a droga.",
        options: []
      },
      "slow_error": {
        id: "slow_error",
        text: "O extravasamento continuou, mesmo que mais lento. A lesão tecidual se tornou irreversível.",
        vitals: { hr: 90, bp: "120/80", spo2: 98, resp: 18, temp: 36.5, status: "warning" },
        options: [
           { label: "Parar agora e aspirar", nextNodeId: "stop_aspirate", type: "intervention" },
           { label: "Aplicar calor local", nextNodeId: "necrosis_worsens", type: "critical" }
        ]
      },
      "necrosis_worsens": {
          id: "necrosis_worsens",
          text: "O calor vasodilatou e espalhou a doxorrubicina. A necrose foi catastrófica. (Doxorrubicina exige frio).",
          vitals: { hr: 100, bp: "120/80", spo2: 98, resp: 18, temp: 37.0, status: "critical" },
          options: []
      },
      "stop_aspirate": {
        id: "stop_aspirate",
        text: "Conduta correta! Você parou imediatamente, aspirou 3ml de sangue/droga residual e só então retirou o cateter.\n\nAplicou compressa fria (indicada para Doxorrubicina) e notificou o médico. A lesão foi mínima e cicatrizou bem.",
        vitals: { hr: 85, bp: "120/80", spo2: 99, resp: 16, temp: 36.5, status: "recovered" },
        feedback: "A aspiração tenta remover o máximo da droga vesicante antes que ela se espalhe.",
        options: []
      }
    }
  }
];