INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation)
VALUES

-- 1. SAÚDE DO IDOSO (Reforço)
('Saúde do Idoso', 'Vunesp', 'Segundo o Estatuto do Idoso, a notificação compulsória de suspeita ou confirmação de violência contra o idoso deve ser encaminhada, obrigatoriamente, para:',
'[{"id": "A", "text": "Apenas para a família"}, {"id": "B", "text": "Autoridade Policial, Ministério Público ou Conselho Municipal do Idoso"}, {"id": "C", "text": "Apenas para a Secretaria de Saúde"}, {"id": "D", "text": "Diretoria do Hospital"}]',
'B', 'A notificação é obrigatória não apenas para a saúde, mas para os órgãos de proteção legal (Polícia, MP e Conselho).'),

('Saúde do Idoso', 'IBFC', 'Dentre as alterações fisiológicas do envelhecimento (senescência) que aumentam o risco de desidratação no idoso, destaca-se:',
'[{"id": "A", "text": "Aumento da sensação de sede"}, {"id": "B", "text": "Aumento da água corporal total"}, {"id": "C", "text": "Diminuição da sensação de sede e redução da água corporal total"}, {"id": "D", "text": "Aumento da capacidade de concentração urinária"}]',
'C', 'O idoso sente menos sede (hipodipsia) e tem menor reserva hídrica, tornando a desidratação rápida e perigosa.'),

('Saúde do Idoso', 'FGV', 'A vacina Pneumocócica 23-valente (Pneumo 23) é indicada no calendário do idoso, em situações especiais (acamados/institucionalizados), devendo ser administrada:',
'[{"id": "A", "text": "Anualmente junto com a Influenza"}, {"id": "B", "text": "Em dose única, com um reforço após 5 anos"}, {"id": "C", "text": "A cada 10 anos"}, {"id": "D", "text": "Apenas uma dose na vida"}]',
'B', 'O esquema padrão para idosos vulneráveis é uma dose inicial e apenas um reforço após 5 anos.'),

('Saúde do Idoso', 'FCC', 'A "Síndrome da Imobilidade" no idoso pode acarretar diversas complicações. Qual das opções abaixo NÃO é uma complicação direta da imobilidade?',
'[{"id": "A", "text": "Lesão por Pressão"}, {"id": "B", "text": "Trombose Venosa Profunda"}, {"id": "C", "text": "Pneumonia hipostática"}, {"id": "D", "text": "Hipertrofia muscular"}]',
'D', 'A imobilidade causa ATROFIA muscular (perda de massa), não hipertrofia, além de rigidez articular.'),


-- 2. SAÚDE MENTAL (Reforço)
('Saúde Mental', 'Cebraspe', 'O Carbonato de Lítio é um estabilizador de humor com janela terapêutica estreita. Sinais precoces de intoxicação por lítio incluem:',
'[{"id": "A", "text": "Euforia e agitação"}, {"id": "B", "text": "Tremores grosseiros, náuseas, vômitos e diarreia"}, {"id": "C", "text": "Hipertensão severa"}, {"id": "D", "text": "Retenção urinária"}]',
'B', 'O lítio é tóxico acima de 1.2-1.5 mEq/L. Tremores finos são efeito colateral comum, mas tremores grosseiros e sintomas gastrointestinais indicam intoxicação.'),

('Saúde Mental', 'Vunesp', 'No contexto da Reforma Psiquiátrica, o dispositivo de atenção psicossocial que funciona 24 horas, incluindo feriados, e possui leitos de acolhimento noturno para situações de crise é o:',
'[{"id": "A", "text": "CAPS I"}, {"id": "B", "text": "CAPS II"}, {"id": "C", "text": "CAPS III"}, {"id": "D", "text": "Ambulatório de Saúde Mental"}]',
'C', 'O CAPS III (e o CAPS AD III) é o único desenhado para funcionar ininterruptamente (24h) para evitar internações hospitalares.'),

('Saúde Mental', 'AOCP', 'Ao lidar com um paciente em crise de agitação psicomotora, a primeira conduta da equipe de enfermagem deve ser:',
'[{"id": "A", "text": "Contenção mecânica imediata"}, {"id": "B", "text": "Abordagem verbal e tentativa de contenção química (medicamentosa) voluntária"}, {"id": "C", "text": "Isolamento no quarto forte"}, {"id": "D", "text": "Chamar a polícia"}]',
'B', 'A contenção mecânica é o último recurso. A descalonagem verbal ("talk-down") deve ser sempre a primeira tentativa.'),

