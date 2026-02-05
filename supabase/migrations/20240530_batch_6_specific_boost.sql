INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation)
VALUES

-- 1. SAE e Processo de Enfermagem (5 questões)
('SAE e Processo de Enfermagem', 'Vunesp', 'Segundo a Resolução COFEN 358/2009, o Processo de Enfermagem deve ser realizado:',
'[{"id": "A", "text": "Apenas em hospitais de grande porte"}, {"id": "B", "text": "Apenas quando houver tempo disponível"}, {"id": "C", "text": "De modo deliberado e sistemático, em todos os ambientes, públicos ou privados, em que ocorre o cuidado profissional"}, {"id": "D", "text": "Exclusivamente em unidades de terapia intensiva"}]',
'C', 'A resolução torna obrigatória a execução do Processo de Enfermagem em qualquer local onde a enfermagem atue, não apenas em hospitais.'),

('SAE e Processo de Enfermagem', 'IBFC', 'A etapa do Processo de Enfermagem onde o enfermeiro determina as ações ou intervenções que serão realizadas face às respostas da pessoa, família ou coletividade é chamada de:',
'[{"id": "A", "text": "Histórico de Enfermagem"}, {"id": "B", "text": "Diagnóstico de Enfermagem"}, {"id": "C", "text": "Planejamento de Enfermagem"}, {"id": "D", "text": "Avaliação de Enfermagem"}]',
'C', 'No Planejamento, definem-se os resultados esperados e as intervenções necessárias para alcançá-los.'),

('SAE e Processo de Enfermagem', 'FGV', 'Qual profissional da equipe de enfermagem, segundo a legislação, participa da execução do Processo de Enfermagem, naquilo que lhe couber, sob a supervisão e orientação do Enfermeiro?',
'[{"id": "A", "text": "Apenas o Enfermeiro especialista"}, {"id": "B", "text": "O Técnico e o Auxiliar de Enfermagem"}, {"id": "C", "text": "Apenas o Técnico de Enfermagem"}, {"id": "D", "text": "O Agente Comunitário de Saúde"}]',
'B', 'Técnicos e Auxiliares participam da execução (implementação) e coleta de dados, mas a liderança e as etapas privativas (Diagnóstico/Prescrição) são do Enfermeiro.'),

('SAE e Processo de Enfermagem', 'Cebraspe', 'O Histórico de Enfermagem, primeira etapa do processo, tem por finalidade principal:',
'[{"id": "A", "text": "Estabelecer o tratamento médico"}, {"id": "B", "text": "Avaliar os resultados alcançados"}, {"id": "C", "text": "Obter informações sobre a pessoa, família ou coletividade e suas respostas em um dado momento"}, {"id": "D", "text": "Prescrever medicamentos"}]',
'C', 'É a etapa de coleta de dados (anamnese e exame físico) que subsidia o julgamento clínico.'),

('SAE e Processo de Enfermagem', 'FCC', 'As etapas do Processo de Enfermagem são:',
'[{"id": "A", "text": "Isoladas e independentes"}, {"id": "B", "text": "Inter-relacionadas, interdependentes e recorrentes"}, {"id": "C", "text": "Lineares e imutáveis"}, {"id": "D", "text": "Opcionais, dependendo da gravidade do paciente"}]',
'B', 'O processo é cíclico e dinâmico. A avaliação pode levar a um novo histórico ou diagnóstico, reiniciando o ciclo.'),


-- 2. Ética (5 questões)
('Ética', 'Vunesp', 'De acordo com o Código de Ética (Res. COFEN 564/2017), é direito do profissional de enfermagem recusar-se a executar atividades que não sejam de sua competência técnica, científica, ética e legal, exceto em:',
'[{"id": "A", "text": "Casos de urgência e emergência onde não haja outro profissional capacitado"}, {"id": "B", "text": "Nenhuma hipótese"}, {"id": "C", "text": "Quando ordenado pela chefia imediata"}, {"id": "D", "text": "Quando o paciente solicitar"}]',
'A', 'A recusa é um direito, mas em emergências, se a omissão causar dano grave e não houver outro profissional, o dever de beneficência pode prevalecer temporariamente.'),

('Ética', 'AOCP', 'A penalidade de Cassação do direito ao exercício profissional é de competência exclusiva do:',
'[{"id": "A", "text": "Conselho Regional de Enfermagem (COREN)"}, {"id": "B", "text": "Conselho Federal de Enfermagem (COFEN)"}, {"id": "C", "text": "Sindicato dos Enfermeiros"}, {"id": "D", "text": "Ministério da Saúde"}]',
'B', 'As penalidades leves (advertência, multa, censura, suspensão) são aplicadas pelo COREN. A Cassação (pena máxima) deve ser julgada/homologada pelo COFEN.'),

