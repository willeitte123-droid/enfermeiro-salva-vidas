-- Inserção de 30 Questões sobre SAE e Processo de Enfermagem
-- Aspas simples escapadas com '' para evitar erro de sintaxe
-- Adicionado ON CONFLICT para prevenir duplicidade

INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation) VALUES

-- QUESTÃO 1
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'O Processo de Enfermagem (PE) organiza-se em cinco etapas inter-relacionadas, interdependentes e recorrentes. Assinale a alternativa que apresenta a sequência correta dessas etapas segundo a Resolução COFEN 358/2009:',
'[
  {"id": "A", "text": "Diagnóstico, Planejamento, Implementação, Evolução, Alta."},
  {"id": "B", "text": "Coleta de dados, Diagnóstico, Planejamento, Implementação, Avaliação."},
  {"id": "C", "text": "Histórico, Prescrição, Evolução, Diagnóstico, Anotação."},
  {"id": "D", "text": "Investigação, Análise, Planejamento, Ação, Resultado."},
  {"id": "E", "text": "Admissão, Diagnóstico Médico, Prescrição de Enfermagem, Checagem, Alta."}
]',
'B',
'As 5 etapas clássicas são: 1. Coleta de Dados (ou Histórico); 2. Diagnóstico de Enfermagem; 3. Planejamento; 4. Implementação; 5. Avaliação.'),

-- QUESTÃO 2
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Segundo a legislação vigente, a realização do Diagnóstico de Enfermagem e a Prescrição da Assistência de Enfermagem são atividades:',
'[
  {"id": "A", "text": "Privativas do Enfermeiro."},
  {"id": "B", "text": "Compartilhadas entre Enfermeiro e Médico."},
  {"id": "C", "text": "Delegáveis ao Técnico de Enfermagem sob supervisão."},
  {"id": "D", "text": "De responsabilidade de toda a equipe de saúde."},
  {"id": "E", "text": "Facultativas em instituições privadas."}
]',
'A',
'O Diagnóstico e a Prescrição de Enfermagem são atos privativos do Enfermeiro. Técnicos e Auxiliares participam da execução (implementação) e coleta de dados básica (sinais vitais), mas não diagnosticam.'),

-- QUESTÃO 3
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Na taxonomia da NANDA-I, um Diagnóstico de Enfermagem com "Foco no Problema" (antigo diagnóstico real) é composto obrigatoriamente por:',
'[
  {"id": "A", "text": "Título, Fatores de Risco e População de Risco."},
  {"id": "B", "text": "Título, Fatores Relacionados (causa) e Características Definidoras (sinais/sintomas)."},
  {"id": "C", "text": "Apenas Título e Definição."},
  {"id": "D", "text": "Título e Fatores de Risco."},
  {"id": "E", "text": "Título e Características Definidoras."}
]',
'B',
'Um diagnóstico focado no problema segue a estrutura P (Problema/Título) + E (Etiologia/Fatores Relacionados) + S (Sinais e Sintomas/Características Definidoras).'),

-- QUESTÃO 4
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Um Diagnóstico de Enfermagem de "Risco" diferencia-se do diagnóstico com "Foco no Problema" por NÃO apresentar:',
'[
  {"id": "A", "text": "Fatores de Risco."},
  {"id": "B", "text": "Título."},
  {"id": "C", "text": "Definição."},
  {"id": "D", "text": "Características Definidoras (Sinais e Sintomas)."},
  {"id": "E", "text": "Código numérico."}
]',
'D',
'Como o problema ainda não aconteceu (é apenas um risco), o paciente não apresenta sinais e sintomas (Características Definidoras). Ele apresenta apenas Fatores de Risco.'),

-- QUESTÃO 5
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'A Teoria das Necessidades Humanas Básicas, que hierarquiza as necessidades em Psicobiológicas, Psicossociais e Psicoespirituais, foi desenvolvida pela enfermeira brasileira:',
'[
  {"id": "A", "text": "Florence Nightingale."},
  {"id": "B", "text": "Ana Néri."},
  {"id": "C", "text": "Wanda de Aguiar Horta."},
  {"id": "D", "text": "Dorothea Orem."},
  {"id": "E", "text": "Callista Roy."}
]',
'C',
'Wanda Horta é a principal teórica brasileira, e seu modelo baseia-se na teoria da motivação humana de Maslow, adaptada para a enfermagem.'),

