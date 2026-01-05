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
  category: "Urgência" | "UTI" | "Clínica" | "Pediatria" | "Obstetrícia";
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
        vitals: { hr: 118, bp: "125/75", spo2: 96, resp: 20, temp: 36.0, status: "critical" },
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
          { label: "Realizar Glicose IV agora", nextNodeId: "glucose_iv", type: "medication" }
        ]
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
          { label: "Retomar volume e considerar vasopressor se necessário", nextNodeId: "sepsis_bundle", type: "intervention" }
        ]
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
        vitals: { hr: 110, bp: "90/60", spo2: 96, resp: 20, temp: 36.5, status: "critical" },
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
        vitals: { hr: 140, bp: "70/40", spo2: 90, resp: 30, temp: 36.0, status: "critical" },
        options: [
          { label: "Iniciar protocolo de Transfusão Maciça e Massagem agora", nextNodeId: "late_rescue_hpp", type: "intervention" }
        ]
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
           { label: "Escalonar para Misoprostol/Ergotamina", nextNodeId: "second_line_meds", type: "medication" }
        ]
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
        vitals: { hr: 90, bp: "190/100", spo2: 96, resp: 18, temp: 36.5, status: "critical" },
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
        vitals: { hr: 130, bp: "80/50", spo2: 92, resp: 24, temp: 38.8, status: "critical" },
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
          { label: "Enviar bolsa e amostras de sangue/urina ao laboratório", nextNodeId: "investigation", type: "assessment" }
        ]
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
        vitals: { hr: 130, bp: "80/50", spo2: 85, resp: 32, temp: 36.5, status: "critical" },
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
        vitals: { hr: 140, bp: "60/40", spo2: 80, resp: 40, temp: 36.5, status: "critical" },
        options: [
          { label: "Puncionar novamente", nextNodeId: "needle_decompression", type: "intervention" }
        ]
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
        vitals: { hr: 130, bp: "140/90", spo2: 88, resp: 0, temp: 37.0, status: "critical" },
        options: [
          { label: "Administrar Diazepam 10mg IV lento (1ª Linha)", nextNodeId: "benzo_ok", type: "medication" },
          { label: "Administrar Fenitoína IV direto (2ª Linha)", nextNodeId: "phenytoin_slow", type: "medication" },
          { label: "Colocar cânula de Guedel à força para abrir a boca", nextNodeId: "guedel_error", type: "intervention" }
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
        vitals: { hr: 150, bp: "160/100", spo2: 80, resp: 0, temp: 37.5, status: "critical" },
        feedback: "A 1ª linha para PARAR a crise é sempre um Benzodiazepínico (ação rápida). A Fenitoína serve para evitar que ela volte.",
        options: [
          { label: "Fazer Diazepam agora", nextNodeId: "benzo_ok", type: "medication" }
        ]
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
        vitals: { hr: 120, bp: "100/60", spo2: 86, resp: 30, temp: 36.5, status: "critical" },
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
          { label: "Encaminhar para Angiotomografia de Tórax (Confirmar)", nextNodeId: "angiotc_confirm", type: "assessment" }
        ]
      },
      "lasix_error": {
        id: "lasix_error",
        text: "Você administrou diurético. Como não era congestão (pulmão estava limpo!), a volemia caiu.\n\nO TEP maciço depende de pré-carga para manter o débito do VD. O paciente fez hipotensão severa (Choque Obstrutivo).",
        vitals: { hr: 140, bp: "60/30", spo2: 80, resp: 40, temp: 36.5, status: "critical" },
        feedback: "Cuidado! Ausculta limpa com hipóxia grave sugere TEP, não EAP. Diurético pode ser fatal no TEP maciço.",
        options: [
          { label: "Volume rápido e Noradrenalina", nextNodeId: "shock_rescue", type: "intervention" }
        ]
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
        vitals: { hr: 110, bp: "90/60", spo2: 92, resp: 24, temp: 36.5, status: "warning" },
        options: []
      }
    }
  }
];