('Ética', 'IDECAN', 'É proibido ao profissional de enfermagem promover a Eutanásia ou participar de prática destinada a antecipar a morte do cliente. Essa conduta é classificada como infração:',
'[{"id": "A", "text": "Leve"}, {"id": "B", "text": "Média"}, {"id": "C", "text": "Grave"}, {"id": "D", "text": "Gravíssima"}]',
'D', 'Infrações que provocam a morte, deformidade permanente ou perda de função são consideradas gravíssimas.'),

('Ética', 'IBFC', 'O profissional de enfermagem deve registrar no prontuário as informações inerentes ao processo de cuidar. Tais registros devem ser:',
'[{"id": "A", "text": "Subjetivos e baseados em opiniões pessoais"}, {"id": "B", "text": "Claros, objetivos, cronológicos, legíveis, completos e sem rasuras"}, {"id": "C", "text": "Feitos a lápis para permitir correções"}, {"id": "D", "text": "Assinados apenas pelo enfermeiro chefe"}]',
'B', 'O registro é documento legal. Rasuras, uso de corretivo ou lápis invalidam o documento como prova jurídica.'),

('Ética', 'Consulplan', 'Administrar medicamentos sem conhecer a ação da droga e sem certificar-se da possibilidade de riscos é uma:',
'[{"id": "A", "text": "Atitude recomendada para agilizar o serviço"}, {"id": "B", "text": "Proibição prevista no Código de Ética"}, {"id": "C", "text": "Responsabilidade exclusiva do médico prescritor"}, {"id": "D", "text": "Prática comum sem implicações éticas"}]',
'B', 'É dever do profissional conhecer o que administra. Se tiver dúvida, deve recusar-se a administrar até esclarecer (segurança do paciente).'),


-- 3. Vigilância em Saúde (5 questões)
('Vigilância em Saúde', 'FGV', 'A notificação compulsória de doenças, agravos e eventos de saúde pública é obrigatória para:',
'[{"id": "A", "text": "Apenas médicos"}, {"id": "B", "text": "Médicos e enfermeiros apenas"}, {"id": "C", "text": "Apenas hospitais públicos"}, {"id": "D", "text": "Médicos, outros profissionais de saúde ou responsáveis pelos serviços de saúde (públicos ou privados)"}]',
'D', 'A obrigatoriedade se estende a todos os profissionais de saúde e responsáveis por estabelecimentos, inclusive escolas e creches em alguns casos.'),

('Vigilância em Saúde', 'Vunesp', 'O Sistema de Informação de Agravos de Notificação, principal ferramenta da Vigilância Epidemiológica para coleta de dados de doenças compulsórias, é conhecido pela sigla:',
'[{"id": "A", "text": "SI-PNI"}, {"id": "B", "text": "SINASC"}, {"id": "C", "text": "SINAN"}, {"id": "D", "text": "SIM"}]',
'C', 'SINAN (Agravos de Notificação). SINASC (Nascidos Vivos). SIM (Mortalidade). SI-PNI (Imunização).'),

('Vigilância em Saúde', 'FCC', 'A Vigilância em Saúde do Trabalhador tem como um de seus objetivos:',
'[{"id": "A", "text": "Apenas tratar acidentes de trabalho"}, {"id": "B", "text": "Fiscalizar o cumprimento da CLT"}, {"id": "C", "text": "Detectar, conhecer, pesquisar e analisar os fatores determinantes e condicionantes dos agravos à saúde relacionados ao trabalho"}, {"id": "D", "text": "Demitir funcionários doentes"}]',
'C', 'O foco é a intervenção nos ambientes e processos de trabalho para eliminar riscos e promover saúde.'),

('Vigilância em Saúde', 'Cebraspe', 'A notificação de casos suspeitos ou confirmados de Sarampo deve ser:',
'[{"id": "A", "text": "Semanal"}, {"id": "B", "text": "Mensal"}, {"id": "C", "text": "Imediata (até 24 horas)"}, {"id": "D", "text": "Apenas se houver óbito"}]',
'C', 'Doenças com alto potencial de disseminação e que exigem bloqueio vacinal rápido (como Sarampo, Rubéola, Poliomielite) são de notificação imediata.'),

('Vigilância em Saúde', 'AOCP', 'O conceito de Vigilância em Saúde inclui a integração de quais áreas?',
'[{"id": "A", "text": "Vigilância Epidemiológica, Sanitária, Saúde do Trabalhador e Ambiental"}, {"id": "B", "text": "Apenas Vigilância Sanitária e Epidemiológica"}, {"id": "C", "text": "Vigilância Hospitalar e Atenção Básica"}, {"id": "D", "text": "Vigilância de Medicamentos e Alimentos"}]',
'A', 'A Política Nacional de Vigilância em Saúde integra todas essas áreas para uma atuação transversal e territorial.'),


