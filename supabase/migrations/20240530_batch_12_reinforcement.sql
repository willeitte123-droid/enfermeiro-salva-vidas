INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation)
VALUES

-- 1. SAÚDE DA CRIANÇA (6 Questões)
('Saúde da Criança', 'Vunesp', 'Na avaliação dos reflexos primitivos do recém-nascido, aquele que é desencadeado por um estímulo sonoro ou perda súbita de equilíbrio, caracterizado pela extensão e abdução dos braços seguida de flexão e adução (abraço), é o reflexo de:',
'[{"id": "A", "text": "Sucção"}, {"id": "B", "text": "Moro"}, {"id": "C", "text": "Babinski"}, {"id": "D", "text": "Preensão Palmar"}]',
'B', 'Estilo Vunesp (Semiologia): O Reflexo de Moro é o reflexo do "susto" ou "abraço". Deve desaparecer por volta do 4º ao 6º mês.'),

('Saúde da Criança', 'FGV', 'Lactente de 6 meses é trazido à consulta de puericultura. A mãe refere que a criança iniciou a alimentação complementar, mas recusa a oferta. Ao exame, a criança senta com apoio e rola. O marco do desenvolvimento esperado para essa idade que AINDA NÃO FOI ATINGIDO plenamente, segundo o Ministério da Saúde, é:',
'[{"id": "A", "text": "Sustentar a cabeça"}, {"id": "B", "text": "Sentar sem apoio"}, {"id": "C", "text": "Fixar o olhar"}, {"id": "D", "text": "Sorriso social"}]',
'B', 'Estilo FGV (Desenvolvimento): Aos 6 meses, espera-se que a criança comece a sentar sem apoio, mas é comum que ainda precise de leve suporte. O marco de "sentar sem apoio" consolida-se entre 6 e 7 meses.'),

('Saúde da Criança', 'IBFC', 'Conforme o Calendário Nacional de Vacinação, a vacina Pentavalente (DTP+Hib+HepB) deve ser administrada nas seguintes idades:',
'[{"id": "A", "text": "Ao nascer, 2 e 4 meses"}, {"id": "B", "text": "2, 4 e 6 meses"}, {"id": "C", "text": "3 e 5 meses"}, {"id": "D", "text": "12 e 15 meses"}]',
'B', 'Estilo IBFC (Calendário): O esquema básico da Penta é aos 2, 4 e 6 meses. Os reforços são feitos com DTP.'),

('Saúde da Criança', 'AOCP', 'Um recém-nascido a termo, com peso de 3.500g, apresenta icterícia visível apenas na face e pescoço com 24 horas de vida. Segundo as Zonas de Kramer, essa icterícia corresponde à Zona:',
'[{"id": "A", "text": "Zona I"}, {"id": "B", "text": "Zona II"}, {"id": "C", "text": "Zona III"}, {"id": "D", "text": "Zona IV"}]',
'A', 'Estilo AOCP (Escalas): Zona I (Cabeça e pescoço); Zona II (Tronco até umbigo); Zona III (Hipogástrio e coxas); Zona IV (Braços e pernas); Zona V (Mãos e pés).'),

('Saúde da Criança', 'Cebraspe', 'A respeito do aleitamento materno, julgue o item: O colostro, leite produzido nos primeiros dias pós-parto, possui menor teor de gordura e lactose e maior teor de proteínas e imunoglobulinas em comparação ao leite maduro.',
'[{"id": "A", "text": "Certo"}, {"id": "B", "text": "Errado"}]',
'A', 'Estilo Cebraspe (Fisiologia): Correto. O colostro é a "primeira vacina", rico em defesa (IgA) e proteínas, mas menos calórico que o leite posterior (rico em gordura).'),

('Saúde da Criança', 'FCC', 'A manobra de Barlow, realizada no exame físico do recém-nascido, tem como objetivo diagnosticar:',
'[{"id": "A", "text": "Displasia do Desenvolvimento do Quadril (Luxação)"}, {"id": "B", "text": "Pé torto congênito"}, {"id": "C", "text": "Fratura de clavícula"}, {"id": "D", "text": "Paralisia braquial obstétrica"}]',
'A', 'Estilo FCC (Exame Físico): Barlow (tenta luxar o quadril instável) e Ortolani (tenta reduzir o quadril luxado) são testes para DDQ.'),


