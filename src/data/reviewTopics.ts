import { LucideIcon, Baby, User, Syringe, Heart, Users, ShieldCheck } from "lucide-react";

export interface ReviewTopic {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  summary: string;
  details: {
    subtitle: string;
    points: string[];
  }[];
}

export const reviewTopics: ReviewTopic[] = [
  {
    id: "child-health",
    title: "Saúde da Criança",
    icon: Baby,
    color: "text-pink-500",
    summary: "Acompanhamento do crescimento e desenvolvimento infantil, da sala de parto à puericultura.",
    details: [
      {
        subtitle: "Puericultura",
        points: [
          "<strong>Objetivo:</strong> Acompanhar o crescimento e desenvolvimento, orientar a família e prevenir agravos.",
          "<strong>Avaliação:</strong> Medir peso, altura e perímetro cefálico e plotar nas curvas de crescimento.",
          "<strong>Marcos do Desenvolvimento:</strong> Avaliar marcos motores, de linguagem e sociais para a idade (ex: sustentar a cabeça, sentar, andar, primeiras palavras).",
          "<strong>Alimentação:</strong> Aleitamento materno exclusivo até os 6 meses, introdução alimentar complementar a partir dos 6 meses."
        ]
      },
      {
        subtitle: "Triagem Neonatal",
        points: [
          "<strong>Teste do Pezinho:</strong> Coleta entre o 3º e 5º dia de vida para detectar doenças metabólicas (fenilcetonúria, hipotireoidismo congênito, etc.).",
          "<strong>Teste do Olhinho:</strong> Busca do reflexo vermelho para detectar precocemente catarata congênita, retinoblastoma.",
          "<strong>Teste da Orelhinha:</strong> Emissões otoacústicas para triagem de surdez.",
          "<strong>Teste do Coraçãozinho:</strong> Oximetria de pulso para triagem de cardiopatias congênitas críticas."
        ]
      }
    ]
  },
  {
    id: "adolescent-health",
    title: "Saúde do Adolescente",
    icon: User,
    color: "text-blue-500",
    summary: "Abordagem integral do adolescente, considerando as transformações físicas, psíquicas e sociais.",
    details: [
      {
        subtitle: "Principais Eixos",
        points: [
          "<strong>Crescimento e Desenvolvimento:</strong> Avaliação do estadiamento puberal (Escala de Tanner).",
          "<strong>Saúde Sexual e Reprodutiva:</strong> Orientação sobre métodos contraceptivos, prevenção de ISTs e gravidez não planejada.",
          "<strong>Saúde Mental:</strong> Rastreio de ansiedade, depressão e ideação suicida. Abordagem de bullying e transtornos alimentares.",
          "<strong>Uso de Substâncias:</strong> Prevenção e abordagem do uso de álcool, tabaco e outras drogas.",
          "<strong>Direito ao Sigilo:</strong> Garantir um espaço de confiança e confidencialidade, exceto em situações de risco para si ou para outros."
        ]
      }
    ]
  },
  {
    id: "vaccination-schedule",
    title: "Calendário Vacinal 2024",
    icon: Syringe,
    color: "text-green-500",
    summary: "Principais vacinas do Programa Nacional de Imunizações (PNI) para crianças e adolescentes.",
    details: [
      {
        subtitle: "Crianças",
        points: [
          "<strong>Ao nascer:</strong> BCG e Hepatite B.",
          "<strong>2 meses:</strong> Pentavalente, VIP (Poliomielite), Pneumocócica 10V, Rotavírus.",
          "<strong>3 meses:</strong> Meningocócica C.",
          "<strong>4 meses:</strong> Pentavalente, VIP, Pneumocócica 10V, Rotavírus (2ª dose de cada).",
          "<strong>5 meses:</strong> Meningocócica C (2ª dose).",
          "<strong>6 meses:</strong> Pentavalente, VIP (3ª dose de cada).",
          "<strong>9 meses:</strong> Febre Amarela.",
          "<strong>12 meses:</strong> Tríplice Viral (SCR), Pneumocócica 10V (reforço), Meningocócica C (reforço).",
          "<strong>15 meses:</strong> DTP (Tríplice Bacteriana), VOP (Poliomielite), Hepatite A, Tetra Viral (SCR + Varicela)."
        ]
      },
      {
        subtitle: "Adolescentes (10 a 19 anos)",
        points: [
          "<strong>HPV:</strong> Para meninas e meninos de 9 a 14 anos (2 doses).",
          "<strong>Meningocócica ACWY:</strong> Dose única ou reforço para adolescentes de 11 a 14 anos.",
          "<strong>dT (Dupla Adulto):</strong> Reforço a cada 10 anos.",
          "<strong>Febre Amarela:</strong> Verificar necessidade de dose de reforço.",
          "<strong>Tríplice Viral (SCR):</strong> Duas doses até os 19 anos."
        ]
      }
    ]
  },
  {
    id: "womens-health",
    title: "Saúde da Mulher",
    icon: Heart,
    color: "text-purple-500",
    summary: "Cuidados essenciais no pré-natal e na prevenção de cânceres ginecológicos.",
    details: [
      {
        subtitle: "Pré-Natal de Baixo Risco",
        points: [
          "<strong>Objetivo:</strong> Assegurar o bem-estar materno e fetal.",
          "<strong>Consultas:</strong> Mínimo de 6 consultas, sendo a primeira no 1º trimestre.",
          "<strong>Exames Essenciais:</strong> Tipagem sanguínea, hemograma, glicemia, VDRL, anti-HIV, Hepatite B e C, toxoplasmose, urina tipo I.",
          "<strong>Imunização:</strong> dTpa, Hepatite B, Influenza."
        ]
      },
      {
        subtitle: "Prevenção de Câncer",
        points: [
          "<strong>Câncer de Colo de Útero:</strong> Rastreamento com Papanicolau em mulheres de 25 a 64 anos. Prevenção primária com vacina HPV.",
          "<strong>Câncer de Mama:</strong> Rastreamento com mamografia bienal para mulheres de 50 a 69 anos. Exame clínico das mamas em todas as consultas."
        ]
      }
    ]
  },
  {
    id: "has-dm",
    title: "HAS e DM",
    icon: Users,
    color: "text-orange-500",
    summary: "Conceitos e cuidados fundamentais na Hipertensão Arterial Sistêmica e Diabetes Mellitus.",
    details: [
      {
        subtitle: "Hipertensão Arterial (HAS)",
        points: [
          "<strong>Diagnóstico:</strong> Média de duas ou mais aferições de PA ≥ 140/90 mmHg em duas ou mais consultas.",
          "<strong>Cuidado de Enfermagem:</strong> Orientação sobre dieta hipossódica, atividade física, controle de peso, adesão ao tratamento medicamentoso e monitoramento da PA."
        ]
      },
      {
        subtitle: "Diabetes Mellitus (DM)",
        points: [
          "<strong>Diagnóstico:</strong> Glicemia de jejum ≥ 126 mg/dL, HbA1c ≥ 6,5%, ou glicemia casual ≥ 200 mg/dL com sintomas.",
          "<strong>Cuidado de Enfermagem:</strong> Educação em saúde (alimentação, exercício, automonitoramento), orientação sobre o uso de medicamentos (insulina, antidiabéticos orais), e exame dos pés para prevenção de complicações."
        ]
      }
    ]
  },
  {
    id: "sus-principles",
    title: "Princípios do SUS",
    icon: ShieldCheck,
    color: "text-indigo-500",
    summary: "A base doutrinária e organizativa do Sistema Único de Saúde.",
    details: [
      {
        subtitle: "Princípios Doutrinários (Ideológicos)",
        points: [
          "<strong>Universalidade:</strong> A saúde é um direito de todos e dever do Estado. O acesso aos serviços de saúde deve ser garantido a todas as pessoas.",
          "<strong>Equidade:</strong> Tratar os desiguais de forma desigual, investindo mais onde a carência é maior, para diminuir as desigualdades.",
          "<strong>Integralidade:</strong> O indivíduo deve ser visto como um todo. As ações de saúde devem abranger a promoção, prevenção, tratamento e reabilitação."
        ]
      },
      {
        subtitle: "Princípios Organizativos (Diretrizes)",
        points: [
          "<strong>Regionalização e Hierarquização:</strong> Organização dos serviços em níveis de complexidade (primário, secundário, terciário) dentro de uma região de saúde.",
          "<strong>Descentralização:</strong> Redistribuição de poder e responsabilidades entre as três esferas de governo (União, Estados e Municípios).",
          "<strong>Participação Social:</strong> A comunidade participa da gestão do SUS através dos Conselhos e Conferências de Saúde."
        ]
      }
    ]
  }
];