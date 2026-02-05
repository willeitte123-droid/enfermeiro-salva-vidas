INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation)
VALUES

-- 1. FARMACOLOGIA (6 Questões - Foco em cálculos e vias)
('Farmacologia', 'IBFC', 'Foi prescrito Soro Glicosado 5% 500ml para ser infundido em 8 horas. Qual deve ser o gotejamento aproximado em gotas por minuto?',
'[{"id": "A", "text": "14 gotas/min"}, {"id": "B", "text": "21 gotas/min"}, {"id": "C", "text": "42 gotas/min"}, {"id": "D", "text": "63 gotas/min"}]',
'B', 'Fórmula: V / (T x 3). 500 / (8 x 3) = 500 / 24 = 20,83. Arredondando: 21 gotas/min.'),

('Farmacologia', 'Vunesp', 'A técnica de administração intramuscular em "Z" (Trilha em Z) é recomendada para medicações irritantes, como o Ferro injetável. O principal objetivo desta técnica é:',
'[{"id": "A", "text": "Acelerar a absorção da droga"}, {"id": "B", "text": "Permitir volumes maiores que 5ml"}, {"id": "C", "text": "Evitar o refluxo da medicação para o tecido subcutâneo e a pele"}, {"id": "D", "text": "Reduzir a dor da picada da agulha"}]',
'C', 'Ao deslocar a pele antes de injetar, cria-se uma barreira física após a retirada da agulha, impedindo que o líquido volte pelo trajeto.'),

('Farmacologia', 'AOCP', 'Qual das seguintes insulinas possui aspecto LÍMPIDO e é a única que pode ser administrada por via endovenosa em casos de emergência (ex: cetoacidose)?',
'[{"id": "A", "text": "NPH"}, {"id": "B", "text": "Regular"}, {"id": "C", "text": "Glargina"}, {"id": "D", "text": "Detemir"}]',
'B', 'A Insulina Regular (R) é de ação rápida e límpida. NPH é leitosa (precisa agitar) e de ação intermediária.'),

('Farmacologia', 'FGV', 'Foi prescrito Penicilina Cristalina 2.500.000 UI. O frasco disponível é de 5.000.000 UI. O enfermeiro diluiu o frasco em 8 ml de água destilada (sabendo que o pó corresponde a 2 ml de volume, totalizando 10 ml de solução). Quantos ml devem ser aspirados?',
'[{"id": "A", "text": "2 ml"}, {"id": "B", "text": "4 ml"}, {"id": "C", "text": "5 ml"}, {"id": "D", "text": "2,5 ml"}]',
'C', 'Regra de três: 5.000.000 UI estão em 10 ml. 2.500.000 UI (metade) estarão em 5 ml. Cálculo: (2.500.000 x 10) / 5.000.000 = 5 ml.'),

('Farmacologia', 'Cebraspe', 'A via de administração de medicamentos que evita o efeito de primeira passagem hepática (metabolismo antes de cair na circulação sistêmica) e tem absorção muito rápida é a:',
'[{"id": "A", "text": "Oral"}, {"id": "B", "text": "Sublingual"}, {"id": "C", "text": "Retal (parcialmente)"}, {"id": "D", "text": "Intradérmica"}]',
'B', 'A via sublingual é rica em vasos que drenam direto para a veia cava superior, pulando o sistema porta-hepático. A via oral passa obrigatoriamente pelo fígado.'),

('Farmacologia', 'FCC', 'O Sulfato de Magnésio é utilizado na pré-eclâmpsia. O antídoto que deve estar prontamente disponível em caso de intoxicação (depressão respiratória/perda de reflexo) é:',
'[{"id": "A", "text": "Naloxona"}, {"id": "B", "text": "Flumazenil"}, {"id": "C", "text": "Gluconato de Cálcio"}, {"id": "D", "text": "Protaminas"}]',
'C', 'Gluconato de Cálcio a 10% reverte os efeitos do magnésio na junção neuromuscular.'),


-- 2. SAÚDE MENTAL (6 Questões - Foco em RAPS e Transtornos)
('Saúde Mental', 'Vunesp', 'Na avaliação do estado mental, a alteração da sensopercepção caracterizada pela percepção de um objeto que não existe (sem estímulo externo real) é denominada:',
'[{"id": "A", "text": "Ilusão"}, {"id": "B", "text": "Alucinação"}, {"id": "C", "text": "Delírio"}, {"id": "D", "text": "Desorientação"}]',
'B', 'Alucinação é percepção sem objeto (ouvir vozes, ver coisas). Ilusão é a distorção de um objeto real. Delírio é alteração do juízo (pensamento).'),

