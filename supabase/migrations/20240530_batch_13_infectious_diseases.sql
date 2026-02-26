INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES
(
  'Biossegurança e Controle de Infecção',
  'Qual das seguintes doenças exige Precaução por Aerossóis e quarto privativo com pressão negativa?',
  '[
    {"id": "A", "text": "Meningite Meningocócica."},
    {"id": "B", "text": "Tuberculose Pulmonar."},
    {"id": "C", "text": "Influenza (Gripe)."},
    {"id": "D", "text": "Hepatite B."}
  ]'::jsonb,
  'B',
  'A Tuberculose é transmitida por aerossóis (partículas < 5 micra que ficam suspensas no ar). Exige máscara N95/PFF2 para o profissional e quarto com pressão negativa.',
  'VUNESP'
),
(
  'Biossegurança e Controle de Infecção',
  'A Precaução de Contato é indicada para pacientes com infecção ou colonização por microrganismos multirresistentes (ex: KPC, MRSA). Quais são os EPIs obrigatórios para entrar no quarto desse paciente?',
  '[
    {"id": "A", "text": "Máscara Cirúrgica e Luvas."},
    {"id": "B", "text": "Avental (capote) e Luvas."},
    {"id": "C", "text": "Máscara N95 e Óculos."},
    {"id": "D", "text": "Apenas higienização das mãos."}
  ]'::jsonb,
  'B',
  'Na precaução de contato, o objetivo é evitar a transmissão por contato direto ou indireto (fômites). O uso de avental e luvas é mandatório ao entrar no quarto ou ter contato com o paciente/ambiente.',
  'IBFC'
),
(
  'Biossegurança e Controle de Infecção',
  'A Meningite Meningocócica é transmitida por gotículas. Qual a medida de precaução correta?',
  '[
    {"id": "A", "text": "Precaução por Aerossóis (Máscara N95)."},
    {"id": "B", "text": "Precaução de Contato (Avental e Luvas)."},
    {"id": "C", "text": "Precaução por Gotículas (Máscara Cirúrgica) até 24h de tratamento efetivo."},
    {"id": "D", "text": "Precaução Padrão apenas."}
  ]'::jsonb,
  'C',
  'A transmissão ocorre por gotículas (partículas > 5 micra) que atingem até 1 metro. A máscara cirúrgica é suficiente. O isolamento pode ser suspenso após 24h de antibioticoterapia.',
  'FCC'
),
(
  'Biossegurança e Controle de Infecção',
  'De acordo com a NR-32, sobre o descarte de materiais perfurocortantes, é CORRETO afirmar:',
  '[
    {"id": "A", "text": "O reencape de agulhas é permitido se feito com uma única mão."},
    {"id": "B", "text": "Devem ser descartados em sacos plásticos brancos identificados."},
    {"id": "C", "text": "O recipiente rígido deve ser preenchido até a borda para otimizar o espaço."},
    {"id": "D", "text": "É vedado o reencape e a desconexão manual de agulhas."}
  ]'::jsonb,
  'D',
  'A NR-32 proíbe terminantemente o reencape e a desconexão manual de agulhas. O descarte deve ser em recipiente rígido, preenchido apenas até o limite de segurança (2/3).',
  'CEBRASPE'
),
(
  'Biossegurança e Controle de Infecção',
  'O Sarampo e a Varicela são doenças altamente contagiosas. Qual o tipo de precaução indicado para ambas?',
  '[
    {"id": "A", "text": "Precaução Padrão."},
    {"id": "B", "text": "Precaução por Gotículas."},
    {"id": "C", "text": "Precaução por Aerossóis."},
    {"id": "D", "text": "Precaução Reversa."}
  ]'::jsonb,
  'C',
  'Ambas são transmitidas por aerossóis (núcleos de gotículas) e exigem máscara N95/PFF2. A Varicela exige também Precaução de Contato devido às lesões cutâneas.',
  'FGV'
),
(
  'Biossegurança e Controle de Infecção',
  'Qual é a ordem correta de paramentação (colocação dos EPIs) recomendada para minimizar o risco de contaminação?',
  '[
    {"id": "A", "text": "Luvas, Máscara, Óculos, Avental."},
    {"id": "B", "text": "Avental, Máscara, Óculos/Viseira, Luvas."},
    {"id": "C", "text": "Máscara, Óculos, Luvas, Avental."},
    {"id": "D", "text": "Avental, Luvas, Máscara, Óculos."}
  ]'::jsonb,
  'B',
  'A sequência recomendada é: 1. Avental; 2. Máscara; 3. Óculos/Viseira; 4. Luvas (cobrindo o punho do avental). A desparamentação segue ordem diferente para evitar autokcontaminação.',
  'AOCP'
),
(
  'Biossegurança e Controle de Infecção',
  'Em caso de acidente com material biológico (perfurocortante), qual a primeira conduta a ser tomada no local da exposição cutânea?',
  '[
    {"id": "A", "text": "Espremer a ferida para estimular o sangramento."},
    {"id": "B", "text": "Aplicar hipoclorito de sódio (água sanitária)."},
    {"id": "C", "text": "Lavar exaustivamente com água e sabão."},
    {"id": "D", "text": "Fazer torniquete proximal."}
  ]'::jsonb,
  'C',
  'A recomendação é lavagem exaustiva com água e sabão. Não se deve espremer (pode aumentar a área de trauma e absorção) nem usar irritantes como cloro ou torniquete.',
  'CONSULPLAN'
),
(
  'Biossegurança e Controle de Infecção',
  'A RDC 222/2018 classifica os resíduos de serviços de saúde. Os resíduos com presença de agentes biológicos que apresentam risco de infecção (ex: bolsa de sangue, cultura de laboratório) pertencem ao:',
  '[
    {"id": "A", "text": "Grupo A."},
    {"id": "B", "text": "Grupo B."},
    {"id": "C", "text": "Grupo D."},
    {"id": "D", "text": "Grupo E."}
  ]'::jsonb,
  'A',
  'Grupo A = Biológico/Infectante. Grupo B = Químico. Grupo C = Radioativo. Grupo D = Comum. Grupo E = Perfurocortante.',
  'IDECAN'
),
(
  'Biossegurança e Controle de Infecção',
  'A lavagem das mãos é a medida mais importante para prevenir infecções. Qual é o tempo mínimo recomendado para a fricção antisséptica das mãos com preparação alcoólica (álcool gel)?',
  '[
    {"id": "A", "text": "10 a 15 segundos."},
    {"id": "B", "text": "20 a 30 segundos."},
    {"id": "C", "text": "40 a 60 segundos."},
    {"id": "D", "text": "1 a 2 minutos."}
  ]'::jsonb,
  'B',
  'Para fricção com álcool, o tempo é 20-30s. Para lavagem com água e sabonete, o tempo é 40-60s.',
  'EBSERH'
),
(
  'Biossegurança e Controle de Infecção',
  'Para um paciente com Influenza (Gripe H1N1), além da Precaução Padrão, deve-se instituir:',
  '[
    {"id": "A", "text": "Precaução de Contato."},
    {"id": "B", "text": "Precaução por Aerossóis."},
    {"id": "C", "text": "Precaução por Gotículas."},
    {"id": "D", "text": "Isolamento Reverso."}
  ]'::jsonb,
  'C',
  'A Influenza é transmitida por gotículas. Profissionais devem usar máscara cirúrgica ao prestar assistência a menos de 1 metro.',
  'VUNESP'
),
(
  'Biossegurança e Controle de Infecção',
  'A NR-32 estabelece que os trabalhadores com feridas ou lesões nos membros superiores:',
  '[
    {"id": "A", "text": "Podem trabalhar normalmente se usarem luvas estéreis."},
    {"id": "B", "text": "Devem cobrir a lesão com curativo impermeável e trabalhar."},
    {"id": "C", "text": "Só podem iniciar suas atividades após avaliação médica com liberação para o trabalho."},
    {"id": "D", "text": "Devem ser demitidos por justa causa."}
  ]'::jsonb,
  'C',
  'A NR-32 é explícita: trabalhadores com lesões nos membros superiores só podem trabalhar após avaliação médica e emissão de laudo de liberação, devido ao risco de contaminação (via de entrada).',
  'CEBRASPE'
),
(
  'Biossegurança e Controle de Infecção',
  'O que são os "5 Momentos para Higiene das Mãos" definidos pela OMS?',
  '[
    {"id": "A", "text": "Ao chegar, antes do almoço, após o almoço, ao sair do banheiro, ao ir embora."},
    {"id": "B", "text": "Antes de tocar o paciente, antes de procedimento asséptico, após risco de exposição a fluidos, após tocar o paciente, após tocar superfícies próximas."},
    {"id": "C", "text": "Apenas quando as mãos estiverem visivelmente sujas."},
    {"id": "D", "text": "Antes e após calçar luvas, antes de comer, após usar o banheiro."}
  ]'::jsonb,
  'B',
  'Os 5 momentos são cruciais para interromper a cadeia de transmissão de infecções cruzadas no ambiente assistencial.',
  'ANVISA'
),
(
  'Biossegurança e Controle de Infecção',
  'Qual a cor do saco de lixo utilizado para o descarte de resíduos do Grupo A (Infectantes) que não necessitam de tratamento prévio?',
  '[
    {"id": "A", "text": "Preto."},
    {"id": "B", "text": "Vermelho."},
    {"id": "C", "text": "Branco Leitoso."},
    {"id": "D", "text": "Laranja."}
  ]'::jsonb,
  'C',
  'Saco Branco Leitoso com símbolo de risco biológico é para infectantes (Grupo A). Saco Preto é para comum (Grupo D). Saco Vermelho é para peças anatômicas (Grupo A3) ou risco A5 (príons).',
  'IBFC'
),
(
  'Biossegurança e Controle de Infecção',
  'A Escabiose (Sarna) exige qual tipo de precaução além da Padrão?',
  '[
    {"id": "A", "text": "Precaução por Gotículas."},
    {"id": "B", "text": "Precaução de Contato."},
    {"id": "C", "text": "Precaução por Aerossóis."},
    {"id": "D", "text": "Nenhuma, apenas Padrão."}
  ]'::jsonb,
  'B',
  'A escabiose é transmitida por contato direto pele a pele ou através de fômites (roupas de cama, toalhas). Exige precaução de contato (avental e luvas) até 24h de tratamento eficaz.',
  'FCC'
),
(
  'Biossegurança e Controle de Infecção',
  'Sobre a máscara N95/PFF2, é correto afirmar:',
  '[
    {"id": "A", "text": "É descartável e deve ser trocada a cada atendimento."},
    {"id": "B", "text": "Protege contra aerossóis e pode ser reutilizada pelo mesmo profissional, desde que íntegra e seca."},
    {"id": "C", "text": "Deve ser usada para precaução de gotículas (ex: Meningite)."},
    {"id": "D", "text": "O paciente com Tuberculose deve usar N95 durante o transporte."}
  ]'::jsonb,
  'B',
  'A N95 pode ser reutilizada por um período determinado pela CCIH (geralmente dias/plantões), se mantida limpa, seca e íntegra. O paciente em transporte usa máscara CIRÚRGICA para conter a fonte.',
  'EBSERH'
),
(
  'Biossegurança e Controle de Infecção',
  'Qual a vacina recomendada para profissionais de saúde que não possuem imunidade contra a Varicela?',
  '[
    {"id": "A", "text": "Tríplice Viral."},
    {"id": "B", "text": "Dupla Viral."},
    {"id": "C", "text": "Vacina contra Varicela (monovalente)."},
    {"id": "D", "text": "Não há recomendação de vacina para adultos."}
  ]'::jsonb,
  'C',
  'Profissionais de saúde suscetíveis devem receber 2 doses da vacina contra Varicela.',
  'FGV'
),
(
  'Biossegurança e Controle de Infecção',
  'Os resíduos perfurocortantes (Grupo E) devem ser descartados em:',
  '[
    {"id": "A", "text": "Saco plástico vermelho."},
    {"id": "B", "text": "Caixa de papelão comum."},
    {"id": "C", "text": "Recipiente rígido, estanque, resistente a punctura e com tampa (caixa amarela)."},
    {"id": "D", "text": "Saco branco leitoso dentro de um balde."}
  ]'::jsonb,
  'C',
  'A caixa de perfurocortante (Descarpack) deve ser rígida para evitar acidentes. Deve ser montada antes do uso e preenchida até o limite de segurança (linha pontilhada).',
  'AOCP'
),
(
  'Biossegurança e Controle de Infecção',
  'A difteria é uma doença transmitida por:',
  '[
    {"id": "A", "text": "Aerossóis."},
    {"id": "B", "text": "Contato direto apenas."},
    {"id": "C", "text": "Gotículas."},
    {"id": "D", "text": "Vetores (mosquitos)."}
  ]'::jsonb,
  'C',
  'A difteria (Corynebacterium diphtheriae) é transmitida por gotículas respiratórias. Exige precaução por gotículas.',
  'CONSULPLAN'
),
(
  'Biossegurança e Controle de Infecção',
  'O Herpes Zoster DISSEMINADO requer quais precauções?',
  '[
    {"id": "A", "text": "Apenas Padrão."},
    {"id": "B", "text": "Contato."},
    {"id": "C", "text": "Gotículas e Contato."},
    {"id": "D", "text": "Aerossóis e Contato."}
  ]'::jsonb,
  'D',
  'O Herpes Zoster disseminado (ou em imunossuprimidos) pode transmitir o vírus da Varicela pelo ar (aerossóis) e pelo contato com as lesões. Exige N95 + Avental/Luvas + Quarto Privativo.',
  'IDECAN'
),
(
  'Biossegurança e Controle de Infecção',
  'Qual a principal medida para prevenção de Pneumonia Associada à Ventilação Mecânica (PAV)?',
  '[
    {"id": "A", "text": "Troca do circuito do ventilador a cada 24h."},
    {"id": "B", "text": "Manter a cabeceira elevada entre 30º e 45º."},
    {"id": "C", "text": "Realizar cultura de secreção traqueal diariamente."},
    {"id": "D", "text": "Usar antibiótico profilático."}
  ]'::jsonb,
  'B',
  'A elevação da cabeceira (30-45º) é a medida de maior impacto do Bundle de PAV, pois previne a broncoaspiração silenciosa de conteúdo gástrico e orofaríngeo.',
  'VUNESP'
)
ON CONFLICT (question) DO NOTHING;