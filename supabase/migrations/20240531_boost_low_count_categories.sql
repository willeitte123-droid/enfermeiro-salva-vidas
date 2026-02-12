-- Inserção de 30 Questões para equilibrar categorias com baixo volume
-- Foco: Saúde do Idoso, Saúde Mental, Administração, CME, Saúde do Trabalhador e Imunização

INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation) VALUES

-- SAÚDE DO IDOSO (5 Questões)
('Saúde do Idoso', 'Enfermagem Pro', 'O Estatuto do Idoso (Lei nº 10.741/2003) define como idoso a pessoa com idade igual ou superior a:', 
'[
  {"id": "A", "text": "50 anos."},
  {"id": "B", "text": "55 anos."},
  {"id": "C", "text": "60 anos."},
  {"id": "D", "text": "65 anos."},
  {"id": "E", "text": "70 anos."}
]', 
'C', 
'No Brasil, para efeitos legais, considera-se idosa a pessoa com idade igual ou superior a 60 anos.'),

('Saúde do Idoso', 'Enfermagem Pro', 'Dentre as alterações fisiológicas do envelhecimento (senescência) que aumentam o risco de quedas, podemos citar:', 
'[
  {"id": "A", "text": "Aumento da massa muscular e da densidade óssea."},
  {"id": "B", "text": "Melhora na acuidade visual e auditiva."},
  {"id": "C", "text": "Diminuição da sensibilidade proprioceptiva e hipotensão postural."},
  {"id": "D", "text": "Aumento da velocidade de condução nervosa."},
  {"id": "E", "text": "Maior flexibilidade articular."}
]', 
'C', 
'A perda da propriocepção (noção de posição no espaço), alterações de equilíbrio e a hipotensão ortostática são fatores intrínsecos comuns que predispõem a quedas em idosos.'),

('Saúde do Idoso', 'Enfermagem Pro', 'A vacina contra Influenza para a população idosa no Brasil tem como principal objetivo:', 
'[
  {"id": "A", "text": "Erradicar o vírus da gripe no país."},
  {"id": "B", "text": "Prevenir resfriados comuns causados por rinovírus."},
  {"id": "C", "text": "Reduzir as complicações, internações e a mortalidade associada à gripe."},
  {"id": "D", "text": "Impedir 100% das infecções leves."},
  {"id": "E", "text": "Substituir a vacinação contra pneumonia."}
]', 
'C', 
'A vacina não impede totalmente a infecção, mas é altamente eficaz em prevenir formas graves, pneumonia viral/bacteriana secundária e óbito nesta faixa etária.'),

('Saúde do Idoso', 'Enfermagem Pro', 'Na avaliação da capacidade funcional do idoso, as Atividades Instrumentais de Vida Diária (AIVD), segundo a Escala de Lawton, incluem:', 
'[
  {"id": "A", "text": "Banhar-se e vestir-se."},
  {"id": "B", "text": "Comer sozinho e usar o banheiro."},
  {"id": "C", "text": "Usar o telefone, fazer compras, preparar refeições e cuidar das finanças."},
  {"id": "D", "text": "Continência esfincteriana e transferência da cama para cadeira."},
  {"id": "E", "text": "Escovar os dentes e pentear o cabelo."}
]', 
'C', 
'As AIVDs são mais complexas e relacionadas à vida independente na comunidade (compras, finanças). As ABVDs (Katz) são relacionadas ao autocuidado básico (banho, vestir). Geralmente, perde-se primeiro as AIVDs.'),

('Saúde do Idoso', 'Enfermagem Pro', 'A Polifarmácia, comum em idosos, é definida pelo uso concomitante de quantos medicamentos?', 
'[
  {"id": "A", "text": "2 ou mais."},
  {"id": "B", "text": "3 ou mais."},
  {"id": "C", "text": "5 ou mais."},
  {"id": "D", "text": "8 ou mais."},
  {"id": "E", "text": "10 ou mais."}
]', 
'C', 
'Embora haja variações na literatura, o conceito mais aceito de polifarmácia é o uso rotineiro de 5 ou mais medicamentos, o que aumenta exponencialmente o risco de interações e reações adversas.'),

