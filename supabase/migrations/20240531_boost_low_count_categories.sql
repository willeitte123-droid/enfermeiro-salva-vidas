-- Inserção de 30 Questões para equilibrar categorias com baixo volume
-- Foco: Saúde do Idoso, Saúde Mental, Administração, CME, Saúde do Trabalhador e Imunização
-- Adicionado ON CONFLICT para evitar erros de duplicidade

INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation) VALUES

-- SAÚDE DO IDOSO (5 Questões Inéditas)
('Saúde do Idoso', 'Enfermagem Pro', 'Conforme o Estatuto do Idoso, em todo atendimento de saúde, os idosos maiores de 80 anos têm preferência especial sobre:', 
'[
  {"id": "A", "text": "Apenas sobre crianças e adolescentes."},
  {"id": "B", "text": "Os demais idosos, exceto em casos de emergência."},
  {"id": "C", "text": "Ninguém, todos os idosos são iguais."},
  {"id": "D", "text": "Apenas em filas de banco."},
  {"id": "E", "text": "Gestantes em trabalho de parto."}
]', 
'B', 
'A Lei 13.466/2017 alterou o Estatuto do Idoso estabelecendo que dentre os idosos, é assegurada prioridade especial aos maiores de 80 anos, atendendo-se suas necessidades sempre preferencialmente em relação aos demais idosos (exceto emergência).'),

('Saúde do Idoso', 'Enfermagem Pro', 'A vacina Pneumocócica 23-valente (Pneumo 23) é indicada pelo CRIE para idosos em qual situação específica?', 
'[
  {"id": "A", "text": "Para todos os idosos saudáveis na UBS."},
  {"id": "B", "text": "Apenas para idosos institucionalizados (asilos/casas de repouso) e acamados hospitalares."},
  {"id": "C", "text": "Para idosos que viajam para o exterior."},
  {"id": "D", "text": "Somente se o idoso tiver HIV."},
  {"id": "E", "text": "É contraindicada para idosos."}
]', 
'B', 
'No SUS (rotina), a Pneumo 23 é disponibilizada para idosos institucionalizados, acamados ou com comorbidades específicas (cardiopatas, pneumopatas graves) através dos CRIEs.'),

('Saúde do Idoso', 'Enfermagem Pro', 'Qual das seguintes alterações cognitivas NÃO faz parte do envelhecimento normal (senescência), devendo ser investigada como patológica (senilidade)?', 
'[
  {"id": "A", "text": "Lentificação no processamento de informações."},
  {"id": "B", "text": "Dificuldade leve em evocar nomes de pessoas recém-conhecidas."},
  {"id": "C", "text": "Perda súbita de memória recente que interfere nas atividades diárias (esquecer o gás ligado, se perder na rua)."},
  {"id": "D", "text": "Menor flexibilidade mental."},
  {"id": "E", "text": "Diminuição da velocidade de reflexos."}
]', 
'C', 
'O esquecimento que compromete a segurança e a autonomia (atividades de vida diária) sugere processo demencial (ex: Alzheimer), não sendo parte do envelhecimento normal.'),

('Saúde do Idoso', 'Enfermagem Pro', 'A incontinência urinária no idoso é considerada:', 
'[
  {"id": "A", "text": "Uma consequência normal e inevitável da idade."},
  {"id": "B", "text": "Um gigante da geriatria que deve ser investigado e tratado, pois causa isolamento social."},
  {"id": "C", "text": "Sinal exclusivo de infecção urinária."},
  {"id": "D", "text": "Problema sem tratamento."},
  {"id": "E", "text": "Benéfica para a função renal."}
]', 
'B', 
'A incontinência urinária não é normal da velhice. É uma das grandes síndromes geriátricas e tem impacto devastador na qualidade de vida, mas possui tratamento (comportamental, farmacológico ou cirúrgico).'),

