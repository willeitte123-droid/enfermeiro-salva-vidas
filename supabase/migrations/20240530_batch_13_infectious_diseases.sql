-- PACOTE DE REFORÇO 9: DOENÇAS INFECCIOSAS E PARASITÁRIAS
-- Foco: Dengue, TB, Hanseníase, ISTs, Hepatites, Meningites, etc.

INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES

  -- 1. TUBERCULOSE
  (
    'Doenças Infecciosas',
    'No tratamento da Tuberculose com o esquema básico (RIPE), um efeito adverso comum, porém não grave, que deve ser orientado ao paciente para evitar abandono do tratamento é:',
    '[
      {"id": "A", "text": "A surdez irreversível causada pela Isoniazida."},
      {"id": "B", "text": "A coloração alaranjada da urina, suor e lágrimas causada pela Rifampicina."},
      {"id": "C", "text": "A cegueira noturna causada pela Pirazinamida."},
      {"id": "D", "text": "A tosse produtiva intensa causada pelo Etambutol."}
    ]'::jsonb,
    'B',
    'A Rifampicina colore os fluidos corporais de laranja/vermelho. O paciente deve ser avisado para não se assustar e pensar que é sangue.',
    'Ministério da Saúde'
  ),
  (
    'Doenças Infecciosas',
    'O Teste Rápido Molecular para Tuberculose (TRM-TB) é atualmente o exame de escolha para diagnóstico em muitas situações. Uma de suas principais vantagens em relação à baciloscopia é:',
    '[
      {"id": "A", "text": "Detectar simultaneamente o DNA do bacilo e a resistência à Rifampicina em 2 horas."},
      {"id": "B", "text": "Ser capaz de detectar qualquer micobactéria não tuberculosa."},
      {"id": "C", "text": "Dispensar a necessidade de coleta de escarro."},
      {"id": "D", "text": "Ter menor custo e menor sensibilidade."}
    ]'::jsonb,
    'A',
    'O TRM-TB revolucionou o diagnóstico por sua rapidez e por já identificar se o bacilo é resistente ao principal fármaco do esquema (Rifampicina).',
    'Ministério da Saúde'
  ),

  -- 2. HANSENÍASE
  (
    'Doenças Infecciosas',
    'Na avaliação neurológica simplificada de um paciente com suspeita de Hanseníase, a perda de sensibilidade nas lesões cutâneas ocorre geralmente na seguinte ordem:',
    '[
      {"id": "A", "text": "Tátil, depois Térmica, depois Dolorosa."},
      {"id": "B", "text": "Dolorosa, depois Tátil, depois Térmica."},
      {"id": "C", "text": "Térmica, depois Dolorosa, depois Tátil."},
      {"id": "D", "text": "Todas as sensibilidades são perdidas simultaneamente."}
    ]'::jsonb,
    'C',
    'A sensibilidade térmica (quente/frio) é a primeira a ser afetada, seguida da dolorosa e, por último, a tátil. Por isso o teste térmico é crucial.',
    'Dermatologia Sanitária'
  ),
  (
    'Doenças Infecciosas',
    'A reação hansênica Tipo 2 (Eritema Nodoso Hansênico) caracteriza-se clinicamente por:',
    '[
      {"id": "A", "text": "Manchas hipocrômicas com bordas mal delimitadas."},
      {"id": "B", "text": "Nódulos subcutâneos vermelhos e dolorosos, febre e mal-estar geral."},
      {"id": "C", "text": "Inflamação das lesões pré-existentes (turgescência)."},
      {"id": "D", "text": "Perda súbita de força muscular sem dor."}
    ]'::jsonb,
    'B',
    'O ENH é uma reação sistêmica mediada por imunocomplexos, comum nos pacientes multibacilares, apresentando nódulos dolorosos e sintomas gerais.',
    'Ministério da Saúde'
  ),

  -- 3. DENGUE E ARBOVIROSES
  (
    'Doenças Infecciosas',
    'A Prova do Laço é um exame de triagem obrigatório em todo caso suspeito de Dengue. Ela avalia:',
    '[
      {"id": "A", "text": "A contagem de plaquetas."},
      {"id": "B", "text": "A pressão arterial média."},
      {"id": "C", "text": "A fragilidade capilar."},
      {"id": "D", "text": "A coagulação sanguínea (TP e TTPA)."}
    ]'::jsonb,
    'C',
    'A prova do laço positiva (petéquias sob o manguito) indica fragilidade dos vasos capilares, um sinal precoce de risco hemorrágico, mesmo com plaquetas normais.',
    'Ministério da Saúde'
  ),
  (
    'Doenças Infecciosas',
    'Na Dengue, a fase crítica da doença, onde há maior risco de choque por extravasamento plasmático, ocorre geralmente:',
    '[
      {"id": "A", "text": "No primeiro dia de febre."},
      {"id": "B", "text": "Durante o período de defervescência (queda da febre), entre o 3º e 7º dia."},
      {"id": "C", "text": "Após o 10º dia de doença."},
      {"id": "D", "text": "Apenas se houver sangramento visível."}
    ]'::jsonb,
    'B',
    'Quando a febre vai embora é que o perigo aumenta. É o momento de vigiar os sinais de alarme e o choque.',
    'Epidemiologia'
  ),
  (
    'Doenças Infecciosas',
    'Dentre as arboviroses urbanas, qual delas está mais associada à cronificação dos sintomas articulares (artralgia/artrite persistente por meses ou anos)?',
    '[
      {"id": "A", "text": "Dengue."},
      {"id": "B", "text": "Zika."},
      {"id": "C", "text": "Chikungunya."},
      {"id": "D", "text": "Febre Amarela."}
    ]'::jsonb,
    'C',
    'A Chikungunya tem forte tropismo articular, podendo deixar sequelas reumatológicas crônicas e incapacitantes.',
    'Infectologia'
  ),

  -- 4. HIV/AIDS e ISTs
  (
    'Doenças Infecciosas',
    'Em relação à transmissão vertical do HIV, é CORRETO afirmar:',
    '[
      {"id": "A", "text": "O aleitamento materno é permitido se a carga viral da mãe for indetectável."},
      {"id": "B", "text": "A via de parto deve ser sempre cesárea, independente da carga viral."},
      {"id": "C", "text": "O aleitamento materno é contraindicado no Brasil, devendo-se utilizar fórmula láctea."},
      {"id": "D", "text": "O recém-nascido não precisa receber AZT xarope se a mãe tratou durante a gestação."}
    ]'::jsonb,
    'C',
    'No Brasil, o aleitamento cruzado ou materno é contraindicado para mães HIV+, mesmo indetectáveis, devido ao risco residual de transmissão e disponibilidade de fórmula.',
    'PCDT HIV'
  ),
  (
    'Doenças Infecciosas',
    'O VDRL é um teste não treponêmico utilizado para rastreio e monitoramento da Sífilis. Sobre ele, é correto afirmar:',
    '[
      {"id": "A", "text": "Um resultado reagente confirma o diagnóstico de sífilis, não sendo necessário outro teste."},
      {"id": "B", "text": "A queda da titulação (ex: 1:64 para 1:16) indica resposta ao tratamento."},
      {"id": "C", "text": "O resultado torna-se negativo imediatamente após a dose de Penicilina."},
      {"id": "D", "text": "É um teste treponêmico específico que nunca negativa (cicatriz sorológica)."}
    ]'::jsonb,
    'B',
    'O VDRL é quantitativo. A cura é monitorada pela queda dos títulos (pelo menos 2 diluições ou 4 vezes). O teste treponêmico (rápido/FTA-ABS) é que pode ficar positivo para sempre.',
    'PCDT IST'
  ),
  (
    'Doenças Infecciosas',
    'A Profilaxia Pós-Exposição (PEP) para o HIV, em caso de acidente ocupacional com risco ou violência sexual, deve ser iniciada idealmente em até:',
    '[
      {"id": "A", "text": "2 horas (máximo 72h)."},
      {"id": "B", "text": "24 horas (máximo 7 dias)."},
      {"id": "C", "text": "30 minutos apenas."},
      {"id": "D", "text": "Aguardar resultado do teste da fonte."}
    ]'::jsonb,
    'A',
    'Quanto mais cedo, melhor. O tempo ideal é nas primeiras 2h. Após 72h, a eficácia é muito reduzida e não é mais indicada.',
    'Biossegurança'
  ),

  -- 5. HEPATITES VIRAIS
  (
    'Doenças Infecciosas',
    'Na interpretação sorológica da Hepatite B, a presença isolada do marcador Anti-HBs reagente (positivo) indica:',
    '[
      {"id": "A", "text": "Infecção aguda em curso."},
      {"id": "B", "text": "Hepatite crônica ativa."},
      {"id": "C", "text": "Imunidade (por vacinação ou cura)."},
      {"id": "D", "text": "Alta infectividade viral."}
    ]'::jsonb,
    'C',
    'O Anti-HBs é o anticorpo de superfície. Se ele é o único positivo, indica resposta vacinal. Se estiver junto com Anti-HBc IgG, indica cura de infecção passada.',
    'Imunologia'
  ),
  (
    'Doenças Infecciosas',
    'A Hepatite A possui transmissão predominantemente:',
    '[
      {"id": "A", "text": "Parenteral (sangue)."},
      {"id": "B", "text": "Sexual."},
      {"id": "C", "text": "Fecal-oral."},
      {"id": "D", "text": "Vertical."}
    ]'::jsonb,
    'C',
    'A Hepatite A (e a E) é transmitida pela ingestão de água/alimentos contaminados (ciclo fecal-oral).',
    'Infectologia'
  ),

  -- 6. DOENÇAS PREVENÍVEIS POR VACINA
  (
    'Doenças Infecciosas',
    'O Sarampo é uma doença altamente contagiosa. Um sinal patognomônico (característico) que aparece na mucosa oral antes do exantema (manchas na pele) é:',
    '[
      {"id": "A", "text": "Placas de Peyer."},
      {"id": "B", "text": "Manchas de Koplik."},
      {"id": "C", "text": "Língua em framboesa."},
      {"id": "D", "text": "Membrana acinzentada."}
    ]'::jsonb,
    'B',
    'As manchas de Koplik são pequenos pontos brancos na parte interna da bochecha, surgindo dias antes da erupção cutânea.',
    'Pediatria'
  ),
  (
    'Doenças Infecciosas',
    'O tratamento profilático da Raiva Humana após exposição (mordedura de cão/gato) depende da condição do animal. Se o animal for passível de observação, ele deve ser observado por:',
    '[
      {"id": "A", "text": "3 dias."},
      {"id": "B", "text": "5 dias."},
      {"id": "C", "text": "10 dias."},
      {"id": "D", "text": "30 dias."}
    ]'::jsonb,
    'C',
    'Se o cão/gato permanecer saudável por 10 dias após a mordida, ele não estava transmitindo vírus da raiva no momento do acidente, e o tratamento pode ser encerrado.',
    'Vigilância Epidemiológica'
  ),
  (
    'Doenças Infecciosas',
    'O Tétano Acidental é prevenido pela vacinação. Em caso de ferimento com alto risco (profundo/sujo) em paciente com vacinação incerta ou < 3 doses, a conduta é:',
    '[
      {"id": "A", "text": "Apenas lavar com água e sabão."},
      {"id": "B", "text": "Vacina antitetânica + Soro Antitetânico (SAT) ou Imunoglobulina (IGHAT)."},
      {"id": "C", "text": "Apenas reforço da vacina."},
      {"id": "D", "text": "Antibiótico profilático."}
    ]'::jsonb,
    'B',
    'Ferimento de alto risco em não vacinado exige imunização passiva (soro/imunoglobulina) e ativa (vacina) para proteção imediata e duradoura.',
    'Emergência'
  ),

  -- 7. MENINGITES E OUTRAS
  (
    'Doenças Infecciosas',
    'A quimioprofilaxia para contatos íntimos de pacientes com Doença Meningocócica (Meningite) é realizada preferencialmente com:',
    '[
      {"id": "A", "text": "Rifampicina."},
      {"id": "B", "text": "Penicilina."},
      {"id": "C", "text": "Aciclovir."},
      {"id": "D", "text": "Dexametasona."}
    ]'::jsonb,
    'A',
    'A Rifampicina é a droga de escolha para eliminar o estado de portador do meningococo na nasofaringe dos contatos.',
    'Infectologia'
  ),
  (
    'Doenças Infecciosas',
    'Na Leptospirose, a forma grave (Síndrome de Weil) é caracterizada pela tríade:',
    '[
      {"id": "A", "text": "Icterícia, Hemorragia e Insuficiência Renal."},
      {"id": "B", "text": "Febre, Dor articular e Rash cutâneo."},
      {"id": "C", "text": "Tosse, Dispneia e Hemoptise."},
      {"id": "D", "text": "Cefaleia, Rigidez de nuca e Vômitos."}
    ]'::jsonb,
    'A',
    'A tríade clássica de Weil reflete o dano vascular, hepático e renal causado pela leptospira.',
    'Clínica Médica'
  ),
  (
    'Doenças Infecciosas',
    'A Leishmaniose Visceral (Calazar) tem como principal vetor no Brasil:',
    '[
      {"id": "A", "text": "Mosquito Aedes aegypti."},
      {"id": "B", "text": "Flebótomo (Lutzomyia longipalpis / Mosquito Palha)."},
      {"id": "C", "text": "Barbeiro (Triatomíneo)."},
      {"id": "D", "text": "Carrapato estrela."}
    ]'::jsonb,
    'B',
    'O vetor é o mosquito palha (birigui). O cão é o principal reservatório urbano. O agente é a Leishmania chagasi.',
    'Saúde Pública'
  ),
  (
    'Doenças Infecciosas',
    'A Esquistossomose Mansônica é adquirida através:',
    '[
      {"id": "A", "text": "Da picada de insetos."},
      {"id": "B", "text": "Da ingestão de carne de porco malcozida."},
      {"id": "C", "text": "Da penetração ativa de cercárias na pele ao entrar em contato com água contaminada."},
      {"id": "D", "text": "Do contato direto pessoa a pessoa."}
    ]'::jsonb,
    'C',
    'O ciclo envolve o caramujo Biomphalaria (hospedeiro intermediário) que libera cercárias na água doce.',
    'Parasitologia'
  ),
  (
    'Doenças Infecciosas',
    'O sinal de Romaña (edema bipalpebral unilateral indolor) é um sinal clássico, porém raro, da fase aguda de qual doença?',
    '[
      {"id": "A", "text": "Doença de Chagas."},
      {"id": "B", "text": "Malária."},
      {"id": "C", "text": "Toxoplasmose."},
      {"id": "D", "text": "Tracoma."}
    ]'::jsonb,
    'A',
    'Ocorre quando a porta de entrada do Trypanosoma cruzi é a conjuntiva ocular (contato com fezes do barbeiro).',
    'Infectologia'
  ),

  -- 8. COVID-19 e INFLUENZA
  (
    'Doenças Infecciosas',
    'O tratamento com Oseltamivir (Tamiflu) para Influenza (Síndrome Respiratória Aguda Grave) tem sua maior eficácia se iniciado:',
    '[
      {"id": "A", "text": "Após 7 dias de sintomas."},
      {"id": "B", "text": "Nas primeiras 48 horas do início dos sintomas."},
      {"id": "C", "text": "Apenas se houver confirmação laboratorial."},
      {"id": "D", "text": "Apenas em pacientes intubados."}
    ]'::jsonb,
    'B',
    'O antiviral inibe a neuraminidase e deve ser iniciado precocemente (janela de 48h) para reduzir a replicação viral e complicações.',
    'Protocolo Influenza'
  ),
  (
    'Doenças Infecciosas',
    'Sobre a COVID-19, a transmissão ocorre principalmente por:',
    '[
      {"id": "A", "text": "Vetor (mosquito)."},
      {"id": "B", "text": "Fecal-oral."},
      {"id": "C", "text": "Gotículas respiratórias e aerossóis (em procedimentos geradores de aerossol)."},
      {"id": "D", "text": "Sangue e derivados."}
    ]'::jsonb,
    'C',
    'A principal via é respiratória. Gotículas para contato próximo e aerossóis em ambientes fechados ou procedimentos como intubação.',
    'OMS'
  ),

  -- 9. OUTRAS
  (
    'Doenças Infecciosas',
    'A Escabiose (Sarna) é caracterizada clinicamente por:',
    '[
      {"id": "A", "text": "Lesões bolhosas dolorosas."},
      {"id": "B", "text": "Prurido intenso, predominantemente noturno, em áreas de dobras (interdigitais, punhos, axilas)."},
      {"id": "C", "text": "Manchas vermelhas que desaparecem à vitropressão."},
      {"id": "D", "text": "Descamação do couro cabeludo apenas."}
    ]'::jsonb,
    'B',
    'O prurido noturno é clássico, causado pela movimentação do ácaro Sarcoptes scabiei nos túneis epidérmicos.',
    'Dermatologia'
  ),
  (
    'Doenças Infecciosas',
    'Em relação à Toxoplasmose na gestação, a principal medida de prevenção primária para gestantes suscetíveis (IgG e IgM negativos) é:',
    '[
      {"id": "A", "text": "Vacinação no primeiro trimestre."},
      {"id": "B", "text": "Uso profilático de Sulfadiazina."},
      {"id": "C", "text": "Higiene alimentar (não comer carne crua/malpassada, lavar vegetais) e evitar contato com fezes de gatos."},
      {"id": "D", "text": "Isolamento respiratório."}
    ]'::jsonb,
    'C',
    'Não existe vacina. A prevenção é comportamental/alimentar para evitar a ingestão de oocistos ou cistos teciduais.',
    'Obstetrícia'
  ),
  (
    'Doenças Infecciosas',
    'A Febre Maculosa Brasileira é transmitida pela picada de qual vetor?',
    '[
      {"id": "A", "text": "Carrapato-estrela (Amblyomma cajennense)."},
      {"id": "B", "text": "Mosquito Aedes aegypti."},
      {"id": "C", "text": "Pulga do rato."},
      {"id": "D", "text": "Piolho."}
    ]'::jsonb,
    'A',
    'Doença grave causada pela Rickettsia rickettsii. O vetor é o carrapato, comum em áreas com capivaras e cavalos.',
    'Saúde Pública'
  ),
  (
    'Doenças Infecciosas',
    'Na administração da vacina BCG, a evolução normal da lesão vacinal segue a ordem:',
    '[
      {"id": "A", "text": "Mácula -> Pápula -> Pústula -> Úlcera -> Crosta -> Cicatriz."},
      {"id": "B", "text": "Pápula -> Cicatriz imediata."},
      {"id": "C", "text": "Vesícula -> Bolha -> Cicatriz."},
      {"id": "D", "text": "Abscesso frio que exige drenagem."}
    ]'::jsonb,
    'A',
    'O processo inflamatório é esperado e dura cerca de 6 a 12 semanas. Não se deve colocar curativos ou produtos na lesão.',
    'PNI'
  ),
  (
    'Doenças Infecciosas',
    'O HPV (Papilomavírus Humano) é o principal agente etiológico associado ao câncer de:',
    '[
      {"id": "A", "text": "Ovário."},
      {"id": "B", "text": "Endométrio."},
      {"id": "C", "text": "Colo do útero."},
      {"id": "D", "text": "Mama."}
    ]'::jsonb,
    'C',
    'Os subtipos oncogênicos (16 e 18) são responsáveis por cerca de 70% dos casos de câncer cervical.',
    'Oncologia'
  ),
  (
    'Doenças Infecciosas',
    'A gonorreia é uma IST que apresenta, no homem, o quadro clínico clássico de:',
    '[
      {"id": "A", "text": "Úlcera indolor (cancro duro)."},
      {"id": "B", "text": "Uretrite com corrimento purulento abundante e disúria."},
      {"id": "C", "text": "Verrugas genitais."},
      {"id": "D", "text": "Vesículas dolorosas em cacho."}
    ]'::jsonb,
    'B',
    'A uretrite gonocócica causa secreção amarela/esverdeada e muita dor ao urinar. Na mulher, muitas vezes é oligossintomática.',
    'Infectologia'
  ),
  (
    'Doenças Infecciosas',
    'Qual das hepatites virais abaixo depende obrigatoriamente da presença do vírus da Hepatite B para se replicar (coinfecção ou superinfecção)?',
    '[
      {"id": "A", "text": "Hepatite A."},
      {"id": "B", "text": "Hepatite C."},
      {"id": "C", "text": "Hepatite D (Delta)."},
      {"id": "D", "text": "Hepatite E."}
    ]'::jsonb,
    'C',
    'O vírus Delta é um vírus defeituoso que usa o envelope do vírus B (HBsAg) para infectar. Sem o B, o D não existe.',
    'Virologia'
  ),
  (
    'Doenças Infecciosas',
    'Para prevenção da Síndrome de Reye, o uso de Ácido Acetilsalicílico (AAS) é contraindicado em crianças e adolescentes com suspeita de:',
    '[
      {"id": "A", "text": "Dengue e Varicela."},
      {"id": "B", "text": "Caxumba."},
      {"id": "C", "text": "Coqueluche."},
      {"id": "D", "text": "Meningite."}
    ]'::jsonb,
    'A',
    'O uso de salicilatos em infecções virais (principalmente Varicela e Influenza) pode desencadear a Síndrome de Reye (encefalopatia + disfunção hepática grave). Na Dengue, é contraindicado pelo risco hemorrágico.',
    'Pediatria'
  )

ON CONFLICT (question) DO NOTHING;