-- QUESTÃO 6
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Na etapa de Planejamento, o enfermeiro utiliza a taxonomia NOC (Nursing Outcomes Classification) para definir:',
'[
  {"id": "A", "text": "As intervenções que serão realizadas."},
  {"id": "B", "text": "Os problemas de saúde do paciente."},
  {"id": "C", "text": "Os materiais necessários para o curativo."},
  {"id": "D", "text": "Os resultados esperados e metas a serem alcançadas pelo paciente."},
  {"id": "E", "text": "O custo do tratamento."}
]',
'D',
'NOC refere-se à Classificação dos Resultados de Enfermagem. São metas mensuráveis para avaliar a eficácia das intervenções.'),

-- QUESTÃO 7
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Qual das seguintes opções é um exemplo de "Característica Definidora" para o diagnóstico de "Débito Cardíaco Diminuído"?',
'[
  {"id": "A", "text": "Alteração na pré-carga (Fator Relacionado)."},
  {"id": "B", "text": "Uso de anti-hipertensivos."},
  {"id": "C", "text": "Bradicardia, hipotensão, pele fria e úmida."},
  {"id": "D", "text": "Histórico familiar de infarto."},
  {"id": "E", "text": "Idade avançada."}
]',
'C',
'Características definidoras são os sinais e sintomas observáveis. Bradicardia e hipotensão são evidências clínicas (sinais) do débito cardíaco baixo.'),

-- QUESTÃO 8
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'A Teoria do Déficit do Autocuidado, que descreve os sistemas de enfermagem (totalmente compensatório, parcialmente compensatório e apoio-educação), foi proposta por:',
'[
  {"id": "A", "text": "Virginia Henderson."},
  {"id": "B", "text": "Imogene King."},
  {"id": "C", "text": "Dorothea Orem."},
  {"id": "D", "text": "Hildegard Peplau."},
  {"id": "E", "text": "Madeleine Leininger."}
]',
'C',
'Dorothea Orem foca na capacidade do indivíduo de cuidar de si mesmo. O enfermeiro atua quando há um déficit nessa capacidade.'),

-- QUESTÃO 9
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Qual é a diferença fundamental entre a Sistematização da Assistência de Enfermagem (SAE) e o Processo de Enfermagem (PE)?',
'[
  {"id": "A", "text": "São sinônimos exatos, sem diferença."},
  {"id": "B", "text": "A SAE é o método clínico (etapas), e o PE é a organização do trabalho."},
  {"id": "C", "text": "A SAE organiza o trabalho profissional (método, pessoal, instrumentos), tornando possível a operacionalização do PE, que é o instrumento metodológico (as 5 etapas)."},
  {"id": "D", "text": "O PE é opcional, a SAE é obrigatória."},
  {"id": "E", "text": "A SAE é feita pelo técnico, o PE pelo enfermeiro."}
]',
'C',
'A SAE é mais ampla (gestão/organização), criando as condições para que o Processo de Enfermagem (a prática clínica em 5 etapas) aconteça.'),

-- QUESTÃO 10
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Na taxonomia NIC (Nursing Interventions Classification), as ações de enfermagem são:',
'[
  {"id": "A", "text": "Diagnósticos médicos."},
  {"id": "B", "text": "Padronizações de tratamentos baseadas em evidências que o enfermeiro realiza."},
  {"id": "C", "text": "Resultados de exames laboratoriais."},
  {"id": "D", "text": "Metas do paciente."},
  {"id": "E", "text": "Fatores de risco."}
]',
'B',
'NIC padroniza o "que fazer" (intervenções). Ex: Monitorização de Sinais Vitais, Cuidados com Lesões, Controle da Dor.'),

-- QUESTÃO 11
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'O registro no prontuário que descreve a resposta do paciente às intervenções implementadas e determina se as metas foram atingidas corresponde à etapa de:',
'[
  {"id": "A", "text": "Histórico."},
  {"id": "B", "text": "Diagnóstico."},
  {"id": "C", "text": "Planejamento."},
  {"id": "D", "text": "Implementação."},
  {"id": "E", "text": "Avaliação (Evolução) de Enfermagem."}
]',
'E',
'A Avaliação (muitas vezes registrada na Evolução) é o momento de checar a eficácia do plano. Se a meta não foi atingida, o ciclo reinicia.'),

