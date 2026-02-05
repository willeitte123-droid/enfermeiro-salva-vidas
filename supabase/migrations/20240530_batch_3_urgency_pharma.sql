INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation)
VALUES
-- 10 Questões de Urgência e Emergência
('Urgência e Emergência', 'Vunesp', 'De acordo com as diretrizes da American Heart Association (AHA) 2020 para RCP em adultos, a frequência e a profundidade corretas das compressões torácicas são, respectivamente:',
'[{"id": "A", "text": "80 a 100 compressões/min e 4 cm de profundidade"}, {"id": "B", "text": "100 a 120 compressões/min e 5 a 6 cm de profundidade"}, {"id": "C", "text": "120 a 140 compressões/min e no mínimo 6 cm de profundidade"}, {"id": "D", "text": "60 a 80 compressões/min e 1/3 do diâmetro do tórax"}]',
'B', 'A RCP de alta qualidade exige frequência entre 100-120/min e profundidade de pelo menos 5cm (não excedendo 6cm) em adultos, com retorno total do tórax.'),

('Urgência e Emergência', 'IBFC', 'Na avaliação primária do trauma (PHTLS), o "X" do mnemônico XABCDE representa a prioridade máxima no atendimento, que é:',
'[{"id": "A", "text": "Desobstrução de Vias Aéreas"}, {"id": "B", "text": "Controle de Hemorragias Exsanguinantes (Externas Graves)"}, {"id": "C", "text": "Avaliação Neurológica"}, {"id": "D", "text": "Exposição do paciente"}]',
'B', 'O "X" foi introduzido para enfatizar que hemorragias massivas (exsanguinantes) matam mais rápido que a obstrução de via aérea e devem ser contidas imediatamente (ex: torniquete).'),

('Urgência e Emergência', 'Cebraspe', 'Um paciente vítima de queimadura apresenta lesões em todo o membro superior direito e na face anterior do tronco. Segundo a Regra dos Nove de Wallace, qual a porcentagem aproximada da superfície corporal queimada?',
'[{"id": "A", "text": "18%"}, {"id": "B", "text": "27%"}, {"id": "C", "text": "36%"}, {"id": "D", "text": "45%"}]',
'B', 'Membro Superior Direito todo = 9%. Face Anterior do Tronco (Tórax + Abdome) = 18%. Total: 9 + 18 = 27%.'),

('Urgência e Emergência', 'FGV', 'Qual dos ritmos cardíacos abaixo é considerado "chocável" (passível de desfibrilação) durante uma Parada Cardiorrespiratória (PCR)?',
'[{"id": "A", "text": "Assistolia"}, {"id": "B", "text": "Atividade Elétrica Sem Pulso (AESP)"}, {"id": "C", "text": "Fibrilação Ventricular (FV)"}, {"id": "D", "text": "Bradicardia Sinusal"}]',
'C', 'Os ritmos chocáveis são Fibrilação Ventricular (FV) e Taquicardia Ventricular Sem Pulso (TVSP). Assistolia e AESP não se chocam (trata-se com RCP e Adrenalina).'),

('Urgência e Emergência', 'FCC', 'A Escala de Coma de Glasgow avalia o nível de consciência. Na atualização mais recente, a resposta pupilar (reação à luz) foi incorporada. Qual a pontuação máxima possível na escala clássica (sem a avaliação pupilar)?',
'[{"id": "A", "text": "10"}, {"id": "B", "text": "13"}, {"id": "C", "text": "14"}, {"id": "D", "text": "15"}]',
'D', 'A pontuação varia de 3 (coma profundo) a 15 (normal). Avalia Abertura Ocular (4), Resposta Verbal (5) e Resposta Motora (6).'),

('Urgência e Emergência', 'AOCP', 'Em uma situação de engasgo total (obstrução grave de via aérea) em um adulto consciente, a manobra de desobstrução indicada é:',
'[{"id": "A", "text": "Manobra de Sellick"}, {"id": "B", "text": "Manobra de Heimlich"}, {"id": "C", "text": "Manobra de Chin-Lift"}, {"id": "D", "text": "Manobra de Leopold"}]',
'B', 'A Manobra de Heimlich consiste em compressões abdominais subdiafragmáticas para expulsar o corpo estranho. Se a vítima ficar inconsciente, inicia-se a RCP.'),

