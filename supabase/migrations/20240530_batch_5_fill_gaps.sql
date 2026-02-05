INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation)
VALUES

-- ÉTICA (Foco: Sigilo, Imperícia, Negligência)
('Ética', 'Vunesp', 'Um enfermeiro administra uma medicação por via endovenosa, quando a prescrição médica indicava via intramuscular, causando flebite no paciente. Esse ato caracteriza:',
'[{"id": "A", "text": "Negligência"}, {"id": "B", "text": "Imprudência"}, {"id": "C", "text": "Imperícia"}, {"id": "D", "text": "Dolo"}]',
'B', 'Imprudência é agir sem a cautela necessária, de forma precipitada (fazer sem conferir a via correta). Imperícia seria falta de conhecimento técnico. Negligência seria omissão (deixar de fazer).'),

('Ética', 'IBFC', 'Sobre o Sigilo Profissional, previsto no Código de Ética de Enfermagem, é correto afirmar que o profissional:',
'[{"id": "A", "text": "Nunca pode revelar segredos, mesmo com autorização do paciente"}, {"id": "B", "text": "Pode revelar fato sigiloso em casos de dever legal, ordem judicial ou consentimento escrito"}, {"id": "C", "text": "Pode revelar informações para familiares, independentemente da vontade do paciente capaz"}, {"id": "D", "text": "Deve manter sigilo apenas se o paciente solicitar expressamente"}]',
'B', 'O sigilo pode ser quebrado em situações específicas: dever legal (ex: notificação compulsória), ordem judicial, risco de vida, defesa própria ou consentimento do paciente.'),

('Ética', 'Consulplan', 'Deixar de verificar os sinais vitais de um paciente instável, resultando em agravamento não detectado do quadro, configura:',
'[{"id": "A", "text": "Negligência"}, {"id": "B", "text": "Imprudência"}, {"id": "C", "text": "Imperícia"}, {"id": "D", "text": "Infração administrativa apenas"}]',
'A', 'Negligência é a omissão, o "deixar de fazer" o que deveria ser feito (desleixo, descuido).'),

-- SAE E SISTEMATIZAÇÃO
('Sistematização (SAE)', 'FGV', 'A etapa do Processo de Enfermagem que envolve a determinação dos resultados que se espera alcançar (NOC) e das ações ou intervenções (NIC) é chamada de:',
'[{"id": "A", "text": "Diagnóstico de Enfermagem"}, {"id": "B", "text": "Planejamento de Enfermagem"}, {"id": "C", "text": "Implementação"}, {"id": "D", "text": "Evolução"}]',
'B', 'O Planejamento é a fase onde se estabelecem as metas (resultados) e se prescrevem as condutas (intervenções) para atingi-las.'),

('Sistematização (SAE)', 'FCC', 'Segundo a NANDA-I, um "Diagnóstico de Promoção da Saúde" é aquele que:',
'[{"id": "A", "text": "Descreve respostas humanas a condições de saúde que existem em um indivíduo"}, {"id": "B", "text": "Descreve a vulnerabilidade para desenvolver uma resposta indesejável"}, {"id": "C", "text": "Julga a motivação e o desejo de aumentar o bem-estar e alcançar o potencial humano de saúde"}, {"id": "D", "text": "Descreve um conjunto de diagnósticos que ocorrem juntos"}]',
'C', 'Diagnósticos de Promoção da Saúde (ex: Disposição para amamentação melhorada) focam na vontade de melhorar, não exigindo que haja uma doença atual.'),

('Sistematização (SAE)', 'AOCP', 'A implementação da Sistematização da Assistência de Enfermagem (SAE) deve ocorrer:',
'[{"id": "A", "text": "Apenas em hospitais públicos"}, {"id": "B", "text": "Apenas em unidades de terapia intensiva"}, {"id": "C", "text": "Em toda instituição de saúde, pública ou privada"}, {"id": "D", "text": "Apenas quando houver enfermeiros especialistas"}]',
'C', 'A Resolução COFEN 358/2009 torna a SAE obrigatória em todos os ambientes, públicos ou privados, onde ocorre o cuidado profissional de enfermagem.'),

('Sistematização (SAE)', 'Cebraspe', 'Na estrutura do diagnóstico de enfermagem da NANDA, o componente "Características Definidoras" refere-se a:',
'[{"id": "A", "text": "Fatores causais ou etiológicos"}, {"id": "B", "text": "Sinais e sintomas observáveis"}, {"id": "C", "text": "Fatores de risco ambientais"}, {"id": "D", "text": "O título do diagnóstico"}]',
'B', 'Características Definidoras são as evidências clínicas (sinais e sintomas) que confirmam a presença do diagnóstico real.'),

