import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Tratamento de CORS para requisições do navegador
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      throw new Error("URL é obrigatória");
    }

    // Extrair ID do vídeo para garantir que a URL está limpa
    // Suporta: youtu.be, youtube.com/watch?v=, youtube.com/embed/, etc.
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^"&?\/\s]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      throw new Error("Link do YouTube inválido.");
    }

    // Usar o serviço Noembed (Wrapper oficial de OEmbed) para pegar dados públicos sem API Key
    // Isso garante Título e Autor (Canal) idênticos aos do YouTube
    const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
    
    if (!response.ok) {
      throw new Error("Falha ao comunicar com YouTube.");
    }

    const data = await response.json();

    if (data.error) {
       throw new Error("Vídeo não encontrado ou privado.");
    }

    return new Response(JSON.stringify({ 
      title: data.title,
      author: data.author_name,
      // OEmbed não retorna duração exata, mas garante título/autor corretos
      valid: true,
      videoId: videoId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});