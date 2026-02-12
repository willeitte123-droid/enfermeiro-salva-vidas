-- PACOTE DE REFORÇO: CATEGORIAS DEFICITÁRIAS
-- Foco: UTI, Clínica Médica, SAE, Oncologia, Hemoterapia, Paliativos, Nutrição, Vigilância, Curativos

INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES
  -- 1. TERAPIA INTENSIVA (UTI) - Reforço Urgente
  (
    'Terapia Intensiva (UTI)',
    'Na monitorização hemodinâmica invasiva, a Pressão Venosa Central (PVC) é um parâmetro utilizado para avaliar principalmente:',
    '[
      {"id": "A", "text": "A pós-carga do ventrículo esquerdo."},
      {"id": "B", "text": "A pré-carga do ventrículo direito."},
      {"id": "C", "text": "A contratilidade miocárdica global."},
      {"id": "D", "text": "A resistência vascular sistêmica."}
    ]'::jsonb,
    'B',
    'A PVC reflete a pressão de enchimento do átrio direito e, consequentemente, a pré-carga do ventrículo direito e a volemia.',
    'VUNESP'
  ),
  (
    'Terapia Intensiva (UTI)',
    'Para a prevenção de Pneumonia Associada à Ventilação Mecânica (PAV), o pacote de medidas (bundle) inclui, entre outros:',
    '[
      {"id": "A", "text": "Troca do circuito do ventilador a cada 24 horas."},
      {"id": "B", "text": "Manter a cabeceira do leito elevada entre 30 e 45 graus."},
      {"id": "C", "text": "Realizar higiene oral apenas com água destilada."},
      {"id": "D", "text": "Manter o paciente em sedação profunda contínua."}
    ]'::jsonb,
    'B',
    'A elevação da cabeceira (30-45º) é uma das medidas mais eficazes para prevenir a broncoaspiração silenciosa e a PAV.',
    'IBFC'
  ),
  (
    'Terapia Intensiva (UTI)',
    'Durante a aspiração endotraqueal em sistema aberto, o tempo máximo recomendado para aplicação de sucção a cada passagem da sonda é de:',
    '[
      {"id": "A", "text": "30 a 45 segundos."},
      {"id": "B", "text": "5 a 10 segundos."},
      {"id": "C", "text": "10 a 15 segundos."},
      {"id": "D", "text": "1 a 2 minutos."}
    ]'::jsonb,
    'C',
    'A aspiração prolongada (>15s) causa hipoxemia grave, atelectasia e estimulação vagal (bradicardia).',
    'EBSERH'
  ),
  (
    'Terapia Intensiva (UTI)',
    'A Escala de RASS (Richmond Agitation-Sedation Scale) é utilizada em UTI para avaliar:',
    '[
      {"id": "A", "text": "O risco de lesão por pressão."},
      {"id": "B", "text": "O nível de sedação e agitação do paciente."},
      {"id": "C", "text": "A gravidade do trauma cranioencefálico."},
      {"id": "D", "text": "O risco de queda."}
    ]'::jsonb,
    'B',
    'A escala de RASS varia de +4 (combativo) a -5 (não despertável), sendo padrão ouro para monitorar sedação.',
    'FCC'
  ),
  (
    'Terapia Intensiva (UTI)',
    'Qual das drogas abaixo é um vasopressor potente, de primeira escolha no tratamento do choque séptico para elevar a PAM?',
    '[
      {"id": "A", "text": "Dobutamina."},
      {"id": "B", "text": "Nitroprussiato de Sódio."},
      {"id": "C", "text": "Noradrenalina."},
      {"id": "D", "text": "Amiodarona."}
    ]'::jsonb,
    'C',
    'A Noradrenalina é um agonista alfa-adrenérgico potente, causando vasoconstrição periférica e aumento da pressão arterial.',
    'FGV'
  ),

  -- 2. SAÚDE DO ADULTO (CLÍNICA MÉDICA) - Reforço Urgente
  (
    'Saúde do Adulto (Clínica Médica)',
    'Na assistência ao paciente com Diabetes Mellitus, a Insulina NPH caracteriza-se por ter ação:',
    '[
      {"id": "A", "text": "Ultrarrápida."},
      {"id": "B", "text": "Rápida."},
      {"id": "C", "text": "Intermediária."},
      {"id": "D", "text": "Prolongada (sem pico)."}
    ]'::jsonb,
    'C',
    'A NPH é uma insulina de ação intermediária, com início em 1-2h, pico em 4-12h e duração de 14-24h.',
    'CESGRANRIO'
  ),
  (
    'Saúde do Adulto (Clínica Médica)',
    'Um paciente hipertenso apresenta PA de 180/110 mmHg, sem sintomas ou lesão aguda de órgão-alvo. Esse quadro é classificado como:',
    '[
      {"id": "A", "text": "Emergência Hipertensiva."},
      {"id": "B", "text": "Urgência Hipertensiva."},
      {"id": "C", "text": "Hipertensão do Avental Branco."},
      {"id": "D", "text": "Pseudocrise Hipertensiva."}
    ]'::jsonb,
    'B',
    'Na Urgência Hipertensiva há elevação crítica da PA mas SEM lesão aguda e progressiva de órgãos-alvo, permitindo redução gradual.',
    'VUNESP'
  ),
  (
    'Saúde do Adulto (Clínica Médica)',
    'A tríade clássica de sintomas do Diabetes Mellitus descompensado (4 Ps) inclui poliúria, polidipsia, perda de peso e:',
    '[
      {"id": "A", "text": "Polifagia."},
      {"id": "B", "text": "Poliartralgia."},
      {"id": "C", "text": "Polineuropatia."},
      {"id": "D", "text": "Polisserosite."}
    ]'::jsonb,
    'A',
    'Os 4 Ps são: Poliúria (muita urina), Polidipsia (muita sede), Polifagia (muita fome) e Perda de peso.',
    'IBFC'
  ),
  (
    'Saúde do Adulto (Clínica Médica)',
    'No cuidado ao paciente com Doença Pulmonar Obstrutiva Crônica (DPOC), a oxigenoterapia deve ser administrada com cautela para evitar:',
    '[
      {"id": "A", "text": "Hipercapnia (retenção de CO2) e narcose."},
      {"id": "B", "text": "Alcalose respiratória grave."},
      {"id": "C", "text": "Hipocapnia súbita."},
      {"id": "D", "text": "Pneumotórax espontâneo."}
    ]'::jsonb,
    'A',
    'Pacientes retentores crônicos de CO2 dependem da hipóxia para estimular o centro respiratório. O2 em excesso pode inibir esse drive.',
    'AOCP'
  ),
  (
    'Saúde do Adulto (Clínica Médica)',
    'A posição de Fowler é caracterizada por manter a cabeceira do leito elevada a:',
    '[
      {"id": "A", "text": "15 a 30 graus."},
      {"id": "B", "text": "45 a 60 graus."},
      {"id": "C", "text": "90 graus (sentado)."},
      {"id": "D", "text": "0 graus (plano)."}
    ]'::jsonb,
    'B',
    'A posição de Fowler (cabeceira elevada entre 45º e 60º) favorece a expansão pulmonar e melhora o conforto respiratório.',
    'FUNDATEC'
  ),

  -- 3. SISTEMATIZAÇÃO (SAE) - Reforço Urgente
  (
    'Sistematização (SAE)',
    'De acordo com a Resolução COFEN 358/2009, o Processo de Enfermagem organiza-se em 5 etapas inter-relacionadas. A etapa que envolve a determinação dos resultados esperados e das ações é o:',
    '[
      {"id": "A", "text": "Diagnóstico de Enfermagem."},
      {"id": "B", "text": "Planejamento de Enfermagem."},
      {"id": "C", "text": "Implementação."},
      {"id": "D", "text": "Histórico de Enfermagem."}
    ]'::jsonb,
    'B',
    'O Planejamento é a etapa onde se definem as metas (NOC) e as intervenções (NIC) para resolver os problemas identificados.',
    'COPESE'
  ),
  (
    'Sistematização (SAE)',
    'Na taxonomia NANDA-I, um Diagnóstico de Risco diferencia-se de um Diagnóstico com Foco no Problema por não apresentar:',
    '[
      {"id": "A", "text": "Título."},
      {"id": "B", "text": "Fatores Relacionados."},
      {"id": "C", "text": "Características Definidoras (Sinais e Sintomas)."},
      {"id": "D", "text": "Fatores de Risco."}
    ]'::jsonb,
    'C',
    'Como o problema ainda não aconteceu (é apenas um risco), não existem sinais e sintomas (características definidoras) presentes.',
    'IBFC'
  ),
  (
    'Sistematização (SAE)',
    'A etapa do Processo de Enfermagem que consiste na realização das ações ou intervenções determinadas no planejamento é a:',
    '[
      {"id": "A", "text": "Avaliação."},
      {"id": "B", "text": "Implementação."},
      {"id": "C", "text": "Coleta de Dados."},
      {"id": "D", "text": "Evolução."}
    ]'::jsonb,
    'B',
    'A Implementação é a fase da execução prática das prescrições de enfermagem.',
    'VUNESP'
  ),
  (
    'Sistematização (SAE)',
    'O registro formal da execução do Processo de Enfermagem é obrigatório e deve incluir, minimamente, um resumo dos dados coletados, os diagnósticos, as ações realizadas e:',
    '[
      {"id": "A", "text": "A cópia da prescrição médica."},
      {"id": "B", "text": "Os resultados de enfermagem alcançados."},
      {"id": "C", "text": "A escala de pessoal do setor."},
      {"id": "D", "text": "O faturamento dos materiais gastos."}
    ]'::jsonb,
    'B',
    'A Resolução 358/2009 exige o registro dos resultados alcançados (Avaliação/Evolução) para fechar o ciclo do cuidado.',
    'CONSULPAM'
  ),
  (
    'Sistematização (SAE)',
    'A SAE (Sistematização da Assistência de Enfermagem) é uma atividade privativa do:',
    '[
      {"id": "A", "text": "Técnico de Enfermagem."},
      {"id": "B", "text": "Enfermeiro."},
      {"id": "C", "text": "Médico."},
      {"id": "D", "text": "Gerente Administrativo."}
    ]'::jsonb,
    'B',
    'A liderança, organização e execução da SAE, especialmente o Diagnóstico e Prescrição, são privativos do Enfermeiro (Lei 7.498/86).',
    'FGV'
  ),

  -- 4. ONCOLOGIA
  (
    'Oncologia',
    'O extravasamento de quimioterápicos vesicantes pode causar necrose tecidual severa. Qual a conduta imediata ao suspeitar de extravasamento?',
    '[
      {"id": "A", "text": "Aumentar a velocidade para terminar logo a infusão."},
      {"id": "B", "text": "Parar a infusão, aspirar o resíduo pelo cateter e só então retirar o acesso."},
      {"id": "C", "text": "Lavar o acesso com soro fisiológico sob pressão."},
      {"id": "D", "text": "Retirar o cateter imediatamente e aplicar calor local."}
    ]'::jsonb,
    'B',
    'Deve-se interromper a infusão imediatamente e tentar aspirar a droga residual para minimizar a quantidade de vesicante nos tecidos.',
    'INCA'
  ),
  (
    'Oncologia',
    'A toxicidade medular causada pela quimioterapia que resulta na diminuição de todos os elementos figurados do sangue (leucócitos, hemácias e plaquetas) é chamada de:',
    '[
      {"id": "A", "text": "Pancitopenia."},
      {"id": "B", "text": "Leucocitose."},
      {"id": "C", "text": "Trombocitose."},
      {"id": "D", "text": "Eritroblastose."}
    ]'::jsonb,
    'A',
    'Pancitopenia é a redução simultânea das três linhagens sanguíneas (série vermelha, branca e plaquetária).',
    'EBSERH'
  ),
  (
    'Oncologia',
    'Um cuidado de enfermagem essencial para pacientes com trombocitopenia (plaquetas baixas) induzida por quimioterapia é:',
    '[
      {"id": "A", "text": "Estimular o uso de escovas de dente duras."},
      {"id": "B", "text": "Evitar injeções intramusculares e procedimentos invasivos."},
      {"id": "C", "text": "Administrar ácido acetilsalicílico (AAS) para dor."},
      {"id": "D", "text": "Realizar tricotomia com lâmina de barbear."}
    ]'::jsonb,
    'B',
    'Devido ao alto risco de sangramento e hematomas, deve-se evitar traumas, injeções IM e uso de lâminas ou AAS.',
    'FCC'
  ),

  -- 5. HEMOTERAPIA
  (
    'Hemoterapia',
    'Durante a transfusão de concentrado de hemácias, o paciente refere dor lombar súbita, calafrios e urina escura. A conduta imediata do enfermeiro deve ser:',
    '[
      {"id": "A", "text": "Diminuir a velocidade da infusão e observar."},
      {"id": "B", "text": "Administrar antitérmico e continuar a transfusão."},
      {"id": "C", "text": "Interromper a transfusão imediatamente e manter o acesso venoso com SF 0,9%."},
      {"id": "D", "text": "Acelerar a transfusão para terminar antes que piore."}
    ]'::jsonb,
    'C',
    'Esses são sinais clássicos de reação hemolítica aguda. A transfusão deve ser parada imediatamente para evitar insuficiência renal e choque.',
    'CESPE'
  ),
  (
    'Hemoterapia',
    'Qual o tempo máximo recomendado para a infusão de uma bolsa de concentrado de hemácias para evitar o risco de proliferação bacteriana?',
    '[
      {"id": "A", "text": "1 hora."},
      {"id": "B", "text": "2 horas."},
      {"id": "C", "text": "4 horas."},
      {"id": "D", "text": "6 horas."}
    ]'::jsonb,
    'C',
    'O tempo máximo de infusão de hemocomponentes é de 4 horas. Se ultrapassar, o risco de contaminação bacteriana aumenta significativamente.',
    'VUNESP'
  ),
  (
    'Hemoterapia',
    'A prova de compatibilidade pré-transfusional realizada à beira do leito, que consiste na conferência dos dados do paciente e da bolsa por dois profissionais, é chamada de:',
    '[
      {"id": "A", "text": "Dupla Checagem."},
      {"id": "B", "text": "Teste de Coombs."},
      {"id": "C", "text": "Prova Cruzada."},
      {"id": "D", "text": "Tipagem Sanguínea."}
    ]'::jsonb,
    'A',
    'A dupla checagem é uma barreira de segurança administrativa final e crucial para evitar erros de identificação na transfusão.',
    'IBFC'
  ),

  -- 6. CUIDADOS PALIATIVOS
  (
    'Cuidados Paliativos',
    'A respiração agônica, ruidosa, caracterizada pelo acúmulo de secreções na orofaringe em pacientes moribundos, é conhecida como:',
    '[
      {"id": "A", "text": "Respiração de Kussmaul."},
      {"id": "B", "text": "Ronco da morte (Sororoca)."},
      {"id": "C", "text": "Respiração de Cheyne-Stokes."},
      {"id": "D", "text": "Estridor laríngeo."}
    ]'::jsonb,
    'B',
    'O ''ronco da morte'' ocorre pela inabilidade de deglutir secreções. O tratamento não é a aspiração (que causa desconforto), mas sim reposicionamento e anticolinérgicos.',
    'FGV'
  ),
  (
    'Cuidados Paliativos',
    'Na dor oncológica em cuidados paliativos, o uso de opioides fortes (como Morfina) deve seguir qual princípio?',
    '[
      {"id": "A", "text": "Administrar apenas quando o paciente solicitar (SOS)."},
      {"id": "B", "text": "Administrar em horários fixos (relógio) para manter nível sérico constante."},
      {"id": "C", "text": "Evitar ao máximo para não causar dependência."},
      {"id": "D", "text": "Iniciar sempre com a dose máxima tolerada."}
    ]'::jsonb,
    'B',
    'Para dor crônica/oncológica, a analgesia deve ser preventiva (horário fixo), com doses de resgate disponíveis para dor incidental.',
    'INCA'
  ),
  (
    'Cuidados Paliativos',
    'A via de administração de medicamentos preferencial em cuidados paliativos, quando a via oral não é mais possível e busca-se conforto e mínima invasividade, é a:',
    '[
      {"id": "A", "text": "Intramuscular."},
      {"id": "B", "text": "Endovenosa profunda."},
      {"id": "C", "text": "Subcutânea (Hipodermóclise)."},
      {"id": "D", "text": "Intraóssea."}
    ]'::jsonb,
    'C',
    'A hipodermóclise permite hidratação e analgesia de forma segura, com baixo risco de infecção e desconforto mínimo para o paciente terminal.',
    'EBSERH'
  ),

  -- 7. NUTRIÇÃO CLÍNICA
  (
    'Nutrição Clínica',
    'Para confirmar o posicionamento de uma sonda nasoenteral (SNE) antes de iniciar a dieta, o padrão-ouro (método mais seguro) é:',
    '[
      {"id": "A", "text": "Ausculta de ruídos hidroaéreos no epigástrio."},
      {"id": "B", "text": "Teste de pH do aspirado gástrico."},
      {"id": "C", "text": "Exame radiológico (Raio-X)."},
      {"id": "D", "text": "Mergulhar a ponta da sonda em um copo com água."}
    ]'::jsonb,
    'C',
    'A ausculta pode enganar. Apenas o Raio-X visualiza se a sonda está na posição correta (estômago/duodeno) e não na via aérea.',
    'CESGRANRIO'
  ),
  (
    'Nutrição Clínica',
    'A Nutrição Parenteral Total (NPT), devido à sua alta osmolaridade, deve ser administrada preferencialmente por:',
    '[
      {"id": "A", "text": "Sonda Nasogástrica."},
      {"id": "B", "text": "Veia Periférica de fino calibre."},
      {"id": "C", "text": "Cateter Venoso Central."},
      {"id": "D", "text": "Gastrostomia."}
    ]'::jsonb,
    'C',
    'Soluções hiperosmolares (>900 mOsm/L) causam flebite severa em veias periféricas, exigindo veia de grosso calibre e alto fluxo (Central).',
    'AOCP'
  ),
  (
    'Nutrição Clínica',
    'O volume residual gástrico (VRG) elevado em paciente com dieta enteral pode indicar:',
    '[
      {"id": "A", "text": "Boa tolerância à dieta."},
      {"id": "B", "text": "Esvaziamento gástrico retardado e risco de broncoaspiração."},
      {"id": "C", "text": "Necessidade de aumentar a velocidade de infusão."},
      {"id": "D", "text": "Posicionamento da sonda no jejuno."}
    ]'::jsonb,
    'B',
    'VRG alto sugere que o estômago não está esvaziando, aumentando a pressão gástrica e o risco de refluxo/vômito e aspiração.',
    'VUNESP'
  ),

  -- 8. VIGILÂNCIA EM SAÚDE
  (
    'Vigilância em Saúde',
    'A notificação compulsória de doenças deve ser realizada apenas quando:',
    '[
      {"id": "A", "text": "O diagnóstico é confirmado laboratorialmente."},
      {"id": "B", "text": "O paciente vai a óbito."},
      {"id": "C", "text": "Há simples suspeita clínica da doença."},
      {"id": "D", "text": "O médico autoriza a notificação."}
    ]'::jsonb,
    'C',
    'A notificação deve ser feita diante da SUSPEITA clínica, para permitir o desencadeamento rápido das medidas de controle epidemiológico.',
    'FGV'
  ),
  (
    'Vigilância em Saúde',
    'Qual das doenças abaixo requer notificação compulsória IMEDIATA (em até 24 horas) ao Ministério da Saúde?',
    '[
      {"id": "A", "text": "Hipertensão Arterial."},
      {"id": "B", "text": "Diabetes Mellitus."},
      {"id": "C", "text": "Sarampo."},
      {"id": "D", "text": "Tuberculose."}
    ]'::jsonb,
    'C',
    'O Sarampo é uma doença de alta transmissibilidade e potencial epidêmico, exigindo ação imediata (bloqueio vacinal). Tuberculose é notificação semanal.',
    'IBFC'
  ),
  (
    'Vigilância em Saúde',
    'A investigação de um surto de intoxicação alimentar em uma escola é atribuição principal da:',
    '[
      {"id": "A", "text": "Vigilância Epidemiológica e Sanitária."},
      {"id": "B", "text": "Vigilância Ambiental."},
      {"id": "C", "text": "Saúde do Trabalhador."},
      {"id": "D", "text": "Assistência Social."}
    ]'::jsonb,
    'A',
    'Envolve a investigação dos casos (Epidemiológica) e a fiscalização dos alimentos/local (Sanitária).',
    'COPESE'
  ),

  -- 9. CURATIVOS E TRATAMENTO DE FERIDAS - Reforço Urgente
  (
    'Curativos e Tratamento de Feridas',
    'O tecido de granulação, presente no processo de cicatrização, caracteriza-se clinicamente por:',
    '[
      {"id": "A", "text": "Cor amarelada, úmida e aderente (esfacelo)."},
      {"id": "B", "text": "Cor preta, seca e endurecida (necrose)."},
      {"id": "C", "text": "Cor vermelho vivo, úmido e com aspecto de framboesa."},
      {"id": "D", "text": "Cor rosa pálido, seco e plano (epitelização)."}
    ]'::jsonb,
    'C',
    'A granulação indica angiogênese e formação de nova matriz. É um tecido saudável que deve ser protegido e mantido úmido.',
    'VUNESP'
  ),
  (
    'Curativos e Tratamento de Feridas',
    'A cobertura de Alginato de Cálcio é indicada principalmente para feridas com:',
    '[
      {"id": "A", "text": "Baixo exsudato e tecido de epitelização."},
      {"id": "B", "text": "Necrose seca e aderida."},
      {"id": "C", "text": "Alto exsudato e sangramento (hemostasia)."},
      {"id": "D", "text": "Pele íntegra para prevenção."}
    ]'::jsonb,
    'C',
    'O alginato tem alta capacidade de absorção, transforma-se em gel e auxilia na hemostasia pela troca iônica de cálcio.',
    'AOCP'
  ),
  (
    'Curativos e Tratamento de Feridas',
    'Na lesão por pressão, o Estágio 1 é caracterizado por:',
    '[
      {"id": "A", "text": "Perda total da espessura da pele com exposição óssea."},
      {"id": "B", "text": "Flictena (bolha) com conteúdo seroso."},
      {"id": "C", "text": "Pele íntegra com eritema que não embranquece à digitopressão."},
      {"id": "D", "text": "Perda parcial da derme com leito vermelho."}
    ]'::jsonb,
    'C',
    'É o sinal mais precoce de dano tecidual. A vermelhidão persistente indica isquemia, mas a pele ainda não rompeu.',
    'EBSERH'
  ),
  (
    'Curativos e Tratamento de Feridas',
    'Qual a função da cobertura de Carvão Ativado com Prata em uma ferida infectada?',
    '[
      {"id": "A", "text": "Promover desbridamento enzimático."},
      {"id": "B", "text": "Controlar o odor e reduzir a carga bacteriana."},
      {"id": "C", "text": "Hidratar o leito seco da ferida."},
      {"id": "D", "text": "Proteger a pele perilesional de maceração."}
    ]'::jsonb,
    'B',
    'O carvão adsorve as bactérias e moléculas de odor, enquanto a prata tem ação bactericida.',
    'FCC'
  ),
  (
    'Curativos e Tratamento de Feridas',
    'O desbridamento autolítico é promovido através de:',
    '[
      {"id": "A", "text": "Uso de bisturi ou tesoura."},
      {"id": "B", "text": "Aplicação de enzimas como colagenase ou papaína."},
      {"id": "C", "text": "Manutenção do meio úmido (ex: hidrogel/hidrocoloide) que permite ação das enzimas do próprio corpo."},
      {"id": "D", "text": "Uso de gaze seca (wet-to-dry)."}
    ]'::jsonb,
    'C',
    'O desbridamento autolítico é o mais seletivo e indolor, usando a umidade para que os macrófagos e enzimas endógenas liquefaçam a necrose.',
    'FGV'
  ),

  -- 10. CENTRO CIRÚRGICO e CME - Reforço Urgente
  (
    'Centro Cirúrgico e CME',
    'O indicador biológico utilizado para monitorar a eficácia da esterilização em autoclave a vapor contém esporos de:',
    '[
      {"id": "A", "text": "Bacillus atrophaeus."},
      {"id": "B", "text": "Geobacillus stearothermophilus."},
      {"id": "C", "text": "Staphylococcus aureus."},
      {"id": "D", "text": "Pseudomonas aeruginosa."}
    ]'::jsonb,
    'B',
    'O Geobacillus stearothermophilus é o microrganismo padrão para teste de autoclave pois é altamente resistente ao calor úmido.',
    'IBFC'
  ),
  (
    'Centro Cirúrgico e CME',
    'Segundo a classificação de Spaulding, um material que entra em contato com tecido estéril ou sistema vascular é classificado como:',
    '[
      {"id": "A", "text": "Não Crítico."},
      {"id": "B", "text": "Semicrítico."},
      {"id": "C", "text": "Crítico."},
      {"id": "D", "text": "Contaminado."}
    ]'::jsonb,
    'C',
    'Artigos críticos (ex: pinças cirúrgicas) exigem esterilização obrigatória, pois o risco de infecção é alto.',
    'CESPE'
  ),
  (
    'Centro Cirúrgico e CME',
    'A fase da cirurgia segura (Checklist OMS) realizada ANTES da indução anestésica é chamada de:',
    '[
      {"id": "A", "text": "Sign In (Entrada)."},
      {"id": "B", "text": "Time Out (Pausa Cirúrgica)."},
      {"id": "C", "text": "Sign Out (Saída)."},
      {"id": "D", "text": "Recovery."}
    ]'::jsonb,
    'A',
    'O Sign In verifica identidade, sítio, consentimento e equipamentos de anestesia/oximetria antes de o paciente dormir.',
    'EBSERH'
  ),
  (
    'Centro Cirúrgico e CME',
    'A posição cirúrgica em que o paciente permanece em decúbito dorsal com a cabeça mais baixa que o corpo (inclinado) é chamada de:',
    '[
      {"id": "A", "text": "Fowler."},
      {"id": "B", "text": "Litotomia."},
      {"id": "C", "text": "Trendelenburg."},
      {"id": "D", "text": "Proclive."}
    ]'::jsonb,
    'C',
    'Trendelenburg é usada em cirurgias pélvicas/abdominais para afastar as vísceras da área cirúrgica.',
    'VUNESP'
  ),

  -- 11. BIOSSEGURANÇA - Reforço Urgente
  (
    'Biossegurança e Controle de Infecção',
    'Para um paciente com diagnóstico de Tuberculose Pulmonar bacilífera, a precaução indicada é:',
    '[
      {"id": "A", "text": "Padrão apenas."},
      {"id": "B", "text": "Contato."},
      {"id": "C", "text": "Gotículas."},
      {"id": "D", "text": "Aerossóis."}
    ]'::jsonb,
    'D',
    'A TB é transmitida por núcleos de gotículas (aerossóis) que ficam suspensos no ar. Exige máscara N95/PFF2 para o profissional e quarto privativo.',
    'AOCP'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'A lavagem das mãos deve ser substituída pela fricção com álcool gel (preparação alcoólica) quando:',
    '[
      {"id": "A", "text": "As mãos estiverem visivelmente sujas de sangue."},
      {"id": "B", "text": "Após o uso do banheiro."},
      {"id": "C", "text": "Em contato com paciente com Clostridium difficile."},
      {"id": "D", "text": "As mãos não estiverem visivelmente sujas."}
    ]'::jsonb,
    'D',
    'O álcool gel é eficaz e preferencial se não houver sujidade visível. Se houver matéria orgânica ou esporos (Clostridium), deve-se usar água e sabão.',
    'ANVISA'
  ),
  (
    'Biossegurança e Controle de Infecção',
    'A NR-32 proíbe expressamente em todos os postos de trabalho:',
    '[
      {"id": "A", "text": "O uso de computadores."},
      {"id": "B", "text": "O uso de adornos (anéis, relógios, pulseiras)."},
      {"id": "C", "text": "A conversa entre funcionários."},
      {"id": "D", "text": "O uso de canetas pessoais."}
    ]'::jsonb,
    'B',
    'Adornos dificultam a higienização das mãos e acumulam microrganismos, sendo vetados pela norma de segurança.',
    'MTE'
  );