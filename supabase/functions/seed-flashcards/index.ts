import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FLASHCARDS_DATA = [
  { deck_category: 'Centro Cirúrgico', front_content: 'Quais são os 4 tempos cirúrgicos fundamentais, em ordem?', back_content: '1. Diérese (abertura/corte); 2. Hemostasia (controle de sangramento); 3. Exérese (cirurgia propriamente dita); 4. Síntese (fechamento/sutura).' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Quais são os 3 momentos de verificação do Checklist de Cirurgia Segura da OMS?', back_content: '1. Sign In (Antes da indução anestésica); 2. Time Out (Antes da incisão da pele - Pausa Cirúrgica); 3. Sign Out (Antes do paciente sair da sala).' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Qual a classificação de uma cirurgia de Apendicectomia Supurada quanto ao potencial de contaminação?', back_content: 'Cirurgia Infectada (presença de pus/processo infeccioso prévio).' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Para que serve a Escala de Aldrete e Kroulik?', back_content: 'Avaliar as condições fisiológicas do paciente para a alta da Sala de Recuperação Pós-Anestésica (SRPA). Nota mínima geralmente é 8 a 10.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Qual a diferença entre esterilização e desinfecção?', back_content: 'Esterilização elimina TODAS as formas de vida microbiana (incluindo esporos). Desinfecção elimina a maioria dos patógenos, mas não necessariamente esporos.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Em qual posição cirúrgica o paciente fica deitado de costas, com as pernas elevadas e apoiadas em perneiras?', back_content: 'Posição de Litotomia (ou Ginecológica). Usada para cirurgias perineais, retais e vaginais.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'O que é a posição de Trendelenburg?', back_content: 'Decúbito dorsal com a cabeça mais baixa que o corpo. Usada para cirurgias pélvicas (afasta as vísceras) e em casos de choque hipovolêmico (retorno venoso).' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Qual a validade de um pacote estéril processado em autoclave (papel grau cirúrgico)?', back_content: 'Depende da instituição e das condições de armazenamento, mas geralmente considera-se o evento (rasgo, umidade) e não apenas o tempo. Protocolos comuns citam 30 a 60 dias, mas a integridade da embalagem é mandatória.' },
  { deck_category: 'Saúde do Idoso', front_content: 'Quais são os "Gigantes da Geriatria" (Os 5 Is)?', back_content: '1. Instabilidade postural (quedas); 2. Imobilidade; 3. Incontinência (urinária/fecal); 4. Incapacidade cognitiva (demência/delirium); 5. Iatrogenia (polifarmácia).' },
  { deck_category: 'Saúde do Idoso', front_content: 'Qual a diferença entre Senescência e Senilidade?', back_content: 'Senescência é o envelhecimento fisiológico (natural/saudável). Senilidade é o envelhecimento patológico (associado a doenças e incapacidades).' },
  { deck_category: 'Saúde do Idoso', front_content: 'Segundo o Estatuto do Idoso, qual idade define a "Prioridade Especial"?', back_content: 'Pessoas com idade igual ou superior a 80 anos têm prioridade sobre os demais idosos (exceto em emergências médicas).' },
  { deck_category: 'Saúde do Idoso', front_content: 'Quais são as vacinas básicas recomendadas para o idoso?', back_content: 'Influenza (anual), Pneumocócica 23-valente (para institucionalizados/acamados), Dupla Adulto (dT - reforço 10 anos) e Hepatite B.' },
  { deck_category: 'Saúde do Idoso', front_content: 'Qual a diferença entre ABVD e AIVD na avaliação funcional?', back_content: 'ABVD (Atividades Básicas): Autocuidado (banho, comer). AIVD (Atividades Instrumentais): Vida prática (compras, telefone, finanças). As AIVD são perdidas primeiro na demência.' },
  { deck_category: 'Saúde do Idoso', front_content: 'O que caracteriza a Síndrome de Fragilidade no idoso?', back_content: 'Perda de peso não intencional, exaustão (fadiga), fraqueza muscular (preensão palmar), lentidão na marcha e baixo nível de atividade física.' },
  { deck_category: 'Saúde do Idoso', front_content: 'Qual a notificação compulsória específica relacionada à violência contra o idoso?', back_content: 'Suspeita ou confirmação de violência (física, psicológica, patrimonial) deve ser notificada e comunicada à autoridade policial, Ministério Público ou Conselho do Idoso.' },
  { deck_category: 'Saúde do Adulto', front_content: 'Quais os critérios diagnósticos para Diabetes Mellitus (jejum e HbA1c)?', back_content: 'Glicemia de Jejum >= 126 mg/dL e/ou Hemoglobina Glicada (HbA1c) >= 6,5% (confirmados em nova coleta).' },
  { deck_category: 'Saúde do Adulto', front_content: 'Qual o valor de Pressão Arterial considerado Hipertensão Estágio 1?', back_content: 'Sistólica 140-159 mmHg e/ou Diastólica 90-99 mmHg.' },
  { deck_category: 'Saúde do Adulto', front_content: 'O que é a definição de caso de Sintomático Respiratório na Tuberculose?', back_content: 'Pessoa com tosse por 3 semanas ou mais (população geral). Para populações vulneráveis, qualquer tempo de tosse.' },
  { deck_category: 'Saúde do Adulto', front_content: 'Qual o esquema básico de tratamento da Tuberculose (adulto)?', back_content: '2 meses de RHZE (Rifampicina, Isoniazida, Pirazinamida, Etambutol) + 4 meses de RH (Rifampicina, Isoniazida).' },
  { deck_category: 'Saúde do Adulto', front_content: 'Como se transmite a Hanseníase?', back_content: 'Através de gotículas das vias aéreas superiores (tosse, espirro) de pacientes multibacilares não tratados, após contato íntimo e prolongado.' },
  { deck_category: 'Saúde do Adulto', front_content: 'Quais são os sinais clássicos (4 Ps) do Diabetes descompensado?', back_content: 'Poliúria (muita urina), Polidipsia (muita sede), Polifagia (fome excessiva) e Perda de peso.' },
  { deck_category: 'Saúde do Adulto', front_content: 'O que é a Síndrome Metabólica?', back_content: 'Conjunto de fatores de risco cardiovascular: Obesidade abdominal, Triglicerídeos altos, HDL baixo, Pressão alta e Glicemia de jejum alterada.' },
  { deck_category: 'Saúde do Adulto', front_content: 'Qual a diferença entre Angina Instável e IAM?', back_content: 'Na Angina Instável não há necrose miocárdica (enzimas cardíacas/troponina negativas). No IAM ocorre necrose (enzimas positivas).' },
  { deck_category: 'Cálculo de Medicação', front_content: 'Qual a fórmula para cálculo de gotas por minuto (tempo em horas)?', back_content: 'Gotas/min = Volume (ml) / (Tempo (h) x 3).' },
  { deck_category: 'Cálculo de Medicação', front_content: 'Qual a fórmula para cálculo de microgotas por minuto (tempo em horas)?', back_content: 'Microgotas/min = Volume (ml) / Tempo (h). (Ou Gotas x 3).' },
  { deck_category: 'Cálculo de Medicação', front_content: 'Quantas gotas equivalem a 1 ml?', back_content: '20 gotas.' },
  { deck_category: 'Cálculo de Medicação', front_content: 'Quantas microgotas equivalem a 1 ml?', back_content: '60 microgotas.' },
  { deck_category: 'Cálculo de Medicação', front_content: 'Quantas microgotas equivalem a 1 gota?', back_content: '3 microgotas.' },
  { deck_category: 'Cálculo de Medicação', front_content: 'Para administrar 500ml de SF em 8 horas, qual o gotejamento?', back_content: '500 / (8 x 3) = 500 / 24 = 20,8 (aprox. 21 gotas/min).' },
  { deck_category: 'Cálculo de Medicação', front_content: 'Quantos mg de soluto existem em uma ampola de Glicose 50% com 10ml?', back_content: '50% significa 50g em 100ml. Logo, em 10ml temos 5g (5000mg).' },
  { deck_category: 'Cálculo de Medicação', front_content: 'Diluição de Penicilina Cristalina 5.000.000 UI. O pó corresponde a quantos ml?', back_content: 'O pó corresponde a 2ml de volume. Se diluir com 8ml de água, o volume total será 10ml. Logo, 5.000.000 UI = 10ml.' },
  { deck_category: 'Cálculo de Medicação', front_content: 'Prescrição: 150mg de Amicacina. Frasco: 500mg/2ml. Quanto aspirar?', back_content: 'Regra de três: 500mg está para 2ml, assim como 150mg está para X. (150 * 2) / 500 = 300 / 500 = 0,6 ml.' },
  { deck_category: 'Cálculo de Medicação', front_content: 'Qual a fórmula para transformar soro (Glicose)?', back_content: 'C1 . V1 + C2 . V2 = C3 . V3 (Onde C é concentração e V é volume).' }
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

    // Inserção com verificação de duplicidade (não insere se já existe exatamente igual)
    for (const card of FLASHCARDS_DATA) {
        const { data: existing } = await supabaseAdmin
            .from('flashcards')
            .select('id')
            .eq('front_content', card.front_content)
            .single();

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