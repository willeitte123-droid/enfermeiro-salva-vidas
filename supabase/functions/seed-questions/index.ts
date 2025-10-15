import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const questions = [
  {
    "id": 1,
    "category": "Ética e Legislação",
    "question": "De acordo com o Código de Ética dos Profissionais de Enfermagem (CEPE), a recusa em executar uma prescrição medicamentosa em caso de identificação de erro ou ilegibilidade é considerada:",
    "options": [
      { "id": "A", "text": "Um ato de insubordinação, passível de punição." },
      { "id": "B", "text": "Um dever do profissional para garantir a segurança do paciente." },
      { "id": "C", "text": "Uma infração ética, pois questiona a conduta de outro profissional." },
      { "id": "D", "text": "Uma decisão opcional, que depende da relação com a equipe." }
    ],
    "correctAnswer": "B",
    "explanation": "O CEPE estabelece como um dever do profissional de enfermagem avaliar criteriosamente a prescrição e, em caso de erro ou ilegibilidade, recusar-se a executá-la, comunicando o fato ao responsável para garantir a segurança do paciente."
  },
  {
    "id": 2,
    "category": "Segurança do Paciente",
    "question": "Qual das seguintes ações é a principal medida para a prevenção de infecções relacionadas à assistência à saúde (IRAS), de acordo com as metas internacionais de segurança do paciente?",
    "options": [
      { "id": "A", "text": "Uso de antibióticos profiláticos em todos os pacientes." },
      { "id": "B", "text": "Higienização das mãos nos 5 momentos preconizados pela OMS." },
      { "id": "C", "text": "Isolamento de contato para todos os pacientes admitidos." },
      { "id": "D", "text": "Limpeza terminal diária de todas as unidades de internação." }
    ],
    "correctAnswer": "B",
    "explanation": "A higienização das mãos é a medida mais simples, barata e eficaz para prevenir a disseminação de microrganismos e reduzir as IRAS. As outras medidas são importantes, mas a higienização das mãos é o pilar central da Meta 5."
  },
  {
    "id": 3,
    "category": "Emergência",
    "question": "Durante o atendimento a uma parada cardiorrespiratória (PCR) em um adulto, qual é a frequência e a profundidade corretas das compressões torácicas?",
    "options": [
      { "id": "A", "text": "80-100 compressões por minuto, com profundidade de 4-5 cm." },
      { "id": "B", "text": "100-120 compressões por minuto, com profundidade de 5-6 cm." },
      { "id": "C", "text": "120-140 compressões por minuto, com profundidade de 6-7 cm." },
      { "id": "D", "text": "Pelo menos 100 compressões por minuto, com profundidade de 4 cm." }
    ],
    "correctAnswer": "B",
    "explanation": "As diretrizes de Suporte Básico e Avançado de Vida recomendam uma frequência de 100 a 120 compressões por minuto e uma profundidade de 5 a 6 cm para garantir uma perfusão coronariana e cerebral adequada."
  },
  {
    "id": 4,
    "category": "Saúde da Mulher",
    "question": "Para o rastreamento do câncer de colo de útero no Brasil, a recomendação do Ministério da Saúde para a realização do exame Papanicolau é:",
    "options": [
      { "id": "A", "text": "Anual para todas as mulheres a partir do início da vida sexual." },
      { "id": "B", "text": "A cada 5 anos para mulheres entre 30 e 59 anos." },
      { "id": "C", "text": "A cada 3 anos para mulheres entre 25 e 64 anos, após dois exames anuais negativos." },
      { "id": "D", "text": "Apenas para mulheres com múltiplos parceiros ou sintomas." }
    ],
    "correctAnswer": "C",
    "explanation": "O rastreamento deve ser feito em mulheres de 25 a 64 anos. Os dois primeiros exames devem ser anuais. Se ambos forem negativos, os próximos podem ser realizados a cada três anos."
  },
  {
    "id": 5,
    "category": "Farmacologia",
    "question": "A administração intravenosa rápida de Furosemida (Lasix) está associada a qual efeito adverso principal?",
    "options": [
      { "id": "A", "text": "Hipertensão de rebote." },
      { "id": "B", "text": "Hipercalemia severa." },
      { "id": "C", "text": "Ototoxicidade e hipotensão." },
      { "id": "D", "text": "Bradicardia reflexa." }
    ],
    "correctAnswer": "C",
    "explanation": "A Furosemida, um diurético de alça, pode causar ototoxicidade (lesão no ouvido) e hipotensão, especialmente quando administrada em bolus intravenoso rápido. Por isso, a administração deve ser lenta."
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Limpa a tabela para evitar duplicatas
    const { error: deleteError } = await supabaseAdmin.from('questions').delete().neq('id', 0);
    if (deleteError) throw deleteError;

    // Insere todas as questões
    const { error: insertError } = await supabaseAdmin.from('questions').insert(questions);
    if (insertError) throw insertError;

    return new Response(JSON.stringify({ message: "Banco de dados populado com sucesso!" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})