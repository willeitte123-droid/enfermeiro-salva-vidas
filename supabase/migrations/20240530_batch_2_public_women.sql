INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation)
VALUES
-- 10 Questões de Saúde Pública
('Saúde Pública', 'Vunesp', 'De acordo com o Calendário Nacional de Vacinação, a vacina BCG, indicada para prevenir as formas graves da tuberculose, deve ser administrada em dose única ao nascer, por via:',
'[{"id": "A", "text": "Intramuscular"}, {"id": "B", "text": "Subcutânea"}, {"id": "C", "text": "Intradérmica"}, {"id": "D", "text": "Oral"}]',
'C', 'A vacina BCG é administrada via Intradérmica, na inserção inferior do músculo deltoide do braço direito, formando a pápula característica.'),

('Saúde Pública', 'IBFC', 'Um paciente apresenta tosse produtiva há mais de 3 semanas. Na estratégia de busca ativa da Tuberculose, este paciente é definido como:',
'[{"id": "A", "text": "Caso suspeito de Pneumonia"}, {"id": "B", "text": "Sintomático Respiratório"}, {"id": "C", "text": "Caso confirmado de TB"}, {"id": "D", "text": "Portador de DPOC"}]',
'B', 'O indivíduo com tosse por 3 semanas ou mais é considerado Sintomático Respiratório e deve ser investigado para Tuberculose (baciloscopia/TRM).'),

('Saúde Pública', 'FGV', 'Qual das doenças abaixo integra a Lista Nacional de Notificação Compulsória IMEDIATA (em até 24 horas) ao Ministério da Saúde?',
'[{"id": "A", "text": "Hipertensão Arterial"}, {"id": "B", "text": "Diabetes Mellitus"}, {"id": "C", "text": "Botulismo"}, {"id": "D", "text": "Hipotireoidismo"}]',
'C', 'O Botulismo é uma doença grave com potencial de surto e alta letalidade, exigindo notificação imediata (em até 24h) para as três esferas de gestão.'),

('Saúde Pública', 'Cebraspe', 'A temperatura ideal recomendada para a conservação de vacinas (imunobiológicos) na geladeira da sala de vacinas (nível local) é:',
'[{"id": "A", "text": "-2°C a 0°C"}, {"id": "B", "text": "+2°C a +8°C"}, {"id": "C", "text": "+8°C a +12°C"}, {"id": "D", "text": "Temperatura ambiente"}]',
'B', 'A temperatura deve ser mantida entre +2°C e +8°C, sendo idealmente +5°C. Temperaturas abaixo de +2°C congelam e inativam vacinas contendo adjuvante (ex: dT, HepB).'),

('Saúde Pública', 'FCC', 'Para o diagnóstico de Diabetes Mellitus, considera-se como critério uma Glicemia de Jejum igual ou superior a:',
'[{"id": "A", "text": "100 mg/dL"}, {"id": "B", "text": "110 mg/dL"}, {"id": "C", "text": "126 mg/dL"}, {"id": "D", "text": "140 mg/dL"}]',
'C', 'Glicemia de jejum >= 126 mg/dL em duas ocasiões confirma o diagnóstico. Entre 100 e 125 é considerado pré-diabetes (glicemia de jejum alterada).'),

('Saúde Pública', 'AOCP', 'Na Atenção Básica, o princípio que garante o acompanhamento do usuário ao longo do tempo, criando vínculo e responsabilização contínua, é a:',
'[{"id": "A", "text": "Longitudinalidade"}, {"id": "B", "text": "Universalidade"}, {"id": "C", "text": "Descentralização"}, {"id": "D", "text": "Hierarquização"}]',
'A', 'Longitudinalidade é o atributo da Atenção Primária que se refere à continuidade da relação entre profissional/equipe e paciente ao longo da vida.'),

('Saúde Pública', 'Vunesp', 'A Lei nº 8.080/90 define que a direção do Sistema Único de Saúde (SUS) é única em cada esfera de governo. No âmbito da União, essa direção é exercida pelo:',
'[{"id": "A", "text": "Conselho Nacional de Saúde"}, {"id": "B", "text": "Ministério da Saúde"}, {"id": "C", "text": "ANVISA"}, {"id": "D", "text": "Secretarias Estaduais"}]',
'B', 'A direção é única: Ministério da Saúde (União), Secretaria Estadual de Saúde (Estado) e Secretaria Municipal de Saúde (Município).'),