('Saúde do Idoso', 'Enfermagem Pro', 'Na avaliação multidimensional do idoso, o teste "Get Up and Go" (Levantar e Andar) serve para avaliar principalmente:', 
'[
  {"id": "A", "text": "A função cognitiva e memória."},
  {"id": "B", "text": "A acuidade visual."},
  {"id": "C", "text": "O equilíbrio, a marcha e o risco de quedas."},
  {"id": "D", "text": "A força de preensão palmar."},
  {"id": "E", "text": "A continência esfincteriana."}
]', 
'C', 
'O teste cronometra o tempo que o idoso leva para levantar de uma cadeira, andar 3 metros, virar e sentar novamente. Tempos elevados indicam alto risco de queda.'),


-- SAÚDE MENTAL (5 Questões Inéditas)
('Saúde Mental', 'Enfermagem Pro', 'O Serviço Residencial Terapêutico (SRT) é um dispositivo da RAPS destinado a:', 
'[
  {"id": "A", "text": "Internar pacientes em crise aguda por até 15 dias."},
  {"id": "B", "text": "Moradia para pessoas com transtornos mentais egressas de internações psiquiátricas de longa permanência, que não possuem vínculos familiares e sociais."},
  {"id": "C", "text": "Tratamento de dependentes químicos em fazendas."},
  {"id": "D", "text": "Consultas ambulatoriais psiquiátricas."},
  {"id": "E", "text": "Abrigo para idosos sem transtorno mental."}
]', 
'B', 
'As Residências Terapêuticas são casas inseridas na comunidade para acolher e servir de moradia para pacientes que perderam seus vínculos sociais devido a longos anos de internação em manicômios.'),

('Saúde Mental', 'Enfermagem Pro', 'Um paciente em abstinência alcoólica grave apresenta tremores, sudorese, alucinações visuais (zoopsias) e instabilidade autonômica. Este quadro é compatível com:', 
'[
  {"id": "A", "text": "Intoxicação alcoólica aguda."},
  {"id": "B", "text": "Delirium Tremens."},
  {"id": "C", "text": "Síndrome de Wernicke."},
  {"id": "D", "text": "Esquizofrenia paranoide."},
  {"id": "E", "text": "Transtorno de Pânico."}
]', 
'B', 
'O Delirium Tremens é a forma mais grave da abstinência, ocorrendo geralmente 48-96h após a interrupção do uso. É uma emergência médica com risco de morte.'),

('Saúde Mental', 'Enfermagem Pro', 'O medicamento Biperideno é frequentemente utilizado na emergência psiquiátrica como antídoto para:', 
'[
  {"id": "A", "text": "Intoxicação por Benzodiazepínicos."},
  {"id": "B", "text": "Sintomas extrapiramidais agudos (impregnação, distonia) causados por antipsicóticos."},
  {"id": "C", "text": "Depressão respiratória por opioides."},
  {"id": "D", "text": "Crise hipertensiva por IMAO."},
  {"id": "E", "text": "Overdose de Lítio."}
]', 
'B', 
'O Biperideno é um anticolinérgico usado para reverter efeitos colaterais motores (parkinsonismo, distonia aguda) induzidos por neurolépticos típicos como o Haloperidol.'),

('Saúde Mental', 'Enfermagem Pro', 'Na relação terapêutica enfermeiro-paciente em saúde mental, a "escuta qualificada" implica em:', 
'[
  {"id": "A", "text": "Ouvir para dar conselhos morais sobre a vida do paciente."},
  {"id": "B", "text": "Apenas registrar as queixas físicas."},
  {"id": "C", "text": "Ouvir sem julgamento, validando o sofrimento do outro e buscando compreender o significado de sua fala."},
  {"id": "D", "text": "Interromper o paciente sempre que ele falar algo delirante."},
  {"id": "E", "text": "Fingir que concorda com tudo para não irritar o paciente."}
]', 
'C', 
'A escuta qualificada é a base do acolhimento. Envolve empatia, suspensão de juízo de valor e foco na compreensão da subjetividade do sujeito.'),

