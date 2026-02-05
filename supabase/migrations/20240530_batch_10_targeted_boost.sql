INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation)
VALUES

-- 1. VIGILÂNCIA EPIDEMIOLÓGICA (5 Questões)
('Saúde Pública', 'IBFC', 'Para fins de notificação compulsória, a comunicação de uma doença, agravo ou evento de saúde pública à autoridade de saúde, realizada por profissionais de saúde ou responsáveis pelos estabelecimentos de saúde, mesmo na ausência de casos suspeitos ou confirmados na semana epidemiológica, é denominada:',
'[{"id": "A", "text": "Notificação Negativa"}, {"id": "B", "text": "Busca Ativa"}, {"id": "C", "text": "Notificação Sentinela"}, {"id": "D", "text": "Vigilância Passiva"}]',
'A', 'Estilo IBFC (Definição): A Notificação Negativa é o ato de informar semanalmente que NÃO houve ocorrência de doenças de notificação compulsória, garantindo que o sistema está alerta.'),

('Saúde Pública', 'Vunesp', 'Dentre as doenças listadas na Portaria de Consolidação nº 4/2017, qual delas exige notificação compulsória IMEDIATA (em até 24 horas) às secretarias municipal e estadual de saúde devido ao seu alto potencial de disseminação ou gravidade?',
'[{"id": "A", "text": "Tuberculose"}, {"id": "B", "text": "Hanseníase"}, {"id": "C", "text": "Botulismo"}, {"id": "D", "text": "Esquistossomose"}]',
'C', 'Estilo Vunesp (Lista/Protocolo): O Botulismo é uma emergência de saúde pública grave que exige notificação imediata. TB e Hanseníase são de notificação semanal.'),

('Saúde Pública', 'Cebraspe', 'Acerca dos indicadores de saúde, julgue o item: A taxa de prevalência é o indicador mais adequado para avaliar o risco de se adquirir uma doença aguda em um curto período de tempo, como em um surto de gripe.',
'[{"id": "A", "text": "Certo"}, {"id": "B", "text": "Errado, o indicador correto seria a Incidência"}, {"id": "C", "text": "Errado, o indicador correto seria a Letalidade"}, {"id": "D", "text": "Errado, o indicador correto seria a Mortalidade"}]',
'B', 'Estilo Cebraspe (Conceito/Pegadinha): Prevalência mede o estoque total de casos (bom para crônicas). Para risco de adquirir doença nova (aguda/surto), usa-se a INCIDÊNCIA.'),

('Saúde Pública', 'FGV', 'Durante a investigação de um surto de toxinfecção alimentar em uma escola, a equipe de vigilância identificou 40 alunos que ingeriram a merenda, dos quais 10 adoeceram. A medida epidemiológica que calcula a proporção de pessoas expostas que efetivamente adoeceram é chamada de:',
'[{"id": "A", "text": "Taxa de Mortalidade"}, {"id": "B", "text": "Taxa de Ataque"}, {"id": "C", "text": "Índice de Endemia"}, {"id": "D", "text": "Risco Atribuível"}, {"id": "E", "text": "Prevalência Pontual"}]',
'B', 'Estilo FGV (Aplicação): A Taxa de Ataque é uma forma especial de incidência usada em surtos para medir a virulência/disseminação em uma população exposta limitada.'),

('Saúde Pública', 'AOCP', 'O sistema de informação nacional responsável por coletar, transmitir e disseminar dados gerados rotineiramente pelo Sistema de Vigilância Epidemiológica das três esferas de governo, referente às doenças de notificação compulsória, é o:',
'[{"id": "A", "text": "SIH (Sistema de Informações Hospitalares)"}, {"id": "B", "text": "SIM (Sistema de Informações sobre Mortalidade)"}, {"id": "C", "text": "SINAN (Sistema de Informação de Agravos de Notificação)"}, {"id": "D", "text": "SI-PNI (Sistema de Informação do Programa Nacional de Imunizações)"}]',
'C', 'Estilo AOCP (Siglas/Sistemas): O SINAN é a base de dados oficial para doenças e agravos de notificação compulsória no Brasil.'),


