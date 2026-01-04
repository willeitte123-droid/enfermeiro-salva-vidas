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
  category: "Urgência" | "UTI" | "Clínica" | "Pediatria";
  description: string;
  initialNodeId: string;
  nodes: Record<string, CaseNode>;
}

export const CLINICAL_CASES: ClinicalCase[] = [
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
        text: "O ECG é impresso em menos de 10 minutos (Meta Atingida!).\n\nResultado: Supradesnivelamento do segmento ST de 3mm em DII, DIII e aVF.\n\nDiagnóstico: IAM com Supra de ST (Parede Inferior).",
        vitals: { hr: 112, bp: "150/90", spo2: 94, resp: 22, temp: 36.5, status: "critical" },
        options: [
          { label: "Iniciar Protocolo MONAB e preparar para Angioplastia/Trombólise", nextNodeId: "monab_success", type: "critical" },
          { label: "Aguardar resultado da Troponina para confirmar", nextNodeId: "wait_troponin", type: "assessment" }
        ]
      },
      "access_done": {
        id: "access_done",
        text: "Acesso garantido e exames coletados. Porém, o ECG ainda não foi feito e o tempo porta-eletro estourou (> 10 min).\n\nO paciente volta a queixar-se de piora da dor.",
        vitals: { hr: 115, bp: "165/105", spo2: 93, resp: 24, temp: 36.5, status: "warning" },
        options: [
          { label: "Realizar ECG agora", nextNodeId: "ecg_done", type: "assessment" }
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
    "id": "choque-septico",
    "title": "Paciente Hipotenso na UTI",
    "difficulty": "Avançado",
    "category": "UTI",
    "description": "Paciente internado por pneumonia evolui com rebaixamento do nível de consciência e hipotensão. Manejo do Choque Séptico.",
    "initialNodeId": "start",
    "nodes": {
      "start": {
        id: "start",
        text: "Dona Maria, 72 anos, D5 de internação por Pneumonia. O técnico chama você: 'A paciente está estranha, sonolenta e a pressão caiu'.\n\nAo exame: Sonolenta, pele quente, tempo de enchimento capilar 4 seg.\n\nSSVV: PA 80/40 mmHg | FC 125 bpm | SpO2 88% | Tax 38.5°C.",
        vitals: { hr: 125, bp: "80/40", spo2: 88, resp: 28, temp: 38.5, status: "critical" },
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
          { label: "Realizar expansão volêmica agora + Coletar Lactato/Culturas", nextNodeId: "late_rescue", type: "intervention" }
        ]
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
        vitals: { hr: 100, bp: "110/70", spo2: 95, resp: 20, temp: 37.5, status: "stable" },
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
        text: "Pedro, 6 anos, trazido pela mãe. Histórico de asma. Há 2 dias com tosse, hoje piorou o cansaço.\n\nExame: Tiragem subcostal, batimento de asa de nariz, sibilância difusa, fala entrecortada.\n\nSSVV: FC 140 bpm | FR 40 irpm | SpO2 89% (ar ambiente) | Temp 37.0°C.",
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
        text: "Você optou por intubar uma criança em crise asmática sem tentar resgate farmacológico.\n\nDurante o procedimento, houve laringoespasmo grave e hipóxia profunda, evoluindo para bradicardia e parada.",
        vitals: { hr: 40, bp: "50/30", spo2: 60, resp: 0, temp: 36.5, status: "critical" },
        feedback: "A IOT na asma é a última linha (falência respiratória iminente ou PCR). É um procedimento de altíssimo risco devido ao aprisionamento de ar e acidose.",
        options: [
           { label: "Iniciar RCP", nextNodeId: "cpr_asthma", type: "intervention" }
        ]
      },
      "cpr_asthma": {
          id: "cpr_asthma",
          text: "Apesar dos esforços, a acidose grave e o barotrauma dificultaram a reanimação. Desfecho desfavorável.",
          vitals: { hr: 0, bp: "0/0", spo2: 0, resp: 0, temp: 36.0, status: "dead" },
          options: []
      },
      "delay_exam": {
          id: "delay_exam",
          text: "Você enviou a criança instável para o Raio-X. No caminho, a hipóxia piorou.\n\nO tratamento da asma é clínico e imediato. Exames não devem atrasar o broncodilatador.",
          vitals: { hr: 160, bp: "90/50", spo2: 82, resp: 50, temp: 37.0, status: "critical" },
          options: [
              { label: "Retornar e iniciar protocolo de asma grave agora", nextNodeId: "beta2_o2", type: "intervention" }
          ]
      },
      "stop_meds": {
          id: "stop_meds",
          text: "Você suspendeu o tratamento precocemente. O efeito do broncodilatador passou e a obstrução retornou pior (efeito rebote).",
          vitals: { hr: 150, bp: "95/55", spo2: 85, resp: 45, temp: 37.0, status: "critical" },
          options: [
               { label: "Reiniciar protocolo agressivo + Magnésio IV", nextNodeId: "corticoid_added", type: "intervention" }
          ]
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
          text: "Você fez insulina sem hidratar e sem ver o potássio. A glicemia caiu rápido, mas a desidratação persistiu e o risco de hipocalemia não foi avaliado.\n\nO paciente hipotendeu e fez uma arritmia.",
          vitals: { hr: 140, bp: "70/40", spo2: 90, resp: 30, temp: 36.5, status: "critical" },
          options: [
              { label: "Suspender insulina, Volume + K+", nextNodeId: "hydration", type: "intervention" }
          ]
      },
      "bicarb_error": {
          id: "bicarb_error",
          text: "O uso de Bicarbonato na CAD só é indicado se pH < 6.9. O uso desnecessário piora a acidose intracelular e o edema cerebral.\n\nO paciente rebaixou o nível de consciência.",
          vitals: { hr: 110, bp: "100/60", spo2: 95, resp: 12, temp: 36.5, status: "critical" },
          feedback: "Bicarbonato não é tratamento de rotina para cetoacidose.",
          options: [
               { label: "Focar na Hidratação e Insulina", nextNodeId: "hydration", type: "intervention" }
          ]
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
        vitals: { hr: 140, bp: "70/40", spo2: 88, resp: 28, temp: 35.5, status: "critical" },
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
          vitals: { hr: 150, bp: "60/30", spo2: 85, resp: 30, temp: 35.5, status: "critical" },
          options: [
              { label: "Reaplicar torniquete e correr para CC", nextNodeId: "torniquete", type: "intervention" }
          ]
      }
    }
  }
];