('Saúde Mental', 'Enfermagem Pro', 'O Matriciamento (Apoio Matricial) em saúde mental consiste em:', 
'[
  {"id": "A", "text": "Transferir a responsabilidade do paciente da UBS para o CAPS."},
  {"id": "B", "text": "Suporte técnico-pedagógico ofertado por equipes especializadas (ex: CAPS) às equipes de Atenção Básica, para ampliar a resolutividade do cuidado."},
  {"id": "C", "text": "Uma tabela de horários de medicação."},
  {"id": "D", "text": "A criação de uma matriz de risco hospitalar."},
  {"id": "E", "text": "O encaminhamento direto de todos os pacientes para o psiquiatra."}
]', 
'B', 
'Matriciamento não é encaminhamento. É uma forma de trabalho conjunto (discussão de casos, atendimento compartilhado) entre especialistas e generalistas para qualificar o cuidado no território.'),


-- ADMINISTRAÇÃO EM ENFERMAGEM (5 Questões Inéditas)
('Administração em Enfermagem', 'Enfermagem Pro', 'No ciclo PDCA, ferramenta utilizada na gestão da qualidade, a etapa "A" (Act/Agir) refere-se a:', 
'[
  {"id": "A", "text": "Executar o plano de ação definido."},
  {"id": "B", "text": "Verificar se os resultados foram alcançados."},
  {"id": "C", "text": "Planejar as metas e métodos."},
  {"id": "D", "text": "Agir corretivamente para padronizar o acerto ou corrigir o desvio encontrado na verificação."},
  {"id": "E", "text": "Analisar os custos."}
]', 
'D', 
'PDCA: Plan (Planejar), Do (Executar), Check (Verificar), Act (Agir/Padronizar). O "Act" acontece após a checagem, para consolidar o ganho ou corrigir o rumo.'),

('Administração em Enfermagem', 'Enfermagem Pro', 'Qual teoria administrativa dá ênfase à "estrutura organizacional", autoridade e responsabilidade, tendo Henri Fayol como principal expoente?', 
'[
  {"id": "A", "text": "Teoria das Relações Humanas."},
  {"id": "B", "text": "Teoria da Burocracia."},
  {"id": "C", "text": "Teoria Clássica."},
  {"id": "D", "text": "Administração Científica (Taylorismo)."},
  {"id": "E", "text": "Teoria Contingencial."}
]', 
'C', 
'A Teoria Clássica (Fayol) foca na estrutura e nas funções administrativas (prever, organizar, comandar, coordenar e controlar) para aumentar a eficiência.'),

('Administração em Enfermagem', 'Enfermagem Pro', 'O índice que mede a frequência de ausências dos funcionários ao trabalho (faltas justificadas ou não) é chamado de:', 
'[
  {"id": "A", "text": "Turnover (Rotatividade)."},
  {"id": "B", "text": "Absenteísmo."},
  {"id": "C", "text": "Produtividade."},
  {"id": "D", "text": "Presenteísmo."},
  {"id": "E", "text": "Taxa de ocupação."}
]', 
'B', 
'Absenteísmo é a ausência do trabalhador quando ele deveria estar trabalhando. O Turnover mede a rotatividade (admissões/demissões).'),

('Administração em Enfermagem', 'Enfermagem Pro', 'Na escala de dimensionamento de pessoal, o "Índice de Segurança Técnico" (IST) serve para:', 
'[
  {"id": "A", "text": "Garantir que os técnicos usem EPI."},
  {"id": "B", "text": "Cobrir ausências previstas (férias, folgas) e não previstas (faltas, licenças) da equipe."},
  {"id": "C", "text": "Medir a segurança do paciente."},
  {"id": "D", "text": "Calcular o salário da equipe."},
  {"id": "E", "text": "Definir o número de leitos da UTI."}
]', 
'B', 
'O IST é um percentual acrescido ao quantitativo de pessoal calculado para cobrir as ausências legais e eventuais, garantindo que o serviço não fique descoberto.'),

('Administração em Enfermagem', 'Enfermagem Pro', 'A "Acreditação Hospitalar" é um processo:', 
'[
  {"id": "A", "text": "Obrigatório e fiscalizatório do governo."},
  {"id": "B", "text": "Voluntário, periódico e reservado, visando a melhoria da qualidade e segurança do paciente."},
  {"id": "C", "text": "Punitivo para hospitais com erro médico."},
  {"id": "D", "text": "Exclusivo para hospitais privados de luxo."},
  {"id": "E", "text": "Realizado pelo COREN."}
]', 
'B', 
'Acreditação (ex: ONA) é um método voluntário de avaliação de qualidade. Não é fiscalização (como a Vigilância Sanitária), mas sim um selo de qualidade e segurança.'),