-- SAÚDE MENTAL (5 Questões)
('Saúde Mental', 'Enfermagem Pro', 'A Lei nº 10.216/2001, marco da Reforma Psiquiátrica Brasileira, redireciona o modelo assistencial em saúde mental, privilegiando:', 
'[
  {"id": "A", "text": "A internação em hospitais psiquiátricos de longa permanência (asilos)."},
  {"id": "B", "text": "O isolamento do paciente para proteção da sociedade."},
  {"id": "C", "text": "O tratamento em serviços de base comunitária, visando a reinserção social."},
  {"id": "D", "text": "O uso exclusivo de psicofármacos sem terapia."},
  {"id": "E", "text": "A tutela total do Estado sobre a vida civil do paciente."}
]', 
'C', 
'A lei foca na desinstitucionalização, cidadania e cuidado em liberdade, tendo os CAPS (Centros de Atenção Psicossocial) como dispositivos estratégicos.'),

('Saúde Mental', 'Enfermagem Pro', 'O Carbonato de Lítio é um estabilizador de humor muito utilizado no Transtorno Bipolar. Um sinal precoce de toxicidade por lítio que a enfermagem deve observar é:', 
'[
  {"id": "A", "text": "Hipertensão arterial severa."},
  {"id": "B", "text": "Tremor grosseiro de extremidades, náuseas, vômitos e ataxia."},
  {"id": "C", "text": "Ganho de peso rápido."},
  {"id": "D", "text": "Tosse seca persistente."},
  {"id": "E", "text": "Euforia excessiva."}
]', 
'B', 
'O lítio tem janela terapêutica estreita. Tremores finos podem ser efeito colateral comum, mas tremores grosseiros, diarreia, vômitos e falta de coordenação indicam intoxicação.'),

('Saúde Mental', 'Enfermagem Pro', 'Qual é a função primordial do CAPS III (Centro de Atenção Psicossocial) na rede de saúde mental?', 
'[
  {"id": "A", "text": "Atendimento apenas ambulatorial em horário comercial."},
  {"id": "B", "text": "Internação fechada por longos períodos."},
  {"id": "C", "text": "Serviço de atenção contínua, com funcionamento 24 horas, incluindo leitos de acolhimento noturno."},
  {"id": "D", "text": "Atendimento exclusivo a crianças e adolescentes."},
  {"id": "E", "text": "Triagem para internação em manicômios."}
]', 
'C', 
'O CAPS III funciona 24h, inclusive feriados e finais de semana, oferecendo suporte para crises e leitos de repouso/observação para evitar internações hospitalares.'),

('Saúde Mental', 'Enfermagem Pro', 'A Síndrome Neuroléptica Maligna é uma emergência rara e potencialmente fatal associada principalmente ao uso de:', 
'[
  {"id": "A", "text": "Antidepressivos ISRS (ex: Fluoxetina)."},
  {"id": "B", "text": "Benzodiazepínicos (ex: Diazepam)."},
  {"id": "C", "text": "Antipsicóticos (ex: Haloperidol)."},
  {"id": "D", "text": "Estabilizadores de humor (ex: Ácido Valproico)."},
  {"id": "E", "text": "Ansiolíticos."}
]', 
'C', 
'É uma reação idiossincrática grave aos antipsicóticos (neurolépticos), caracterizada por hipertermia, rigidez muscular severa ("cano de chumbo"), instabilidade autonômica e alteração de consciência.'),