-- 2. SAÚDE DO IDOSO (6 Questões)
('Saúde do Idoso', 'Vunesp', 'A vacina contra Influenza (Gripe) é disponibilizada anualmente para os idosos. O objetivo principal desta estratégia de saúde pública nessa população é:',
'[{"id": "A", "text": "Erradicar o vírus Influenza"}, {"id": "B", "text": "Impedir que o idoso contraia a gripe leve"}, {"id": "C", "text": "Reduzir as complicações (pneumonia) e a mortalidade"}, {"id": "D", "text": "Substituir a vacinação pneumocócica"}]',
'C', 'Estilo Vunesp (Objetivo da Política): A vacina não impede 100% a infecção, mas reduz drasticamente a gravidade, hospitalizações e óbitos por complicações.'),

('Saúde do Idoso', 'FGV', 'Dona J., 78 anos, apresenta incontinência urinária, instabilidade postural e declínio cognitivo leve. Esses sinais fazem parte das grandes síndromes geriátricas, conhecidas como:',
'[{"id": "A", "text": "Os 5 S"}, {"id": "B", "text": "Os Gigantes da Geriatria (Os Is)"}, {"id": "C", "text": "Síndrome da Fragilidade"}, {"id": "D", "text": "Tríade de Whipple"}]',
'B', 'Estilo FGV (Conceito): Os "Is" da Geriatria: Imobilidade, Instabilidade, Incontinência, Incapacidade Cognitiva e Iatrogenia.'),

('Saúde do Idoso', 'IBFC', 'De acordo com o Estatuto do Idoso (Lei 10.741/2003), é assegurada a atenção integral à saúde do idoso. Em casos de internação ou observação, é assegurado ao idoso o direito a:',
'[{"id": "A", "text": "Acompanhante em tempo integral, a critério médico"}, {"id": "B", "text": "Acompanhante apenas durante o dia"}, {"id": "C", "text": "Acompanhante em tempo integral, salvo determinação médica justificada em contrário"}, {"id": "D", "text": "Visitas livres, sem restrição de horário"}]',
'C', 'Estilo IBFC (Legislação): O direito é garantido, podendo ser vetado pelo médico apenas se houver risco à saúde do idoso ou do acompanhante, devidamente justificado.'),

('Saúde do Idoso', 'Cebraspe', 'Julgue: A capacidade funcional, ou seja, a habilidade de manter-se independente e autônomo, é considerada o principal indicador de saúde da população idosa, mais importante que a simples presença ou ausência de doenças.',
'[{"id": "A", "text": "Certo"}, {"id": "B", "text": "Errado"}]',
'A', 'Estilo Cebraspe (Paradigma): Correto. Um idoso pode ter diabetes e hipertensão (doenças) e ser saudável se for ativo e independente. A perda da função define a fragilidade.'),

('Saúde do Idoso', 'AOCP', 'A escala utilizada para avaliar a independência do idoso nas Atividades BÁSICAS de Vida Diária (ABVD), como banho, vestir-se e alimentar-se, é a:',
'[{"id": "A", "text": "Escala de Lawton"}, {"id": "B", "text": "Escala de Katz"}, {"id": "C", "text": "Mini Exame do Estado Mental (MEEM)"}, {"id": "D", "text": "Escala de Braden"}]',
'B', 'Estilo AOCP (Escalas): Katz = Básicas (biológicas). Lawton = Instrumentais (sociais/complexas).'),

('Saúde do Idoso', 'FCC', 'A polifarmácia no idoso aumenta o risco de iatrogenia. Um efeito adverso comum dos benzodiazepínicos (ex: Diazepam) nessa população, que frequentemente leva a internações, é:',
'[{"id": "A", "text": "Hipertensão arterial"}, {"id": "B", "text": "Risco de quedas e fraturas"}, {"id": "C", "text": "Diarreia crônica"}, {"id": "D", "text": "Taquicardia"}]',
'B', 'Estilo FCC (Segurança): Sedativos causam sonolência e relaxamento muscular, aumentando drasticamente o risco de quedas em idosos.'),


