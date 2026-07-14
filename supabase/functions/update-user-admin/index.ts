import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Server configuration error: Missing environment variables')
    }

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Verify caller is admin
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Unauthorized or invalid token')
    }

    const { data: adminProfile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || adminProfile?.role !== 'admin') {
      throw new Error('Forbidden: Admins only')
    }

    let requestData
    try {
      requestData = await req.json()
    } catch (e) {
      throw new Error('Invalid JSON payload')
    }

    const { userId, updates } = requestData

    if (!userId || !updates) {
       throw new Error('Missing userId or updates in payload')
    }

    // Use Service Role Key to bypass RLS and force the update
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Check if profile exists using Service Role
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .maybeSingle()

    let resultData, operationError

    if (existingProfile) {
      // Profile exists, perform UPDATE
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
      // Profile is missing (auth only), perform INSERT
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
      throw new Error(`Database operation failed: ${operationError.message}`)
    }

    return new Response(JSON.stringify({ success: true, data: resultData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error("Function error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400, // Changed from 500/etc to 400 so the frontend can read the exact error payload
    })
  }
})
