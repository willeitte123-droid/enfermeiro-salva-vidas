-- Inserção de 30 Questões sobre Biossegurança e Controle de Infecção
-- Aspas simples escapadas corretamente para evitar erro 42601

INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation) VALUES

-- QUESTÃO 1
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Segundo a NR-32, em relação aos materiais perfurocortantes, é estritamente VEDADO:', 
'[
  {"id": "A", "text": "O descarte em recipientes rígidos e impermeáveis."},
  {"id": "B", "text": "A desconexão manual de agulhas e o reencape."},
  {"id": "C", "text": "O uso de dispositivos de segurança."},
  {"id": "D", "text": "A vacinação contra Tétano e Hepatite B."},
  {"id": "E", "text": "O uso de luvas de procedimento durante o manuseio."}
]', 
'B', 
'A NR-32 proíbe terminantemente o reencape e a desconexão manual de agulhas, pois são as principais causas de acidentes com material biológico.'),

-- QUESTÃO 2
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Para um paciente com diagnóstico confirmado de Tuberculose Pulmonar Bacilífera, qual tipo de precaução deve ser instituída e qual EPI é obrigatório para o profissional de saúde?', 
'[
  {"id": "A", "text": "Precaução de Contato; Luvas e Avental."},
  {"id": "B", "text": "Precaução de Gotículas; Máscara Cirúrgica."},
  {"id": "C", "text": "Precaução Padrão apenas; Luvas."},
  {"id": "D", "text": "Precaução por Aerossóis; Máscara PFF2 (N95)."},
  {"id": "E", "text": "Precaução Reversa; Máscara Cirúrgica."}
]', 
'D', 
'A Tuberculose é transmitida por aerossóis (partículas < 5 micra que ficam suspensas no ar). Exige quarto privativo (pressão negativa se possível) e uso de máscara N95/PFF2 pelo profissional.'),

-- QUESTÃO 3
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'De acordo com a RDC 222/2018, que regulamenta os Resíduos de Serviços de Saúde, as agulhas, lâminas de bisturi e ampolas de vidro quebradas pertencem a qual grupo?', 
'[
  {"id": "A", "text": "Grupo A (Infectantes)."},
  {"id": "B", "text": "Grupo B (Químicos)."},
  {"id": "C", "text": "Grupo E (Perfurocortantes)."},
  {"id": "D", "text": "Grupo D (Comuns)."},
  {"id": "E", "text": "Grupo C (Radioativos)."}
]', 
'C', 
'O Grupo E engloba os materiais perfurocortantes ou escarificantes. Devem ser descartados em recipientes rígidos, estanques e identificados.'),

-- QUESTÃO 4
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'A classificação de Spaulding divide os artigos hospitalares em Críticos, Semicríticos e Não Críticos. Um endoscópio digestivo, que entra em contato com mucosa íntegra, é classificado como:', 
'[
  {"id": "A", "text": "Crítico, exigindo esterilização."},
  {"id": "B", "text": "Semicrítico, exigindo no mínimo desinfecção de alto nível."},
  {"id": "C", "text": "Não Crítico, exigindo apenas limpeza."},
  {"id": "D", "text": "Não Crítico, exigindo esterilização."},
  {"id": "E", "text": "Descartável."}
]', 
'B', 
'Artigos que entram em contato com membranas mucosas íntegras ou pele não intacta são Semicríticos e requerem desinfecção de alto nível (embora a esterilização seja preferível se o material suportar).'),

-- QUESTÃO 5
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Qual das doenças abaixo requer isolamento por PRECAUÇÃO DE GOTÍCULAS?', 
'[
  {"id": "A", "text": "Sarampo."},
  {"id": "B", "text": "Varicela (Catapora)."},
  {"id": "C", "text": "Meningite Meningocócica."},
  {"id": "D", "text": "Tuberculose."},
  {"id": "E", "text": "Escabiose."}
]', 
'C', 
'A Meningite Meningocócica é transmitida por gotículas (partículas maiores que caem a até 1 metro). Exige máscara cirúrgica para o profissional. Sarampo, Varicela e TB são Aerossóis.'),

