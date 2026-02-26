INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES
(
  'Feridas e Curativos',
  'De acordo com a classificação da NPUAP (2016), a Lesão por Pressão caracterizada por pele íntegra com eritema que não embranquece à digito-pressão é classificada como:',
  '[
    {"id": "A", "text": "Estágio 1."},
    {"id": "B", "text": "Estágio 2."},
    {"id": "C", "text": "Lesão Tissular Profunda."},
    {"id": "D", "text": "Dermatite Associada à Incontinência (DAI)."}
  ]'::jsonb,
  'A',
  'O Estágio 1 é definido por pele íntegra com eritema não branqueável. O Estágio 2 já apresenta perda parcial da espessura da pele (derme).',
  'VUNESP'
),
(
  'Feridas e Curativos',
  'Qual é a cobertura primária mais indicada para uma ferida cavitária, com exsudato moderado a intenso e presença de sangramento, devido à sua propriedade hemostática?',
  '[
    {"id": "A", "text": "Hidrogel."},
    {"id": "B", "text": "Placa de Hidrocoloide."},
    {"id": "C", "text": "Alginato de Cálcio."},
    {"id": "D", "text": "Filme Transparente."}
  ]'::jsonb,
  'C',
  'O Alginato de Cálcio é indicado para feridas exsudativas e cavitárias. A troca iônica entre o cálcio do curativo e o sódio do sangue auxilia na hemostasia.',
  'IBFC'
),
(
  'Feridas e Curativos',
  'O desbridamento que utiliza enzimas endógenas (do próprio organismo) para liquefazer o tecido necrótico, promovido por um ambiente úmido mantido por coberturas como o Hidrogel, é chamado de:',
  '[
    {"id": "A", "text": "Desbridamento Enzimático."},
    {"id": "B", "text": "Desbridamento Mecânico."},
    {"id": "C", "text": "Desbridamento Autolítico."},
    {"id": "D", "text": "Desbridamento Instrumental."}
  ]'::jsonb,
  'C',
  'O desbridamento autolítico é o processo natural do corpo, potencializado por coberturas que mantêm a umidade. O enzimático usa enzimas exógenas (papaína/colagenase).',
  'FGV'
),
(
  'Feridas e Curativos',
  'A Papaína é um agente de desbridamento químico. Qual o cuidado essencial ao utilizar essa substância?',
  '[
    {"id": "A", "text": "Ela deve ser associada a metais pesados (prata) para ativar sua ação."},
    {"id": "B", "text": "Ela é inativada por metais pesados, portanto não deve ser usada com iodo ou prata."},
    {"id": "C", "text": "Ela só funciona em feridas secas, sem necessidade de cobertura secundária."},
    {"id": "D", "text": "Ela deve ser aplicada exclusivamente em tecido de granulação saudável."}
  ]'::jsonb,
  'B',
  'A papaína é inativada por agentes oxidantes (iodo, água oxigenada) e metais pesados (prata). Além disso, pode causar dor se aplicada em pele íntegra.',
  'CEBRASPE'
),
(
  'Feridas e Curativos',
  'Sobre a Bota de Unna, é correto afirmar que:',
  '[
    {"id": "A", "text": "É indicada para úlceras arteriais isquêmicas."},
    {"id": "B", "text": "É uma terapia compressiva inelástica indicada para úlceras venosas."},
    {"id": "C", "text": "Deve ser trocada diariamente."},
    {"id": "D", "text": "Pode ser usada em feridas infectadas com grande quantidade de exsudato."}
  ]'::jsonb,
  'B',
  'A Bota de Unna é o padrão-ouro para úlceras venosas (insuficiência venosa crônica). É contraindicada em úlceras arteriais (isquêmicas) e infectadas.',
  'FCC'
),
(
  'Feridas e Curativos',
  'A sigla TIME é utilizada para sistematizar o preparo do leito da ferida. O que significa a letra "M"?',
  '[
    {"id": "A", "text": "Management (Gerenciamento da dor)."},
    {"id": "B", "text": "Moisture (Controle da umidade/exsudato)."},
    {"id": "C", "text": "Microbiology (Microbiologia)."},
    {"id": "D", "text": "Movement (Mobilidade do paciente)."}
  ]'::jsonb,
  'B',
  'T = Tissue (Tecido não viável); I = Infection (Infecção/Inflamação); M = Moisture (Umidade); E = Edge (Bordas).',
  'IDECAN'
),
(
  'Feridas e Curativos',
  'Qual das coberturas abaixo é CONTRAINDICADA em feridas infectadas devido à sua característica oclusiva que pode favorecer a proliferação bacteriana anaeróbia?',
  '[
    {"id": "A", "text": "Carvão Ativado com Prata."},
    {"id": "B", "text": "Hidrocoloide."},
    {"id": "C", "text": "Alginato de Cálcio."},
    {"id": "D", "text": "Hidrofibra com Prata."}
  ]'::jsonb,
  'B',
  'O Hidrocoloide é oclusivo e cria um ambiente hipóxico, o que pode favorecer a proliferação bacteriana em feridas já infectadas. Ele é indicado para feridas limpas.',
  'VUNESP'
),
(
  'Feridas e Curativos',
  'Em relação à limpeza de feridas cirúrgicas limpas e fechadas (com sutura), qual a técnica recomendada?',
  '[
    {"id": "A", "text": "Do meio para as bordas (do local menos contaminado para o mais contaminado)."},
    {"id": "B", "text": "Das bordas para o meio."},
    {"id": "C", "text": "Movimentos circulares de fora para dentro."},
    {"id": "D", "text": "Fricção vigorosa com antisséptico degermante."}
  ]'::jsonb,
  'A',
  'A regra geral de limpeza é do "menos contaminado para o mais contaminado". Na incisão cirúrgica, a linha da sutura é considerada a mais limpa, então limpa-se dela para fora.',
  'CONSULPLAN'
),
(
  'Feridas e Curativos',
  'A cobertura composta por Ácidos Graxos Essenciais (AGE) atua principalmente:',
  '[
    {"id": "A", "text": "Promovendo quimiotaxia e angiogênese, além de hidratar a pele."},
    {"id": "B", "text": "Realizando desbridamento enzimático agressivo."},
    {"id": "C", "text": "Absorvendo grandes quantidades de exsudato."},
    {"id": "D", "text": "Combatendo infecção por Pseudomonas."}
  ]'::jsonb,
  'A',
  'O AGE mantém a umidade, previne a perda de água, promove a quimiotaxia (atração de leucócitos) e a angiogênese (novos vasos), acelerando a granulação.',
  'IBFC'
),
(
  'Feridas e Curativos',
  'Uma Lesão por Pressão Estágio 3 caracteriza-se por:',
  '[
    {"id": "A", "text": "Perda parcial da espessura da derme."},
    {"id": "B", "text": "Perda total da espessura da pele, com gordura subcutânea visível, mas sem exposição de ossos/tendões."},
    {"id": "C", "text": "Perda total da pele com exposição de osso ou músculo."},
    {"id": "D", "text": "Área localizada de pele intacta com coloração púrpura."}
  ]'::jsonb,
  'B',
  'Estágio 3 atinge o tecido subcutâneo (gordura), mas não expõe estruturas profundas como ossos e tendões (que caracterizariam o Estágio 4).',
  'AOCP'
),
(
  'Feridas e Curativos',
  'Qual cobertura é indicada para controlar o odor fétido em feridas infectadas, além de absorver exsudato?',
  '[
    {"id": "A", "text": "Colagenase."},
    {"id": "B", "text": "Filme de Poliuretano."},
    {"id": "C", "text": "Carvão Ativado com Prata."},
    {"id": "D", "text": "Tela de Rayon."}
  ]'::jsonb,
  'C',
  'O Carvão Ativado adsorve as bactérias e os gases responsáveis pelo odor fétido. A prata associada tem ação bactericida.',
  'FGV'
),
(
  'Feridas e Curativos',
  'O que é "Deiscência" de uma ferida operatória?',
  '[
    {"id": "A", "text": "Saída de vísceras através da incisão."},
    {"id": "B", "text": "Separação das bordas da ferida (abertura dos pontos)."},
    {"id": "C", "text": "Formação de queloide excessivo."},
    {"id": "D", "text": "Aderência da cicatriz aos planos profundos."}
  ]'::jsonb,
  'B',
  'Deiscência é a separação das bordas suturadas. Evisceração (Opção A) é a saída de órgãos internos através dessa abertura.',
  'CEBRASPE'
),
(
  'Feridas e Curativos',
  'Na avaliação de uma queimadura, a presença de flictenas (bolhas), dor intensa e base úmida/rósea caracteriza uma queimadura de:',
  '[
    {"id": "A", "text": "1º Grau."},
    {"id": "B", "text": "2º Grau (Espessura Parcial)."},
    {"id": "C", "text": "3º Grau (Espessura Total)."},
    {"id": "D", "text": "4º Grau."}
  ]'::jsonb,
  'B',
  'Queimaduras de 2º grau atingem a derme e são caracterizadas por bolhas e muita dor (terminações nervosas expostas). As de 3º grau são indolores (nervos destruídos) e secas/couro.',
  'VUNESP'
),
(
  'Feridas e Curativos',
  'O biofilme em feridas crônicas é:',
  '[
    {"id": "A", "text": "Uma camada de fibrina que auxilia na cicatrização."},
    {"id": "B", "text": "Uma comunidade de bactérias protegida por uma matriz extracelular, resistente a antibióticos e ao sistema imune."},
    {"id": "C", "text": "O mesmo que tecido de granulação saudável."},
    {"id": "D", "text": "Uma cobertura sintética aplicada pelo enfermeiro."}
  ]'::jsonb,
  'B',
  'Biofilme é a principal causa de cronificação de feridas. As bactérias se organizam e criam uma barreira física que impede a ação de antibióticos e a cicatrização.',
  'IBFC'
),
(
  'Feridas e Curativos',
  'Qual é a principal medida para prevenção de Lesão por Pressão em pacientes acamados?',
  '[
    {"id": "A", "text": "Massagem de conforto nas proeminências ósseas."},
    {"id": "B", "text": "Uso de almofadas em formato de roda (boia)."},
    {"id": "C", "text": "Mudança de decúbito periódica (a cada 2 horas) e alívio da pressão."},
    {"id": "D", "text": "Aplicação de talco para manter a pele seca."}
  ]'::jsonb,
  'C',
  'A mudança de decúbito é o padrão-ouro. Massagem em áreas de pressão e uso de rodas (boias) são CONTRAINDICADOS pois aumentam a isquemia tecidual.',
  'FCC'
),
(
  'Feridas e Curativos',
  'Para uma ferida seca com necrose de coagulação (escara preta), qual a melhor opção para promover desbridamento autolítico e reidratação?',
  '[
    {"id": "A", "text": "Alginato de Cálcio."},
    {"id": "B", "text": "Hidrogel."},
    {"id": "C", "text": "Carvão Ativado."},
    {"id": "D", "text": "Povidine Tópico."}
  ]'::jsonb,
  'B',
  'O Hidrogel doa água para a ferida, reidratando a necrose e facilitando sua separação (desbridamento autolítico).',
  'CONSULPLAN'
),
(
  'Feridas e Curativos',
  'O tecido de granulação saudável apresenta qual característica clínica?',
  '[
    {"id": "A", "text": "Cor amarela ou acinzentada, consistência mucoide."},
    {"id": "B", "text": "Cor vermelha viva, úmido, aspecto de framboesa, sangra facilmente ao toque."},
    {"id": "C", "text": "Cor preta, consistência dura e seca."},
    {"id": "D", "text": "Cor rosa pálido, seco e liso."}
  ]'::jsonb,
  'B',
  'O tecido de granulação é rico em novos vasos sanguíneos (angiogênese), por isso é vermelho vivo e sangra fácil. É o sinal de cicatrização ativa.',
  'IDECAN'
),
(
  'Feridas e Curativos',
  'A Terapia por Pressão Negativa (V.A.C.) é indicada para:',
  '[
    {"id": "A", "text": "Feridas com tecido necrótico não desbridado."},
    {"id": "B", "text": "Feridas malignas (tumorais)."},
    {"id": "C", "text": "Fístulas não exploradas."},
    {"id": "D", "text": "Feridas complexas, extensas, com muito exsudato, para estimular a granulação e aproximar bordas."}
  ]'::jsonb,
  'D',
  'A TPN acelera a cicatrização removendo exsudato, reduzindo edema e estimulando a perfusão. Necrose, câncer e fístulas desconhecidas são contraindicações.',
  'VUNESP'
),
(
  'Feridas e Curativos',
  'Segundo a RDC 15/2012, qual é o nível de processamento exigido para um "Artigo Crítico" (ex: pinça cirúrgica)?',
  '[
    {"id": "A", "text": "Limpeza apenas."},
    {"id": "B", "text": "Desinfecção de Nível Intermediário."},
    {"id": "C", "text": "Desinfecção de Alto Nível."},
    {"id": "D", "text": "Esterilização."}
  ]'::jsonb,
  'D',
  'Artigos críticos são aqueles que penetram tecidos estéreis ou sistema vascular. Exigem esterilização (eliminação de todos os microrganismos, incluindo esporos).',
  'ANVISA'
),
(
  'Feridas e Curativos',
  'Qual a principal diferença clínica entre uma Úlcera Venosa e uma Úlcera Arterial?',
  '[
    {"id": "A", "text": "A venosa é muito dolorosa e a arterial é indolor."},
    {"id": "B", "text": "A venosa melhora a dor com a elevação do membro; a arterial piora com a elevação."},
    {"id": "C", "text": "A venosa tem bordas regulares e fundo pálido; a arterial tem bordas irregulares e fundo vermelho."},
    {"id": "D", "text": "A arterial ocorre na panturrilha e a venosa nos dedos dos pés."}
  ]'::jsonb,
  'B',
  'Na úlcera venosa, elevar a perna melhora o retorno venoso e a dor. Na úlcera arterial (isquêmica), elevar a perna dificulta a chegada de sangue, piorando a dor.',
  'FGV'
)
ON CONFLICT (question) DO NOTHING;