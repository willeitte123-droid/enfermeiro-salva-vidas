INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation)
VALUES

-- 1. Controle de Infecção (5 questões)
('Controle de Infecção', 'Vunesp', 'Dentre os cinco momentos para higienização das mãos preconizados pela OMS, qual destes NÃO faz parte da lista oficial?',
'[{"id": "A", "text": "Antes de tocar o paciente"}, {"id": "B", "text": "Antes de realizar procedimento limpo/asséptico"}, {"id": "C", "text": "Após tocar o paciente"}, {"id": "D", "text": "Ao entrar na unidade de saúde (recepção)"}]',
'D', 'Os 5 momentos são: 1. Antes de tocar o paciente; 2. Antes de procedimento limpo; 3. Após risco de exposição a fluidos; 4. Após tocar o paciente; 5. Após tocar superfícies próximas ao paciente. A entrada na unidade é recomendada, mas não é um dos "5 momentos" de beira-leito.'),

('Controle de Infecção', 'IBFC', 'Para um paciente com diagnóstico confirmado de Tuberculose Pulmonar Bacilífera, a precaução recomendada é:',
'[{"id": "A", "text": "Padrão apenas"}, {"id": "B", "text": "Contato"}, {"id": "C", "text": "Gotículas"}, {"id": "D", "text": "Aerossóis"}]',
'D', 'A TB é transmitida por aerossóis (partículas < 5 micra que ficam suspensas no ar). Requer máscara N95 para o profissional e quarto privativo com pressão negativa.'),

('Controle de Infecção', 'FCC', 'O "Bundle" (pacote de medidas) de prevenção de Pneumonia Associada à Ventilação (PAV) inclui, obrigatoriamente:',
'[{"id": "A", "text": "Manter a cabeceira elevada entre 30º e 45º"}, {"id": "B", "text": "Trocar o circuito do ventilador a cada 24 horas"}, {"id": "C", "text": "Realizar cultura de secreção traqueal diária"}, {"id": "D", "text": "Administrar antibiótico profilático"}]',
'A', 'Elevação da cabeceira, higiene oral com clorexidina, despertar diário e controle da pressão do cuff são medidas essenciais do bundle de PAV.'),

('Controle de Infecção', 'AOCP', 'Qual o principal objetivo da Comissão de Controle de Infecção Hospitalar (CCIH)?',
'[{"id": "A", "text": "Punir funcionários que não lavam as mãos"}, {"id": "B", "text": "Executar as ações de limpeza terminal"}, {"id": "C", "text": "Planejar, implementar e avaliar o Programa de Controle de Infecção Hospitalar (PCIH)"}, {"id": "D", "text": "Comprar antibióticos"}]',
'C', 'A CCIH é um órgão de assessoria e planejamento, responsável por vigiar as taxas de infecção e propor medidas preventivas e educativas.'),

('Controle de Infecção', 'Cebraspe', 'Em relação à precaução de contato, é correto afirmar que:',
'[{"id": "A", "text": "O uso de máscara N95 é obrigatório"}, {"id": "B", "text": "É indicada para Meningite Meningocócica"}, {"id": "C", "text": "Exige o uso de avental e luvas para qualquer contato com o paciente ou ambiente"}, {"id": "D", "text": "O quarto privativo é dispensável em casos de bactérias multirresistentes"}]',
'C', 'Precaução de contato visa prevenir transmissão por toque direto ou indireto (fômites). Luvas e avental são os EPIs principais.'),


-- 2. Cardiologia e Emergência (5 questões)
('Cardiologia e Emergência', 'Vunesp', 'Na cadeia de sobrevivência da PCR intra-hospitalar, o primeiro elo é:',
'[{"id": "A", "text": "RCP imediata de alta qualidade"}, {"id": "B", "text": "Vigilância e prevenção"}, {"id": "C", "text": "Desfibrilação rápida"}, {"id": "D", "text": "Suporte Avançado de Vida"}]',
'B', 'No ambiente hospitalar, o foco é reconhecer a deterioração clínica antes que a parada aconteça (Vigilância e Prevenção).'),