('Saúde Pública', 'Consulplan', 'A medida antropométrica mais sensível para avaliar o estado nutricional e o risco de obesidade abdominal em adultos na Atenção Básica é:',
'[{"id": "A", "text": "Peso"}, {"id": "B", "text": "Altura"}, {"id": "C", "text": "Circunferência da Cintura"}, {"id": "D", "text": "Pregas Cutâneas"}]',
'C', 'A circunferência da cintura correlaciona-se com a gordura visceral e é um preditor independente de risco cardiovascular e metabólico.'),

('Saúde Pública', 'IDECAN', 'A vacina Tríplice Viral protege contra quais doenças?',
'[{"id": "A", "text": "Sarampo, Caxumba e Rubéola"}, {"id": "B", "text": "Difteria, Tétano e Coqueluche"}, {"id": "C", "text": "Hepatite B, Tétano e Influenza"}, {"id": "D", "text": "Pólio, Sarampo e Varicela"}]',
'A', 'Tríplice Viral = Sarampo, Caxumba e Rubéola. É administrada aos 12 meses. Aos 15 meses, reforça-se com a Tetra Viral (inclui Varicela).'),

('Saúde Pública', 'FGV', 'Qual é o exame de rastreamento (screening) indicado para detecção precoce do câncer de colo do útero em mulheres de 25 a 64 anos?',
'[{"id": "A", "text": "Colposcopia"}, {"id": "B", "text": "Ultrassom Transvaginal"}, {"id": "C", "text": "Exame Citopatológico (Papanicolau)"}, {"id": "D", "text": "Histeroscopia"}]',
'C', 'O exame citopatológico é a estratégia de rastreamento recomendada pelo Ministério da Saúde. Periodicidade: anual, e após 2 exames negativos consecutivos, a cada 3 anos.'),

-- 10 Questões de Saúde da Mulher
('Saúde da Mulher', 'Vunesp', 'A Regra de Naegele é usada para calcular a Data Provável do Parto (DPP). Se a DUM foi 10/05/2023, qual a DPP?',
'[{"id": "A", "text": "10/02/2024"}, {"id": "B", "text": "17/02/2024"}, {"id": "C", "text": "17/01/2024"}, {"id": "D", "text": "10/01/2024"}]',
'B', 'Cálculo: Dia + 7 (10+7=17) e Mês - 3 (5-3=2) ou +9. Ano seguinte. Resultado: 17/02/2024.'),

('Saúde da Mulher', 'Cesgranrio', 'Qual a vacina recomendada para todas as gestantes a partir da 20ª semana de gestação, a cada gestação, para proteger o recém-nascido contra a coqueluche?',
'[{"id": "A", "text": "dT (Dupla adulto)"}, {"id": "B", "text": "dTpa (Tríplice bacteriana acelular)"}, {"id": "C", "text": "Hepatite B"}, {"id": "D", "text": "Influenza"}]',
'B', 'A dTpa é essencial para passar anticorpos contra a coqueluche (Bordetella pertussis) para o feto, protegendo-o nos primeiros meses de vida.'),

('Saúde da Mulher', 'FCC', 'A principal causa de morte materna direta no Brasil é:',
'[{"id": "A", "text": "Infecção Puerperal"}, {"id": "B", "text": "Hemorragia Pós-Parto"}, {"id": "C", "text": "Doença Hipertensiva Específica da Gestação (DHEG)"}, {"id": "D", "text": "Tromboembolismo"}]',
'C', 'As síndromes hipertensivas (Pré-eclâmpsia/Eclâmpsia) são historicamente a principal causa de morte materna no Brasil, seguidas de perto pelas hemorragias.'),