('Saúde Mental', 'Enfermagem Pro', 'No manejo de um paciente em crise de agitação psicomotora, a primeira abordagem da equipe de enfermagem deve ser:', 
'[
  {"id": "A", "text": "Contenção mecânica imediata no leito."},
  {"id": "B", "text": "Administração forçada de medicação injetável."},
  {"id": "C", "text": "Abordagem verbal (manejo verbal), tentando acalmar e negociar."},
  {"id": "D", "text": "Chamar a segurança para imobilizar."},
  {"id": "E", "text": "Isolar o paciente em um quarto trancado."}
]', 
'C', 
'A escalada de intervenções deve sempre começar pelo menos restritivo. O manejo verbal e a escuta são prioritários. Contenção mecânica e química são últimos recursos para proteção física.'),

-- ADMINISTRAÇÃO EM ENFERMAGEM (5 Questões)
('Administração em Enfermagem', 'Enfermagem Pro', 'Segundo a Resolução COFEN nº 543/2017 sobre dimensionamento de pessoal, para pacientes de Cuidado Intensivo (UTI), são recomendadas quantas horas de enfermagem por paciente nas 24 horas?', 
'[
  {"id": "A", "text": "6 horas."},
  {"id": "B", "text": "10 horas."},
  {"id": "C", "text": "12 horas."},
  {"id": "D", "text": "18 horas."},
  {"id": "E", "text": "24 horas."}
]', 
'D', 
'Para cuidados intensivos, o parâmetro é de 18 horas de enfermagem por paciente, com uma proporção mínima de 52% de Enfermeiros.'),

('Administração em Enfermagem', 'Enfermagem Pro', 'Qual estilo de liderança caracteriza-se pela centralização das decisões no líder, com pouca ou nenhuma participação da equipe, sendo útil em situações de emergência crítica (ex: PCR)?', 
'[
  {"id": "A", "text": "Liderança Democrática."},
  {"id": "B", "text": "Liderança Laissez-faire (Liberal)."},
  {"id": "C", "text": "Liderança Autocrática."},
  {"id": "D", "text": "Liderança Coaching."},
  {"id": "E", "text": "Liderança Situacional."}
]', 
'C', 
'Na liderança autocrática, o líder determina as ações. Embora geralmente desencorajada, em situações de crise extrema onde o tempo é crucial (como uma parada cardíaca), o comando direto e centralizado pode ser necessário.'),

('Administração em Enfermagem', 'Enfermagem Pro', 'Na auditoria de enfermagem, a análise realizada no prontuário do paciente APÓS a sua alta hospitalar é classificada como:', 
'[
  {"id": "A", "text": "Auditoria Prospectiva."},
  {"id": "B", "text": "Auditoria Concorrente."},
  {"id": "C", "text": "Auditoria Retrospectiva."},
  {"id": "D", "text": "Auditoria Operacional."},
  {"id": "E", "text": "Auditoria de Campo."}
]', 
'C', 
'A auditoria retrospectiva ocorre após a alta do paciente (prontuário fechado). A concorrente ocorre durante a internação, e a prospectiva ocorre antes do procedimento (prévia).'),

('Administração em Enfermagem', 'Enfermagem Pro', 'O processo de Educação Permanente em Saúde (EPS) diferencia-se da Educação Continuada por:', 
'[
  {"id": "A", "text": "Focar apenas em cursos teóricos fora do ambiente de trabalho."},
  {"id": "B", "text": "Partir da problematização do processo de trabalho real para transformar as práticas."},
  {"id": "C", "text": "Ser direcionada apenas para médicos."},
  {"id": "D", "text": "Não ter relação com o SUS."},
  {"id": "E", "text": "Visar apenas a atualização técnica individual."}
]', 
'B', 
'A EPS propõe que o aprendizado ocorra no cotidiano do trabalho, analisando os problemas reais da equipe e buscando soluções coletivas para transformar a assistência.'),