('Saúde Mental', 'IBFC', 'A Síndrome Neuroléptica Maligna é uma emergência rara e potencialmente fatal associada ao uso de antipsicóticos. Seus sintomas principais são:',
'[{"id": "A", "text": "Hipotermia e flacidez"}, {"id": "B", "text": "Hipertermia (febre alta), rigidez muscular severa e instabilidade autonômica"}, {"id": "C", "text": "Alucinações visuais e delírios"}, {"id": "D", "text": "Poliúria e polidipsia"}]',
'B', 'É uma reação idiossincrática grave. Exige suspensão imediata do antipsicótico e suporte intensivo.'),


-- 3. SAÚDE DO TRABALHADOR (Reforço)
('Saúde do Trabalhador', 'Vunesp', 'Conforme a NR-32, em caso de acidente com material biológico perfurocortante, a primeira conduta imediata do profissional acidentado deve ser:',
'[{"id": "A", "text": "Espremer o local para sair o sangue"}, {"id": "B", "text": "Lavar exaustivamente o local com água e sabão"}, {"id": "C", "text": "Aplicar hipoclorito de sódio"}, {"id": "D", "text": "Iniciar o coquetel anti-HIV imediatamente, antes de lavar"}]',
'B', 'Não se deve espremer (pode aumentar a área de trauma). A lavagem mecânica com água e sabão reduz a carga viral local.'),

('Saúde do Trabalhador', 'FGV', 'Para profissionais que manipulam quimioterápicos antineoplásicos, a NR-32 exige o uso de EPIs específicos. Dentre eles, destaca-se a obrigatoriedade de:',
'[{"id": "A", "text": "Luvas de procedimento simples"}, {"id": "B", "text": "Avental de material impermeável, com frente resistente e mangas longas"}, {"id": "C", "text": "Máscara de tecido simples"}, {"id": "D", "text": "Óculos de sol"}]',
'B', 'O avental deve ser impermeável para proteger contra respingos de drogas citotóxicas, que são absorvidas pela pele.'),

('Saúde do Trabalhador', 'Cebraspe', 'A Perda Auditiva Induzida por Ruído (PAIR) relacionada ao trabalho tem como característica ser:',
'[{"id": "A", "text": "Condutiva e reversível"}, {"id": "B", "text": "Unilateral e aguda"}, {"id": "C", "text": "Neurossensorial, irreversível e geralmente bilateral"}, {"id": "D", "text": "Causada apenas por ruídos de impacto"}]',
'C', 'A PAIR afeta as células ciliadas da cóclea, não tem cura e geralmente afeta ambos os ouvidos simetricamente ao longo do tempo.'),

('Saúde do Trabalhador', 'IBFC', 'A vacinação contra Hepatite B é obrigatória para profissionais de saúde. O esquema completo consiste em:',
'[{"id": "A", "text": "Dose única"}, {"id": "B", "text": "3 doses (0, 1 e 6 meses)"}, {"id": "C", "text": "Reforço a cada 10 anos"}, {"id": "D", "text": "2 doses com intervalo de 2 meses"}]',
'B', 'Após as 3 doses, deve-se realizar o teste Anti-HBs para confirmar a imunidade. Se negativo, repete-se o esquema.'),


-- 4. CENTRO CIRÚRGICO E CME (Reforço)
('Centro Cirúrgico e CME', 'AOCP', 'A Hipertermia Maligna é uma complicação anestésica grave desencadeada por anestésicos inalatórios e succinilcolina. O fármaco antídoto que deve estar disponível no Centro Cirúrgico é:',
'[{"id": "A", "text": "Adrenalina"}, {"id": "B", "text": "Dantrolene Sódico"}, {"id": "C", "text": "Atropina"}, {"id": "D", "text": "Gluconato de Cálcio"}]',
'B', 'O Dantrolene é o único relaxante muscular que age diretamente revertendo a crise de hipertermia maligna.'),