-- VIGILÂNCIA (Sanitária/Epidemiológica/Saúde)
('Vigilância Sanitária', 'Vunesp', 'Compete à Vigilância Sanitária (VISA) ações capazes de eliminar, diminuir ou prevenir riscos à saúde e intervir nos problemas sanitários decorrentes:',
'[{"id": "A", "text": "Apenas da produção de medicamentos"}, {"id": "B", "text": "Do meio ambiente, da produção e circulação de bens e da prestação de serviços de interesse da saúde"}, {"id": "C", "text": "Exclusivamente de portos, aeroportos e fronteiras"}, {"id": "D", "text": "Da vacinação da população"}]',
'B', 'A VISA tem um escopo amplo que inclui alimentos, medicamentos, cosméticos, serviços de saúde, saneamento e ambiente, visando a proteção da saúde coletiva.'),

('Vigilância Epidemiológica', 'IBFC', 'A ocorrência de casos de uma doença em número acima do esperado para uma determinada área e período de tempo caracteriza um(a):',
'[{"id": "A", "text": "Endemia"}, {"id": "B", "text": "Epidemia (ou Surto)"}, {"id": "C", "text": "Pandemia"}, {"id": "D", "text": "Prevalência"}]',
'B', 'Epidemia é o aumento acima do limiar esperado (diagrama de controle). Surto é uma epidemia restrita (localizada). Endemia é a presença constante dentro do esperado.'),

('Vigilância Epidemiológica', 'FGV', 'Para o cálculo do Coeficiente de Mortalidade Infantil, utiliza-se no denominador:',
'[{"id": "A", "text": "População total"}, {"id": "B", "text": "Número de mulheres em idade fértil"}, {"id": "C", "text": "Número de óbitos totais"}, {"id": "D", "text": "Número de nascidos vivos no mesmo período"}]',
'D', 'Mortalidade Infantil = (Óbitos < 1 ano / Nascidos Vivos) x 1.000. É um indicador sensível de qualidade de vida e saúde.'),

('Vigilância em Saúde', 'AOCP', 'A investigação epidemiológica de campo tem como objetivo principal:',
'[{"id": "A", "text": "Punir os responsáveis pela transmissão"}, {"id": "B", "text": "Apenas contar o número de casos para estatística"}, {"id": "C", "text": "Identificar a fonte de infecção e modo de transmissão para interromper a cadeia e prevenir novos casos"}, {"id": "D", "text": "Solicitar verba federal"}]',
'C', 'O foco da investigação é a ação de controle: descobrir a causa para bloquear a transmissão (ex: fechar um restaurante, isolar pacientes, vacinar bloqueio).'),

('Vigilância Sanitária', 'FCC', 'O registro de produtos (como novos medicamentos) na ANVISA tem validade e deve ser renovado periodicamente. O objetivo desse registro é:',
'[{"id": "A", "text": "Aumentar a arrecadação de impostos"}, {"id": "B", "text": "Garantir a reserva de mercado para indústrias nacionais"}, {"id": "C", "text": "Avaliar e garantir a segurança, eficácia e qualidade do produto antes do consumo"}, {"id": "D", "text": "Controlar o preço dos produtos no mercado"}]',
'C', 'O registro sanitário é a comprovação de que o produto foi avaliado tecnicamente e atende aos requisitos de segurança e eficácia.'),

-- FUNDAMENTOS
('Fundamentos', 'Vunesp', 'A posição indicada para a realização de lavagem intestinal (enteroclisma) e exames retais, onde o paciente deita-se sobre o lado esquerdo com a perna direita flexionada, é chamada de:',
'[{"id": "A", "text": "Posição de Fowler"}, {"id": "B", "text": "Posição de Trendelenburg"}, {"id": "C", "text": "Posição de Sims"}, {"id": "D", "text": "Posição de Litotomia"}]',
'C', 'A posição de Sims (decúbito lateral esquerdo com flexão da perna superior) facilita a introdução da sonda retal seguindo a anatomia do sigmoide.'),

('Fundamentos', 'EBSERH', 'Na verificação do pulso apical, o estetoscópio deve ser posicionado no:',
'[{"id": "A", "text": "2º espaço intercostal, linha paraesternal direita"}, {"id": "B", "text": "5º espaço intercostal, linha hemiclavicular esquerda"}, {"id": "C", "text": "3º espaço intercostal, linha axilar anterior"}, {"id": "D", "text": "Apêndice xifoide"}]',
'B', 'O ictus cordis (ponta do coração) é melhor auscultado no 5º EIC, na linha que desce do meio da clavícula esquerda (hemiclavicular).'),

