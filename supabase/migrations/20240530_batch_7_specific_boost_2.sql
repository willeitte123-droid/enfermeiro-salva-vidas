-- PACOTE DE REFORÇO 7: PREENCHIMENTO DE LACUNAS
-- Foco: Biossegurança, Administração, Saúde Mental, CME e Ética
-- Proteção: ON CONFLICT DO NOTHING

INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES

  -- 1. BIOSSEGURANÇA E CONTROLE DE INFECÇÃO
  (
    'Biossegurança e Controle de Infecção',
    'Para um paciente diagnosticado com Meningite Meningocócica, além das precauções padrão, a equipe de enfermagem deve instituir precauções para:',
    '[
      {"id": "A", "text": "Aerossóis."},
      {"id": "B", "text": "Contato."},
      {"id": "C", "text": "Gotículas."},
      {"id": "D", "text": "Reversa (Protetora)."}
    ]'::jsonb,
    'C',
    'A Neisseria meningitidis é transmitida por gotículas (> 5 micra) que atingem até 1 metro. Exige máscara cirúrgica para o profissional e quarto privativo.',
    'ANVISA'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'Segundo a RDC 222/2018, os resíduos químicos (ex: reveladores de RX, produtos hormonais, quimioterápicos) pertencem ao Grupo:',
    '[
      {"id": "A", "text": "Grupo A."},
      {"id": "B", "text": "Grupo B."},
      {"id": "C", "text": "Grupo C."},
      {"id": "D", "text": "Grupo E."}
    ]'::jsonb,
    'B',
    'Grupo A = Infectante; Grupo B = Químico; Grupo C = Radioativo; Grupo D = Comum; Grupo E = Perfurocortante.',
    'ANVISA'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'A higienização das mãos é a medida mais importante para o controle de infecções. Dos "5 Momentos" preconizados pela OMS, qual ocorre APÓS o risco de exposição a fluidos corporais?',
    '[
      {"id": "A", "text": "Momento 1."},
      {"id": "B", "text": "Momento 2."},
      {"id": "C", "text": "Momento 3."},
      {"id": "D", "text": "Momento 5."}
    ]'::jsonb,
    'C',
    'Os 5 momentos são: 1. Antes de tocar o paciente; 2. Antes de procedimento limpo/asséptico; 3. Após risco de exposição a fluidos; 4. Após tocar o paciente; 5. Após tocar superfícies próximas.',
    'OMS'
  ),

  -- 2. ADMINISTRAÇÃO EM ENFERMAGEM
  (
    'Administração em Enfermagem',
    'No dimensionamento de pessoal de enfermagem (Res. COFEN 543/2017), um paciente classificado como de "Alta Dependência" requer quantas horas de enfermagem nas 24 horas?',
    '[
      {"id": "A", "text": "4 horas."},
      {"id": "B", "text": "6 horas."},
      {"id": "C", "text": "10 horas."},
      {"id": "D", "text": "18 horas."}
    ]'::jsonb,
    'C',
    'Mínimo (4h), Intermediário (6h), Alta Dependência (10h), Semi-intensivo (10h), Intensivo (18h).',
    'COFEN'
  ),
  (
    'Administração em Enfermagem',
    'Qual teoria administrativa tem como foco principal a estrutura organizacional, a hierarquia e os princípios gerais de administração (prever, organizar, comandar, coordenar e controlar)?',
    '[
      {"id": "A", "text": "Teoria Científica (Taylor)."},
      {"id": "B", "text": "Teoria Clássica (Fayol)."},
      {"id": "C", "text": "Teoria das Relações Humanas (Mayo)."},
      {"id": "D", "text": "Teoria Burocrática (Weber)."}
    ]'::jsonb,
    'B',
    'Fayol focou na estrutura e nas funções do administrador (o "chefe"). Taylor focou nas tarefas e no chão de fábrica (o operário).',
    'Administração'
  ),
  (
    'Administração em Enfermagem',
    'O estilo de liderança em que o enfermeiro toma todas as decisões, centraliza o poder e não permite a participação da equipe é denominado:',
    '[
      {"id": "A", "text": "Liderança Democrática."},
      {"id": "B", "text": "Liderança Laissez-faire."},
      {"id": "C", "text": "Liderança Autocrática."},
      {"id": "D", "text": "Liderança Situacional."}
    ]'::jsonb,
    'C',
    'A liderança autocrática é focada no líder e na tarefa, com comunicação descendente e pouca abertura para a equipe.',
    'Administração'
  ),

  -- 3. SAÚDE MENTAL
  (
    'Saúde Mental',
    'A Lei nº 10.216/2001, marco da Reforma Psiquiátrica brasileira, estabelece que a internação involuntária (sem consentimento do usuário e a pedido de terceiro) deve ser comunicada ao Ministério Público no prazo de:',
    '[
      {"id": "A", "text": "24 horas."},
      {"id": "B", "text": "48 horas."},
      {"id": "C", "text": "72 horas."},
      {"id": "D", "text": "7 dias."}
    ]'::jsonb,
    'C',
    'O prazo de 72 horas é para garantir a fiscalização e evitar internações arbitrárias ou cárcere privado.',
    'Lei 10.216'
  ),
  (
    'Saúde Mental',
    'Os sintomas extrapiramidais, como distonia aguda, acatisia e parkinsonismo, são efeitos adversos comuns de qual classe de medicamentos?',
    '[
      {"id": "A", "text": "Benzodiazepínicos (ex: Diazepam)."},
      {"id": "B", "text": "Antidepressivos Tricíclicos (ex: Amitriptilina)."},
      {"id": "C", "text": "Antipsicóticos Típicos (ex: Haloperidol)."},
      {"id": "D", "text": "Estabilizadores de Humor (ex: Lítio)."}
    ]'::jsonb,
    'C',
    'Os antipsicóticos de primeira geração (típicos) bloqueiam receptores de dopamina na via nigroestriatal, causando efeitos motores (impregnação).',
    'Farmacologia'
  ),
  (
    'Saúde Mental',
    'O Centro de Atenção Psicossocial (CAPS) destinado especificamente ao atendimento de pessoas com transtornos decorrentes do uso de crack, álcool e outras drogas é o:',
    '[
      {"id": "A", "text": "CAPS I."},
      {"id": "B", "text": "CAPS i."},
      {"id": "C", "text": "CAPS AD."},
      {"id": "D", "text": "CAPS III."}
    ]'::jsonb,
    'C',
    'CAPS AD (Álcool e Drogas). O CAPS i é para infância e adolescência.',
    'Ministério da Saúde'
  ),

  -- 4. CENTRO CIRÚRGICO E CME
  (
    'Centro Cirúrgico e CME',
    'Segundo a Classificação de Spaulding, os artigos que entram em contato com pele não íntegra ou mucosas íntegras (ex: endoscópios, lâminas de laringoscópio) são classificados como:',
    '[
      {"id": "A", "text": "Críticos."},
      {"id": "B", "text": "Semicríticos."},
      {"id": "C", "text": "Não Críticos."},
      {"id": "D", "text": "Contaminados."}
    ]'::jsonb,
    'B',
    'Semicríticos exigem, no mínimo, Desinfecção de Alto Nível. Críticos (penetram tecidos estéreis) exigem Esterilização. Não críticos (pele íntegra) exigem Limpeza.',
    'RDC 15'
  ),
  (
    'Centro Cirúrgico e CME',
    'Na Sistematização da Assistência de Enfermagem Perioperatória (SAEP), a etapa que ocorre desde a admissão do paciente no centro cirúrgico até a sua transferência para a sala de recuperação é o período:',
    '[
      {"id": "A", "text": "Pré-operatório imediato."},
      {"id": "B", "text": "Intraoperatório (ou Transoperatório)."},
      {"id": "C", "text": "Pós-operatório imediato."},
      {"id": "D", "text": "Pós-operatório mediato."}
    ]'::jsonb,
    'B',
    'O intraoperatório compreende todo o tempo em que o paciente está na sala de cirurgia e sob cuidados da equipe cirúrgica/anestésica.',
    'SOBECC'
  ),
  (
    'Centro Cirúrgico e CME',
    'Qual é a principal complicação associada à hipotermia não intencional no intraoperatório?',
    '[
      {"id": "A", "text": "Aumento da cicatrização."},
      {"id": "B", "text": "Alteração da coagulação (aumento do sangramento) e infecção de sítio cirúrgico."},
      {"id": "C", "text": "Hipertensão arterial severa."},
      {"id": "D", "text": "Redução do tempo de recuperação anestésica."}
    ]'::jsonb,
    'B',
    'A hipotermia prejudica a função plaquetária e a cascata de coagulação, além de causar vasoconstrição que diminui a oxigenação tecidual, favorecendo infecções.',
    'SOBECC'
  ),

  -- 5. ÉTICA E LEGISLAÇÃO
  (
    'Ética e Legislação',
    'Segundo o Código de Ética dos Profissionais de Enfermagem, é DEVER do profissional:',
    '[
      {"id": "A", "text": "Executar atividades que não sejam de sua competência técnica."},
      {"id": "B", "text": "Negar assistência de enfermagem em caso de urgência e emergência."},
      {"id": "C", "text": "Registrar no prontuário as informações inerentes ao processo de cuidar de forma clara, objetiva e completa."},
      {"id": "D", "text": "Administrar medicamentos sem conhecer a ação da droga."}
    ]'::jsonb,
    'C',
    'O registro (anotação) é um dever fundamental para garantir a continuidade da assistência e a segurança legal do profissional.',
    'Res. COFEN 564/2017'
  ),
  (
    'Ética e Legislação',
    'A ocorrência de um evento adverso onde o dano ao paciente foi causado por falta de conhecimento técnico do profissional (ex: não saber realizar o cálculo de medicação) caracteriza:',
    '[
      {"id": "A", "text": "Negligência."},
      {"id": "B", "text": "Imprudência."},
      {"id": "C", "text": "Imperícia."},
      {"id": "D", "text": "Dolo."}
    ]'::jsonb,
    'C',
    'Imperícia é a falta de habilidade ou conhecimento técnico para realizar a função. Imprudência é ação precipitada. Negligência é omissão/desleixo.',
    'Bioética'
  ),

  -- 6. FARMACOLOGIA (Reforço)
  (
    'Farmacologia',
    'A região ventroglútea (Músculo de Hochstetter) é considerada a mais segura para injeções intramusculares em adultos e crianças maiores porque:',
    '[
      {"id": "A", "text": "É livre de grandes vasos e nervos importantes."},
      {"id": "B", "text": "Possui a menor espessura muscular."},
      {"id": "C", "text": "É a região mais dolorosa."},
      {"id": "D", "text": "Permite volumes de até 10ml."}
    ]'::jsonb,
    'A',
    'Localizada no quadril, a região ventroglútea tem grande massa muscular e está distante do nervo ciático e da artéria glútea superior.',
    'Fundamentos'
  ),
  (
    'Farmacologia',
    'O sulfato de atropina é um medicamento anticolinérgico frequentemente utilizado em emergências para tratar:',
    '[
      {"id": "A", "text": "Taquicardia Ventricular."},
      {"id": "B", "text": "Hipertensão Arterial."},
      {"id": "C", "text": "Bradicardia Sinusal Sintomática."},
      {"id": "D", "text": "Edema Agudo de Pulmão."}
    ]'::jsonb,
    'C',
    'A atropina bloqueia o nervo vago (parassimpático), aumentando a frequência cardíaca.',
    'ACLS'
  ),

  -- 7. SAÚDE DA MULHER (Obstetrícia)
  (
    'Saúde da Mulher e da Criança',
    'A Manobra de Leopold é realizada durante o exame físico da gestante para:',
    '[
      {"id": "A", "text": "Avaliar a dilatação do colo uterino."},
      {"id": "B", "text": "Determinar a estática fetal (situação, posição, apresentação e insinuação)."},
      {"id": "C", "text": "Medir a altura uterina."},
      {"id": "D", "text": "Auscultar os batimentos cardiofetais."}
    ]'::jsonb,
    'B',
    'São 4 tempos de palpação abdominal que permitem identificar como o bebê está posicionado no útero.',
    'Obstetrícia'
  ),
  (
    'Saúde da Mulher e da Criança',
    'Na medida da Altura Uterina (AU), a técnica correta envolve posicionar a fita métrica:',
    '[
      {"id": "A", "text": "Da cicatriz umbilical até o fundo do útero."},
      {"id": "B", "text": "Da sínfise púbica (borda superior) até o fundo do útero."},
      {"id": "C", "text": "Do apêndice xifoide até a sínfise púbica."},
      {"id": "D", "text": "Da crista ilíaca até o fundo do útero."}
    ]'::jsonb,
    'B',
    'A borda superior da sínfise púbica é o ponto de referência fixo inferior. O fundo uterino é o ponto variável superior.',
    'Ministério da Saúde'
  ),

  -- 8. URGÊNCIA E EMERGÊNCIA
  (
    'Urgência e Emergência',
    'O sinal de Battle (equimose na região retroauricular/mastoide) e o sinal do Guaxinim (equimose periorbital bilateral) são indicativos de:',
    '[
      {"id": "A", "text": "Fratura de mandíbula."},
      {"id": "B", "text": "Trauma ocular direto."},
      {"id": "C", "text": "Fratura de base de crânio."},
      {"id": "D", "text": "Hemorragia subaracnoidea."}
    ]'::jsonb,
    'C',
    'Esses sinais tardios indicam fratura da base do crânio. Contraindicam a passagem de sonda nasogástrica (risco de invasão intracraniana).',
    'PHTLS'
  ),
  (
    'Urgência e Emergência',
    'Na avaliação da extensão de queimaduras em um adulto, utilizando a Regra dos Nove, um paciente que queimou todo o membro superior direito (frente e verso) tem uma área queimada de:',
    '[
      {"id": "A", "text": "4,5%."},
      {"id": "B", "text": "9%."},
      {"id": "C", "text": "18%."},
      {"id": "D", "text": "1%."}
    ]'::jsonb,
    'B',
    'Cada membro superior completo (braço + antebraço + mão) corresponde a 9% da superfície corporal total (4,5% frente + 4,5% verso).',
    'Queimaduras'
  ),

  -- 9. CLÍNICA MÉDICA (Sinais Vitais)
  (
    'Fundamentos de Enfermagem',
    'A Pressão de Pulso (ou Pressão Diferencial) é calculada pela:',
    '[
      {"id": "A", "text": "Soma da sistólica com a diastólica."},
      {"id": "B", "text": "Diferença entre a pressão sistólica e a diastólica."},
      {"id": "C", "text": "Média das pressões aferidas em 24h."},
      {"id": "D", "text": "Pressão diastólica mais um terço da sistólica."}
    ]'::jsonb,
    'B',
    'Ex: Se PA é 120/80, a pressão de pulso é 40 (120 - 80). Se estiver muito baixa (pinçada), pode indicar baixo débito cardíaco ou tamponamento.',
    'Fisiologia'
  ),
  (
    'Fundamentos de Enfermagem',
    'A respiração de Cheyne-Stokes é caracterizada por:',
    '[
      {"id": "A", "text": "Inspiração profunda seguida de pausa (apneia) e expiração rápida."},
      {"id": "B", "text": "Movimentos respiratórios rápidos e profundos, sem pausas (Kussmaul)."},
      {"id": "C", "text": "Ciclos de respiração que aumentam e diminuem de profundidade, alternados com períodos de apneia."},
      {"id": "D", "text": "Respiração totalmente irregular em ritmo e profundidade (Biot)."}
    ]'::jsonb,
    'C',
    'Comum em insuficiência cardíaca grave e lesões neurológicas supratentoriais. Kussmaul é típica da cetoacidose.',
    'Semiologia'
  ),

  -- 10. SAÚDE PÚBLICA (Reforço)
  (
    'Saúde Pública',
    'A estratégia DOTS (Directly Observed Treatment, Short-course) é preconizada pela OMS para o controle de qual doença?',
    '[
      {"id": "A", "text": "Hanseníase."},
      {"id": "B", "text": "HIV/AIDS."},
      {"id": "C", "text": "Tuberculose."},
      {"id": "D", "text": "Malária."}
    ]'::jsonb,
    'C',
    'O Tratamento Diretamente Observado (TDO) visa garantir a adesão do paciente à medicação antituberculose, reduzindo a resistência e a transmissão.',
    'Ministério da Saúde'
  ),
  (
    'Saúde Pública',
    'A lavagem das mãos cirúrgica (ou preparo pré-operatório das mãos) deve ser realizada com duração mínima de:',
    '[
      {"id": "A", "text": "30 segundos a 1 minuto."},
      {"id": "B", "text": "3 a 5 minutos."},
      {"id": "C", "text": "10 minutos."},
      {"id": "D", "text": "15 minutos."}
    ]'::jsonb,
    'B',
    'A escovação excessiva (>5 min) lesa a pele e libera bactérias profundas. O tempo ideal para a primeira lavagem do dia é de 3 a 5 minutos.',
    'ANVISA'
  ),

  -- 11. MATERNO-INFANTIL (Aleitamento)
  (
    'Saúde da Mulher e da Criança',
    'O colostro, leite produzido nos primeiros dias pós-parto, caracteriza-se nutricionalmente por ter, em comparação ao leite maduro:',
    '[
      {"id": "A", "text": "Maior teor de gordura e lactose."},
      {"id": "B", "text": "Menor teor de proteínas e imunoglobulinas."},
      {"id": "C", "text": "Maior teor de proteínas e imunoglobulinas (IgA)."},
      {"id": "D", "text": "Mesma composição, mudando apenas a cor."}
    ]'::jsonb,
    'C',
    'O colostro é a "primeira vacina", rico em fatores de defesa e proteínas, porém com menos gordura e açúcar (lactose) que o leite maduro.',
    'Ministério da Saúde'
  ),
  (
    'Saúde da Mulher e da Criança',
    'Em um recém-nascido, a presença de Cefalo-hematoma diferencia-se da Bossa Serossanguínea (Caput Succedaneum) pois o Cefalo-hematoma:',
    '[
      {"id": "A", "text": "Ultrapassa as linhas de sutura craniana."},
      {"id": "B", "text": "É um edema mole e depressível."},
      {"id": "C", "text": "Não ultrapassa as linhas de sutura óssea."},
      {"id": "D", "text": "Desaparece nas primeiras 24 horas."}
    ]'::jsonb,
    'C',
    'O Cefalo-hematoma é uma hemorragia subperiosteal, limitada ao osso específico (não cruza suturas). A Bossa é edema subcutâneo e cruza suturas.',
    'Neonatologia'
  ),

  -- 12. DIVERSOS
  (
    'Fundamentos de Enfermagem',
    'O termo "Pirexia" é sinônimo de:',
    '[
      {"id": "A", "text": "Dor intensa."},
      {"id": "B", "text": "Febre."},
      {"id": "C", "text": "Azia."},
      {"id": "D", "text": "Coceira."}
    ]'::jsonb,
    'B',
    'Pirexia refere-se à elevação da temperatura corporal. Antipiréticos são medicamentos para baixar a febre.',
    'Terminologia'
  ),
  (
    'Fundamentos de Enfermagem',
    'Ao realizar uma sondagem nasogástrica, a posição ideal do paciente para facilitar a passagem da sonda e prevenir broncoaspiração é:',
    '[
      {"id": "A", "text": "Decúbito dorsal horizontal (Zero)."},
      {"id": "B", "text": "Posição de Fowler (High Fowler)."},
      {"id": "C", "text": "Decúbito lateral esquerdo."},
      {"id": "D", "text": "Trendelenburg."}
    ]'::jsonb,
    'B',
    'A posição sentada (Fowler alto) com a cabeça levemente fletida protege a via aérea e facilita a deglutição da sonda.',
    'Fundamentos'
  ),
  (
    'Fundamentos de Enfermagem',
    'A eliminação de sangue vivo pelo ânus, geralmente associada a sangramento do trato gastrointestinal baixo ou hemorroidas, é denominada:',
    '[
      {"id": "A", "text": "Melena."},
      {"id": "B", "text": "Hemoptise."},
      {"id": "C", "text": "Enterorragia (ou Hematoquezia)."},
      {"id": "D", "text": "Hematêmese."}
    ]'::jsonb,
    'C',
    'Melena é sangue digerido (preto/piche). Hemoptise é tosse com sangue. Hematêmese é vômito com sangue. Enterorragia é sangue vivo nas fezes.',
    'Terminologia'
  )

ON CONFLICT (question) DO NOTHING;