-- QUESTÃO 6
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'A higienização das mãos é a medida mais importante para prevenção de infecções. Em qual das situações abaixo o uso de álcool em gel NÃO substitui a lavagem com água e sabonete?', 
'[
  {"id": "A", "text": "Antes de tocar o paciente."},
  {"id": "B", "text": "Após tocar o paciente."},
  {"id": "C", "text": "Quando as mãos estiverem visivelmente sujas ou contaminadas com fluidos corporais."},
  {"id": "D", "text": "Antes de realizar procedimento asséptico."},
  {"id": "E", "text": "Após contato com áreas próximas ao paciente."}
]', 
'C', 
'Se houver sujidade visível ou matéria orgânica, a lavagem com água e sabonete é obrigatória, pois o álcool perde eficácia na presença de matéria orgânica e não remove a sujeira.'),

-- QUESTÃO 7
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'O saco plástico de cor BRANCA LEITOSA é utilizado para o descarte de qual tipo de resíduo?', 
'[
  {"id": "A", "text": "Resíduos comuns (papel, copos)."},
  {"id": "B", "text": "Resíduos químicos."},
  {"id": "C", "text": "Resíduos infectantes (Grupo A)."},
  {"id": "D", "text": "Resíduos radioativos."},
  {"id": "E", "text": "Resíduos perfurocortantes."}
]', 
'C', 
'O saco branco leitoso, com o símbolo de substância infectante, é exclusivo para o Grupo A (Infectantes) que não necessitam de tratamento prévio ou após tratamento.'),

-- QUESTÃO 8
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'A NR-32 estabelece a obrigatoriedade da vacinação para profissionais de saúde. Quais vacinas são citadas explicitamente como obrigatórias no programa de imunização fornecido pelo empregador?', 
'[
  {"id": "A", "text": "Febre Amarela e Dengue."},
  {"id": "B", "text": "Tétano, Difteria e Hepatite B."},
  {"id": "C", "text": "Hepatite A e Meningite."},
  {"id": "D", "text": "HPV e Herpes Zoster."},
  {"id": "E", "text": "Pneumonia e Cólera."}
]', 
'B', 
'A NR-32 exige vacinação gratuita contra Tétano, Difteria e Hepatite B, além das demais estabelecidas no PCMSO.'),

-- QUESTÃO 9
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Em caso de acidente percutâneo com material biológico potencialmente contaminado, qual é a primeira conduta a ser realizada no local da exposição?', 
'[
  {"id": "A", "text": "Espremer a ferida para sair o sangue contaminado."},
  {"id": "B", "text": "Aplicar torniquete acima da lesão."},
  {"id": "C", "text": "Lavar exaustivamente com água e sabão (pele) ou soro fisiológico (mucosas)."},
  {"id": "D", "text": "Jogar álcool puro ou hipoclorito na ferida."},
  {"id": "E", "text": "Iniciar antirretrovirais imediatamente antes de lavar."}
]', 
'C', 
'A primeira conduta é a lavagem com água e sabão. Não se deve espremer (aumenta a área de contato/trauma) nem usar soluções cáusticas (hipoclorito).'),

-- QUESTÃO 10
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Paciente com infecção por bactéria multirresistente (ex: KPC ou MRSA) deve ser mantido em qual tipo de precaução?', 
'[
  {"id": "A", "text": "Precaução Padrão apenas."},
  {"id": "B", "text": "Precaução de Contato."},
  {"id": "C", "text": "Precaução de Gotículas."},
  {"id": "D", "text": "Precaução de Aerossóis."},
  {"id": "E", "text": "Isolamento Reverso."}
]', 
'B', 
'Bactérias multirresistentes são transmitidas principalmente pelo contato direto ou indireto (fômites). Exige uso de luvas e avental/capote para entrar no quarto.'),

-- QUESTÃO 11
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Sobre o uso de adornos (anéis, pulseiras, relógios, colares) em ambiente hospitalar, a NR-32 determina:', 
'[
  {"id": "A", "text": "Permitido apenas o uso de aliança."},
  {"id": "B", "text": "Permitido se o profissional usar luvas."},
  {"id": "C", "text": "Proibido apenas em centro cirúrgico."},
  {"id": "D", "text": "Vedado o uso de adornos por todo trabalhador exposto a agentes biológicos."},
  {"id": "E", "text": "Permitido uso discreto."}
]', 
'D', 
'A NR-32 proíbe o uso de adornos para todos os trabalhadores que mantêm contato com agentes biológicos, pois eles dificultam a higienização correta das mãos e acumulam microrganismos.'),