('Fundamentos', 'IBFC', 'A anotação de enfermagem deve ser realizada:',
'[{"id": "A", "text": "Ao final do plantão, resumindo tudo de uma vez"}, {"id": "B", "text": "Imediatamente após a prestação do cuidado, de forma cronológica"}, {"id": "C", "text": "Apenas se houver intercorrências graves"}, {"id": "D", "text": "A lápis, para permitir correções futuras"}]',
'B', 'A anotação deve ser pontual, cronológica e imediata para evitar esquecimentos e garantir a segurança legal. Nunca a lápis.'),

-- NUTRIÇÃO CLÍNICA
('Nutrição Clínica', 'Consulplan', 'A dieta enteral industrializada, que já vem pronta para uso em sistema fechado, apresenta menor risco de contaminação e pode permanecer instalada em temperatura ambiente por até:',
'[{"id": "A", "text": "4 a 6 horas"}, {"id": "B", "text": "12 horas"}, {"id": "C", "text": "24 horas"}, {"id": "D", "text": "48 horas"}]',
'C', 'Sistemas fechados industrializados podem ficar em bomba de infusão por até 24-48h (dependendo do fabricante, geralmente 24h na prática clínica) devido ao menor risco de manipulação.'),

('Nutrição Clínica', 'Vunesp', 'Para medir o comprimento adequado de uma sonda nasogástrica (SNG), a medição deve ser feita:',
'[{"id": "A", "text": "Da ponta do nariz ao lóbulo da orelha e deste até a cicatriz umbilical"}, {"id": "B", "text": "Da ponta do nariz ao lóbulo da orelha e deste até o apêndice xifoide"}, {"id": "C", "text": "Do lóbulo da orelha até o apêndice xifoide"}, {"id": "D", "text": "Da ponta do nariz até o umbigo direto"}]',
'B', 'A técnica correta para SNG (estômago) é Nariz -> Orelha -> Xifoide. Para Nasoenteral (intestino), acrescenta-se 10-20cm.'),

('Nutrição Clínica', 'FGV', 'Qual é a complicação metabólica grave que pode ocorrer ao se realimentar rapidamente um paciente severamente desnutrido?',
'[{"id": "A", "text": "Síndrome de Dumping"}, {"id": "B", "text": "Síndrome de Realimentação (Refeeding Syndrome)"}, {"id": "C", "text": "Hipernatremia"}, {"id": "D", "text": "Íleo paralítico"}]',
'B', 'A Síndrome de Realimentação causa distúrbios eletrolíticos fatais (hipofosfatemia, hipocalemia) devido ao pico de insulina após longo jejum.'),

-- CUIDADOS PALIATIVOS
('Cuidados Paliativos', 'IDECAN', 'A Escala de Performance Palliative (PPS) é utilizada para:',
'[{"id": "A", "text": "Avaliar a intensidade da dor"}, {"id": "B", "text": "Avaliar a capacidade funcional e prognóstico de sobrevida"}, {"id": "C", "text": "Medir o nível de consciência"}, {"id": "D", "text": "Avaliar o risco de queda"}]',
'B', 'A PPS vai de 0% a 100% e avalia a capacidade do paciente de se cuidar, alimentar e mobilizar, sendo um forte preditor de sobrevida.'),

('Cuidados Paliativos', 'FCC', 'O protocolo de comunicação de más notícias mais utilizado em saúde, composto por 6 etapas (preparação, percepção, convite, conhecimento, emoções, estratégia), é o:',
'[{"id": "A", "text": "Protocolo MANCHESTER"}, {"id": "B", "text": "Protocolo SPIKES"}, {"id": "C", "text": "Protocolo START"}, {"id": "D", "text": "Protocolo MEWS"}]',
'B', 'O protocolo SPIKES guia o profissional a dar notícias difíceis de forma empática e estruturada.'),

('Cuidados Paliativos', 'AOCP', 'Na fase final de vida, a via de administração de medicamentos preferencial, quando a via oral não é mais possível e o acesso venoso é difícil/invasivo, é a:',
'[{"id": "A", "text": "Intramuscular"}, {"id": "B", "text": "Intraóssea"}, {"id": "C", "text": "Subcutânea (Hipodermóclise)"}, {"id": "D", "text": "Retal"}]',
'C', 'A hipodermóclise é segura, confortável e eficaz para controle de sintomas (dor, dispneia) e hidratação de conforto.'),