-- 2. SISTEMATIZAÇÃO DA ASSISTÊNCIA - SAE (5 Questões)
('Sistematização (SAE)', 'Vunesp', 'Conforme a Resolução COFEN 358/2009, o Processo de Enfermagem deve ser realizado em todos os ambientes onde ocorre o cuidado profissional de enfermagem. As etapas desse processo são, sequencialmente:',
'[{"id": "A", "text": "Diagnóstico, Planejamento, Execução e Avaliação"}, {"id": "B", "text": "Coleta de dados, Diagnóstico, Planejamento, Implementação e Avaliação"}, {"id": "C", "text": "Histórico, Prescrição, Evolução e Anotação"}, {"id": "D", "text": "Avaliação inicial, Diagnóstico médico, Prescrição e Checagem"}]',
'B', 'Estilo Vunesp (Legislação/Sequência): A resolução define 5 etapas claras: Coleta (Histórico), Diagnóstico, Planejamento, Implementação e Avaliação.'),

('Sistematização (SAE)', 'FGV', 'M.L., 45 anos, pós-operatório de laparotomia, refere dor abdominal intensa (8/10), apresenta fácies de dor e restrição da respiração. O enfermeiro elabora o diagnóstico de enfermagem "Dor Aguda". Segundo a taxonomia da NANDA-I, a estrutura correta para este diagnóstico com foco no problema é:',
'[{"id": "A", "text": "Título + Fator de Risco"}, {"id": "B", "text": "Título + Características Definidoras apenas"}, {"id": "C", "text": "Título + Fatores Relacionados (causa) + Características Definidoras (sinais/sintomas)"}, {"id": "D", "text": "Fatores Relacionados + Título"}, {"id": "E", "text": "Apenas o Título do diagnóstico"}]',
'C', 'Estilo FGV (Raciocínio Clínico/Estrutura): Diagnósticos reais (com foco no problema) exigem Título (P) + Fatores Relacionados (E) + Características Definidoras (S).'),

('Sistematização (SAE)', 'IBFC', 'Dentre as etapas do Processo de Enfermagem, aquela que é privativa do Enfermeiro (ou seja, não pode ser realizada por Técnicos/Auxiliares), conforme a Resolução COFEN 358/2009, é:',
'[{"id": "A", "text": "Implementação da assistência"}, {"id": "B", "text": "Anotação de enfermagem"}, {"id": "C", "text": "Diagnóstico de Enfermagem"}, {"id": "D", "text": "Verificação de sinais vitais"}]',
'C', 'Estilo IBFC (Competências): O Diagnóstico de Enfermagem e a Prescrição de Enfermagem são atos privativos do Enfermeiro. A implementação pode ser compartilhada.'),

('Sistematização (SAE)', 'Cebraspe', 'Com relação à SAE e ao Processo de Enfermagem, julgue: A SAE é a ferramenta que organiza o trabalho profissional quanto ao método, pessoal e instrumentos, tornando possível a operacionalização do Processo de Enfermagem.',
'[{"id": "A", "text": "Certo"}, {"id": "B", "text": "Errado, SAE e Processo de Enfermagem são sinônimos absolutos"}, {"id": "C", "text": "Errado, a SAE é uma parte do Processo de Enfermagem"}, {"id": "D", "text": "Errado, o Processo de Enfermagem organiza a SAE"}]',
'A', 'Estilo Cebraspe (Conceito): A SAE é a organização maior (gestão, dimensionamento, instrumentos) que viabiliza a aplicação do método clínico, que é o Processo de Enfermagem.'),

