-- Inserção de 30 Questões sobre Curativos e Feridas (Wound Care)
-- Corrigido erro de sintaxe em aspas simples e verificado para evitar duplicatas óbvias

INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation) VALUES

-- QUESTÃO 1
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Qual é a função principal de uma cobertura de hidrocoloide em uma lesão por pressão estágio 2?', 
'[
  {"id": "A", "text": "Promover desbridamento mecânico agressivo."},
  {"id": "B", "text": "Absorver grandes quantidades de exsudato purulento."},
  {"id": "C", "text": "Manter o meio úmido, favorecer desbridamento autolítico e proteger a ferida."},
  {"id": "D", "text": "Ressecar o leito da ferida para evitar maceração."},
  {"id": "E", "text": "Combater infecção sistêmica através da liberação de antibióticos."}
]', 
'C', 
'O hidrocoloide forma um gel ao entrar em contato com o exsudato, mantendo a umidade ideal, promovendo desbridamento autolítico e protegendo terminações nervosas (alívio da dor). Não é indicado para feridas infectadas ou muito exsudativas.'),

-- QUESTÃO 2
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Sobre a classificação de Lesões por Pressão (LPP) segundo a NPUAP/EPUAP, o Estágio 1 é caracterizado por:', 
'[
  {"id": "A", "text": "Perda total da espessura da pele com exposição de gordura."},
  {"id": "B", "text": "Flictena (bolha) com conteúdo seroso ou sanguinolento."},
  {"id": "C", "text": "Pele íntegra com eritema que não embranquece após a remoção da pressão."},
  {"id": "D", "text": "Perda da derme com leito vermelho ou rosa úmido."},
  {"id": "E", "text": "Área localizada de pele intacta de cor púrpura ou marrom."}
]', 
'C', 
'O Estágio 1 é caracterizado por pele íntegra com hiperemia (vermelhidão) que não desaparece (não embranquece) ao ser pressionada, indicando lesão tissular profunda iminente ou inicial.'),

-- QUESTÃO 3
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'O princípio TIME é utilizado para o preparo do leito da ferida. O que significa a letra "M" neste acrônimo?', 
'[
  {"id": "A", "text": "Monitoramento (Monitoring)."},
  {"id": "B", "text": "Medicamento (Medication)."},
  {"id": "C", "text": "Umidade (Moisture) - desequilíbrio."},
  {"id": "D", "text": "Movimento (Movement)."},
  {"id": "E", "text": "Mensuração (Measurement)."}
]', 
'C', 
'TIME: T = Tissue (Tecido não viável); I = Infection (Infecção/Inflamação); M = Moisture (Umidade - manter o equilíbrio); E = Edge (Bordas - evolução epitelial).'),

-- QUESTÃO 4
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Qual das seguintes soluções é a mais indicada para a limpeza segura da maioria das feridas crônicas, por ser isotônica e não citotóxica?', 
'[
  {"id": "A", "text": "Água oxigenada (Peróxido de hidrogênio)."},
  {"id": "B", "text": "Solução de Povidona-Iodo (PVPI) degermante."},
  {"id": "C", "text": "Soro Fisiológico 0,9% amornado."},
  {"id": "D", "text": "Álcool 70%."},
  {"id": "E", "text": "Solução de Dakin (Hipoclorito)."}
]', 
'C', 
'O Soro Fisiológico 0,9% (morno) é a solução de escolha pois não lesa o tecido de granulação, não causa dor e limpa mecanicamente por irrigação. Antissépticos como PVPI e Água Oxigenada podem ser citotóxicos para células novas.'),

-- QUESTÃO 5
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'O alginato de cálcio é uma cobertura primária indicada principalmente para:', 
'[
  {"id": "A", "text": "Feridas secas com necrose de coagulação (escaras)."},
  {"id": "B", "text": "Feridas superficiais em fase de epitelização."},
  {"id": "C", "text": "Feridas altamente exsudativas e/ou com sangramento (hemostasia)."},
  {"id": "D", "text": "Prevenção de lesões por fricção em pele íntegra."},
  {"id": "E", "text": "Queimaduras de primeiro grau."}
]', 
'C', 
'O alginato de cálcio tem alta capacidade de absorção (troca íons cálcio por sódio, formando gel) e possui propriedades hemostáticas, sendo ideal para feridas muito exsudativas e sangrantes.'),

