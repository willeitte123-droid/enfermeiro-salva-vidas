INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation)
VALUES
-- Administração em Enfermagem
('Administração em Enfermagem', 'Vunesp', 'No dimensionamento de pessoal de enfermagem, qual é a proporção mínima de enfermeiros recomendada para cuidados intensivos segundo a Resolução COFEN 543/2017?', 
'[{"id": "A", "text": "20%"}, {"id": "B", "text": "33%"}, {"id": "C", "text": "42%"}, {"id": "D", "text": "52%"}]', 
'D', 'Para cuidados intensivos, a distribuição percentual do total de profissionais deve ser de no mínimo 52% de Enfermeiros e o restante de Técnicos de Enfermagem.'),

('Administração em Enfermagem', 'FCC', 'Qual estilo de liderança é caracterizado pela centralização das decisões no líder, sendo indicado em situações de emergência como uma PCR?', 
'[{"id": "A", "text": "Liderança Democrática"}, {"id": "B", "text": "Liderança Autocrática"}, {"id": "C", "text": "Liderança Laissez-faire"}, {"id": "D", "text": "Liderança Situacional"}]', 
'B', 'A liderança autocrática foca na tarefa e no líder. Embora criticada no dia a dia, é eficaz em situações críticas que exigem comando rápido e direto, como uma parada cardiorrespiratória.'),

-- ECG e Cardiologia
('ECG', 'IBFC', 'No eletrocardiograma, o que representa a Onda P?', 
'[{"id": "A", "text": "Repolarização Ventricular"}, {"id": "B", "text": "Despolarização Ventricular"}, {"id": "C", "text": "Despolarização Atrial"}, {"id": "D", "text": "Condução AV"}]', 
'C', 'A Onda P representa a despolarização (contração) dos átrios. O complexo QRS é a despolarização ventricular e a Onda T é a repolarização ventricular.'),

('Cardiologia', 'Cesgranrio', 'Qual é a droga de primeira escolha para tratamento de uma bradicardia sinusal sintomática com instabilidade hemodinâmica?', 
'[{"id": "A", "text": "Amiodarona"}, {"id": "B", "text": "Atropina"}, {"id": "C", "text": "Adenosina"}, {"id": "D", "text": "Lidocaína"}]', 
'B', 'A Atropina é um anticolinérgico (vagolítico) usado para aumentar a frequência cardíaca em bradicardias sintomáticas. A dose inicial recomendada é de 1mg em bolus.'),

('Cardiologia e Emergência', 'FGV', 'Em uma PCR, quais são os ritmos considerados chocáveis?', 
'[{"id": "A", "text": "Assistolia e AESP"}, {"id": "B", "text": "Fibrilação Ventricular e Taquicardia Ventricular sem Pulso"}, {"id": "C", "text": "Fibrilação Atrial e Flutter"}, {"id": "D", "text": "Bravicardia e Assistolia"}]', 
'B', 'Os ritmos chocáveis são a Fibrilação Ventricular (FV) e a Taquicardia Ventricular sem Pulso (TVSP). Assistolia e AESP são ritmos não chocáveis.'),

-- Ética e Legislação
('Ética e Legislação Profissional', 'COREN', 'Qual penalidade ética é de competência exclusiva do Conselho Federal de Enfermagem (COFEN)?', 
'[{"id": "A", "text": "Multa"}, {"id": "B", "text": "Suspensão"}, {"id": "C", "text": "Cassação do direito ao exercício profissional"}, {"id": "D", "text": "Censura"}]', 
'C', 'A Cassação do direito ao exercício profissional é a penalidade máxima e só pode ser aplicada pelo COFEN, após decisão do Conselho Regional.'),

('Ética', 'Vunesp', 'Segundo o Código de Ética, o profissional de enfermagem pode recusar-se a executar atividades que não sejam de sua competência técnica, científica, ética e legal?', 
'[{"id": "A", "text": "Não, nunca pode recusar"}, {"id": "B", "text": "Sim, é um direito do profissional"}, {"id": "C", "text": "Apenas se tiver autorização médica"}, {"id": "D", "text": "Apenas em hospitais privados"}]', 
'B', 'É um direito do profissional (Art. 22) recusar-se a executar atividades que não sejam de sua competência ou que não ofereçam segurança ao profissional e ao paciente.'),