-- CENTRO CIRÚRGICO E CME (5 Questões Inéditas)
('Centro Cirúrgico e CME', 'Enfermagem Pro', 'Para a limpeza de materiais com lúmen (canulados) e conformação complexa na CME, o equipamento automatizado mais indicado é:', 
'[
  {"id": "A", "text": "Autoclave gravitacional."},
  {"id": "B", "text": "Lavadora termodesinfetadora."},
  {"id": "C", "text": "Lavadora ultrassônica."},
  {"id": "D", "text": "Estufa."},
  {"id": "E", "text": "Secadora de ar comprimido."}
]', 
'C', 
'A lavadora ultrassônica utiliza ondas sonoras que criam microbolhas (cavitação) que implodem e removem a sujeira de áreas de difícil acesso, como o interior de cânulas.'),

('Centro Cirúrgico e CME', 'Enfermagem Pro', 'O detergente enzimático utilizado na limpeza de instrumentais cirúrgicos tem como função principal:', 
'[
  {"id": "A", "text": "Esterilizar o material a frio."},
  {"id": "B", "text": "Decompor a matéria orgânica (proteínas, gorduras) facilitando sua remoção."},
  {"id": "C", "text": "Lubrificar as articulações das pinças."},
  {"id": "D", "text": "Proteger contra ferrugem."},
  {"id": "E", "text": "Matar o vírus do HIV."}
]', 
'B', 
'As enzimas (proteases, lipases, amilases) quebram as cadeias de matéria orgânica, soltando a sujeira do instrumental e facilitando a limpeza mecânica.'),

('Centro Cirúrgico e CME', 'Enfermagem Pro', 'Qual é a validade da esterilização de um pacote de material, segundo as normas atuais focadas em "eventos-relacionados"?', 
'[
  {"id": "A", "text": "Sempre 7 dias."},
  {"id": "B", "text": "Sempre 30 dias."},
  {"id": "C", "text": "Indeterminada, desde que a embalagem se mantenha íntegra, seca e limpa (manutenção da barreira estéril)."},
  {"id": "D", "text": "24 horas."},
  {"id": "E", "text": "6 meses exatos."}
]', 
'C', 
'Atualmente, considera-se que a esterilidade é mantida pelo evento (integridade da embalagem), não apenas pelo tempo. Se a embalagem rasgar, molhar ou abrir, perde a validade imediatamente.'),

('Centro Cirúrgico e CME', 'Enfermagem Pro', 'Na Sala de Recuperação Pós-Anestésica (SRPA), o principal risco imediato para um paciente extubado ainda sonolento é:', 
'[
  {"id": "A", "text": "Infecção da ferida operatória."},
  {"id": "B", "text": "Obstrução de vias aéreas superiores (queda da língua) e hipoxemia."},
  {"id": "C", "text": "Úlcera por pressão."},
  {"id": "D", "text": "Hiperglicemia."},
  {"id": "E", "text": "Constipação intestinal."}
]', 
'B', 
'O relaxamento muscular residual e a sedação podem fazer a língua obstruir a faringe. Manter vias aéreas pérvias é a prioridade número 1 na SRPA.'),

('Centro Cirúrgico e CME', 'Enfermagem Pro', 'O Glutaraldeído, antigamente muito usado para esterilização química, tem seu uso restrito atualmente devido a:', 
'[
  {"id": "A", "text": "Alto custo."},
  {"id": "B", "text": "Baixa eficácia contra bactérias."},
  {"id": "C", "text": "Toxicidade ocupacional (vapores tóxicos, irritantes e carcinogênicos)."},
  {"id": "D", "text": "Corrosão de plásticos."},
  {"id": "E", "text": "Não funcionar em temperatura ambiente."}
]', 
'C', 
'O glutaraldeído é tóxico para o trabalhador. Normas atuais exigem exaustão adequada e restringem seu uso, preferindo-se ácido peracético ou métodos físicos.'),


