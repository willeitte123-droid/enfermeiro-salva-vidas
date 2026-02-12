-- PACOTE DE REFORÇO 6: CATEGORIAS ESPECÍFICAS (Baixa contagem)
-- Foco: Centro Cirúrgico/CME, Saúde Mental, Saúde do Trabalhador e Ética
-- Proteção: ON CONFLICT DO NOTHING

INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES

  -- 1. CENTRO CIRÚRGICO E CME (Área Crítica)
  (
    'Centro Cirúrgico e CME',
    'Segundo a RDC nº 15/2012, o Centro de Material e Esterilização (CME) que realiza o processamento de produtos para a saúde não críticos, semicríticos e críticos de conformação complexa é classificado como:',
    '[
      {"id": "A", "text": "CME Classe I."},
      {"id": "B", "text": "CME Classe II."},
      {"id": "C", "text": "CME Tipo A."},
      {"id": "D", "text": "CME de Alta Complexidade."}
    ]'::jsonb,
    'B',
    'CME Classe II é aquele que processa produtos de conformação complexa (ex: canulados, lúmens estreitos). O Classe I processa apenas não complexos.',
    'ANVISA'
  ),
  (
    'Centro Cirúrgico e CME',
    'O indicador biológico utilizado para monitorar ciclos de esterilização a vapor (autoclave) contém esporos de qual microrganismo?',
    '[
      {"id": "A", "text": "Bacillus atrophaeus."},
      {"id": "B", "text": "Geobacillus stearothermophilus."},
      {"id": "C", "text": "Staphylococcus aureus."},
      {"id": "D", "text": "Pseudomonas aeruginosa."}
    ]'::jsonb,
    'B',
    'O Geobacillus stearothermophilus é altamente resistente ao calor úmido, sendo o padrão-ouro para testar a eficácia da autoclave. O B. atrophaeus é usado para calor seco (estufa).',
    'SOBECC'
  ),
  (
    'Centro Cirúrgico e CME',
    'A posição cirúrgica de Trendelenburg (cabeça mais baixa que o corpo) é frequentemente utilizada em cirurgias pélvicas, mas apresenta risco aumentado de:',
    '[
      {"id": "A", "text": "Hipotensão severa."},
      {"id": "B", "text": "Diminuição do retorno venoso."},
      {"id": "C", "text": "Edema cerebral e comprometimento da expansibilidade pulmonar."},
      {"id": "D", "text": "Lesão do nervo fibular."}
    ]'::jsonb,
    'C',
    'O peso das vísceras abdominais sobre o diafragma dificulta a respiração, e a gravidade favorece o acúmulo de líquido/sangue na região cefálica.',
    'SOBECC'
  ),
  (
    'Centro Cirúrgico e CME',
    'Na classificação das cirurgias quanto ao potencial de contaminação, uma cirurgia de Cólon (Intestino Grosso) sem perfuração prévia e com preparo adequado é considerada:',
    '[
      {"id": "A", "text": "Limpa."},
      {"id": "B", "text": "Potencialmente Contaminada."},
      {"id": "C", "text": "Contaminada."},
      {"id": "D", "text": "Infectada."}
    ]'::jsonb,
    'B',
    'Cirurgias com penetração controlada nos tratos digestório, respiratório ou geniturinário, sem contaminação significativa, são Potencialmente Contaminadas.',
    'MS/ANVISA'
  ),
  (
    'Centro Cirúrgico e CME',
    'O teste químico utilizado diariamente na primeira carga da autoclave pré-vácuo para avaliar a eficácia da remoção de ar e penetração do vapor é o:',
    '[
      {"id": "A", "text": "Teste de Bowie-Dick."},
      {"id": "B", "text": "Indicador Classe 5 (Integrador)."},
      {"id": "C", "text": "Indicador Classe 1 (Fita Zebrada)."},
      {"id": "D", "text": "Teste de Fenolftaleína."}
    ]'::jsonb,
    'A',
    'O pacote Bowie-Dick detecta a presença de ar residual na câmara, o que impediria a esterilização correta de cargas porosas.',
    'RDC 15'
  ),
  (
    'Centro Cirúrgico e CME',
    'A anestesia raquidiana (raquianestesia) é realizada pela injeção de anestésico no espaço:',
    '[
      {"id": "A", "text": "Epidural (Peridural)."},
      {"id": "B", "text": "Subaracnoideo (Líquor)."},
      {"id": "C", "text": "Subdural."},
      {"id": "D", "text": "Intravenoso regional."}
    ]'::jsonb,
    'B',
    'A raqui é injetada diretamente no LCR (líquor), no espaço subaracnoideo, promovendo bloqueio rápido e intenso.',
    'Anestesiologia'
  ),

  -- 2. SAÚDE MENTAL (Área Crítica)
  (
    'Saúde Mental',
    'De acordo com a Portaria nº 3.088/2011 (RAPS), o Centro de Atenção Psicossocial que funciona 24 horas por dia, oferecendo acolhimento noturno e observação, é o:',
    '[
      {"id": "A", "text": "CAPS I."},
      {"id": "B", "text": "CAPS II."},
      {"id": "C", "text": "CAPS III."},
      {"id": "D", "text": "CAPS i (Infantil)."}
    ]'::jsonb,
    'C',
    'Apenas o CAPS III (e o CAPS AD III) possui funcionamento 24h com leitos de retaguarda para crise, evitando internações hospitalares.',
    'Ministério da Saúde'
  ),
  (
    'Saúde Mental',
    'O Lítio é um estabilizador de humor amplamente usado no Transtorno Bipolar. Um sinal precoce de intoxicação por Lítio que o enfermeiro deve observar é:',
    '[
      {"id": "A", "text": "Hipertensão severa."},
      {"id": "B", "text": "Tremores grosseiros de extremidades, náuseas e diarreia."},
      {"id": "C", "text": "Ganho de peso rápido."},
      {"id": "D", "text": "Boca seca e constipação."}
    ]'::jsonb,
    'B',
    'Tremores finos são efeitos colaterais comuns, mas tremores grosseiros associados a sintomas gastrointestinais indicam litemia tóxica (> 1.5 mEq/L).',
    'Farmacologia'
  ),
  (
    'Saúde Mental',
    'A Síndrome Neuroléptica Maligna é uma emergência rara e fatal associada ao uso de antipsicóticos. Seus sinais cardinais incluem:',
    '[
      {"id": "A", "text": "Hipotermia e flacidez muscular."},
      {"id": "B", "text": "Hipertermia, rigidez muscular severa e instabilidade autonômica."},
      {"id": "C", "text": "Alucinações visuais e euforia."},
      {"id": "D", "text": "Poliúria e polidipsia."}
    ]'::jsonb,
    'B',
    'A rigidez "em cano de chumbo" e a febre alta inexplicada em paciente usando antipsicóticos (ex: Haldol) sugerem SNM. Exige suspensão imediata da droga.',
    'Psiquiatria'
  ),
  (
    'Saúde Mental',
    'Os Serviços Residenciais Terapêuticos (SRT) são dispositivos estratégicos da Reforma Psiquiátrica destinados a:',
    '[
      {"id": "A", "text": "Pacientes em crise aguda que precisam de isolamento."},
      {"id": "B", "text": "Pessoas com transtorno mental egressas de hospitais psiquiátricos (longa permanência) sem suporte social."},
      {"id": "C", "text": "Dependentes químicos para desintoxicação."},
      {"id": "D", "text": "Adolescentes com problemas escolares."}
    ]'::jsonb,
    'B',
    'As Residências Terapêuticas visam a reinserção social de moradores de antigos manicômios que perderam vínculos familiares.',
    'Lei 10.216'
  ),

  -- 3. SAÚDE DO TRABALHADOR (NR-32)
  (
    'Saúde do Trabalhador',
    'Segundo a NR-32, em relação aos materiais perfurocortantes, é de responsabilidade do empregador:',
    '[
      {"id": "A", "text": "Fornecer recipientes de descarte apenas nas áreas de expurgo."},
      {"id": "B", "text": "Permitir o reencape de agulhas quando o profissional julgar seguro."},
      {"id": "C", "text": "Disponibilizar vedado dispositivo de segurança se o custo for elevado."},
      {"id": "D", "text": "Disponibilizar materiais com dispositivo de segurança (engenharia) para prevenção de acidentes."}
    ]'::jsonb,
    'D',
    'A NR-32 obriga o uso de dispositivos de segurança em perfurocortantes. O reencape é estritamente proibido.',
    'NR-32'
  ),
  (
    'Saúde do Trabalhador',
    'Para trabalhadores expostos a agentes quimioterápicos antineoplásicos, a NR-32 exige que:',
    '[
      {"id": "A", "text": "As gestantes sejam afastadas das atividades de preparo e administração."},
      {"id": "B", "text": "O preparo seja feito em capela de fluxo laminar vertical sem filtro HEPA."},
      {"id": "C", "text": "Seja utilizado avental de algodão estéril."},
      {"id": "D", "text": "O descarte seja feito no lixo comum (saco preto)."}
    ]'::jsonb,
    'A',
    'Trabalhadoras gestantes e nutrizes devem ser afastadas do manuseio de quimioterápicos devido aos riscos de teratogenicidade e toxicidade.',
    'NR-32'
  ),
  (
    'Saúde do Trabalhador',
    'A LER/DORT (Lesões por Esforços Repetitivos) é uma doença relacionada ao trabalho. Um fator de risco organizacional importante para seu desenvolvimento é:',
    '[
      {"id": "A", "text": "Pausas frequentes durante a jornada."},
      {"id": "B", "text": "Ritmo de trabalho excessivo e repetitividade de movimentos."},
      {"id": "C", "text": "Mobiliário ergonômico ajustável."},
      {"id": "D", "text": "Boa iluminação no posto de trabalho."}
    ]'::jsonb,
    'B',
    'A combinação de repetitividade, força excessiva, postura inadequada e falta de pausas (intensificação do trabalho) causa LER/DORT.',
    'Saúde Ocupacional'
  ),

  -- 4. ÉTICA E LEGISLAÇÃO (Detalhes)
  (
    'Ética e Legislação',
    'A penalidade de CASSAÇÃO do direito ao exercício profissional é de competência exclusiva do:',
    '[
      {"id": "A", "text": "Conselho Regional de Enfermagem (COREN)."},
      {"id": "B", "text": "Conselho Federal de Enfermagem (COFEN)."},
      {"id": "C", "text": "Sindicato dos Enfermeiros."},
      {"id": "D", "text": "Ministério Público."}
    ]'::jsonb,
    'B',
    'O COREN aplica Advertência, Multa, Censura e Suspensão. A Cassação (pena máxima) só pode ser executada pelo COFEN.',
    'Lei 5.905/73'
  ),
  (
    'Ética e Legislação',
    'Um enfermeiro presencia um colega realizando um procedimento de forma incorreta que causa dano ao paciente, mas decide não relatar o fato para "não prejudicar o colega". Segundo o Código de Ética, esse enfermeiro cometeu uma infração por:',
    '[
      {"id": "A", "text": "Imperícia."},
      {"id": "B", "text": "Imprudência."},
      {"id": "C", "text": "Negligência (Conivência)."},
      {"id": "D", "text": "Assédio Moral."}
    ]'::jsonb,
    'C',
    'A omissão ou conivência diante de infração ética de outrem também é passível de punição.',
    'COFEN 564/2017'
  ),
  (
    'Ética e Legislação',
    'Segundo a Lei do Exercício Profissional, a prescrição de medicamentos por enfermeiros é permitida quando:',
    '[
      {"id": "A", "text": "O médico autoriza verbalmente."},
      {"id": "B", "text": "O enfermeiro julgar necessário pela sua experiência."},
      {"id": "C", "text": "Estabelecida em programas de saúde pública e em rotina aprovada pela instituição."},
      {"id": "D", "text": "Em nenhuma hipótese é permitida."}
    ]'::jsonb,
    'C',
    'A Lei 7.498/86 garante a prescrição de medicamentos pelo enfermeiro, desde que existam protocolos institucionais ou programas de saúde pública (ex: Tuberculose, Hanseníase, Pré-natal) que a respaldem.',
    'Lei 7.498/86'
  ),

  -- 5. FARMACOLOGIA (Cálculos e Conceitos)
  (
    'Farmacologia',
    'Foi prescrito Soro Glicosado 5% 500ml para correr em 8 horas. Qual deve ser o gotejamento em gotas por minuto (macrogotas)?',
    '[
      {"id": "A", "text": "14 gts/min."},
      {"id": "B", "text": "21 gts/min."},
      {"id": "C", "text": "42 gts/min."},
      {"id": "D", "text": "60 gts/min."}
    ]'::jsonb,
    'B',
    'Fórmula: Volume / (Tempo x 3). 500 / (8 x 3) = 500 / 24 = 20,83. Arredonda para 21 gotas/min.',
    'Cálculo de Medicação'
  ),
  (
    'Farmacologia',
    'A Digoxina é um cardiotônico que exige cuidado especial antes da administração. O enfermeiro deve sempre verificar:',
    '[
      {"id": "A", "text": "A temperatura corporal."},
      {"id": "B", "text": "A frequência cardíaca (pulso apical)."},
      {"id": "C", "text": "A glicemia capilar."},
      {"id": "D", "text": "A saturação de oxigênio."}
    ]'::jsonb,
    'B',
    'A Digoxina pode causar bradicardia severa. Se FC < 60 bpm, a dose geralmente deve ser suspensa e o médico comunicado.',
    'Farmacologia'
  ),
  (
    'Farmacologia',
    'O termo "Efeito de Primeira Passagem" refere-se à:',
    '[
      {"id": "A", "text": "Rápida absorção de medicamentos sublinguais."},
      {"id": "B", "text": "Metabolização do fármaco pelo fígado antes de atingir a circulação sistêmica (via oral)."},
      {"id": "C", "text": "Excreção renal imediata da droga."},
      {"id": "D", "text": "Reação alérgica na primeira dose."}
    ]'::jsonb,
    'B',
    'Medicamentos orais passam do intestino para o fígado (veia porta), onde parte é metabolizada/inativada antes de ir para o corpo. Vias EV e Sublingual evitam isso.',
    'Farmacologia'
  ),

  -- 6. ONCOLOGIA (Área com poucas questões)
  (
    'Oncologia',
    'O exame de rastreamento para Câncer de Próstata recomendado pelo Ministério da Saúde (INCA) para a população geral assintomática é:',
    '[
      {"id": "A", "text": "PSA e Toque Retal anuais para todos acima de 40 anos."},
      {"id": "B", "text": "Ultrassom de próstata anual."},
      {"id": "C", "text": "Não há recomendação de rastreamento populacional organizado (screening)."},
      {"id": "D", "text": "Biópsia prostática a cada 5 anos."}
    ]'::jsonb,
    'C',
    'Diferente do câncer de mama/colo, o MS/INCA não recomenda rastreamento em massa (screening) para próstata, pois os riscos (falsos positivos, tratamento excessivo) podem superar os benefícios. A decisão é individualizada.',
    'INCA'
  ),
  (
    'Oncologia',
    'A neutropenia febril é uma emergência oncológica comum pós-quimioterapia. Ela é definida pela presença de febre associada a uma contagem absoluta de neutrófilos menor que:',
    '[
      {"id": "A", "text": "500 ou com previsão de queda para menos de 500 células/mm³."},
      {"id": "B", "text": "1.500 células/mm³."},
      {"id": "C", "text": "2.000 células/mm³."},
      {"id": "D", "text": "4.000 células/mm³."}
    ]'::jsonb,
    'A',
    'Neutrófilos < 500 representam risco gravíssimo de infecção fatal. Requer antibiótico IV imediato (dentro de 1 hora).',
    'Oncologia'
  ),

  -- 7. DIABETES E HIPERTENSÃO (Reforço prático)
  (
    'Saúde do Adulto',
    'Um paciente diabético em uso de Insulina NPH apresenta hiperglicemia matinal (ao acordar). Ao investigar a glicemia da madrugada (03:00h), constatou-se hipoglicemia. Esse fenômeno é conhecido como:',
    '[
      {"id": "A", "text": "Fenômeno do Alvorecer."},
      {"id": "B", "text": "Efeito Somogyi."},
      {"id": "C", "text": "Resistência Insulínica."},
      {"id": "D", "text": "Falha da bomba de infusão."}
    ]'::jsonb,
    'B',
    'Efeito Somogyi é a hiperglicemia de rebote matinal causada por uma hipoglicemia na madrugada (liberação de hormônios contrarreguladores). Conduta: reduzir a NPH da noite.',
    'SBD'
  ),
  (
    'Saúde do Adulto',
    'Para o diagnóstico correto da Hipertensão Arterial, o manguito deve ter tamanho adequado. Se utilizarmos um manguito pequeno em um braço obeso, o valor da PA será:',
    '[
      {"id": "A", "text": "Falsamente elevado (superestimado)."},
      {"id": "B", "text": "Falsamente baixo (subestimado)."},
      {"id": "C", "text": "Correto, o tamanho não interfere."},
      {"id": "D", "text": "Impossível de aferir."}
    ]'::jsonb,
    'A',
    'Manguito pequeno aperta demais para ocluir a artéria, exigindo mais pressão do aparelho, o que superestima o valor real.',
    'Diretriz HAS'
  ),

  -- 8. SAÚDE DA MULHER (Partograma)
  (
    'Saúde da Mulher e da Criança',
    'No preenchimento do partograma, a "Fase Ativa" do trabalho de parto, momento em que se deve iniciar o registro gráfico, é definida atualmente por uma dilatação cervical mínima de:',
    '[
      {"id": "A", "text": "3 cm."},
      {"id": "B", "text": "4 cm."},
      {"id": "C", "text": "5 a 6 cm."},
      {"id": "D", "text": "10 cm."}
    ]'::jsonb,
    'C',
    'As diretrizes mais recentes (OMS/MS) atualizaram o início da fase ativa para 5-6 cm de dilatação com contrações regulares, para evitar intervenções precoces (cesáreas) na fase latente.',
    'OMS/MS'
  ),

  -- 9. PEDIATRIA (Reforço)
  (
    'Saúde da Mulher e da Criança',
    'A desidratação grave em lactentes pode ser identificada clinicamente por:',
    '[
      {"id": "A", "text": "Fontanela (moleira) abaulada e choro forte."},
      {"id": "B", "text": "Olhos fundos, fontanela deprimida, sinal da prega que desaparece muito lentamente e letargia."},
      {"id": "C", "text": "Pele corada e úmida."},
      {"id": "D", "text": "Aumento da diurese."}
    ]'::jsonb,
    'B',
    'Sinais clássicos de perda de volume intracelular e extracelular. A fontanela funda é um sinal tardio e grave.',
    'SBP'
  ),

  -- 10. NEFROLOGIA/DIÁLISE
  (
    'Clínica Médica',
    'O "Thrill" ou "Frêmito" palpável em uma Fístula Arteriovenosa (FAV) para hemodiálise indica:',
    '[
      {"id": "A", "text": "Trombose da fístula (obstrução)."},
      {"id": "B", "text": "Funcionamento adequado (fluxo turbilhonar)."},
      {"id": "C", "text": "Infecção no local."},
      {"id": "D", "text": "Aneurisma."}
    ]'::jsonb,
    'B',
    'O frêmito é a vibração sentida à palpação devido ao alto fluxo de sangue passando da artéria para a veia. Sua presença confirma que a fístula está pérvia (funcionando).',
    'Nefrologia'
  ),
  (
    'Clínica Médica',
    'A principal complicação da Diálise Peritoneal, que o enfermeiro deve suspeitar se o líquido drenado estiver turvo, é:',
    '[
      {"id": "A", "text": "Hérnia abdominal."},
      {"id": "B", "text": "Hiperglicemia."},
      {"id": "C", "text": "Peritonite."},
      {"id": "D", "text": "Sangramento."}
    ]'::jsonb,
    'C',
    'Líquido turvo é sinal de leucócitos/bactérias. Peritonite é a infecção da cavidade peritoneal, risco grave nesse tipo de diálise.',
    'Nefrologia'
  ),

  -- 11. INFECTOLOGIA
  (
    'Doenças Infecciosas',
    'A Leptospirose é uma doença infecciosa febril aguda transmitida pela exposição à urina de animais infectados (ratos). A forma grave, caracterizada por icterícia, insuficiência renal e hemorragia, é chamada de:',
    '[
      {"id": "A", "text": "Síndrome de Guillain-Barré."},
      {"id": "B", "text": "Síndrome de Weil."},
      {"id": "C", "text": "Púrpura Trombocitopênica."},
      {"id": "D", "text": "Febre Maculosa."}
    ]'::jsonb,
    'B',
    'Síndrome de Weil é a forma clássica e grave da leptospirose (Icterícia Rubínica + Lesão Renal + Hemorragia Pulmonar).',
    'Infectologia'
  ),
  (
    'Doenças Infecciosas',
    'O esquema de tratamento padrão para Sífilis Primária (Cancro Duro) em paciente não alérgico é:',
    '[
      {"id": "A", "text": "Penicilina G Benzatina 2.400.000 UI, IM, dose única."},
      {"id": "B", "text": "Ceftriaxona 1g, IV, por 7 dias."},
      {"id": "C", "text": "Azitromicina 1g, VO, dose única."},
      {"id": "D", "text": "Penicilina G Benzatina 7.200.000 UI, dividida em 3 semanas."}
    ]'::jsonb,
    'A',
    'Para sífilis primária, secundária e latente recente (<1 ano), a dose é única. O esquema de 3 doses (7.200.000 UI) é para sífilis tardia ou indeterminada.',
    'PCDT IST'
  ),
  (
    'Doenças Infecciosas',
    'A Leishmaniose Tegumentar Americana (LTA) manifesta-se clinicamente, na maioria dos casos, como:',
    '[
      {"id": "A", "text": "Febre alta, hepatoesplenomegalia e emagrecimento."},
      {"id": "B", "text": "Úlcera de pele indolor, com bordas elevadas (em moldura) e fundo granuloso."},
      {"id": "C", "text": "Manchas hipocrômicas com perda de sensibilidade."},
      {"id": "D", "text": "Vesículas dolorosas em trajeto de nervo."}
    ]'::jsonb,
    'B',
    'A lesão clássica da LTA é a úlcera de Bauru: indolor, bordas altas, fundo granuloso. A hepatoesplenomegalia (A) ocorre na Leishmaniose Visceral (Calazar).',
    'Dermatologia'
  )

ON CONFLICT (question) DO NOTHING;