('Sistematização (SAE)', 'FCC', 'Na etapa de Planejamento de Enfermagem, utiliza-se frequentemente a taxonomia NOC (Nursing Outcomes Classification). O objetivo principal desta taxonomia é:',
'[{"id": "A", "text": "Listar as intervenções que a equipe deve realizar"}, {"id": "B", "text": "Padronizar os nomes das doenças médicas"}, {"id": "C", "text": "Descrever os resultados esperados do paciente para avaliar a eficácia do cuidado"}, {"id": "D", "text": "Classificar a complexidade assistencial do paciente"}]',
'C', 'Estilo FCC (Função/Gestão): NOC define metas/resultados mensuráveis para avaliar se as intervenções (NIC) funcionaram.'),


-- 3. BIOSSEGURANÇA E CONTROLE DE INFECÇÃO (5 Questões)
('Biossegurança e Controle de Infecção', 'Vunesp', 'Ao realizar a punção venosa periférica em um paciente, houve extravasamento de sangue no chão. Segundo as normas de biossegurança, a limpeza dessa superfície com matéria orgânica visível deve ser feita seguindo a técnica de:',
'[{"id": "A", "text": "Varredura seca imediata"}, {"id": "B", "text": "Desinfecção direta com álcool 70% sobre o sangue"}, {"id": "C", "text": "Limpeza concorrente com remoção do excesso de matéria orgânica (papel toalha) seguida de limpeza e desinfecção"}, {"id": "D", "text": "Esterilização do piso"}]',
'C', 'Estilo Vunesp (Procedimento): Matéria orgânica inativa desinfetantes. Primeiro remove-se o grosso, depois limpa-se (água e sabão) e por fim desinfeta-se.'),

('Biossegurança e Controle de Infecção', 'IBFC', 'Os resíduos resultantes da atenção à saúde que contêm perfurocortantes, como agulhas, lâminas de bisturi e ampolas de vidro, devem ser descartados em recipientes rígidos, estanques e resistentes à pontura, identificados como:',
'[{"id": "A", "text": "Grupo A"}, {"id": "B", "text": "Grupo B"}, {"id": "C", "text": "Grupo D"}, {"id": "D", "text": "Grupo E"}]',
'D', 'Estilo IBFC (Classificação): Grupo E é específico para perfurocortantes. O descarte deve ser feito em caixas tipo Descarpack.'),

('Biossegurança e Controle de Infecção', 'FGV', 'Um paciente é admitido com suspeita de Sarampo. Considerando o modo de transmissão deste agente (vírus do Sarampo), a equipe de enfermagem deve instituir imediatamente precauções de:',
'[{"id": "A", "text": "Contato (Luvas e Avental)"}, {"id": "B", "text": "Gotículas (Máscara Cirúrgica)"}, {"id": "C", "text": "Aerossóis (Máscara N95/PFF2 e Quarto Privativo)"}, {"id": "D", "text": "Padrão apenas"}]',
'C', 'Estilo FGV (Caso Clínico): Sarampo, Tuberculose e Varicela são o trio clássico de transmissão por Aerossóis, exigindo N95.'),

('Biossegurança e Controle de Infecção', 'AOCP', 'O processo que consiste na destruição de todas as formas de vida microbiana, incluindo os esporos bacterianos, através de métodos físicos ou químicos, é definido como:',
'[{"id": "A", "text": "Limpeza"}, {"id": "B", "text": "Desinfecção de Alto Nível"}, {"id": "C", "text": "Sanitização"}, {"id": "D", "text": "Esterilização"}]',
'D', 'Estilo AOCP (Definição): Apenas a Esterilização garante a eliminação de esporos. Desinfecção reduz, mas não elimina esporos necessariamente.'),

('Biossegurança e Controle de Infecção', 'Cebraspe', 'Com relação à higienização das mãos, julgue: O uso de luvas de procedimento dispensa a obrigatoriedade da higienização das mãos antes e após o contato com o paciente, pois elas formam uma barreira estéril completa.',
'[{"id": "A", "text": "Certo"}, {"id": "B", "text": "Errado"}]',
'B', 'Estilo Cebraspe (Conceito): Errado. As luvas não são 100% impermeáveis e podem contaminar as mãos na retirada. Higienização é obrigatória antes de calçar e após retirar.'),


