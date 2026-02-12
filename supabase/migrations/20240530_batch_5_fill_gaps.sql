-- PACOTE DE REFORÇO 5 (CORRIGIDO)
-- Foco: SAE, UTI, Imunização, Saúde do Trabalhador, Idoso e Fundamentos
-- Correção: Remoção de aspas internas que causavam erro de sintaxe

INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES

  -- 1. SISTEMATIZAÇÃO DA ASSISTÊNCIA (SAE)
  (
    'Sistematização da Assistência (SAE)',
    'De acordo com a Resolução COFEN 358/2009, a etapa do Processo de Enfermagem que envolve a determinação dos resultados que se espera alcançar e das ações ou intervenções de enfermagem é chamada de:',
    '[
      {"id": "A", "text": "Diagnóstico de Enfermagem."},
      {"id": "B", "text": "Planejamento de Enfermagem."},
      {"id": "C", "text": "Implementação."},
      {"id": "D", "text": "Avaliação de Enfermagem."}
    ]'::jsonb,
    'B',
    'O Planejamento é a etapa onde se definem as metas (NOC) e se prescrevem as intervenções (NIC) para atingi-las.',
    'COFEN'
  ),
  (
    'Sistematização da Assistência (SAE)',
    'Na Taxonomia da NANDA-I, um Diagnóstico de Enfermagem de "Risco" diferencia-se de um Diagnóstico com "Foco no Problema" por não apresentar:',
    '[
      {"id": "A", "text": "Título."},
      {"id": "B", "text": "Fatores de Risco."},
      {"id": "C", "text": "Definição."},
      {"id": "D", "text": "Características Definidoras (Sinais e Sintomas)."}
    ]'::jsonb,
    'D',
    'Diagnósticos de risco descrevem vulnerabilidades a problemas que ainda não aconteceram, portanto, não possuem sinais e sintomas (características definidoras) presentes.',
    'IBFC'
  ),
  (
    'Sistematização da Assistência (SAE)',
    'A classificação das Intervenções de Enfermagem, que padroniza a linguagem para descrever os tratamentos que os enfermeiros realizam, é conhecida pela sigla:',
    '[
      {"id": "A", "text": "NANDA."},
      {"id": "B", "text": "NOC."},
      {"id": "C", "text": "NIC."},
      {"id": "D", "text": "CIPE."}
    ]'::jsonb,
    'C',
    'NIC (Nursing Interventions Classification) é a taxonomia das intervenções. NANDA é para diagnósticos e NOC para resultados.',
    'VUNESP'
  ),
  (
    'Sistematização da Assistência (SAE)',
    'O Exame Físico é uma parte fundamental de qual etapa do Processo de Enfermagem?',
    '[
      {"id": "A", "text": "Coleta de Dados (Histórico)."},
      {"id": "B", "text": "Diagnóstico."},
      {"id": "C", "text": "Implementação."},
      {"id": "D", "text": "Avaliação."}
    ]'::jsonb,
    'A',
    'A Coleta de Dados ou Histórico de Enfermagem compreende a Anamnese (entrevista) e o Exame Físico.',
    'FGV'
  ),

  -- 2. TERAPIA INTENSIVA (UTI)
  (
    'Terapia Intensiva (UTI)',
    'Para prevenção da Pneumonia Associada à Ventilação Mecânica (PAV), o "bundle" de cuidados recomenda manter a cabeceira do leito elevada entre:',
    '[
      {"id": "A", "text": "0 e 15 graus."},
      {"id": "B", "text": "15 e 30 graus."},
      {"id": "C", "text": "30 e 45 graus."},
      {"id": "D", "text": "Acima de 60 graus."}
    ]'::jsonb,
    'C',
    'A elevação de 30-45º reduz o risco de broncoaspiração de conteúdo gástrico e secreções orofaríngeas, principal causa da PAV.',
    'ANVISA'
  ),
  (
    'Terapia Intensiva (UTI)',
    'A Escala de RASS (Richmond Agitation-Sedation Scale) é utilizada em UTI para avaliar o nível de sedação e agitação. Um paciente "Alerta e Calmo" recebe a pontuação:',
    '[
      {"id": "A", "text": "+4."},
      {"id": "B", "text": "0."},
      {"id": "C", "text": "-2."},
      {"id": "D", "text": "-5."}
    ]'::jsonb,
    'B',
    'O zero (0) é o estado neutro (alerta e calmo). Positivos indicam agitação (+4 combativo) e negativos indicam sedação (-5 não despertável).',
    'AMIB'
  ),
  (
    'Terapia Intensiva (UTI)',
    'Durante a monitorização da Pressão Arterial Invasiva (PAI), o transdutor de pressão deve ser nivelado na altura do:',
    '[
      {"id": "A", "text": "Apêndice Xifoide."},
      {"id": "B", "text": "Eixo Flebostático (4º espaço intercostal, linha axilar média)."},
      {"id": "C", "text": "Linha clavicular média."},
      {"id": "D", "text": "Lóbulo da orelha."}
    ]'::jsonb,
    'B',
    'O nivelamento incorreto altera o valor da PA. O eixo flebostático corresponde ao nível do átrio direito.',
    'EBSERH'
  ),
  (
    'Terapia Intensiva (UTI)',
    'A droga vasoativa de primeira escolha para o tratamento da hipotensão no Choque Séptico, visando manter a PAM >= 65 mmHg, é:',
    '[
      {"id": "A", "text": "Dobutamina."},
      {"id": "B", "text": "Noradrenalina."},
      {"id": "C", "text": "Adrenalina."},
      {"id": "D", "text": "Dopamina."}
    ]'::jsonb,
    'B',
    'A Noradrenalina é um potente vasoconstritor alfa-adrenérgico, sendo a escolha padrão-ouro para elevar a resistência vascular sistêmica na sepse.',
    'ILAS'
  ),

  -- 3. IMUNIZAÇÃO (PNI)
  (
    'Imunização',
    'A vacina BCG, indicada ao nascer para prevenir formas graves de tuberculose, é administrada por via:',
    '[
      {"id": "A", "text": "Intramuscular."},
      {"id": "B", "text": "Subcutânea."},
      {"id": "C", "text": "Intradérmica."},
      {"id": "D", "text": "Oral."}
    ]'::jsonb,
    'C',
    'A BCG é feita na inserção inferior do músculo deltoide direito, via intradérmica, formando a pápula característica.',
    'MS/PNI'
  ),
  (
    'Imunização',
    'Para a conservação adequada dos imunobiológicos na geladeira da sala de vacinas (nível local), a temperatura deve ser mantida entre:',
    '[
      {"id": "A", "text": "-2ºC e +2ºC."},
      {"id": "B", "text": "+2ºC e +8ºC."},
      {"id": "C", "text": "+8ºC e +12ºC."},
      {"id": "D", "text": "Temperatura ambiente (até 25ºC)."}
    ]'::jsonb,
    'B',
    'A faixa de segurança é de +2ºC a +8ºC, sendo +5ºC o ponto ideal para evitar tanto o congelamento quanto o aquecimento.',
    'MS/PNI'
  ),
  (
    'Imunização',
    'A Vacina Oral de Rotavírus Humano (VORH) possui um limite estrito de idade para a primeira dose. Ela não deve ser administrada se a criança tiver ultrapassado:',
    '[
      {"id": "A", "text": "2 meses e 15 dias."},
      {"id": "B", "text": "3 meses e 15 dias."},
      {"id": "C", "text": "4 meses."},
      {"id": "D", "text": "5 meses."}
    ]'::jsonb,
    'B',
    'A primeira dose da VORH tem prazo máximo de 3 meses e 15 dias para evitar o risco aumentado de invaginação intestinal.',
    'MS/PNI'
  ),
  (
    'Imunização',
    'Qual vacina do calendário do adulto deve ser reforçada a cada 10 anos?',
    '[
      {"id": "A", "text": "Hepatite B."},
      {"id": "B", "text": "Tríplice Viral."},
      {"id": "C", "text": "Febre Amarela."},
      {"id": "D", "text": "Dupla Adulto (dT - Difteria e Tétano)."}
    ]'::jsonb,
    'D',
    'A vacina dT exige reforços decenais por toda a vida. Em caso de ferimentos graves, o reforço pode ser antecipado se a última dose foi há mais de 5 anos.',
    'MS/PNI'
  ),

  -- 4. SAÚDE DO TRABALHADOR (NR-32)
  (
    'Saúde do Trabalhador',
    'Conforme a NR-32, os trabalhadores de saúde expostos a radiações ionizantes (Raio-X, Tomografia) devem obrigatoriamente:',
    '[
      {"id": "A", "text": "Usar dosímetro individual na altura do tórax."},
      {"id": "B", "text": "Realizar hemograma semanal."},
      {"id": "C", "text": "Ter jornada de trabalho de 12 horas."},
      {"id": "D", "text": "Receber adicional de periculosidade de 50%."}
    ]'::jsonb,
    'A',
    'O dosímetro monitora a dose de radiação acumulada recebida pelo profissional, garantindo que não ultrapasse os limites de segurança.',
    'NR-32'
  ),
  (
    'Saúde do Trabalhador',
    'Em caso de acidente de trabalho com material biológico (ex: picada de agulha), a Comunicação de Acidente de Trabalho (CAT) deve ser emitida:',
    '[
      {"id": "A", "text": "Apenas se o trabalhador ficar doente."},
      {"id": "B", "text": "Apenas se houver afastamento superior a 15 dias."},
      {"id": "C", "text": "Até o primeiro dia útil seguinte ao da ocorrência."},
      {"id": "D", "text": "No prazo de 30 dias."}
    ]'::jsonb,
    'C',
    'A emissão da CAT é obrigatória para todo acidente de trabalho, com ou sem afastamento, até o dia útil seguinte (ou imediato em caso de morte).',
    'Previdência Social'
  ),
  (
    'Saúde do Trabalhador',
    'A lavagem das mãos é a medida mais simples e eficaz para prevenir infecções. O uso de álcool gel 70% substitui a lavagem com água e sabão quando:',
    '[
      {"id": "A", "text": "As mãos estiverem visivelmente sujas de sangue."},
      {"id": "B", "text": "O profissional acabou de sair do banheiro."},
      {"id": "C", "text": "As mãos não estiverem visivelmente sujas."},
      {"id": "D", "text": "O paciente tiver diagnóstico de Clostridium difficile."}
    ]'::jsonb,
    'C',
    'O álcool gel é eficaz quando não há sujidade visível. Se houver matéria orgânica ou esporos (Clostridium), a lavagem com água e sabão é obrigatória.',
    'ANVISA'
  ),

  -- 5. SAÚDE DO IDOSO
  (
    'Saúde do Idoso',
    'Segundo o Estatuto do Idoso (Lei nº 10.741/2003), é considerada idosa a pessoa com idade igual ou superior a:',
    '[
      {"id": "A", "text": "55 anos."},
      {"id": "B", "text": "60 anos."},
      {"id": "C", "text": "65 anos."},
      {"id": "D", "text": "70 anos."}
    ]'::jsonb,
    'B',
    'No Brasil, para fins legais e de políticas públicas, o marco etário é 60 anos (diferente de países desenvolvidos onde pode ser 65).',
    'Estatuto do Idoso'
  ),
  (
    'Saúde do Idoso',
    'Uma das principais alterações fisiológicas do envelhecimento (senescência) no sistema cardiovascular é:',
    '[
      {"id": "A", "text": "Aumento da elasticidade vascular."},
      {"id": "B", "text": "Aumento da frequência cardíaca máxima."},
      {"id": "C", "text": "Rigidez arterial e aumento da resistência vascular periférica."},
      {"id": "D", "text": "Diminuição da pressão arterial sistólica."}
    ]'::jsonb,
    'C',
    'A perda de elastina e o acúmulo de colágeno tornam as artérias mais rígidas, predispondo à hipertensão sistólica isolada no idoso.',
    'SBGG'
  ),
  (
    'Saúde do Idoso',
    'A Escala de Katz é um instrumento amplamente utilizado na geriatria para avaliar:',
    '[
      {"id": "A", "text": "O risco de quedas."},
      {"id": "B", "text": "A capacidade cognitiva."},
      {"id": "C", "text": "A independência nas Atividades Básicas de Vida Diária (ABVD)."},
      {"id": "D", "text": "O estado nutricional."}
    ]'::jsonb,
    'C',
    'A Escala de Katz avalia 6 funções: banho, vestir-se, higiene pessoal, transferência, continência e alimentação.',
    'Ministério da Saúde'
  ),

  -- 6. ONCOLOGIA E CUIDADOS PALIATIVOS
  (
    'Oncologia',
    'Durante a infusão de quimioterápico vesicante, o paciente queixa-se de ardência e dor no local do acesso venoso. A primeira conduta do enfermeiro deve ser:',
    '[
      {"id": "A", "text": "Aumentar o gotejamento para terminar logo."},
      {"id": "B", "text": "Administrar analgésico e observar."},
      {"id": "C", "text": "Interromper a infusão imediatamente."},
      {"id": "D", "text": "Aplicar compressa quente sobre o cateter."}
    ]'::jsonb,
    'C',
    'A suspeita de extravasamento de droga vesicante é uma emergência oncológica. Deve-se parar a infusão, tentar aspirar o resíduo e só então retirar o acesso.',
    'INCA'
  ),
  (
    'Cuidados Paliativos',
    'Em cuidados paliativos, a respiração ruidosa típica da fase final de vida (estertor da morte), causada pelo acúmulo de secreções na orofaringe, pode ser manejada com:',
    '[
      {"id": "A", "text": "Aspiração traqueal profunda e vigorosa."},
      {"id": "B", "text": "Furosemida venosa."},
      {"id": "C", "text": "Anticolinérgicos (ex: Escopolamina/Buscopan) para secar secreções."},
      {"id": "D", "text": "Antibióticos de amplo espectro."}
    ]'::jsonb,
    'C',
    'A aspiração nessa fase é desconfortável e pouco efetiva. Anticolinérgicos ajudam a reduzir a produção de novas secreções, trazendo conforto.',
    'ANCP'
  ),

  -- 7. SAÚDE DA CRIANÇA E MULHER (Reforço)
  (
    'Saúde da Mulher e da Criança',
    'O Teste do Coraçãozinho (Oximetria de Pulso) deve ser realizado na triagem neonatal entre 24h e 48h de vida. O resultado é considerado NORMAL quando a saturação é:',
    '[
      {"id": "A", "text": "Maior ou igual a 95% em ambas as medidas e diferença menor que 3% entre elas."},
      {"id": "B", "text": "Maior que 90% em qualquer membro."},
      {"id": "C", "text": "Menor que 95%, mas sem cianose."},
      {"id": "D", "text": "Qualquer valor, desde que o bebê não chore."}
    ]'::jsonb,
    'A',
    'O teste compara a SpO2 no membro superior direito (pré-ductal) e um dos membros inferiores (pós-ductal) para detectar cardiopatias críticas.',
    'SBP'
  ),
  (
    'Saúde da Mulher e da Criança',
    'A principal causa de parada cardiorrespiratória (PCR) em crianças é de origem:',
    '[
      {"id": "A", "text": "Cardíaca (arritmias)."},
      {"id": "B", "text": "Respiratória (hipóxia)."},
      {"id": "C", "text": "Neurológica."},
      {"id": "D", "text": "Metabólica."}
    ]'::jsonb,
    'B',
    'Diferente dos adultos, a PCR pediátrica raramente é súbita/cardíaca. Geralmente é resultado final de insuficiência respiratória ou choque progressivo.',
    'PALS'
  ),
  (
    'Saúde da Mulher e da Criança',
    'A colpocitologia oncótica (Papanicolau) é o exame de rastreamento para câncer de colo do útero. Segundo o Ministério da Saúde, a população-alvo e a periodicidade recomendada são:',
    '[
      {"id": "A", "text": "Todas as mulheres que já iniciaram atividade sexual, anualmente."},
      {"id": "B", "text": "Mulheres de 25 a 64 anos. Após dois exames anuais consecutivos normais, a cada 3 anos."},
      {"id": "C", "text": "Mulheres a partir de 18 anos, semestralmente."},
      {"id": "D", "text": "Apenas mulheres com sintomas, a qualquer idade."}
    ]'::jsonb,
    'B',
    'O rastreio organizado foca na faixa etária de maior risco e na periodicidade trienal após resultados negativos iniciais.',
    'INCA/MS'
  ),
  (
    'Saúde da Mulher e da Criança',
    'A Data Provável do Parto (DPP) calculada pela Regra de Naegele para uma DUM (Data da Última Menstruação) de 10/05/2023 é:',
    '[
      {"id": "A", "text": "17/01/2024."},
      {"id": "B", "text": "17/02/2024."},
      {"id": "C", "text": "10/02/2024."},
      {"id": "D", "text": "07/02/2024."}
    ]'::jsonb,
    'B',
    'Regra de Naegele: Dia + 7, Mês - 3 (ou +9), Ano ajustado. 10+7=17. Maio(5) - 3 = Fevereiro(2). Ano seguinte = 2024. Resposta: 17/02/2024.',
    'Obstetrícia'
  ),

  -- 8. GERAIS E TÉCNICAS BÁSICAS
  (
    'Fundamentos de Enfermagem',
    'Ao realizar uma punção venosa periférica, o garrote deve permanecer no membro do paciente pelo menor tempo possível, idealmente não ultrapassando:',
    '[
      {"id": "A", "text": "30 segundos."},
      {"id": "B", "text": "1 a 2 minutos."},
      {"id": "C", "text": "5 minutos."},
      {"id": "D", "text": "10 minutos."}
    ]'::jsonb,
    'B',
    'Garroteamento prolongado causa hemoconcentração (altera exames), dor e risco de lesão tecidual. Recomenda-se soltar assim que houver refluxo de sangue.',
    'Potter & Perry'
  ),
  (
    'Fundamentos de Enfermagem',
    'A posição de Fowler (cabeceira elevada entre 45º e 60º) é indicada principalmente para:',
    '[
      {"id": "A", "text": "Melhorar o retorno venoso em casos de choque."},
      {"id": "B", "text": "Facilitar a expansão pulmonar e melhorar a respiração."},
      {"id": "C", "text": "Prevenir úlceras de pressão sacrais."},
      {"id": "D", "text": "Facilitar a drenagem postural de lobos inferiores."}
    ]'::jsonb,
    'B',
    'A gravidade abaixa o diafragma, permitindo maior expansão torácica. É a posição de escolha para dispneia e alimentação.',
    'Fundamentos'
  ),
  (
    'Fundamentos de Enfermagem',
    'Na anotação de enfermagem, ao cometer um erro de escrita, a conduta correta é:',
    '[
      {"id": "A", "text": "Usar corretivo líquido para apagar o erro."},
      {"id": "B", "text": "Rabiscar ou tachar a palavra errada para que não possa ser lida."},
      {"id": "C", "text": "Colocar a palavra errada entre parênteses e escrever digo em seguida, seguido da correção."},
      {"id": "D", "text": "Arrancar a folha e reescrever tudo."}
    ]'::jsonb,
    'C',
    'O prontuário é documento legal. Não pode haver rasuras, corretivos ou folhas arrancadas. O erro deve ser corrigido mantendo a legibilidade do original.',
    'COFEN'
  ),
  (
    'Farmacologia',
    'A via de administração de medicamentos que evita a passagem pelo fígado (efeito de primeira passagem), garantindo absorção rápida através da mucosa, é a:',
    '[
      {"id": "A", "text": "Via Oral."},
      {"id": "B", "text": "Via Sublingual."},
      {"id": "C", "text": "Via Intradérmica."},
      {"id": "D", "text": "Via Subcutânea."}
    ]'::jsonb,
    'B',
    'A região sublingual é ricamente vascularizada e drena para a veia cava superior, indo direto ao coração sem passar pelo sistema porta-hepático inicial.',
    'Farmacologia'
  ),
  (
    'Saúde Mental e Psiquiatria',
    'O principal neurotransmissor inibitório do Sistema Nervoso Central, cuja ação é potencializada pelos Benzodiazepínicos (ex: Diazepam), é o:',
    '[
      {"id": "A", "text": "Glutamato."},
      {"id": "B", "text": "Dopamina."},
      {"id": "C", "text": "GABA (Ácido gama-aminobutírico)."},
      {"id": "D", "text": "Serotonina."}
    ]'::jsonb,
    'C',
    'O GABA reduz a excitabilidade neuronal. Os benzodiazepínicos se ligam aos receptores GABA, aumentando sua eficácia, causando sedação e relaxamento.',
    'Farmacologia'
  ),
  (
    'Urgência e Emergência',
    'Em uma vítima de trauma torácico, a presença de respiração paradoxal (movimento de uma parte do tórax oposto ao restante durante a respiração) sugere:',
    '[
      {"id": "A", "text": "Pneumotórax hipertensivo."},
      {"id": "B", "text": "Tórax instável (fratura de múltiplos arcos costais em 2 ou mais pontos)."},
      {"id": "C", "text": "Hemotórax maciço."},
      {"id": "D", "text": "Tamponamento cardíaco."}
    ]'::jsonb,
    'B',
    'O segmento fraturado fica solto e é sugado na inspiração (pressão negativa) e empurrado na expiração, movimento contrário ao normal.',
    'PHTLS'
  )
ON CONFLICT (question) DO NOTHING;