('Urgência e Emergência', 'Consulplan', 'Quais são os sinais clássicos do Choque Hipovolêmico em fase descompensada?',
'[{"id": "A", "text": "Bradicardia e Hipertensão"}, {"id": "B", "text": "Taquicardia, Hipotensão e Pele fria/pegajosa"}, {"id": "C", "text": "Pele quente, seca e Bradicardia"}, {"id": "D", "text": "Poliúria e Hipertensão"}]',
'B', 'A perda de volume leva a taquicardia (compensatória), vasoconstrição (pele fria) e, quando a compensação falha, hipotensão severa.'),

('Urgência e Emergência', 'IDECAN', 'No atendimento ao AVC (Acidente Vascular Cerebral), a escala pré-hospitalar de Cincinnati avalia quais três parâmetros?',
'[{"id": "A", "text": "Força nas pernas, Visão e Dor de cabeça"}, {"id": "B", "text": "Assimetria Facial, Debilidade nos Braços e Fala Anormal"}, {"id": "C", "text": "Respiração, Pulso e Pressão Arterial"}, {"id": "D", "text": "Nível de consciência, Pupilas e Glicemia"}]',
'B', 'O mnemônico SAMU (Sorria, Abrace, Música/Fale, Urgente) corresponde a Face, Braços e Fala. Alteração em 1 dos 3 sugere 72% de chance de AVC.'),

('Urgência e Emergência', 'Vunesp', 'Em caso de picada por cobra Jararaca (Gênero Bothrops), a principal complicação local é a necrose e hemorragia, e a sistêmica é a insuficiência renal. O soro específico a ser administrado é o:',
'[{"id": "A", "text": "Anticrotálico"}, {"id": "B", "text": "Antibotrópico"}, {"id": "C", "text": "Antielapídico"}, {"id": "D", "text": "Antiescorpiônico"}]',
'B', 'Bothrops = Jararaca (Soro Antibotrópico). Crotalus = Cascavel (Soro Anticrotálico - Neurotóxico). Micrurus = Coral (Soro Antielapídico).'),

('Urgência e Emergência', 'EBSERH', 'A droga de escolha utilizada na Parada Cardiorrespiratória (PCR) em ritmos não chocáveis (Assistolia/AESP), administrada a cada 3 a 5 minutos, é:',
'[{"id": "A", "text": "Atropina"}, {"id": "B", "text": "Amiodarona"}, {"id": "C", "text": "Adrenalina (Epinefrina)"}, {"id": "D", "text": "Lidocaína"}]',
'C', 'A Adrenalina 1mg deve ser feita o mais precocemente possível em ritmos não chocáveis. A Atropina não é mais usada na PCR de rotina. Amiodarona é para ritmos chocáveis refratários.'),

-- 10 Questões de Farmacologia e Cálculos
('Farmacologia', 'Vunesp', 'Foi prescrito 500 ml de Soro Fisiológico 0,9% para ser infundido em 8 horas. Qual deve ser a velocidade de gotejamento em gotas por minuto?',
'[{"id": "A", "text": "14 gotas/min"}, {"id": "B", "text": "21 gotas/min"}, {"id": "C", "text": "42 gotas/min"}, {"id": "D", "text": "63 gotas/min"}]',
'B', 'Fórmula: Gotas = Volume / (Tempo x 3). Gotas = 500 / (8 x 3) = 500 / 24 = 20,83. Arredondando: 21 gotas/min.'),

('Farmacologia', 'IBFC', 'Para administrar 2.500.000 UI de Penicilina Cristalina, dispondo de frasco-ampola de 5.000.000 UI diluído em 8 ml de solvente (volume final de 10 ml), quantos ml da solução devem ser aspirados?',
'[{"id": "A", "text": "2 ml"}, {"id": "B", "text": "4 ml"}, {"id": "C", "text": "5 ml"}, {"id": "D", "text": "6 ml"}]',
'C', 'Regra de três: 5.000.000 UI está para 10 ml, assim como 2.500.000 UI está para X. X = (2.500.000 x 10) / 5.000.000 = 5 ml.'),

('Farmacologia', 'FCC', 'A Insulina Regular caracteriza-se por:',
'[{"id": "A", "text": "Ação lenta e aspecto leitoso"}, {"id": "B", "text": "Ação intermediária e aspecto límpido"}, {"id": "C", "text": "Ação rápida e aspecto límpido (transparente)"}, {"id": "D", "text": "Ação ultralenta e aspecto leitoso"}]',
'C', 'A Regular é a única insulina de ação rápida que é transparente e pode ser feita IV. A NPH tem ação intermediária e é leitosa.'),