-- 4. SAÚDE DO ADULTO / CLÍNICA MÉDICA (5 Questões)
('Saúde do Adulto (Clínica Médica)', 'FGV', 'Paciente diabético tipo 1, 24 anos, chega ao PS torporoso, com respiração de Kussmaul e hálito cetônico. Glicemia capilar "HI" (>600). Gasometria: pH 7,10, HCO3 12. O diagnóstico é Cetoacidose Diabética. A conduta terapêutica prioritária inicial, antes mesmo da insulina, é:',
'[{"id": "A", "text": "Administração de Bicarbonato de Sódio"}, {"id": "B", "text": "Reposição volêmica vigorosa com cristaloide (SF 0,9%)"}, {"id": "C", "text": "Insulina Regular em bolus IV"}, {"id": "D", "text": "Administração de Glucagon"}, {"id": "E", "text": "Antibioticoterapia profilática"}]',
'B', 'Estilo FGV (Prioridade Clínica): Na CAD, o paciente está gravemente desidratado. A hidratação restaura a perfusão e ajuda a baixar a glicemia. Insulina só se inicia após garantir K+ > 3.3 e volume circulante.'),

('Saúde do Adulto (Clínica Médica)', 'Vunesp', 'Na administração de insulina subcutânea, o rodízio dos locais de aplicação é fundamental para prevenir uma complicação local comum caracterizada pelo endurecimento ou atrofia do tecido subcutâneo, chamada de:',
'[{"id": "A", "text": "Flebite química"}, {"id": "B", "text": "Lipodistrofia"}, {"id": "C", "text": "Dermatite de contato"}, {"id": "D", "text": "Celulite infecciosa"}]',
'B', 'Estilo Vunesp (Técnica): A lipodistrofia altera a absorção da insulina, tornando o controle glicêmico imprevisível.'),

('Saúde do Adulto (Clínica Médica)', 'Cebraspe', 'A Hipertensão Arterial Sistêmica (HAS) não controlada pode levar a lesões em órgãos-alvo. Os principais órgãos afetados cronicamente são:',
'[{"id": "A", "text": "Fígado, Baço e Pâncreas"}, {"id": "B", "text": "Coração, Cérebro, Rins e Vasos/Olhos"}, {"id": "C", "text": "Pulmão, Estômago e Intestino"}, {"id": "D", "text": "Tireoide, Adrenais e Hipófise"}]',
'B', 'Estilo Cebraspe (Fisiopatologia): A HAS causa IAM/ICC (coração), AVC (cérebro), DRC (rins) e Retinopatia (olhos).'),

('Saúde do Adulto (Clínica Médica)', 'IBFC', 'O tratamento da Tuberculose (esquema básico) no Brasil dura no mínimo 6 meses e é composto por duas fases. A fase intensiva (primeiros 2 meses) utiliza os seguintes fármacos (RIPE):',
'[{"id": "A", "text": "Rifampicina, Isoniazida, Pirazinamida e Etambutol"}, {"id": "B", "text": "Rifampicina, Isoniazida, Prednisona e Estreptomicina"}, {"id": "C", "text": "Rifampicina, Penicilina, Pirazinamida e Etambutol"}, {"id": "D", "text": "Rifampicina, Isoniazida, Paracetamol e Etambutol"}]',
'A', 'Estilo IBFC (Protocolo): O esquema RIPE é padrão. Nos 4 meses seguintes (manutenção), usa-se apenas Rifampicina e Isoniazida (RI).'),

('Saúde do Adulto (Clínica Médica)', 'AOCP', 'Um paciente apresenta sudorese fria, taquicardia, tremores, fome excessiva e confusão mental. Ao verificar a glicemia capilar, o valor é de 55 mg/dL. Este quadro é compatível com:',
'[{"id": "A", "text": "Cetoacidose Diabética"}, {"id": "B", "text": "Estado Hiperosmolar"}, {"id": "C", "text": "Hipoglicemia"}, {"id": "D", "text": "Hipertensão Craniana"}]',
'C', 'Estilo AOCP (Sinais e Sintomas): A tríade de Whipple para hipoglicemia inclui sintomas compatíveis, glicemia baixa e melhora após ingestão de glicose.'),