-- Clínica Médica e Cirúrgica
('Clínica Médica e Cirúrgica', 'EBSERH', 'Qual é o principal sinal clínico indicativo de hipocalemia (potássio baixo)?', 
'[{"id": "A", "text": "Ondas T apiculadas no ECG"}, {"id": "B", "text": "Fraqueza muscular e câimbras"}, {"id": "C", "text": "Hipertensão severa"}, {"id": "D", "text": "Edema generalizado"}]', 
'B', 'A hipocalemia causa hiperpolarização das membranas, levando a fraqueza muscular, câimbras, íleo paralítico e arritmias. Ondas T apiculadas são sinal de HIPERcalemia.'),

('Clínica Médica e Cirúrgica', 'IBFC', 'No pós-operatório imediato, qual a posição recomendada para um paciente que foi submetido a uma raquianestesia?', 
'[{"id": "A", "text": "Fowler"}, {"id": "B", "text": "Trendelenburg"}, {"id": "C", "text": "Decúbito dorsal horizontal sem travesseiro"}, {"id": "D", "text": "Decúbito lateral esquerdo"}]', 
'C', 'Recomenda-se decúbito dorsal horizontal sem travesseiro nas primeiras horas para prevenir a cefaleia pós-raqui (pela hipotensão liquórica).'),

-- Saúde Coletiva e SUS
('Saúde Coletiva', 'Cebraspe', 'Qual doença é de notificação compulsória IMEDIATA (até 24h)?', 
'[{"id": "A", "text": "Tuberculose"}, {"id": "B", "text": "Hanseníase"}, {"id": "C", "text": "Sarampo"}, {"id": "D", "text": "Hipertensão Arterial"}]', 
'C', 'O Sarampo é uma doença de notificação compulsória imediata devido ao seu alto potencial de transmissibilidade e surto. Tuberculose e Hanseníase são de notificação semanal.'),

('Políticas de Saúde (SUS)', 'FGV', 'A participação da comunidade na gestão do SUS é regulamentada por qual lei?', 
'[{"id": "A", "text": "Lei 8.080/90"}, {"id": "B", "text": "Lei 8.142/90"}, {"id": "C", "text": "Decreto 7.508/11"}, {"id": "D", "text": "Constituição Federal"}]', 
'B', 'A Lei 8.142/90 dispõe sobre a participação da comunidade na gestão do SUS (Conselhos e Conferências) e sobre as transferências intergovernamentais de recursos.'),

-- Saúde da Mulher e Criança
('Saúde da Mulher e da Criança', 'Vunesp', 'Qual vacina deve ser administrada na gestante a partir da 20ª semana de CADA gestação?', 
'[{"id": "A", "text": "HPV"}, {"id": "B", "text": "dTpa"}, {"id": "C", "text": "Varicela"}, {"id": "D", "text": "Meningocócica C"}]', 
'B', 'A vacina dTpa (Tríplice bacteriana acelular do tipo adulto) é indicada a partir da 20ª semana para proteger o neonato contra o coqueluche (Bordetella pertussis).'),

('Saúde da Mulher e da Criança', 'FCC', 'O Teste do Pezinho deve ser coletado idealmente em qual período?', 
'[{"id": "A", "text": "Nas primeiras 24 horas"}, {"id": "B", "text": "Entre o 3º e o 5º dia de vida"}, {"id": "C", "text": "Após o 10º dia"}, {"id": "D", "text": "A qualquer momento no primeiro mês"}]', 
'B', 'O período ideal é entre o 3º e o 5º dia de vida. Antes de 48h pode haver falsos negativos para fenilcetonúria (pela alimentação insuficiente).'),

-- CME e Biossegurança
('CME', 'AOCP', 'Qual a classificação de Spaulding para um endoscópio digestivo?', 
'[{"id": "A", "text": "Artigo Crítico"}, {"id": "B", "text": "Artigo Semicrítico"}, {"id": "C", "text": "Artigo Não Crítico"}, {"id": "D", "text": "Artigo Descartável"}]', 
'B', 'Endoscópios entram em contato com mucosa íntegra, sendo classificados como semicríticos. Requerem desinfecção de alto nível (embora esterilização seja desejável).'),

('Biossegurança', 'IBFC', 'Qual a cor do saco de lixo indicado para descarte de resíduos infectantes (Grupo A)?', 
'[{"id": "A", "text": "Preto"}, {"id": "B", "text": "Vermelho"}, {"id": "C", "text": "Branco Leitoso"}, {"id": "D", "text": "Laranja"}]', 
'C', 'O saco branco leitoso com o símbolo de risco biológico é destinado aos resíduos infectantes (Grupo A).'),

