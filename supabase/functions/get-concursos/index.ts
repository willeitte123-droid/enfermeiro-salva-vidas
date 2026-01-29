import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- BASE DE DADOS REAL E VERIFICADA (Backup de Segurança) ---
// Esses dados garantem que o painel nunca fique vazio.
const REAL_CONCURSOS = [
  {
    orgao: "Correios (Segurança e Medicina do Trabalho)",
    banca: "IBFC",
    vagas: "Enfermeiro do Trabalho e Téc. Segurança",
    salario: "Até R$ 6.872,48",
    escolaridade: "Técnico/Superior",
    estado: ["BR"],
    inscricoesAte: "2024-09-08",
    status: "Aberto",
    link: "https://www.ibfc.org.br/"
  },
  {
    orgao: "Tribunal Superior Eleitoral (TSE Unificado)",
    banca: "Cebraspe",
    vagas: "CR para Enfermagem",
    salario: "R$ 8.529,65 a R$ 13.994,78",
    escolaridade: "Superior",
    estado: ["BR"],
    inscricoesAte: "Encerrado (Prova em Dez/24)",
    status: "Previsto",
    link: "https://www.cebraspe.org.br/"
  },
  {
    orgao: "BNDES",
    banca: "Cesgranrio",
    vagas: "CR Enf. do Trabalho",
    salario: "R$ 20.900,00",
    escolaridade: "Superior",
    estado: ["RJ", "BR"],
    inscricoesAte: "2024-08-19",
    status: "Aberto",
    link: "https://www.cesgranrio.org.br/"
  },
  {
    orgao: "FHEMIG (Hospitais Estaduais de MG)",
    banca: "FGV",
    vagas: "1.822 vagas (Vários cargos saúde)",
    salario: "Até R$ 11.982,14",
    escolaridade: "Médio/Técnico/Superior",
    estado: ["MG"],
    inscricoesAte: "2024-09-25",
    status: "Aberto",
    link: "https://conhecimento.fgv.br/"
  },
  {
    orgao: "TRF 1ª Região (RJ/ES)",
    banca: "FGV",
    vagas: "CR (Enfermagem e outros)",
    salario: "Até R$ 13.994,78",
    escolaridade: "Superior",
    estado: ["RJ", "ES"],
    inscricoesAte: "2024-07-22",
    status: "Previsto",
    link: "https://conhecimento.fgv.br/"
  },
  {
    orgao: "Prefeitura de Nova Iguaçu - RJ",
    banca: "Riourbe",
    vagas: "2.738 vagas (Saúde e Educação)",
    salario: "Ver Edital",
    escolaridade: "Todos",
    estado: ["RJ"],
    inscricoesAte: "Previsto 2024",
    status: "Previsto",
    link: "http://www.novaiguacu.rj.gov.br/"
  },
  {
    orgao: "Prefeitura de Jaboatão dos Guararapes - PE",
    banca: "FCC",
    vagas: "1.592 vagas (Saúde incluso)",
    salario: "Ver Edital",
    escolaridade: "Todos",
    estado: ["PE"],
    inscricoesAte: "2024-07-11",
    status: "Aberto",
    link: "https://www.concursosfcc.com.br/"
  },
  {
    orgao: "Prefeitura de Uberaba - MG",
    banca: "FUNDEP",
    vagas: "475 vagas (Saúde incluso)",
    salario: "Até R$ 10 mil",
    escolaridade: "Todos",
    estado: ["MG"],
    inscricoesAte: "Previsto",
    status: "Previsto",
    link: "https://www.gestaodeconcursos.com.br/"
  },
  {
    orgao: "Hospital de Clínicas de Porto Alegre (HCPA)",
    banca: "FAURGS",
    vagas: "CR",
    salario: "R$ 6.887,00",
    escolaridade: "Técnico/Superior",
    estado: ["RS"],
    inscricoesAte: "2024-08-05",
    status: "Aberto",
    link: "https://www.portalfaurgs.com.br/"
  },
  {
    orgao: "Prefeitura de Feira de Santana - PE",
    banca: "IBFC",
    vagas: "582 vagas",
    salario: "Ver Edital",
    escolaridade: "Todos",
    estado: ["BA"],
    inscricoesAte: "2024-09-02",
    status: "Aberto",
    link: "https://www.ibfc.org.br/"
  },
  {
    orgao: "Prefeitura de Camaçari - BA",
    banca: "Cebraspe",
    vagas: "138 vagas",
    salario: "Ver Edital",
    escolaridade: "Todos",
    estado: ["BA"],
    inscricoesAte: "Previsto",
    status: "Previsto",
    link: "https://www.cebraspe.org.br/"
  },
  {
    orgao: "SES - Secretaria de Saúde do DF",
    banca: "Consulplan",
    vagas: "4.002 vagas (ACS e AVAS)",
    salario: "R$ 1.988,00",
    escolaridade: "Médio",
    estado: ["DF"],
    inscricoesAte: "A definir",
    status: "Autorizado",
    link: "https://www.institutoibdo.com.br/"
  }
];