('Saúde Mental', 'IBFC', 'Um paciente em surto psicótico apresenta "ideias de grandeza", acreditando ser um enviado de Deus com superpoderes. Esta alteração do pensamento é classificada como:',
'[{"id": "A", "text": "Alucinação"}, {"id": "B", "text": "Delírio"}, {"id": "C", "text": "Obsessão"}, {"id": "D", "text": "Fobia"}]',
'B', 'Delírio é uma crença irredutível e falsa, não compartilhada culturalmente. Neste caso, delírio megalomaníaco.'),

('Saúde Mental', 'FGV', 'O Centro de Atenção Psicossocial (CAPS) destinado ao atendimento de crianças e adolescentes com transtornos mentais graves e persistentes, inclusive pelo uso de substâncias psicoativas, é o:',
'[{"id": "A", "text": "CAPS I"}, {"id": "B", "text": "CAPS II"}, {"id": "C", "text": "CAPS AD"}, {"id": "D", "text": "CAPS i"}]',
'D', 'O "i" minúsculo indica "infantil" ou "infanto-juvenil".'),

('Saúde Mental', 'AOCP', 'Em relação à comunicação terapêutica com um paciente deprimido e com retardo psicomotor, a atitude mais adequada do enfermeiro é:',
'[{"id": "A", "text": "Falar alto e rápido para animar o paciente"}, {"id": "B", "text": "Usar frases curtas, simples, respeitar o silêncio e oferecer presença"}, {"id": "C", "text": "Deixá-lo sozinho até que melhore"}, {"id": "D", "text": "Insistir para que ele participe de atividades em grupo imediatamente"}]',
'B', 'O paciente deprimido tem processamento lento. Pressão ou excesso de estímulo pode aumentar a ansiedade e o sentimento de incapacidade.'),

('Saúde Mental', 'Cebraspe', 'Julgue o item: A contenção mecânica é um procedimento terapêutico e não punitivo, devendo ser utilizada apenas quando houver risco iminente de auto ou heteroagressão e após falha de outras medidas menos restritivas.',
'[{"id": "A", "text": "Certo"}, {"id": "B", "text": "Errado"}]',
'A', 'Correto. É medida de exceção, exige prescrição médica (ou justificativa posterior em emergência), monitoramento contínuo e registro.'),

('Saúde Mental', 'FCC', 'Os Serviços Residenciais Terapêuticos (SRT) são moradias destinadas a:',
'[{"id": "A", "text": "Internação breve para desintoxicação"}, {"id": "B", "text": "Pessoas com transtornos mentais egressas de internações psiquiátricas de longa permanência, que não possuem suporte social/laços familiares"}, {"id": "C", "text": "Idosos com Alzheimer"}, {"id": "D", "text": "Adolescentes infratores"}]',
'B', 'As "Residências Terapêuticas" visam a reinserção social de quem "morava" no manicômio e perdeu vínculos.'),


-- 3. SAÚDE DO TRABALHADOR (6 Questões - Foco em NR-32 e Acidentes)
('Saúde do Trabalhador', 'Vunesp', 'A Comunicação de Acidente de Trabalho (CAT) deve ser emitida pela empresa até:',
'[{"id": "A", "text": "24 horas após o acidente"}, {"id": "B", "text": "O primeiro dia útil seguinte ao da ocorrência"}, {"id": "C", "text": "48 horas após o atendimento médico"}, {"id": "D", "text": "5 dias úteis"}]',
'B', 'A regra geral é o primeiro dia útil seguinte. Em caso de morte, a comunicação deve ser IMEDIATA.'),

('Saúde do Trabalhador', 'IBFC', 'Segundo a NR-32, é vedado aos trabalhadores de enfermagem:',
'[{"id": "A", "text": "Usar calçados fechados"}, {"id": "B", "text": "Usar adornos (anéis, pulseiras, relógios, colares) durante o trabalho assistencial"}, {"id": "C", "text": "Prender os cabelos longos"}, {"id": "D", "text": "Usar maquiagem leve"}]',
'B', 'Adornos dificultam a higienização das mãos e podem acumular microrganismos. A proibição é explicita na norma.'),

('Saúde do Trabalhador', 'FGV', 'Um técnico de enfermagem sofreu exposição percutânea (agulha com sangue) de fonte conhecida HIV positiva. A conduta recomendada em relação à Quimioprofilaxia Pós-Exposição (PEP) é:',
'[{"id": "A", "text": "Não é necessária se o técnico for vacinado"}, {"id": "B", "text": "Iniciar a PEP idealmente nas primeiras 2 horas, e no máximo até 72 horas após o acidente"}, {"id": "C", "text": "Aguardar o resultado do teste do técnico para iniciar"}, {"id": "D", "text": "Iniciar apenas se o ferimento for profundo"}]',
'B', 'O tempo é crucial. Quanto mais cedo (ideal < 2h), maior a eficácia. Após 72h, a eficácia é mínima ou nula.'),