-- QUESTÃO 12
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Qual é o nível de enchimento máximo recomendado para os recipientes de descarte de perfurocortantes (Descarpack)?', 
'[
  {"id": "A", "text": "Até a borda."},
  {"id": "B", "text": "Até transbordar."},
  {"id": "C", "text": "Até a linha pontilhada (2/3 da capacidade ou 5cm abaixo do bocal)."},
  {"id": "D", "text": "Metade da caixa."},
  {"id": "E", "text": "Não há limite, desde que feche a tampa."}
]', 
'C', 
'O limite de enchimento é a linha pontilhada (aprox. 2/3 da capacidade). Encher demais aumenta drasticamente o risco de acidentes ao tentar forçar o descarte.'),

-- QUESTÃO 13
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'A esterilização é o processo que visa:', 
'[
  {"id": "A", "text": "Reduzir a carga microbiana a níveis seguros."},
  {"id": "B", "text": "Eliminar apenas bactérias vegetativas."},
  {"id": "C", "text": "Destruir todas as formas de vida microbiana, incluindo os esporos."},
  {"id": "D", "text": "Limpar o material visivelmente sujo."},
  {"id": "E", "text": "Remover a matéria orgânica."}
]', 
'C', 
'A definição de esterilização é a destruição total de qualquer forma de vida microbiana, sendo os esporos bacterianos (formas de resistência) o parâmetro de eficácia.'),

-- QUESTÃO 14
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'O álcool a 70% é considerado um:', 
'[
  {"id": "A", "text": "Esterilizante químico."},
  {"id": "B", "text": "Desinfetante de nível intermediário."},
  {"id": "C", "text": "Detergente enzimático."},
  {"id": "D", "text": "Desinfetante de alto nível."},
  {"id": "E", "text": "Sabão degermante."}
]', 
'B', 
'O álcool 70% é um desinfetante de nível intermediário. Ele mata bactérias vegetativas, fungos e vírus (incluindo HIV, Influenza), mas NÃO destrói esporos bacterianos.'),

-- QUESTÃO 15
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Um paciente com Herpes Zoster Disseminado requer quais tipos de precaução simultaneamente?', 
'[
  {"id": "A", "text": "Padrão e Gotículas."},
  {"id": "B", "text": "Contato e Gotículas."},
  {"id": "C", "text": "Aerossóis e Contato."},
  {"id": "D", "text": "Apenas Contato."},
  {"id": "E", "text": "Apenas Padrão."}
]', 
'C', 
'O Herpes Zoster disseminado (ou em imunossuprimidos) transmite-se tanto por contato direto com as lesões quanto pela via inalatória (vírus Varicela-Zoster). Exige N95 e avental/luvas.'),

-- QUESTÃO 16
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'O uso de sapatos abertos (sandálias, chinelos) no ambiente hospitalar assistencial é:', 
'[
  {"id": "A", "text": "Permitido em dias quentes."},
  {"id": "B", "text": "Permitido para conforto da equipe."},
  {"id": "C", "text": "Vedado pela NR-32."},
  {"id": "D", "text": "Permitido apenas para visitantes."},
  {"id": "E", "text": "Critério da chefia de enfermagem."}
]', 
'C', 
'A NR-32 veda o uso de calçados abertos. O calçado deve ser fechado, protegendo contra respingos, queda de materiais perfurocortantes e fluidos biológicos.'),

-- QUESTÃO 17
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Sobre a limpeza de superfícies com matéria orgânica (ex: sangue no chão), a conduta correta é:', 
'[
  {"id": "A", "text": "Jogar álcool 70% imediatamente sobre o sangue."},
  {"id": "B", "text": "Varrer o local."},
  {"id": "C", "text": "Remover o excesso de matéria orgânica com papel toalha/pano, limpar com água e sabão e depois desinfetar."},
  {"id": "D", "text": "Esperar secar para limpar."},
  {"id": "E", "text": "Usar hipoclorito puro sobre a mancha de sangue sem remover o excesso."}
]', 
'C', 
'Primeiro remove-se a matéria orgânica (que inativa desinfetantes), depois limpa-se e por fim desinfeta-se. Jogar desinfetante direto sobre matéria orgânica é ineficaz (fixa a sujeira ou é inativado).'),

-- QUESTÃO 18
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'A autoclave utiliza qual método físico para esterilização?', 
'[
  {"id": "A", "text": "Calor seco."},
  {"id": "B", "text": "Radiação gama."},
  {"id": "C", "text": "Vapor saturado sob pressão (Calor úmido)."},
  {"id": "D", "text": "Óxido de etileno."},
  {"id": "E", "text": "Plasma de peróxido de hidrogênio."}
]', 
'C', 
'A autoclave funciona através de vapor saturado sob pressão (calor úmido), que é o método mais seguro e econômico para materiais termorresistentes.'),

