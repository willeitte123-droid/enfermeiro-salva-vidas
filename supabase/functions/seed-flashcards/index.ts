import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FLASHCARDS_DATA = [
  // --- NOVOS FLASHCARDS: URGÊNCIA E EMERGÊNCIA ---
  { deck_category: 'Urgência e Emergência', front_content: 'Qual a frequência de compressões torácicas recomendada na RCP em adultos?', back_content: 'Entre 100 e 120 compressões por minuto.' },
  { deck_category: 'Urgência e Emergência', front_content: 'Qual a profundidade recomendada para as compressões torácicas no adulto?', back_content: 'Entre 5 e 6 cm (evitando ultrapassar 6 cm).' },
  { deck_category: 'Urgência e Emergência', front_content: 'Quais são os ritmos de PCR considerados CHOCÁVEIS?', back_content: 'Fibrilação Ventricular (FV) e Taquicardia Ventricular sem Pulso (TVSP).' },
  { deck_category: 'Urgência e Emergência', front_content: 'Quais são os ritmos de PCR considerados NÃO CHOCÁVEIS?', back_content: 'Assistolia e Atividade Elétrica Sem Pulso (AESP).' },
  { deck_category: 'Urgência e Emergência', front_content: 'Qual a dose e o intervalo da Adrenalina (Epinefrina) na PCR?', back_content: '1 mg IV/IO a cada 3 a 5 minutos.' },
  { deck_category: 'Urgência e Emergência', front_content: 'Qual a dose inicial e a segunda dose de Amiodarona na PCR (ritmos chocáveis)?', back_content: '1ª dose: 300 mg. 2ª dose: 150 mg.' },
  { deck_category: 'Urgência e Emergência', front_content: 'No trauma (PHTLS), o que representa a letra "X" no algoritmo XABCDE?', back_content: 'Hemorragia Exsanguinante (controle imediato de sangramentos externos graves, ex: uso de torniquete).' },
  { deck_category: 'Urgência e Emergência', front_content: 'O que caracteriza a Tríade de Cushing e o que ela indica?', back_content: 'Hipertensão Arterial + Bradicardia + Respiração Irregular. Indica Hipertensão Intracraniana (HIC) grave.' },
  { deck_category: 'Urgência e Emergência', front_content: 'Quais os 3 componentes avaliados na Escala de Cincinnati para AVC?', back_content: '1. Queda Facial (sorriso); 2. Fraqueza de Braço; 3. Fala Anormal.' },
  { deck_category: 'Urgência e Emergência', front_content: 'Qual a janela terapêutica padrão para trombólise no AVC Isquêmico agudo?', back_content: 'Até 4,5 horas do início dos sintomas.' },
  { deck_category: 'Urgência e Emergência', front_content: 'Qual a meta de tempo para realização do ECG em um paciente com dor torácica suspeita de IAM?', back_content: 'Até 10 minutos da chegada ao hospital (Tempo Porta-Eletro).' },
  { deck_category: 'Urgência e Emergência', front_content: 'O que significa o mnemônico MONAB no tratamento do IAM?', back_content: 'Morfina, Oxigênio (se Sat < 90%), Nitrato, AAS (Antiagregante) e Betabloqueador.' },
  { deck_category: 'Urgência e Emergência', front_content: 'Qual a conduta imediata (primeira linha) no Choque Anafilático?', back_content: 'Adrenalina IM (0,3 a 0,5 mg no vasto lateral da coxa).' },
  { deck_category: 'Urgência e Emergência', front_content: 'Na regra dos nove para queimaduras, qual a porcentagem atribuída ao Tronco Anterior?', back_content: '18%.' },
  { deck_category: 'Urgência e Emergência', front_content: 'Como é calculada a Fórmula de Parkland para reposição volêmica no queimado?', back_content: '4 ml x Peso (kg) x % de Superfície Corporal Queimada (SCQ).' },
  { deck_category: 'Urgência e Emergência', front_content: 'O que define o Estado de Mal Epiléptico (Status Epilepticus)?', back_content: 'Crise convulsiva com duração superior a 5 minutos ou crises repetidas sem recuperação da consciência entre elas.' },
  { deck_category: 'Urgência e Emergência', front_content: 'Qual o local correto para realizar a Manobra de Heimlich (desobstrução) no adulto consciente?', back_content: 'Na região epigástrica (entre o umbigo e o apêndice xifoide).' },
  { deck_category: 'Urgência e Emergência', front_content: 'Qual a manobra recomendada para abrir vias aéreas em vítimas de trauma com suspeita de lesão cervical?', back_content: 'Jaw Thrust (anteriorização da mandíbula), sem hiperextensão do pescoço.' },
  { deck_category: 'Urgência e Emergência', front_content: 'O que indica um murmúrio vesicular abolido à direita com turgência jugular e hipotensão no trauma?', back_content: 'Pneumotórax Hipertensivo.' },
  { deck_category: 'Urgência e Emergência', front_content: 'Qual a proporção de compressão/ventilação na RCP com 2 socorristas em crianças e bebês?', back_content: '15 compressões : 2 ventilações.' },

  // --- OUTRAS CATEGORIAS (MANTIDAS) ---
  { deck_category: 'Saúde da Mulher', front_content: 'Qual o número mínimo de consultas de pré-natal recomendado pelo Ministério da Saúde?', back_content: 'No mínimo 6 consultas.' },
  { deck_category: 'Saúde da Mulher', front_content: 'Cite 3 exames sorológicos obrigatórios no 1º trimestre de pré-natal.', back_content: 'VDRL (Sífilis), Anti-HIV e HBsAg (Hepatite B).' },
  { deck_category: 'Saúde da Mulher', front_content: 'Qual vacina a gestante deve tomar a partir da 20ª semana em TODA gestação e por quê?', back_content: 'dTpa (Tríplice Bacteriana Acelular), para proteger o recém-nascido contra a coqueluche.' },
  { deck_category: 'Ética e Legislação', front_content: 'Qual atividade é privativa do Enfermeiro em relação à gestão de serviços de enfermagem, segundo a Lei 7.498/86?', back_content: 'A direção do órgão de enfermagem e a chefia de serviço e de unidade de enfermagem.' },
  { deck_category: 'Ética e Legislação', front_content: 'Quais as penalidades previstas no Código de Ética?', back_content: 'Advertência verbal, Multa, Censura, Suspensão e Cassação.' },
  { deck_category: 'Imunização (PNI)', front_content: 'Qual a faixa de temperatura ideal para conservação da maioria das vacinas na geladeira?', back_content: 'Entre +2°C e +8°C.' },
  { deck_category: 'Cálculo de Medicação', front_content: 'Qual a fórmula para cálculo de gotas por minuto (tempo em horas)?', back_content: 'Gotas/min = Volume (ml) / (Tempo (h) x 3).' }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    let insertedCount = 0;

    for (const card of FLASHCARDS_DATA) {
        const { data: existing } = await supabaseAdmin
            .from('flashcards')
            .select('id')
            .eq('front_content', card.front_content)
            .maybeSingle();

        if (!existing) {
            await supabaseAdmin.from('flashcards').insert(card);
            insertedCount++;
        }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Processo concluído. ${insertedCount} novos flashcards inseridos.` 
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 200 
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 500 
    });
  }
});