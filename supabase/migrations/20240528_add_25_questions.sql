-- Inserção de Novas Questões para balancear a banca

INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES
-- BIOSSEGURANÇA E CONTROLE DE INFECÇÃO (5 Questões)
(
  'Biossegurança e Controle de Infecção',
  'Sobre a higienização das mãos, de acordo com a ANVISA, é correto afirmar que:',
  '[{"id": "A", "text": "O uso de luvas substitui a necessidade de higienização das mãos em procedimentos semicríticos."}, {"id": "B", "text": "A higienização simples das mãos deve durar no mínimo 3 minutos."}, {"id": "C", "text": "O álcool a 70% pode ser utilizado em substituição à água e sabonete quando as mãos não estiverem visivelmente sujas."}, {"id": "D", "text": "A higienização antisséptica (com degermante) é obrigatória antes de tocar qualquer paciente."}, {"id": "E", "text": "Deve-se utilizar água quente para melhor remoção das bactérias."}]'::jsonb,
  'C',
  'Segundo a ANVISA e OMS, a fricção antisséptica com preparações alcoólicas é a preferencial quando as mãos não estiverem visivelmente sujas, por ser mais rápida e eficaz.',
  'ANVISA'
),
(
  'Biossegurança e Controle de Infecção',
  'Para um paciente com diagnóstico confirmado de Tuberculose Pulmonar Bacilífera, qual o tipo de precaução e o EPI obrigatório para o profissional?',
  '[{"id": "A", "text": "Precaução de Contato e Luvas estéreis."}, {"id": "B", "text": "Precaução Padrão e Máscara Cirúrgica."}, {"id": "C", "text": "Precaução de Gotículas e Máscara Cirúrgica."}, {"id": "D", "text": "Precaução para Aerossóis e Máscara PFF2 (N95)."}, {"id": "E", "text": "Precaução Reversa e Avental impermeável."}]'::jsonb,
  'D',
  'A Tuberculose é transmitida por aerossóis (partículas < 5 micra). O profissional deve usar máscara N95/PFF2 e o paciente deve ficar em quarto privativo (pressão negativa idealmente).',
  'EBSERH'
),
(
  'Biossegurança e Controle de Infecção',
  'Conforme a classificação de Spaulding, um endoscópio digestivo é considerado um artigo:',
  '[{"id": "A", "text": "Crítico, exigindo esterilização."}, {"id": "B", "text": "Não crítico, exigindo limpeza apenas."}, {"id": "C", "text": "Semicrítico, exigindo desinfecção de alto nível."}, {"id": "D", "text": "Semicrítico, exigindo esterilização obrigatória."}, {"id": "E", "text": "Crítico, exigindo desinfecção de nível intermediário."}]'::jsonb,
  'C',
  'Artigos semicríticos entram em contato com mucosa íntegra ou pele não intacta. Requerem, no mínimo, desinfecção de alto nível (embora a esterilização seja desejável, não é obrigatória se não invadir tecidos estéreis).',
  'VUNESP'
),
(
  'Biossegurança e Controle de Infecção',
  'O tempo recomendado para a fricção das mãos com preparação alcoólica é de:',
  '[{"id": "A", "text": "10 a 20 segundos."}, {"id": "B", "text": "20 a 30 segundos."}, {"id": "C", "text": "40 a 60 segundos."}, {"id": "D", "text": "1 a 2 minutos."}, {"id": "E", "text": "3 a 5 minutos."}]'::jsonb,
  'B',
  'Para a higiene com água e sabonete, o tempo é de 40-60 segundos. Para a fricção com álcool (álcool gel), o tempo é de 20-30 segundos.',
  'OMS'
),
(
  'Biossegurança e Controle de Infecção',
  'Em relação ao descarte de resíduos de saúde (RDC 222/2018), as agulhas e lâminas de bisturi devem ser descartadas em:',
  '[{"id": "A", "text": "Saco branco leitoso."}, {"id": "B", "text": "Saco laranja."}, {"id": "C", "text": "Saco vermelho."}, {"id": "D", "text": "Recipiente rígido com tampa (Grupo E)."}, {"id": "E", "text": "Saco preto comum."}]'::jsonb,
  'D',
  'Perfurocortantes pertencem ao Grupo E e devem ser descartados em recipientes rígidos, resistentes à punctura e vazamento (ex: Descarpack).',
  'ANVISA'
),