('Cardiologia e Emergência', 'FGV', 'Durante as compressões torácicas em um adulto, a profundidade recomendada é de:',
'[{"id": "A", "text": "No mínimo 2 cm"}, {"id": "B", "text": "Entre 5 cm e 6 cm"}, {"id": "C", "text": "No máximo 4 cm"}, {"id": "D", "text": "Exatamente 8 cm"}]',
'B', 'A diretriz da AHA (2020) recomenda compressões com profundidade de pelo menos 5cm, mas não superior a 6cm, para garantir fluxo e evitar traumas.'),

('Cardiologia e Emergência', 'IBFC', 'Qual é a droga vasopressora de primeira escolha no Choque Séptico que não respondeu à ressuscitação volêmica inicial?',
'[{"id": "A", "text": "Dobutamina"}, {"id": "B", "text": "Adrenalina"}, {"id": "C", "text": "Noradrenalina"}, {"id": "D", "text": "Dopamina"}]',
'C', 'A Noradrenalina é o vasopressor de escolha para elevar a PAM (alvo ≥ 65 mmHg) no choque séptico.'),

('Cardiologia e Emergência', 'AOCP', 'O sinal de Levine é caracterizado por:',
'[{"id": "A", "text": "Dor na panturrilha à dorsiflexão do pé"}, {"id": "B", "text": "Punho cerrado sobre o precórdio ao descrever dor torácica"}, {"id": "C", "text": "Desvio de rima labial"}, {"id": "D", "text": "Equimose periumbilical"}]',
'B', 'É um gesto clássico do paciente com angina ou infarto, indicando dor opressiva difusa no peito.'),

('Cardiologia e Emergência', 'FCC', 'Em uma PCR com ritmo chocável (FV/TV sem pulso), a droga antiarrítmica de primeira linha, a ser administrada após o 3º choque se a PCR persistir, é:',
'[{"id": "A", "text": "Adenosina"}, {"id": "B", "text": "Atropina"}, {"id": "C", "text": "Amiodarona"}, {"id": "D", "text": "Bicarbonato de Sódio"}]',
'C', 'A Amiodarona (300mg em bolus) é indicada para FV/TV refratária ao choque. A Lidocaína é a alternativa se não houver Amiodarona.'),


-- 3. Cardiologia e ECG (5 questões)
('Cardiologia e ECG', 'Vunesp', 'No eletrocardiograma normal, a onda P representa:',
'[{"id": "A", "text": "Repolarização ventricular"}, {"id": "B", "text": "Despolarização atrial"}, {"id": "C", "text": "Despolarização ventricular"}, {"id": "D", "text": "Condução pelo feixe de His"}]',
'B', 'A onda P é a primeira onda do ciclo, gerada pelo nó sinusal, e reflete a contração (despolarização) dos átrios.'),

('Cardiologia e ECG', 'EBSERH', 'A derivação precordial V1 deve ser posicionada no:',
'[{"id": "A", "text": "4º espaço intercostal, linha paraesternal direita"}, {"id": "B", "text": "4º espaço intercostal, linha paraesternal esquerda"}, {"id": "C", "text": "5º espaço intercostal, linha hemiclavicular"}, {"id": "D", "text": "5º espaço intercostal, linha axilar anterior"}]',
'A', 'V1 fica à direita do esterno, no 4º EIC. V2 fica à esquerda, no mesmo nível.'),

('Cardiologia e ECG', 'IBFC', 'Um traçado de ECG que apresenta ritmo irregular, ausência de onda P e linha de base trêmula (ondas f) é característico de:',
'[{"id": "A", "text": "Bloqueio Atrioventricular Total"}, {"id": "B", "text": "Taquicardia Sinusal"}, {"id": "C", "text": "Fibrilação Atrial"}, {"id": "D", "text": "Flutter Atrial"}]',
'C', 'A Fibrilação Atrial é a arritmia sustentada mais comum, caracterizada pela desorganização da atividade atrial (sem onda P) e resposta ventricular irregular.'),

('Cardiologia e ECG', 'FGV', 'O supradesnivelamento do segmento ST em duas ou mais derivações contíguas é o sinal eletrocardiográfico clássico de:',
'[{"id": "A", "text": "Isquemia subendocárdica"}, {"id": "B", "text": "Infarto Agudo do Miocárdio (Lesão Transmural)"}, {"id": "C", "text": "Hipocalemia"}, {"id": "D", "text": "Pericardite antiga"}]',
'B', 'O "Supra de ST" indica oclusão total da artéria coronária e necrose em andamento, exigindo reperfusão imediata.'),

