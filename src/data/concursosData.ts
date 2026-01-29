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
  status: "Aberto" | "Previsto" | "Encerrando";
  linkEdital: string;
}

export const CONCURSOS_MOCK: Concurso[] = [
  {
    id: "1",
    orgao: "EBSERH Nacional",
    banca: "IBFC",
    vagas: "695 Vagas + CR",
    salario: "R$ 8.095,00",
    escolaridade: "Técnico e Superior",
    estado: ["BR"],
    inscricoesAte: "2024-12-15",
    dataProva: "2025-02-02",
    status: "Aberto",
    linkEdital: "#"
  },
  {
    id: "2",
    orgao: "Secretaria de Saúde - SP",
    banca: "VUNESP",
    vagas: "150 Vagas",
    salario: "R$ 4.500,00",
    escolaridade: "Superior",
    estado: ["SP"],
    inscricoesAte: "2024-11-30",
    dataProva: "2025-01-15",
    status: "Encerrando",
    linkEdital: "#"
  },
  {
    id: "3",
    orgao: "Tribunal de Justiça - RJ",
    banca: "FGV",
    vagas: "CR",
    salario: "R$ 11.200,00",
    escolaridade: "Superior",
    estado: ["RJ"],
    inscricoesAte: "2025-01-20",
    status: "Previsto",
    linkEdital: "#"
  },
  {
    id: "4",
    orgao: "Prefeitura de Belo Horizonte",
    banca: "Consulplan",
    vagas: "40 Vagas",
    salario: "R$ 3.200,00",
    escolaridade: "Técnico",
    estado: ["MG"],
    inscricoesAte: "2024-12-10",
    dataProva: "2025-01-25",
    status: "Aberto",
    linkEdital: "#"
  },
  {
    id: "5",
    orgao: "Marinha do Brasil",
    banca: "Própria",
    vagas: "20 Vagas",
    salario: "R$ 9.070,00",
    escolaridade: "Superior",
    estado: ["BR"],
    inscricoesAte: "2025-02-01",
    status: "Previsto",
    linkEdital: "#"
  },
  {
    id: "6",
    orgao: "Secretaria de Saúde - BA",
    banca: "Instituto Mais",
    vagas: "300 Vagas",
    salario: "R$ 5.100,00",
    escolaridade: "Técnico e Superior",
    estado: ["BA"],
    inscricoesAte: "2024-12-20",
    status: "Aberto",
    linkEdital: "#"
  }
];