-- 4. Legislação e Gerenciamento (5 questões)
('Legislação e Gerenciamento', 'Vunesp', 'Na administração dos serviços de enfermagem, o instrumento que permite a previsão da quantidade de pessoal necessária para atender à demanda de cuidados é o:',
'[{"id": "A", "text": "Regimento Interno"}, {"id": "B", "text": "Dimensionamento de Pessoal"}, {"id": "C", "text": "Manual de Normas e Rotinas"}, {"id": "D", "text": "Procedimento Operacional Padrão (POP)"}]',
'B', 'O dimensionamento (Res. COFEN 543/2017) calcula o número de profissionais baseando-se no Sistema de Classificação de Pacientes (SCP).'),

('Legislação e Gerenciamento', 'IBFC', 'O estilo de liderança em que o líder centraliza as decisões, impõe ordens e foca apenas na tarefa, sendo indicado apenas em situações de emergência crítica, é o:',
'[{"id": "A", "text": "Democrático"}, {"id": "B", "text": "Laissez-faire"}, {"id": "C", "text": "Autocrático"}, {"id": "D", "text": "Situacional"}]',
'C', 'Na liderança autocrática, o foco é no líder e na tarefa. Embora geralmente desencorajada, pode ser necessária em situações de caos (ex: parada cardíaca) para coordenar ações rápidas.'),

('Legislação e Gerenciamento', 'FGV', 'Na gestão de materiais, a Classificação ABC é uma ferramenta utilizada para:',
'[{"id": "A", "text": "Organizar os materiais por ordem alfabética"}, {"id": "B", "text": "Controlar o estoque baseado no valor de consumo (custo x quantidade)"}, {"id": "C", "text": "Classificar materiais por tamanho"}, {"id": "D", "text": "Separar materiais estéreis de não estéreis"}]',
'B', 'A Curva ABC ajuda a focar o controle nos itens mais caros/importantes. Classe A: Poucos itens, alto valor. Classe C: Muitos itens, baixo valor.'),

('Legislação e Gerenciamento', 'Consulplan', 'A Educação Permanente em Saúde (EPS), diferentemente da Educação Continuada, propõe:',
'[{"id": "A", "text": "Cursos formais e palestras esporádicas"}, {"id": "B", "text": "Aprendizagem no trabalho, transformando a prática a partir da reflexão sobre os problemas cotidianos"}, {"id": "C", "text": "Treinamento apenas de novas tecnologias"}, {"id": "D", "text": "Ensino verticalizado do especialista para o generalista"}]',
'B', 'A EPS foca na problematização da realidade do serviço e na construção coletiva de soluções, integrando ensino e serviço.'),

('Legislação e Gerenciamento', 'FCC', 'O enfermeiro que assume a responsabilidade técnica (RT) de um serviço de enfermagem responde:',
'[{"id": "A", "text": "Apenas administrativamente perante o hospital"}, {"id": "B", "text": "Eticamente e legalmente perante o Conselho Regional de Enfermagem (COREN)"}, {"id": "C", "text": "Apenas pelos atos que ele mesmo pratica"}, {"id": "D", "text": "Apenas financeiramente"}]',
'B', 'O RT é o elo formal com o Conselho e garante que o serviço de enfermagem cumpra os requisitos legais e éticos mínimos para funcionar.'),


-- 5. Tratamento de Feridas (5 questões)
('Tratamento de Feridas', 'Vunesp', 'Em uma lesão por pressão com grande quantidade de tecido desvitalizado (esfacelo) e exsudato moderado, qual a melhor opção de desbridamento enzimático?',
'[{"id": "A", "text": "Hidrogel"}, {"id": "B", "text": "Colagenase ou Papaína"}, {"id": "C", "text": "Bisturi (sem anestesia)"}, {"id": "D", "text": "Álcool 70%"}]',
'B', 'Enzimas como colagenase e papaína degradam o colágeno desvitalizado. O Hidrogel faz desbridamento autolítico (mais lento).'),

('Tratamento de Feridas', 'EBSERH', 'A cobertura de Carvão Ativado com Prata é especialmente indicada para feridas que apresentam:',
'[{"id": "A", "text": "Tecido de granulação limpo"}, {"id": "B", "text": "Pele íntegra (prevenção)"}, {"id": "C", "text": "Infecção e odor fétido"}, {"id": "D", "text": "Necrose seca e dura"}]',
'C', 'O carvão absorve as moléculas de odor e bactérias, enquanto a prata tem ação bactericida.'),

