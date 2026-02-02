export interface VideoLesson {
  id: string; // YouTube ID
  title: string;
  author: string;
  category: string;
  duration?: string;
}

export const VIDEO_LIBRARY: VideoLesson[] = [
  // Legislação do SUS
  {
    id: "cL8FD8mSG0I",
    title: "Desmistificando a Legislação do SUS para Concursos",
    author: "Enfermagem para Concursos",
    category: "Legislação do SUS",
    duration: "Aprox. 25 min"
  },
  {
    id: "jHMqEVgDjd8",
    title: "Princípios e Diretrizes do SUS",
    author: "Enfermagem para Concursos",
    category: "Legislação do SUS",
    duration: "Aprox. 20 min"
  },
  {
    id: "TdlgCMJ3jHg",
    title: "Lei 8.080/90 - Visão Geral",
    author: "Enfermagem para Concursos",
    category: "Legislação do SUS",
    duration: "Aprox. 15 min"
  },
  {
    id: "76qaxgE2jK4",
    title: "Lei 8.080/90 - Art. 5º e 6º (Objetivos e Atribuições)",
    author: "Enfermagem para Concursos",
    category: "Legislação do SUS",
    duration: "Aprox. 12 min"
  },
  {
    id: "EI4IOCGh4ZU",
    title: "Lei 8.080/90 - Art. 7º ao 13 (Princípios e Organização)",
    author: "Enfermagem para Concursos",
    category: "Legislação do SUS",
    duration: "Aprox. 18 min"
  },
  {
    id: "DC1EEaXzJWY",
    title: "Lei 8.142/90 - Controle Social e Financiamento",
    author: "Enfermagem para Concursos",
    category: "Legislação do SUS",
    duration: "Aprox. 10 min"
  },

  // Saúde Pública
  {
    id: "3d-l0vl4oGs",
    title: "PNAB para Concursos (Atenção Básica)",
    author: "Prof. Especialista",
    category: "Saúde Pública",
    duration: "Aprox. 25 min"
  },

  // Fundamentos e SAE
  {
    id: "5LyJQ2Q1UIY",
    title: "SAE e Processo de Enfermagem",
    author: "Prof. Especialista",
    category: "Fundamentos e SAE",
    duration: "Aprox. 20 min"
  },

  // Saúde da Mulher
  {
    id: "Hi_doaILEUk",
    title: "Saúde da Mulher: Aspectos Essenciais",
    author: "Prof. Especialista",
    category: "Saúde da Mulher",
    duration: "Aprox. 22 min"
  },

  // Biossegurança e CME
  {
    id: "xhPQbBu7YE0",
    title: "Artigos Hospitalares e Processamento",
    author: "Prof. Especialista",
    category: "Biossegurança e CME",
    duration: "Aprox. 15 min"
  },
  {
    id: "obYQqvphdYY",
    title: "Indicadores Químicos e Biológicos (CME)",
    author: "Prof. Especialista",
    category: "Biossegurança e CME",
    duration: "Aprox. 14 min"
  },

  // Procedimentos de enfermagem
  {
    id: "JYcU8Uz65T8",
    title: "Procedimentos de Enfermagem na Prática",
    author: "Enfermagem Prática",
    category: "Procedimentos de enfermagem",
    duration: "Aprox. 12 min"
  }
];