('Saúde da Mulher', 'IBFC', 'O medicamento de escolha para prevenção e tratamento das convulsões na Eclâmpsia é:',
'[{"id": "A", "text": "Diazepam"}, {"id": "B", "text": "Sulfato de Magnésio"}, {"id": "C", "text": "Fenitoína"}, {"id": "D", "text": "Hidralazina"}]',
'B', 'O Sulfato de Magnésio é o padrão-ouro para prevenir convulsões na pré-eclâmpsia grave e tratar na eclâmpsia. O antídoto em caso de intoxicação é o Gluconato de Cálcio.'),

('Saúde da Mulher', 'AOCP', 'Segundo o Ministério da Saúde, a mamografia de rastreamento para câncer de mama deve ser realizada em mulheres de risco habitual na faixa etária de:',
'[{"id": "A", "text": "40 a 49 anos, anualmente"}, {"id": "B", "text": "50 a 69 anos, a cada dois anos"}, {"id": "C", "text": "35 a 70 anos, anualmente"}, {"id": "D", "text": "A partir dos 45 anos, anualmente"}]',
'B', 'A recomendação oficial do INCA/MS para rastreamento populacional é 50 a 69 anos, bienal. A SBM (Sociedade Brasileira de Mastologia) recomenda diferente (a partir dos 40), mas em concursos SUS vale o MS.'),

('Saúde da Mulher', 'FGV', 'Durante o trabalho de parto, a fase em que ocorre a dilatação total do colo uterino (10 cm) até a expulsão completa do feto é chamada de:',
'[{"id": "A", "text": "Período de Dilatação"}, {"id": "B", "text": "Período Expulsivo"}, {"id": "C", "text": "De quitação (Secundamento)"}, {"id": "D", "text": "Período de Greenberg"}]',
'B', 'O período expulsivo começa com a dilatação total e termina com o nascimento do bebê. O secundamento é a saída da placenta.'),

('Saúde da Mulher', 'Vunesp', 'A manobra realizada logo após o nascimento, que consiste na massagem uterina bimanual ou externa para estimular a contração do útero e prevenir hemorragia pós-parto por atonia, é fundamental. Qual medicamento ocitócito é a primeira escolha na prevenção da HPP?',
'[{"id": "A", "text": "Misoprostol"}, {"id": "B", "text": "Ergotamina"}, {"id": "C", "text": "Ocitocina"}, {"id": "D", "text": "Ácido Tranexâmico"}]',
'C', 'A Ocitocina (10 UI IM ou IV) é a droga de escolha universal para profilaxia da hemorragia pós-parto na terceira fase do parto.'),

('Saúde da Mulher', 'IDECAN', 'No exame físico das mamas, a retração da pele ou do mamilo, a presença de nódulo endurecido e indolor e a secreção papilar sanguinolenta espontânea são sinais de alerta para:',
'[{"id": "A", "text": "Mastite"}, {"id": "B", "text": "Fibroadenoma"}, {"id": "C", "text": "Cisto mamário"}, {"id": "D", "text": "Câncer de mama"}]',
'D', 'Sinais clássicos de malignidade. O fibroadenoma é geralmente móvel, liso e comum em jovens. Mastite apresenta sinais flogísticos (dor, calor, rubor).'),

('Saúde da Mulher', 'Consulplan', 'A suplementação de Ácido Fólico no período periconcepcional (antes e logo após engravidar) tem como principal objetivo prevenir:',
'[{"id": "A", "text": "Anemia ferropriva"}, {"id": "B", "text": "Defeitos do Tubo Neural (DTN) no feto"}, {"id": "C", "text": "Pré-eclâmpsia"}, {"id": "D", "text": "Diabetes Gestacional"}]',
'B', 'O Ácido Fólico previne defeitos no fechamento do tubo neural, como espinha bífida e anencefalia.'),

('Saúde da Mulher', 'EBSERH', 'O teste de triagem para Sífilis, obrigatório no pré-natal (1º e 3º trimestres) e na admissão para o parto, é o:',
'[{"id": "A", "text": "FTA-Abs"}, {"id": "B", "text": "VDRL"}, {"id": "C", "text": "Elisa HIV"}, {"id": "D", "text": "Coombs Indireto"}]',
'B', 'O VDRL é o teste não treponêmico utilizado para rastreio e controle de cura da sífilis. Se positivo, confirma-se com teste treponêmico (rápido/FTA-Abs).')
ON CONFLICT (question) DO NOTHING;