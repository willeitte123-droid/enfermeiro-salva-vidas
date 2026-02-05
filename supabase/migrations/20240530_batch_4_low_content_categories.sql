INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation)
VALUES
-- Nutrição Clínica (Reforço)
('Nutrição Clínica', 'Vunesp', 'Qual é o método padrão-ouro (mais seguro) para confirmar o posicionamento da sonda nasoenteral (SNE) antes de iniciar a administração da dieta?',
'[{"id": "A", "text": "Ausculta de ruídos na região epigástrica"}, {"id": "B", "text": "Teste de pH do aspirado gástrico"}, {"id": "C", "text": "Raio-X de abdome"}, {"id": "D", "text": "Mergulhar a ponta da sonda em copo com água"}]',
'C', 'Embora o teste de pH ajude, o Raio-X é o único método que visualiza o trajeto e a posição pós-pilórica com segurança absoluta.'),

('Nutrição Clínica', 'EBSERH', 'A Nutrição Parenteral Total (NPT) é uma solução complexa e hiperosmolar. Por segurança, qual é a via de administração recomendada para NPT de longa duração?',
'[{"id": "A", "text": "Sonda Nasogástrica"}, {"id": "B", "text": "Veia Periférica de grosso calibre"}, {"id": "C", "text": "Veia Central (ex: Subclávia ou Jugular)"}, {"id": "D", "text": "Gastrostomia"}]',
'C', 'Devido à alta osmolaridade, a NPT pode causar flebite grave e trombose em veias periféricas. O acesso venoso central é mandatório para NPT plena.'),

('Nutrição Clínica', 'AOCP', 'Ao administrar dieta enteral em bolus (seringada), qual cuidado de enfermagem é essencial para prevenir a broncoaspiração?',
'[{"id": "A", "text": "Manter a cabeceira elevada (30-45º) durante e após a administração"}, {"id": "B", "text": "Administrar a dieta o mais rápido possível"}, {"id": "C", "text": "Colocar o paciente em decúbito lateral esquerdo"}, {"id": "D", "text": "Aquecer a dieta a 40 graus"}]',
'A', 'A elevação da cabeceira (Posição de Fowler) evita o refluxo gastroesofágico e a consequente aspiração para os pulmões.'),

-- Cuidados Paliativos (Reforço)
('Cuidados Paliativos', 'IBFC', 'A Hipodermóclise é uma via alternativa importante em cuidados paliativos para hidratação e analgesia. Ela consiste na administração de fluidos na via:',
'[{"id": "A", "text": "Intradérmica"}, {"id": "B", "text": "Intramuscular"}, {"id": "C", "text": "Subcutânea"}, {"id": "D", "text": "Intraóssea"}]',
'C', 'Hipodermóclise é a infusão de fluidos no tecido subcutâneo (hipoderme), sendo uma via segura, pouco dolorosa e eficaz para pacientes sem acesso venoso.'),

('Cuidados Paliativos', 'FGV', 'Segundo a OMS, Cuidados Paliativos são uma abordagem que promove a qualidade de vida de pacientes e familiares diante de doenças que ameaçam a vida. O foco principal é:',
'[{"id": "A", "text": "Acelerar o processo de morte (Eutanásia)"}, {"id": "B", "text": "Adiar a morte a qualquer custo (Distanásia)"}, {"id": "C", "text": "Alívio do sofrimento, controle da dor e sintomas"}, {"id": "D", "text": "Apenas a cura da doença de base"}]',
'C', 'O foco é a ortotanásia (morte no tempo certo, com dignidade) e o controle impecável de sintomas físicos, psíquicos e espirituais.'),

('Cuidados Paliativos', 'FCC', 'A respiração ruidosa típica da fase final de vida, causada pelo acúmulo de secreções na orofaringe que o paciente não consegue expelir, é chamada de:',
'[{"id": "A", "text": "Respiração de Kussmaul"}, {"id": "B", "text": "Ronco da morte (Estertor da morte)"}, {"id": "C", "text": "Respiração de Cheyne-Stokes"}, {"id": "D", "text": "Estridor laríngeo"}]',
'B', 'O estertor da morte ocorre por fraqueza muscular e acúmulo de secreção. O tratamento visa conforto (reposicionamento, anticolinérgicos como escopolamina) e não aspiração profunda.'),