-- QUESTÃO 6
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Qual enzima é utilizada para o desbridamento enzimático seletivo, degradando o colágeno nativo das áreas desvitalizadas sem agredir o tecido de granulação?', 
'[
  {"id": "A", "text": "Papaína."},
  {"id": "B", "text": "Colagenase (Clostridiopeptidase A)."},
  {"id": "C", "text": "Lidocaína."},
  {"id": "D", "text": "Sulfadiazina de Prata."},
  {"id": "E", "text": "Ácidos Graxos Essenciais (AGE)."}
]', 
'B', 
'A Colagenase é uma enzima que age especificamente nas pontes de colágeno do tecido necrótico/desvitalizado, preservando o tecido viável. A Papaína também desbrida, mas não é tão seletiva quanto à colagenase e pode irritar a pele íntegra se não protegida.'),

-- QUESTÃO 7
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Sobre o uso da Papaína em feridas, assinale a alternativa correta:', 
'[
  {"id": "A", "text": "Pode ser usada em qualquer concentração em qualquer tecido."},
  {"id": "B", "text": "Deve ser usada a 10% em tecido de granulação e 2% em necrose."},
  {"id": "C", "text": "É inativada na presença de metais pesados (como prata) e soluções oxidantes."},
  {"id": "D", "text": "Não necessita de prescrição ou avaliação, pois é um produto natural."},
  {"id": "E", "text": "Serve apenas para reduzir o odor, não realiza desbridamento."}
]', 
'C', 
'A Papaína é inativada por ferro, iodo, prata e água oxigenada. As concentrações usuais são inversas ao dito na opção B: usa-se concentrações maiores (ex: 10%) para necrose dura e menores (2-4%) para esfacelo/granulação pálida.'),

-- QUESTÃO 8
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Uma ferida com tecido de granulação vermelho vivo, úmido e sem sinais de infecção deve ter como objetivo principal de tratamento:', 
'[
  {"id": "A", "text": "Desbridamento mecânico vigoroso."},
  {"id": "B", "text": "Uso de antibióticos tópicos potentes."},
  {"id": "C", "text": "Manter o meio seco e exposto ao ar."},
  {"id": "D", "text": "Proteção do tecido novo e manutenção da umidade."},
  {"id": "E", "text": "Aplicação de compressas geladas."}
]', 
'D', 
'Tecido de granulação saudável deve ser protegido. O trauma (mecânico ou químico) ou o ressecamento podem destruir os novos capilares e fibroblastos, atrasando a cicatrização.'),

-- QUESTÃO 9
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'A Bota de Unna é uma terapia compressiva inelástica indicada principalmente para:', 
'[
  {"id": "A", "text": "Úlceras arteriais isquêmicas."},
  {"id": "B", "text": "Úlceras venosas de perna."},
  {"id": "C", "text": "Pé diabético infectado."},
  {"id": "D", "text": "Lesões por pressão sacrais."},
  {"id": "E", "text": "Queimaduras extensas de tronco."}
]', 
'B', 
'A Bota de Unna auxilia no retorno venoso e é o padrão ouro para tratamento ambulatorial de úlceras venosas, desde que não haja comprometimento arterial grave (ITB > 0.8) ou infecção não controlada.'),

