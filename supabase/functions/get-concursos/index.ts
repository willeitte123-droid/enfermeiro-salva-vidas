import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Interface baseada no retorno comum dessa API
interface ExternalConcurso {
  orgao: string;
  vagas: string;
  salario: string;
  estado: string;
  link: string;
  banca?: string; // Algumas APIs retornam, outras precisa inferir
  nivel?: string;
  prazo?: string;
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Consulta a API Externa
    // Utilizando o endpoint público do projeto mencionado
    const response = await fetch('https://concursos-publicos-api.vercel.app/api/concursos');
    
    if (!response.ok) {
      throw new Error('Falha ao consultar API externa de concursos');
    }

    const allConcursos: any[] = await response.json();

    // 2. Palavras-chave para filtragem (Case insensitive)
    const keywords = [
      'enfermagem', 
      'enfermeiro', 
      'técnico de enfermagem', 
      'tecnico de enfermagem', 
      'saúde', 
      'saude', 
      'hospital', 
      'fhemig', 
      'ebserh'
    ];

    // 3. Filtragem e Tratamento
    const nursingConcursos = allConcursos
      .filter((item: any) => {
        const textToSearch = `${item.orgao} ${item.vagas}`.toLowerCase();
        // Filtra se contém termos de enfermagem
        const hasKeyword = keywords.some(key => textToSearch.includes(key));
        // Filtra para garantir que não são editais passados (lógica básica de string se a API não der data ISO)
        const isNotExpired = !textToSearch.includes('encerrado') && !textToSearch.includes('finalizado');
        
        return hasKeyword && isNotExpired;
      })
      .map((item: any, index: number) => {
        // Tenta extrair a banca do título ou define como "A definir"
        // A API original as vezes não separa a banca, então fazemos uma inferência básica ou deixamos genérico
        const possibleBancas = ['FGV', 'CEBRASPE', 'CESPE', 'VUNESP', 'IBFC', 'FCC', 'CESGRANRIO', 'AOCP', 'IDECAN', 'CONSULPAM'];
        const foundBanca = possibleBancas.find(b => item.orgao.toUpperCase().includes(b)) || "Ver Edital";

        // Tenta extrair data da string de prazo (ex: "até 10/10/2024")
        let dateIso = "";
        const dateMatch = item.prazo?.match(/(\d{2})\/(\d{2})\/(\d{4})/);
        if (dateMatch) {
            // Converte para YYYY-MM-DD para o frontend
            dateIso = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
        }

        // Determina status
        const status = item.orgao.toLowerCase().includes('previsto') ? 'Previsto' : 'Aberto';

        return {
          id: `ext-${index}-${Date.now()}`,
          orgao: item.orgao || "Órgão não informado",
          banca: foundBanca,
          vagas: item.vagas || "CR",
          salario: item.salario || "A definir",
          escolaridade: item.nivel || "Técnico/Superior",
          estado: item.estado ? [item.estado.toUpperCase()] : ["BR"],
          inscricoesAte: dateIso || "Ver Edital",
          dataProva: null, // API externa geralmente não fornece data da prova na listagem
          status: status,
          linkEdital: item.link || "#"
        };
      });

    return new Response(JSON.stringify({ 
      concursos: nursingConcursos, 
      total: nursingConcursos.length,
      source: "live_api"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Erro na Edge Function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});