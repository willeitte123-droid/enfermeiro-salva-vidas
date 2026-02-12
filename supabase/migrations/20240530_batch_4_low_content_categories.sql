-- PACOTE DE REFORÇO 4: QUESTÕES INÉDITAS E DIVERSIFICADAS
-- Proteção contra duplicatas ativada (ON CONFLICT DO NOTHING)

INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES
  -- 1. NEUROLOGIA (Novos temas: Sinais Meníngeos, Pares Cranianos, NIHSS)
  (
    'Neurologia',
    'Durante o exame físico de um paciente com suspeita de meningite, o enfermeiro flete a coxa do paciente sobre o quadril e, ao tentar estender a perna, o paciente refere dor e resistência. Este sinal é conhecido como:',
    '[
      {"id": "A", "text": "Sinal de Babinski."},
      {"id": "B", "text": "Sinal de Kernig."},
      {"id": "C", "text": "Sinal de Brudzinski."},
      {"id": "D", "text": "Sinal de Hoffman."}
    ]'::jsonb,
    'B',
    'O Sinal de Kernig é positivo quando há dor ou impossibilidade de estender a perna com o quadril fletido. Brudzinski é a flexão involuntária dos joelhos ao fletir o pescoço.',
    'VUNESP'
  ),
  (
    'Neurologia',
    'A Escala de NIHSS (National Institutes of Health Stroke Scale) é amplamente utilizada na avaliação do AVC agudo para quantificar:',
    '[
      {"id": "A", "text": "O risco de queda do paciente."},
      {"id": "B", "text": "O grau de comprometimento/déficit neurológico."},
      {"id": "C", "text": "A probabilidade de hemorragia."},
      {"id": "D", "text": "A intensidade da dor de cabeça."}
    ]'::jsonb,
    'B',
    'A NIHSS avalia a gravidade do AVC através de itens como nível de consciência, paralisia facial, força motora, linguagem e negligência.',
    'EBSERH'
  ),
  (
    'Neurologia',
    'O V par craniano, responsável pela sensibilidade da face e motricidade da mastigação, é denominado:',
    '[
      {"id": "A", "text": "Nervo Facial."},
      {"id": "B", "text": "Nervo Vago."},
      {"id": "C", "text": "Nervo Trigêmeo."},
      {"id": "D", "text": "Nervo Glossofaríngeo."}
    ]'::jsonb,
    'C',
    'O Trigêmeo (V par) é o principal nervo sensitivo da face. O Facial (VII par) é responsável pela mímica facial.',
    'IBFC'
  ),
  (
    'Neurologia',
    'Em um paciente com Trauma Raquimedular (TRM) acima de C4, a principal complicação respiratória esperada devido à paralisia do diafragma é:',
    '[
      {"id": "A", "text": "Pneumotórax espontâneo."},
      {"id": "B", "text": "Insuficiência respiratória por perda do drive frênico."},
      {"id": "C", "text": "Edema agudo de pulmão."},
      {"id": "D", "text": "Broncoespasmo severo."}
    ]'::jsonb,
    'B',
    'O nervo frênico, que inerva o diafragma, origina-se entre C3 e C5. Lesões altas comprometem a ventilação espontânea.',
    'CESPE'
  ),

  -- 2. ADMINISTRAÇÃO (Novos temas: Teorias, Indicadores, Auditoria)
  (
    'Administração em Enfermagem',
    'A Teoria das Necessidades Humanas Básicas, que fundamenta grande parte da Sistematização da Assistência de Enfermagem (SAE) no Brasil, foi desenvolvida pela enfermeira:',
    '[
      {"id": "A", "text": "Florence Nightingale."},
      {"id": "B", "text": "Wanda de Aguiar Horta."},
      {"id": "C", "text": "Dorothea Orem."},
      {"id": "D", "text": "Ana Néri."}
    ]'::jsonb,
    'B',
    'Wanda Horta introduziu o processo de enfermagem no Brasil baseado na teoria da motivação humana de Maslow (Necessidades Psicobiológicas, Psicossociais e Psicoespirituais).',
    'COFEN'
  ),
  (
    'Administração em Enfermagem',
    'Na gestão da qualidade, o indicador que mede a relação entre o número de óbitos e o número de pacientes que receberam alta (saídas) em um determinado período é a:',
    '[
      {"id": "A", "text": "Taxa de Ocupação."},
      {"id": "B", "text": "Média de Permanência."},
      {"id": "C", "text": "Taxa de Mortalidade Hospitalar."},
      {"id": "D", "text": "Índice de Rotatividade."}
    ]'::jsonb,
    'C',
    'A Taxa de Mortalidade Hospitalar avalia a qualidade da assistência e a gravidade dos casos atendidos.',
    'FGV'
  ),
  (
    'Administração em Enfermagem',
    'Quando uma operadora de plano de saúde recusa o pagamento de um procedimento realizado devido à falta de checagem do enfermeiro no prontuário, ocorre uma:',
    '[
      {"id": "A", "text": "Glosa Administrativa."},
      {"id": "B", "text": "Glosa Técnica."},
      {"id": "C", "text": "Glosa Linear."},
      {"id": "D", "text": "Auditoria de Qualidade."}
    ]'::jsonb,
    'A',
    'A falta de anotação/checagem é um erro administrativo/burocrático que impede a comprovação da execução do serviço, gerando glosa.',
    'AOCP'
  ),
  (
    'Administração em Enfermagem',
    'O absenteísmo na equipe de enfermagem refere-se:',
    '[
      {"id": "A", "text": "À rotatividade de profissionais (admissões e demissões)."},
      {"id": "B", "text": "Às ausências não programadas dos funcionários ao trabalho."},
      {"id": "C", "text": "Ao número de horas extras realizadas."},
      {"id": "D", "text": "À falta de materiais no setor."}
    ]'::jsonb,
    'B',
    'Absenteísmo é a soma dos períodos de ausência do funcionário no trabalho (faltas, atrasos, licenças médicas não programadas). Turnover é a rotatividade.',
    'FUNDATEC'
  ),

  -- 3. SEMIOLOGIA (Novos temas: Sinais Abdominais, Tórax, Pele)
  (
    'Semiologia',
    'A manobra de Giordano (percussão com a borda ulnar da mão na região lombar) positiva, despertando dor intensa, sugere:',
    '[
      {"id": "A", "text": "Apendicite Aguda."},
      {"id": "B", "text": "Pielonefrite (Inflamação Renal)."},
      {"id": "C", "text": "Pneumonia Basal."},
      {"id": "D", "text": "Pancreatite."}
    ]'::jsonb,
    'B',
    'Giordano positivo é o sinal clássico de inflamação aguda do parênquima renal ou da cápsula renal (Pielonefrite).',
    'IBFC'
  ),
  (
    'Semiologia',
    'O Sinal de Murphy (interrupção brusca da inspiração profunda durante a palpação do ponto cístico devido à dor) é indicativo de:',
    '[
      {"id": "A", "text": "Colecistite Aguda (Inflamação da Vesícula)."},
      {"id": "B", "text": "Gastrite."},
      {"id": "C", "text": "Obstrução Intestinal."},
      {"id": "D", "text": "Hérnia Inguinal."}
    ]'::jsonb,
    'A',
    'Ao inspirar, o diafragma desce e empurra o fígado/vesícula contra a mão do examinador. Se a vesícula estiver inflamada, o paciente trava a respiração (Murphy Positivo).',
    'VUNESP'
  ),
  (
    'Semiologia',
    'Durante o exame físico do tórax, o "Tórax em Tonel" (aumento do diâmetro ântero-posterior) é um achado característico de pacientes com:',
    '[
      {"id": "A", "text": "Tuberculose."},
      {"id": "B", "text": "Doença Pulmonar Obstrutiva Crônica (DPOC/Enfisema)."},
      {"id": "C", "text": "Pneumonia Lobar."},
      {"id": "D", "text": "Câncer de Pulmão."}
    ]'::jsonb,
    'B',
    'O aprisionamento de ar crônico no enfisema leva à hiperinsuflação pulmonar e deformidade da caixa torácica (tórax em barril/tonel).',
    'CESGRANRIO'
  ),
  (
    'Semiologia',
    'O Sinal de Godet (ou sinal do cacifo) é utilizado para avaliar:',
    '[
      {"id": "A", "text": "A presença e intensidade de edema."},
      {"id": "B", "text": "A perfusão capilar periférica."},
      {"id": "C", "text": "A elasticidade da pele (turgor)."},
      {"id": "D", "text": "A presença de trombose venosa profunda."}
    ]'::jsonb,
    'A',
    'Consiste em pressionar a pele contra uma proeminência óssea. Se formar uma depressão (cacifo) que demora a voltar, indica edema.',
    'COPESE'
  ),

  -- 4. URGÊNCIA E EMERGÊNCIA (Novos temas: Afogamento, Intoxicação, Queimadura Elétrica)
  (
    'Urgência e Emergência',
    'Em vítimas de afogamento (submersão), a prioridade inicial no atendimento (seja na água ou em solo) é:',
    '[
      {"id": "A", "text": "Realizar compressões torácicas para retirar água do pulmão."},
      {"id": "B", "text": "Restabelecer a ventilação/oxigenação (resgates ventilatórios)."},
      {"id": "C", "text": "Aquecer a vítima."},
      {"id": "D", "text": "Administrar adrenalina."}
    ]'::jsonb,
    'B',
    'Diferente da parada cardíaca súbita, a parada no afogamento é hipóxica. A ventilação precoce é crucial para reverter a hipoxemia.',
    'SOBRASA'
  ),
  (
    'Urgência e Emergência',
    'No atendimento a uma vítima de queimadura elétrica de alta voltagem, além das lesões de entrada e saída, o enfermeiro deve estar atento principalmente ao risco de:',
    '[
      {"id": "A", "text": "Hipotermia."},
      {"id": "B", "text": "Arritmias Cardíacas e Rabdomiólise (Urina escura)."},
      {"id": "C", "text": "Inalação de fumaça."},
      {"id": "D", "text": "Fraturas de face."}
    ]'::jsonb,
    'B',
    'A corrente elétrica causa dano muscular extenso (liberando mioglobina -> lesão renal/urina escura) e interfere na condução elétrica do coração.',
    'AHA'
  ),
  (
    'Urgência e Emergência',
    'A Manobra de Heimlich em gestantes no último trimestre ou em pacientes obesos deve ser adaptada, realizando as compressões na região:',
    '[
      {"id": "A", "text": "Abdominal inferior."},
      {"id": "B", "text": "Torácica (metade do esterno), em vez de abdominal."},
      {"id": "C", "text": "Dorsal (tapas nas costas)."},
      {"id": "D", "text": "Cervical."}
    ]'::jsonb,
    'B',
    'Para evitar dano ao feto ou devido à dificuldade anatômica no obeso, as compressões são feitas no esterno (tórax), como na RCP, mas com o paciente em pé/sentado.',
    'AHA'
  ),
  (
    'Urgência e Emergência',
    'Em casos de intoxicação exógena por ingestão recente de substâncias tóxicas (até 1-2 horas), o método de descontaminação gástrica mais utilizado, se não houver contraindicação, é:',
    '[
      {"id": "A", "text": "Lavagem gástrica com leite."},
      {"id": "B", "text": "Indução de vômito com xarope de ipeca."},
      {"id": "C", "text": "Administração de Carvão Ativado."},
      {"id": "D", "text": "Diálise de urgência."}
    ]'::jsonb,
    'C',
    'O Carvão Ativado adsorve a maioria das toxinas no estômago, impedindo sua absorção. Lavagem gástrica e indução de vômito estão em desuso rotineiro.',
    'ANVISA'
  ),

  -- 5. BIOSSEGURANÇA (Novos temas: Higienização Cirúrgica, Vacinas, Isolamentos Específicos)
  (
    'Biossegurança e Controle de Infecção',
    'Para a higienização simples das mãos (água e sabonete líquido), o tempo recomendado pela ANVISA/OMS para garantir a eficácia do procedimento é de:',
    '[
      {"id": "A", "text": "10 a 20 segundos."},
      {"id": "B", "text": "40 a 60 segundos."},
      {"id": "C", "text": "2 a 3 minutos."},
      {"id": "D", "text": "5 minutos."}
    ]'::jsonb,
    'B',
    'A técnica completa, cobrindo todas as superfícies das mãos, requer de 40 a 60 segundos com água e sabão.',
    'ANVISA'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'Profissionais de saúde que sofreram acidente com material biológico (perfurocortante) de fonte desconhecida ou HIV positiva devem iniciar a Quimioprofilaxia Pós-Exposição (PEP) idealmente nas primeiras:',
    '[
      {"id": "A", "text": "2 horas (máximo 72h)."},
      {"id": "B", "text": "12 horas (máximo 7 dias)."},
      {"id": "C", "text": "24 horas (máximo 10 dias)."},
      {"id": "D", "text": "Imediatamente, sem limite máximo."}
    ]'::jsonb,
    'A',
    'A eficácia da PEP é maior quanto mais cedo for iniciada, preferencialmente nas primeiras 2h. Após 72h, a eficácia é mínima e não é mais recomendada.',
    'MS'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'Paciente com diagnóstico de Varicela (Catapora) ou Herpes Zoster disseminado requer quais tipos de precaução simultaneamente?',
    '[
      {"id": "A", "text": "Padrão e Gotículas."},
      {"id": "B", "text": "Contato e Aerossóis."},
      {"id": "C", "text": "Apenas Padrão."},
      {"id": "D", "text": "Apenas Contato."}
    ]'::jsonb,
    'B',
    'A Varicela transmite-se tanto pelo contato direto com as lesões quanto pela inalação de partículas virais suspensas no ar (aerossóis).',
    'CDC'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'Qual das vacinas abaixo NÃO faz parte do calendário obrigatório de vacinação ocupacional para profissionais de saúde, segundo a NR-32 e Ministério da Saúde?',
    '[
      {"id": "A", "text": "Hepatite B."},
      {"id": "B", "text": "Dupla Adulto (dT - Tétano e Difteria)."},
      {"id": "C", "text": "Tríplice Viral (Sarampo, Caxumba, Rubéola)."},
      {"id": "D", "text": "Hepatite A."}
    ]'::jsonb,
    'D',
    'A vacina de Hepatite A não é rotina para todos os profissionais, apenas em situações específicas de surto ou risco aumentado. Hep B, dT e Tríplice Viral são rotina.',
    'NR-32'
  ),

  -- 6. MATÉRIAS GERAIS (Preenchendo lacunas diversas)
  (
    'Saúde da Mulher e da Criança',
    'O Teste do Pezinho (Triagem Neonatal Biológica) deve ser coletado preferencialmente:',
    '[
      {"id": "A", "text": "Nas primeiras 24 horas de vida."},
      {"id": "B", "text": "Entre o 3º e o 5º dia de vida."},
      {"id": "C", "text": "Após o 10º dia de vida."},
      {"id": "D", "text": "No momento da alta da maternidade, independente da idade."}
    ]'::jsonb,
    'B',
    'O período ideal (3º ao 5º dia) garante que o bebê já tenha ingerido proteínas (para fenilcetonúria) e evita falsos negativos ou positivos de outras doenças.',
    'MS'
  ),
  (
    'Centro Cirúrgico e CME',
    'A posição cirúrgica de Litotomia (Ginecológica) exige cuidados de enfermagem específicos para prevenir lesões em:',
    '[
      {"id": "A", "text": "Plexo braquial."},
      {"id": "B", "text": "Nervo fibular e panturrilhas (TVP)."},
      {"id": "C", "text": "Olhos e face."},
      {"id": "D", "text": "Coluna cervical."}
    ]'::jsonb,
    'B',
    'O posicionamento das pernas nas perneiras pode comprimir o nervo fibular comum e prejudicar o retorno venoso se não for bem acolchoado.',
    'SOBECC'
  ),
  (
    'Clínica Médica e Cirúrgica',
    'Um paciente com dreno de tórax em selo d''água apresenta borbulhamento intenso e contínuo no frasco coletor, mesmo sem tosse. Isso sugere:',
    '[
      {"id": "A", "text": "Funcionamento normal do sistema."},
      {"id": "B", "text": "Obstrução do dreno."},
      {"id": "C", "text": "Fístula aérea broncopleural (vazamento de ar do pulmão) ou vazamento no sistema."},
      {"id": "D", "text": "Reexpansão pulmonar completa."}
    ]'::jsonb,
    'C',
    'O borbulhamento deve ser intermitente (na tosse/respiração). Se contínuo e intenso, há escape de ar significativo (fístula) ou conexão solta.',
    'AOCP'
  ),
  (
    'Ética e Legislação',
    'Um profissional de enfermagem divulga imagens de pacientes em redes sociais. Segundo o Código de Ética, essa ação viola:',
    '[
      {"id": "A", "text": "O direito ao exercício profissional."},
      {"id": "B", "text": "O dever de aprimoramento técnico."},
      {"id": "C", "text": "A proibição de expor a figura do paciente e o direito à privacidade."},
      {"id": "D", "text": "A autonomia do profissional."}
    ]'::jsonb,
    'C',
    'É expressamente proibido expor a figura do paciente em meios de comunicação, mesmo com autorização, se não houver fins educativos estritos e anonimato garantido.',
    'COFEN'
  ),
  (
    'Farmacologia e Alta Vigilância',
    'A administração rápida de Vancomicina por via endovenosa pode desencadear uma reação de hipersensibilidade não alérgica conhecida como:',
    '[
      {"id": "A", "text": "Síndrome de Stevens-Johnson."},
      {"id": "B", "text": "Síndrome do Homem Vermelho."},
      {"id": "C", "text": "Choque Anafilático."},
      {"id": "D", "text": "Síndrome de Cushing."}
    ]'::jsonb,
    'B',
    'A Síndrome do Homem Vermelho é causada pela liberação de histamina devido à infusão rápida. A prevenção é infundir em pelo menos 1 hora.',
    'EBSERH'
  )
ON CONFLICT (question) DO NOTHING;