-- QUESTÃO 12
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Para formular um diagnóstico de "Promoção da Saúde" (ex: Disposição para amamentação melhorada), o paciente deve apresentar:',
'[
  {"id": "A", "text": "Um problema grave instalado."},
  {"id": "B", "text": "Fatores de risco iminentes."},
  {"id": "C", "text": "Desejo e motivação para aumentar o bem-estar e alcançar o potencial humano de saúde."},
  {"id": "D", "text": "Uma doença crônica."},
  {"id": "E", "text": "Incapacidade de autocuidado."}
]',
'C',
'Diagnósticos de promoção da saúde focam no potencial positivo e na vontade do paciente de melhorar uma condição que já é boa ou estável.'),

-- QUESTÃO 13
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Florence Nightingale, em sua Teoria Ambientalista, focava a assistência de enfermagem em:',
'[
  {"id": "A", "text": "Relações interpessoais."},
  {"id": "B", "text": "Controle do ambiente (ar fresco, luz, calor, limpeza, silêncio) para facilitar a recuperação natural."},
  {"id": "C", "text": "Adaptação ao estresse."},
  {"id": "D", "text": "Cuidado transcultural."},
  {"id": "E", "text": "Sistemas de autocuidado."}
]',
'B',
'Florence é a precursora. Sua teoria enfatizava que se o ambiente fosse adequado (higiênico/arejado), a natureza agiria na cura do paciente.'),

-- QUESTÃO 14
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Qual das seguintes alternativas representa corretamente a estrutura de um Diagnóstico de Risco segundo a NANDA-I?',
'[
  {"id": "A", "text": "Risco de Infecção relacionado a procedimentos invasivos."},
  {"id": "B", "text": "Risco de Infecção evidenciado por febre e purulência."},
  {"id": "C", "text": "Infecção Aguda relacionada a risco de bactérias."},
  {"id": "D", "text": "Dor Aguda risco de queda."},
  {"id": "E", "text": "Risco de Infecção relacionado a procedimentos invasivos evidenciado por dor."}
]',
'A',
'Diagnósticos de risco têm apenas Título + Fator Relacionado (causa). NÃO têm "evidenciado por" (sinais/sintomas), pois o problema não aconteceu.'),

-- QUESTÃO 15
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'A etapa de "Coleta de Dados" ou "Investigação" é subdividida em:',
'[
  {"id": "A", "text": "Prescrição e Checagem."},
  {"id": "B", "text": "Entrevista (Anamnese) e Exame Físico."},
  {"id": "C", "text": "Diagnóstico e Planejamento."},
  {"id": "D", "text": "Admissão e Alta."},
  {"id": "E", "text": "Sinais Vitais e Curativo."}
]',
'B',
'A coleta de dados compreende a história clínica (subjetiva) obtida na entrevista e os dados objetivos obtidos no exame físico.'),

-- QUESTÃO 16
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Madeleine Leininger é a teórica responsável pela Teoria:',
'[
  {"id": "A", "text": "Do Autocuidado."},
  {"id": "B", "text": "Da Adaptação."},
  {"id": "C", "text": "Do Alcance de Metas."},
  {"id": "D", "text": "Da Diversidade e Universalidade do Cuidado Cultural (Transcultural)."},
  {"id": "E", "text": "Holística."}
]',
'D',
'Leininger introduziu a antropologia na enfermagem, focando no cuidado culturalmente congruente (respeitando crenças e valores do paciente).'),

-- QUESTÃO 17
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Na evolução de enfermagem utilizando o formato SOAP, a letra "S" refere-se a:',
'[
  {"id": "A", "text": "Sinais vitais aferidos."},
  {"id": "B", "text": "Solução do problema."},
  {"id": "C", "text": "Subjetivo (o que o paciente relata/sente)."},
  {"id": "D", "text": "Síntese dos dados."},
  {"id": "E", "text": "Suporte ventilatório."}
]',
'C',
'SOAP: S (Subjetivo - relato), O (Objetivo - exame físico/dados), A (Avaliação/Análise), P (Plano).'),

-- QUESTÃO 18
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'O "Julgamento Clínico" é a competência cognitiva central para qual etapa do Processo de Enfermagem?',
'[
  {"id": "A", "text": "Coleta de Dados (apenas anotar o que vê)."},
  {"id": "B", "text": "Implementação (apenas fazer o que foi prescrito)."},
  {"id": "C", "text": "Diagnóstico de Enfermagem (interpretar os dados para identificar o problema)."},
  {"id": "D", "text": "Checagem."},
  {"id": "E", "text": "Higienização."}
]',
'C',
'O Diagnóstico é a etapa intelectual onde o enfermeiro analisa os dados coletados e julga qual é o problema ou necessidade humana afetada.'),