-- 5. TERAPIA INTENSIVA - UTI (5 Questões)
('Terapia Intensiva (UTI)', 'FGV', 'Paciente na UTI com diagnóstico de Choque Séptico, já recebeu 30ml/kg de cristaloide, mas mantém PA 80/40 mmHg e PAM 53 mmHg. A droga vasoativa de primeira escolha para restaurar o tônus vascular e elevar a PAM para o alvo de 65 mmHg é:',
'[{"id": "A", "text": "Dobutamina"}, {"id": "B", "text": "Noradrenalina"}, {"id": "C", "text": "Dopamina"}, {"id": "D", "text": "Adrenalina"}, {"id": "E", "text": "Vasopressina"}]',
'B', 'Estilo FGV (Manejo de Choque): Noradrenalina é vasopressor alfa-adrenérgico potente, escolha nº 1 na sepse. Dobutamina é inotrópico (para falha de bomba). Vasopressina é segunda linha.'),

('Terapia Intensiva (UTI)', 'Vunesp', 'A Pneumonia Associada à Ventilação (PAV) é uma das principais IRAS em UTI. Qual das medidas abaixo NÃO faz parte do "Bundle" de prevenção de PAV?',
'[{"id": "A", "text": "Manter decúbito elevado (30-45º)"}, {"id": "B", "text": "Higiene oral com antisséptico (Clorexidina)"}, {"id": "C", "text": "Troca programada dos circuitos do ventilador a cada 48h"}, {"id": "D", "text": "Interrupção diária da sedação (Despertar diário)"}]',
'C', 'Estilo Vunesp (Protocolo/Exceção): Não se troca circuito de ventilador por tempo (rotina), apenas se estiver sujo ou danificado, para evitar manipulação desnecessária e entrada de bactérias.'),

('Terapia Intensiva (UTI)', 'Cebraspe', 'A Escala de RASS (Richmond Agitation-Sedation Scale) é amplamente utilizada em UTI. Um paciente combativo, violento e perigoso para a equipe receberia a pontuação:',
'[{"id": "A", "text": "+4"}, {"id": "B", "text": "0"}, {"id": "C", "text": "-2"}, {"id": "D", "text": "-5"}]',
'A', 'Estilo Cebraspe (Escalas): RASS varia de +4 (Combativo) a -5 (Não despertável). O alvo de sedação leve geralmente é 0 a -2.'),

('Terapia Intensiva (UTI)', 'FCC', 'Para a correta mensuração da Pressão Venosa Central (PVC) ou da Pressão Arterial Invasiva (PAM) através de transdutor eletrônico, o "zero" de referência (eixo flebostático) deve ser posicionado no nível do:',
'[{"id": "A", "text": "Apêndice Xifoide"}, {"id": "B", "text": "Segundo espaço intercostal"}, {"id": "C", "text": "Quarto espaço intercostal, na linha axilar média"}, {"id": "D", "text": "Linha axilar posterior"}]',
'C', 'Estilo FCC (Técnica): O eixo flebostático (4º EIC, linha axilar média) corresponde anatomicamente ao átrio direito, ponto de referência para pressões intratorácicas.'),

('Terapia Intensiva (UTI)', 'IBFC', 'A Amiodarona é um antiarrítmico frequentemente usado em UTI. Para infusão contínua ou bolus, devido à instabilidade em outras soluções, ela deve ser diluída preferencialmente em:',
'[{"id": "A", "text": "Soro Fisiológico 0,9%"}, {"id": "B", "text": "Ringer Lactato"}, {"id": "C", "text": "Soro Glicosado 5%"}, {"id": "D", "text": "Água Destilada"}]',
'C', 'Estilo IBFC (Farmacologia Específica): A Amiodarona precipita e perde estabilidade em solução salina. O diluente obrigatório é Soro Glicosado 5%.')

ON CONFLICT (question) DO NOTHING;