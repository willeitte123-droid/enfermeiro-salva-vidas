INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES
(
  'Saúde Pública e Imunização',
  'De acordo com o Calendário Nacional de Vacinação do Ministério da Saúde, quais vacinas devem ser administradas ao recém-nascido, preferencialmente nas primeiras 12 horas de vida?',
  '[
    {"id": "A", "text": "BCG e Poliomielite (VIP)."},
    {"id": "B", "text": "BCG e Hepatite B."},
    {"id": "C", "text": "Hepatite B e Poliomielite (VOP)."},
    {"id": "D", "text": "BCG e Pentavalente."}
  ]'::jsonb,
  'B',
  'Ao nascer, a criança deve receber a BCG (dose única) para prevenir formas graves de tuberculose e a primeira dose da vacina contra Hepatite B.',
  'VUNESP'
),
(
  'Saúde Pública e Imunização',
  'A vacina Pentavalente, administrada aos 2, 4 e 6 meses de idade, protege contra quais doenças?',
  '[
    {"id": "A", "text": "Difteria, Tétano, Coqueluche, Hepatite B e Meningite C."},
    {"id": "B", "text": "Difteria, Tétano, Coqueluche, Hepatite B e Haemophilus influenzae tipo b."},
    {"id": "C", "text": "Sarampo, Caxumba, Rubéola, Varicela e Hepatite A."},
    {"id": "D", "text": "Poliomielite, Tétano, Coqueluche, Hepatite B e Rotavírus."}
  ]'::jsonb,
  'B',
  'A Pentavalente protege contra 5 doenças: Difteria, Tétano, Coqueluche (DTP), Hepatite B e Haemophilus influenzae tipo b (Hib).',
  'IBFC'
),
(
  'Saúde Pública e Imunização',
  'Sobre a conservação de imunobiológicos na Rede de Frio, a temperatura ideal da geladeira na sala de vacina deve ser mantida entre:',
  '[
    {"id": "A", "text": "-2°C e 0°C."},
    {"id": "B", "text": "+2°C e +8°C, sendo ideal +5°C."},
    {"id": "C", "text": "+8°C e +12°C."},
    {"id": "D", "text": "0°C e +10°C."}
  ]'::jsonb,
  'B',
  'A faixa de segurança para a maioria das vacinas é de +2°C a +8°C. A temperatura de +5°C é considerada o alvo ideal para evitar congelamento ou aquecimento.',
  'FCC'
),
(
  'Saúde Pública e Imunização',
  'Qual das seguintes vacinas é composta por vírus vivo atenuado e é contraindicada para gestantes e imunodeprimidos graves?',
  '[
    {"id": "A", "text": "Influenza (Gripe)."},
    {"id": "B", "text": "Hepatite B."},
    {"id": "C", "text": "Tríplice Viral (Sarampo, Caxumba e Rubéola)."},
    {"id": "D", "text": "dT (Dupla Adulto)."}
  ]'::jsonb,
  'C',
  'Vacinas de vírus vivos (como Tríplice Viral, Febre Amarela, Varicela) têm risco teórico de causar a doença no feto ou em imunodeprimidos, sendo contraindicadas.',
  'FGV'
),
(
  'Saúde Pública e Imunização',
  'A vacina contra o Papilomavírus Humano (HPV) é disponibilizada no SUS. Qual é a população-alvo e o esquema vacinal atual para meninas e meninos imunocompetentes?',
  '[
    {"id": "A", "text": "9 a 14 anos, esquema de duas doses (0 e 6 meses)."},
    {"id": "B", "text": "9 a 14 anos, esquema de dose única."},
    {"id": "C", "text": "11 a 14 anos, esquema de três doses."},
    {"id": "D", "text": "15 a 26 anos, esquema de duas doses."}
  ]'::jsonb,
  'B',
  'O Ministério da Saúde atualizou o esquema em 2024: A vacina HPV quadrivalente passou a ser DOSE ÚNICA para meninas e meninos de 9 a 14 anos.',
  'MS/PNI'
),
(
  'Saúde Pública e Imunização',
  'A vacina Rotavírus Humano (VORH) deve ser administrada via oral. Qual é o limite de idade para a administração da PRIMEIRA dose?',
  '[
    {"id": "A", "text": "2 meses."},
    {"id": "B", "text": "3 meses e 15 dias."},
    {"id": "C", "text": "5 meses."},
    {"id": "D", "text": "7 meses e 29 dias."}
  ]'::jsonb,
  'B',
  'A VORH tem prazos rígidos para evitar intussuscepção intestinal. 1ª dose: até 3 meses e 15 dias. 2ª dose: até 7 meses e 29 dias.',
  'CEBRASPE'
),
(
  'Saúde Pública e Imunização',
  'Em relação à vacina BCG, é correto afirmar:',
  '[
    {"id": "A", "text": "Deve ser administrada por via intramuscular profunda."},
    {"id": "B", "text": "A ausência da cicatriz vacinal após 6 meses indica necessidade de revacinação."},
    {"id": "C", "text": "É administrada por via intradérmica, na inserção inferior do músculo deltoide direito."},
    {"id": "D", "text": "A revacinação de crianças sem cicatriz não é mais recomendada pelo Ministério da Saúde."}
  ]'::jsonb,
  'D',
  'O MS não recomenda mais a revacinação de crianças que não desenvolveram a cicatriz da BCG, pois a ausência de cicatriz não significa falta de proteção.',
  'IDECAN'
),
(
  'Saúde Pública e Imunização',
  'Qual vacina deve ser administrada a partir da 20ª semana de gestação, a cada gestação, para proteger o recém-nascido contra a coqueluche?',
  '[
    {"id": "A", "text": "dT (Dupla Adulto)."},
    {"id": "B", "text": "Hepatite B."},
    {"id": "C", "text": "dTpa (Tríplice Bacteriana Acelular)."},
    {"id": "D", "text": "Influenza."}
  ]'::jsonb,
  'C',
  'A dTpa é indicada para gestantes a partir da 20ª semana para transferir anticorpos contra a coqueluche (Bordetella pertussis) para o feto via transplacentária.',
  'CONSULPLAN'
),
(
  'Saúde Pública e Imunização',
  'Um evento adverso pós-vacinação (EAPV) caracterizado por hipotonia, hiporresponsividade e palidez, ocorrendo nas primeiras 48h após a vacinação (geralmente Pertussis), é chamado de:',
  '[
    {"id": "A", "text": "Choque Anafilático."},
    {"id": "B", "text": "Episódio Hipotônico-Hiporresponsivo (EHH)."},
    {"id": "C", "text": "Síndrome de Guillain-Barré."},
    {"id": "D", "text": "Convulsão Febril."}
  ]'::jsonb,
  'B',
  'O EHH é um evento raro e assustador, mas benigno e autolimitado, associado ao componente pertussis (célula inteira) da DTP/Penta.',
  'AOCP'
),
(
  'Saúde Pública e Imunização',
  'Sobre a vacina Febre Amarela, qual a recomendação atual para áreas com recomendação de vacina (ACRV)?',
  '[
    {"id": "A", "text": "Dose única aos 9 meses, sem necessidade de reforço."},
    {"id": "B", "text": "Uma dose aos 9 meses e um reforço aos 4 anos de idade."},
    {"id": "C", "text": "Reforço a cada 10 anos para todos os adultos."},
    {"id": "D", "text": "Apenas para viajantes internacionais."}
  ]'::jsonb,
  'B',
  'Para crianças, o esquema é uma dose aos 9 meses e reforço aos 4 anos. Para quem toma a primeira dose após os 5 anos, é dose única.',
  'IBFC'
),
(
  'Saúde Pública e Imunização',
  'Quais vacinas NUNCA devem ser congeladas, pois perdem a potência e podem provocar reações adversas aumentadas?',
  '[
    {"id": "A", "text": "VOP e Febre Amarela."},
    {"id": "B", "text": "Tríplice Viral e Varicela."},
    {"id": "C", "text": "Vacinas contendo adjuvante de alumínio (Tétano, Hepatite B, Penta, Pneumo)."},
    {"id": "D", "text": "Todas as vacinas podem ser congeladas."}
  ]'::jsonb,
  'C',
  'Vacinas com adjuvante de alumínio (toxóides e inativadas) sofrem ''desaglomeração'' do adjuvante se congeladas, perdendo eficácia e causando abcessos.',
  'VUNESP'
),
(
  'Saúde Pública e Imunização',
  'A vacina Meningocócica C (Conjugada) faz parte do calendário infantil. Qual é o esquema básico recomendado?',
  '[
    {"id": "A", "text": "Dose única aos 12 meses."},
    {"id": "B", "text": "Duas doses (3 e 5 meses) e reforço aos 12 meses."},
    {"id": "C", "text": "Três doses (2, 4 e 6 meses) sem reforço."},
    {"id": "D", "text": "Apenas para adolescentes."}
  ]'::jsonb,
  'B',
  'O esquema da Meningo C é: 1ª dose aos 3 meses, 2ª dose aos 5 meses e Reforço aos 12 meses.',
  'FGV'
),
(
  'Saúde Pública e Imunização',
  'Qual vacina substituiu a VOP (Gotinha) nas doses de 2, 4 e 6 meses para evitar a poliomielite vacinal?',
  '[
    {"id": "A", "text": "VIP (Vacina Inativada Poliomielite)."},
    {"id": "B", "text": "Sabin."},
    {"id": "C", "text": "Pentavalente."},
    {"id": "D", "text": "DTP."}
  ]'::jsonb,
  'A',
  'A VIP (injetável/vírus morto) é usada nas 3 primeiras doses para garantir imunidade sem risco de pólio vacinal. A VOP é usada apenas nos reforços (ou campanhas, embora a tendência seja a substituição total).',
  'CEBRASPE'
),
(
  'Saúde Pública e Imunização',
  'Um profissional de saúde sofreu acidente com perfurocortante. Ele não tem anticorpos para Hepatite B (Anti-HBs negativo) e o paciente fonte é HBsAg positivo. Qual a conduta?',
  '[
    {"id": "A", "text": "Apenas lavar o local."},
    {"id": "B", "text": "Iniciar esquema de vacina completo (0-1-6 meses)."},
    {"id": "C", "text": "Administrar Imunoglobulina Humana Anti-Hepatite B (IGHAHB) + Iniciar Vacina."},
    {"id": "D", "text": "Tomar apenas um reforço da vacina."}
  ]'::jsonb,
  'C',
  'Se o profissional é suscetível e a fonte é positiva (alto risco), deve-se fazer a profilaxia passiva (Imunoglobulina) E ativa (Vacina) simultaneamente em sítios diferentes.',
  'FCC'
),
(
  'Saúde Pública e Imunização',
  'A vacina Tríplice Viral protege contra:',
  '[
    {"id": "A", "text": "Sarampo, Rubéola e Varicela."},
    {"id": "B", "text": "Sarampo, Caxumba e Rubéola."},
    {"id": "C", "text": "Difteria, Tétano e Coqueluche."},
    {"id": "D", "text": "Caxumba, Rubéola e Varicela."}
  ]'::jsonb,
  'B',
  'SCR: Sarampo, Caxumba e Rubéola. A Tetra Viral inclui a Varicela.',
  'CONSULPLAN'
),
(
  'Saúde Pública e Imunização',
  'Qual é a via de administração e o local recomendado para a vacina Hepatite B em recém-nascidos?',
  '[
    {"id": "A", "text": "Subcutânea, no braço."},
    {"id": "B", "text": "Intramuscular, no glúteo."},
    {"id": "C", "text": "Intramuscular, no vasto lateral da coxa."},
    {"id": "D", "text": "Intradérmica, no deltoide."}
  ]'::jsonb,
  'C',
  'Em menores de 2 anos, o local de escolha para IM é o Vasto Lateral da Coxa (músculo da coxa), para evitar lesão no nervo ciático e garantir boa absorção.',
  'IBFC'
),
(
  'Saúde Pública e Imunização',
  'O Programa Nacional de Imunizações (PNI) recomenda a vacina Pneumocócica 10-valente para crianças. Qual o objetivo principal desta vacina?',
  '[
    {"id": "A", "text": "Prevenir pneumonia viral."},
    {"id": "B", "text": "Prevenir doenças invasivas (meningite, sepse, pneumonia) causadas pelo Streptococcus pneumoniae."},
    {"id": "C", "text": "Prevenir infecções de ouvido apenas."},
    {"id": "D", "text": "Prevenir tuberculose pulmonar."}
  ]'::jsonb,
  'B',
  'A Pneumo-10 protege contra os 10 sorotipos mais prevalentes de pneumococo, focando na redução de doenças invasivas graves e mortalidade infantil.',
  'AOCP'
),
(
  'Saúde Pública e Imunização',
  'A vacina contra Varicela (Catapora) está disponível no SUS. Ela é administrada como:',
  '[
    {"id": "A", "text": "Dose única aos 12 meses (como monovalente)."},
    {"id": "B", "text": "Uma dose aos 15 meses (Tetra Viral) e outra aos 4 anos (Varicela monovalente)."},
    {"id": "C", "text": "Apenas em surtos."},
    {"id": "D", "text": "Três doses no primeiro ano de vida."}
  ]'::jsonb,
  'B',
  'O esquema atual inclui a 1ª dose aos 15 meses (dentro da Tetra Viral) e uma 2ª dose (reforço) aos 4 anos com a vacina Varicela atenuada.',
  'VUNESP'
),
(
  'Saúde Pública e Imunização',
  'Sobre a conservação de vacinas após a abertura do frasco multidoses, qual a regra geral para vacinas liofilizadas (ex: Tríplice Viral, Febre Amarela) após reconstituição?',
  '[
    {"id": "A", "text": "Podem ser usadas por até 30 dias se refrigeradas."},
    {"id": "B", "text": "Devem ser usadas em até 6 a 8 horas (conforme bula) e descartadas ao final do prazo ou da jornada."},
    {"id": "C", "text": "Devem ser usadas imediatamente e o frasco descartado."},
    {"id": "D", "text": "Podem ser recongeladas para uso posterior."}
  ]'::jsonb,
  'B',
  'Vacinas liofilizadas reconstituídas têm validade curta (geralmente 6h a 8h) devido à perda de potência e risco de contaminação. Devem ser mantidas refrigeradas durante o uso.',
  'IDECAN'
),
(
  'Saúde Pública e Imunização',
  'A vacina Hepatite A foi introduzida no calendário infantil. Qual é a idade recomendada para sua administração?',
  '[
    {"id": "A", "text": "Ao nascer."},
    {"id": "B", "text": "Aos 6 meses."},
    {"id": "C", "text": "Aos 12 meses."},
    {"id": "D", "text": "Aos 15 meses."}
  ]'::jsonb,
  'D',
  'A vacina Hepatite A é dose única aos 15 meses de idade.',
  'FGV'
)
ON CONFLICT (question) DO NOTHING;