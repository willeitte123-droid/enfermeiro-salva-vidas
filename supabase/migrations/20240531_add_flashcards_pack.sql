-- Adicionando Flashcards: Centro Cirúrgico
INSERT INTO public.flashcards (deck_category, front_content, back_content) VALUES
('Centro Cirúrgico', 'Quais são os 4 tempos cirúrgicos fundamentais, em ordem?', '1. Diérese (abertura/corte); 2. Hemostasia (controle de sangramento); 3. Exérese (cirurgia propriamente dita); 4. Síntese (fechamento/sutura).'),
('Centro Cirúrgico', 'Quais são os 3 momentos de verificação do Checklist de Cirurgia Segura da OMS?', '1. Sign In (Antes da indução anestésica); 2. Time Out (Antes da incisão da pele - Pausa Cirúrgica); 3. Sign Out (Antes do paciente sair da sala).'),
('Centro Cirúrgico', 'Qual a classificação de uma cirurgia de Apendicectomia Supurada quanto ao potencial de contaminação?', 'Cirurgia Infectada (presença de pus/processo infeccioso prévio).'),
('Centro Cirúrgico', 'Para que serve a Escala de Aldrete e Kroulik?', 'Avaliar as condições fisiológicas do paciente para a alta da Sala de Recuperação Pós-Anestésica (SRPA). Nota mínima geralmente é 8 a 10.'),
('Centro Cirúrgico', 'Qual a diferença entre esterilização e desinfecção?', 'Esterilização elimina TODAS as formas de vida microbiana (incluindo esporos). Desinfecção elimina a maioria dos patógenos, mas não necessariamente esporos.'),
('Centro Cirúrgico', 'Em qual posição cirúrgica o paciente fica deitado de costas, com as pernas elevadas e apoiadas em perneiras?', 'Posição de Litotomia (ou Ginecológica). Usada para cirurgias perineais, retais e vaginais.'),
('Centro Cirúrgico', 'O que é a posição de Trendelenburg?', 'Decúbito dorsal com a cabeça mais baixa que o corpo. Usada para cirurgias pélvicas (afasta as vísceras) e em casos de choque hipovolêmico (retorno venoso).'),
('Centro Cirúrgico', 'Qual a validade de um pacote estéril processado em autoclave (papel grau cirúrgico)?', 'Depende da instituição e das condições de armazenamento, mas geralmente considera-se o evento (rasgo, umidade) e não apenas o tempo. Protocolos comuns citam 30 a 60 dias, mas a integridade da embalagem é mandatória.');

-- Adicionando Flashcards: Saúde do Idoso
INSERT INTO public.flashcards (deck_category, front_content, back_content) VALUES
('Saúde do Idoso', 'Quais são os "Gigantes da Geriatria" (Os 5 Is)?', '1. Instabilidade postural (quedas); 2. Imobilidade; 3. Incontinência (urinária/fecal); 4. Incapacidade cognitiva (demência/delirium); 5. Iatrogenia (polifarmácia).'),
('Saúde do Idoso', 'Qual a diferença entre Senescência e Senilidade?', 'Senescência é o envelhecimento fisiológico (natural/saudável). Senilidade é o envelhecimento patológico (associado a doenças e incapacidades).'),
('Saúde do Idoso', 'Segundo o Estatuto do Idoso, qual idade define a "Prioridade Especial"?', 'Pessoas com idade igual ou superior a 80 anos têm prioridade sobre os demais idosos (exceto em emergências médicas).'),
('Saúde do Idoso', 'Quais são as vacinas básicas recomendadas para o idoso?', 'Influenza (anual), Pneumocócica 23-valente (para institucionalizados/acamados), Dupla Adulto (dT - reforço 10 anos) e Hepatite B.'),
('Saúde do Idoso', 'Qual a diferença entre ABVD e AIVD na avaliação funcional?', 'ABVD (Atividades Básicas): Autocuidado (banho, comer). AIVD (Atividades Instrumentais): Vida prática (compras, telefone, finanças). As AIVD são perdidas primeiro na demência.'),
('Saúde do Idoso', 'O que caracteriza a Síndrome de Fragilidade no idoso?', 'Perda de peso não intencional, exaustão (fadiga), fraqueza muscular (preensão palmar), lentidão na marcha e baixo nível de atividade física.'),
('Saúde do Idoso', 'Qual a notificação compulsória específica relacionada à violência contra o idoso?', 'Suspeita ou confirmação de violência (física, psicológica, patrimonial) deve ser notificada e comunicada à autoridade policial, Ministério Público ou Conselho do Idoso.');

