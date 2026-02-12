-- PACOTE DE REFORÇO 2: CATEGORIAS CRÍTICAS
-- Foco: Saúde Mental, Ética, Mulher/Criança, Centro Cirúrgico, Nefro, Cardio

INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES

  -- 1. SAÚDE MENTAL E PSIQUIATRIA (Reforço)
  (
    'Saúde Mental e Psiquiatria',
    'De acordo com a Lei nº 10.216/2001 (Lei da Reforma Psiquiátrica), a internação psiquiátrica involuntária deve ser comunicada ao Ministério Público no prazo máximo de:',
    '[
      {"id": "A", "text": "24 horas."},
      {"id": "B", "text": "48 horas."},
      {"id": "C", "text": "72 horas."},
      {"id": "D", "text": "7 dias."}
    ]'::jsonb,
    'C',
    'A lei determina que toda internação involuntária e sua respectiva alta devem ser comunicadas ao MP estadual em até 72 horas.',
    'VUNESP'
  ),
  (
    'Saúde Mental e Psiquiatria',
    'O Carbonato de Lítio é um estabilizador de humor amplamente utilizado. Um sinal precoce de intoxicação por lítio que o enfermeiro deve observar é:',
    '[
      {"id": "A", "text": "Hipertensão arterial severa."},
      {"id": "B", "text": "Tremor grosseiro de extremidades e ataxia."},
      {"id": "C", "text": "Polifagia e ganho de peso rápido."},
      {"id": "D", "text": "Insônia persistente."}
    ]'::jsonb,
    'B',
    'Tremores grosseiros, ataxia (dificuldade de coordenação), náuseas e vômitos são sinais de alerta para litemia acima do nível terapêutico.',
    'IBFC'
  ),
  (
    'Saúde Mental e Psiquiatria',
    'Qual dispositivo da Rede de Atenção Psicossocial (RAPS) oferece atendimento 24 horas, inclusive em feriados e finais de semana, com leitos de acolhimento noturno?',
    '[
      {"id": "A", "text": "CAPS I."},
      {"id": "B", "text": "CAPS II."},
      {"id": "C", "text": "CAPS III."},
      {"id": "D", "text": "Ambulatório de Saúde Mental."}
    ]'::jsonb,
    'C',
    'O CAPS III é específico para municípios maiores e funciona ininterruptamente, servindo como retaguarda à crise para evitar internações hospitalares.',
    'FCC'
  ),
  (
    'Saúde Mental e Psiquiatria',
    'Na abordagem ao paciente em crise de agitação psicomotora, a primeira conduta da equipe de enfermagem deve ser:',
    '[
      {"id": "A", "text": "Realizar contenção mecânica imediata."},
      {"id": "B", "text": "Administrar haloperidol intramuscular à força."},
      {"id": "C", "text": "Tentar a contenção verbal e manejo do ambiente."},
      {"id": "D", "text": "Chamar a segurança e se afastar."}
    ]'::jsonb,
    'C',
    'A abordagem deve ser escalonada. A contenção verbal (escuta, negociação) é sempre a primeira opção. Medicação e contenção física são últimos recursos.',
    'FGV'
  ),

  -- 2. ÉTICA E LEGISLAÇÃO (Reforço)
  (
    'Ética e Legislação',
    'Um enfermeiro deixa de verificar os sinais vitais de um paciente instável, e o paciente vai a óbito por choque não detectado. Ética e legalmente, essa atitude configura:',
    '[
      {"id": "A", "text": "Imperícia."},
      {"id": "B", "text": "Imprudência."},
      {"id": "C", "text": "Negligência."},
      {"id": "D", "text": "Dolo."}
    ]'::jsonb,
    'C',
    'Negligência é a omissão, o deixar de fazer o que deveria ser feito (desleixo/desatenção).',
    'COREN-SP'
  ),
  (
    'Ética e Legislação',
    'Segundo o Código de Ética dos Profissionais de Enfermagem, a penalidade de Cassação do direito ao exercício profissional é competência exclusiva do:',
    '[
      {"id": "A", "text": "Conselho Regional de Enfermagem (COREN)."},
      {"id": "B", "text": "Conselho Federal de Enfermagem (COFEN)."},
      {"id": "C", "text": "Sindicato dos Enfermeiros."},
      {"id": "D", "text": "Ministério da Saúde."}
    ]'::jsonb,
    'B',
    'As penalidades leves (advertência, multa, censura, suspensão) são aplicadas pelo COREN. A Cassação (pena máxima) só pode ser executada pelo COFEN.',
    'CESPE'
  ),
  (
    'Ética e Legislação',
    'O sigilo profissional pode ser quebrado pelo enfermeiro nas seguintes situações, EXCETO:',
    '[
      {"id": "A", "text": "Quando houver consentimento escrito do paciente."},
      {"id": "B", "text": "Em casos de notificação compulsória de doenças."},
      {"id": "C", "text": "Para compartilhar curiosidades com colegas fora do ambiente de trabalho."},
      {"id": "D", "text": "Por ordem judicial."}
    ]'::jsonb,
    'C',
    'O sigilo é um dever. Compartilhar informações sem justa causa, dever legal ou autorização é infração ética grave.',
    'AOCP'
  ),

  -- 3. SAÚDE DA MULHER E DA CRIANÇA (Reforço)
  (
    'Saúde da Mulher e da Criança',
    'Na assistência pré-natal, a administração de Ácido Fólico é recomendada para prevenir:',
    '[
      {"id": "A", "text": "Diabetes Gestacional."},
      {"id": "B", "text": "Anemia Ferropriva Materna."},
      {"id": "C", "text": "Defeitos do Tubo Neural (DTN) no feto."},
      {"id": "D", "text": "Pré-eclâmpsia."}
    ]'::jsonb,
    'C',
    'O ácido fólico deve ser iniciado idealmente 3 meses antes da concepção para prevenir malformações como espinha bífida e anencefalia.',
    'VUNESP'
  ),
  (
    'Saúde da Mulher e da Criança',
    'Qual vacina deve ser administrada na gestante a partir da 20ª semana, a cada gestação, para proteger o recém-nascido contra coqueluche?',
    '[
      {"id": "A", "text": "DT (Dupla tipo adulto)."},
      {"id": "B", "text": "dTpa (Tríplice bacteriana acelular)."},
      {"id": "C", "text": "Hepatite B."},
      {"id": "D", "text": "Influenza."}
    ]'::jsonb,
    'B',
    'A dTpa é crucial para transferir anticorpos contra a Bordetella pertussis (coqueluche) para o feto, protegendo-o nos primeiros meses de vida.',
    'MS/PNI'
  ),
  (
    'Saúde da Mulher e da Criança',
    'Em pediatria, a via preferencial para administração de vacinas intramusculares em crianças menores de 2 anos é:',
    '[
      {"id": "A", "text": "Músculo Deltoide."},
      {"id": "B", "text": "Região Dorso-glútea."},
      {"id": "C", "text": "Músculo Vasto Lateral da Coxa."},
      {"id": "D", "text": "Músculo Glúteo Máximo."}
    ]'::jsonb,
    'C',
    'O vasto lateral é o músculo mais desenvolvido e seguro nessa faixa etária, longe de nervos importantes e vasos calibrosos.',
    'IBFC'
  ),
  (
    'Saúde da Mulher e da Criança',
    'A Manobra de Leopold é utilizada na consulta de enfermagem obstétrica para:',
    '[
      {"id": "A", "text": "Avaliar a dilatação do colo uterino."},
      {"id": "B", "text": "Identificar a situação, posição e apresentação fetal."},
      {"id": "C", "text": "Medir a altura uterina."},
      {"id": "D", "text": "Realizar a ausculta dos batimentos cardiofetais."}
    ]'::jsonb,
    'B',
    'São 4 tempos de palpação abdominal que permitem determinar como o feto está posicionado no útero.',
    'CESGRANRIO'
  ),

  -- 4. CENTRO CIRÚRGICO E CME (Reforço)
  (
    'Centro Cirúrgico e CME',
    'Na montagem da sala cirúrgica, a placa do bisturi elétrico (eletrocautério) deve ser posicionada preferencialmente em:',
    '[
      {"id": "A", "text": "Regiões com muitos pelos."},
      {"id": "B", "text": "Proeminências ósseas."},
      {"id": "C", "text": "Áreas de grande massa muscular, limpas e secas."},
      {"id": "D", "text": "Sobre tatuagens ou cicatrizes."}
    ]'::jsonb,
    'C',
    'A placa deve ficar em área muscular bem vascularizada (ex: coxa, panturrilha) para garantir o retorno da corrente e evitar queimaduras.',
    'SOBECC'
  ),
  (
    'Centro Cirúrgico e CME',
    'A Hipertermia Maligna é uma complicação anestésica grave. O sinal clínico mais precoce geralmente é:',
    '[
      {"id": "A", "text": "Aumento súbito da temperatura (>40ºC)."},
      {"id": "B", "text": "Aumento do CO2 expirado (ETCO2) e taquicardia."},
      {"id": "C", "text": "Hipotensão severa."},
      {"id": "D", "text": "Rigidez muscular generalizada."}
    ]'::jsonb,
    'B',
    'Embora o nome seja hipertermia, a febre é um sinal tardio. O aumento do metabolismo muscular eleva o CO2 rapidamente.',
    'EBSERH'
  ),
  (
    'Centro Cirúrgico e CME',
    'Na Central de Material e Esterilização (CME), a área destinada à recepção, conferência e limpeza dos materiais contaminados é chamada de:',
    '[
      {"id": "A", "text": "Área Limpa."},
      {"id": "B", "text": "Área Estéril."},
      {"id": "C", "text": "Expurgo (Área Suja)."},
      {"id": "D", "text": "Arsenal."}
    ]'::jsonb,
    'C',
    'O Expurgo é a área crítica onde se inicia o processamento, separada fisicamente das áreas limpas para evitar contaminação cruzada.',
    'ANVISA'
  ),
  (
    'Centro Cirúrgico e CME',
    'Qual o tempo mínimo recomendado para a fricção das mãos com preparação alcoólica (álcool gel) ou escovação cirúrgica com antisséptico degermante antes da cirurgia?',
    '[
      {"id": "A", "text": "30 segundos."},
      {"id": "B", "text": "1 a 2 minutos (álcool) ou 3 a 5 minutos (degermante)."},
      {"id": "C", "text": "10 minutos."},
      {"id": "D", "text": "Apenas lavagem simples é suficiente."}
    ]'::jsonb,
    'B',
    'A antissepsia cirúrgica das mãos visa eliminar a microbiota transitória e reduzir a residente. O tempo varia conforme o produto, mas 3-5 min é o padrão para degermantes.',
    'OMS'
  ),

  -- 5. NEFROLOGIA (Reforço)
  (
    'Nefrologia',
    'Na avaliação de uma Fístula Arteriovenosa (FAV) para hemodiálise, o enfermeiro deve verificar a presença de:',
    '[
      {"id": "A", "text": "Cianose e dor."},
      {"id": "B", "text": "Frêmito (palpação) e Sopro (ausculta)."},
      {"id": "C", "text": "Edema e rubor."},
      {"id": "D", "text": "Ausência de fluxo sanguíneo."}
    ]'::jsonb,
    'B',
    'O frêmito (vibração tátil) e o sopro indicam que o fluxo sanguíneo está turbilhonar e a fístula está pérvia (funcionando).',
    'SBN'
  ),
  (
    'Nefrologia',
    'A complicação mais comum durante a sessão de hemodiálise, causada pela retirada rápida de líquidos (ultrafiltração), é:',
    '[
      {"id": "A", "text": "Hipertensão arterial."},
      {"id": "B", "text": "Síndrome do Desequilíbrio."},
      {"id": "C", "text": "Hipotensão arterial."},
      {"id": "D", "text": "Febre."}
    ]'::jsonb,
    'C',
    'A hipotensão intradialítica ocorre quando a taxa de remoção de líquido excede a taxa de reenchimento plasmático do paciente.',
    'IBFC'
  ),
  (
    'Nefrologia',
    'Na Diálise Peritoneal, a complicação infecciosa mais frequente, caracterizada por líquido drenado turvo e dor abdominal, é:',
    '[
      {"id": "A", "text": "Infecção do túnel do cateter."},
      {"id": "B", "text": "Peritonite."},
      {"id": "C", "text": "Hérnia abdominal."},
      {"id": "D", "text": "Hemoperitônio."}
    ]'::jsonb,
    'B',
    'A peritonite é a infecção da membrana peritoneal, geralmente causada por contaminação durante as trocas de bolsa.',
    'FGV'
  ),

  -- 6. CARDIOLOGIA (Reforço)
  (
    'Cardiologia',
    'No eletrocardiograma (ECG), a Onda P representa:',
    '[
      {"id": "A", "text": "A repolarização ventricular."},
      {"id": "B", "text": "A despolarização (contração) dos átrios."},
      {"id": "C", "text": "A despolarização dos ventrículos."},
      {"id": "D", "text": "O atraso no nó atrioventricular."}
    ]'::jsonb,
    'B',
    'A Onda P é a primeira onda do ciclo cardíaco normal e indica a atividade elétrica dos átrios.',
    'VUNESP'
  ),
  (
    'Cardiologia',
    'Qual marcador de necrose miocárdica é considerado o mais sensível e específico para o diagnóstico de Infarto Agudo do Miocárdio (IAM)?',
    '[
      {"id": "A", "text": "CK-MB."},
      {"id": "B", "text": "Mioglobina."},
      {"id": "C", "text": "Troponina."},
      {"id": "D", "text": "LDH."}
    ]'::jsonb,
    'C',
    'As Troponinas (I ou T) são proteínas exclusivas do músculo cardíaco, elevando-se precocemente e permanecendo altas por dias.',
    'SBC'
  ),
  (
    'Cardiologia',
    'O cuidado de enfermagem prioritário antes de administrar Digoxina (digitálico) é:',
    '[
      {"id": "A", "text": "Verificar a pressão arterial."},
      {"id": "B", "text": "Verificar a frequência cardíaca apical por 1 minuto."},
      {"id": "C", "text": "Pesar o paciente."},
      {"id": "D", "text": "Medir a diurese."}
    ]'::jsonb,
    'B',
    'Digitálicos diminuem a frequência cardíaca. Se FC < 60 bpm, a dose deve ser suspensa e o médico comunicado (risco de intoxicação/bloqueio).',
    'FUNDATEC'
  ),

  -- 7. FARMACOLOGIA E CÁLCULOS (Reforço)
  (
    'Farmacologia e Alta Vigilância',
    'Para administrar 500ml de Soro Fisiológico em 4 horas, utilizando um equipo de macrogotas (20 gts/ml), o gotejamento deve ser de aproximadamente:',
    '[
      {"id": "A", "text": "21 gotas/min."},
      {"id": "B", "text": "42 gotas/min."},
      {"id": "C", "text": "83 gotas/min."},
      {"id": "D", "text": "125 gotas/min."}
    ]'::jsonb,
    'B',
    'Fórmula: V / (T x 3) = 500 / (4 x 3) = 500 / 12 = 41,6 (arredonda para 42).',
    'Cálculo'
  ),
  (
    'Farmacologia e Alta Vigilância',
    'A administração de Omeprazol endovenoso exige cuidados específicos. A recomendação padrão para sua diluição e tempo de administração é:',
    '[
      {"id": "A", "text": "Diluir em 100ml e infundir em 30 minutos."},
      {"id": "B", "text": "Administrar puro (bolus rápido) em 10 segundos."},
      {"id": "C", "text": "Reconstituir apenas com o diluente próprio e administrar em bolus lento (2-5 min) ou diluído em 100ml."},
      {"id": "D", "text": "Diluir em Ringer Lactato."}
    ]'::jsonb,
    'C',
    'O Omeprazol é instável. Deve ser usado o diluente do fabricante. Para infusão, usar SF 0,9% ou SG 5% e infundir em 20-30 min.',
    'EBSERH'
  ),
  (
    'Farmacologia e Alta Vigilância',
    'Em relação à segurança do paciente, os medicamentos de Alta Vigilância (MAV) ou Potencialmente Perigosos exigem:',
    '[
      {"id": "A", "text": "Armazenamento junto com os demais medicamentos."},
      {"id": "B", "text": "Dupla checagem independente antes da administração."},
      {"id": "C", "text": "Prescrição verbal em situações de rotina."},
      {"id": "D", "text": "Uso livre sem bomba de infusão."}
    ]'::jsonb,
    'B',
    'Devido ao alto risco de danos graves em caso de erro, MAVs (ex: insulina, heparina, potássio) exigem dupla checagem.',
    'ISMP'
  ),

  -- 8. SAÚDE COLETIVA (Reforço)
  (
    'Saúde Coletiva e SUS',
    'O princípio do SUS que garante que o sistema deve estar preparado para atender a todas as necessidades do paciente, desde a prevenção até a reabilitação, em todos os níveis de complexidade, é a:',
    '[
      {"id": "A", "text": "Universalidade."},
      {"id": "B", "text": "Integralidade."},
      {"id": "C", "text": "Equidade."},
      {"id": "D", "text": "Descentralização."}
    ]'::jsonb,
    'B',
    'Integralidade é ver o indivíduo como um todo e garantir a oferta completa de serviços necessários para sua saúde.',
    'CESPE'
  ),
  (
    'Saúde Coletiva e SUS',
    'A visita domiciliar é uma ferramenta central da Estratégia Saúde da Família. Seu principal objetivo é:',
    '[
      {"id": "A", "text": "Fiscalizar a higiene da casa do paciente."},
      {"id": "B", "text": "Levar medicamentos que o paciente esqueceu de pegar."},
      {"id": "C", "text": "Conhecer o contexto de vida, identificar riscos e estabelecer vínculo com a família."},
      {"id": "D", "text": "Apenas realizar curativos em acamados."}
    ]'::jsonb,
    'C',
    'A visita permite entender os determinantes sociais de saúde in loco e planejar o cuidado de forma contextualizada.',
    'MS'
  ),
  (
    'Saúde Coletiva e SUS',
    'Sobre a Política Nacional de Humanização (HumanizaSUS), o conceito de "Acolhimento" refere-se a:',
    '[
      {"id": "A", "text": "Uma triagem administrativa na recepção."},
      {"id": "B", "text": "Uma postura ética de escuta qualificada e responsabilização pela demanda do usuário."},
      {"id": "C", "text": "Oferecer café e água aos pacientes."},
      {"id": "D", "text": "Atender apenas quem tem hora marcada."}
    ]'::jsonb,
    'B',
    'Acolhimento não é um espaço físico, é uma postura de escuta e compromisso em dar resposta às necessidades de quem procura o serviço.',
    'MS'
  );