export interface VideoLesson {
  id: string; // YouTube ID
  title: string;
  author: string;
  category: "Destaques" | "Urgência e Emergência" | "Farmacologia" | "Anatomia" | "Procedimentos";
  duration?: string;
}

export const VIDEO_LIBRARY: VideoLesson[] = [
  // Destaques
  {
    id: "v8qR7_tVwXw",
    title: "Gasometria Arterial: Interpretando sem Medo",
    author: "Enfermagem Ilustrada",
    category: "Destaques",
    duration: "15:20"
  },
  {
    id: "gK6_wg8tFmE",
    title: "Cálculo de Medicação: Regra de Três Simples",
    author: "Prof. Diego",
    category: "Destaques",
    duration: "12:45"
  },
  {
    id: "Xz5z1x4y3z", // ID Fictício para exemplo visual, troque por reais se necessário
    title: "Sinais Vitais: Aferição Correta",
    author: "Prática de Enfermagem",
    category: "Destaques",
    duration: "18:10"
  },
  
  // Urgência e Emergência
  {
    id: "3e123abc", 
    title: "PCR: Atualização AHA 2020/2025",
    author: "Instituto Brasileiro de APH",
    category: "Urgência e Emergência",
    duration: "25:00"
  },
  {
    id: "3892183",
    title: "Manejo do Choque Hipovolêmico",
    author: "Emergência Rules",
    category: "Urgência e Emergência",
    duration: "14:30"
  },
  {
    id: "1230912",
    title: "Intubação em Sequência Rápida",
    author: "Medicina de Emergência",
    category: "Urgência e Emergência",
    duration: "20:15"
  },

  // Farmacologia
  {
    id: "farm1",
    title: "Drogas Vasoativas na UTI",
    author: "Enf. Intensiva",
    category: "Farmacologia",
    duration: "30:00"
  },
  {
    id: "farm2",
    title: "Antibióticos: Classes e Cuidados",
    author: "Farmacologia Fácil",
    category: "Farmacologia",
    duration: "22:10"
  },
  {
    id: "farm3",
    title: "Diluição de Noradrenalina",
    author: "Prática Hospitalar",
    category: "Farmacologia",
    duration: "08:50"
  },

  // Anatomia
  {
    id: "anat1",
    title: "Anatomia Cardíaca: O Fluxo Sanguíneo",
    author: "Anatomia Fácil",
    category: "Anatomia",
    duration: "16:40"
  },
  {
    id: "anat2",
    title: "Sistema Respiratório Completo",
    author: "Bio Explica",
    category: "Anatomia",
    duration: "45:00"
  },

  // Procedimentos
  {
    id: "proc1",
    title: "Sondagem Vesical de Demora (SVD)",
    author: "Procedimentos Enf",
    category: "Procedimentos",
    duration: "12:00"
  },
  {
    id: "proc2",
    title: "Punção Venosa Periférica: Passo a Passo",
    author: "Enfermagem na Veia",
    category: "Procedimentos",
    duration: "10:30"
  },
  {
    id: "proc3",
    title: "Curativo de Lesão por Pressão",
    author: "Wound Care",
    category: "Procedimentos",
    duration: "15:45"
  }
];