-- 3. SAÚDE DA MULHER (6 Questões)
('Saúde da Mulher', 'Vunesp', 'Durante o exame físico das mamas, a inspeção estática deve ser realizada com a paciente:',
'[{"id": "A", "text": "Deitada, com as mãos sob a cabeça"}, {"id": "B", "text": "Sentada, com os braços relaxados ao longo do corpo"}, {"id": "C", "text": "Em pé, inclinada para frente"}, {"id": "D", "text": "Sentada, com as mãos na cintura fazendo pressão"}]',
'B', 'Estilo Vunesp (Semiologia): Inspeção estática = braços relaxados. Inspeção dinâmica = elevar braços/mãos na cintura.'),

('Saúde da Mulher', 'FGV', 'Gestante de 32 semanas chega à emergência com PA 160/110 mmHg, cefaleia, escotomas visuais e dor epigástrica. O diagnóstico provável e a conduta imediata para prevenção de convulsões são:',
'[{"id": "A", "text": "Eclâmpsia; Hidralazina"}, {"id": "B", "text": "Pré-eclâmpsia grave (iminência de eclâmpsia); Sulfato de Magnésio"}, {"id": "C", "text": "Hipertensão Crônica; Metildopa"}, {"id": "D", "text": "Síndrome HELLP; Transfusão de plaquetas"}]',
'B', 'Estilo FGV (Caso Clínico): Sinais de iminência (sintomas neurológicos/gástricos) exigem "magnesiação" para evitar a convulsão (eclâmpsia).'),

('Saúde da Mulher', 'IBFC', 'A manobra de Leopold utilizada para determinar a apresentação fetal (cefálica, pélvica ou córmica) é a:',
'[{"id": "A", "text": "Primeira manobra (Fundo uterino)"}, {"id": "B", "text": "Segunda manobra (Dorso fetal)"}, {"id": "C", "text": "Terceira manobra (Mobilidade do polo inferior)"}, {"id": "D", "text": "Quarta manobra (Grau de penetração)"}]',
'C', 'Estilo IBFC (Técnica): A 3ª manobra palpa o polo inferior (acima da sínfise púbica) para ver o que se apresenta e se está móvel.'),

('Saúde da Mulher', 'AOCP', 'O exame citopatológico do colo do útero (Papanicolau) deve ser rastreado, segundo o Ministério da Saúde, em mulheres que já iniciaram a vida sexual, na faixa etária de:',
'[{"id": "A", "text": "18 a 60 anos"}, {"id": "B", "text": "25 a 64 anos"}, {"id": "C", "text": "20 a 59 anos"}, {"id": "D", "text": "Início da vida sexual sem limite de idade"}]',
'B', 'Estilo AOCP (Diretrizes): A faixa prioritária é 25-64 anos. Antes dos 25, a prevalência de HPV é alta mas as lesões costumam regredir, evitando-se o sobretratamento.'),

('Saúde da Mulher', 'Cebraspe', 'Julgue: A vacina dTpa (Tríplice Bacteriana Acelular) deve ser administrada a toda gestante a partir da 20ª semana de gestação, a cada gestação, independentemente do estado vacinal prévio.',
'[{"id": "A", "text": "Certo"}, {"id": "B", "text": "Errado"}]',
'A', 'Estilo Cebraspe (Imunização): Correto. O objetivo é passar anticorpos contra a Coqueluche para o feto via transplacentária.'),

('Saúde da Mulher', 'FCC', 'O período do parto caracterizado pela saída da placenta e das membranas ovulares é denominado:',
'[{"id": "A", "text": "Dilatação"}, {"id": "B", "text": "Expulsivo"}, {"id": "C", "text": "Dequitação (ou Secundamento)"}, {"id": "D", "text": "Puerpério Imediato"}]',
'C', 'Estilo FCC (Fases do Parto): 1º Dilatação, 2º Expulsivo (feto), 3º Dequitação (placenta), 4º Greenberg (1ª hora pós).'),


