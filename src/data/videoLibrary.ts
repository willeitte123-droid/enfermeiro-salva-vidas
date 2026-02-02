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
    id: "jHMqEVgDjd8",
    title: "PRINCÍPIOS E DIRETRIZES DO SUS - PREPARA ENFERMAGEM",
    author: "Enfermagem para Concursos",
    category: "Legislação do SUS",
    duration: "Aprox. 20 min"
  },
  {
    id: "TdlgCMJ3jHg",
    title: "LEI 8080/90 - DISPOSIÇÃO PRELIMINAR E DISPOSIÇÕES GERAIS - PREPARA ENFERMAGEM",
    author: "Enfermagem para Concursos",
    category: "Legislação do SUS",
    duration: "Aprox. 15 min"
  },
  {
    id: "76qaxgE2jK4",
    title: "LEI 8080/90 - OBJETIVOS E ATRIBUIÇÕES - PREPARA ENFERMAGEM",
    author: "Enfermagem para Concursos",
    category: "Legislação do SUS",
    duration: "Aprox. 12 min"
  },
  {
    id: "EI4IOCGh4ZU",
    title: "LEI 8080/90 - PRINCÍPIOS E DIRETRIZES - PREPARA ENFERMAGEM",
    author: "Enfermagem para Concursos",
    category: "Legislação do SUS",
    duration: "Aprox. 18 min"
  },
  {
    id: "DC1EEaXzJWY",
    title: "LEI 8142/90 - PREPARA ENFERMAGEM",
    author: "Enfermagem para Concursos",
    category: "Legislação do SUS",
    duration: "Aprox. 10 min"
  },

  // Saúde Pública
  {
    id: "3d-l0vl4oGs",
    title: "PNAB - Política Nacional de Atenção Básica (Portaria 2.436/2017) - Parte 1",
    author: "Prof. Especialista",
    category: "Saúde Pública",
    duration: "Aprox. 25 min"
  },

  // Fundamentos e SAE
  {
    id: "5LyJQ2Q1UIY",
    title: "SAE - Sistematização da Assistência de Enfermagem - Resolução 358/2009 COFEN",
    author: "Prof. Especialista",
    category: "Fundamentos e SAE",
    duration: "Aprox. 20 min"
  },

  // Saúde da Mulher
  {
    id: "Hi_doaILEUk",
    title: "SAÚDE DA MULHER - POLÍTICA NACIONAL DE ATENÇÃO INTEGRAL À SAÚDE DA MULHER - PNAISM",
    author: "Prof. Especialista",
    category: "Saúde da Mulher",
    duration: "Aprox. 22 min"
  },

  // Biossegurança e CME
  {
    id: "xhPQbBu7YE0",
    title: "Central de Material e Esterilização - CME - RDC 15/2012 - Parte 1",
    author: "Prof. Especialista",
    category: "Biossegurança e CME",
    duration: "Aprox. 15 min"
  },
  {
    id: "obYQqvphdYY",
    title: "Central de Material e Esterilização - CME - RDC 15/2012 - Parte 2",
    author: "Prof. Especialista",
    category: "Biossegurança e CME",
    duration: "Aprox. 14 min"
  },

  // Procedimentos de enfermagem
  {
    id: "JYcU8Uz65T8",
    title: "COMO MEDIR A PRESSÃO ARTERIAL? APRENDA A AFERIR A PRESSÃO ARTERIAL DA FORMA CERTA!",
    author: "Enfermagem Prática",
    category: "Procedimentos de enfermagem",
    duration: "Aprox. 12 min"
  },
  {
    id: "u56wwAPzt3E",
    title: "PUNÇÃO VENOSA PERIFÉRICA - PASSO A PASSO",
    author: "Enfermagem Prática",
    category: "Procedimentos de enfermagem",
    duration: "Aprox. 8 min"
  },
  {
    id: "bDfDvhCeYAU",
    title: "SONDAGEM VESICAL DE DEMORA - PASSO A PASSO (AULA PRÁTICA)",
    author: "Enfermagem Prática",
    category: "Procedimentos de enfermagem",
    duration: "Aprox. 10 min"
  }
];