-- SAÚDE DO TRABALHADOR (5 Questões Inéditas)
('Saúde do Trabalhador', 'Enfermagem Pro', 'O Mapa de Risco é uma representação gráfica dos riscos ocupacionais. A cor VERDE no mapa representa qual tipo de risco?', 
'[
  {"id": "A", "text": "Risco Biológico."},
  {"id": "B", "text": "Risco Químico."},
  {"id": "C", "text": "Risco Físico."},
  {"id": "D", "text": "Risco Ergonômico."},
  {"id": "E", "text": "Risco de Acidentes (Mecânico)."}
]', 
'C', 
'Cores padrão: Verde = Físico (ruído, calor); Vermelho = Químico; Marrom = Biológico; Amarelo = Ergonômico; Azul = Acidentes.'),

('Saúde do Trabalhador', 'Enfermagem Pro', 'O que significa a sigla PPRA, programa obrigatório substituído recentemente pelo PGR (Programa de Gerenciamento de Riscos)?', 
'[
  {"id": "A", "text": "Programa de Prevenção de Riscos Ambientais."},
  {"id": "B", "text": "Programa de Proteção Respiratória Avançada."},
  {"id": "C", "text": "Plano de Prevenção de Ressuscitação e Acidentes."},
  {"id": "D", "text": "Programa de Pagamento de Risco Adicional."},
  {"id": "E", "text": "Perfil Profissiográfico de Risco Ambiental."}
]', 
'A', 
'O PPRA visava a preservação da saúde e integridade dos trabalhadores através da antecipação, reconhecimento, avaliação e controle dos riscos ambientais.'),

('Saúde do Trabalhador', 'Enfermagem Pro', 'Em caso de exposição ocupacional a material biológico (ex: picada de agulha com sangue de paciente HIV positivo), a quimioprofilaxia (PEP) tem eficácia garantida?', 
'[
  {"id": "A", "text": "Sim, 100% de eficácia se tomada em 24h."},
  {"id": "B", "text": "Não há garantia de 100%, mas reduz drasticamente o risco de soroconversão se iniciada precocemente (idealmente 2h)."},
  {"id": "C", "text": "Só funciona se o acidente for profundo."},
  {"id": "D", "text": "Não tem eficácia, serve apenas como placebo."},
  {"id": "E", "text": "Garante imunidade permanente."}
]', 
'B', 
'A PEP não é vacina e não garante 100% de proteção, mas é a medida mais eficaz para evitar a infecção após o contato. O tempo é crucial.'),

('Saúde do Trabalhador', 'Enfermagem Pro', 'A NR-32 determina que as gestantes devem ser afastadas de atividades que envolvam exposição a:', 
'[
  {"id": "A", "text": "Qualquer paciente."},
  {"id": "B", "text": "Computadores."},
  {"id": "C", "text": "Radiações Ionizantes (Raio-X, Tomografia) e quimioterápicos antineoplásicos."},
  {"id": "D", "text": "Ruídos moderados."},
  {"id": "E", "text": "Trabalho noturno apenas."}
]', 
'C', 
'Radiações ionizantes e quimioterápicos são teratogênicos e mutagênicos, oferecendo risco grave ao feto. O afastamento ou remanejamento é obrigatório.'),

('Saúde do Trabalhador', 'Enfermagem Pro', 'Qual é a principal via de transmissão ocupacional da Tuberculose para os profissionais de saúde?', 
'[
  {"id": "A", "text": "Picada de agulha."},
  {"id": "B", "text": "Contato da pele com escarro."},
  {"id": "C", "text": "Inalação de aerossóis (núcleos de Wells) suspensos no ar."},
  {"id": "D", "text": "Ingestão de alimentos contaminados no refeitório."},
  {"id": "E", "text": "Contato com sangue."}
]', 
'C', 
'A TB é transmitida pelo ar. O risco é maior em procedimentos que geram aerossóis (aspiração, intubação, indução de escarro) se o profissional não usar máscara PFF2/N95.'),