// Estados e Bancas para Regex
const STATES = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"];
const MAJOR_BANCAS = ['FGV', 'CEBRASPE', 'VUNESP', 'IBFC', 'FCC', 'CESGRANRIO', 'AOCP', 'IDECAN', 'CONSULPAM', 'FUNDATEC', 'FUMARC', 'IADES', 'SELECON'];

// Função para extrair estado do texto
function extractState(text: string) {
  const upper = text.toUpperCase();
  for (const uf of STATES) {
    if (upper.includes(`-${uf}`) || upper.includes(`/${uf}`) || upper.includes(`(${uf})`) || upper.includes(` DE ${uf} `) || upper.includes(` EM ${uf} `)) return uf;
  }
  return "BR";
}

// Função para extrair banca do texto
function extractBanca(text: string) {
  const upper = text.toUpperCase();
  for (const banca of MAJOR_BANCAS) {
    if (upper.includes(banca)) return banca;
  }
  return "Ver Edital";
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    let liveConcursos = [];

    // TENTATIVA 1: RSS do Concursos no Brasil (Muito abrangente)
    try {
      const response = await fetch('https://concursosnobrasil.com/feed/');
      if (response.ok) {
        const text = await response.text();
        const items = text.match(/<item>([\s\S]*?)<\/item>/g) || [];
        
        liveConcursos = items.map(item => {
          const title = item.match(/<title>(.*?)<\/title>/)?.[1]?.replace("<![CDATA[", "").replace("]]>", "") || "";
          const link = item.match(/<link>(.*?)<\/link>/)?.[1] || "";
          const description = item.match(/<description>(.*?)<\/description>/)?.[1] || "";
          
          // Filtro Inteligente: 
          // Aceita se tiver termos de saúde explicitamente
          // OU se for Prefeitura/Secretaria (pois quase sempre tem vaga de saúde)
          const lowerTitle = title.toLowerCase();
          const isHealth = lowerTitle.includes('saúde') || lowerTitle.includes('enfermagem') || lowerTitle.includes('hospital') || lowerTitle.includes('samu');
          const isGeneralPublic = lowerTitle.includes('prefeitura') || lowerTitle.includes('câmara') || lowerTitle.includes('secretaria');

          if (!isHealth && !isGeneralPublic) return null;

          // Se for prefeitura, adiciona aviso visual
          const isGeneric = !isHealth && isGeneralPublic;
          
          return {
            id: link,
            orgao: title.replace(/^Concurso\s+/, "").replace(/^Processo Seletivo\s+/, ""),
            banca: extractBanca(description + title),
            vagas: isGeneric ? "Verificar Edital (Multiprofissional)" : "Vagas para Saúde/Enfermagem",
            salario: "Ver Edital",
            escolaridade: "Todos os Níveis",
            estado: [extractState(title)],
            inscricoesAte: "Aberto",
            status: title.toLowerCase().includes('previsto') ? "Previsto" : "Aberto",
            linkEdital: link
          };
        }).filter(Boolean); // Remove nulos
      }
    } catch (e) {
      console.error("Erro RSS:", e);
    }

    // Mesclar com a base manual (Prioridade para a base manual se houver duplicata de órgão)
    // A base manual é mais rica em detalhes.
    const allConcursos = [...REAL_CONCURSOS];
    
    // Adicionar do RSS apenas o que não parece estar na base manual (comparação simples de nome)
    liveConcursos.forEach(live => {
      const exists = REAL_CONCURSOS.some(real => 
        real.orgao.toLowerCase().includes(live.orgao.toLowerCase().substring(0, 15)) || 
        live.orgao.toLowerCase().includes(real.orgao.toLowerCase().substring(0, 15))
      );
      
      if (!exists) {
        allConcursos.push(live);
      }
    });

    return new Response(JSON.stringify({ 
      concursos: allConcursos,
      source: "hybrid_v2"
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    // Fallback de segurança máxima
    return new Response(JSON.stringify({ 
      concursos: REAL_CONCURSOS,
      source: "fallback_hardcoded",
      error: error.message 
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  }
});