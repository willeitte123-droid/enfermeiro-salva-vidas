import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  // 1. Trata OPTIONS para CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log("=== INICIANDO EXECUÇÃO DO UPDATE-USER-ADMIN ===");

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    console.log("1. Verificando Variáveis de Ambiente:");
    console.log(`- SUPABASE_URL existe? ${!!supabaseUrl}`);
    console.log(`- SUPABASE_ANON_KEY existe? ${!!supabaseAnonKey}`);
    console.log(`- SUPABASE_SERVICE_ROLE_KEY existe? ${!!supabaseServiceKey}`);

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Erro de Configuração: SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não estão definidas nas variáveis de ambiente da Edge Function.')
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Header de Autorização (Bearer token) ausente na requisição.')
    }

    console.log("2. Criando cliente Supabase para validar quem chamou a função...");
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    console.log("3. Obtendo usuário do Token JWT...");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError) {
        console.error("- Erro no getUser:", authError.message);
        throw new Error(`Token inválido ou expirado: ${authError.message}`);
    }
    if (!user) {
      throw new Error('Usuário não encontrado no token fornecido.')
    }
    console.log(`- Usuário chamador identificado: ID ${user.id}`);

    console.log("4. Verificando se o chamador é um Administrador...");
    const { data: adminProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
        console.error("- Erro ao buscar perfil do admin:", profileError.message);
    }
    console.log(`- Role do chamador: ${adminProfile?.role}`);

    if (adminProfile?.role !== 'admin') {
      throw new Error('Acesso Negado: Apenas administradores podem executar esta ação.')
    }

    console.log("5. Lendo os dados enviados (Payload)...");
    let requestData
    try {
      requestData = await req.json()
      console.log("- Payload recebido:", JSON.stringify(requestData));
    } catch (e) {
      console.error("- Erro ao ler JSON:", e);
      throw new Error('Corpo da requisição inválido (Não é um JSON).')
    }

    const { userId, updates } = requestData

    if (!userId || !updates) {
       throw new Error('Payload incompleto: userId ou updates faltando.')
    }

    console.log("6. Criando cliente Supabase ADMIN (Bypass RLS)...");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    console.log(`7. Buscando se o perfil alvo já existe na tabela 'profiles'. Alvo ID: ${userId}`);
    const { data: existingProfile, error: existError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    if (existError) {
        console.error("- Erro ao checar existencia do perfil:", existError.message);
        throw existError;
    }
    console.log(`- Perfil existe no banco? ${!!existingProfile}`);

    let resultData, operationError

    if (existingProfile) {
      console.log("8. Executando UPDATE no perfil...");
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({
          role: updates.role,
          status: updates.status,
          plan: updates.plan,
          updated_at: updates.updated_at
        })
        .eq('id', userId)
        .select()
        
      resultData = data
      operationError = error
    } else {
      console.log("8. Executando INSERT no perfil (Criando do zero)...");
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          email: updates.email || '',
          role: updates.role || 'user',
          status: updates.status || 'pending',
          plan: updates.plan || 'free',
          updated_at: updates.updated_at || new Date().toISOString()
        })
        .select()
        
      resultData = data
      operationError = error
    }

    if (operationError) {
      console.error("9. Erro na operação no banco de dados:", operationError.message);
      throw new Error(`Database operation failed: ${operationError.message}`)
    }

    console.log("=== SUCESSO: OPERAÇÃO CONCLUÍDA ===");
    return new Response(JSON.stringify({ success: true, data: resultData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error("=== ERRO CRÍTICO CAPTURADO NO CATCH ===");
    console.error("Mensagem:", error.message)
    if (error.stack) console.error("Stack:", error.stack)

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