-- QUESTÃO 19
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Qual indicador é considerado o padrão-ouro para garantir a eficácia do processo de esterilização na autoclave, devendo ser feito rotineiramente?', 
'[
  {"id": "A", "text": "Fita zebrada (Indicador externo)."},
  {"id": "B", "text": "Indicador Químico Classe 1."},
  {"id": "C", "text": "Indicador Biológico (Geobacillus stearothermophilus)."},
  {"id": "D", "text": "Teste de Bowie-Dick."},
  {"id": "E", "text": "Leitura do manômetro."}
]', 
'C', 
'O indicador biológico contém esporos viáveis. Se após o ciclo e incubação eles não crescerem, confirma-se que a esterilização ocorreu. É o único que prova a morte microbiana.'),

-- QUESTÃO 20
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Resíduos do Grupo B (Químicos) incluem:', 
'[
  {"id": "A", "text": "Fraldas e absorventes."},
  {"id": "B", "text": "Peças anatômicas."},
  {"id": "C", "text": "Agulhas e bisturis."},
  {"id": "D", "text": "Reveladores de Raio-X, medicamentos vencidos e reagentes de laboratório."},
  {"id": "E", "text": "Rejeitos radioativos."}
]', 
'D', 
'O Grupo B refere-se a substâncias químicas que podem apresentar risco à saúde pública ou ao meio ambiente.'),

-- QUESTÃO 21
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Ao transportar um paciente em isolamento por GOTÍCULAS (ex: Influenza) para um exame fora da unidade, quem deve usar a máscara cirúrgica?', 
'[
  {"id": "A", "text": "Apenas o profissional que empurra a cadeira."},
  {"id": "B", "text": "O paciente."},
  {"id": "C", "text": "Ninguém, pois o corredor é ventilado."},
  {"id": "D", "text": "O paciente deve usar N95."},
  {"id": "E", "text": "Todos que estiverem no corredor."}
]', 
'B', 
'Para conter a fonte de infecção, coloca-se a máscara cirúrgica NO PACIENTE durante o transporte. O profissional usa apenas se estiver prestando cuidado direto próximo ao paciente.'),

-- QUESTÃO 22
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'A Profilaxia Pós-Exposição (PEP) ao HIV, quando indicada após acidente ocupacional, deve ser iniciada idealmente:', 
'[
  {"id": "A", "text": "Em até 2 horas, não ultrapassando 72 horas."},
  {"id": "B", "text": "Após 7 dias."},
  {"id": "C", "text": "Apenas se o paciente fonte confirmar que tem HIV."},
  {"id": "D", "text": "Imediatamente, via endovenosa."},
  {"id": "E", "text": "Após o resultado do teste do funcionário, mesmo que demore uma semana."}
]', 
'A', 
'A PEP é uma urgência médica. A eficácia é maior nas primeiras 2h. Após 72h, não é mais recomendada pois o vírus já se disseminou/integrou.'),

-- QUESTÃO 23
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Qual destes procedimentos é considerado CRÍTICO (invasivo) e exige técnica estéril rigorosa?', 
'[
  {"id": "A", "text": "Aferição de pressão arterial."},
  {"id": "B", "text": "Banho no leito."},
  {"id": "C", "text": "Sondagem Vesical de Demora."},
  {"id": "D", "text": "Administração de medicação oral."},
  {"id": "E", "text": "Instalação de nebulização."}
]', 
'C', 
'A SVD invade um órgão estéril (bexiga) através de um trajeto estéril. A introdução de microrganismos causa ITU (Infecção do Trato Urinário), a infecção hospitalar mais comum.'),

-- QUESTÃO 24
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Na paramentação (colocação) de EPIs para atender um paciente em isolamento de contato e gotículas, qual a ordem correta?', 
'[
  {"id": "A", "text": "Luvas -> Máscara -> Óculos -> Avental."},
  {"id": "B", "text": "Avental -> Máscara -> Óculos -> Luvas."},
  {"id": "C", "text": "Luvas primeiro sempre."},
  {"id": "D", "text": "Máscara -> Luvas -> Avental."},
  {"id": "E", "text": "Não existe ordem definida."}
]', 
'B', 
'Ordem recomendada pela ANVISA/CDC: 1. Avental (corpo), 2. Máscara (face), 3. Óculos/Face shield (olhos), 4. Luvas (por último, cobrindo o punho do avental). A retirada é o inverso (exceto máscara que sai por último fora do quarto).'),