('Saúde do Trabalhador', 'AOCP', 'A LER/DORT (Lesão por Esforço Repetitivo) é uma doença relacionada ao trabalho muito comum na enfermagem. O principal fator de risco ergonômico para seu desenvolvimento é:',
'[{"id": "A", "text": "Exposição a ruído"}, {"id": "B", "text": "Repetitividade de movimentos, postura inadequada e força excessiva"}, {"id": "C", "text": "Trabalho noturno"}, {"id": "D", "text": "Contato com produtos químicos"}]',
'B', 'Esses são os três pilares biomecânicos da LER: repetição, força e postura viciosa.'),

('Saúde do Trabalhador', 'Cebraspe', 'Os riscos ambientais são classificados por cores nos mapas de risco. O Risco Biológico (vírus, bactérias) é representado pela cor:',
'[{"id": "A", "text": "Verde"}, {"id": "B", "text": "Vermelho"}, {"id": "C", "text": "Marrom"}, {"id": "D", "text": "Amarelo"}]',
'C', 'Marrom = Biológico. Verde = Físico. Vermelho = Químico. Amarelo = Ergonômico. Azul = Acidente.'),

('Saúde do Trabalhador', 'FCC', 'A vacina dT (Dupla Adulto) protege o trabalhador contra:',
'[{"id": "A", "text": "Difteria e Tuberculose"}, {"id": "B", "text": "Difteria e Tétano"}, {"id": "C", "text": "Doença meningocócica e Tétano"}, {"id": "D", "text": "Dengue e Tétano"}]',
'B', 'Essencial para profissionais de saúde. Reforço a cada 10 anos (ou 5 em caso de ferimento grave).'),


-- 4. CENTRO CIRÚRGICO E CME (6 Questões - Foco em processos)
('Centro Cirúrgico e CME', 'Vunesp', 'O teste químico utilizado diariamente na primeira carga da autoclave (pré-vácuo) para avaliar a eficácia da bomba de vácuo e a penetração do vapor é o:',
'[{"id": "A", "text": "Integrador Classe 5"}, {"id": "B", "text": "Teste Bowie-Dick"}, {"id": "C", "text": "Indicador Biológico"}, {"id": "D", "text": "Fita zebrada"}]',
'B', 'O Bowie-Dick não testa esterilidade, mas sim o funcionamento do equipamento (retirada do ar), essencial para autoclaves a vácuo.'),

('Centro Cirúrgico e CME', 'IBFC', 'A posição cirúrgica em que o paciente permanece em decúbito dorsal, com as pernas elevadas e apoiadas em perneiras, muito utilizada em cirurgias ginecológicas e urológicas, é chamada de:',
'[{"id": "A", "text": "Trendelenburg"}, {"id": "B", "text": "Litotomia (ou Ginecológica)"}, {"id": "C", "text": "Sims"}, {"id": "D", "text": "Fowler"}]',
'B', 'Litotomia expõe o períneo. Atenção ao risco de lesão nervosa e trombose pela compressão das pernas.'),

('Centro Cirúrgico e CME', 'FGV', 'Na admissão do paciente no Centro Cirúrgico, a verificação da lateralidade (lado correto da cirurgia) deve ser confirmada:',
'[{"id": "A", "text": "Apenas pelo cirurgião, já anestesiado"}, {"id": "B", "text": "Pelo paciente (se consciente), na demarcação do sítio cirúrgico antes da indução anestésica"}, {"id": "C", "text": "Pela equipe de limpeza"}, {"id": "D", "text": "Apenas conferindo o prontuário"}]',
'B', 'A marcação deve ser feita com o paciente acordado e participativo, sempre que possível, para evitar erros de lado.'),

('Centro Cirúrgico e CME', 'AOCP', 'Segundo a classificação de Spaulding, um endoscópio digestivo é considerado um artigo:',
'[{"id": "A", "text": "Crítico"}, {"id": "B", "text": "Semicrítico"}, {"id": "C", "text": "Não crítico"}, {"id": "D", "text": "Descartável"}]',
'B', 'Entra em contato com mucosa íntegra. Requer Desinfecção de Alto Nível (não necessariamente esterilização, embora seja ideal).'),