-- QUESTÃO 19
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Qual teoria de enfermagem foca na interação enfermeiro-paciente e nas fases desse relacionamento (orientação, identificação, exploração e resolução), sendo muito usada na Psiquiatria?',
'[
  {"id": "A", "text": "Hildegard Peplau (Teoria das Relações Interpessoais)."},
  {"id": "B", "text": "Faye Abdellah."},
  {"id": "C", "text": "Myra Levine."},
  {"id": "D", "text": "Martha Rogers."},
  {"id": "E", "text": "Wanda Horta."}
]',
'A',
'Peplau é a mãe da enfermagem psiquiátrica moderna, focando no processo interpessoal terapêutico.'),

-- QUESTÃO 20
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Na NANDA-I, o eixo que descreve "o que é o diagnóstico" (ex: Troca de gases prejudicada, Dor aguda) é chamado de:',
'[
  {"id": "A", "text": "Eixo Foco do Diagnóstico."},
  {"id": "B", "text": "Eixo Sujeito."},
  {"id": "C", "text": "Eixo Julgamento."},
  {"id": "D", "text": "Eixo Tempo."},
  {"id": "E", "text": "Eixo Localização."}
]',
'A',
'O Foco é o elemento principal (ex: Dor, Troca de gases, Ansiedade). O Julgamento (prejudicada, aguda, ineficaz) qualifica o foco.'),

-- QUESTÃO 21
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'No modelo de Callista Roy (Teoria da Adaptação), o objetivo da enfermagem é:',
'[
  {"id": "A", "text": "Curar a doença biológica."},
  {"id": "B", "text": "Promover a adaptação do indivíduo em quatro modos (fisiológico, autoconceito, função de papel e interdependência)."},
  {"id": "C", "text": "Garantir o repouso absoluto."},
  {"id": "D", "text": "Realizar procedimentos técnicos com perfeição."},
  {"id": "E", "text": "Suprir as 14 necessidades fundamentais."}
]',
'B',
'Roy vê a pessoa como um sistema adaptativo que responde a estímulos. A enfermagem ajuda a promover respostas adaptativas eficazes.'),

-- QUESTÃO 22
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Segundo a Resolução COFEN 358/2009, o Técnico de Enfermagem participa do Processo de Enfermagem:',
'[
  {"id": "A", "text": "Realizando o Diagnóstico de Enfermagem."},
  {"id": "B", "text": "Prescrevendo cuidados complexos."},
  {"id": "C", "text": "Na execução (implementação) das ações e na coleta de dados para subsidiar o enfermeiro."},
  {"id": "D", "text": "Apenas na etapa de anotação de enfermagem."},
  {"id": "E", "text": "Ele não participa do Processo de Enfermagem."}
]',
'C',
'Todos da equipe participam. O técnico implementa as ações prescritas pelo enfermeiro e fornece dados (sinais vitais, observação) que ajudam na avaliação.'),

-- QUESTÃO 23
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Um paciente apresenta "Padrão Respiratório Ineficaz". Uma intervenção (NIC) prioritária para este diagnóstico seria:',
'[
  {"id": "A", "text": "Orientar sobre dieta hipossódica."},
  {"id": "B", "text": "Posicionar o paciente em Fowler ou semi-Fowler para facilitar a expansão torácica."},
  {"id": "C", "text": "Realizar curativo na lesão sacral."},
  {"id": "D", "text": "Administrar analgésico."},
  {"id": "E", "text": "Restringir a ingestão hídrica."}
]',
'B',
'O diagnóstico refere-se à ventilação. A posição sentada (Fowler) melhora a mecânica respiratória ao descer o diafragma.'),

-- QUESTÃO 24
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Qual das seguintes afirmações sobre o Histórico de Enfermagem está CORRETA?',
'[
  {"id": "A", "text": "Deve ser realizado apenas na alta do paciente."},
  {"id": "B", "text": "É um roteiro sistematizado para levantamento de dados que torna possível a identificação dos problemas."},
  {"id": "C", "text": "É opcional em unidades de internação."},
  {"id": "D", "text": "Foca apenas na doença atual, ignorando aspectos sociais."},
  {"id": "E", "text": "Deve ser preenchido pelo médico."}
]',
'B',
'O histórico é a base de tudo. Sem dados completos e organizados, não é possível diagnosticar corretamente.'),