-- QUESTÃO 25
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Qual das seguintes situações NÃO exige o uso de luvas de procedimento?', 
'[
  {"id": "A", "text": "Punção venosa."},
  {"id": "B", "text": "Troca de fraldas com fezes."},
  {"id": "C", "text": "Aferição de sinais vitais em paciente com pele íntegra sem isolamento."},
  {"id": "D", "text": "Curativo de ferida aberta."},
  {"id": "E", "text": "Manipulação de secreção traqueal."}
]', 
'C', 
'O uso indiscriminado de luvas (ex: para verificar PA ou tocar pele íntegra) é desperdício e aumenta o risco de contaminação cruzada se a higiene das mãos for negligenciada. Luvas são para risco de contato com sangue/fluidos ou precaução de contato.'),

-- QUESTÃO 26
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'O teste de Bowie-Dick, utilizado diariamente na autoclave pré-vácuo, serve para:', 
'[
  {"id": "A", "text": "Testar a eficácia bactericida."},
  {"id": "B", "text": "Verificar a qualidade da água."},
  {"id": "C", "text": "Avaliar a eficácia da remoção de ar e penetração do vapor."},
  {"id": "D", "text": "Medir a temperatura máxima."},
  {"id": "E", "text": "Testar a vedação da porta."}
]', 
'C', 
'O teste de Bowie-Dick detecta bolsas de ar residual no interior da câmara, que impediriam a penetração do vapor e a esterilização correta das cargas porosas.'),

-- QUESTÃO 27
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'A clorexidina degermante é utilizada para:', 
'[
  {"id": "A", "text": "Limpeza de chão e paredes."},
  {"id": "B", "text": "Antissepsia das mãos (higienização) e preparo da pele do paciente (banho/campo operatório)."},
  {"id": "C", "text": "Esterilização de instrumentos cirúrgicos."},
  {"id": "D", "text": "Limpeza de materiais antes da autoclave."},
  {"id": "E", "text": "Curativo de feridas abertas (uso exclusivo)."}
]', 
'B', 
'A clorexidina degermante (com sabão) serve para degermação da pele (redução da flora transitória e residente) e lavagem das mãos da equipe cirúrgica.'),

-- QUESTÃO 28
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'O que caracteriza a "Infecção Cruzada"?', 
'[
  {"id": "A", "text": "Infecção causada pela própria flora do paciente."},
  {"id": "B", "text": "Infecção transmitida de um paciente para outro (geralmente através das mãos da equipe ou equipamentos)."},
  {"id": "C", "text": "Infecção adquirida na comunidade."},
  {"id": "D", "text": "Infecção transmitida por vetor (mosquito)."},
  {"id": "E", "text": "Infecção crônica que reativa."}
]', 
'B', 
'Infecção cruzada ocorre quando microrganismos são transferidos de uma fonte (paciente A) para um hospedeiro (paciente B), sendo as mãos dos profissionais o principal veículo.'),

-- QUESTÃO 29
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'Em caso de derramamento de mercúrio (termômetro quebrado), a conduta correta é:', 
'[
  {"id": "A", "text": "Aspirar com aspirador de pó."},
  {"id": "B", "text": "Varrer vigorosamente."},
  {"id": "C", "text": "Recolher cuidadosamente com papel/seringa, colocar em recipiente com água, vedar e descartar como resíduo químico (B)."},
  {"id": "D", "text": "Jogar no lixo comum."},
  {"id": "E", "text": "Jogar na pia."}
]', 
'C', 
'O mercúrio é tóxico e vaporiza à temperatura ambiente. Não se deve usar aspirador (vaporiza mais). Deve ser recolhido com cuidado e tratado como resíduo químico perigoso.'),

-- QUESTÃO 30
('Biossegurança e Controle de Infecção', 'Enfermagem Pro', 'A "Precaução Empírica" deve ser adotada quando:', 
'[
  {"id": "A", "text": "O paciente tem diagnóstico confirmado."},
  {"id": "B", "text": "O paciente chega com sinais clínicos suspeitos de doença transmissível (ex: tosse, febre, exantema) antes da confirmação laboratorial."},
  {"id": "C", "text": "Apenas após sair o resultado da cultura."},
  {"id": "D", "text": "O paciente solicita."},
  {"id": "E", "text": "Nunca deve ser adotada."}
]', 
'B', 
'A precaução deve ser instituída com base na suspeita clínica (sindrômica) para evitar a transmissão enquanto se aguarda a confirmação. Ex: Suspeita de Meningite = Gotículas imediato.');