-- ÉTICA E LEGISLAÇÃO (5 Questões)
(
  'Ética e Legislação',
  'Segundo a Lei 7.498/86, a prescrição da assistência de enfermagem é atividade privativa do:',
  '[{"id": "A", "text": "Técnico de Enfermagem."}, {"id": "B", "text": "Enfermeiro."}, {"id": "C", "text": "Médico."}, {"id": "D", "text": "Auxiliar de Enfermagem."}, {"id": "E", "text": "Equipe multiprofissional."}]'::jsonb,
  'B',
  'O Art. 11 da Lei do Exercício Profissional define que a Consulta de Enfermagem e a Prescrição da Assistência são privativas do Enfermeiro.',
  'COFEN'
),
(
  'Ética e Legislação',
  'De acordo com o Código de Ética (Res. COFEN 564/2017), a penalidade de Cassação do direito ao exercício profissional é competência exclusiva do:',
  '[{"id": "A", "text": "Coren."}, {"id": "B", "text": "Cofen."}, {"id": "C", "text": "Sindicato."}, {"id": "D", "text": "Empregador."}, {"id": "E", "text": "Ministério Público."}]'::jsonb,
  'B',
  'As penalidades de Advertência, Multa, Censura e Suspensão são aplicadas pelos Conselhos Regionais (Coren). A Cassação é competência exclusiva do Conselho Federal (Cofen).',
  'COFEN'
),
(
  'Ética e Legislação',
  'Um técnico de enfermagem administra uma medicação por via errada por desconhecimento da técnica, causando dano ao paciente. Isso configura:',
  '[{"id": "A", "text": "Negligência."}, {"id": "B", "text": "Imprudência."}, {"id": "C", "text": "Imperícia."}, {"id": "D", "text": "Dolo."}, {"id": "E", "text": "Infração Leve."}]'::jsonb,
  'C',
  'Imperícia é a falta de conhecimento técnico, habilidade ou preparo prático para realizar determinada função.',
  'IBFC'
),
(
  'Ética e Legislação',
  'É um direito do profissional de enfermagem, segundo o Código de Ética:',
  '[{"id": "A", "text": "Executar atividades que não sejam de sua competência técnica."}, {"id": "B", "text": "Negar assistência em casos de urgência."}, {"id": "C", "text": "Recusar-se a executar atividades que não ofereçam segurança ao profissional."}, {"id": "D", "text": "Delegar atividades privativas do enfermeiro ao técnico."}, {"id": "E", "text": "Assinar ações que não executou."}]'::jsonb,
  'C',
  'O Art. 22 garante o direito de recusar-se a executar atividades que não ofereçam segurança ao profissional ou à pessoa/família.',
  'COFEN'
),
(
  'Ética e Legislação',
  'A anotação de enfermagem deve ser realizada:',
  '[{"id": "A", "text": "A lápis, para permitir correções."}, {"id": "B", "text": "Apenas no final do plantão."}, {"id": "C", "text": "De forma cronológica, legível, sem rasuras e assinada."}, {"id": "D", "text": "Pelo enfermeiro chefe, baseada no relato da equipe."}, {"id": "E", "text": "Apenas se houver intercorrências graves."}]'::jsonb,
  'C',
  'O registro deve ser claro, objetivo, cronológico, legível, sem rasuras e conter a identificação do profissional (carimbo/assinatura).',
  'FGV'
),