-- Saúde Mental
('Saúde Mental e Psiquiatria', 'Vunesp', 'Qual é o principal objetivo dos Centros de Atenção Psicossocial (CAPS)?', 
'[{"id": "A", "text": "Promover internação de longa permanência"}, {"id": "B", "text": "Substituir o modelo hospitalocêntrico e promover reinserção social"}, {"id": "C", "text": "Fornecer apenas medicamentos controlados"}, {"id": "D", "text": "Realizar eletroconvulsoterapia em massa"}]', 
'B', 'Os CAPS são serviços estratégicos da Reforma Psiquiátrica, visando o cuidado em liberdade, a reabilitação psicossocial e a substituição das internações em manicômios.'),

('Saúde Mental e Psiquiatria', 'Cebraspe', 'Em caso de internação involuntária, o estabelecimento de saúde deve comunicar o Ministério Público em qual prazo?', 
'[{"id": "A", "text": "24 horas"}, {"id": "B", "text": "48 horas"}, {"id": "C", "text": "72 horas"}, {"id": "D", "text": "Não há necessidade de comunicar"}]', 
'C', 'A Lei 10.216/2001 determina que a internação involuntária e sua alta devem ser comunicadas ao Ministério Público estadual no prazo de 72 horas.'),

-- Farmacologia
('Farmacologia e Alta Vigilância', 'EBSERH', 'A Noradrenalina é um medicamento vasopressor. Qual é o cuidado essencial na sua administração?', 
'[{"id": "A", "text": "Administrar em bolus rápido"}, {"id": "B", "text": "Usar preferencialmente acesso venoso central e bomba de infusão"}, {"id": "C", "text": "Diluir em Soro Fisiológico obrigatoriamente"}, {"id": "D", "text": "Administrar por via intramuscular"}]', 
'B', 'A Noradrenalina deve ser infundida em acesso central (risco de necrose periférica) e sempre em Bomba de Infusão Contínua (BIC) para controle preciso da dose. Ela deve ser diluída preferencialmente em Glicose 5% (para evitar oxidação precoce).'),

('Farmacologia e Segurança do Paciente', 'IBFC', 'Qual é o antídoto específico para intoxicação por Opioides (ex: Morfina, Fentanil)?', 
'[{"id": "A", "text": "Flumazenil"}, {"id": "B", "text": "Naloxona"}, {"id": "C", "text": "Atropina"}, {"id": "D", "text": "Protaminas"}]', 
'B', 'A Naloxona (Narcan) é o antagonista opioide utilizado para reverter a depressão respiratória e sedação causadas por opioides. O Flumazenil é para Benzodiazepínicos.'),

-- SAE
('SAE e Processo de Enfermagem', 'Vunesp', 'Qual é a etapa do Processo de Enfermagem que envolve a determinação dos resultados que se espera alcançar e das ações a serem realizadas?', 
'[{"id": "A", "text": "Diagnóstico de Enfermagem"}, {"id": "B", "text": "Planejamento de Enfermagem"}, {"id": "C", "text": "Implementação"}, {"id": "D", "text": "Avaliação"}]', 
'B', 'O Planejamento é a etapa onde se definem as metas (NOC) e as intervenções (NIC) necessárias para alcançá-las.'),

('Sistematização (SAE)', 'COREN', 'A Sistematização da Assistência de Enfermagem (SAE) é uma atividade privativa de qual profissional?', 
'[{"id": "A", "text": "Técnico de Enfermagem"}, {"id": "B", "text": "Enfermeiro"}, {"id": "C", "text": "Médico"}, {"id": "D", "text": "Toda a equipe de enfermagem"}]', 
'B', 'A SAE e a liderança na execução do Processo de Enfermagem são atividades privativas do Enfermeiro, conforme Resolução COFEN 358/2009. Técnicos participam na execução.'),

-- Vigilâncias
('Vigilância Epidemiológica', 'FGV', 'O cálculo do Coeficiente de Mortalidade Infantil considera o número de óbitos de menores de:', 
'[{"id": "A", "text": "1 mês"}, {"id": "B", "text": "1 ano"}, {"id": "C", "text": "5 anos"}, {"id": "D", "text": "28 dias"}]', 
'B', 'A Mortalidade Infantil considera os óbitos de crianças menores de 1 ano de idade, por 1.000 nascidos vivos, em determinado local e período.'),

('Vigilância Sanitária', 'ANVISA', 'Qual é o objetivo principal da Vigilância Sanitária?', 
'[{"id": "A", "text": "Tratar doenças infecciosas"}, {"id": "B", "text": "Eliminar riscos à saúde decorrentes do meio ambiente, produção e circulação de bens"}, {"id": "C", "text": "Realizar campanhas de vacinação"}, {"id": "D", "text": "Contabilizar nascimentos e óbitos"}]', 
'B', 'A VISA tem como objetivo eliminar, diminuir ou prevenir riscos à saúde e intervir nos problemas sanitários decorrentes do meio ambiente, da produção e circulação de bens e da prestação de serviços.'),