-- Hemoterapia (Reforço)
('Hemoterapia', 'Cebraspe', 'Durante uma transfusão sanguínea, o paciente refere dor lombar súbita, calafrios e apresenta febre e hematúria. A conduta imediata do enfermeiro deve ser:',
'[{"id": "A", "text": "Acelerar a infusão para terminar logo"}, {"id": "B", "text": "Administrar antitérmico e continuar observando"}, {"id": "C", "text": "Interromper a transfusão imediatamente e manter o acesso com soro fisiológico"}, {"id": "D", "text": "Colocar o paciente sentado e ofertar oxigênio apenas"}]',
'C', 'Estes são sinais de Reação Hemolítica Aguda (incompatibilidade ABO). A transfusão deve ser parada imediatamente para evitar insuficiência renal e choque.'),

('Hemoterapia', 'Vunesp', 'O tempo máximo recomendado para a infusão de uma bolsa de Concentrado de Hemácias, a fim de evitar proliferação bacteriana e perda de função, é de:',
'[{"id": "A", "text": "1 hora"}, {"id": "B", "text": "2 horas"}, {"id": "C", "text": "4 horas"}, {"id": "D", "text": "6 horas"}]',
'C', 'Por segurança biológica, hemocomponentes não devem permanecer em temperatura ambiente sendo infundidos por mais de 4 horas.'),

('Hemoterapia', 'AOCP', 'Qual o único fluido intravenoso compatível para ser administrado concomitantemente (no mesmo acesso ou equipo em Y) com componentes sanguíneos?',
'[{"id": "A", "text": "Soro Glicosado 5%"}, {"id": "B", "text": "Ringer Lactato"}, {"id": "C", "text": "Soro Fisiológico 0,9%"}, {"id": "D", "text": "Água Destilada"}]',
'C', 'O Soro Glicosado causa hemólise e o Ringer Lactato contém cálcio que pode quelar o citrato (anticoagulante da bolsa) e causar coágulos. Apenas SF 0,9% é seguro.'),

-- Curativos e Tratamento de Feridas (Reforço)
('Curativos e Tratamento de Feridas', 'IDECAN', 'Uma lesão por pressão que apresenta perda total da espessura da pele, com exposição de osso, tendão ou músculo, é classificada como:',
'[{"id": "A", "text": "Estágio 1"}, {"id": "B", "text": "Estágio 2"}, {"id": "C", "text": "Estágio 3"}, {"id": "D", "text": "Estágio 4"}]',
'D', 'O Estágio 4 envolve dano profundo com exposição de estruturas de suporte (osso/músculo).'),

('Curativos e Tratamento de Feridas', 'Consulplan', 'Qual a indicação principal para o uso de cobertura de Alginato de Cálcio em feridas?',
'[{"id": "A", "text": "Feridas secas e com necrose"}, {"id": "B", "text": "Feridas superficiais e epitelizando"}, {"id": "C", "text": "Feridas altamente exsudativas e/ou com sangramento"}, {"id": "D", "text": "Prevenção de feridas em pele íntegra"}]',
'C', 'O alginato é altamente absorvente e possui propriedades hemostáticas, sendo ideal para feridas muito úmidas ou sangrantes.'),

('Curativos e Tratamento de Feridas', 'Vunesp', 'O desbridamento que utiliza enzimas exógenas (como colagenase ou papaína) para degradar o tecido necrótico é classificado como:',
'[{"id": "A", "text": "Autolítico"}, {"id": "B", "text": "Mecânico"}, {"id": "C", "text": "Enzimático (Químico)"}, {"id": "D", "text": "Instrumental (Cirúrgico)"}]',
'C', 'O desbridamento enzimático usa produtos químicos tópicos. O autolítico usa a própria umidade do corpo (ex: hidrogel).'),

('Curativos e Tratamento de Feridas', 'IBFC', 'O que significa a presença de tecido de granulação no leito da ferida?',
'[{"id": "A", "text": "Infecção grave"}, {"id": "B", "text": "Tecido desvitalizado que precisa ser removido"}, {"id": "C", "text": "Tecido viável, vermelho vivo, indicativo de cicatrização"}, {"id": "D", "text": "Necrose de coagulação"}]',
'C', 'O tecido de granulação é rico em novos vasos sanguíneos e colágeno, essencial para o preenchimento e cicatrização da ferida.'),