-- HEMOTERAPIA
('Hemoterapia', 'Vunesp', 'Antes de iniciar qualquer transfusão de hemocomponentes, é obrigatória a realização da dupla checagem à beira-leito. O que deve ser conferido?',
'[{"id": "A", "text": "Apenas o nome do paciente"}, {"id": "B", "text": "Identificação do paciente, tipo sanguíneo, validade da bolsa e compatibilidade na etiqueta"}, {"id": "C", "text": "Apenas a validade da bolsa"}, {"id": "D", "text": "O nome do médico prescritor"}]',
'B', 'A segurança transfusional depende da conferência rigorosa dos dados da bolsa com os dados do paciente (pulseira) para evitar incompatibilidade ABO.'),

('Hemoterapia', 'IBFC', 'As plaquetas (concentrado de plaquetas) devem ser armazenadas em temperatura ambiente (20-24°C) e sob:',
'[{"id": "A", "text": "Refrigeração constante"}, {"id": "B", "text": "Agitação constante"}, {"id": "C", "text": "Congelamento"}, {"id": "D", "text": "Abrigo da luz apenas"}]',
'B', 'Diferente das hemácias (geladeira) e plasma (freezer), as plaquetas ficam em agitadores em temperatura ambiente para manter sua função e evitar agregação.'),

('Hemoterapia', 'Cebraspe', 'A Reação Febril Não Hemolítica é a reação transfusional mais comum. Ela é caracterizada por:',
'[{"id": "A", "text": "Febre sem hemólise, geralmente causada por anticorpos contra leucócitos do doador"}, {"id": "B", "text": "Choque anafilático e edema de glote"}, {"id": "C", "text": "Destruição maciça de hemácias com dor lombar"}, {"id": "D", "text": "Edema pulmonar agudo (TRALI)"}]',
'A', 'É uma reação benigna, tratada com antitérmicos e interrupção temporária. Ocorre pela presença de leucócitos residuais na bolsa (daí a importância da deleucocitização).'),

-- FERIDAS E CURATIVOS
('Tratamento de Feridas', 'Vunesp', 'A bota de Unna é uma terapia compressiva inelástica indicada principalmente para o tratamento de:',
'[{"id": "A", "text": "Úlceras Arteriais isquêmicas"}, {"id": "B", "text": "Úlceras Venosas"}, {"id": "C", "text": "Pé Diabético infectado"}, {"id": "D", "text": "Lesões por Pressão estágio 4"}]',
'B', 'A Bota de Unna melhora o retorno venoso e trata a hipertensão venosa, causa da úlcera. É contraindicada em úlceras arteriais (pois a compressão piora a isquemia).'),

('Curativos e Tratamento de Feridas', 'FGV', 'Qual solução é contraindicada para a limpeza de feridas com tecido de granulação, devido à sua citotoxicidade para as células novas?',
'[{"id": "A", "text": "Soro Fisiológico 0,9%"}, {"id": "B", "text": "Polihexanida (PHMB)"}, {"id": "C", "text": "Povidona-Iodo (PVPI) tópico ou degermante"}, {"id": "D", "text": "Água Destilada"}]',
'C', 'O PVPI é citotóxico para fibroblastos e retarda a cicatrização em feridas limpas/granuladas. Deve ser usado apenas em pele íntegra ou feridas muito infectadas (com critério).'),

('Curativos e Tratamento de Feridas', 'FCC', 'A cobertura de Hidrogel é indicada principalmente para:',
'[{"id": "A", "text": "Feridas altamente exsudativas"}, {"id": "B", "text": "Feridas secas ou com necrose, para promover desbridamento autolítico"}, {"id": "C", "text": "Feridas infectadas com odor fétido"}, {"id": "D", "text": "Controle de hemorragia"}]',
'B', 'O hidrogel doa umidade ao leito, amolecendo a necrose e o esfacelo, facilitando sua remoção natural.'),

-- CME e CONTROLE DE INFECÇÃO
('Controle de Infecção (CME)', 'AOCP', 'Segundo a classificação de Spaulding, artigos que entram em contato com mucosas íntegras ou pele não intacta (ex: inaladores, endoscópios) são classificados como:',
'[{"id": "A", "text": "Críticos"}, {"id": "B", "text": "Semicríticos"}, {"id": "C", "text": "Não Críticos"}, {"id": "D", "text": "Descartáveis"}]',
'B', 'Artigos semicríticos requerem, no mínimo, Desinfecção de Alto Nível. Críticos (penetram tecidos estéreis) requerem Esterilização.'),

