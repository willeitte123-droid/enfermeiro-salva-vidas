import { LucideIcon, Baby, User, Syringe, Heart, Users, ShieldCheck, ShieldAlert, Gavel, Calculator as CalculatorIcon, BrainCircuit, PersonStanding } from "lucide-react";

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
        subtitle: "Recepção do Recém-Nascido (RN)",
        points: [
          "<strong>Índice de Apgar:</strong> Avaliado no 1º e 5º minuto. Avalia Frequência Cardíaca, Esforço Respiratório, Tônus Muscular, Irritabilidade Reflexa e Cor. Nota 7-10: Boa vitalidade.",
          "<strong>Cuidados Imediatos:</strong> Manter aquecido, aspirar vias aéreas (se necessário), laquear o coto umbilical, profilaxia da oftalmia neonatal (Credé), administrar Vitamina K.",
          "<strong>Classificação do RN:</strong> Pelo peso: Baixo peso (&lt;2500g), Muito baixo peso (&lt;1500g), Extremo baixo peso (&lt;1000g). Pela Idade Gestacional: Pré-termo (&lt;37 sem), A termo (37-41 sem), Pós-termo (≥42 sem)."
        ]
      },
      {
        subtitle: "Puericultura e Triagem Neonatal",
        points: [
          "<strong>Puericultura:</strong> Acompanhar curvas de crescimento (peso, altura, PC), marcos do desenvolvimento, alimentação (aleitamento materno exclusivo até 6 meses) e imunização.",
          "<strong>Teste do Pezinho:</strong> Coleta entre o 3º e 5º dia de vida para detectar doenças metabólicas (fenilcetonúria, hipotireoidismo congênito, etc.).",
          "<strong>Testes Adicionais:</strong> Olhinho (reflexo vermelho), Orelhinha (emissões otoacústicas), Coraçãozinho (oximetria de pulso)."
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
        subtitle: "Principais Eixos de Cuidado",
        points: [
          "<strong>Crescimento e Desenvolvimento:</strong> Avaliação do estadiamento puberal (Escala de Tanner).",
          "<strong>Saúde Sexual e Reprodutiva:</strong> Orientação sobre métodos contraceptivos, prevenção de ISTs e gravidez não planejada. Abordagem confidencial.",
          "<strong>Saúde Mental:</strong> Rastreio de ansiedade, depressão, ideação suicida, bullying e transtornos alimentares.",
          "<strong>Vulnerabilidades:</strong> Prevenção e abordagem do uso de álcool/drogas, violência e acidentes.",
          "<strong>Direito ao Sigilo:</strong> Garantir um espaço de confiança e confidencialidade, exceto em situações de risco iminente para si ou para outros."
        ]
      }
    ]
  },
  {
    id: "vaccination-schedule",
    title: "Calendário Vacinal 2024",
    icon: Syringe,
    color: "text-green-500",
    summary: "Principais vacinas do PNI para crianças, adolescentes, gestantes e idosos.",
    details: [
      {
        subtitle: "Crianças",
        points: [
          "<strong>Ao nascer:</strong> BCG e Hepatite B.",
          "<strong>2, 4, 6 meses:</strong> Pentavalente, VIP (Pólio), Pneumo 10V (2,4m), Rotavírus (2,4m).",
          "<strong>3, 5 meses:</strong> Meningo C.",
          "<strong>9 meses:</strong> Febre Amarela.",
          "<strong>12 meses:</strong> Tríplice Viral (SCR), Reforços de Pneumo 10V e Meningo C.",
          "<strong>15 meses:</strong> DTP (reforço), VOP (Pólio), Hepatite A, Tetra Viral (SCR + Varicela)."
        ]
      },
      {
        subtitle: "Adolescentes (10 a 19 anos)",
        points: [
          "<strong>HPV:</strong> Para meninas e meninos de 9 a 14 anos (2 doses).",
          "<strong>Meningocócica ACWY:</strong> Dose única ou reforço para 11 a 14 anos.",
          "<strong>dT (Dupla Adulto):</strong> Reforço a cada 10 anos.",
          "<strong>Febre Amarela e Tríplice Viral:</strong> Verificar situação vacinal e completar esquema."
        ]
      },
      {
        subtitle: "Gestantes e Idosos",
        points: [
          "<strong>Gestantes:</strong> dT, dTpa (a partir da 20ª semana), Hepatite B (se não imunizada), Influenza.",
          "<strong>Idosos:</strong> Influenza (anual), Pneumocócica 23V, dT (reforço a cada 10 anos)."
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
          "<strong>Consultas:</strong> Mínimo de 6. Mensais até 28 sem, quinzenais de 28-36 sem, semanais após 36 sem.",
          "<strong>Exames 1º Trimestre:</strong> Tipagem sanguínea/Fator Rh, Coombs Indireto (se Rh-), Hemograma, Glicemia de jejum, VDRL, HIV, HBsAg, Toxoplasmose, Urina I e Urocultura.",
          "<strong>Exames 2º Trimestre:</strong> Teste de tolerância à glicose (24-28 sem).",
          "<strong>Exames 3º Trimestre:</strong> Repetir Hemograma, Glicemia, VDRL, HIV, HBsAg. Pesquisa de Streptococcus do grupo B (35-37 sem).",
          "<strong>Imunização:</strong> dTpa, Hepatite B, Influenza."
        ]
      },
      {
        subtitle: "Prevenção de Câncer",
        points: [
          "<strong>Câncer de Colo de Útero:</strong> Rastreamento com Papanicolau em mulheres de 25 a 64 anos. Início aos 25 anos, os dois primeiros anuais, se normais, a cada 3 anos.",
          "<strong>Câncer de Mama:</strong> Rastreamento com mamografia bienal para mulheres de 50 a 69 anos. Exame clínico anual a partir dos 40 anos."
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
          "<strong>Classificação:</strong> Normal (&lt;120x80), Pré-Hipertensão (121-139 / 81-89), Estágio 1 (140-159 / 90-99), Estágio 2 (≥160 / ≥100).",
          "<strong>Cuidado de Enfermagem:</strong> Orientar dieta hipossódica, atividade física, controle de peso, adesão medicamentosa e monitoramento da PA."
        ]
      },
      {
        subtitle: "Diabetes Mellitus (DM)",
        points: [
          "<strong>Tipos:</strong> DM1 (autoimune, insulinodependente), DM2 (resistência à insulina), Gestacional.",
          "<strong>Diagnóstico:</strong> Glicemia de jejum ≥ 126, HbA1c ≥ 6,5%, ou Glicemia casual ≥ 200 com sintomas.",
          "<strong>Hipoglicemia (&lt;70 mg/dL):</strong> Se consciente, aplicar a 'Regra dos 15' (15g de carboidrato simples, reavaliar em 15 min). Se inconsciente, Glicose 50% IV ou Glucagon IM.",
          "<strong>Cuidado de Enfermagem:</strong> Educação em saúde, orientação sobre medicamentos, automonitoramento e exame dos pés."
        ]
      }
    ]
  },
  {
    id: "patient-safety",
    title: "Segurança do Paciente",
    icon: ShieldAlert,
    color: "text-yellow-500",
    summary: "As 6 Metas Internacionais de Segurança do Paciente, essenciais para a qualidade do cuidado.",
    details: [
      {
        subtitle: "As 6 Metas Internacionais",
        points: [
          "<strong>1. Identificar Corretamente os Pacientes:</strong> Usar no mínimo dois identificadores (nome completo e data de nascimento).",
          "<strong>2. Melhorar a Comunicação Efetiva:</strong> Registrar e ler de volta resultados de exames críticos. Usar padronização (ex: SBAR).",
          "<strong>3. Melhorar a Segurança de Medicamentos de Alta Vigilância:</strong> Padronizar diluições, dupla checagem, identificar corretamente.",
          "<strong>4. Assegurar Cirurgia Segura:</strong> Realizar checklist de segurança cirúrgica (antes, durante e após). Demarcação de lateralidade.",
          "<strong>5. Reduzir o Risco de Infecções Associadas aos Cuidados de Saúde:</strong> Higienização das mãos como pilar central.",
          "<strong>6. Reduzir o Risco de Lesões por Queda e Lesão por Pressão:</strong> Aplicar escalas de risco (Morse, Braden) e implementar planos de prevenção."
        ]
      }
    ]
  },
  {
    id: "ethics-legislation",
    title: "Ética e Legislação",
    icon: Gavel,
    color: "text-gray-500",
    summary: "Pilares do Código de Ética dos Profissionais de Enfermagem (CEPE).",
    details: [
      {
        subtitle: "Direitos, Deveres e Proibições",
        points: [
          "<strong>Direitos:</strong> Exercer a enfermagem com autonomia, ter acesso a informações para o cuidado, recusar-se a executar atividades que não sejam de sua competência.",
          "<strong>Deveres:</strong> Assegurar ao paciente uma assistência livre de danos (imprudência, negligência, imperícia), respeitar o pudor e a privacidade, registrar as informações no prontuário.",
          "<strong>Proibições:</strong> Negar assistência em situação de urgência/emergência, administrar medicamento sem conhecer a ação da droga, assinar ações que não executou.",
          "<strong>Imperícia:</strong> Falta de habilidade técnica. <strong>Imprudência:</strong> Ação precipitada. <strong>Negligência:</strong> Falta de cuidado, omissão."
        ]
      }
    ]
  },
  {
    id: "medication-calculation",
    title: "Cálculo de Medicação (Teoria)",
    icon: CalculatorIcon,
    color: "text-cyan-500",
    summary: "As fórmulas essenciais para a administração segura de medicamentos.",
    details: [
      {
        subtitle: "Fórmulas Essenciais",
        points: [
          "<strong>Dose Simples (Regra de Três):</strong> (Prescrição / Apresentação) x Volume. Ex: Prescrito 500mg, disponível 1g em 10mL. (500mg / 1000mg) x 10mL = 5mL.",
          "<strong>Gotejamento (Gotas/min):</strong> Volume Total (mL) / (Tempo (h) x 3).",
          "<strong>Gotejamento (Microgotas/min):</strong> Volume Total (mL) / Tempo (h).",
          "<strong>Relações Importantes:</strong> 1g = 1000mg; 1mg = 1000mcg; 1mL = 20 gotas; 1mL = 60 microgotas; 1 gota = 3 microgotas."
        ]
      }
    ]
  },
  {
    id: "mental-health",
    title: "Saúde Mental (RAPS)",
    icon: BrainCircuit,
    color: "text-teal-500",
    summary: "A estrutura da Rede de Atenção Psicossocial no SUS.",
    details: [
      {
        subtitle: "Componentes da RAPS",
        points: [
          "<strong>Atenção Básica:</strong> Acolhimento e cuidado inicial, através das Unidades Básicas de Saúde (UBS).",
          "<strong>Atenção Especializada (CAPS):</strong> Centros de Atenção Psicossocial são os ordenadores do cuidado. <ul><li><strong>CAPS I:</strong> Cidades com &gt; 15 mil hab.</li><li><strong>CAPS II:</strong> Cidades com &gt; 70 mil hab.</li><li><strong>CAPS III:</strong> Cidades com &gt; 150 mil hab. (funciona 24h).</li><li><strong>CAPSi:</strong> Atende crianças e adolescentes.</li><li><strong>CAPSad:</strong> Focado em álcool e outras drogas.</li></ul>",
          "<strong>Urgência e Emergência:</strong> SAMU 192, UPA 24h, leitos de saúde mental em hospitais gerais.",
          "<strong>Atenção Hospitalar:</strong> Enfermarias especializadas em Hospital Geral.",
          "<strong>Estratégias de Desinstitucionalização:</strong> Serviços Residenciais Terapêuticos (SRT)."
        ]
      }
    ]
  },
  {
    id: "elderly-health",
    title: "Saúde do Idoso",
    icon: PersonStanding,
    color: "text-lime-500",
    summary: "Foco na manutenção da capacidade funcional e prevenção de agravos.",
    details: [
      {
        subtitle: "Avaliação Multidimensional",
        points: [
          "<strong>Capacidade Funcional:</strong> É o principal indicador de saúde do idoso. Avaliada por: <ul><li><strong>ABVD:</strong> Atividades Básicas de Vida Diária (comer, vestir-se, banhar-se).</li><li><strong>AIVD:</strong> Atividades Instrumentais de Vida Diária (usar telefone, preparar refeições, gerenciar finanças).</li></ul>",
          "<strong>Polifarmácia:</strong> Uso de 5 ou mais medicamentos. Aumenta o risco de reações adversas e interações.",
          "<strong>Prevenção de Quedas:</strong> Avaliar risco (equilíbrio, marcha, visão) e orientar sobre ambiente seguro.",
          "<strong>Caderneta de Saúde da Pessoa Idosa:</strong> Instrumento para registro e acompanhamento integral."
        ]
      }
    ]
  },
  {
    id: "sus-principles",
    title: "Princípios do SUS",
    icon: ShieldCheck,
    color: "text-indigo-500",
    summary: "A base doutrinária, organizativa e os atributos da Atenção Primária do SUS.",
    details: [
      {
        subtitle: "Princípios Doutrinários (Ideológicos)",
        points: [
          "<strong>Universalidade:</strong> A saúde é um direito de todos e dever do Estado.",
          "<strong>Equidade:</strong> Tratar os desiguais de forma desigual, investindo mais onde a carência é maior.",
          "<strong>Integralidade:</strong> Ações de promoção, prevenção, tratamento e reabilitação, vendo o indivíduo como um todo."
        ]
      },
      {
        subtitle: "Princípios Organizativos (Diretrizes)",
        points: [
          "<strong>Regionalização e Hierarquização:</strong> Organização dos serviços em níveis de complexidade (primário, secundário, terciário).",
          "<strong>Descentralização:</strong> Redistribuição de poder e responsabilidades entre União, Estados e Municípios.",
          "<strong>Participação Social:</strong> Através dos Conselhos e Conferências de Saúde."
        ]
      },
      {
        subtitle: "Atributos da Atenção Primária (APS)",
        points: [
          "<strong>Acesso de Primeiro Contato:</strong> Ser a porta de entrada preferencial do sistema.",
          "<strong>Longitudinalidade:</strong> Acompanhamento do paciente ao longo do tempo.",
          "<strong>Integralidade:</strong> Oferta de uma gama de serviços que atendam às necessidades mais comuns.",
          "<strong>Coordenação do Cuidado:</strong> Organizar o fluxo do paciente pela rede de atenção."
        ]
      }
    ]
  }
];