INSERT INTO public.questions (category, banca, question, options, "correctAnswer", explanation)
VALUES

-- 1. ESTILO FGV (Casos Clínicos Longos e Complexos)
('Saúde do Adulto (Clínica Médica)', 'FGV', 'J.S., 58 anos, hipertenso e tabagista, dá entrada na emergência com dor torácica opressiva iniciada há 45 minutos. O ECG revela supradesnivelamento do segmento ST em DII, DIII e aVF. Considerando o protocolo de Síndrome Coronariana Aguda (SCA), além da monitorização e oxigenoterapia (se SpO2 < 90%), qual é a terapia de reperfusão preferencial e o tempo porta-balão ideal, respectivamente?',
'[{"id": "A", "text": "Trombólise química; tempo porta-agulha de 60 minutos"}, {"id": "B", "text": "Intervenção Coronária Percutânea (ICP) primária; tempo porta-balão de até 90 minutos"}, {"id": "C", "text": "Heparina de baixo peso molecular; tempo porta-agulha de 30 minutos"}, {"id": "D", "text": "Cirurgia de revascularização miocárdica (CRM); tempo porta-centro cirúrgico de 12 horas"}, {"id": "E", "text": "Administração de Nitrato sublingual; tempo de observação de 30 minutos"}]',
'B', 'Estilo FGV: Caso clínico detalhado. A resposta exige conhecimento de diretrizes (SBC/AHA). No IAM com Supra (IAMCSST), a angioplastia (ICP) é preferencial se realizada em até 90 min.'),

('Saúde da Criança', 'FGV', 'Uma criança de 4 anos é admitida com quadro de edema generalizado (anasarca), urina espumosa e hiperlipidemia. A PA está normal. Os exames mostram proteinúria maciça (3+/4+) e hipoalbuminemia. O quadro clínico é sugestivo de Síndrome Nefrótica. Dentre os cuidados de enfermagem prioritários, destaca-se:',
'[{"id": "A", "text": "Restrição hídrica severa e dieta hiperproteica"}, {"id": "B", "text": "Controle rigoroso de peso diário, balanço hídrico e avaliação de edema"}, {"id": "C", "text": "Administração de antibióticos profiláticos e isolamento de contato"}, {"id": "D", "text": "Cateterismo vesical de demora para controle de diurese"}, {"id": "E", "text": "Estímulo à deambulação vigorosa para reduzir o edema"}]',
'B', 'Estilo FGV: Patologia específica. Na síndrome nefrótica, o controle de peso e balanço são vitais para avaliar a retenção hídrica e a eficácia dos diuréticos/corticoides.'),


-- 2. ESTILO CEBRASPE/CESPE (Conceitual, Pegadinhas, "Certo ou Errado" adaptado)
('Legislação do SUS', 'Cebraspe', 'Acerca da Lei nº 8.080/1990 e da organização do SUS, assinale a opção correta:',
'[{"id": "A", "text": "A participação da iniciativa privada no SUS é vedada em qualquer circunstância"}, {"id": "B", "text": "As conferências de saúde devem ocorrer anualmente para definir as diretrizes políticas"}, {"id": "C", "text": "A direção do SUS é única em cada esfera de governo, sendo exercida, no âmbito da União, pelo Ministério da Saúde"}, {"id": "D", "text": "Os municípios não têm autonomia para gerir seus sistemas de saúde, dependendo integralmente dos estados"}]',
'C', 'Estilo Cebraspe: Testa o texto da lei. A opção C é a literalidade do Art. 9º da Lei 8.080. Conferências são a cada 4 anos (não anual). Iniciativa privada participa de forma complementar.'),

('Fundamentos de Enfermagem', 'Cebraspe', 'Com relação à administração de medicamentos, assinale a alternativa que apresenta uma contraindicação absoluta para a administração de vacinas vivas atenuadas (ex: Tríplice Viral):',
'[{"id": "A", "text": "História de doença febril leve"}, {"id": "B", "text": "Uso de antibióticos"}, {"id": "C", "text": "Imunodeficiência congênita ou adquirida (ex: HIV com imunossupressão grave) e gravidez"}, {"id": "D", "text": "História familiar de reação adversa à vacina"}]',
'C', 'Estilo Cebraspe: Foco em contraindicações e segurança. Vacinas vivas podem causar a doença em imunossuprimidos e afetar o feto na gravidez.'),


-- 3. ESTILO VUNESP (Direta, Técnica, Procedimental)
('Urgência e Emergência', 'Vunesp', 'Em um atendimento pré-hospitalar a uma vítima de trauma, ao avaliar a circulação (C), o profissional nota hemorragia externa importante em membro inferior. Segundo o PHTLS (9ª/10ª ed.), a conduta imediata, antes mesmo da avaliação das vias aéreas, se o sangramento for exsanguinante, é:',
'[{"id": "A", "text": "Elevação do membro e curativo compressivo"}, {"id": "B", "text": "Aplicação de torniquete logo acima da lesão (ou na raiz do membro)"}, {"id": "C", "text": "Administração de Ringer Lactato aquecido"}, {"id": "D", "text": "Realização de acesso intraósseo"}]',
'B', 'Estilo Vunesp: Atualização de protocolo. O "X" (hemorragia exsanguinante) vem antes do ABC no protocolo XABCDE. O torniquete é a primeira linha em extremidades.'),