('Controle de Infecção (CME)', 'IDECAN', 'O monitoramento do processo de esterilização em autoclave deve incluir indicadores físicos, químicos e biológicos. Qual é o indicador biológico padrão utilizado?',
'[{"id": "A", "text": "Bacillus atrophaeus"}, {"id": "B", "text": "Geobacillus stearothermophilus"}, {"id": "C", "text": "Staphylococcus aureus"}, {"id": "D", "text": "Escherichia coli"}]',
'B', 'Este microorganismo é altamente resistente ao calor úmido. Se ele morrer, garante-se que a esterilização foi eficaz.'),

('Controle de Infecção (CME)', 'Vunesp', 'A limpeza dos materiais na CME é a etapa mais crítica porque:',
'[{"id": "A", "text": "Deixa o material brilhante"}, {"id": "B", "text": "A presença de matéria orgânica impede a ação do agente esterilizante"}, {"id": "C", "text": "É a etapa mais rápida"}, {"id": "D", "text": "Não é necessária se usar glutaraldeído"}]',
'B', 'A sujeira (bioburden) protege os microrganismos. "Não há esterilização sem limpeza prévia".'),

-- FARMACOLOGIA E SEGURANÇA
('Farmacologia e Segurança do Paciente', 'EBSERH', 'A "dupla checagem" é uma estratégia de segurança recomendada principalmente para a administração de:',
'[{"id": "A", "text": "Todos os medicamentos orais"}, {"id": "B", "text": "Medicamentos de Alta Vigilância (Potencialmente Perigosos)"}, {"id": "C", "text": "Vitaminas e suplementos"}, {"id": "D", "text": "Curativos simples"}]',
'B', 'Medicamentos como insulina, heparina, quimioterápicos e eletrólitos concentrados têm alto risco de causar danos graves em caso de erro, exigindo conferência por dois profissionais.'),

('Farmacologia e Segurança do Paciente', 'IBFC', 'Um paciente é alérgico a Dipirona. Essa informação deve ser registrada:',
'[{"id": "A", "text": "Apenas na evolução médica"}, {"id": "B", "text": "Apenas na prescrição"}, {"id": "C", "text": "No prontuário e em pulseira de identificação/alerta específica"}, {"id": "D", "text": "Apenas verbalmente na passagem de plantão"}]',
'C', 'A identificação de alergias deve ser visual e redundante (prontuário + pulseira colorida) para evitar administração acidental.'),

('Farmacologia e Segurança do Paciente', 'FGV', 'O conceito de "Farmacovigilância" refere-se a:',
'[{"id": "A", "text": "Vigilância de preços de remédios"}, {"id": "B", "text": "Identificação, avaliação e prevenção de efeitos adversos ou problemas relacionados a medicamentos"}, {"id": "C", "text": "Controle de estoque da farmácia hospitalar"}, {"id": "D", "text": "Fiscalização de drogarias pela polícia"}]',
'B', 'É a ciência relativa à detecção e prevenção de eventos adversos a medicamentos pós-comercialização.'),

('Legislação e Gerenciamento', 'Vunesp', 'O Enfermeiro Responsável Técnico (RT) de uma instituição tem como função principal:',
'[{"id": "A", "text": "Fazer a escala de folgas apenas"}, {"id": "B", "text": "Responder perante o Conselho Regional (COREN) por todas as atividades de enfermagem da instituição"}, {"id": "C", "text": "Realizar todos os curativos complexos"}, {"id": "D", "text": "Substituir médicos ausentes"}]',
'B', 'O RT é o elo entre o serviço e o Conselho, garantindo que a assistência de enfermagem siga os preceitos éticos e legais.'),

('Legislação e Gerenciamento', 'FCC', 'No dimensionamento de pessoal de enfermagem, o "Índice de Segurança Técnico" (IST) serve para:',
'[{"id": "A", "text": "Cobrir ausências previstas (férias, folgas) e não previstas (faltas, licenças)"}, {"id": "B", "text": "Aumentar o salário da equipe"}, {"id": "C", "text": "Medir a produtividade"}, {"id": "D", "text": "Avaliar a qualidade do serviço"}]',
'A', 'O IST (mínimo 15%) é um acréscimo ao quadro de pessoal para garantir que a assistência não seja prejudicada por ausências legais ou eventuais.')
ON CONFLICT (question) DO NOTHING;