-- QUESTÃO 10
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Qual das seguintes medidas é CONTRAINDICADA na prevenção de Lesão por Pressão?', 
'[
  {"id": "A", "text": "Mudança de decúbito a cada 2 horas."},
  {"id": "B", "text": "Uso de colchão piramidal ou pneumático."},
  {"id": "C", "text": "Uso de ''rodinhas'' ou ''boias'' de água/ar sob proeminências ósseas."},
  {"id": "D", "text": "Hidratação da pele e suporte nutricional."},
  {"id": "E", "text": "Elevação dos calcâneos (flutuantes)."}
]', 
'C', 
'O uso de dispositivos em anel ("rodinhas" ou "boias") é contraindicado pois concentra a pressão na área circundante, causando efeito garrote e isquemia, piorando o risco de lesão.'),

-- QUESTÃO 11
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Em uma ferida com suspeita de infecção crítica ou biofilme, qual cobertura com ação antimicrobiana de amplo espectro é frequentemente indicada?', 
'[
  {"id": "A", "text": "Hidrogel simples."},
  {"id": "B", "text": "Coberturas com Prata (Ag) ou PHMB."},
  {"id": "C", "text": "Filme transparente."},
  {"id": "D", "text": "Colagenase."},
  {"id": "E", "text": "Gaze seca estéril."}
]', 
'B', 
'A Prata (nanocristalina, iônica) e o PHMB (Polihexanida) são agentes antimicrobianos eficazes contra bactérias (incluindo multirresistentes) e biofilmes, ajudando a reduzir a carga bacteriana.'),

-- QUESTÃO 12
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'O que é o desbridamento autolítico?', 
'[
  {"id": "A", "text": "Remoção de tecido morto com bisturi ou tesoura."},
  {"id": "B", "text": "Uso de larvas para comer o tecido necrótico."},
  {"id": "C", "text": "Uso da própria umidade e enzimas do corpo, retidas por uma cobertura oclusiva, para liquefazer a necrose."},
  {"id": "D", "text": "Aplicação de força mecânica (gaze úmida-seca) para arrancar a necrose."},
  {"id": "E", "text": "Uso de enzimas exógenas como papaína."}
]', 
'C', 
'O desbridamento autolítico é um processo natural, indolor e seletivo, potencializado por coberturas que mantêm a umidade (hidrogel, hidrocoloide), permitindo que macrófagos e enzimas endógenas degradem o tecido desvitalizado.'),

-- QUESTÃO 13
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Ao avaliar uma lesão no calcâneo de um paciente acamado, você observa uma placa de tecido preto, seco e endurecido (escara) estável. Qual a conduta recomendada?', 
'[
  {"id": "A", "text": "Desbridar imediatamente com bisturi."},
  {"id": "B", "text": "Aplicar papaína 10% para amolecer."},
  {"id": "C", "text": "Manter a escara seca e intacta, aliviando a pressão (offloading), pois funciona como curativo biológico."},
  {"id": "D", "text": "Aplicar alginato de cálcio."},
  {"id": "E", "text": "Realizar massagem local para estimular circulação."}
]', 
'C', 
'Escaras secas, estáveis e aderidas em calcâneos (sem flutuação, eritema ou pus) NÃO devem ser desbridadas se a perfusão for precária, pois servem como proteção. A prioridade é aliviar totalmente a pressão (elevar o calcanhar).'),

-- QUESTÃO 14
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Qual a principal característica do curativo com Carvão Ativado com Prata?', 
'[
  {"id": "A", "text": "Hidratar feridas secas."},
  {"id": "B", "text": "Controle de odor fétido e ação bactericida."},
  {"id": "C", "text": "Estimular granulação em feridas limpas."},
  {"id": "D", "text": "Servir como segunda pele em queimaduras."},
  {"id": "E", "text": "Ser transparente para visualização."}
]', 
'B', 
'O carvão ativado adsorve as moléculas de odor e bactérias, enquanto a prata exerce ação bactericida. É excelente para feridas oncológicas ou infectadas com odor forte.'),