-- Oncologia
('Oncologia', 'INCA', 'Qual é o exame de rastreamento (screening) indicado para Câncer de Mama em mulheres de 50 a 69 anos pelo Ministério da Saúde?', 
'[{"id": "A", "text": "Autoexame mensal"}, {"id": "B", "text": "Ultrassom mamário anual"}, {"id": "C", "text": "Mamografia bienal (a cada 2 anos)"}, {"id": "D", "text": "Ressonância Magnética"}]', 
'C', 'O MS recomenda a Mamografia de rastreamento a cada 2 anos para mulheres entre 50 e 69 anos. O autoexame não substitui o rastreio.'),

-- Tratamento de Feridas
('Tratamento de Feridas', 'Vunesp', 'Qual cobertura é indicada para uma lesão por pressão com tecido de granulação (vermelho), exsudato leve e sem infecção?', 
'[{"id": "A", "text": "Colagenase"}, {"id": "B", "text": "Carvão Ativado"}, {"id": "C", "text": "Espuma de Poliuretano ou Hidrocoloide"}, {"id": "D", "text": "Alginato de Cálcio"}]', 
'C', 'Para tecido de granulação com pouco exsudato, o objetivo é proteger e manter a umidade. Hidrocoloide ou Espuma são excelentes escolhas. Alginato é para muito exsudato; Carvão para odor/infecção; Colagenase para desbridar.'),

('Curativos e Tratamento de Feridas', 'IBFC', 'O desbridamento autolítico é promovido por qual tipo de produto?', 
'[{"id": "A", "text": "Bisturi"}, {"id": "B", "text": "Hidrogel"}, {"id": "C", "text": "Papaína"}, {"id": "D", "text": "Gaze seca"}]', 
'B', 'O Hidrogel fornece umidade ao leito da ferida, permitindo que as próprias enzimas do corpo e a umidade amoleçam e degradem o tecido necrótico (autólise).'),

-- Neurologia
('Neurologia', 'EBSERH', 'Na avaliação da Escala de Coma de Glasgow, qual é a pontuação máxima possível?', 
'[{"id": "A", "text": "10"}, {"id": "B", "text": "14"}, {"id": "C", "text": "15"}, {"id": "D", "text": "16"}]', 
'C', 'A pontuação máxima da ECG é 15 (Abertura Ocular 4 + Resposta Verbal 5 + Resposta Motora 6). A mínima é 3.'),

-- Hemoterapia
('Hemoterapia', 'Hemocentro', 'Durante uma transfusão sanguínea, o paciente relata dor lombar e febre. Qual a primeira conduta da enfermagem?', 
'[{"id": "A", "text": "Administrar antitérmico e continuar"}, {"id": "B", "text": "Acelerar a infusão para terminar logo"}, {"id": "C", "text": "Interromper a transfusão imediatamente e manter acesso com SF 0,9%"}, {"id": "D", "text": "Colocar o paciente sentado"}]', 
'C', 'A interrupção imediata é crucial diante de qualquer suspeita de reação transfusional (como a hemolítica aguda). Deve-se manter a via pervia com soro fisiológico e notificar o médico/banco de sangue.'),

-- Cuidados Paliativos
('Cuidados Paliativos', 'Vunesp', 'Qual é o foco principal dos Cuidados Paliativos?', 
'[{"id": "A", "text": "Curar a doença a qualquer custo"}, {"id": "B", "text": "Acelerar o processo de morte (eutanásia)"}, {"id": "C", "text": "Alívio do sofrimento e qualidade de vida"}, {"id": "D", "text": "Sedação profunda contínua em todos os casos"}]', 
'C', 'Cuidados Paliativos visam a prevenção e alívio do sofrimento, através da identificação precoce, avaliação e tratamento impecável da dor e outros problemas físicos, psicossociais e espirituais.'),

-- Nutrição
('Nutrição Clínica', 'Residência', 'Qual é a via preferencial de nutrição para um paciente com trato gastrointestinal funcionante, mas incapaz de ingerir oralmente?', 
'[{"id": "A", "text": "Nutrição Parenteral Total (NPT)"}, {"id": "B", "text": "Nutrição Enteral (Sonda)"}, {"id": "C", "text": "Hidratação Venosa apenas"}, {"id": "D", "text": "Gastrostomia Endoscópica (indicação inicial)"}]', 
'B', 'Se o intestino funciona, usa-se o intestino ("If the gut works, use it"). A Nutrição Enteral é mais fisiológica, mantém a barreira mucosa e tem menos riscos que a Parenteral.');