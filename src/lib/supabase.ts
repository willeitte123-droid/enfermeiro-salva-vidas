import { createClient } from '@supabase/supabase-js'

// Solução para o problema de variáveis de ambiente: Inserindo as credenciais do Supabase diretamente.
// Esta não é uma prática padrão, mas é necessária para resolver o problema de configuração atual.
const supabaseUrl = "https://hbokiayvlbywxuwsgzlj.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhib2tpYXl2bGJ5d3h1d3NnemxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMjYzNzgsImV4cCI6MjA3NTcwMjM3OH0.i26HGjGUgmAh4u5zWhp4KuceS38UpSTzrmo8QO2n2GY";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("As variáveis de ambiente do Supabase (URL e Anon Key) devem estar definidas.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)