-- QUESTÃO 15
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Para a prevenção de úlceras nos pés de pacientes diabéticos, a orientação correta é:', 
'[
  {"id": "A", "text": "Andar descalço para fortalecer a pele."},
  {"id": "B", "text": "Cortar as unhas arredondadas e retirar as cutículas."},
  {"id": "C", "text": "Usar sapatos apertados para dar firmeza."},
  {"id": "D", "text": "Inspecionar os pés diariamente, secar bem entre os dedos e não usar hidratante entre os dedos."},
  {"id": "E", "text": "Lavar os pés com água muito quente para melhorar a circulação."}
]', 
'D', 
'A inspeção diária detecta lesões precoces. A umidade entre os dedos (frieira) é porta de entrada para infecção. Água quente é perigosa devido à neuropatia (perda de sensibilidade).'),

-- QUESTÃO 16
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'O que indica a presença de maceração nas bordas de uma ferida?', 
'[
  {"id": "A", "text": "Que a ferida está muito seca."},
  {"id": "B", "text": "Excesso de umidade/exsudato em contato com a pele íntegra, deixando-a esbranquiçada e frágil."},
  {"id": "C", "text": "Sinal de cicatrização acelerada."},
  {"id": "D", "text": "Presença de tecido de granulação."},
  {"id": "E", "text": "Reação alérgica ao curativo."}
]', 
'B', 
'Maceração é o amolecimento e embranquecimento da pele devido à exposição prolongada à umidade excessiva (exsudato), o que fragiliza a barreira cutânea e amplia a ferida.'),

-- QUESTÃO 17
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'As coberturas de Ácidos Graxos Essenciais (AGE) ou óleo de girassol são indicadas para:', 
'[
  {"id": "A", "text": "Desbridamento de necrose espessa."},
  {"id": "B", "text": "Absorção de grande volume de exsudato."},
  {"id": "C", "text": "Hidratação da pele íntegra (prevenção) e estímulo à granulação/epitelização."},
  {"id": "D", "text": "Tratamento de infecção grave."},
  {"id": "E", "text": "Estancar hemorragias."}
]', 
'C', 
'O AGE mantém a umidade, forma uma película protetora, promove quimiotaxia e angiogênese, sendo ótimo para prevenção de LPP e tratamento de feridas em fase de granulação/epitelização.'),

-- QUESTÃO 18
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Qual a técnica correta de limpeza de uma ferida cirúrgica asséptica com incisão fechada?', 
'[
  {"id": "A", "text": "Do local mais contaminado para o menos contaminado."},
  {"id": "B", "text": "Movimentos circulares vigorosos."},
  {"id": "C", "text": "Do centro da incisão para as laterais (do menos para o mais contaminado)."},
  {"id": "D", "text": "De baixo para cima."},
  {"id": "E", "text": "Não se deve limpar feridas cirúrgicas."}
]', 
'C', 
'Em feridas assépticas/incisões, limpa-se da área mais limpa (a incisão) para a mais suja (a pele ao redor), evitando trazer bactérias da pele para a ferida.'),

-- QUESTÃO 19
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'O Terapia por Pressão Negativa (Vácuo) tem como um de seus principais mecanismos de ação:', 
'[
  {"id": "A", "text": "Adicionar umidade à ferida."},
  {"id": "B", "text": "Remover o exsudato, reduzir o edema e aproximar as bordas da ferida (macrodeformação)."},
  {"id": "C", "text": "Fornecer antibiótico tópico contínuo."},
  {"id": "D", "text": "Congelar o tecido para evitar dor."},
  {"id": "E", "text": "Aumentar a necrose para facilitar a remoção."}
]', 
'B', 
'A TPN aplica sucção controlada, removendo fluidos, reduzindo o edema (melhorando a perfusão) e estimulando a formação de tecido de granulação e contração da ferida.'),

-- QUESTÃO 20
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Em relação à troca de curativos, o que significa "troca por saturação"?', 
'[
  {"id": "A", "text": "Trocar sempre no mesmo horário, independente do estado."},
  {"id": "B", "text": "Trocar apenas quando o curativo secundário estiver sujo externamente."},
  {"id": "C", "text": "Trocar quando a capacidade de absorção da cobertura for atingida ou houver vazamento, respeitando o tempo máximo do produto."},
  {"id": "D", "text": "Trocar a cada 2 horas."},
  {"id": "E", "text": "Trocar apenas quando o paciente pedir."}
]', 
'C', 
'Troca por saturação otimiza o uso do curativo (custo-efetividade) e mantém o meio úmido ideal, evitando trocas desnecessárias que resfriam o leito e traumatizam o tecido.'),