('Tratamento de Feridas', 'AOCP', 'Uma lesão por pressão que apresenta pele intacta, mas com área localizada de coloração vermelho-escura, marrom ou púrpura, ou flictena com sangue, que não embranquece, é classificada como:',
'[{"id": "A", "text": "Estágio 1"}, {"id": "B", "text": "Estágio 2"}, {"id": "C", "text": "Lesão por Pressão Tissular Profunda (LPP-TP)"}, {"id": "D", "text": "Não Estadiável"}]',
'C', 'Essa característica indica dano grave nos tecidos moles profundos sob a pele intacta, podendo evoluir rapidamente para necrose.'),

('Tratamento de Feridas', 'IDECAN', 'Para proteger a pele perilesional (ao redor da ferida) da maceração causada pelo excesso de exsudato, deve-se utilizar:',
'[{"id": "A", "text": "Creme de barreira ou película protetora (spray)"}, {"id": "B", "text": "Gaze seca apenas"}, {"id": "C", "text": "Álcool 70%"}, {"id": "D", "text": "Fita adesiva microporosa"}]',
'A', 'Produtos de barreira (óxido de zinco, polímeros acrilatos) impedem que a umidade da ferida danifique a pele saudável adjacente.'),

('Tratamento de Feridas', 'IBFC', 'O princípio "TIME" para preparo do leito da ferida significa:',
'[{"id": "A", "text": "Tecido, Infecção, Umidade (Moisture), Bordas (Edge)"}, {"id": "B", "text": "Tempo, Irrigação, Medicação, Evolução"}, {"id": "C", "text": "Temperatura, Incisão, Movimento, Elevação"}, {"id": "D", "text": "Tratamento, Inovação, Monitoramento, Enfermagem"}]',
'A', 'TIME é o acrônimo internacional para as barreiras da cicatrização: Tissue (Tecido inviável), Infection (Infecção), Moisture (Desequilíbrio de umidade), Edge (Bordas que não avançam).'),


-- 6. Sistematização da Assistência (5 questões)
('Sistematização da Assistência', 'Vunesp', 'A Nursing Interventions Classification (NIC) é uma taxonomia utilizada na etapa de:',
'[{"id": "A", "text": "Diagnóstico de Enfermagem"}, {"id": "B", "text": "Planejamento (definição das intervenções)"}, {"id": "C", "text": "Avaliação dos resultados"}, {"id": "D", "text": "Histórico"}]',
'B', 'A NIC padroniza a linguagem das INTERVENÇÕES (o que a enfermagem faz) para tratar os diagnósticos.'),

('Sistematização da Assistência', 'FCC', 'A Nursing Outcomes Classification (NOC) é utilizada para:',
'[{"id": "A", "text": "Classificar os diagnósticos"}, {"id": "B", "text": "Padronizar os resultados esperados e avaliar a eficácia do cuidado"}, {"id": "C", "text": "Prescrever medicamentos"}, {"id": "D", "text": "Calcular o dimensionamento de pessoal"}]',
'B', 'A NOC define metas mensuráveis (indicadores) para avaliar se o paciente melhorou após as intervenções.'),

('Sistematização da Assistência', 'Cebraspe', 'A teórica brasileira Wanda de Aguiar Horta desenvolveu sua teoria de enfermagem baseada na:',
'[{"id": "A", "text": "Teoria do Autocuidado"}, {"id": "B", "text": "Teoria da Adaptação"}, {"id": "C", "text": "Teoria das Necessidades Humanas Básicas (Maslow)"}, {"id": "D", "text": "Teoria Ambientalista"}]',
'C', 'Wanda Horta adaptou a pirâmide de Maslow para a enfermagem, focando nas necessidades psicobiológicas, psicossociais e psicoespirituais.'),

('Sistematização da Assistência', 'AOCP', 'Na fase de Implementação da SAE, o foco principal é:',
'[{"id": "A", "text": "A coleta de dados do paciente"}, {"id": "B", "text": "A execução das ações de enfermagem prescritas no planejamento"}, {"id": "C", "text": "A definição do diagnóstico médico"}, {"id": "D", "text": "A alta do paciente"}]',
'B', 'Implementação é o "fazer". É colocar o plano em prática (realizar o curativo, administrar a medicação, orientar).'),

('Sistematização da Assistência', 'FGV', 'O Processo de Enfermagem (PE) diferencia-se da Assistência de Enfermagem em si, pois o PE é:',
'[{"id": "A", "text": "O instrumento metodológico (ferramenta intelectual) que orienta o cuidado"}, {"id": "B", "text": "Apenas a parte burocrática"}, {"id": "C", "text": "O conjunto de procedimentos técnicos"}, {"id": "D", "text": "Sinônimo de SAE"}]',
'A', 'A SAE é a organização do serviço, o PE é o método científico (ferramenta intelectual) usado pelo enfermeiro para tomar decisões.')

ON CONFLICT (question) DO NOTHING;