-- Sistematização (SAE) (Reforço)
('Sistematização (SAE)', 'Vunesp', 'A etapa do Processo de Enfermagem que consiste na interpretação dos dados coletados para determinar os problemas de saúde, reais ou potenciais, que o enfermeiro tem competência para tratar é:',
'[{"id": "A", "text": "Histórico de Enfermagem"}, {"id": "B", "text": "Diagnóstico de Enfermagem"}, {"id": "C", "text": "Planejamento"}, {"id": "D", "text": "Implementação"}]',
'B', 'O Diagnóstico de Enfermagem é o julgamento clínico sobre as respostas do indivíduo, base para a seleção das intervenções.'),

('Sistematização (SAE)', 'FCC', 'Na Taxonomia NANDA-I, um diagnóstico de "Risco" difere de um diagnóstico "com foco no problema" porque o de risco NÃO possui:',
'[{"id": "A", "text": "Título"}, {"id": "B", "text": "Definição"}, {"id": "C", "text": "Fatores de Risco"}, {"id": "D", "text": "Características Definidoras (Sinais e Sintomas)"}]',
'D', 'Diagnósticos de risco descrevem vulnerabilidades a problemas que ainda NÃO ocorreram, portanto, não possuem sinais e sintomas (características definidoras), apenas fatores de risco.'),

('Sistematização (SAE)', 'Cebraspe', 'Segundo a Resolução COFEN 358/2009, a prescrição da assistência de enfermagem é atividade privativa do:',
'[{"id": "A", "text": "Técnico de Enfermagem"}, {"id": "B", "text": "Enfermeiro"}, {"id": "C", "text": "Médico"}, {"id": "D", "text": "Chefe do setor (qualquer formação)"}]',
'B', 'Tanto o Diagnóstico quanto a Prescrição de Enfermagem são privativos do Enfermeiro.'),

('Sistematização (SAE)', 'AOCP', 'Qual classificação é utilizada para padronizar os RESULTADOS esperados na assistência de enfermagem?',
'[{"id": "A", "text": "NANDA"}, {"id": "B", "text": "NIC"}, {"id": "C", "text": "NOC"}, {"id": "D", "text": "CIPE"}]',
'C', 'NOC (Nursing Outcomes Classification) padroniza os resultados. NIC padroniza as intervenções. NANDA padroniza os diagnósticos.'),

-- Oncologia (Reforço)
('Oncologia', 'INCA', 'O principal risco agudo da quimioterapia, caracterizado pela infiltração de drogas vesicantes no tecido subcutâneo, podendo causar necrose severa, é chamado de:',
'[{"id": "A", "text": "Flebite"}, {"id": "B", "text": "Extravasamento"}, {"id": "C", "text": "Reação alérgica"}, {"id": "D", "text": "Trombose"}]',
'B', 'O extravasamento de vesicantes é uma emergência oncológica. Deve-se parar a infusão, aspirar o resíduo e aplicar medidas locais (frio ou calor dependendo da droga).'),

('Oncologia', 'Vunesp', 'A Neutropenia Febril em paciente oncológico é uma emergência médica. Ela é definida por febre associada a uma contagem de neutrófilos inferior a:',
'[{"id": "A", "text": "5000 /mm³"}, {"id": "B", "text": "2500 /mm³"}, {"id": "C", "text": "1500 /mm³"}, {"id": "D", "text": "500 /mm³ (ou expectativa de queda para <500)"}]',
'D', 'Neutrófilos < 500/mm³ deixam o paciente extremamente vulnerável a infecções bacterianas graves que progridem rapidamente para sepse.'),

('Oncologia', 'IDECAN', 'Para o rastreamento do câncer de mama no SUS, a mamografia é recomendada com qual periodicidade e faixa etária?',
'[{"id": "A", "text": "Anual, a partir dos 40 anos"}, {"id": "B", "text": "Bienal (a cada 2 anos), de 50 a 69 anos"}, {"id": "C", "text": "Anual, a partir dos 35 anos"}, {"id": "D", "text": "A cada 3 anos, de 25 a 64 anos"}]',
'B', 'Diretriz do INCA/MS: Mulheres de 50 a 69 anos, a cada dois anos. Fora dessa faixa ou periodicidade, considera-se rastreamento oportunístico ou para alto risco.'),

