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
  status: "Aberto" | "Previsto" | "Encerrando" | "Autorizado";
  linkEdital: string;
}

// DADOS REAIS - ATUALIZADOS (Ciclo 2024/2025)
export const CONCURSOS_MOCK: Concurso[] = [
  {
    id: "correios-2024",
    orgao: "Correios (Saúde e Segurança)",
    banca: "IBFC",
    vagas: "33 Vagas + CR (Enfermeiro/Técnico)",
    salario: "R$ 3.672,84 a R$ 6.872,48",
    escolaridade: "Técnico e Superior",
    estado: ["BR"],
    inscricoesAte: "2024-09-08",
    dataProva: "2024-10-13",
    status: "Aberto",
    linkEdital: "https://www.ibfc.org.br/"
  },
  {
    id: "tse-unificado",
    orgao: "TSE Unificado (Tribunais Eleitorais)",
    banca: "Cebraspe",
    vagas: "CR (Enfermagem)",
    salario: "R$ 8.529,65 a R$ 13.994,78",
    escolaridade: "Superior",
    estado: ["BR"],
    inscricoesAte: "Encerradas",
    dataProva: "2024-12-08",
    status: "Previsto",
    linkEdital: "https://www.cebraspe.org.br/concursos/CPNU_24"
  },
  {
    id: "trf1",
    orgao: "TRF 1ª Região (Justiça Federal)",
    banca: "FGV",
    vagas: "CR (Analista/Técnico)",
    salario: "Até R$ 16.035,69",
    escolaridade: "Superior",
    estado: ["AC", "AM", "AP", "BA", "DF", "GO", "MA", "MG", "MT", "PA", "PI", "RO", "RR", "TO"],
    inscricoesAte: "Encerradas",
    dataProva: "2024-08-18",
    status: "Previsto",
    linkEdital: "https://conhecimento.fgv.br/concursos/trf1"
  },
  {
    id: "bndes-2024",
    orgao: "BNDES",
    banca: "Cesgranrio",
    vagas: "CR (Enfermagem do Trabalho)",
    salario: "R$ 20.900,00",
    escolaridade: "Superior",
    estado: ["RJ", "BR"],
    inscricoesAte: "2024-08-19",
    dataProva: "2024-10-13",
    status: "Aberto",
    linkEdital: "https://www.cesgranrio.org.br/"
  },
  {
    id: "fhemig-mg",
    orgao: "FHEMIG (Hospitais de MG)",
    banca: "FGV",
    vagas: "1.822 Vagas (Diversas)",
    salario: "R$ 1.455,58 a R$ 11.982,14",
    escolaridade: "Técnico e Superior",
    estado: ["MG"],
    inscricoesAte: "2024-09-25",
    dataProva: "2024-11-17",
    status: "Aberto",
    linkEdital: "https://conhecimento.fgv.br/concursos/fhemig24"
  },
  {
    id: "ses-df-aocp",
    orgao: "SES-DF (Secretaria de Saúde)",
    banca: "Instituto AOCP",
    vagas: "Autorizadas (ACS e AVAS)",
    salario: "R$ 1.988,00 + Benefícios",
    escolaridade: "Médio",
    estado: ["DF"],
    inscricoesAte: "A definir",
    status: "Autorizado",
    linkEdital: "#"
  },
  {
    id: "tj-sp-2024",
    orgao: "TJ-SP (Tribunal de Justiça)",
    banca: "Vunesp",
    vagas: "Diversas (Área da Saúde)",
    salario: "R$ 5.480,00 a R$ 8.804,85",
    escolaridade: "Superior",
    estado: ["SP"],
    inscricoesAte: "2024-07-12",
    dataProva: "2024-09-08",
    status: "Encerrando",
    linkEdital: "https://www.vunesp.com.br/"
  },
  {
    id: "sms-rio-2024",
    orgao: "SMS Rio de Janeiro",
    banca: "Riourbe",
    vagas: "913 Vagas (Enf e Téc)",
    salario: "R$ 1.700,00 a R$ 3.500,00",
    escolaridade: "Técnico e Superior",
    estado: ["RJ"],
    inscricoesAte: "Processo Seletivo Contínuo",
    status: "Aberto",
    linkEdital: "https://prefeitura.rio/rio-saude"
  },
  {
    id: "adab-ba",
    orgao: "ADAB - Bahia",
    banca: "FGV",
    vagas: "120 Vagas",
    salario: "R$ 2.400,00 a R$ 6.500,00",
    escolaridade: "Técnico e Superior",
    estado: ["BA"],
    inscricoesAte: "2024-04-04",
    status: "Encerrando",
    linkEdital: "https://conhecimento.fgv.br/concursos/adab24"
  }
];