('Administração em Enfermagem', 'Enfermagem Pro', 'Qual ferramenta de gestão da qualidade é utilizada para identificar a causa raiz de um problema, também conhecida como Diagrama de Espinha de Peixe?', 
'[
  {"id": "A", "text": "PDCA."},
  {"id": "B", "text": "Diagrama de Ishikawa."},
  {"id": "C", "text": "Gráfico de Pareto."},
  {"id": "D", "text": "5W2H."},
  {"id": "E", "text": "Fluxograma."}
]', 
'B', 
'O Diagrama de Ishikawa (Causa e Efeito ou Espinha de Peixe) ajuda a organizar o raciocínio para identificar as possíveis causas (Método, Máquina, Mão de obra, Material, Medida, Meio ambiente) de um problema.'),

-- CENTRO CIRÚRGICO E CME (5 Questões)
('Centro Cirúrgico e CME', 'Enfermagem Pro', 'De acordo com a RDC 15/2012, o monitoramento do processo de esterilização com indicadores biológicos deve ser feito com qual frequência mínima?', 
'[
  {"id": "A", "text": "Mensalmente."},
  {"id": "B", "text": "A cada carga."},
  {"id": "C", "text": "Diariamente e em toda carga que contenha implantes."},
  {"id": "D", "text": "Semanalmente."},
  {"id": "E", "text": "A cada 15 dias."}
]', 
'C', 
'A norma exige monitoramento diário da autoclave com indicador biológico, além de ser obrigatório em TODA carga que contenha materiais implantáveis (próteses, órteses).'),

('Centro Cirúrgico e CME', 'Enfermagem Pro', 'A etapa do Checklist de Cirurgia Segura realizada IMEDIATAMENTE ANTES da incisão cirúrgica, que envolve a confirmação verbal de paciente, sítio e procedimento por toda a equipe, é chamada de:', 
'[
  {"id": "A", "text": "Sign In (Entrada)."},
  {"id": "B", "text": "Sign Out (Saída)."},
  {"id": "C", "text": "Time Out (Pausa Cirúrgica)."},
  {"id": "D", "text": "Recuperação Pós-Anestésica."},
  {"id": "E", "text": "Indução."}
]', 
'C', 
'O Time Out (Pausa Cirúrgica) é a barreira final de segurança antes do início do ato cirúrgico propriamente dito (incisão), onde todos param para confirmar os dados cruciais.'),

('Centro Cirúrgico e CME', 'Enfermagem Pro', 'Na classificação de artigos hospitalares (Spaulding), uma pinça cirúrgica que penetra tecido estéril é classificada como:', 
'[
  {"id": "A", "text": "Artigo Não Crítico."},
  {"id": "B", "text": "Artigo Semicrítico."},
  {"id": "C", "text": "Artigo Crítico."},
  {"id": "D", "text": "Artigo Descartável."},
  {"id": "E", "text": "Artigo Contaminado."}
]', 
'C', 
'Artigos críticos são aqueles que penetram através da pele e mucosas em tecidos subepiteliais ou sistema vascular, exigindo esterilização.'),

('Centro Cirúrgico e CME', 'Enfermagem Pro', 'Qual posição cirúrgica é frequentemente utilizada para cirurgias ginecológicas e urológicas perineais, mas exige cuidado redobrado com a compressão de nervos e vasos nas pernas?', 
'[
  {"id": "A", "text": "Posição de Trendelenburg."},
  {"id": "B", "text": "Posição de Fowler."},
  {"id": "C", "text": "Posição Prona (Ventral)."},
  {"id": "D", "text": "Posição de Litotomia (Ginecológica)."},
  {"id": "E", "text": "Posição Supina (Dorsal)."}
]', 
'D', 
'A posição de Litotomia coloca as pernas em perneiras. O posicionamento incorreto ou prolongado pode causar lesão de nervos (ex: fibular comum) e trombose venosa.'),