('Cardiologia e ECG', 'AOCP', 'Qual alteração no ECG é sugestiva de Hipercalemia (Potássio alto) grave?',
'[{"id": "A", "text": "Onda U proeminente"}, {"id": "B", "text": "Onda T apiculada e simétrica (em tenda)"}, {"id": "C", "text": "Segmento ST deprimido"}, {"id": "D", "text": "Onda P invertida"}]',
'B', 'A Onda T apiculada é um dos primeiros sinais de hipercalemia, podendo evoluir para alargamento do QRS e assistolia.'),


-- 4. Neurologia (5 questões)
('Neurologia', 'Vunesp', 'Na Escala de Coma de Glasgow, a resposta motora "Decorticação" (flexão anormal) pontua:',
'[{"id": "A", "text": "2 pontos"}, {"id": "B", "text": "3 pontos"}, {"id": "C", "text": "4 pontos"}, {"id": "D", "text": "5 pontos"}]',
'B', 'Decorticação (flexão) vale 3. Descerebração (extensão) vale 2. Retirada inespecífica vale 4.'),

('Neurologia', 'FCC', 'A rigidez de nuca, juntamente com os sinais de Kernig e Brudzinski positivos, são indicativos clássicos de:',
'[{"id": "A", "text": "Acidente Vascular Cerebral"}, {"id": "B", "text": "Meningite"}, {"id": "C", "text": "Trauma Raquimedular"}, {"id": "D", "text": "Hipertensão Intracraniana isolada"}]',
'B', 'São sinais de irritação meníngea, indicando inflamação das meninges.'),

('Neurologia', 'Cebraspe', 'Em um paciente com AVC Isquêmico, o objetivo principal de manter a pressão arterial levemente elevada (permissiva) na fase aguda é:',
'[{"id": "A", "text": "Aumentar o sangramento"}, {"id": "B", "text": "Manter a Perfusão Cerebral na área de penumbra isquêmica"}, {"id": "C", "text": "Prevenir insuficiência renal"}, {"id": "D", "text": "Facilitar a punção venosa"}]',
'B', 'A área de penumbra ao redor do infarto depende de uma pressão de perfusão adequada para sobreviver. Baixar a PA bruscamente pode aumentar a área de necrose.'),

('Neurologia', 'IBFC', 'A avaliação pupilar que revela uma pupila dilatada (midríase) e outra contraída (miose) é chamada de:',
'[{"id": "A", "text": "Isocoria"}, {"id": "B", "text": "Anisocoria"}, {"id": "C", "text": "Discoria"}, {"id": "D", "text": "Midríase bilateral"}]',
'B', 'Anisocoria em paciente neurológico agudo é sinal de alerta grave para herniação cerebral (compressão do nervo oculomotor).'),

('Neurologia', 'IDECAN', 'Qual é a janela terapêutica padrão estendida para administração de trombolítico (rtPA) no AVC isquêmico?',
'[{"id": "A", "text": "Até 3 horas"}, {"id": "B", "text": "Até 4,5 horas"}, {"id": "C", "text": "Até 6 horas"}, {"id": "D", "text": "Até 24 horas"}]',
'B', 'O tempo máximo para iniciar a trombólise endovenosa é de 4,5 horas do início dos sintomas, desde que preenchidos os critérios de inclusão.'),


-- 5. Controle de Infecção (CME) (5 questões)
('Controle de Infecção (CME)', 'Vunesp', 'Na CME, o teste de Bowie & Dick deve ser realizado diariamente para:',
'[{"id": "A", "text": "Testar a eficácia da esterilização biológica"}, {"id": "B", "text": "Avaliar a eficácia da remoção de ar e penetração do vapor em autoclaves pré-vácuo"}, {"id": "C", "text": "Verificar a temperatura máxima atingida"}, {"id": "D", "text": "Limpar a câmara interna"}]',
'B', 'O Bowie & Dick é um teste químico específico para testar o sistema de vácuo da autoclave, garantindo que o ar foi removido para o vapor entrar.'),

