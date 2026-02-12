-- PACOTE DE REFORÇO 10: CURATIVOS E FERIDAS
-- Foco: Coberturas, LPP, Pé Diabético, Fisiologia da Cicatrização

INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES

  -- 1. FISIOLOGIA DA CICATRIZAÇÃO
  (
    'Fundamentos de Enfermagem',
    'O processo de cicatrização de feridas ocorre em fases dinâmicas e sobrepostas. A fase caracterizada por hemostasia, liberação de citocinas e migração de leucócitos (neutrófilos e macrófagos) para limpeza da área é denominada:',
    '[
      {"id": "A", "text": "Fase de Maturação."},
      {"id": "B", "text": "Fase Proliferativa."},
      {"id": "C", "text": "Fase Inflamatória."},
      {"id": "D", "text": "Fase de Remodelagem."}
    ]'::jsonb,
    'C',
    'A fase inflamatória é a primeira resposta à lesão (após a hemostasia imediata), focada em limpar o leito e preparar para a reconstrução.',
    'VUNESP'
  ),
  (
    'Fundamentos de Enfermagem',
    'Uma ferida cirúrgica suturada, onde as bordas são aproximadas e há mínima perda de tecido e cicatriz final fina, é classificada como cicatrização por:',
    '[
      {"id": "A", "text": "Primeira Intenção."},
      {"id": "B", "text": "Segunda Intenção."},
      {"id": "C", "text": "Terceira Intenção."},
      {"id": "D", "text": "Quarta Intenção."}
    ]'::jsonb,
    'A',
    'Primeira intenção (primária) ocorre quando as bordas são aproximadas (sutura). Segunda intenção é quando a ferida fica aberta para granular. Terceira é fechamento tardio.',
    'IBFC'
  ),

  -- 2. AVALIAÇÃO DE FERIDAS (TIME)
  (
    'Fundamentos de Enfermagem',
    'Na avaliação de feridas utilizando o acrônimo TIME, a letra "T" refere-se ao controle de:',
    '[
      {"id": "A", "text": "Tempo de evolução."},
      {"id": "B", "text": "Temperatura local."},
      {"id": "C", "text": "Tissue (Tecido não viável)."},
      {"id": "D", "text": "Tamanho da lesão."}
    ]'::jsonb,
    'C',
    'TIME: T = Tissue (Tecido/Desbridamento), I = Infection (Infecção), M = Moisture (Umidade), E = Edge (Bordas/Epitelização).',
    'Estomaterapia'
  ),
  (
    'Fundamentos de Enfermagem',
    'Ao avaliar o leito de uma lesão, observa-se a presença de tecido amarelo, úmido e frouxamente aderido. Este tecido é denominado:',
    '[
      {"id": "A", "text": "Tecido de Granulação."},
      {"id": "B", "text": "Esfacelo."},
      {"id": "C", "text": "Escara (Necrose de coagulação)."},
      {"id": "D", "text": "Epitelização."}
    ]'::jsonb,
    'B',
    'O esfacelo (ou necrose de liquefação) é tecido desvitalizado amarelo/esbranquiçado. A escara é preta/dura. Granulação é vermelha.',
    'FGV'
  ),
  (
    'Fundamentos de Enfermagem',
    'O termo "undermining" ou "descolamento" em uma ferida refere-se a:',
    '[
      {"id": "A", "text": "Presença de tecido necrótico no centro da lesão."},
      {"id": "B", "text": "Destruição tecidual sob a pele intacta nas margens da ferida."},
      {"id": "C", "text": "Excesso de tecido de granulação (hipergranulação)."},
      {"id": "D", "text": "Endurecimento da borda da ferida (epíbole)."}
    ]'::jsonb,
    'B',
    'Descolamento é a erosão sob a borda da ferida, criando um espaço onde a pele parece intacta, mas não tem sustentação por baixo.',
    'C.C.E.'
  ),

  -- 3. LESÃO POR PRESSÃO (LPP)
  (
    'Fundamentos de Enfermagem',
    'Segundo a classificação NPUAP (2016), uma Lesão por Pressão Estágio 1 é caracterizada por:',
    '[
      {"id": "A", "text": "Perda parcial da espessura da pele com derme exposta."},
      {"id": "B", "text": "Pele íntegra com eritema que não embranquece à pressão."},
      {"id": "C", "text": "Perda total da espessura da pele com gordura visível."},
      {"id": "D", "text": "Área localizada de pele intacta com coloração púrpura ou marrom."}
    ]'::jsonb,
    'B',
    'O sinal cardinal do Estágio 1 é a vermelhidão persistente (não fica branca quando você aperta o dedo nela) em pele íntegra.',
    'NPUAP'
  ),
  (
    'Fundamentos de Enfermagem',
    'Uma lesão por pressão na região sacral apresenta perda total da espessura da pele, com visualização de tecido adiposo, mas sem exposição de ossos, tendões ou músculos. Qual é o estágio?',
    '[
      {"id": "A", "text": "Estágio 2."},
      {"id": "B", "text": "Estágio 3."},
      {"id": "C", "text": "Estágio 4."},
      {"id": "D", "text": "Não Estadiável."}
    ]'::jsonb,
    'B',
    'Estágio 3 atinge o tecido subcutâneo (gordura), mas não expõe estruturas nobres (osso/músculo), o que configuraria Estágio 4.',
    'NPUAP'
  ),
  (
    'Fundamentos de Enfermagem',
    'Qual escala é amplamente utilizada para predizer o risco de desenvolvimento de Lesão por Pressão em pacientes adultos?',
    '[
      {"id": "A", "text": "Escala de Glasgow."},
      {"id": "B", "text": "Escala de Morse."},
      {"id": "C", "text": "Escala de Braden."},
      {"id": "D", "text": "Escala de Aldrete."}
    ]'::jsonb,
    'C',
    'Braden avalia: Percepção sensorial, Umidade, Atividade, Mobilidade, Nutrição e Fricção/Cisalhamento. Quanto menor a nota, maior o risco.',
    'Fundamentos'
  ),

  -- 4. COBERTURAS E TECNOLOGIAS (Básico e Avançado)
  (
    'Fundamentos de Enfermagem',
    'O Alginato de Cálcio é uma cobertura indicada primariamente para feridas:',
    '[
      {"id": "A", "text": "Secas e com necrose de coagulação."},
      {"id": "B", "text": "Superficiais e em fase de epitelização."},
      {"id": "C", "text": "Altamente exsudativas e/ou com sangramento (hemostasia)."},
      {"id": "D", "text": "Apenas infectadas por fungos."}
    ]'::jsonb,
    'C',
    'O alginato absorve exsudato (transformando-se em gel) e faz troca iônica (Cálcio por Sódio), o que auxilia na hemostasia. Contraindicado em feridas secas.',
    'Curativos'
  ),
  (
    'Fundamentos de Enfermagem',
    'O Hidrogel é uma excelente opção para o desbridamento autolítico. Sua principal função é:',
    '[
      {"id": "A", "text": "Absorver grandes quantidades de exsudato."},
      {"id": "B", "text": "Doar umidade ao leito da ferida, reidratando tecidos necróticos secos."},
      {"id": "C", "text": "Combater infecção bacteriana ativa."},
      {"id": "D", "text": "Realizar compressão da ferida."}
    ]'::jsonb,
    'B',
    'O hidrogel é composto majoritariamente por água. Ele hidrata a necrose/esfacelo, facilitando que as enzimas do próprio corpo a degradem (autólise).',
    'Curativos'
  ),
  (
    'Fundamentos de Enfermagem',
    'Qual das coberturas abaixo possui propriedade antimicrobiana de amplo espectro, sendo indicada para feridas infectadas ou com colonização crítica?',
    '[
      {"id": "A", "text": "Placa de Hidrocoloide."},
      {"id": "B", "text": "Carvão Ativado com Prata."},
      {"id": "C", "text": "Filme Transparente de Poliuretano."},
      {"id": "D", "text": "Ácidos Graxos Essenciais (AGE)."}
    ]'::jsonb,
    'B',
    'A prata é bactericida. O carvão ativado absorve o odor. Juntos, tratam feridas infectadas e fétidas. Hidrocoloide e Filme são oclusivos e contraindicados em infecção grave.',
    'Curativos'
  ),
  (
    'Fundamentos de Enfermagem',
    'A Papaína é um agente de desbridamento enzimático (químico). Sobre seu uso, é correto afirmar:',
    '[
      {"id": "A", "text": "Deve ser associada a curativos com prata ou iodo."},
      {"id": "B", "text": "É inativada na presença de metais pesados (ex: prata) e requer diluição conforme o tipo de tecido."},
      {"id": "C", "text": "Pode ser usada em qualquer concentração em tecido de granulação."},
      {"id": "D", "text": "Não necessita de prescrição ou avaliação prévia."}
    ]'::jsonb,
    'B',
    'Metais pesados inativam a papaína. A concentração varia: 2-4% para esfacelo/granulação, 8-10% para necrose dura. Em granulação pura, geralmente se evita ou usa baixa %.',
    'Farmacologia Tópica'
  ),
  (
    'Fundamentos de Enfermagem',
    'As coberturas de Hidrocoloide (placa) são indicadas para:',
    '[
      {"id": "A", "text": "Feridas infectadas com grande volume de exsudato."},
      {"id": "B", "text": "Feridas com exposição de tendão e osso."},
      {"id": "C", "text": "Feridas limpas, com exsudato leve a moderado, e proteção de áreas de atrito."},
      {"id": "D", "text": "Queimaduras de terceiro grau."}
    ]'::jsonb,
    'C',
    'O hidrocoloide é oclusivo, mantém umidade e protege. Não deve ser usado em infecção, exposição óssea ou exsudato intenso (risco de maceração).',
    'Curativos'
  ),

  -- 5. DESBRIDAMENTO
  (
    'Fundamentos de Enfermagem',
    'O tipo de desbridamento que utiliza as próprias enzimas do corpo e a umidade retida por uma cobertura oclusiva/semioclusiva para degradar o tecido necrótico é chamado de:',
    '[
      {"id": "A", "text": "Desbridamento Enzimático."},
      {"id": "B", "text": "Desbridamento Mecânico."},
      {"id": "C", "text": "Desbridamento Autolítico."},
      {"id": "D", "text": "Desbridamento Instrumental (Sharp)."}
    ]'::jsonb,
    'C',
    'É o método mais seletivo, indolor e lento. Promovido por hidrogéis, hidrocoloides e filmes.',
    'Técnicas'
  ),
  (
    'Fundamentos de Enfermagem',
    'O uso de colagenase (pomada) é um exemplo de desbridamento:',
    '[
      {"id": "A", "text": "Mecânico."},
      {"id": "B", "text": "Autolítico."},
      {"id": "C", "text": "Enzimático/Químico."},
      {"id": "D", "text": "Cirúrgico."}
    ]'::jsonb,
    'C',
    'A colagenase é uma enzima exógena que digere o colágeno desvitalizado que fixa a necrose ao leito da ferida.',
    'Técnicas'
  ),

  -- 6. PÉ DIABÉTICO E ÚLCERAS VASCULARES
  (
    'Fundamentos de Enfermagem',
    'Uma úlcera localizada no maléolo medial (tornozelo interno), com bordas irregulares, leito vermelho, grande quantidade de exsudato e presença de dermatite ocre (manchas escuras na perna) é sugestiva de:',
    '[
      {"id": "A", "text": "Úlcera Arterial (Isquêmica)."},
      {"id": "B", "text": "Úlcera Venosa."},
      {"id": "C", "text": "Úlcera Neuropática (Diabética)."},
      {"id": "D", "text": "Lesão por Pressão."}
    ]'::jsonb,
    'B',
    'Características clássicas da insuficiência venosa. A úlcera arterial geralmente é pálida, seca, dolorosa e em extremidades.',
    'Angiologia'
  ),
  (
    'Fundamentos de Enfermagem',
    'A Terapia Compressiva (ex: Bota de Unna) é o padrão-ouro para o tratamento de úlceras venosas. No entanto, ela é CONTRAINDICADA se o paciente apresentar:',
    '[
      {"id": "A", "text": "Insuficiência Arterial Periférica grave (ITB < 0,8)."},
      {"id": "B", "text": "Varizes visíveis."},
      {"id": "C", "text": "Edema em membros inferiores."},
      {"id": "D", "text": "Dermatite de estase."}
    ]'::jsonb,
    'A',
    'Comprimir uma perna que já não recebe sangue arterial suficiente (isquemia) vai piorar a perfusão e pode causar necrose/amputação.',
    'Segurança'
  ),
  (
    'Fundamentos de Enfermagem',
    'No cuidado com o pé diabético, a orientação fundamental para prevenção de úlceras inclui:',
    '[
      {"id": "A", "text": "Andar descalço para fortalecer a musculatura."},
      {"id": "B", "text": "Usar sapatos apertados para dar firmeza."},
      {"id": "C", "text": "Inspecionar os pés diariamente (com espelho) e secar bem entre os dedos."},
      {"id": "D", "text": "Cortar as unhas de forma arredondada nos cantos."}
    ]'::jsonb,
    'C',
    'A neuropatia retira a sensibilidade dolorosa. A inspeção visual é a única forma de detectar lesões precocemente. Unhas devem ser cortadas retas.',
    'Diabetes'
  ),

  -- 7. TÉCNICA E HIGIENE
  (
    'Fundamentos de Enfermagem',
    'A limpeza de uma ferida cirúrgica asséptica deve ser realizada:',
    '[
      {"id": "A", "text": "De fora para dentro (das bordas para o centro)."},
      {"id": "B", "text": "Do local mais contaminado para o menos contaminado."},
      {"id": "C", "text": "Do local menos contaminado (incisão) para o mais contaminado (bordas/pele)."},
      {"id": "D", "text": "Em movimentos circulares repetitivos sobre a incisão."}
    ]'::jsonb,
    'C',
    'A incisão é considerada limpa. A pele ao redor é considerada mais suja. Limpa-se do centro para fora para não trazer bactérias para a ferida.',
    'Técnicas Básicas'
  ),
  (
    'Fundamentos de Enfermagem',
    'Qual a solução mais indicada e segura (fisiológica) para a limpeza da maioria das feridas crônicas e agudas?',
    '[
      {"id": "A", "text": "Água oxigenada (Peróxido de hidrogênio)."},
      {"id": "B", "text": "Solução de Povidine-Iodo (PVPI)."},
      {"id": "C", "text": "Soro Fisiológico 0,9% morno."},
      {"id": "D", "text": "Álcool 70%."}
    ]'::jsonb,
    'C',
    'Água oxigenada e PVPI são citotóxicos para o tecido de granulação e fibroblastos. O SF 0,9% amornado é o padrão ouro (evita choque térmico).',
    'Fundamentos'
  ),

  -- 8. COMPLICAÇÕES
  (
    'Fundamentos de Enfermagem',
    'A deiscência de uma ferida operatória refere-se a:',
    '[
      {"id": "A", "text": "Infecção profunda com pus."},
      {"id": "B", "text": "Abertura espontânea das bordas da ferida suturada."},
      {"id": "C", "text": "Formação de queloide."},
      {"id": "D", "text": "Necrose das bordas."}
    ]'::jsonb,
    'B',
    'Deiscência é a separação das camadas. Se houver saída de órgãos internos, chama-se Evisceração (emergência).',
    'Cirúrgica'
  ),
  (
    'Fundamentos de Enfermagem',
    'O biofilme em feridas crônicas é:',
    '[
      {"id": "A", "text": "Uma camada de fibrina que ajuda na cicatrização."},
      {"id": "B", "text": "Uma comunidade de bactérias envolta em matriz protetora, resistente a antibióticos e imunidade."},
      {"id": "C", "text": "O mesmo que tecido de granulação."},
      {"id": "D", "text": "Facilmente removível com irrigação simples de soro."}
    ]'::jsonb,
    'B',
    'O biofilme é a principal causa de estagnação na cicatrização de feridas crônicas. Exige desbridamento rigoroso e antissépticos tópicos (ex: PHMB).',
    'Microbiologia'
  ),

  -- 9. PRODUTOS ESPECÍFICOS
  (
    'Fundamentos de Enfermagem',
    'O PHMB (Polihexanida) é uma solução utilizada para:',
    '[
      {"id": "A", "text": "Apenas hidratação da pele íntegra."},
      {"id": "B", "text": "Limpeza e descontaminação de feridas, eficaz contra biofilme."},
      {"id": "C", "text": "Desbridamento enzimático de necrose dura."},
      {"id": "D", "text": "Cauterização de hipergranulação."}
    ]'::jsonb,
    'B',
    'O PHMB é um antisséptico moderno, de baixa toxicidade tecidual e alta eficácia contra bactérias e biofilmes.',
    'Curativos'
  ),
  (
    'Fundamentos de Enfermagem',
    'O Ácido Graxo Essencial (AGE), conhecido como óleo de girassol, é indicado principalmente para:',
    '[
      {"id": "A", "text": "Desbridar necrose úmida extensa."},
      {"id": "B", "text": "Tratar infecção por Pseudomonas."},
      {"id": "C", "text": "Prevenção de LPP (hidratação) e estímulo à granulação/epitelização."},
      {"id": "D", "text": "Absorver exsudato abundante."}
    ]'::jsonb,
    'C',
    'O AGE mantém a integridade da pele, hidrata e promove quimiotaxia e angiogênese em feridas limpas. Não é absorvente nem desbridante potente.',
    'Prevenção'
  ),

  -- 10. OSTOMIAS
  (
    'Fundamentos de Enfermagem',
    'Ao cuidar de um estoma intestinal (colostomia/ileostomia), o recorte da placa adesiva deve ser:',
    '[
      {"id": "A", "text": "Exatamente do tamanho do estoma (sem margem)."},
      {"id": "B", "text": "2 a 3 mm maior que o estoma, para não estrangular nem expor pele demais."},
      {"id": "C", "text": "Bem maior que o estoma, deixando muita pele exposta."},
      {"id": "D", "text": "Não se recorta a placa, usa-se o tamanho padrão."}
    ]'::jsonb,
    'B',
    'Se for muito justo, lacera o estoma. Se for muito largo, o efluente (fezes) queima a pele ao redor. A margem de 2-3mm é a segurança ideal.',
    'Estomaterapia'
  ),
  (
    'Fundamentos de Enfermagem',
    'Um estoma saudável deve apresentar coloração:',
    '[
      {"id": "A", "text": "Pálida ou esbranquiçada."},
      {"id": "B", "text": "Vermelha viva ou rósea, brilhante e úmida."},
      {"id": "C", "text": "Escura, preta ou acastanhada."},
      {"id": "D", "text": "Roxa intensa."}
    ]'::jsonb,
    'B',
    'Vermelho vivo indica boa perfusão sanguínea. Preto/Roxo indica necrose/isquemia (emergência cirúrgica). Pálido indica anemia grave.',
    'Estomaterapia'
  ),

  -- 11. SITUAÇÕES ESPECIAIS
  (
    'Fundamentos de Enfermagem',
    'Em caso de Evisceração (saída de órgãos abdominais após deiscência de sutura), a conduta imediata da enfermagem é:',
    '[
      {"id": "A", "text": "Tentar reintroduzir as vísceras na cavidade abdominal."},
      {"id": "B", "text": "Cobrir com compressas estéreis umedecidas em salina morna e notificar o cirurgião."},
      {"id": "C", "text": "Deixar exposto ao ar para secar."},
      {"id": "D", "text": "Aplicar cinta abdominal apertada."}
    ]'::jsonb,
    'B',
    'NUNCA reintroduzir. Cobrir com úmido e estéril para evitar ressecamento e necrose das alças intestinais. Posição de Fowler baixa com joelhos fletidos (relaxa abdome).',
    'Emergência Cirúrgica'
  ),
  (
    'Fundamentos de Enfermagem',
    'A terapia por pressão negativa (V.A.C.) é contraindicada na presença de:',
    '[
      {"id": "A", "text": "Alto exsudato."},
      {"id": "B", "text": "Tecido necrótico ou esfacelo em grande quantidade no leito (não desbridado)."},
      {"id": "C", "text": "Enxertos de pele recentes."},
      {"id": "D", "text": "Feridas traumáticas profundas."}
    ]'::jsonb,
    'B',
    'O vácuo precisa de um leito viável para estimular a granulação. Necrose impede o funcionamento e favorece infecção anaeróbia sob o curativo.',
    'Alta Complexidade'
  ),
  (
    'Fundamentos de Enfermagem',
    'Para prevenção de lesão por pressão em calcâneos (calcanhar), a medida mais eficaz é:',
    '[
      {"id": "A", "text": "Massagem vigorosa."},
      {"id": "B", "text": "Elevação dos calcanhares do leito (flutuação) com travesseiro sob a panturrilha."},
      {"id": "C", "text": "Uso de 'rodinhas' ou 'boias' de água."},
      {"id": "D", "text": "Aplicação de talco."}
    ]'::jsonb,
    'B',
    'As "boias" são contraindicadas pois concentram a pressão na borda. A flutuação total (calcanhar não toca o colchão) é o ideal.',
    'Prevenção'
  ),
  (
    'Fundamentos de Enfermagem',
    'A maceração da pele perilesional (bordas esbranquiçadas e frágeis) é causada geralmente por:',
    '[
      {"id": "A", "text": "Ressecamento excessivo."},
      {"id": "B", "text": "Excesso de umidade/exsudato em contato com a pele íntegra."},
      {"id": "C", "text": "Uso de cobertura de prata."},
      {"id": "D", "text": "Falta de oxigênio."}
    ]'::jsonb,
    'B',
    'Ocorre quando o curativo não absorve o suficiente ou ultrapassa as bordas. Exige troca por cobertura mais absorvente ou proteção de borda (creme barreira).',
    'Avaliação'
  )

ON CONFLICT (question) DO NOTHING;