-- IMUNIZAÇÃO (5 Questões Inéditas)
('Imunização', 'Enfermagem Pro', 'Qual o intervalo mínimo recomendado entre a administração de duas vacinas de VÍRUS VIVO injetável (ex: Tríplice Viral e Febre Amarela), se não forem aplicadas no mesmo dia?', 
'[
  {"id": "A", "text": "7 dias."},
  {"id": "B", "text": "14 dias."},
  {"id": "C", "text": "15 dias."},
  {"id": "D", "text": "30 dias."},
  {"id": "E", "text": "60 dias."}
]', 
'D', 
'Vacinas de vírus vivo atenuado injetáveis devem ser dadas no mesmo dia ou com intervalo mínimo de 30 dias para evitar a interferência imunológica (o sistema imune ativado pela primeira pode "matar" a segunda antes dela fazer efeito).'),

('Imunização', 'Enfermagem Pro', 'O bloqueio vacinal é uma estratégia utilizada em surtos de Sarampo. A vacina deve ser realizada preferencialmente em até quanto tempo após o contato com o caso suspeito?', 
'[
  {"id": "A", "text": "24 horas."},
  {"id": "B", "text": "48 horas."},
  {"id": "C", "text": "72 horas."},
  {"id": "D", "text": "5 dias."},
  {"id": "E", "text": "7 dias."}
]', 
'C', 
'A vacina de bloqueio para Sarampo deve ser feita em até 72 horas (3 dias) após a exposição para tentar impedir o desenvolvimento da doença ou atenuar os sintomas.'),

('Imunização', 'Enfermagem Pro', 'Qual imunobiológico é indicado para recém-nascidos de mães portadoras de Hepatite B (HBsAg positivo), além da vacina, para prevenir a transmissão vertical?', 
'[
  {"id": "A", "text": "Imunoglobulina Humana Anti-Hepatite B (IGHAHB)."},
  {"id": "B", "text": "Soro Antitetânico."},
  {"id": "C", "text": "Antibiótico profilático."},
  {"id": "D", "text": "Apenas a vacina em dose dupla."},
  {"id": "E", "text": "Transfusão de sangue."}
]', 
'A', 
'O recém-nascido deve receber a vacina E a imunoglobulina específica (em membros diferentes) nas primeiras 12 horas de vida para máxima eficácia na prevenção da hepatite B crônica.'),

('Imunização', 'Enfermagem Pro', 'A vacina HPV quadrivalente previne contra:', 
'[
  {"id": "A", "text": "Apenas verrugas genitais."},
  {"id": "B", "text": "Apenas câncer de colo de útero."},
  {"id": "C", "text": "Tipos 6 e 11 (verrugas) e 16 e 18 (câncer de colo, ânus, pênis, orofaringe)."},
  {"id": "D", "text": "Herpes genital e Sífilis."},
  {"id": "E", "text": "HIV e Hepatite B."}
]', 
'C', 
'A vacina HPV disponível no SUS é a quadrivalente, protegendo contra os tipos oncogênicos mais comuns (16 e 18) e os tipos causadores de verrugas genitais (6 e 11).'),

('Imunização', 'Enfermagem Pro', 'Em caso de falha na rede de frio (ex: temperatura da geladeira atingiu +12°C por horas), qual a conduta imediata com as vacinas?', 
'[
  {"id": "A", "text": "Descartar tudo no lixo comum."},
  {"id": "B", "text": "Aplicar as vacinas rapidamente para não perder."},
  {"id": "C", "text": "Comunicar a instância superior, manter as vacinas na temperatura recomendada (com gelo reciclável) e aguardar parecer sobre a utilização."},
  {"id": "D", "text": "Recongelar as vacinas."},
  {"id": "E", "text": "Agitar os frascos."}
]', 
'C', 
'Não se descarta nem se usa imediatamente. Deve-se isolar os imunobiológicos, identificar o lote, manter sob refrigeração adequada (caixa térmica) e preencher o formulário de alteração de temperatura para avaliação da Vigilância/Nível Superior.')

ON CONFLICT (question) DO NOTHING;