-- Adicionando Flashcards: Saúde do Adulto
INSERT INTO public.flashcards (deck_category, front_content, back_content) VALUES
('Saúde do Adulto', 'Quais os critérios diagnósticos para Diabetes Mellitus (jejum e HbA1c)?', 'Glicemia de Jejum >= 126 mg/dL e/ou Hemoglobina Glicada (HbA1c) >= 6,5% (confirmados em nova coleta).'),
('Saúde do Adulto', 'Qual o valor de Pressão Arterial considerado Hipertensão Estágio 1?', 'Sistólica 140-159 mmHg e/ou Diastólica 90-99 mmHg.'),
('Saúde do Adulto', 'O que é a definição de caso de Sintomático Respiratório na Tuberculose?', 'Pessoa com tosse por 3 semanas ou mais (população geral). Para populações vulneráveis, qualquer tempo de tosse.'),
('Saúde do Adulto', 'Qual o esquema básico de tratamento da Tuberculose (adulto)?', '2 meses de RHZE (Rifampicina, Isoniazida, Pirazinamida, Etambutol) + 4 meses de RH (Rifampicina, Isoniazida).'),
('Saúde do Adulto', 'Como se transmite a Hanseníase?', 'Através de gotículas das vias aéreas superiores (tosse, espirro) de pacientes multibacilares não tratados, após contato íntimo e prolongado.'),
('Saúde do Adulto', 'Quais são os sinais clássicos (4 Ps) do Diabetes descompensado?', 'Poliúria (muita urina), Polidipsia (muita sede), Polifagia (fome excessiva) e Perda de peso.'),
('Saúde do Adulto', 'O que é a Síndrome Metabólica?', 'Conjunto de fatores de risco cardiovascular: Obesidade abdominal, Triglicerídeos altos, HDL baixo, Pressão alta e Glicemia de jejum alterada.'),
('Saúde do Adulto', 'Qual a diferença entre Angina Instável e IAM?', 'Na Angina Instável não há necrose miocárdica (enzimas cardíacas/troponina negativas). No IAM ocorre necrose (enzimas positivas).');

-- Adicionando Flashcards: Cálculo de Medicação
INSERT INTO public.flashcards (deck_category, front_content, back_content) VALUES
('Cálculo de Medicação', 'Qual a fórmula para cálculo de gotas por minuto (tempo em horas)?', 'Gotas/min = Volume (ml) / (Tempo (h) x 3).'),
('Cálculo de Medicação', 'Qual a fórmula para cálculo de microgotas por minuto (tempo em horas)?', 'Microgotas/min = Volume (ml) / Tempo (h). (Ou Gotas x 3).'),
('Cálculo de Medicação', 'Quantas gotas equivalem a 1 ml?', '20 gotas.'),
('Cálculo de Medicação', 'Quantas microgotas equivalem a 1 ml?', '60 microgotas.'),
('Cálculo de Medicação', 'Quantas microgotas equivalem a 1 gota?', '3 microgotas.'),
('Cálculo de Medicação', 'Para administrar 500ml de SF em 8 horas, qual o gotejamento?', '500 / (8 x 3) = 500 / 24 = 20,8 (aprox. 21 gotas/min).'),
('Cálculo de Medicação', 'Quantos mg de soluto existem em uma ampola de Glicose 50% com 10ml?', '50% significa 50g em 100ml. Logo, em 10ml temos 5g (5000mg).'),
('Cálculo de Medicação', 'Diluição de Penicilina Cristalina 5.000.000 UI. O pó corresponde a quantos ml?', 'O pó corresponde a 2ml de volume. Se diluir com 8ml de água, o volume total será 10ml. Logo, 5.000.000 UI = 10ml.'),
('Cálculo de Medicação', 'Prescrição: 150mg de Amicacina. Frasco: 500mg/2ml. Quanto aspirar?', 'Regra de três: 500mg está para 2ml, assim como 150mg está para X. (150 * 2) / 500 = 300 / 500 = 0,6 ml.'),
('Cálculo de Medicação', 'Qual a fórmula para transformar soro (Glicose)?', 'C1 . V1 + C2 . V2 = C3 . V3 (Onde C é concentração e V é volume).');