-- 4. FUNDAMENTOS DE ENFERMAGEM (6 Questões)
('Fundamentos de Enfermagem', 'Vunesp', 'Ao realizar o exame físico abdominal, a sequência correta das etapas propedêuticas, para não alterar os ruídos hidroaéreos, é:',
'[{"id": "A", "text": "Inspeção, Palpação, Percussão, Ausculta"}, {"id": "B", "text": "Inspeção, Ausculta, Percussão, Palpação"}, {"id": "C", "text": "Ausculta, Inspeção, Palpação, Percussão"}, {"id": "D", "text": "Inspeção, Percussão, Palpação, Ausculta"}]',
'B', 'Estilo Vunesp (Semiotécnica): No abdome, a ausculta vem logo após a inspeção. Palpar/percutir antes pode estimular o peristaltismo e falsear a ausculta.'),

('Fundamentos de Enfermagem', 'FGV', 'Paciente com Sonda Nasoenteral (SNE) para dieta. Antes de instalar a dieta, o enfermeiro deve confirmar o posicionamento da sonda. O método padrão-ouro (mais seguro) para esta confirmação é:',
'[{"id": "A", "text": "Ausculta de ruídos na região epigástrica após injeção de ar"}, {"id": "B", "text": "Teste do pH do aspirado gástrico"}, {"id": "C", "text": "Exame radiológico (Raio-X)"}, {"id": "D", "text": "Mergulhar a ponta da sonda em copo com água (teste do borbulhamento)"}]',
'C', 'Estilo FGV (Segurança): A ausculta não é 100% confiável. Para iniciar dieta, o Raio-X é mandatório para garantir que a sonda não está no pulmão.'),

('Fundamentos de Enfermagem', 'IBFC', 'A posição em que o paciente permanece deitado de costas, com a cabeceira da cama elevada entre 45° e 60°, utilizada para alimentação, conforto respiratório e após cirurgias abdominais, é chamada de:',
'[{"id": "A", "text": "Trendelenburg"}, {"id": "B", "text": "Sims"}, {"id": "C", "text": "Fowler"}, {"id": "D", "text": "Ginecológica"}]',
'C', 'Estilo IBFC (Posicionamento): Fowler é a posição sentada/semi-sentada padrão.'),

('Fundamentos de Enfermagem', 'AOCP', 'O pulso verificado no ápice do coração (5º espaço intercostal, linha hemiclavicular esquerda) com o uso de um estetoscópio é denominado:',
'[{"id": "A", "text": "Pulso Radial"}, {"id": "B", "text": "Pulso Apical"}, {"id": "C", "text": "Pulso Carotídeo"}, {"id": "D", "text": "Pulso Femoral"}]',
'B', 'Estilo AOCP (Sinais Vitais): O pulso apical é a ausculta direta do batimento cardíaco, o mais fidedigno em arritmias.'),

('Fundamentos de Enfermagem', 'Cebraspe', 'Julgue: A lavagem gástrica é um procedimento indicado rotineiramente para todos os casos de intoxicação exógena, independentemente do tempo decorrido da ingestão ou da substância envolvida.',
'[{"id": "A", "text": "Certo"}, {"id": "B", "text": "Errado"}]',
'B', 'Estilo Cebraspe (Procedimento): Errado. É indicada apenas se ingestão recente (< 1-2h) e contraindicada em corrosivos (soda/ácido) ou hidrocarbonetos (risco de nova lesão/aspiração).'),

('Fundamentos de Enfermagem', 'FCC', 'Para a realização de cateterismo vesical de demora em paciente do sexo feminino, a posição recomendada é:',
'[{"id": "A", "text": "Decúbito dorsal com pernas estendidas"}, {"id": "B", "text": "Posição de Sims (lateral esquerda)"}, {"id": "C", "text": "Ginecológica (Litotomia)"}, {"id": "D", "text": "Genupeitoral"}]',
'C', 'Estilo FCC (Técnica): A posição ginecológica permite a melhor visualização do meato uretral feminino.'),