('Centro Cirúrgico e CME', 'Vunesp', 'Na CME, a área responsável pela recepção, conferência, lavagem e secagem dos materiais é classificada como:',
'[{"id": "A", "text": "Área Limpa"}, {"id": "B", "text": "Área Estéril"}, {"id": "C", "text": "Área Contaminada (ou Suja)"}, {"id": "D", "text": "Área Administrativa"}]',
'C', 'É onde chegam os materiais com matéria orgânica (expurgo). É a área crítica para prevenção de contaminação cruzada.'),

('Centro Cirúrgico e CME', 'FCC', 'A contagem de compressas e instrumentais cirúrgicos deve ser realizada:',
'[{"id": "A", "text": "Apenas se o cirurgião solicitar"}, {"id": "B", "text": "Antes do início da cirurgia, antes do fechamento de cavidades e ao final da cirurgia (Sign Out)"}, {"id": "C", "text": "Apenas no final da cirurgia"}, {"id": "D", "text": "Pela equipe de limpeza após a saída do paciente"}]',
'B', 'A contagem sistemática em 3 tempos é uma meta de segurança para evitar retenção inadvertida de corpos estranhos (gossipiboma).'),

('Centro Cirúrgico e CME', 'EBSERH', 'A posição de Trendelenburg (cabeça mais baixa que o corpo) é frequentemente usada em cirurgias pélvicas, mas apresenta risco de:',
'[{"id": "A", "text": "Hipotensão severa"}, {"id": "B", "text": "Restrição da expansibilidade diafragmática e aumento da pressão intracraniana"}, {"id": "C", "text": "Lesão do nervo fibular"}, {"id": "D", "text": "Queda da pressão venosa central"}]',
'B', 'As vísceras comprimem o diafragma dificultando a respiração, e o retorno venoso aumenta a pressão no crânio.'),


-- 5. BIOSSEGURANÇA (Reforço)
('Biossegurança e Controle de Infecção', 'IBFC', 'O descarte de resíduos químicos (como reveladores de RX, quimioterápicos, medicamentos vencidos perigosos) deve ser feito em recipientes identificados com o símbolo de risco químico e pertencem ao Grupo:',
'[{"id": "A", "text": "Grupo A"}, {"id": "B", "text": "Grupo B"}, {"id": "C", "text": "Grupo D"}, {"id": "D", "text": "Grupo E"}]',
'B', 'Grupo A = Infectante; Grupo B = Químico; Grupo D = Comum; Grupo E = Perfurocortante.'),

('Biossegurança e Controle de Infecção', 'FGV', 'Um paciente interna com suspeita de Meningite Meningocócica. Até que se confirmem ou descartem o diagnóstico, ou até 24h de antibiótico efetivo, a precaução indicada é:',
'[{"id": "A", "text": "Padrão"}, {"id": "B", "text": "Contato"}, {"id": "C", "text": "Gotículas"}, {"id": "D", "text": "Aerossóis"}]',
'C', 'A Neisseria meningitidis é transmitida por gotículas (partículas grandes) através da tosse/fala a curta distância. Exige máscara cirúrgica.'),

('Biossegurança e Controle de Infecção', 'Cebraspe', 'A higienização das mãos com preparação alcoólica (álcool gel 70%) NÃO é recomendada (ou seja, deve-se usar água e sabão) quando:',
'[{"id": "A", "text": "As mãos estiverem visivelmente sujas com sangue ou fluidos corporais"}, {"id": "B", "text": "Antes de tocar o paciente"}, {"id": "C", "text": "Após tocar o paciente"}, {"id": "D", "text": "Ao entrar no quarto"}]',
'A', 'O álcool perde eficácia na presença de matéria orgânica visível. Nesse caso, a lavagem com água e sabão é mandatória.'),

('Biossegurança e Controle de Infecção', 'Vunesp', 'A Escabiose (sarna) e a Pediculose (piolho) são doenças que exigem precaução de:',
'[{"id": "A", "text": "Gotículas"}, {"id": "B", "text": "Aerossóis"}, {"id": "C", "text": "Contato"}, {"id": "D", "text": "Padrão apenas"}]',
'C', 'Transmissão por contato direto pele a pele ou fômites (roupas de cama). Exige luvas e avental.')

ON CONFLICT (question) DO NOTHING;