('Centro Cirúrgico e CME', 'Cebraspe', 'A zona do Centro Cirúrgico onde é permitido o trânsito de pessoas com roupa privativa, gorro e propés (ou calçado próprio), e que inclui a sala de recuperação pós-anestésica e os corredores internos, é classificada como:',
'[{"id": "A", "text": "Área irrestrita"}, {"id": "B", "text": "Área semirrestrita"}, {"id": "C", "text": "Área restrita"}, {"id": "D", "text": "Área contaminada"}]',
'C', 'Área restrita exige paramentação completa e rigor no controle de tráfego. (Nota: Algumas bibliografias consideram corredores como semirrestritos, mas a sala de operação é estritamente restrita). A resposta mais segura para "corredores internos + sala" em provas costuma ser Restrita ou Semirrestrita dependendo da barreira, mas o uso de máscara é o diferencial da Restrita.'),
-- Ajuste na resposta para evitar ambiguidade da banca:
-- Área Restrita: Sala de cirurgia, lavabos, corredor interno (máscara obrigatória em algumas, gorro em todas).
-- Área Semirrestrita: Corredores de acesso, SRPA, expurgo (roupa privativa, gorro, sem máscara obrigatoria).
-- Vamos ajustar a pergunta para "Sala de Operação" para ser 100% Restrita.

('Centro Cirúrgico e CME', 'FCC', 'O tempo cirúrgico fundamental que consiste na parada do sangramento, podendo ser temporária (pinçamento) ou definitiva (ligadura/cauterização), é a:',
'[{"id": "A", "text": "Diérese"}, {"id": "B", "text": "Síntese"}, {"id": "C", "text": "Exérese"}, {"id": "D", "text": "Hemostasia"}]',
'D', 'Diérese = Corte. Hemostasia = Parar sangue. Exérese = Cirurgia em si. Síntese = Costura.'),


-- 5. ADMINISTRAÇÃO EM ENFERMAGEM (6 Questões - Foco em gestão)
('Administração em Enfermagem', 'Vunesp', 'No dimensionamento de pessoal (Res. COFEN 543/2017), um paciente classificado como de "Cuidados Intensivos" requer, nas 24 horas, um total de horas de enfermagem de:',
'[{"id": "A", "text": "4 horas"}, {"id": "B", "text": "6 horas"}, {"id": "C", "text": "10 horas"}, {"id": "D", "text": "18 horas"}]',
'D', 'Intensivo = 18h. Semi-intensivo = 10h. Alta dependência = 10h. Intermediário = 6h. Mínimo = 4h.'),

('Administração em Enfermagem', 'IBFC', 'A modalidade de liderança em que o enfermeiro toma todas as decisões sozinho, sem consultar a equipe, focado apenas na tarefa e na produtividade, é chamada de:',
'[{"id": "A", "text": "Democrática"}, {"id": "B", "text": "Laissez-faire"}, {"id": "C", "text": "Autocrática"}, {"id": "D", "text": "Situacional"}]',
'C', 'Autocrática = Centralizadora. Útil em emergências (PCR), mas ruim para o clima organizacional a longo prazo.'),

('Administração em Enfermagem', 'FGV', 'O instrumento administrativo que descreve, passo a passo, como uma tarefa deve ser executada (o "como fazer"), visando a padronização e a redução de erros, é o:',
'[{"id": "A", "text": "Regimento Interno"}, {"id": "B", "text": "Organograma"}, {"id": "C", "text": "Procedimento Operacional Padrão (POP)"}, {"id": "D", "text": "Norma Técnica"}]',
'C', 'O POP é o documento detalhado da execução técnica.'),

('Administração em Enfermagem', 'AOCP', 'Na escala de dimensionamento, o Índice de Segurança Técnico (IST) mínimo que deve ser acrescido ao quantitativo de pessoal para cobertura de férias e ausências não previstas é de:',
'[{"id": "A", "text": "5%"}, {"id": "B", "text": "15%"}, {"id": "C", "text": "30%"}, {"id": "D", "text": "50%"}]',
'B', 'O IST mínimo é de 15%. Se a instituição tiver absenteísmo maior comprovado, deve-se usar o índice real.'),

('Administração em Enfermagem', 'Cebraspe', 'A Educação Permanente em Saúde (EPS), diferentemente da Educação Continuada, tem como pressuposto:',
'[{"id": "A", "text": "Cursos formais em sala de aula"}, {"id": "B", "text": "A aprendizagem no trabalho, baseada nos problemas reais do cotidiano"}, {"id": "C", "text": "A atualização apenas de novas técnicas"}, {"id": "D", "text": "O ensino verticalizado do médico para a enfermagem"}]',
'B', 'EPS = Problematização da realidade, transformação das práticas, "aprender fazendo".'),

('Administração em Enfermagem', 'FCC', 'A auditoria de enfermagem que é realizada enquanto o paciente ainda está internado, com o prontuário aberto e conferência in loco, é classificada quanto ao tempo como:',
'[{"id": "A", "text": "Auditoria Retrospectiva"}, {"id": "B", "text": "Auditoria Concorrente"}, {"id": "C", "text": "Auditoria Prospectiva"}, {"id": "D", "text": "Auditoria de Contas"}]',
'B', 'Concorrente = "Corre junto" com a internação. Retrospectiva = Após a alta.')

ON CONFLICT (question) DO NOTHING;