-- Neurologia (Reforço)
('Neurologia', 'EBSERH', 'Na avaliação de sinais meníngeos (suspeita de meningite), a flexão involuntária dos joelhos e quadril quando se flete o pescoço do paciente é conhecida como:',
'[{"id": "A", "text": "Sinal de Kerning"}, {"id": "B", "text": "Sinal de Brudzinski"}, {"id": "C", "text": "Sinal de Babinski"}, {"id": "D", "text": "Sinal de Hoffman"}]',
'B', 'Brudzinski é a flexão reflexa dos joelhos ao fletir o pescoço. Kernig é a resistência/dor ao estender o joelho com a coxa fletida.'),

('Neurologia', 'FCC', 'A trombólise com rtPA (Alteplase) no AVC Isquêmico agudo pode ser realizada, se não houver contraindicações, em até quantas horas do início dos sintomas?',
'[{"id": "A", "text": "3 horas"}, {"id": "B", "text": "4,5 horas"}, {"id": "C", "text": "6 horas"}, {"id": "D", "text": "12 horas"}]',
'B', 'A janela terapêutica padrão estendida é de até 4,5 horas. Após esse tempo, o risco de sangramento supera o benefício na maioria dos casos.'),

('Neurologia', 'Vunesp', 'Em um paciente com Trauma Cranioencefálico (TCE), a presença de hipertensão arterial, bradicardia e respiração irregular constitui a:',
'[{"id": "A", "text": "Tríade de Beck"}, {"id": "B", "text": "Tríade de Virchow"}, {"id": "C", "text": "Tríade de Cushing"}, {"id": "D", "text": "Tríade de Charcot"}]',
'C', 'A Tríade de Cushing indica hipertensão intracraniana grave e risco iminente de herniação cerebral.'),

-- Saúde Mental e Biossegurança (Reforço)
('Saúde Mental e Psiquiatria', 'FGV', 'O serviço de saúde mental substitutivo ao hospital psiquiátrico, que funciona como porta de entrada e ordenador da rede, oferecendo atendimento a pacientes com transtornos mentais graves e persistentes, é o:',
'[{"id": "A", "text": "UBS"}, {"id": "B", "text": "CAPS (Centro de Atenção Psicossocial)"}, {"id": "C", "text": "Hospital Dia"}, {"id": "D", "text": "Residência Terapêutica"}]',
'B', 'O CAPS é o dispositivo estratégico da Reforma Psiquiátrica para acolhimento, tratamento e reinserção social.'),

('Saúde Mental e Psiquiatria', 'Cebraspe', 'Em casos de agitação psicomotora onde a contenção mecânica se faz necessária como último recurso, é cuidado de enfermagem essencial:',
'[{"id": "A", "text": "Manter o paciente contido por 24h sem interrupção"}, {"id": "B", "text": "Monitorar sinais vitais e circulação das extremidades frequentemente"}, {"id": "C", "text": "Deixar o paciente sozinho no quarto para se acalmar"}, {"id": "D", "text": "Não registrar o procedimento para evitar problemas legais"}]',
'B', 'A contenção é um procedimento de risco. Requer monitoramento contínuo da circulação, respiração e nível de consciência, além de registro rigoroso.'),

('Biossegurança', 'AOCP', 'De acordo com a NR-32, a vacinação contra Tétano, Difteria e qual outra doença é obrigatória para todos os trabalhadores de saúde e deve ser fornecida gratuitamente pelo empregador?',
'[{"id": "A", "text": "Hepatite A"}, {"id": "B", "text": "Hepatite B"}, {"id": "C", "text": "Meningite"}, {"id": "D", "text": "Varicela"}]',
'B', 'A vacina contra Hepatite B é mandatória devido ao alto risco de transmissão ocupacional por pérfuro-cortantes.'),

('Biossegurança', 'IBFC', 'O descarte de agulhas, lâminas de bisturi e ampolas de vidro deve ser feito em recipiente de parede rígida identificado com o símbolo de:',
'[{"id": "A", "text": "Risco Químico"}, {"id": "B", "text": "Risco Radioativo"}, {"id": "C", "text": "Reciclável"}, {"id": "D", "text": "Risco Biológico / Infectante"}]',
'D', 'Pérfuro-cortantes (Grupo E) devem ser descartados em caixas rígidas (tipo Descarpack) identificadas com o símbolo de risco biológico.')
ON CONFLICT (question) DO NOTHING;