-- QUESTÃO 21
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Qual é a definição de uma Lesão por Pressão Tissular Profunda?', 
'[
  {"id": "A", "text": "Perda total da pele com exposição óssea."},
  {"id": "B", "text": "Área localizada de pele intacta ou não, com coloração vermelho-escura, marrom ou púrpura persistente."},
  {"id": "C", "text": "Bolha com conteúdo seroso."},
  {"id": "D", "text": "Lesão coberta por esfacelo amarelo."},
  {"id": "E", "text": "Dermatite associada à incontinência."}
]', 
'B', 
'A LPP Tissular Profunda indica dano severo nos tecidos moles sob a pele (músculo/gordura) devido à pressão/cisalhamento, visível como uma mancha escura ou bolha com sangue.'),

-- QUESTÃO 22
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'O que diferencia uma Úlcera Venosa de uma Úlcera Arterial?', 
'[
  {"id": "A", "text": "A venosa é muito dolorosa e a arterial é indolor."},
  {"id": "B", "text": "A arterial geralmente tem bordas irregulares e exsudato, a venosa é seca e em pontas de dedos."},
  {"id": "C", "text": "A venosa geralmente é maleolar/perna, com bordas irregulares e exsudativa; a arterial é distal (pé/dedos), pálida, seca e dolorosa."},
  {"id": "D", "text": "Não há diferença clínica."}
]', 
'C', 
'Úlceras venosas: estase, edema, exsudato, bordas irregulares. Úlceras arteriais: isquemia, fundo pálido/necrótico, bordas regulares ("saca-bocado"), dor intensa que piora ao elevar a perna.'),

-- QUESTÃO 23
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Qual a cobertura indicada para proteção de pele perilesional (ao redor da ferida) contra maceração?', 
'[
  {"id": "A", "text": "Hidrogel."},
  {"id": "B", "text": "Creme barreira (óxido de zinco ou polímero) ou película protetora (spray)."},
  {"id": "C", "text": "Gaze úmida."},
  {"id": "D", "text": "Água oxigenada."},
  {"id": "E", "text": "Fita adesiva comum."}
]', 
'B', 
'Cremes barreira ou películas protetoras sem álcool (Cavilon, etc.) formam um filme que impede o contato do exsudato corrosivo com a pele íntegra.'),

-- QUESTÃO 24
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'O desbridamento instrumental (sharp) conservador pode ser realizado pelo enfermeiro?', 
'[
  {"id": "A", "text": "Não, é ato exclusivamente médico."},
  {"id": "B", "text": "Sim, desde que tenha competência técnica e conhecimento anatômico, removendo apenas tecido desvitalizado."},
  {"id": "C", "text": "Sim, mas apenas em centro cirúrgico."},
  {"id": "D", "text": "Não, o enfermeiro só pode usar pomadas."},
  {"id": "E", "text": "Sim, inclusive cortando tecido vivo se necessário."}
]', 
'B', 
'O enfermeiro capacitado pode realizar desbridamento instrumental conservador (retirada de tecido morto acima do plano viável) à beira do leito, conforme resolução do COFEN.'),

-- QUESTÃO 25
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Qual fator sistêmico mais impacta negativamente a cicatrização de feridas?', 
'[
  {"id": "A", "text": "Uso de vitaminas."},
  {"id": "B", "text": "Desnutrição (especialmente hipoproteinemia) e controle glicêmico inadequado."},
  {"id": "C", "text": "Hidratação abundante."},
  {"id": "D", "text": "Repouso adequado."},
  {"id": "E", "text": "Ambiente limpo."}
]', 
'B', 
'A cicatrização exige substrato (proteínas, vitaminas) e ambiente fisiológico. Desnutrição e hiperglicemia (diabetes) bloqueiam as fases inflamatória e proliferativa.'),

