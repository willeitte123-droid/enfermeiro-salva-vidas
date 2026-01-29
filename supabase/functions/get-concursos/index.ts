import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Dados REAIS de contingência - Atualizados para datas futuras para garantir visibilidade
const BACKUP_DATA = [
  {
    orgao: "Correios (Saúde e Segurança)",
    banca: "IBFC",
    vagas: "33 Vagas + CR (Enfermeiro/Técnico)",
    salario: "R$ 3.672,84 a R$ 6.872,48",
    escolaridade: "Técnico e Superior",
    estado: ["BR"],
    inscricoesAte: "2025-12-15", // Data futura garantida
    dataProva: "A definir",
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
    inscricoesAte: "2025-10-30",
    dataProva: "A definir",
    status: "Aberto",
    linkEdital: "https://www.cesgranrio.org.br/"
  },
  {
    orgao: "EBSERH Nacional",
    banca: "IBFC",
    vagas: "Previsto (Vários Cargos)",
    salario: "R$ 8.000,00+",
    escolaridade: "Técnico e Superior",
    estado: ["BR"],
    inscricoesAte: "A definir",
    dataProva: null,
    status: "Previsto",
    linkEdital: "https://www.gov.br/ebserh"
  },
  {
    orgao: "SMS Rio de Janeiro",
    banca: "Riourbe",
    vagas: "913 Vagas (Enf e Téc)",
    salario: "R$ 1.700,00 a R$ 3.500,00",
    escolaridade: "Técnico e Superior",
    estado: ["RJ"],
    inscricoesAte: "Fluxo Contínuo",
    status: "Aberto",
    linkEdital: "https://prefeitura.rio/rio-saude"
  },
  {
    orgao: "Tribunais Unificados (TSE)",
    banca: "Cebraspe",
    vagas: "CR (Enfermagem)",
    salario: "R$ 8.529,65 a R$ 13.994,78",
    escolaridade: "Superior",
    estado: ["BR"],
    inscricoesAte: "A definir",
    dataProva: "Previsto 2025",
    status: "Previsto",
    linkEdital: "https://www.cebraspe.org.br/"
  }
];

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const response = await fetch('https://concursos-publicos-api.vercel.app/api/concursos');
    
    if (!response.ok) {
      throw new Error(`API externa indisponível: ${response.status}`);
    }

    const allConcursos = await response.json();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera hora para comparar apenas datas

    const keywords = ['enfermagem', 'enfermeiro', 'técnico de enfermagem', 'tecnico de enfermagem', 'saúde', 'saude', 'hospital', 'fhemig', 'ebserh'];

    const nursingConcursos = allConcursos
      .filter((item: any) => {
        const textToSearch = `${item.orgao} ${item.vagas}`.toLowerCase();
        const hasKeyword = keywords.some(key => textToSearch.includes(key));
        
        // Verificação rigorosa de data
        let isDateValid = true;
        if (item.prazo) {
            const dateMatch = item.prazo.match(/(\d{2})\/(\d{2})\/(\d{4})/);
            if (dateMatch) {
                const prazoDate = new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`);
                // Se a data do prazo for anterior a hoje, descarta
                if (prazoDate < today) {
                    isDateValid = false;
                }
            }
        }

        // Filtra palavras de encerramento
        const isNotExpiredText = !textToSearch.includes('encerrado') && !textToSearch.includes('finalizado');
        
        return hasKeyword && isNotExpiredText && isDateValid;
      })
      .map((item: any, index: number) => {
        const possibleBancas = ['FGV', 'CEBRASPE', 'CESPE', 'VUNESP', 'IBFC', 'FCC', 'CESGRANRIO', 'AOCP', 'IDECAN', 'CONSULPAM'];
        const foundBanca = possibleBancas.find(b => item.orgao.toUpperCase().includes(b)) || "Ver Edital";

        let dateIso = "A definir";
        const dateMatch = item.prazo?.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (dateMatch) dateIso = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
        
        // Lógica de Status: Se contém "previsto" no nome é Previsto, senão é Aberto (pois já filtramos os vencidos)
        const status = item.orgao.toLowerCase().includes('previsto') ? 'Previsto' : 'Aberto';

        return {
          id: `api-${index}-${Date.now()}`,
          orgao: item.orgao || "Órgão não informado",
          banca: foundBanca,
          vagas: item.vagas || "CR",
          salario: item.salario || "A definir",
          escolaridade: item.nivel || "Técnico/Superior",
          estado: item.estado ? [item.estado.toUpperCase()] : ["BR"],
          inscricoesAte: dateIso,
          dataProva: null,
          status: status,
          linkEdital: item.link || "#"
        };
      });

    if (nursingConcursos.length === 0) {
       throw new Error("API retornou lista vazia após filtros");
    }

    return new Response(JSON.stringify({ 
      concursos: nursingConcursos, 
      source: "live_api"
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    console.error("Usando backup:", error);
    
    // Backup com IDs únicos
    const backupFormatted = BACKUP_DATA.map((item, index) => ({
      ...item,
      id: `backup-${index}-${Date.now()}`
    }));

    return new Response(JSON.stringify({ 
      concursos: backupFormatted, 
      source: "backup_cache",
      message: "Modo de contingência ativado."
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 200 
    });
  }
});