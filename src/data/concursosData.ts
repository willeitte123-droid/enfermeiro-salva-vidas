export interface Concurso {
  id: string;
  orgao: string;
  banca: string;
  vagas: string;
  salario: string;
  escolaridade: string;
  estado: string[];
  inscricoesAte: string;
  dataProva?: string;
  status: "Aberto"; // Restringindo tipagem para garantir o pedido
  linkEdital: string;
}

// DADOS FILTRADOS - APENAS EDITAIS ABERTOS (Enfermeiro / Téc. Enfermagem)
export const CONCURSOS_MOCK: Concurso[] = [
  {
    id: "correios-2024-aberto",
    orgao: "Correios (Saúde do Trabalho)",
    banca: "IBFC",
    vagas: "Enfermeiro do Trabalho e Técnico (Vagas + CR)",
    salario: "R$ 3.672,84 a R$ 6.872,48",
    escolaridade: "Técnico e Superior",
    estado: ["BR"],
    inscricoesAte: "2024-09-08",
    dataProva: "2024-10-13",
    status: "Aberto",
    linkEdital: "https://www.ibfc.org.br/"
  },
  {
    id: "bndes-2024",
    orgao: "BNDES",
    banca: "Cesgranrio",
    vagas: "CR para Enfermeiro do Trabalho",
    salario: "R$ 20.900,00",
    escolaridade: "Superior",
    estado: ["RJ", "BR"],
    inscricoesAte: "2024-08-19",
    dataProva: "2024-10-13",
    status: "Aberto",
    linkEdital: "https://www.cesgranrio.org.br/"
  },
  {
    id: "fhemig-mg-2024",
    orgao: "FHEMIG (Hospitais Estaduais MG)",
    banca: "FGV",
    vagas: "Diversas vagas p/ Téc. Enfermagem e Enfermeiro",
    salario: "R$ 1.455,58 a R$ 11.982,14",
    escolaridade: "Técnico e Superior",
    estado: ["MG"],
    inscricoesAte: "2024-09-25",
    dataProva: "2024-11-17",
    status: "Aberto",
    linkEdital: "https://conhecimento.fgv.br/concursos/fhemig24"
  },
  {
    id: "sms-rio-processo",
    orgao: "RioSaúde (SMS Rio de Janeiro)",
    banca: "Própria/Prefeitura",
    vagas: "Contratação Imediata (Enfermeiro/Técnico)",
    salario: "Até R$ 3.500,00 + Adicionais",
    escolaridade: "Técnico e Superior",
    estado: ["RJ"],
    inscricoesAte: "Fluxo Contínuo",
    status: "Aberto",
    linkEdital: "https://prefeitura.rio/rio-saude"
  },
  {
    id: "hosp-clinicas-poa",
    orgao: "Hospital de Clínicas de Porto Alegre (HCPA)",
    banca: "FAURGS",
    vagas: "CR (Enfermeiro - Várias Especialidades)",
    salario: "R$ 6.887,00",
    escolaridade: "Superior",
    estado: ["RS"],
    inscricoesAte: "2024-08-05",
    status: "Aberto",
    linkEdital: "https://www.portalfaurgs.com.br/"
  },
  {
    id: "pref-guarulhos",
    orgao: "Prefeitura de Guarulhos - SP",
    banca: "Vunesp",
    vagas: "Vagas p/ Téc. Enfermagem",
    salario: "R$ 2.450,00 + Benefícios",
    escolaridade: "Técnico",
    estado: ["SP"],
    inscricoesAte: "2024-08-15",
    dataProva: "2024-09-22",
    status: "Aberto",
    linkEdital: "https://www.vunesp.com.br/"
  },
  {
    id: "trt-1-unificado",
    orgao: "Tribunais (Unificado/Isolados)",
    banca: "FCC/Cebraspe",
    vagas: "Técnico/Analista Judiciário (Enfermagem)",
    salario: "R$ 8.529,00 a R$ 13.994,00",
    escolaridade: "Superior",
    estado: ["BR"],
    inscricoesAte: "Verificar Edital Específico",
    status: "Aberto",
    linkEdital: "https://www.concursosfcc.com.br/"
  },
  {
    id: "marinha-saude",
    orgao: "Marinha do Brasil (CSM)",
    banca: "Marinha",
    vagas: "Quadro de Apoio à Saúde (Enfermagem)",
    salario: "R$ 9.070,60",
    escolaridade: "Superior",
    estado: ["BR"],
    inscricoesAte: "2024-07-31",
    dataProva: "2024-09-29",
    status: "Aberto",
    linkEdital: "https://www.marinha.mil.br/sspm/"
  }
];