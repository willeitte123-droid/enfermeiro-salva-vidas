import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Dados REAIS de contingência (Caso a API externa falhe)
// Atualizado em: Setembro/2024
const BACKUP_DATA = [
  {
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
    orgao: "TSE Unificado",
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
    orgao: "SMS Rio de Janeiro",
    banca: "Riourbe",
    vagas: "913 Vagas (Enf e Téc)",
    salario: "R$ 1.700,00 a R$ 3.500,00",
    escolaridade: "Técnico e Superior",
    estado: ["RJ"],
    inscricoesAte: "Processo Seletivo Contínuo",
    status: "Aberto",
    linkEdital: "https://prefeitura.rio/rio-saude"
  }
];

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Tenta consultar a API Externa
    const response = await fetch('https://concursos-publicos-api.vercel.app/api/concursos');
    
    // Se a API falhar ou não retornar 200, lançamos erro para cair no catch (fallback)
    if (!response.ok) {
      throw new Error(`API externa indisponível: ${response.status}`);
    }

    const allConcursos = await response.json();

    // Filtros
    const keywords = ['enfermagem', 'enfermeiro', 'técnico de enfermagem', 'saúde', 'hospital', 'ebserh'];

    const nursingConcursos = allConcursos
      .filter((item: any) => {
        const textToSearch = `${item.orgao} ${item.vagas}`.toLowerCase();
        const hasKeyword = keywords.some(key => textToSearch.includes(key));
        const isNotExpired = !textToSearch.includes('encerrado');
        return hasKeyword && isNotExpired;
      })
      .map((item: any, index: number) => {
        // Padronização dos dados da API externa
        let dateIso = "A definir";
        const dateMatch = item.prazo?.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (dateMatch) dateIso = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;

        return {
          id: `api-${index}`,
          orgao: item.orgao,
          banca: "Ver Edital",
          vagas: item.vagas,
          salario: item.salario,
          escolaridade: item.nivel || "Técnico/Superior",
          estado: item.estado ? [item.estado.toUpperCase()] : ["BR"],
          inscricoesAte: dateIso,
          dataProva: null,
          status: item.orgao.toLowerCase().includes('previsto') ? 'Previsto' : 'Aberto',
          linkEdital: item.link
        };
      });

    // Se a API não retornou nada útil (array vazio), usamos o backup
    if (nursingConcursos.length === 0) {
       throw new Error("API retornou lista vazia");
    }

    return new Response(JSON.stringify({ 
      concursos: nursingConcursos, 
      source: "live_api"
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    console.error("Usando dados de backup devido a erro:", error);
    
    // FALLBACK: Retorna os dados manuais se a API falhar
    const backupFormatted = BACKUP_DATA.map((item, index) => ({
      ...item,
      id: `backup-${index}`
    }));

    return new Response(JSON.stringify({ 
      concursos: backupFormatted, 
      source: "backup_cache",
      message: "API externa instável, exibindo dados em cache seguro."
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 200 // Retorna 200 para o frontend não quebrar
    });
  }
});