('Farmacologia', 'EBSERH', 'A técnica em Z (Z-track) é recomendada para administração de medicamentos por via Intramuscular com o objetivo de:',
'[{"id": "A", "text": "Acelerar a absorção da droga"}, {"id": "B", "text": "Evitar o refluxo da medicação para o tecido subcutâneo e manchar a pele"}, {"id": "C", "text": "Diminuir a dor da picada apenas"}, {"id": "D", "text": "Permitir volumes maiores que 5 ml"}]',
'B', 'A técnica em Z veda o trajeto da agulha, impedindo o retorno da medicação (comum em ferro/Noripurum) que poderia irritar ou manchar o subcutâneo.'),

('Farmacologia', 'FGV', 'O antídoto específico para reversão dos efeitos dos anticoagulantes cumarínicos (Varfarina) em caso de sangramento ou superdosagem é:',
'[{"id": "A", "text": "Sulfato de Protamina"}, {"id": "B", "text": "Vitamina K (Fitomenadiona)"}, {"id": "C", "text": "Flumazenil"}, {"id": "D", "text": "Naloxona"}]',
'B', 'A Vitamina K reverte a Varfarina. A Protamina reverte a Heparina. Flumazenil reverte Benzodiazepínicos.'),

('Farmacologia', 'Cebraspe', 'A Noradrenalina é um vasopressor potente. Um cuidado de enfermagem essencial na sua administração é:',
'[{"id": "A", "text": "Administrar preferencialmente em bolus"}, {"id": "B", "text": "Administrar exclusivamente em acesso venoso central, se possível, para evitar necrose por extravasamento"}, {"id": "C", "text": "Diluir sempre em Soro Fisiológico, pois precipita em Glicosado"}, {"id": "D", "text": "Proteger da luz, pois é fotossensível, usando equipo âmbar"}]',
'B', 'A noradrenalina é vesicante. O extravasamento periférico causa necrose grave. (Nota: Ela DEVE ser diluída em Glicosado 5% para evitar oxidação precoce, mas o acesso central é a prioridade de segurança).'),

('Farmacologia', 'AOCP', 'Qual o ângulo correto para administração de medicação por via Intradérmica (ID), como na vacina BCG ou PPD?',
'[{"id": "A", "text": "90 graus"}, {"id": "B", "text": "45 graus"}, {"id": "C", "text": "10 a 15 graus"}, {"id": "D", "text": "30 graus"}]',
'C', 'A via ID é quase paralela à pele (10-15º) para formar a pápula na derme. 90º é IM, 45º é SC.'),

('Farmacologia', 'IDIB', 'Para administrar 20 mg de Furosemida (Lasix), sabendo que a ampola possui 2 ml com 10 mg/ml (total 20 mg na ampola), deve-se aspirar:',
'[{"id": "A", "text": "0,5 ml"}, {"id": "B", "text": "1 ml"}, {"id": "C", "text": "1,5 ml"}, {"id": "D", "text": "2 ml (a ampola toda)"}]',
'D', 'A concentração é 10mg/ml. Se a ampola tem 2ml, ela tem 20mg no total. Para fazer 20mg, aspira-se os 2ml.'),

('Farmacologia', 'Consulplan', 'A prescrição é de 60 mg de Gentamicina IM. A farmácia dispõe de ampolas de 80 mg/2 ml. Quanto aspirar?',
'[{"id": "A", "text": "1,0 ml"}, {"id": "B", "text": "1,2 ml"}, {"id": "C", "text": "1,5 ml"}, {"id": "D", "text": "1,8 ml"}]',
'C', 'Regra de três: 80 mg está para 2 ml, 60 mg está para X. X = (60 * 2) / 80 = 120 / 80 = 1,5 ml.'),

('Farmacologia', 'Vunesp', 'Sinais de intoxicação digitálica (ex: Digoxina) incluem:',
'[{"id": "A", "text": "Hipertensão e Taquicardia"}, {"id": "B", "text": "Náuseas, vômitos, visão turva (halos) e bradicardia"}, {"id": "C", "text": "Tosse seca e edema de glote"}, {"id": "D", "text": "Poliúria e sede intensa"}]',
'B', 'A toxicidade digitálica causa distúrbios gastrointestinais (náuseas), visuais (halos amarelo-esverdeados) e arritmias (bradicardia/BAV).')
ON CONFLICT (question) DO NOTHING;