-- PACOTE DE REFORÇO 3: NEURO, GERENCIAMENTO, SEMIOLOGIA E URGÊNCIA
-- Foco: Preencher lacunas em matérias técnicas e administrativas

INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES

  -- 1. NEUROLOGIA (Matéria com poucas questões)
  (
    'Neurologia',
    'Na aplicação da Escala de Coma de Glasgow (atualizada), a resposta motora "Decorticação" (flexão anormal) recebe a pontuação:',
    '[
      {"id": "A", "text": "2 pontos."},
      {"id": "B", "text": "3 pontos."},
      {"id": "C", "text": "4 pontos."},
      {"id": "D", "text": "5 pontos."}
    ]'::jsonb,
    'B',
    'Na resposta motora: Obedece (6), Localiza (5), Flexão Normal/Retirada (4), Flexão Anormal/Decorticação (3), Extensão/Descerebração (2), Nenhuma (1).',
    'VUNESP'
  ),
  (
    'Neurologia',
    'Um paciente apresenta paralisia facial súbita, perda de força no braço esquerdo e fala disártrica. A escala pré-hospitalar utilizada para triagem rápida de AVC é:',
    '[
      {"id": "A", "text": "Escala de Braden."},
      {"id": "B", "text": "Escala de Cincinnati."},
      {"id": "C", "text": "Escala de Morse."},
      {"id": "D", "text": "Escala de Ramsay."}
    ]'::jsonb,
    'B',
    'A Escala de Cincinnati avalia 3 sinais: Desvio de rima labial (Sorria), Queda do braço (Abrace) e Fala anormal (Cante).',
    'IBFC'
  ),
  (
    'Neurologia',
    'Durante uma crise convulsiva tônico-clônica generalizada, a prioridade da assistência de enfermagem é:',
    '[
      {"id": "A", "text": "Conter os movimentos dos membros com força."},
      {"id": "B", "text": "Inserir uma cânula de Guedel ou objeto na boca para proteger a língua."},
      {"id": "C", "text": "Proteger a cabeça, lateralizar o paciente (se possível) e garantir via aérea."},
      {"id": "D", "text": "Administrar medicação via oral imediatamente."}
    ]'::jsonb,
    'C',
    'Nunca se deve introduzir objetos na boca ou conter à força. O foco é evitar traumas (cabeça) e broncoaspiração (lateralizar).',
    'FCC'
  ),
  (
    'Neurologia',
    'A Tríade de Cushing, indicativa de hipertensão intracraniana grave e risco de herniação cerebral, é composta por:',
    '[
      {"id": "A", "text": "Hipotensão, Taquicardia e Taquipneia."},
      {"id": "B", "text": "Hipertensão arterial, Bradicardia e Alteração do ritmo respiratório."},
      {"id": "C", "text": "Hipertermia, Taquicardia e Hipertensão."},
      {"id": "D", "text": "Cefaleia, Vômitos e Rigidez de nuca."}
    ]'::jsonb,
    'B',
    'A tríade (HAS + Bradicardia + Respiração irregular) é uma resposta fisiológica tardia e grave à isquemia do tronco encefálico por compressão.',
    'EBSERH'
  ),
  (
    'Neurologia',
    'Qual o exame padrão-ouro (gold standard) a ser realizado imediatamente na suspeita de AVC para diferenciar o tipo isquêmico do hemorrágico?',
    '[
      {"id": "A", "text": "Ressonância Magnética."},
      {"id": "B", "text": "Eletroencefalograma."},
      {"id": "C", "text": "Tomografia Computadorizada (TC) de crânio sem contraste."},
      {"id": "D", "text": "Doppler de Carótidas."}
    ]'::jsonb,
    'C',
    'A TC sem contraste é rápida e eficaz para descartar sangramento (hemorrágico), permitindo a decisão de trombólise no isquêmico.',
    'CESPE'
  ),

  -- 2. GERENCIAMENTO E ADMINISTRAÇÃO (Matéria com poucas questões)
  (
    'Administração em Enfermagem',
    'No dimensionamento de pessoal de enfermagem (Resolução COFEN 543/2017), um paciente classificado como de "Cuidados Semi-intensivos" requer quantas horas de enfermagem nas 24 horas?',
    '[
      {"id": "A", "text": "4 horas."},
      {"id": "B", "text": "6 horas."},
      {"id": "C", "text": "10 horas."},
      {"id": "D", "text": "18 horas."}
    ]'::jsonb,
    'C',
    'Cuidados Semi-intensivos requerem 10 horas de enfermagem. Alta dependência também são 10 horas. Intensivos são 18 horas.',
    'COFEN'
  ),
  (
    'Administração em Enfermagem',
    'O estilo de liderança em que o enfermeiro toma todas as decisões sozinho, sem consultar a equipe, focado apenas nas tarefas e na hierarquia, é chamado de:',
    '[
      {"id": "A", "text": "Liderança Democrática."},
      {"id": "B", "text": "Liderança Laissez-faire (Liberal)."},
      {"id": "C", "text": "Liderança Autocrática."},
      {"id": "D", "text": "Liderança Situacional."}
    ]'::jsonb,
    'C',
    'Na liderança autocrática, o foco é no líder e na tarefa, com comunicação vertical descendente e pouca abertura.',
    'FGV'
  ),
  (
    'Administração em Enfermagem',
    'Na gestão de materiais, a Classificação XYZ avalia os itens de acordo com sua:',
    '[
      {"id": "A", "text": "Quantidade em estoque."},
      {"id": "B", "text": "Criticidade ou importância operacional."},
      {"id": "C", "text": "Valor financeiro (custo)."},
      {"id": "D", "text": "Data de validade."}
    ]'::jsonb,
    'B',
    'A curva ABC avalia valor ($). A classificação XYZ avalia a criticidade (X=Baixa, Y=Média, Z=Vital/Crítica para o funcionamento).',
    'VUNESP'
  ),
  (
    'Administração em Enfermagem',
    'A Educação Permanente em Saúde (EPS) diferencia-se da Educação Continuada por:',
    '[
      {"id": "A", "text": "Focar apenas em cursos de atualização técnica."},
      {"id": "B", "text": "Ser realizada fora do ambiente de trabalho."},
      {"id": "C", "text": "Utilizar a problematização do processo de trabalho para transformar as práticas."},
      {"id": "D", "text": "Ser direcionada apenas aos médicos."}
    ]'::jsonb,
    'C',
    'A EPS parte dos problemas reais do cotidiano (aprender no trabalho e para o trabalho) para transformar a realidade, enquanto a continuada é mais acadêmica/tradicional.',
    'MS'
  ),
  (
    'Administração em Enfermagem',
    'O documento administrativo que relata a ocorrência de fatos não rotineiros no serviço (ex: queda de paciente, erro de medicação), com a finalidade de análise e melhoria, é:',
    '[
      {"id": "A", "text": "Anotação de Enfermagem."},
      {"id": "B", "text": "Relatório de Ocorrência (ou Notificação de Evento Adverso)."},
      {"id": "C", "text": "Evolução de Enfermagem."},
      {"id": "D", "text": "Passagem de Plantão."}
    ]'::jsonb,
    'B',
    'O relatório de ocorrência é uma ferramenta gerencial de qualidade e segurança, não punitiva, para mapear riscos e eventos.',
    'EBSERH'
  ),

  -- 3. SEMIOLOGIA (Matéria com poucas questões)
  (
    'Semiologia',
    'Na ausculta pulmonar, o som musical, agudo e contínuo, semelhante a um assobio, gerado pela passagem de ar em vias aéreas estreitadas (broncoespasmo), é denominado:',
    '[
      {"id": "A", "text": "Ronco."},
      {"id": "B", "text": "Estertor Crepitante."},
      {"id": "C", "text": "Sibilo."},
      {"id": "D", "text": "Atrito Pleural."}
    ]'::jsonb,
    'C',
    'Sibilos são típicos da asma e DPOC, indicando obstrução ao fluxo aéreo em brônquios e bronquíolos.',
    'AOCP'
  ),
  (
    'Semiologia',
    'A sequência correta das técnicas propedêuticas durante o exame físico do abdome, para não alterar os ruídos hidroaéreos, é:',
    '[
      {"id": "A", "text": "Inspeção, Palpação, Percussão, Ausculta."},
      {"id": "B", "text": "Inspeção, Ausculta, Percussão, Palpação."},
      {"id": "C", "text": "Palpação, Percussão, Inspeção, Ausculta."},
      {"id": "D", "text": "Ausculta, Inspeção, Palpação, Percussão."}
    ]'::jsonb,
    'B',
    'No abdome, a ausculta deve preceder a percussão e a palpação, pois o toque pode estimular o peristaltismo e falsear a ausculta.',
    'CESGRANRIO'
  ),
  (
    'Semiologia',
    'O Sinal de Blumberg (dor à descompressão brusca no ponto de McBurney, na fossa ilíaca direita) é indicativo de:',
    '[
      {"id": "A", "text": "Colecistite Aguda."},
      {"id": "B", "text": "Apendicite Aguda."},
      {"id": "C", "text": "Infecção Urinária."},
      {"id": "D", "text": "Diverticulite."}
    ]'::jsonb,
    'B',
    'Blumberg positivo indica irritação peritoneal localizada, sinal clássico de apendicite.',
    'FUNDATEC'
  ),
  (
    'Semiologia',
    'Na avaliação das pupilas, quando elas apresentam diâmetros desiguais, denomina-se:',
    '[
      {"id": "A", "text": "Isocoria."},
      {"id": "B", "text": "Midríase."},
      {"id": "C", "text": "Miose."},
      {"id": "D", "text": "Anisocoria."}
    ]'::jsonb,
    'D',
    'Anisocoria (a = não, iso = igual) é a desigualdade no diâmetro pupilar, sinal de alerta neurológico.',
    'IBFC'
  ),
  (
    'Semiologia',
    'A coloração amarelada da pele e mucosas, decorrente do acúmulo de bilirrubina, é chamada de:',
    '[
      {"id": "A", "text": "Cianose."},
      {"id": "B", "text": "Icterícia."},
      {"id": "C", "text": "Eritema."},
      {"id": "D", "text": "Palidez."}
    ]'::jsonb,
    'B',
    'A icterícia sugere disfunção hepática, biliar ou hemólise. Melhor observada na esclera (parte branca do olho).',
    'COPESE'
  ),

  -- 4. URGÊNCIA E EMERGÊNCIA (Reforço Adicional)
  (
    'Urgência e Emergência',
    'Segundo o protocolo da AHA (American Heart Association) para PCR em adultos, os ritmos cardíacos considerados "chocáveis" (que exigem desfibrilação) são:',
    '[
      {"id": "A", "text": "Assistolia e Atividade Elétrica Sem Pulso (AESP)."},
      {"id": "B", "text": "Fibrilação Ventricular (FV) e Taquicardia Ventricular Sem Pulso (TVSP)."},
      {"id": "C", "text": "Fibrilação Atrial e Flutter Atrial."},
      {"id": "D", "text": "Bradicardia Sinusal e Bloqueio Atrioventricular."}
    ]'::jsonb,
    'B',
    'FV e TVSP são ritmos caóticos ou rápidos onde a desfibrilação elétrica é o único tratamento efetivo para "resetar" o coração.',
    'AHA'
  ),
  (
    'Urgência e Emergência',
    'Em um paciente com suspeita de trauma raquimedular (TRM), a técnica recomendada para abertura das vias aéreas é:',
    '[
      {"id": "A", "text": "Inclinação da cabeça e elevação do queixo (Head tilt-Chin lift)."},
      {"id": "B", "text": "Tração da mandíbula (Jaw-thrust)."},
      {"id": "C", "text": "Rotação lateral da cabeça."},
      {"id": "D", "text": "Hiperextensão do pescoço."}
    ]'::jsonb,
    'B',
    'O Jaw-thrust projeta a mandíbula para frente sem mover a coluna cervical, protegendo a medula.',
    'PHTLS'
  ),
  (
    'Urgência e Emergência',
    'A droga de primeira escolha no tratamento do Choque Anafilático, que deve ser administrada imediatamente por via intramuscular, é:',
    '[
      {"id": "A", "text": "Hidrocortisona."},
      {"id": "B", "text": "Prometazina (Fenergan)."},
      {"id": "C", "text": "Adrenalina (Epinefrina)."},
      {"id": "D", "text": "Dipirona."}
    ]'::jsonb,
    'C',
    'A Adrenalina reverte a vasodilatação e o broncoespasmo. Corticoides e anti-histamínicos são secundários e demoram a agir.',
    'VUNESP'
  ),
  (
    'Urgência e Emergência',
    'Na avaliação primária do trauma (XABCDE), a letra "X" (que antecede o A) refere-se a:',
    '[
      {"id": "A", "text": "Exposição do paciente."},
      {"id": "B", "text": "Controle de hemorragia exsanguinante (externa grave)."},
      {"id": "C", "text": "Raio-X de tórax."},
      {"id": "D", "text": "Exame neurológico."}
    ]'::jsonb,
    'B',
    'O PHTLS atualizou para XABCDE, priorizando o controle de sangramentos massivos (torniquete/compressão) antes mesmo da via aérea.',
    'PHTLS'
  ),
  (
    'Urgência e Emergência',
    'O sinal clínico de "Turgência Jugular", associado a hipotensão e abafamento de bulhas cardíacas (Tríade de Beck), é sugestivo de:',
    '[
      {"id": "A", "text": "Pneumotórax Hipertensivo."},
      {"id": "B", "text": "Tamponamento Cardíaco."},
      {"id": "C", "text": "Hemotórax Maciço."},
      {"id": "D", "text": "Choque Séptico."}
    ]'::jsonb,
    'B',
    'A Tríade de Beck é clássica do Tamponamento Cardíaco, um tipo de choque obstrutivo.',
    'CESPE'
  ),

  -- 5. BIOSSEGURANÇA E CONTROLE DE INFECÇÃO (Reforço)
  (
    'Biossegurança e Controle de Infecção',
    'De acordo com a NR-32, em relação aos materiais perfurocortantes, é CORRETO afirmar:',
    '[
      {"id": "A", "text": "O reencape de agulhas é permitido se feito com uma mão só."},
      {"id": "B", "text": "Devem ser descartados em sacos plásticos brancos."},
      {"id": "C", "text": "É vedado o reencape e a desconexão manual de agulhas."},
      {"id": "D", "text": "O descarte pode ser feito no lixo comum se a agulha estiver protegida."}
    ]'::jsonb,
    'C',
    'O reencape é a principal causa de acidentes. A NR-32 proíbe expressamente o reencape e a desconexão manual.',
    'MTE/NR-32'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'Os resíduos de serviços de saúde classificados no Grupo E (Perfurocortantes) devem ser descartados em:',
    '[
      {"id": "A", "text": "Saco plástico branco leitoso."},
      {"id": "B", "text": "Saco plástico laranja."},
      {"id": "C", "text": "Recipiente rígido, resistente à ponta e estanque (Descarpack)."},
      {"id": "D", "text": "Saco preto comum."}
    ]'::jsonb,
    'C',
    'Agulhas, lâminas e ampolas exigem recipientes rígidos para evitar acidentes com os trabalhadores da limpeza/coleta.',
    'ANVISA/RDC 222'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'Para um paciente com diagnóstico de Meningite Meningocócica, a precaução recomendada nas primeiras 24 horas de tratamento é:',
    '[
      {"id": "A", "text": "Padrão."},
      {"id": "B", "text": "Contato."},
      {"id": "C", "text": "Gotículas."},
      {"id": "D", "text": "Aerossóis."}
    ]'::jsonb,
    'C',
    'A Neisseria meningitidis é transmitida por gotículas grandes (fala, tosse) que alcançam até 1 metro. Exige máscara cirúrgica.',
    'AOCP'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'A higienização das mãos é a medida mais importante para prevenção de infecções. Qual dos itens abaixo é um dos "5 Momentos para Higiene das Mãos" da OMS?',
    '[
      {"id": "A", "text": "Antes de entrar no hospital."},
      {"id": "B", "text": "Antes de realizar procedimento asséptico."},
      {"id": "C", "text": "Apenas após contato com fluidos corporais."},
      {"id": "D", "text": "Ao chegar e sair do plantão apenas."}
    ]'::jsonb,
    'B',
    'Os 5 momentos são: 1. Antes de tocar o paciente; 2. Antes de procedimento limpo/asséptico; 3. Após risco de exposição a fluidos; 4. Após tocar o paciente; 5. Após tocar superfícies próximas.',
    'OMS'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'Segundo a NR-32, o uso de Equipamentos de Proteção Individual (EPI) é obrigatório. Para a manipulação de quimioterápicos antineoplásicos, o avental deve ser:',
    '[
      {"id": "A", "text": "De algodão e mangas curtas."},
      {"id": "B", "text": "Impermeável, com mangas longas, punho justo e fechamento nas costas."},
      {"id": "C", "text": "De material permeável e aberto na frente."},
      {"id": "D", "text": "Qualquer avental cirúrgico estéril."}
    ]'::jsonb,
    'B',
    'Para quimioterápicos (risco químico), o avental deve proteger a pele do profissional de respingos e aerossóis, sendo impermeável e fechado na frente.',
    'NR-32'
  ),

  -- 6. NEFROLOGIA E OUTROS (Mix Final)
  (
    'Nefrologia',
    'A principal causa de Insuficiência Renal Aguda (IRA) pré-renal em pacientes hospitalizados é:',
    '[
      {"id": "A", "text": "Uso de contraste iodado."},
      {"id": "B", "text": "Hipovolemia/Desidratação e diminuição da perfusão renal."},
      {"id": "C", "text": "Obstrução do trato urinário (cálculo)."},
      {"id": "D", "text": "Glomerulonefrite."}
    ]'::jsonb,
    'B',
    'A IRA pré-renal ocorre quando falta sangue chegando ao rim (choque, desidratação, IC), sendo a causa mais comum e reversível.',
    'EBSERH'
  ),
  (
    'Nefrologia',
    'O desequilíbrio eletrolítico característico da Doença Renal Crônica avançada, que oferece risco iminente de parada cardíaca, é a:',
    '[
      {"id": "A", "text": "Hiponatremia."},
      {"id": "B", "text": "Hipercalemia (Potássio alto)."},
      {"id": "C", "text": "Hipocalcemia."},
      {"id": "D", "text": "Hipermagnesemia."}
    ]'::jsonb,
    'B',
    'O rim não excreta o potássio adequadamente. K+ > 6.0-6.5 causa arritmias graves e assistolia.',
    'SBN'
  ),
  (
    'Cardiologia',
    'Na parada cardiorrespiratória (PCR), a droga antiarrítmica de escolha para Fibrilação Ventricular (FV) ou TV sem pulso refratária ao choque é:',
    '[
      {"id": "A", "text": "Atropina."},
      {"id": "B", "text": "Amiodarona."},
      {"id": "C", "text": "Adenosina."},
      {"id": "D", "text": "Dopamina."}
    ]'::jsonb,
    'B',
    'A Amiodarona (300mg bolus inicial) é usada após a Adrenalina e choques falharem em estabilizar o ritmo.',
    'AHA'
  ),
  (
    'Cardiologia',
    'Um paciente em uso de Warfarina (Marevan) deve monitorar periodicamente qual exame laboratorial para ajuste de dose?',
    '[
      {"id": "A", "text": "TTPa (Tempo de Tromboplastina Parcial ativado)."},
      {"id": "B", "text": "TAP/INR (Tempo de Protrombina)."},
      {"id": "C", "text": "Plaquetas."},
      {"id": "D", "text": "Fibrinogênio."}
    ]'::jsonb,
    'B',
    'A Warfarina inibe fatores dependentes de Vitamina K (via extrínseca), monitorada pelo INR (alvo geralmente 2-3). O TTPa monitora Heparina.',
    'SBC'
  ),
  (
    'Procedimentos de enfermagem',
    'A posição de Trendelenburg (cabeça mais baixa que os pés) é frequentemente utilizada em cirurgias pélvicas, mas pode causar complicações respiratórias devido a:',
    '[
      {"id": "A", "text": "Compressão do diafragma pelas vísceras abdominais."},
      {"id": "B", "text": "Aumento da expansibilidade torácica."},
      {"id": "C", "text": "Redução do retorno venoso."},
      {"id": "D", "text": "Facilitação da ventilação mecânica."}
    ]'::jsonb,
    'A',
    'As vísceras empurram o diafragma para cima, dificultando a expansão pulmonar e aumentando o risco de atelectasia.',
    'SOBECC'
  );