-- SAÚDE DO TRABALHADOR (5 Questões)
(
  'Saúde do Trabalhador',
  'Conforme a NR-32, é vedado ao trabalhador de saúde:',
  '[{"id": "A", "text": "Utilizar calçados fechados."}, {"id": "B", "text": "Usar adornos (anéis, pulseiras, relógios)."}, {"id": "C", "text": "Prender os cabelos longos."}, {"id": "D", "text": "Lavar as mãos antes e depois dos procedimentos."}, {"id": "E", "text": "Usar óculos de proteção."}]'::jsonb,
  'B',
  'A NR-32 proíbe o uso de adornos por profissionais que mantenham contato com agentes biológicos, pois dificultam a higienização e acumulam microrganismos.',
  'MTE'
),
(
  'Saúde do Trabalhador',
  'Em caso de acidente com material biológico perfurocortante, a primeira conduta no local do acidente deve ser:',
  '[{"id": "A", "text": "Espremer a lesão para sair o sangue contaminado."}, {"id": "B", "text": "Aplicar torniquete."}, {"id": "C", "text": "Lavar exaustivamente com água e sabão."}, {"id": "D", "text": "Usar hipoclorito de sódio puro."}, {"id": "E", "text": "Iniciar o coquetel anti-HIV imediatamente no local."}]'::jsonb,
  'C',
  'A recomendação é lavar a área com água e sabão. Não se deve espremer (aumenta a área de contato/microlesões) nem usar substâncias cáusticas.',
  'MS'
),
(
  'Saúde do Trabalhador',
  'As vacinas obrigatórias para todo trabalhador de saúde, segundo a NR-32, incluem:',
  '[{"id": "A", "text": "Tétano, Difteria e Hepatite B."}, {"id": "B", "text": "Hepatite A e Meningocócica."}, {"id": "C", "text": "Febre Amarela e Dengue."}, {"id": "D", "text": "HPV e Varicela."}, {"id": "E", "text": "BCG e Rotavírus."}]'::jsonb,
  'A',
  'A NR-32 exige imunização contra Tétano, Difteria (dT) e Hepatite B para todos. Outras vacinas dependem do risco de exposição.',
  'MTE'
),
(
  'Saúde do Trabalhador',
  'Qual é o prazo máximo para emissão da Comunicação de Acidente de Trabalho (CAT) em caso de acidente típico?',
  '[{"id": "A", "text": "Imediatamente."}, {"id": "B", "text": "Até o primeiro dia útil seguinte ao da ocorrência."}, {"id": "C", "text": "Até 48 horas."}, {"id": "D", "text": "Até 5 dias úteis."}, {"id": "E", "text": "Apenas se houver afastamento superior a 15 dias."}]'::jsonb,
  'B',
  'A empresa deve comunicar o acidente até o primeiro dia útil seguinte. Em caso de morte, a comunicação deve ser imediata.',
  'INSS'
),
(
  'Saúde do Trabalhador',
  'A Perda Auditiva Induzida por Ruído (PAIR) relacionada ao trabalho caracteriza-se por ser:',
  '[{"id": "A", "text": "Condutiva e reversível."}, {"id": "B", "text": "Unilateral e aguda."}, {"id": "C", "text": "Neurossensorial, irreversível e geralmente bilateral."}, {"id": "D", "text": "Temporária, melhorando com repouso acústico de 24h."}, {"id": "E", "text": "Causada exclusivamente por vibração."}]'::jsonb,
  'C',
  'A PAIR é uma perda neurossensorial (lesão de células ciliadas), irreversível, progressiva e geralmente acomete ambos os ouvidos (bilateral).',
  'FCC'
),

-- SAE - SISTEMATIZAÇÃO (5 Questões)
(
  'Sistematização da Assistência (SAE)',
  'A etapa do Processo de Enfermagem que envolve a interpretação e agrupamento dos dados coletados para a tomada de decisão é:',
  '[{"id": "A", "text": "Histórico de Enfermagem."}, {"id": "B", "text": "Diagnóstico de Enfermagem."}, {"id": "C", "text": "Planejamento."}, {"id": "D", "text": "Implementação."}, {"id": "E", "text": "Avaliação."}]'::jsonb,
  'B',
  'O Diagnóstico de Enfermagem é a etapa de julgamento clínico sobre as respostas da pessoa aos problemas de saúde, baseada nos dados do histórico.',
  'COFEN'
),
(
  'Sistematização da Assistência (SAE)',
  'Na taxonomia NANDA-I, um diagnóstico de enfermagem de "Risco" contém:',
  '[{"id": "A", "text": "Título, Fatores Relacionados e Características Definidoras."}, {"id": "B", "text": "Título e Fatores de Risco, sem características definidoras."}, {"id": "C", "text": "Apenas o Título."}, {"id": "D", "text": "Título e Sinais/Sintomas."}, {"id": "E", "text": "Título, Etiologia e Evidências."}]'::jsonb,
  'B',
  'Diagnósticos de risco descrevem vulnerabilidade. Como o problema ainda não aconteceu, não existem "Características Definidoras" (Sinais/Sintomas), apenas Fatores de Risco.',
  'NANDA-I'
),
(
  'Sistematização da Assistência (SAE)',
  'A classificação NIC (Nursing Interventions Classification) refere-se a:',
  '[{"id": "A", "text": "Resultados esperados."}, {"id": "B", "text": "Diagnósticos de enfermagem."}, {"id": "C", "text": "Intervenções de enfermagem."}, {"id": "D", "text": "Avaliação física."}, {"id": "E", "text": "Histórico do paciente."}]'::jsonb,
  'C',
  'NIC é a Classificação das Intervenções de Enfermagem, ou seja, o que a enfermagem "faz" para tratar o paciente.',
  'SAE'
),
(
  'Sistematização da Assistência (SAE)',
  'O Processo de Enfermagem deve ser realizado em:',
  '[{"id": "A", "text": "Apenas hospitais públicos."}, {"id": "B", "text": "Apenas unidades de terapia intensiva."}, {"id": "C", "text": "Todos os ambientes, públicos ou privados, onde ocorre o cuidado profissional de enfermagem."}, {"id": "D", "text": "Apenas em pacientes cirúrgicos."}, {"id": "E", "text": "Apenas na atenção primária."}]'::jsonb,
  'C',
  'A Resolução COFEN 358/2009 determina a obrigatoriedade do PE em todos os ambientes onde ocorre o cuidado de enfermagem.',
  'COFEN'
),
(
  'Sistematização da Assistência (SAE)',
  'A etapa de Avaliação de Enfermagem consiste em:',
  '[{"id": "A", "text": "Coletar dados iniciais do paciente."}, {"id": "B", "text": "Prescrever os medicamentos."}, {"id": "C", "text": "Verificar se os resultados esperados foram alcançados e reavaliar o plano."}, {"id": "D", "text": "Executar as técnicas de enfermagem."}, {"id": "E", "text": "Definir o diagnóstico médico."}]'::jsonb,
  'C',
  'A Avaliação é um processo contínuo de verificação da resposta do paciente às intervenções, determinando se as metas (NOC) foram atingidas.',
  'SAE'
),