('Controle de Infecção (CME)', 'AOCP', 'Artigos utilizados em procedimentos cirúrgicos, que penetram tecidos estéreis ou sistema vascular, são classificados segundo Spaulding como:',
'[{"id": "A", "text": "Não Críticos"}, {"id": "B", "text": "Semicríticos"}, {"id": "C", "text": "Críticos"}, {"id": "D", "text": "Contaminados"}]',
'C', 'Artigos críticos exigem esterilização obrigatória (eliminação de todas as formas de vida microbiana, incluindo esporos).'),

('Controle de Infecção (CME)', 'FGV', 'O fluxo de trabalho dentro de uma Central de Material e Esterilização (CME) deve ser:',
'[{"id": "A", "text": "Circular e bidirecional"}, {"id": "B", "text": "Unidirecional e contínuo (da área suja para a limpa/estéril)"}, {"id": "C", "text": "Aleatório, dependendo da demanda"}, {"id": "D", "text": "Do setor estéril para o setor sujo"}]',
'B', 'O fluxo unidirecional evita a contaminação cruzada. O material sujo nunca deve cruzar com o limpo/estéril.'),

('Controle de Infecção (CME)', 'IBFC', 'O detergente enzimático é utilizado na etapa de limpeza de materiais para:',
'[{"id": "A", "text": "Esterilizar o material"}, {"id": "B", "text": "Promover a quebra da matéria orgânica (proteínas, gorduras) facilitando sua remoção"}, {"id": "C", "text": "Lubrificar as articulações dos instrumentos"}, {"id": "D", "text": "Dar brilho ao aço inoxidável"}]',
'B', 'As enzimas (protease, amilase, lipase) digerem a sujeira orgânica, tornando a limpeza mais eficaz.'),

('Controle de Infecção (CME)', 'Consulplan', 'O indicador biológico de leitura rápida utiliza qual microrganismo para validar ciclos de autoclave a vapor?',
'[{"id": "A", "text": "Bacillus atrophaeus"}, {"id": "B", "text": "Geobacillus stearothermophilus"}, {"id": "C", "text": "Clostridium tetani"}, {"id": "D", "text": "Pseudomonas aeruginosa"}]',
'B', 'O Geobacillus stearothermophilus é o microrganismo padrão por ser altamente resistente ao calor úmido. Se ele morre, o ciclo foi eficaz.'),


-- 6. Farmacologia e Segurança do Paciente (5 questões)
('Farmacologia e Segurança do Paciente', 'Vunesp', 'A Meta 1 de Segurança do Paciente preconiza a identificação correta. Para isso, devem ser utilizados pelo menos:',
'[{"id": "A", "text": "O número do leito e o nome do médico"}, {"id": "B", "text": "O nome do paciente e o número do quarto"}, {"id": "C", "text": "Dois identificadores (ex: Nome Completo e Data de Nascimento)"}, {"id": "D", "text": "Apenas o número do prontuário"}]',
'C', 'O número do leito/quarto nunca deve ser usado como identificador, pois pacientes mudam de lugar. Nome e Data de Nascimento são o padrão.'),

('Farmacologia e Segurança do Paciente', 'FCC', 'A via de administração de medicamentos que evita o "efeito de primeira passagem" hepático e tem absorção rápida é a via:',
'[{"id": "A", "text": "Oral"}, {"id": "B", "text": "Sublingual"}, {"id": "C", "text": "Intradérmica"}, {"id": "D", "text": "Retal (parcialmente)"}]',
'B', 'A via sublingual absorve direto para a veia cava superior, caindo na circulação sistêmica sem passar pelo fígado primeiro.'),

('Farmacologia e Segurança do Paciente', 'EBSERH', 'Para administrar 500ml de soro em 8 horas, quantas gotas por minuto devem ser infundidas aproximadamente?',
'[{"id": "A", "text": "14 gotas/min"}, {"id": "B", "text": "21 gotas/min"}, {"id": "C", "text": "42 gotas/min"}, {"id": "D", "text": "60 gotas/min"}]',
'B', 'Fórmula: Volume / (Tempo x 3). 500 / (8 x 3) = 500 / 24 = 20,83 (aprox 21 gotas/min).'),