-- 5. ÉTICA E LEGISLAÇÃO (6 Questões)
('Ética e Legislação', 'Vunesp', 'Segundo o Código de Ética dos Profissionais de Enfermagem, a penalidade de Cassação do direito ao exercício profissional é de competência exclusiva do:',
'[{"id": "A", "text": "Conselho Regional de Enfermagem (COREN)"}, {"id": "B", "text": "Conselho Federal de Enfermagem (COFEN)"}, {"id": "C", "text": "Sindicato dos Enfermeiros"}, {"id": "D", "text": "Ministério da Saúde"}]',
'B', 'Estilo Vunesp (Penalidades): O COREN aplica advertência, multa, censura e suspensão. A morte profissional (Cassação) só o COFEN pode decretar.'),

('Ética e Legislação', 'FGV', 'Um enfermeiro divulgou em suas redes sociais imagens de um paciente durante um procedimento no centro cirúrgico, sem autorização, onde o rosto do paciente era visível. Segundo o Código de Ética, isso configura infração por violar o dever de:',
'[{"id": "A", "text": "Sigilo Profissional e Direito à Imagem"}, {"id": "B", "text": "Beneficência"}, {"id": "C", "text": "Imperícia"}, {"id": "D", "text": "Assiduidade"}]',
'A', 'Estilo FGV (Caso Ético): Expor a figura do paciente é violação grave de privacidade e sigilo, passível de punição ética.'),

('Ética e Legislação', 'IBFC', 'A prescrição de medicamentos é uma atividade que pode ser realizada pelo Enfermeiro, desde que:',
'[{"id": "A", "text": "O médico autorize verbalmente"}, {"id": "B", "text": "O enfermeiro tenha pós-graduação em farmacologia"}, {"id": "C", "text": "Esteja estabelecida em programas de saúde pública e em rotina aprovada pela instituição"}, {"id": "D", "text": "Seja apenas de analgésicos simples"}]',
'C', 'Estilo IBFC (Lei do Exercício): A Lei 7.498/86 permite a prescrição pelo enfermeiro SOMENTE dentro de protocolos institucionais/saúde pública.'),

('Ética e Legislação', 'AOCP', 'O profissional de enfermagem que, por falta de conhecimento técnico, causa dano ao paciente (ex: não sabe diluir uma medicação e administra pura, causando flebite), cometeu:',
'[{"id": "A", "text": "Negligência"}, {"id": "B", "text": "Imprudência"}, {"id": "C", "text": "Imperícia"}, {"id": "D", "text": "Dolo"}]',
'C', 'Estilo AOCP (Conceitos): Imperícia = Falta de saber/técnica ("Não sabe fazer"). Negligência = Desleixo ("Sabe mas não fez/esqueceu"). Imprudência = Ação precipitada ("Fez sem cuidado").'),

('Ética e Legislação', 'Cebraspe', 'Julgue: O Técnico de Enfermagem pode assumir a chefia de uma Unidade Básica de Saúde, desde que tenha mais de 10 anos de experiência.',
'[{"id": "A", "text": "Certo"}, {"id": "B", "text": "Errado"}]',
'B', 'Estilo Cebraspe (Privativo): Errado. A direção e chefia de órgãos/serviços de enfermagem é atividade PRIVATIVA do Enfermeiro.'),

('Ética e Legislação', 'FCC', 'Quando um profissional de enfermagem se recusa a realizar um procedimento que não é de sua competência técnica ou legal (ex: intubar um paciente), ele está exercendo um:',
'[{"id": "A", "text": "Dever"}, {"id": "B", "text": "Direito"}, {"id": "C", "text": "Infração"}, {"id": "D", "text": "Desagravo"}]',
'B', 'Estilo FCC (Direitos): É um DIREITO recusar-se a executar atividades que não sejam de sua competência ou que não ofereçam segurança.')

ON CONFLICT (question) DO NOTHING;