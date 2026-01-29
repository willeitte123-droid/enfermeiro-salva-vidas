import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Palavras-chave para identificar concursos que PROVAVELMENTE têm vagas de enfermagem
// A maioria dos editais de prefeitura tem vaga para saúde.
const HEALTH_KEYWORDS = [
  'enfermagem', 'enfermeiro', 'técnico de enfermagem', 'saúde', 'hospital', 
  'ubs', 'upa', 'samu', 'fhemig', 'ebserh', 'unimed', 'cruz vermelha',
  'prefeitura', 'secretaria', 'consórcio', 'fundação' 
];

// Estados Brasileiros para mapeamento
const STATES = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS", "MT", 
  "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"
];

// Parser simples de XML para JSON (para o RSS)
function parseXML(xmlText: string) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];
    
    const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || itemContent.match(/<title>(.*?)<\/title>/);
    const linkMatch = itemContent.match(/<link>(.*?)<\/link>/);
    const descMatch = itemContent.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || itemContent.match(/<description>(.*?)<\/description>/);
    const dateMatch = itemContent.match(/<pubDate>(.*?)<\/pubDate>/);

    if (titleMatch && linkMatch) {
      items.push({
        title: titleMatch[1],
        link: linkMatch[1],
        description: descMatch ? descMatch[1] : "",
        pubDate: dateMatch ? dateMatch[1] : ""
      });
    }
  }
  return items;
}

// Tenta extrair o estado do título (Ex: "Prefeitura de Santos - SP")
function extractState(text: string) {
  const upperText = text.toUpperCase();
  // Procura por " - UF" ou " (UF)" ou "/UF"
  for (const uf of STATES) {
    if (upperText.includes(`- ${uf}`) || upperText.includes(`/${uf}`) || upperText.includes(`(${uf})`) || upperText.includes(` ${uf} `)) {
      return uf;
    }
  }
  return "BR"; // Nacional ou não identificado
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const concursos = [];

    // FONTE 1: API de Concursos (Base estruturada)
    // Buscamos dados gerais e filtramos
    try {
      const apiResponse = await fetch('https://concursos-publicos-api.vercel.app/api/concursos');
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();
        const mappedApiData = apiData.map((item: any) => ({
          orgao: item.orgao,
          vagas: item.vagas || "CR",
          salario: item.salario || "A definir",
          estado: item.estado ? [item.estado.toUpperCase()] : ["BR"],
          link: item.link,
          origem: "API"
        }));
        concursos.push(...mappedApiData);
      }
    } catch (e) {
      console.error("Erro na Fonte 1:", e);
    }

    // FONTE 2: RSS do Concursos no Brasil (Dados frescos/diários)
    // Isso garante que temos os editais que saíram HOJE
    try {
      const rssResponse = await fetch('https://concursosnobrasil.com/feed/');
      if (rssResponse.ok) {
        const xmlText = await rssResponse.text();
        const rssItems = parseXML(xmlText);
        
        const mappedRssData = rssItems.map(item => {
          const estado = extractState(item.title);
          return {
            orgao: item.title.replace("Concurso ", "").replace("Processo Seletivo ", ""),
            vagas: "Ver Edital", // RSS geralmente não tem vaga estruturada no título
            salario: "Ver Edital",
            estado: [estado],
            link: item.link,
            origem: "RSS"
          };
        });
        concursos.push(...mappedRssData);
      }
    } catch (e) {
       console.error("Erro na Fonte 2 (RSS):", e);
    }

    // PROCESSAMENTO E FILTRAGEM FINAL
    // Aqui garantimos que só entra o que é relevante
    const processedConcursos = concursos
      .filter(item => {
        const fullText = `${item.orgao}`.toLowerCase();
        
        // 1. Deve conter palavras-chave de saúde OU ser prefeitura/órgão público
        // (Assumimos que prefeituras quase sempre contratam saúde)
        const isRelevant = HEALTH_KEYWORDS.some(key => fullText.includes(key));
        
        // 2. Não deve ser edital cancelado/suspenso
        const isNotCancelled = !fullText.includes('cancelado') && !fullText.includes('suspenso');

        return isRelevant && isNotCancelled;
      })
      .map((item, index) => {
        // Formatação final do objeto
        
        // Tenta inferir a banca do título se possível, senão "Ver no Edital"
        const possibleBancas = ['FGV', 'CEBRASPE', 'VUNESP', 'IBFC', 'FCC', 'CESGRANRIO', 'AOCP', 'IDECAN', 'CONSULPAM', 'FUNDATEC', 'FUMARC'];
        const foundBanca = possibleBancas.find(b => item.orgao.toUpperCase().includes(b)) || "Ver Edital";

        // Tenta limpar o nome do órgão
        let cleanName = item.orgao;
        if (cleanName.length > 80) cleanName = cleanName.substring(0, 80) + "...";

        return {
          id: `conc-${index}-${Date.now()}`,
          orgao: cleanName,
          banca: foundBanca,
          vagas: item.vagas,
          salario: item.salario,
          escolaridade: "Técnico/Superior", // Padrão para enfermagem
          estado: item.estado,
          inscricoesAte: "Acesse o Edital", // Link direto é mais confiável que data parseada errada
          dataProva: null,
          status: item.orgao.toLowerCase().includes('previsto') ? 'Previsto' : 'Aberto',
          linkEdital: item.link
        };
      });

    // Remove duplicatas baseadas no link ou nome muito similar
    const uniqueConcursos = Array.from(new Map(processedConcursos.map(item => [item.link, item])).values());

    return new Response(JSON.stringify({ 
      concursos: uniqueConcursos, 
      count: uniqueConcursos.length,
      source: "aggregated_live"
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });

  } catch (error) {
    console.error("Erro Crítico:", error);
    // Em último caso, retorna um array vazio mas válido para não quebrar o front
    return new Response(JSON.stringify({ 
      concursos: [], 
      error: error.message 
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
  }
});