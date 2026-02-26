INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES
(
  'Legislação do SUS',
  'A Constituição Federal de 1988, em seu artigo 198, estabelece que as ações e serviços públicos de saúde integram uma rede regionalizada e hierarquizada e constituem um sistema único. São diretrizes do SUS, EXCETO:',
  '[
    {"id": "A", "text": "Descentralização, com direção única em cada esfera de governo."},
    {"id": "B", "text": "Atendimento integral, com prioridade para as atividades preventivas, sem prejuízo dos serviços assistenciais."},
    {"id": "C", "text": "Participação da comunidade."},
    {"id": "D", "text": "Centralização normativa e financeira na esfera federal."}
  ]'::jsonb,
  'D',
  'A diretriz correta é a DESCENTRALIZAÇÃO. A centralização é uma característica do sistema anterior (INAMPS). A CF/88 determina descentralização com direção única em cada esfera.',
  'VUNESP'
),
(
  'Legislação do SUS',
  'De acordo com a Lei 8.080/90, a participação da iniciativa privada no Sistema Único de Saúde (SUS) ocorre:',
  '[
    {"id": "A", "text": "Em caráter suplementar, substituindo o Estado quando este for incapaz."},
    {"id": "B", "text": "Em caráter complementar, quando as disponibilidades do SUS forem insuficientes."},
    {"id": "C", "text": "Em caráter preferencial, priorizando hospitais com fins lucrativos."},
    {"id": "D", "text": "Apenas em situações de calamidade pública ou epidemias."}
  ]'::jsonb,
  'B',
  'A iniciativa privada participa em caráter COMPLEMENTAR (não suplementar, que é plano de saúde), mediante contrato ou convênio, tendo preferência as entidades filantrópicas e sem fins lucrativos.',
  'IBFC'
),
(
  'Legislação do SUS',
  'Segundo a Lei 8.142/90, a Conferência de Saúde deve se reunir com qual periodicidade e com qual objetivo principal?',
  '[
    {"id": "A", "text": "Anualmente, para fiscalizar os gastos do gestor."},
    {"id": "B", "text": "A cada dois anos, para eleger o Secretário de Saúde."},
    {"id": "C", "text": "A cada quatro anos, para avaliar a situação de saúde e propor diretrizes para a formulação da política de saúde."},
    {"id": "D", "text": "Semestralmente, para aprovar o Plano Municipal de Saúde."}
  ]'::jsonb,
  'C',
  'As Conferências de Saúde ocorrem a cada 4 anos. Sua função é avaliar a situação e propor diretrizes (é a base para o Plano de Saúde). Quem fiscaliza e é permanente é o Conselho de Saúde.',
  'FGV'
),
(
  'Legislação do SUS',
  'O Decreto nº 7.508/2011 define Região de Saúde como espaço geográfico contínuo constituído por agrupamentos de municípios limítrofes. Para ser instituída, a Região de Saúde deve conter, no mínimo, ações e serviços de:',
  '[
    {"id": "A", "text": "Atenção primária, urgência e emergência, atenção psicossocial, atenção ambulatorial especializada e hospitalar, e vigilância em saúde."},
    {"id": "B", "text": "Atenção primária, hospitais de grande porte e centros de pesquisa clínica."},
    {"id": "C", "text": "Atenção básica e vigilância sanitária apenas."},
    {"id": "D", "text": "Urgência e emergência e atenção hospitalar, sendo a atenção primária responsabilidade exclusiva do município isolado."}
  ]'::jsonb,
  'A',
  'O Decreto exige o mínimo de 5 componentes (V.A.U.P.A.): Vigilância, Atenção Primária, Urgência, Psicossocial, Ambulatorial/Hospitalar.',
  'CEBRASPE'
),
(
  'Legislação do SUS',
  'Sobre os Princípios Doutrinários do SUS, aquele que assegura o acesso às ações e serviços de saúde a todos os cidadãos, sem qualquer tipo de barreira ou discriminação, é chamado de:',
  '[
    {"id": "A", "text": "Integralidade."},
    {"id": "B", "text": "Equidade."},
    {"id": "C", "text": "Universalidade."},
    {"id": "D", "text": "Resolubilidade."}
  ]'::jsonb,
  'C',
  'Universalidade = Saúde é direito de TODOS. Equidade = Tratar desigualmente os desiguais. Integralidade = Todas as necessidades (promoção, prevenção, cura, reabilitação).',
  'AOCP'
),
(
  'Legislação do SUS',
  'A composição dos Conselhos de Saúde deve ser paritária. Isso significa que:',
  '[
    {"id": "A", "text": "50% dos membros são gestores e 50% trabalhadores."},
    {"id": "B", "text": "50% dos membros são representantes dos usuários e 50% divididos entre os demais segmentos."},
    {"id": "C", "text": "Todos os segmentos têm o mesmo número de representantes (25% cada)."},
    {"id": "D", "text": "A maioria absoluta deve ser de profissionais de saúde."}
  ]'::jsonb,
  'B',
  'A paridade no SUS (Res. 453/12) é em relação aos usuários. 50% Usuários, 25% Trabalhadores, 25% Gestores/Prestadores.',
  'CONSULPLAN'
),
(
  'Legislação do SUS',
  'O acordo de colaboração firmado entre entes federativos com a finalidade de organizar e integrar as ações e serviços de saúde na rede regionalizada e hierarquizada é denominado:',
  '[
    {"id": "A", "text": "Contrato de Gestão."},
    {"id": "B", "text": "Termo de Ajustamento de Conduta (TAC)."},
    {"id": "C", "text": "Contrato Organizativo da Ação Pública da Saúde (COAP)."},
    {"id": "D", "text": "Plano Diretor de Regionalização (PDR)."}
  ]'::jsonb,
  'C',
  'O COAP (Contrato Organizativo da Ação Pública) é o instrumento jurídico definido no Decreto 7.508/11 para firmar as responsabilidades na Região de Saúde.',
  'VUNESP'
),
(
  'Legislação do SUS',
  'Compete à Direção Nacional do Sistema Único de Saúde (Ministério da Saúde), EXCETO:',
  '[
    {"id": "A", "text": "Definir e coordenar os sistemas de vigilância epidemiológica e sanitária."},
    {"id": "B", "text": "Executar diretamente ações de vigilância sanitária em portos, aeroportos e fronteiras."},
    {"id": "C", "text": "Gerir e executar os serviços públicos de saúde em âmbito municipal."},
    {"id": "D", "text": "Participar na formulação e na implementação das políticas de controle das agressões ao meio ambiente."}
  ]'::jsonb,
  'C',
  'A execução dos serviços públicos de saúde (atenção básica, UPAs, etc.) é competência prioritária da Direção MUNICIPAL. A União tem papel normativo e de coordenação, executando apenas em caráter supletivo ou em portos/fronteiras.',
  'FCC'
),
(
  'Legislação do SUS',
  'O conjunto de ações capaz de eliminar, diminuir ou prevenir riscos à saúde e de intervir nos problemas sanitários decorrentes do meio ambiente, da produção e circulação de bens e da prestação de serviços de interesse da saúde, define:',
  '[
    {"id": "A", "text": "Vigilância Epidemiológica."},
    {"id": "B", "text": "Vigilância Sanitária."},
    {"id": "C", "text": "Saúde do Trabalhador."},
    {"id": "D", "text": "Atenção Primária."}
  ]'::jsonb,
  'B',
  'Definição clássica de Vigilância Sanitária (Art. 6º da Lei 8.080). Foco em bens, produtos e serviços. A Epidemiológica foca em doenças, agravos e fatores determinantes.',
  'IDECAN'
),
(
  'Legislação do SUS',
  'Para que os Municípios, Estados e o Distrito Federal recebam os recursos do Fundo Nacional de Saúde de forma regular e automática, a Lei 8.142/90 exige a existência de, EXCETO:',
  '[
    {"id": "A", "text": "Fundo de Saúde."},
    {"id": "B", "text": "Conselho de Saúde."},
    {"id": "C", "text": "Plano de Carreira, Cargos e Salários (PCCS)."},
    {"id": "D", "text": "Número mínimo de habitantes superior a 50.000."}
  ]'::jsonb,
  'D',
  'Não existe exigência de número mínimo de habitantes na Lei 8.142/90. Os requisitos são: Fundo, Conselho, Plano de Saúde, Relatórios, Contrapartida e PCCS.',
  'IBFC'
),
(
  'Legislação do SUS',
  'Sobre a Comissão Intergestores Tripartite (CIT), é correto afirmar que:',
  '[
    {"id": "A", "text": "É composta por representantes da União, dos Estados e dos Municípios."},
    {"id": "B", "text": "Conta com a participação de representantes dos usuários do SUS."},
    {"id": "C", "text": "Tem caráter apenas consultivo, sem poder de pactuação."},
    {"id": "D", "text": "É vinculada ao Conselho Nacional de Justiça."}
  ]'::jsonb,
  'A',
  'A CIT é um foro de negociação e pactuação entre GESTORES (União, Estado e Município). Usuários participam dos Conselhos, não das Comissões Intergestores.',
  'FGV'
),
(
  'Legislação do SUS',
  'A Relação Nacional de Medicamentos Essenciais (RENAME) deve ser atualizada pelo Ministério da Saúde a cada:',
  '[
    {"id": "A", "text": "6 meses."},
    {"id": "B", "text": "1 ano."},
    {"id": "C", "text": "2 anos."},
    {"id": "D", "text": "4 anos."}
  ]'::jsonb,
  'C',
  'O Decreto 7.508/11 estabelece que a RENAME deve ser atualizada a cada dois anos.',
  'CEBRASPE'
),
(
  'Legislação do SUS',
  'Segundo a Constituição Federal, é VEDADA:',
  '[
    {"id": "A", "text": "A participação da iniciativa privada no SUS."},
    {"id": "B", "text": "A destinação de recursos públicos para auxílios ou subvenções às instituições privadas com fins lucrativos."},
    {"id": "C", "text": "A contratação de serviços privados por entidades filantrópicas."},
    {"id": "D", "text": "A cobrança de serviços de saúde suplementar."}
  ]'::jsonb,
  'B',
  'Art. 199, § 2º da CF/88: É vedada a destinação de recursos públicos para auxílios ou subvenções às instituições privadas com fins lucrativos.',
  'VUNESP'
),
(
  'Legislação do SUS',
  'O princípio da Equidade no SUS refere-se a:',
  '[
    {"id": "A", "text": "Oferecer o mesmo atendimento a todos, independente da necessidade."},
    {"id": "B", "text": "Garantir que todos paguem a mesma taxa de contribuição."},
    {"id": "C", "text": "Reconhecer as diferenças e oferecer mais a quem mais precisa, diminuindo desigualdades."},
    {"id": "D", "text": "Priorizar o atendimento hospitalar em detrimento da atenção básica."}
  ]'::jsonb,
  'C',
  'Equidade é tratar desigualmente os desiguais, investindo mais onde a carência é maior para reduzir as disparidades sociais e regionais.',
  'AOCP'
),
(
  'Legislação do SUS',
  'A descrição geográfica da distribuição de recursos humanos e de ações e serviços de saúde ofertados pelo SUS e pela iniciativa privada, considerando a capacidade instalada, é denominada:',
  '[
    {"id": "A", "text": "Plano de Saúde."},
    {"id": "B", "text": "Mapa da Saúde."},
    {"id": "C", "text": "Relatório de Gestão."},
    {"id": "D", "text": "Programação Pactuada Integrada (PPI)."}
  ]'::jsonb,
  'B',
  'Definição de Mapa da Saúde (Decreto 7.508). Ele serve para identificar vazios assistenciais e orientar o planejamento regional.',
  'CONSULPLAN'
),
(
  'Legislação do SUS',
  'O Subsistema de Atenção à Saúde Indígena, criado pela Lei 9.836/99, é financiado com recursos:',
  '[
    {"id": "A", "text": "Exclusivos dos Municípios onde se localizam as aldeias."},
    {"id": "B", "text": "Da União, dos Estados e dos Municípios, de forma igualitária."},
    {"id": "C", "text": "Da União (Governo Federal)."},
    {"id": "D", "text": "De ONGs internacionais."}
  ]'::jsonb,
  'C',
  'Lei 8.080, Art. 19-B: Cabe à União, com seus recursos próprios, financiar o Subsistema de Atenção à Saúde Indígena.',
  'IBFC'
),
(
  'Legislação do SUS',
  'A articulação das políticas e programas de saúde e a atuação intersetorial são competências das:',
  '[
    {"id": "A", "text": "Comissões Intersetoriais."},
    {"id": "B", "text": "Comissões Parlamentares de Inquérito."},
    {"id": "C", "text": "Diretorias Regionais de Saúde."},
    {"id": "D", "text": "Fundações Estatais."}
  ]'::jsonb,
  'A',
  'Art. 12 da Lei 8.080: As Comissões Intersetoriais têm a finalidade de articular políticas e programas de interesse para a saúde (ex: alimentação, saneamento, ciência e tecnologia).',
  'FGV'
),
(
  'Legislação do SUS',
  'Qual é a porta de entrada PREFERENCIAL do SUS, ordenadora do cuidado e coordenadora da rede?',
  '[
    {"id": "A", "text": "Atenção de Urgência e Emergência (UPA)."},
    {"id": "B", "text": "Atenção Primária à Saúde (APS/Atenção Básica)."},
    {"id": "C", "text": "Atenção Ambulatorial Especializada."},
    {"id": "D", "text": "Atenção Hospitalar."}
  ]'::jsonb,
  'B',
  'A Atenção Primária é o centro de comunicação e a porta preferencial. Embora Urgência, CAPS e Serviços Especiais também sejam portas, a APS tem a função de ordenar o cuidado.',
  'CEBRASPE'
),
(
  'Legislação do SUS',
  'Os recursos financeiros do Sistema Único de Saúde (SUS) serão depositados em conta especial, em cada esfera de sua atuação, e movimentados sob fiscalização do:',
  '[
    {"id": "A", "text": "Ministério Público."},
    {"id": "B", "text": "Poder Legislativo."},
    {"id": "C", "text": "Respectivo Conselho de Saúde."},
    {"id": "D", "text": "Tribunal de Contas da União."}
  ]'::jsonb,
  'C',
  'Lei 8.142, Art. 3º, § 2º: Os recursos serão movimentados sob a fiscalização dos respectivos Conselhos de Saúde.',
  'VUNESP'
),
(
  'Legislação do SUS',
  'O princípio da Integralidade implica em:',
  '[
    {"id": "A", "text": "Atender apenas pacientes que não possuem plano de saúde privado."},
    {"id": "B", "text": "Oferecer apenas consultas médicas, excluindo exames complexos."},
    {"id": "C", "text": "Garantir ao usuário o acesso a todos os níveis de complexidade do sistema, desde a prevenção até a reabilitação, considerando o indivíduo como um todo."},
    {"id": "D", "text": "Integrar os sistemas de saúde do Brasil com os de países vizinhos."}
  ]'::jsonb,
  'C',
  'Integralidade é ver o ser humano de forma indivisível (biopsicossocial) e garantir a continuidade do cuidado em todos os níveis de atenção (promoção, prevenção, cura e reabilitação).',
  'IBFC'
)
ON CONFLICT (question) DO NOTHING;