('Centro Cirúrgico e CME', 'Enfermagem Pro', 'Qual é o fluxo unidirecional correto dentro de uma Central de Material e Esterilização (CME) para evitar contaminação cruzada?', 
'[
  {"id": "A", "text": "Área Limpa -> Área Suja -> Área Estéril."},
  {"id": "B", "text": "Área Estéril -> Área Limpa -> Área Suja."},
  {"id": "C", "text": "Área Suja (Expurgo) -> Área Limpa (Preparo) -> Área Estéril (Guarda/Distribuição)."},
  {"id": "D", "text": "Não há fluxo definido, as áreas podem se misturar."},
  {"id": "E", "text": "Área de Preparo -> Área de Expurgo -> Área Estéril."}
]', 
'C', 
'O fluxo deve ser sempre do mais contaminado para o mais limpo, sem retrocesso. O material chega no Expurgo (sujo), vai para o Preparo (limpo) e sai estéril.'),

-- SAÚDE DO TRABALHADOR (5 Questões)
('Saúde do Trabalhador', 'Enfermagem Pro', 'A NR-32 proíbe o reencape de agulhas. Qual é o principal risco biológico evitado com essa medida?', 
'[
  {"id": "A", "text": "Exposição a ruído."},
  {"id": "B", "text": "Acidente com material perfurocortante."},
  {"id": "C", "text": "Contaminação química."},
  {"id": "D", "text": "Ergonomia inadequada."},
  {"id": "E", "text": "Risco de incêndio."}
]', 
'B', 
'O reencape manual é uma das principais causas de acidentes percutâneos (picadas de agulha), expondo o profissional a patógenos como HIV, Hepatite B e C.'),

('Saúde do Trabalhador', 'Enfermagem Pro', 'A Perda Auditiva Induzida por Ruído (PAIR) relacionada ao trabalho tem como característica ser:', 
'[
  {"id": "A", "text": "Condutiva e reversível."},
  {"id": "B", "text": "Unilateral e aguda."},
  {"id": "C", "text": "Neurossensorial, irreversível e geralmente bilateral."},
  {"id": "D", "text": "Causada por bactérias."},
  {"id": "E", "text": "Tratável com cirurgia."}
]', 
'C', 
'A PAIR afeta as células ciliadas da cóclea (ouvido interno), causando perda neurossensorial permanente, que progride com a exposição contínua ao ruído.'),

('Saúde do Trabalhador', 'Enfermagem Pro', 'O documento que deve ser emitido pela empresa em caso de acidente de trabalho, suspeita ou confirmação de doença ocupacional, mesmo sem afastamento, é:', 
'[
  {"id": "A", "text": "Atestado Médico."},
  {"id": "B", "text": "Receita Médica."},
  {"id": "C", "text": "CAT (Comunicação de Acidente de Trabalho)."},
  {"id": "D", "text": "LTCAT."},
  {"id": "E", "text": "PPRA."}
]', 
'C', 
'A CAT deve ser emitida até o primeiro dia útil seguinte ao da ocorrência. Em caso de morte, a comunicação deve ser imediata.'),

('Saúde do Trabalhador', 'Enfermagem Pro', 'Quais são as imunizações básicas obrigatórias que o empregador deve fornecer gratuitamente aos trabalhadores de saúde, segundo a NR-32?', 
'[
  {"id": "A", "text": "Gripe e Covid apenas."},
  {"id": "B", "text": "Tétano, Difteria e Hepatite B."},
  {"id": "C", "text": "Febre Amarela e HPV."},
  {"id": "D", "text": "Meningite e Pneumonia."},
  {"id": "E", "text": "Todas as do calendário infantil."}
]', 
'B', 
'A vacina contra Hepatite B é crucial devido ao alto risco de transmissão ocupacional. A dupla adulto (dT) protege contra tétano e difteria.'),

('Saúde do Trabalhador', 'Enfermagem Pro', 'Qual a cor do saco plástico utilizado para o descarte de resíduos do Grupo A (Infectantes) que não necessitam de tratamento prévio?', 
'[
  {"id": "A", "text": "Preto."},
  {"id": "B", "text": "Vermelho."},
  {"id": "C", "text": "Branco leitoso (com símbolo de infectante)."},
  {"id": "D", "text": "Laranja."},
  {"id": "E", "text": "Azul."}
]', 
'C', 
'O saco branco leitoso é o padrão para resíduos biológicos infectantes. Saco preto é para comum. Vermelho é para anatomopatológicos ou que exigem tratamento (em alguns estados).'),