-- QUESTÃO 25
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Virginia Henderson definiu a enfermagem como a assistência ao indivíduo (doente ou saudável) no desempenho de atividades que contribuem para a saúde ou recuperação. Ela listou quantas necessidades fundamentais?',
'[
  {"id": "A", "text": "5 necessidades."},
  {"id": "B", "text": "10 necessidades."},
  {"id": "C", "text": "14 necessidades."},
  {"id": "D", "text": "21 problemas."},
  {"id": "E", "text": "3 sistemas."}
]',
'C',
'Henderson propôs as 14 necessidades básicas (respirar, comer, eliminar, mover-se, dormir, vestir-se, manter temperatura, limpar-se, evitar perigos, comunicar-se, crenças, trabalho, lazer, aprender).'),

-- QUESTÃO 26
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'O termo "Síndrome" na NANDA-I (ex: Síndrome do Desuso) refere-se a:',
'[
  {"id": "A", "text": "Um diagnóstico médico complexo."},
  {"id": "B", "text": "Um agrupamento de diagnósticos de enfermagem que ocorrem juntos e são tratados melhor através de intervenções similares."},
  {"id": "C", "text": "Uma doença genética."},
  {"id": "D", "text": "Um sintoma isolado."},
  {"id": "E", "text": "Um diagnóstico de bem-estar."}
]',
'B',
'Síndromes são clusters (agrupamentos) de diagnósticos. Ex: A Síndrome do Desuso inclui risco de constipação, risco de LPP, risco de trombose, etc., todos derivados da imobilidade.'),

-- QUESTÃO 27
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Em relação à prescrição de enfermagem, é CORRETO afirmar:',
'[
  {"id": "A", "text": "Pode ser verbal na maioria das vezes."},
  {"id": "B", "text": "Deve conter apenas medicações."},
  {"id": "C", "text": "Deve conter a ação, a frequência, o modo de fazer e ser assinada/carimbada pelo enfermeiro."},
  {"id": "D", "text": "É válida por tempo indeterminado."},
  {"id": "E", "text": "Pode ser feita pelo Técnico de Enfermagem."}
]',
'C',
'A prescrição deve ser clara, completa e atualizada (geralmente a cada 24h). É o guia para a equipe técnica.'),

-- QUESTÃO 28
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'A "Validacão" do diagnóstico de enfermagem ocorre quando:',
'[
  {"id": "A", "text": "O médico concorda com o diagnóstico."},
  {"id": "B", "text": "O enfermeiro confirma com o paciente (se possível) ou revisa os dados para garantir que o diagnóstico reflete a realidade clínica."},
  {"id": "C", "text": "O sistema de computador aceita o código."},
  {"id": "D", "text": "O paciente recebe alta."},
  {"id": "E", "text": "A auditoria aprova a conta."}
]',
'B',
'Validar é garantir a acurácia. O enfermeiro checa: "Estes sinais e sintomas realmente levam a este diagnóstico? O paciente concorda que este é o problema?"'),

-- QUESTÃO 29
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Imogene King desenvolveu a Teoria do Alcance de Metas, que enfatiza:',
'[
  {"id": "A", "text": "A interação dinâmica entre enfermeiro e paciente para estabelecer metas mútuas."},
  {"id": "B", "text": "O cuidado passivo do paciente."},
  {"id": "C", "text": "O controle total do ambiente."},
  {"id": "D", "text": "A adaptação fisiológica apenas."},
  {"id": "E", "text": "O déficit de autocuidado."}
]',
'A',
'King foca na transação. Enfermeiro e paciente percebem, julgam e agem juntos para definir e alcançar objetivos de saúde.'),

-- QUESTÃO 30
('Sistematização da Assistência (SAE)', 'Enfermagem Pro', 'Um paciente com "Integridade da Pele Prejudicada" (Diagnóstico) tem como meta "Apresentar cicatrização completa em 15 dias" (Resultado/NOC). A ação "Realizar curativo com hidrogel a cada 24h" corresponde a:',
'[
  {"id": "A", "text": "Avaliação."},
  {"id": "B", "text": "Histórico."},
  {"id": "C", "text": "Intervenção/Implementação (NIC)."},
  {"id": "D", "text": "Fator Relacionado."},
  {"id": "E", "text": "Característica Definidora."}
]',
'C',
'A ação de realizar o curativo é a Intervenção (NIC) prescrita para alcançar o resultado desejado.')

ON CONFLICT (question) DO NOTHING;