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
  }
];