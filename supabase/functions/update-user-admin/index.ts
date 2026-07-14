import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Instancia o cliente Admin com a Service Key (pula regras RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // 2. Extrai e valida o token do Admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Authorization header missing')
    
    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt)
    
    if (userError || !user) throw userError || new Error('User not found or token invalid')

    // 3. Verifica se quem chamou é realmente Admin
    const { data: adminProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || adminProfile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Access denied: Admins only' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 4. Processa os dados que vieram do painel
    const requestData = await req.json()
    const { userId, updates } = requestData

    if (!userId || !updates) throw new Error('Missing userId or updates in payload')

    // 5. Verifica se o usuário que vai ser editado tem perfil
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    let resultData, operationError

    if (existingProfile) {
      // Perfil existe: FAZ UPDATE
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update({
          role: updates.role,
          status: updates.status,
          plan: updates.plan,
          updated_at: updates.updated_at || new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        
      resultData = data
      operationError = error
    } else {
      // Perfil não existe: FAZ INSERT
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

    if (operationError) throw operationError

    // Tudo deu certo! Retorna sucesso pro React
    return new Response(JSON.stringify({ success: true, data: resultData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error("Function error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // Status 400 permite que o frontend leia a mensagem real do erro
    })
  }
})
