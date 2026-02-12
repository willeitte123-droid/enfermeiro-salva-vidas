-- PACOTE DE REFORÇO 8: FILL THE GAPS (PREENCHIMENTO DE LACUNAS)
-- Foco: Categorias com < 20 questões identificadas no Dashboard
-- Proteção: ON CONFLICT DO NOTHING

INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES

  -- 1. CENTRO CIRÚRGICO E CME (Reforço Técnico)
  (
    'Centro Cirúrgico e CME',
    'No Centro de Material e Esterilização (CME), o fluxo de processamento dos artigos deve ser unidirecional e contínuo para evitar contaminação cruzada. A sequência correta das áreas é:',
    '[
      {"id": "A", "text": "Expurgo -> Preparo e Esterilização -> Guarda e Distribuição."},
      {"id": "B", "text": "Preparo -> Expurgo -> Esterilização -> Guarda."},
      {"id": "C", "text": "Guarda -> Esterilização -> Expurgo -> Preparo."},
      {"id": "D", "text": "Esterilização -> Expurgo -> Preparo -> Distribuição."}
    ]'::jsonb,
    'A',
    'O material sujo entra no Expurgo (área suja), passa para o Preparo (área limpa), é esterilizado e vai para a Guarda (área estéril). Nunca deve voltar.',
    'RDC 15'
  ),
  (
    'Centro Cirúrgico e CME',
    'Sobre as embalagens utilizadas para esterilização, o papel grau cirúrgico é amplamente utilizado por:',
    '[
      {"id": "A", "text": "Ser reutilizável por até 5 vezes."},
      {"id": "B", "text": "Ser impermeável ao vapor, permitindo apenas calor seco."},
      {"id": "C", "text": "Permitir a penetração do agente esterilizante e prover barreira microbiana após o processo."},
      {"id": "D", "text": "Ser compatível apenas com óxido de etileno."}
    ]'::jsonb,
    'C',
    'O papel grau cirúrgico tem porosidade controlada que abre no calor/pressão para entrada do vapor e fecha ao secar/esfriar, mantendo a esterilidade.',
    'SOBECC'
  ),
  (
    'Centro Cirúrgico e CME',
    'A validade da esterilização de um produto não é determinada apenas pelo tempo, mas principalmente por:',
    '[
      {"id": "A", "text": "Eventos relacionados (integridade da embalagem, umidade, condições de armazenamento)."},
      {"id": "B", "text": "Apenas a data de processamento."},
      {"id": "C", "text": "Tipo de autoclave utilizada."},
      {"id": "D", "text": "Cor da fita zebrada."}
    ]'::jsonb,
    'A',
    'O conceito moderno é "esterilidade evento-relacionada". Se a embalagem cair, molhar, rasgar ou for amassada, perde a validade imediatamente.',
    'ANVISA'
  ),
  (
    'Centro Cirúrgico e CME',
    'A limpeza é a etapa mais crítica do processamento. O uso de detergente enzimático é recomendado porque:',
    '[
      {"id": "A", "text": "Esteriliza o material a frio."},
      {"id": "B", "text": "Dissolve matéria orgânica (proteínas, gorduras, carboidratos), facilitando a limpeza."},
      {"id": "C", "text": "Substitui a ação mecânica da escovação."},
      {"id": "D", "text": "Forma uma película protetora no instrumental."}
    ]'::jsonb,
    'B',
    'As enzimas quebram a sujeira biológica, permitindo que ela seja removida com mais facilidade e eficácia durante o enxágue/escovação.',
    'CME'
  ),
  (
    'Centro Cirúrgico e CME',
    'No período pós-operatório imediato, a complicação respiratória mais comum na sala de recuperação (SRPA), causada geralmente pela queda da língua ou acúmulo de secreções, é a:',
    '[
      {"id": "A", "text": "Pneumonia aspirativa."},
      {"id": "B", "text": "Embolia pulmonar."},
      {"id": "C", "text": "Obstrução de vias aéreas superiores."},
      {"id": "D", "text": "Edema agudo de pulmão."}
    ]'::jsonb,
    'C',
    'O relaxamento muscular residual da anestesia faz a língua cair para trás, obstruindo a faringe. A manobra de elevação do queixo (Chin Lift) ou cânula de Guedel resolvem.',
    'Anestesiologia'
  ),

  -- 2. SAÚDE MENTAL (Reforço)
  (
    'Saúde Mental',
    'A contenção mecânica de um paciente em surto psicótico agressivo é um procedimento terapêutico que exige cuidados. É CORRETO afirmar:',
    '[
      {"id": "A", "text": "Pode ser mantida por tempo indeterminado até o paciente pedir para sair."},
      {"id": "B", "text": "Deve ser prescrita pelo médico e o paciente monitorado continuamente pela enfermagem."},
      {"id": "C", "text": "Não necessita de registro em prontuário."},
      {"id": "D", "text": "É a primeira escolha de tratamento para qualquer agitação."}
    ]'::jsonb,
    'B',
    'A contenção é medida de exceção/último recurso. Exige prescrição (ou validação médica imediata), monitoramento de sinais vitais e circulação, e registro rigoroso.',
    'Res. COFEN'
  ),
  (
    'Saúde Mental',
    'Na avaliação do estado mental, uma alteração da sensopercepção onde o paciente percebe um objeto real de forma distorcida (ex: vê um casaco e acha que é um monstro) é chamada de:',
    '[
      {"id": "A", "text": "Alucinação."},
      {"id": "B", "text": "Ilusão."},
      {"id": "C", "text": "Delírio."},
      {"id": "D", "text": "Despersonalização."}
    ]'::jsonb,
    'B',
    'Ilusão é a distorção de um objeto real. Alucinação é a percepção sem objeto (ouvir vozes que não existem). Delírio é alteração do juízo (crença falsa).',
    'Psicopatologia'
  ),
  (
    'Saúde Mental',
    'O risco de suicídio é uma emergência psiquiátrica. São considerados fatores de alto risco, EXCETO:',
    '[
      {"id": "A", "text": "Tentativa prévia de suicídio."},
      {"id": "B", "text": "Presença de plano estruturado e acesso a meios letais."},
      {"id": "C", "text": "Ser do sexo feminino."},
      {"id": "D", "text": "Isolamento social e desesperança."}
    ]'::jsonb,
    'C',
    'Embora as mulheres tentem mais, os homens consumam mais o suicídio (maior letalidade). Tentativa prévia é o maior preditor isolado. Sexo feminino isoladamente não é fator de "alto risco" comparado aos demais.',
    'MS/Prevenção Suicídio'
  ),
  (
    'Saúde Mental',
    'A síndrome de abstinência ao álcool pode evoluir para uma forma grave conhecida como Delirium Tremens, caracterizada por:',
    '[
      {"id": "A", "text": "Sonolência excessiva e bradicardia."},
      {"id": "B", "text": "Rebaixamento da consciência, hipotensão e hipotermia."},
      {"id": "C", "text": "Confusão mental, agitação, tremores, alucinações e instabilidade autonômica (taquicardia/hipertensão)."},
      {"id": "D", "text": "Aumento do apetite e ganho de peso."}
    ]'::jsonb,
    'C',
    'O Delirium Tremens é uma emergência médica com alta mortalidade se não tratado. Ocorre geralmente 48-96h após a última ingesta.',
    'Clínica Médica'
  ),

  -- 3. ADMINISTRAÇÃO EM ENFERMAGEM
  (
    'Administração em Enfermagem',
    'Na gestão de materiais, a Curva ABC é uma ferramenta utilizada para o controle de estoque. Os itens da Classe A são aqueles que:',
    '[
      {"id": "A", "text": "Possuem baixo custo e baixo consumo."},
      {"id": "B", "text": "Representam a maior parte da quantidade física do estoque, mas baixo valor monetário."},
      {"id": "C", "text": "Representam a menor parte da quantidade física, mas correspondem ao maior valor monetário (alto custo/investimento)."},
      {"id": "D", "text": "São descartáveis e de uso único."}
    ]'::jsonb,
    'C',
    'Classe A: Alta importância financeira (custo elevado), exige controle rigoroso. Classe C: Baixo custo, controle mais simples.',
    'Gestão Hospitalar'
  ),
  (
    'Administração em Enfermagem',
    'O recrutamento e a seleção de pessoal são processos distintos. O recrutamento refere-se a:',
    '[
      {"id": "A", "text": "Escolher o candidato mais apto para a vaga."},
      {"id": "B", "text": "Atrair candidatos potencialmente qualificados para o processo seletivo."},
      {"id": "C", "text": "Treinar o funcionário recém-admitido."},
      {"id": "D", "text": "Avaliar o desempenho do funcionário."}
    ]'::jsonb,
    'B',
    'Recrutamento é atrair (divulgar vaga). Seleção é escolher (entrevista/prova). Treinamento é capacitar.',
    'Gestão de Pessoas'
  ),
  (
    'Administração em Enfermagem',
    'No processo de auditoria em saúde, a análise que ocorre APÓS a alta do paciente, através da revisão do prontuário e das contas hospitalares, é classificada como:',
    '[
      {"id": "A", "text": "Auditoria Prospectiva."},
      {"id": "B", "text": "Auditoria Concorrente."},
      {"id": "C", "text": "Auditoria Retrospectiva."},
      {"id": "D", "text": "Auditoria Operacional."}
    ]'::jsonb,
    'C',
    'Retrospectiva olha para trás (passado). Concorrente ocorre enquanto o paciente está internado. Prospectiva ocorre antes do procedimento.',
    'Auditoria'
  ),
  (
    'Administração em Enfermagem',
    'O ciclo PDCA é uma ferramenta de gestão da qualidade utilizada para a melhoria contínua de processos. As etapas são:',
    '[
      {"id": "A", "text": "Planejar, Dirigir, Controlar, Avaliar."},
      {"id": "B", "text": "Plan (Planejar), Do (Fazer), Check (Checar), Act (Agir/Corrigir)."},
      {"id": "C", "text": "Prever, Desenvolver, Calcular, Analisar."},
      {"id": "D", "text": "Programar, Delegar, Cobrar, Assinar."}
    ]'::jsonb,
    'B',
    'O ciclo de Deming (PDCA) é a base da gestão da qualidade total.',
    'Qualidade'
  ),

  -- 4. SAÚDE DO TRABALHADOR
  (
    'Saúde do Trabalhador',
    'A Norma Regulamentadora que visa estabelecer parâmetros que permitam a adaptação das condições de trabalho às características psicofisiológicas dos trabalhadores (Ergonomia) é a:',
    '[
      {"id": "A", "text": "NR 05."},
      {"id": "B", "text": "NR 07."},
      {"id": "C", "text": "NR 17."},
      {"id": "D", "text": "NR 32."}
    ]'::jsonb,
    'C',
    'NR-17 trata da Ergonomia (levantamento de peso, mobiliário, postura). NR-32 é específica da saúde. NR-5 é CIPA. NR-7 é PCMSO.',
    'Segurança do Trabalho'
  ),
  (
    'Saúde do Trabalhador',
    'Os riscos ocupacionais são classificados em grupos por cores. O Risco Biológico (vírus, bactérias) é representado pela cor:',
    '[
      {"id": "A", "text": "Verde."},
      {"id": "B", "text": "Vermelho."},
      {"id": "C", "text": "Marrom."},
      {"id": "D", "text": "Amarelo."}
    ]'::jsonb,
    'C',
    'Verde = Físico (ruído). Vermelho = Químico. Marrom = Biológico. Amarelo = Ergonômico. Azul = Acidente.',
    'Segurança do Trabalho'
  ),
  (
    'Saúde do Trabalhador',
    'O profissional de saúde que sofre acidente com material perfurocortante contaminado com sangue de paciente fonte desconhecida deve:',
    '[
      {"id": "A", "text": "Lavar o local, espremer o ferimento e voltar ao trabalho."},
      {"id": "B", "text": "Procurar atendimento imediato (até 2 horas) para avaliação de quimioprofilaxia (PEP) para HIV e Hepatite B."},
      {"id": "C", "text": "Aguardar 30 dias para fazer o teste de HIV."},
      {"id": "D", "text": "Iniciar tratamento para Hepatite C imediatamente."}
    ]'::jsonb,
    'B',
    'O tempo ideal para início da PEP (se indicada) é de 2 horas, máximo 72h. Não se deve espremer a ferida (aumenta área de contato).',
    'Ministério da Saúde'
  ),

  -- 5. BIOSSEGURANÇA E PRECAUÇÕES
  (
    'Biossegurança e Controle de Infecção',
    'A Varicela (Catapora) e o Herpes Zoster disseminado exigem, além das precauções padrão, precauções para:',
    '[
      {"id": "A", "text": "Apenas Contato."},
      {"id": "B", "text": "Apenas Gotículas."},
      {"id": "C", "text": "Aerossóis e Contato."},
      {"id": "D", "text": "Reversa."}
    ]'::jsonb,
    'C',
    'Transmite-se pelo ar (vírus leve, aerossol) e pelo contato direto com as lesões de pele. Exige N95 e quarto privativo.',
    'Infectologia'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'A Escabiose (Sarna) é uma infestação parasitária que exige precaução de:',
    '[
      {"id": "A", "text": "Contato (até 24h de tratamento efetivo)."},
      {"id": "B", "text": "Gotículas."},
      {"id": "C", "text": "Aerossóis."},
      {"id": "D", "text": "Padrão apenas."}
    ]'::jsonb,
    'A',
    'A transmissão ocorre pelo contato direto pele a pele ou fômites (roupas de cama).',
    'ANVISA'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'O uso da máscara PFF2 (N95) é obrigatório para o profissional de saúde ao entrar no quarto de paciente com suspeita ou confirmação de:',
    '[
      {"id": "A", "text": "Influenza (Gripe)."},
      {"id": "B", "text": "Meningite Meningocócica."},
      {"id": "C", "text": "Tuberculose Pulmonar."},
      {"id": "D", "text": "Coqueluche."}
    ]'::jsonb,
    'C',
    'Tuberculose, Sarampo e Varicela transmitem por aerossóis (< 5 micra), que ficam suspensos no ar. As outras opções são gotículas (máscara cirúrgica).',
    'ANVISA'
  ),

  -- 6. IMUNIZAÇÃO (PNI)
  (
    'Imunização',
    'A vacina contra o Papilomavírus Humano (HPV) está disponível no SUS atualmente para meninas e meninos na faixa etária de:',
    '[
      {"id": "A", "text": "9 a 11 anos."},
      {"id": "B", "text": "9 a 14 anos."},
      {"id": "C", "text": "11 a 14 anos."},
      {"id": "D", "text": "10 a 19 anos."}
    ]'::jsonb,
    'B',
    'A faixa foi unificada e ampliada para 9 a 14 anos, para ambos os sexos. O esquema preferencial agora é dose única (exceto imunossuprimidos).',
    'PNI 2024'
  ),
  (
    'Imunização',
    'A vacina Tríplice Viral protege contra:',
    '[
      {"id": "A", "text": "Sarampo, Caxumba e Rubéola."},
      {"id": "B", "text": "Sarampo, Varicela e Rubéola."},
      {"id": "C", "text": "Difteria, Tétano e Coqueluche."},
      {"id": "D", "text": "Hepatite B, Tétano e Influenza."}
    ]'::jsonb,
    'A',
    'Administrada aos 12 meses. Aos 15 meses, administra-se a Tetra Viral (inclui Varicela).',
    'PNI'
  ),
  (
    'Imunização',
    'Qual vacina é contraindicada para gestantes por conter vírus vivos atenuados?',
    '[
      {"id": "A", "text": "Hepatite B."},
      {"id": "B", "text": "Influenza."},
      {"id": "C", "text": "dTpa."},
      {"id": "D", "text": "Tríplice Viral."}
    ]'::jsonb,
    'D',
    'Vacinas de vírus vivo (Tríplice Viral, Varicela, Febre Amarela, BCG) oferecem risco teórico ao feto e são contraindicadas na gestação.',
    'PNI'
  ),

  -- 7. ONCOLOGIA
  (
    'Oncologia',
    'O estadiamento TNM é o sistema global para descrever a extensão do câncer. As siglas significam, respectivamente:',
    '[
      {"id": "A", "text": "Tempo, Neoplasia, Metástase."},
      {"id": "B", "text": "Tumor (tamanho), Linfonodos (Nódulos/Gânglios), Metástase (à distância)."},
      {"id": "C", "text": "Tecido, Necrose, Malignidade."},
      {"id": "D", "text": "Tratamento, Nível, Monitoramento."}
    ]'::jsonb,
    'B',
    'T = Tumor primário; N = Linfonodos regionais (Nodes); M = Metástase à distância.',
    'INCA'
  ),
  (
    'Oncologia',
    'Uma emergência oncológica metabólica comum em pacientes com tumores de rápida proliferação (ex: leucemias, linfomas) após início da quimioterapia é a:',
    '[
      {"id": "A", "text": "Síndrome de Lise Tumoral."},
      {"id": "B", "text": "Síndrome da Veia Cava Superior."},
      {"id": "C", "text": "Compressão Medular."},
      {"id": "D", "text": "Tamponamento Cardíaco."}
    ]'::jsonb,
    'A',
    'A destruição maciça de células tumorais libera potássio, fósforo e ácido úrico no sangue, causando hipercalemia, hiperfosfatemia, hiperuricemia e hipocalcemia.',
    'Oncologia'
  ),

  -- 8. SISTEMATIZAÇÃO (SAE)
  (
    'Sistematização da Assistência (SAE)',
    'A taxonomia da NANDA-I organiza os diagnósticos de enfermagem em Domínios e Classes. A estrutura básica de um diagnóstico real (foco no problema) é composta por:',
    '[
      {"id": "A", "text": "Título + Fatores de Risco."},
      {"id": "B", "text": "Título + Características Definidoras (Sinais/Sintomas) + Fatores Relacionados (Causas)."},
      {"id": "C", "text": "Título + Intervenções + Resultados."},
      {"id": "D", "text": "Apenas o Título."}
    ]'::jsonb,
    'B',
    'O formato clássico é PES: Problema (Título), Etiologia (Fatores Relacionados) e Sinais/Sintomas (Características Definidoras).',
    'NANDA-I'
  ),
  (
    'Sistematização da Assistência (SAE)',
    'A diferença fundamental entre Anotação de Enfermagem e Evolução de Enfermagem é:',
    '[
      {"id": "A", "text": "Anotação é feita pelo enfermeiro e Evolução pelo técnico."},
      {"id": "B", "text": "Anotação refere-se a dados pontuais/brutos de todo a equipe; Evolução é a análise reflexiva do enfermeiro nas 24h."},
      {"id": "C", "text": "Não há diferença, são sinônimos."},
      {"id": "D", "text": "Anotação é feita no computador e Evolução no papel."}
    ]'::jsonb,
    'B',
    'A Evolução é privativa do Enfermeiro e analisa a eficácia do cuidado. A Anotação é o registro de fatos (sinais, procedimentos) por qualquer membro da equipe.',
    'Res. COFEN'
  ),

  -- 9. GERAIS E ÉTICA (Complementar)
  (
    'Ética e Legislação',
    'O enfermeiro pode realizar o aborto legal (nos casos previstos em lei)?',
    '[
      {"id": "A", "text": "Não, é ato privativo médico."},
      {"id": "B", "text": "Sim, se tiver capacitação técnica e estiver dentro de uma equipe multiprofissional em serviço habilitado."},
      {"id": "C", "text": "Sim, em qualquer situação, se a paciente pedir."},
      {"id": "D", "text": "Apenas se houver risco de morte iminente."}
    ]'::jsonb,
    'B',
    'Não é ato privativo médico. Enfermeiros capacitados podem atuar na assistência ao aborto legal (ex: administração de medicamentos), conforme protocolos do MS e pareceres do COFEN.',
    'Legislação'
  ),
  (
    'Ética e Legislação',
    'Em caso de morte do paciente, o segredo profissional:',
    '[
      {"id": "A", "text": "Deixa de existir, podendo-se revelar tudo à família."},
      {"id": "B", "text": "Deve ser mantido, exceto se houver justa causa ou dever legal."},
      {"id": "C", "text": "Só é mantido por 5 anos."},
      {"id": "D", "text": "Pode ser quebrado para fins jornalísticos."}
    ]'::jsonb,
    'B',
    'O dever de sigilo permanece mesmo após a morte do paciente, respeitando sua privacidade e dignidade póstuma.',
    'Código de Ética'
  ),
  (
    'Ética e Legislação',
    'Durante uma greve de enfermagem, é dever ético do profissional:',
    '[
      {"id": "A", "text": "Paralisar 100% das atividades para garantir o impacto."},
      {"id": "B", "text": "Garantir a assistência mínima essencial (urgência/emergência) e os cuidados inadiáveis."},
      {"id": "C", "text": "Impedir que outros profissionais trabalhem."},
      {"id": "D", "text": "Abandonar o plantão sem aviso prévio."}
    ]'::jsonb,
    'B',
    'O direito de greve deve respeitar o direito à vida e à assistência inadiável da população.',
    'Lei de Greve/Ética'
  ),

  -- 10. EMERGÊNCIA (Complemento)
  (
    'Urgência e Emergência',
    'A manobra de Evasão (Jaw Thrust) é indicada para abertura de vias aéreas em qual situação específica?',
    '[
      {"id": "A", "text": "Paciente clínico sem trauma."},
      {"id": "B", "text": "Suspeita de trauma raquimedular (cervical)."},
      {"id": "C", "text": "Paciente pediátrico."},
      {"id": "D", "text": "Sempre que houver vômito."}
    ]'::jsonb,
    'B',
    'A manobra Chin Lift (elevação do queixo) estende o pescoço, o que é proibido no trauma. O Jaw Thrust (anteriorização da mandíbula) abre a via aérea sem mover o pescoço.',
    'PHTLS'
  )

ON CONFLICT (question) DO NOTHING;