-- QUESTÃO 26
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'O curativo de espuma (foam) com silicone é ideal para:', 
'[
  {"id": "A", "text": "Desbridar necrose seca."},
  {"id": "B", "text": "Prevenir lesões por pressão e tratar feridas exsudativas, minimizando trauma na troca."},
  {"id": "C", "text": "Feridas infectadas com odor fétido (sem prata)."},
  {"id": "D", "text": "Fixar cateteres venosos."},
  {"id": "E", "text": "Queimaduras químicas."}
]', 
'B', 
'Espumas absorvem exsudato e o silicone adere suavemente à pele circundante sem aderir ao leito úmido, reduzindo dor e trauma na remoção.'),

-- QUESTÃO 27
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Qual a principal vantagem das coberturas de Hidrofibra em relação ao Alginato?', 
'[
  {"id": "A", "text": "São mais baratas."},
  {"id": "B", "text": "Fazem gelificação vertical, evitando que o exsudato se espalhe lateralmente (menor risco de maceração)."},
  {"id": "C", "text": "Não precisam de cobertura secundária."},
  {"id": "D", "text": "Podem ser usadas em feridas secas."},
  {"id": "E", "text": "São transparentes."}
]', 
'B', 
'A hidrofibra absorve verticalmente e retém o fluido dentro da fibra, enquanto o alginato forma um gel que pode se espalhar mais. Ambas são ótimas, mas a hidrofibra protege melhor as bordas em exsudato abundante.'),

-- QUESTÃO 28
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'A Escala de Braden avalia 6 parâmetros para risco de LPP. Quais são?', 
'[
  {"id": "A", "text": "Idade, Peso, Altura, Doenças, Medicamentos, Dieta."},
  {"id": "B", "text": "Percepção Sensorial, Umidade, Atividade, Mobilidade, Nutrição, Fricção/Cisalhamento."},
  {"id": "C", "text": "Dor, Calor, Rubor, Edema, Perda de Função, Odor."},
  {"id": "D", "text": "Consciência, Respiração, Circulação, Pupilas, Glicemia, Temperatura."}
]', 
'B', 
'Percepção Sensorial, Umidade, Atividade, Mobilidade, Nutrição e Fricção/Cisalhamento são os domínios da Escala de Braden.'),

-- QUESTÃO 29
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'Em uma ferida cavitária (com profundidade), como deve ser aplicado o curativo primário (ex: alginato ou gaze úmida)?', 
'[
  {"id": "A", "text": "Apenas na superfície, cobrindo o buraco."},
  {"id": "B", "text": "Preenchendo todo o espaço morto suavemente, sem compactar excessivamente."},
  {"id": "C", "text": "Compactando com força para parar o sangramento."},
  {"id": "D", "text": "Não se deve colocar nada dentro de cavidades."},
  {"id": "E", "text": "Injetando água oxigenada."}
]', 
'B', 
'O espaço morto deve ser preenchido para evitar formação de abscessos e permitir a granulação de baixo para cima (segunda intenção). Compactar demais causa isquemia nas paredes.'),

-- QUESTÃO 30
('Fundamentos de Enfermagem', 'Enfermagem Pro', 'O que é Epíbole em uma ferida?', 
'[
  {"id": "A", "text": "Um tipo de bactéria."},
  {"id": "B", "text": "Bordas da ferida que se enrolam para dentro, paralisando a epitelização (contato inibido)."},
  {"id": "C", "text": "Excesso de tecido de granulação (hipergranulação)."},
  {"id": "D", "text": "Uma cobertura especial."}
]', 
'B', 
'Epíbole ocorre quando as bordas da pele enrolam para baixo e tocam o leito, o que o corpo interpreta como "cicatrização concluída", cessando a migração epitelial. Requer tratamento (escarificação/abertura das bordas).');