('Farmacologia e Segurança do Paciente', 'IBFC', 'Um "Evento Adverso" em saúde é definido como:',
'[{"id": "A", "text": "Qualquer erro cometido pela enfermagem"}, {"id": "B", "text": "Um incidente que resultou em dano ao paciente"}, {"id": "C", "text": "Um incidente que não atingiu o paciente (Near Miss)"}, {"id": "D", "text": "Apenas reações alérgicas a medicamentos"}]',
'B', 'Evento adverso é quando o erro ou falha atinge o paciente e causa algum tipo de dano (leve, moderado ou grave).'),

('Farmacologia e Segurança do Paciente', 'FGV', 'A prescrição de "Se Necessário" (S/N) ou "A Critério Médico" (ACM) deve ser evitada ou usada com cautela, pois:',
'[{"id": "A", "text": "Dá muito trabalho para a enfermagem"}, {"id": "B", "text": "Pode levar a erros de interpretação sobre a dose máxima e intervalo mínimo"}, {"id": "C", "text": "É proibida pelo COFEN"}, {"id": "D", "text": "O paciente pode se recusar a tomar"}]',
'B', 'Essas prescrições devem sempre conter a indicação clara (ex: "se dor"), a dose exata e o intervalo mínimo entre as doses para segurança.'),


-- 7. Farmacologia e Alta Vigilância (5 questões)
('Farmacologia e Alta Vigilância', 'Vunesp', 'O Cloreto de Potássio (KCl) 19,1% é um medicamento de alta vigilância porque:',
'[{"id": "A", "text": "Causa sonolência"}, {"id": "B", "text": "Sua administração rápida em bolus pode causar parada cardíaca em diástole"}, {"id": "C", "text": "É um antibiótico potente"}, {"id": "D", "text": "Aumenta muito a pressão arterial"}]',
'B', 'O K+ em bolus causa despolarização sustentada e assistolia. Deve ser sempre diluído e infundido lentamente.'),

('Farmacologia e Alta Vigilância', 'AOCP', 'A Insulina é considerada um medicamento de alta vigilância. O principal risco associado ao seu uso incorreto é:',
'[{"id": "A", "text": "Hiperglicemia leve"}, {"id": "B", "text": "Hipoglicemia grave, que pode levar a coma e morte"}, {"id": "C", "text": "Reação alérgica local"}, {"id": "D", "text": "Aumento do apetite"}]',
'B', 'A hipoglicemia é uma emergência médica. Erros de dose (ex: U-100 vs seringa errada) ou troca de tipo de insulina são causas comuns.'),

('Farmacologia e Alta Vigilância', 'FCC', 'O Sulfato de Magnésio é utilizado na pré-eclâmpsia. Seu antídoto específico, que deve estar disponível em caso de toxicidade (depressão respiratória), é:',
'[{"id": "A", "text": "Naloxona"}, {"id": "B", "text": "Flumazenil"}, {"id": "C", "text": "Gluconato de Cálcio"}, {"id": "D", "text": "Protamin"}]',
'C', 'O Gluconato de Cálcio reverte os efeitos do magnésio na junção neuromuscular e no coração.'),

('Farmacologia e Alta Vigilância', 'IBFC', 'A administração intratecal (espinhal) de Vincristina (quimioterápico) é um erro fatal conhecido. A Vincristina deve ser administrada EXCLUSIVAMENTE por via:',
'[{"id": "A", "text": "Intramuscular"}, {"id": "B", "text": "Intravenosa"}, {"id": "C", "text": "Subcutânea"}, {"id": "D", "text": "Oral"}]',
'B', 'A injeção intratecal de vincristina causa neurotoxicidade ascendente fatal. É um dos erros mais graves e evitáveis da oncologia.'),

('Farmacologia e Alta Vigilância', 'Cebraspe', 'Ao administrar anticoagulantes como a Heparina, o enfermeiro deve monitorar sinais de sangramento e qual exame laboratorial específico para ajuste de dose da Heparina Não Fracionada?',
'[{"id": "A", "text": "INR (RNI)"}, {"id": "B", "text": "TTPa (Tempo de Tromboplastina Parcial ativado)"}, {"id": "C", "text": "Plaquetas"}, {"id": "D", "text": "Hemograma completo"}]',
'B', 'A Heparina Não Fracionada é monitorada pelo TTPa (alvo geralmente 1.5-2.5x o controle). O INR é para Varfarina. Plaquetas são para enoxaparina/risco de TIH.')

ON CONFLICT (question) DO NOTHING;