INSERT INTO public.questions (category, question, options, "correctAnswer", explanation, banca)
VALUES
(
  'Urgência e Emergência',
  'Durante o atendimento a uma Parada Cardiorrespiratória (PCR) em um adulto, qual é a relação correta entre compressões e ventilações quando não há via aérea avançada instalada?',
  '[
    {"id": "A", "text": "15 compressões para 2 ventilações."},
    {"id": "B", "text": "30 compressões para 2 ventilações."},
    {"id": "C", "text": "30 compressões para 1 ventilação."},
    {"id": "D", "text": "Compressões contínuas sem ventilação."}
  ]'::jsonb,
  'B',
  'Segundo as diretrizes da AHA, a relação compressão-ventilação para adultos sem via aérea avançada é de 30:2.',
  'AHA'
),
(
  'Urgência e Emergência',
  'Em um paciente com PCR em ritmo de Fibrilação Ventricular (FV) ou Taquicardia Ventricular sem pulso (TVSP), qual é a prioridade imediata após o reconhecimento do ritmo?',
  '[
    {"id": "A", "text": "Administração de Adrenalina."},
    {"id": "B", "text": "Intubação Orotraqueal."},
    {"id": "C", "text": "Desfibrilação Precoce."},
    {"id": "D", "text": "Acesso Venoso Periférico."}
  ]'::jsonb,
  'C',
  'A desfibrilação precoce é a única terapia eficaz para reverter FV/TVSP e é a prioridade absoluta nesses ritmos chocáveis.',
  'AHA'
),
(
  'Urgência e Emergência',
  'Qual é a droga de primeira linha utilizada no tratamento da anafilaxia grave (choque anafilático)?',
  '[
    {"id": "A", "text": "Dexametasona (Corticoide)."},
    {"id": "B", "text": "Prometazina (Anti-histamínico)."},
    {"id": "C", "text": "Adrenalina (Epinefrina) Intramuscular."},
    {"id": "D", "text": "Noradrenalina Endovenosa."}
  ]'::jsonb,
  'C',
  'A Adrenalina IM é a droga de escolha e deve ser administrada imediatamente. Corticoides e anti-histamínicos são adjuvantes secundários.',
  'VUNESP'
),
(
  'Urgência e Emergência',
  'No atendimento ao politraumatizado, a letra "A" do XABCDE primário refere-se a:',
  '[
    {"id": "A", "text": "Avaliação da circulação e controle de hemorragias."},
    {"id": "B", "text": "Avaliação neurológica e pupilas."},
    {"id": "C", "text": "Manutenção das vias aéreas com proteção da coluna cervical."},
    {"id": "D", "text": "Exposição do paciente e controle da hipotermia."}
  ]'::jsonb,
  'C',
  'O "A" (Airway) foca na permeabilidade das vias aéreas SIMULTANEAMENTE com a proteção da coluna cervical.',
  'PHTLS'
),
(
  'Urgência e Emergência',
  'Um paciente chega à emergência com dor torácica típica. O ECG realizado em 5 minutos mostra supradesnivelamento do segmento ST em DII, DIII e aVF. Qual o diagnóstico provável?',
  '[
    {"id": "A", "text": "Infarto Agudo do Miocárdio de Parede Anterior."},
    {"id": "B", "text": "Infarto Agudo do Miocárdio de Parede Inferior."},
    {"id": "C", "text": "Pericardite Aguda."},
    {"id": "D", "text": "Embolia Pulmonar Maciça."}
  ]'::jsonb,
  'B',
  'As derivações DII, DIII e aVF "olham" para a parede inferior do coração (ventrículo direito). Supra nessas derivações indica IAM de parede inferior.',
  'FCC'
),
(
  'Urgência e Emergência',
  'Qual é o tempo máximo recomendado (janela terapêutica padrão) para a administração de trombolíticos no AVC isquêmico agudo?',
  '[
    {"id": "A", "text": "Até 3 horas."},
    {"id": "B", "text": "Até 4,5 horas."},
    {"id": "C", "text": "Até 6 horas."},
    {"id": "D", "text": "Até 12 horas."}
  ]'::jsonb,
  'B',
  'A janela terapêutica padrão para trombólise endovenosa no AVC isquêmico é de até 4,5 horas do início dos sintomas.',
  'CESPE'
),
(
  'Urgência e Emergência',
  'Na avaliação de um paciente com queimadura, a "Regra dos Nove" atribui qual porcentagem de superfície corporal queimada (SCQ) para cada membro superior (braço/antebraço/mão) em um adulto?',
  '[
    {"id": "A", "text": "4,5%."},
    {"id": "B", "text": "9%."},
    {"id": "C", "text": "18%."},
    {"id": "D", "text": "1%."}
  ]'::jsonb,
  'B',
  'Cada membro superior completo corresponde a 9% da SCQ em adultos (4,5% frente + 4,5% verso).',
  'IBFC'
),
(
  'Urgência e Emergência',
  'Qual das seguintes opções é um sinal clássico de Tamponamento Cardíaco (Tríade de Beck)?',
  '[
    {"id": "A", "text": "Hipertensão, Bradicardia e Respiração Irregular."},
    {"id": "B", "text": "Hipotensão, Turgência Jugular e Bulhas Cardíacas Abafadas."},
    {"id": "C", "text": "Hipotensão, Taquicardia e Pele Quente."},
    {"id": "D", "text": "Hipertensão, Taquicardia e Edema de MMII."}
  ]'::jsonb,
  'B',
  'A Tríade de Beck para Tamponamento Cardíaco é: Hipotensão Arterial + Turgência Jugular (Jugulares distendidas) + Bulhas Hipofonéticas (Abafadas).',
  'FGV'
),
(
  'Urgência e Emergência',
  'Qual a principal causa reversível de PCR (5Hs e 5Ts) que deve ser suspeitada em um paciente politraumatizado com turgência jugular, desvio de traqueia e ausência de murmúrio vesicular unilateral?',
  '[
    {"id": "A", "text": "Hipovolemia."},
    {"id": "B", "text": "Trombose Coronariana."},
    {"id": "C", "text": "Pneumotórax Hipertensivo (Tensão)."},
    {"id": "D", "text": "Hipotermia."}
  ]'::jsonb,
  'C',
  'O quadro de choque obstrutivo com turgência, desvio de traqueia e silêncio auscultatório é clássico de Pneumotórax Hipertensivo (Tensão).',
  'VUNESP'
),
(
  'Urgência e Emergência',
  'Em um paciente com Choque Hipovolêmico Classe III, espera-se encontrar:',
  '[
    {"id": "A", "text": "PA normal e FC < 100 bpm."},
    {"id": "B", "text": "Hipotensão, Taquicardia (>120 bpm) e Confusão Mental."},
    {"id": "C", "text": "Hipotensão e Bradicardia."},
    {"id": "D", "text": "Hipertensão e Agitação."}
  ]'::jsonb,
  'B',
  'No choque classe III (perda de 30-40% da volemia), os mecanismos compensatórios falham, surgindo hipotensão, taquicardia acentuada e alteração do estado mental.',
  'CONSULPLAN'
),
(
  'Urgência e Emergência',
  'A manobra de Heimlich é indicada para:',
  '[
    {"id": "A", "text": "Reverter parada cardíaca em gestantes."},
    {"id": "B", "text": "Desobstrução de vias aéreas em vítima consciente com obstrução grave."},
    {"id": "C", "text": "Estabilização da coluna cervical."},
    {"id": "D", "text": "Controle de hemorragia abdominal."}
  ]'::jsonb,
  'B',
  'A Manobra de Heimlich (compressões abdominais) é usada para desobstruir a via aérea de corpo estranho em vítimas conscientes (adultos e crianças > 1 ano).',
  'AOCP'
),
(
  'Urgência e Emergência',
  'Qual é a profundidade recomendada das compressões torácicas em um adulto durante a RCP?',
  '[
    {"id": "A", "text": "No mínimo 2 cm."},
    {"id": "B", "text": "Entre 5 e 6 cm."},
    {"id": "C", "text": "Aproximadamente 1/3 do diâmetro do tórax."},
    {"id": "D", "text": "Máximo de 4 cm."}
  ]'::jsonb,
  'B',
  'A AHA recomenda uma profundidade de pelo menos 5 cm (2 polegadas), mas não superior a 6 cm (2,4 polegadas) para adultos.',
  'AHA'
),
(
  'Urgência e Emergência',
  'Em uma PCR com via aérea avançada (intubado), as ventilações devem ser feitas:',
  '[
    {"id": "A", "text": "Sincronizadas com as compressões (30:2)."},
    {"id": "B", "text": "Uma ventilação a cada 6 segundos, sem pausar as compressões."},
    {"id": "C", "text": "Duas ventilações a cada 15 compressões."},
    {"id": "D", "text": "Hiperventilação contínua."}
  ]'::jsonb,
  'B',
  'Com via aérea avançada, as compressões são contínuas e as ventilações são assíncronas, uma a cada 6 segundos (10 ventilações/min).',
  'AHA'
),
(
  'Urgência e Emergência',
  'A Escala de Coma de Glasgow avalia três parâmetros. Quais são eles?',
  '[
    {"id": "A", "text": "Abertura Ocular, Resposta Verbal e Resposta Motora."},
    {"id": "B", "text": "Consciência, Respiração e Circulação."},
    {"id": "C", "text": "Pupilas, Força Muscular e Fala."},
    {"id": "D", "text": "Orientação, Memória e Atenção."}
  ]'::jsonb,
  'A',
  'A ECG avalia Abertura Ocular (4), Resposta Verbal (5) e Resposta Motora (6). A avaliação pupilar foi adicionada recentemente como um fator de subtração na pontuação total.',
  'IBFC'
),
(
  'Urgência e Emergência',
  'Qual a principal complicação do uso excessivo de oxigênio (hiperóxia) em pacientes com IAM e AVC sem hipoxemia?',
  '[
    {"id": "A", "text": "Vasodilatação excessiva."},
    {"id": "B", "text": "Vasoconstrição e aumento da lesão tecidual por radicais livres."},
    {"id": "C", "text": "Melhora da perfusão cerebral."},
    {"id": "D", "text": "Bradicardia reflexa."}
  ]'::jsonb,
  'B',
  'A hiperóxia causa vasoconstrição (piorando a isquemia) e aumenta a produção de radicais livres (lesão de reperfusão). Só se deve dar O2 se SpO2 < 90-94%.',
  'IDECAN'
),
(
  'Urgência e Emergência',
  'No atendimento à criança em PCR, se houver apenas um socorrista, a relação compressão:ventilação recomendada é:',
  '[
    {"id": "A", "text": "15:2."},
    {"id": "B", "text": "30:2."},
    {"id": "C", "text": "3:1."},
    {"id": "D", "text": "10:1."}
  ]'::jsonb,
  'B',
  'Para 1 socorrista em pediatria, mantém-se 30:2. Se houver 2 socorristas, muda para 15:2.',
  'AHA'
),
(
  'Urgência e Emergência',
  'Qual é o antídoto específico para a intoxicação por opióides (ex: morfina, fentanil)?',
  '[
    {"id": "A", "text": "Flumazenil."},
    {"id": "B", "text": "Naloxona."},
    {"id": "C", "text": "Atropina."},
    {"id": "D", "text": "Acetilcisteína."}
  ]'::jsonb,
  'B',
  'A Naloxona é o antagonista opióide específico. Flumazenil é para benzodiazepínicos.',
  'VUNESP'
),
(
  'Urgência e Emergência',
  'O "Sinal de Battle" (equimose retroauricular) é indicativo de:',
  '[
    {"id": "A", "text": "Fratura de base de crânio."},
    {"id": "B", "text": "Fratura de mandíbula."},
    {"id": "C", "text": "Trauma ocular."},
    {"id": "D", "text": "Lesão de coluna cervical."}
  ]'::jsonb,
  'A',
  'Sinal de Battle e o Sinal do Guaxinim (equimose periorbital) são sinais clássicos de fratura de base de crânio.',
  'PHTLS'
),
(
  'Urgência e Emergência',
  'Qual é a definição de uma Crise Hipertensiva tipo EMERGÊNCIA?',
  '[
    {"id": "A", "text": "PA elevada sem sintomas."},
    {"id": "B", "text": "PA elevada com lesão aguda e progressiva de órgão-alvo (risco iminente de morte)."},
    {"id": "C", "text": "PA elevada com cefaleia leve, sem lesão de órgão-alvo."},
    {"id": "D", "text": "PA diastólica > 100 mmHg."}
  ]'::jsonb,
  'B',
  'Emergência Hipertensiva exige redução imediata da PA (com drogas IV) devido à lesão de órgão-alvo em curso (ex: AVC, IAM, EAP). A Urgência não tem lesão aguda.',
  'FCC'
),
(
  'Urgência e Emergência',
  'Na suspeita de Trauma Raquimedular (TRM), qual a técnica correta para abertura das vias aéreas?',
  '[
    {"id": "A", "text": "Hiperextensão da cabeça (Head Tilt)."},
    {"id": "B", "text": "Elevação do queixo (Chin Lift) com extensão."},
    {"id": "C", "text": "Anteriorização da Mandíbula (Jaw Thrust) sem extensão do pescoço."},
    {"id": "D", "text": "Rotação lateral da cabeça."}
  ]'::jsonb,
  'C',
  'O Jaw Thrust (tração da mandíbula) é a manobra segura pois não movimenta a coluna cervical, prevenindo lesão medular.',
  'PHTLS'
),
(
  'Urgência e Emergência',
  'Qual é o ritmo de parada cardíaca caracterizado pela ausência total de atividade elétrica no monitor (linha reta)?',
  '[
    {"id": "A", "text": "Fibrilação Ventricular."},
    {"id": "B", "text": "AESP."},
    {"id": "C", "text": "Assistolia."},
    {"id": "D", "text": "Torsades de Pointes."}
  ]'::jsonb,
  'C',
  'Assistolia é a ausência de atividade elétrica. Requer protocolo da linha reta (cagada: Cabos, Ganho, Derivação) para confirmar.',
  'AHA'
),
(
  'Urgência e Emergência',
  'A administração de Adenosina em bolus rápido é indicada para qual arritmia?',
  '[
    {"id": "A", "text": "Bradicardia Sinusal."},
    {"id": "B", "text": "Taquicardia Supraventricular (TSV) estável."},
    {"id": "C", "text": "Fibrilação Ventricular."},
    {"id": "D", "text": "Bloqueio Atrioventricular Total."}
  ]'::jsonb,
  'B',
  'Adenosina causa bloqueio transitório no nó AV, revertendo taquicardias supraventriculares por reentrada. Deve ser feita em bolus ultra-rápido.',
  'IDECAN'
),
(
  'Urgência e Emergência',
  'Em caso de hemorragia externa grave em extremidades, qual a primeira medida para controle do sangramento (após segurança da cena)?',
  '[
    {"id": "A", "text": "Elevação do membro."},
    {"id": "B", "text": "Compressão direta sobre a ferida."},
    {"id": "C", "text": "Torniquete (como primeira opção no PHTLS 9ª ed para sangramento massivo)."},
    {"id": "D", "text": "Ponto de pressão na artéria proximal."}
  ]'::jsonb,
  'C',
  'O PHTLS (9ª/10ª ed) atualizou a conduta: em hemorragias exsanguinantes de extremidades, o torniquete é a primeira escolha se a compressão direta não for imediatamente viável ou suficiente (protocolo XABCDE).',
  'PHTLS'
),
(
  'Urgência e Emergência',
  'Qual é o sinal mais precoce de choque hipovolêmico?',
  '[
    {"id": "A", "text": "Hipotensão arterial."},
    {"id": "B", "text": "Taquicardia."},
    {"id": "C", "text": "Coma."},
    {"id": "D", "text": "Bradicardia."}
  ]'::jsonb,
  'B',
  'A taquicardia é um mecanismo compensatório precoce. A hipotensão é um sinal tardio de choque (descompensado).',
  'FGV'
),
(
  'Urgência e Emergência',
  'O que é o "T" da mnemônica 5Hs e 5Ts (causas reversíveis de PCR)?',
  '[
    {"id": "A", "text": "Trauma Crânio-Encefálico."},
    {"id": "B", "text": "Trombose (Coronária ou Pulmonar), Tensão (Pneumotórax), Tamponamento, Toxinas."},
    {"id": "C", "text": "Temperatura elevada (Hipertermia)."},
    {"id": "D", "text": "Tireotoxicose."}
  ]'::jsonb,
  'B',
  'Os 5 Ts são: Tensão (Pneumotórax), Tamponamento cardíaco, Toxinas, Trombose pulmonar e Trombose coronária.',
  'AHA'
)
ON CONFLICT (question) DO NOTHING;