-- IMUNIZAÇÃO (5 Questões)
('Imunização', 'Enfermagem Pro', 'Qual é a temperatura recomendada para conservação de vacinas nas geladeiras das salas de vacinação (nível local)?', 
'[
  {"id": "A", "text": "Abaixo de 0°C."},
  {"id": "B", "text": "Entre +2°C e +8°C (ideal +5°C)."},
  {"id": "C", "text": "Entre +8°C e +15°C."},
  {"id": "D", "text": "Temperatura ambiente (25°C)."},
  {"id": "E", "text": "Entre -15°C e -25°C."}
]', 
'B', 
'A faixa de segurança é de +2°C a +8°C. Temperaturas abaixo de +2°C congelam e inativam vacinas contendo adjuvante (ex: hepatite B, dT, penta), e acima de +8°C degradam vacinas virais.'),

('Imunização', 'Enfermagem Pro', 'A vacina BCG, indicada ao nascer para prevenir formas graves de Tuberculose, é administrada por via:', 
'[
  {"id": "A", "text": "Intramuscular."},
  {"id": "B", "text": "Subcutânea."},
  {"id": "C", "text": "Intradérmica."},
  {"id": "D", "text": "Oral."},
  {"id": "E", "text": "Endovenosa."}
]', 
'C', 
'A BCG é feita por via intradérmica na inserção inferior do músculo deltoide direito, sendo a única vacina de rotina com essa via e técnica específica.'),

('Imunização', 'Enfermagem Pro', 'No Calendário Nacional de Vacinação, a vacina Pentavalente protege contra quais doenças?', 
'[
  {"id": "A", "text": "Sarampo, Caxumba, Rubéola, Varicela e Febre Amarela."},
  {"id": "B", "text": "Difteria, Tétano, Coqueluche, Hepatite B e Haemophilus influenzae tipo b."},
  {"id": "C", "text": "Pólio, Rotavírus, Pneumonia, Meningite e Hepatite A."},
  {"id": "D", "text": "Difteria, Tétano, Coqueluche, Pólio e Sarampo."},
  {"id": "E", "text": "Covid-19, Influenza, H1N1, H3N2 e VSR."}
]', 
'B', 
'A Pentavalente combina a DTP (células inteiras) + Hepatite B + Hib. É administrada aos 2, 4 e 6 meses.'),

('Imunização', 'Enfermagem Pro', 'Gestantes devem receber qual vacina a partir da 20ª semana de gestação para proteger o recém-nascido contra coqueluche (pertussis)?', 
'[
  {"id": "A", "text": "BCG."},
  {"id": "B", "text": "dT (Dupla adulto)."},
  {"id": "C", "text": "dTpa (Tríplice bacteriana acelular do tipo adulto)."},
  {"id": "D", "text": "VOP."},
  {"id": "E", "text": "Hepatite A."}
]', 
'C', 
'A dTpa induz anticorpos maternos que passam pela placenta, protegendo o bebê nos primeiros meses de vida contra a coqueluche, que pode ser fatal em neonatos.'),

('Imunização', 'Enfermagem Pro', 'Qual destas vacinas é composta por vírus VIVO atenuado e é contraindicada para gestantes e imunossuprimidos graves?', 
'[
  {"id": "A", "text": "Influenza (Gripe)."},
  {"id": "B", "text": "Hepatite B."},
  {"id": "C", "text": "Tríplice Viral (Sarampo, Caxumba, Rubéola)."},
  {"id": "D", "text": "dT (Tétano)."},
  {"id": "E", "text": "VIP (Pólio Inativada)."}
]', 
'C', 
'Vacinas de vírus vivos (Tríplice Viral, Febre Amarela, Varicela, VOP) têm risco teórico de causar doença no feto ou em pessoas com sistema imune comprometido.');