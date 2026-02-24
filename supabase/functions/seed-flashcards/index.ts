import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FLASHCARDS_DATA = [
  // --- EXISTENTES (Mantidos) ---
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
  { deck_category: 'Cálculo de Medicação', front_content: 'Qual a fórmula para transformar soro (Glicose)?', back_content: 'C1 . V1 + C2 . V2 = C3 . V3 (Onde C é concentração e V é volume).' },

  { deck_category: 'Imunização (PNI)', front_content: 'Quais vacinas devem ser administradas ao nascer?', back_content: 'BCG (Intradérmica) e Hepatite B (Intramuscular).' },
  { deck_category: 'Imunização (PNI)', front_content: 'Qual a diferença entre a vacina VIP e a VOP contra poliomielite?', back_content: 'VIP é inativada (vírus morto, injetável). VOP é atenuada (vírus vivo, oral). Atualmente, a VIP substituiu a VOP na maioria das doses.' },
  { deck_category: 'Imunização (PNI)', front_content: 'Qual a idade recomendada para a vacina de Febre Amarela no calendário básico?', back_content: 'Aos 9 meses de idade (dose única, com reforço aos 4 anos).' },
  { deck_category: 'Imunização (PNI)', front_content: 'Quais vacinas compõem a "Tríplice Viral"?', back_content: 'Sarampo, Caxumba e Rubéola.' },
  { deck_category: 'Imunização (PNI)', front_content: 'Qual a recomendação atual da vacina HPV para adolescentes (meninas e meninos)?', back_content: 'Meninas e Meninos de 9 a 14 anos. O esquema passou a ser de DOSE ÚNICA para imunocompetentes.' },
  { deck_category: 'Imunização (PNI)', front_content: 'Qual vacina a gestante deve tomar a partir da 20ª semana a cada gestação?', back_content: 'dTpa (Difteria, Tétano e Coqueluche acelular) para proteção do recém-nascido contra coqueluche.' },
  { deck_category: 'Imunização (PNI)', front_content: 'Quais vacinas são administradas aos 2 meses de idade?', back_content: 'Penta (DTP+Hib+HepB), VIP (Pólio), VORH (Rotavírus) e Pneumocócica 10V.' },
  { deck_category: 'Imunização (PNI)', front_content: 'Qual é a via de administração da vacina Tríplice Viral?', back_content: 'Subcutânea.' },
  
  { deck_category: 'Fundamentos de Enfermagem', front_content: 'Quais são os 5 sinais vitais padrão?', back_content: 'Temperatura, Pulso (FC), Respiração (FR), Pressão Arterial (PA) e Dor (5º sinal).' },
  { deck_category: 'Fundamentos de Enfermagem', front_content: 'Qual o ângulo correto para administração Intradérmica (ID)?', back_content: '10 a 15 graus (bisel para cima).' },
  { deck_category: 'Fundamentos de Enfermagem', front_content: 'Qual o local de escolha para injeção Intramuscular (IM) em menores de 2 anos?', back_content: 'Músculo Vasto Lateral da Coxa.' },
  { deck_category: 'Fundamentos de Enfermagem', front_content: 'O que é a Posição de Fowler?', back_content: 'Paciente semi-sentado, com cabeceira elevada entre 45º a 60º. Indicada para melhorar a expansibilidade torácica.' },
  { deck_category: 'Fundamentos de Enfermagem', front_content: 'Qual a diferença entre Nictúria e Disúria?', back_content: 'Nictúria: Micção excessiva à noite. Disúria: Dor, ardor ou desconforto ao urinar.' },
  { deck_category: 'Fundamentos de Enfermagem', front_content: 'O que caracteriza o pulso filiforme?', back_content: 'Pulso fraco, fino e difícil de palpar (comum em choque/hipovolemia).' },
  { deck_category: 'Fundamentos de Enfermagem', front_content: 'Qual o tempo mínimo recomendado para a higienização simples das mãos com água e sabonete?', back_content: 'De 40 a 60 segundos.' },
  { deck_category: 'Fundamentos de Enfermagem', front_content: 'O que é Bradipneia?', back_content: 'Frequência respiratória abaixo do normal (< 12 irpm em adultos).' },
  { deck_category: 'Fundamentos de Enfermagem', front_content: 'O que é a Posição de Trendelenburg?', back_content: 'Decúbito dorsal com o corpo inclinado, de forma que a cabeça fique mais baixa que os pés.' },

  // --- REFORÇO CME/CENTRO CIRÚRGICO (Existentes) ---
  { deck_category: 'Centro Cirúrgico', front_content: 'Segundo a classificação de Spaulding, o que são Artigos Críticos?', back_content: 'Artigos que penetram tecidos estéreis ou sistema vascular. Exigem ESTERILIZAÇÃO. Ex: Bisturi, pinças cirúrgicas.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Segundo a classificação de Spaulding, o que são Artigos Semicríticos?', back_content: 'Artigos que entram em contato com pele não íntegra ou mucosas íntegras. Exigem DESINFECÇÃO DE ALTO NÍVEL. Ex: Endoscópios, lâminas de laringoscópio.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Qual é o bioindicador utilizado para testar a autoclave (vapor saturado)?', back_content: 'Esporos de Geobacillus stearothermophilus.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'O que é o Teste de Bowie-Dick?', back_content: 'Teste químico diário para verificar a eficácia da remoção de ar e penetração do vapor em autoclaves pré-vácuo.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'O que é o "Time Out" na Cirurgia Segura?', back_content: 'É a pausa cirúrgica realizada imediatamente antes da incisão da pele. Confirma-se: paciente, sítio, procedimento e posicionamento.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'O que significa o tempo cirúrgico "Hemostasia"?', back_content: 'É o procedimento para deter o sangramento (pinçamento, ligadura, eletrocauterização).' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Qual a diferença entre Assepsia e Antissepsia?', back_content: 'Assepsia: Medidas para impedir a entrada de germes em local estéril (ambiente). Antissepsia: Eliminação de germes em tecidos vivos (pele/mucosa).' },

  // --- NOVAS 15 CARTAS: CME (RDC 15/2012) ---
  { deck_category: 'Centro Cirúrgico', front_content: 'O que é o fluxo unidirecional na CME e qual sua importância?', back_content: 'É o fluxo de trabalho que vai da área suja (expurgo) para a limpa (preparo) e estéril (guarda), sem cruzamento, para evitar contaminação cruzada.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'O que define uma CME Classe II segundo a RDC 15/2012?', back_content: 'É aquela que processa materiais complexos (conformation não tubular/tubular) e não complexos, atendendo a serviços de saúde que realizam cirurgias.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Qual a definição técnica de "Limpeza" na CME?', back_content: 'É a remoção de sujidade visível (orgânica e inorgânica) e redução da carga microbiana, sendo o passo obrigatório antes da desinfecção ou esterilização.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Qual a função do Detergente Enzimático?', back_content: 'Contém enzimas (proteases, lipases, amilases) que quebram a matéria orgânica (sangue, gordura) facilitando sua remoção dos instrumentais.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'O que são Indicadores Químicos Classe 5 (Integradores)?', back_content: 'São indicadores internos que monitoram todos os parâmetros críticos da esterilização (tempo, temperatura e presença de vapor), mimetizando a morte microbiana.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'O que são Indicadores Químicos Classe 6 (Emuladores)?', back_content: 'São indicadores de ciclo específico que reagem apenas quando 95% dos parâmetros do ciclo (tempo/temperatura) são atingidos. Ex: ciclo de Príons.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Com que frequência o Teste de Bowie-Dick deve ser realizado?', back_content: 'Diariamente, no primeiro ciclo do dia, com a autoclave vazia (apenas o pacote teste), em autoclaves com bomba de vácuo.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Qual a frequência mínima obrigatória para uso de Indicador Biológico segundo a RDC 15?', back_content: 'No mínimo semanalmente e em toda carga que contenha materiais implantáveis (que só podem ser liberados após o resultado negativo).' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Qual a diferença de pressão de ar entre a área de Expurgo e a área de Preparo?', back_content: 'A área de Expurgo (suja) deve ter pressão negativa (o ar não sai para outras áreas). A área de Preparo (limpa) deve ter pressão positiva.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'O que significa o conceito de "validade baseada em eventos" para estéreis?', back_content: 'Significa que a esterilidade é mantida enquanto a embalagem estiver íntegra, limpa e seca, e não apenas por um prazo de validade fixo (tempo).' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Quais os EPIs obrigatórios para a área de Expurgo (Limpeza) na CME?', back_content: 'Luvas de borracha grossa/nitrílica (cano longo), avental impermeável, máscara, óculos de proteção (ou viseira), touca e calçado fechado impermeável.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'O que é Desinfecção de Alto Nível e qual produto é comumente usado?', back_content: 'Processo que elimina bactérias vegetativas, micobactérias, fungos, vírus e alguns esporos. Ex: Glutaraldeído, Ácido Peracético ou OPA (Ortoftalaldeído).' },
  { deck_category: 'Centro Cirúrgico', front_content: 'Quais são os parâmetros físicos monitorados na autoclave a vapor?', back_content: 'Temperatura (ex: 134°C ou 121°C), Tempo de exposição e Pressão da câmara.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'O que é a Esterilização "Flash" (Uso Imediato) e quando é permitida?', back_content: 'É um ciclo rápido sem embalagem ou com container específico. Só é permitida em urgências, para uso imediato, não podendo o material ser armazenado.' },
  { deck_category: 'Centro Cirúrgico', front_content: 'O que é Rastreabilidade no processamento de produtos para saúde?', back_content: 'É a capacidade de recuperar o histórico do processo (quem lavou, quem esterilizou, qual autoclave, qual ciclo, testes realizados) através de registros/etiquetas.' }
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