-- FUNDAMENTOS DE ENFERMAGEM (5 Questões)
(
  'Fundamentos de Enfermagem',
  'Ao aferir a pressão arterial, se o manguito utilizado for muito estreito (pequeno) para o braço do paciente, o valor tenderá a ser:',
  '[{"id": "A", "text": "Falsamente elevado."}, {"id": "B", "text": "Falsamente baixo."}, {"id": "C", "text": "Exato."}, {"id": "D", "text": "Inaudível."}, {"id": "E", "text": "Variável sem padrão."}]'::jsonb,
  'A',
  'Um manguito pequeno exige mais pressão para ocluir a artéria, resultando em uma leitura falsamente elevada (hiperestimada). Manguito largo demais subestima a PA.',
  'SOCESP'
),
(
  'Fundamentos de Enfermagem',
  'A posição de Fowler é caracterizada por:',
  '[{"id": "A", "text": "Decúbito dorsal com a cabeceira elevada entre 45° e 60°."}, {"id": "B", "text": "Decúbito lateral esquerdo."}, {"id": "C", "text": "Decúbito ventral."}, {"id": "D", "text": "Pés elevados acima do nível da cabeça."}, {"id": "E", "text": "Cabeceira totalmente abaixada (0°)."}]'::jsonb,
  'A',
  'Fowler é a posição semi-sentada (45-60º), muito utilizada para melhorar a expansibilidade torácica e conforto respiratório.',
  'Fundamentos'
),
(
  'Fundamentos de Enfermagem',
  'Qual é o local preferencial para administração de injeção intramuscular em crianças menores de 2 anos?',
  '[{"id": "A", "text": "Região Deltoide."}, {"id": "B", "text": "Região Dorsoglútea."}, {"id": "C", "text": "Região Ventroglútea."}, {"id": "D", "text": "Vasto Lateral da Coxa."}, {"id": "E", "text": "Qualquer região muscular."}]'::jsonb,
  'D',
  'O Vasto Lateral da Coxa é o sítio preferencial em < 2 anos devido ao maior desenvolvimento muscular e ausência de grandes nervos/vasos nesta faixa etária.',
  'MS'
),
(
  'Fundamentos de Enfermagem',
  'O termo "Bradipneia" refere-se a:',
  '[{"id": "A", "text": "Frequência cardíaca baixa."}, {"id": "B", "text": "Pressão arterial baixa."}, {"id": "C", "text": "Frequência respiratória abaixo do normal."}, {"id": "D", "text": "Frequência respiratória acima do normal."}, {"id": "E", "text": "Dificuldade para respirar."}]'::jsonb,
  'C',
  'Bradipneia = Frequência respiratória lenta. Bradicardia = Frequência cardíaca lenta. Dispneia = Dificuldade respiratória.',
  'Terminologia'
),
(
  'Fundamentos de Enfermagem',
  'Na realização do exame físico abdominal, qual a sequência correta das técnicas propedêuticas?',
  '[{"id": "A", "text": "Inspeção, Palpação, Percussão, Ausculta."}, {"id": "B", "text": "Inspeção, Ausculta, Percussão, Palpação."}, {"id": "C", "text": "Palpação, Percussão, Inspeção, Ausculta."}, {"id": "D", "text": "Ausculta, Inspeção, Palpação, Percussão."}, {"id": "E", "text": "A ordem não interfere no resultado."}]'::jsonb,
  'B',
  'No abdome, a Ausculta deve preceder a Percussão e a Palpação para não alterar os ruídos hidroaéreos (peristaltismo) através da manipulação.',
  'Semiologia'
);