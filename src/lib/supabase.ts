import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("As variáveis de ambiente do Supabase (URL e Anon Key) devem estar definidas.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)