('Saúde da Mulher', 'Vunesp', 'A bactéria Streptococcus agalactiae (Estreptococo do Grupo B) é uma importante causa de sepse neonatal. O rastreamento em gestantes deve ser realizado através de cultura de swab vaginal e retal entre:',
'[{"id": "A", "text": "10 e 12 semanas"}, {"id": "B", "text": "20 e 24 semanas"}, {"id": "C", "text": "35 e 37 semanas"}, {"id": "D", "text": "Apenas no momento do parto"}]',
'C', 'Estilo Vunesp: Prazos e protocolos de pré-natal. O rastreio é feito no final da gestação (35-37 sem) para garantir a validade do resultado no parto.'),


-- 4. ESTILO IBFC (Lei Seca, Decoreba, Listas)
('Ética e Legislação', 'IBFC', 'Conforme o Código de Ética dos Profissionais de Enfermagem, a penalidade de Multa consiste no pagamento de:',
'[{"id": "A", "text": "01 a 05 salários mínimos vigentes"}, {"id": "B", "text": "01 a 10 vezes o valor da anuidade da categoria profissional"}, {"id": "C", "text": "10 a 20% do salário do profissional"}, {"id": "D", "text": "Valor arbitrado pelo juiz de direito"}]',
'B', 'Estilo IBFC: Cobra o detalhe numérico da lei. A multa é baseada no valor da anuidade (1 a 10 vezes).'),

('Saúde Pública', 'IBFC', 'De acordo com o Calendário Nacional de Vacinação, a vacina BCG deve ser administrada:',
'[{"id": "A", "text": "Ao nascer, em dose única, por via intradérmica"}, {"id": "B", "text": "Aos 2 meses, por via intramuscular"}, {"id": "C", "text": "Ao nascer, por via subcutânea"}, {"id": "D", "text": "Aos 6 meses, juntamente com a Influenza"}]',
'A', 'Estilo IBFC: Básico bem feito. BCG = Ao nascer, Intradérmica (inserção do deltoide direito).'),


-- 5. ESTILO FCC (Fundação Carlos Chagas - Situação Gerencial/Ética)
('Administração em Enfermagem', 'FCC', 'O enfermeiro coordenador de uma unidade de internação percebe um aumento na incidência de flebites. Para intervir, ele decide utilizar o ciclo PDCA. A etapa "Check" (Verificar) corresponde a:',
'[{"id": "A", "text": "Treinar a equipe sobre punção venosa"}, {"id": "B", "text": "Estabelecer a meta de redução de flebites"}, {"id": "C", "text": "Monitorar e medir os resultados após a intervenção para comparar com a meta"}, {"id": "D", "text": "Padronizar o novo cateter"}]',
'C', 'Estilo FCC: Aplicação de ferramentas de gestão. Check = Verificar/Checar os resultados obtidos.'),

('Saúde Mental', 'FCC', 'Na Reforma Psiquiátrica Brasileira (Lei 10.216/2001), a internação involuntária (sem consentimento do usuário e a pedido de terceiro) deve ser comunicada ao Ministério Público no prazo máximo de:',
'[{"id": "A", "text": "24 horas"}, {"id": "B", "text": "48 horas"}, {"id": "C", "text": "72 horas"}, {"id": "D", "text": "07 dias"}]',
'C', 'Estilo FCC: Prazos legais. A comunicação ao MP deve ocorrer em até 72h para evitar cárcere privado.'),


-- 6. ESTILO AOCP (Enfermagem Geral, Termos Técnicos)
('Fundamentos de Enfermagem', 'AOCP', 'O termo técnico utilizado para descrever a presença de sangue na urina é:',
'[{"id": "A", "text": "Disúria"}, {"id": "B", "text": "Hematúria"}, {"id": "C", "text": "Poliúria"}, {"id": "D", "text": "Anúria"}, {"id": "E", "text": "Nictúria"}]',
'B', 'Estilo AOCP: Terminologia. Disúria (dor), Poliúria (muito volume), Anúria (sem urina), Nictúria (urinar à noite).'),

('Terapia Intensiva (UTI)', 'AOCP', 'Para a monitorização da Pressão Arterial Média (PAM) invasiva, o sistema transdutor deve ser zerado (nivelado) na altura do:',
'[{"id": "A", "text": "Ângulo de Louis"}, {"id": "B", "text": "Eixo flebostático (4º espaço intercostal, linha axilar média)"}, {"id": "C", "text": "Apêndice xifoide"}, {"id": "D", "text": "Lóbulo da orelha"}]',
'B', 'Estilo AOCP: Técnica de UTI. O eixo flebostático corresponde ao nível do átrio direito.')

ON CONFLICT (question) DO NOTHING;