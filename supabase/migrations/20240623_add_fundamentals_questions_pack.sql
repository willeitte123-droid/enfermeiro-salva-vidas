-- Pacote de questões de alto nível para a categoria "Fundamentos de Enfermagem"

INSERT INTO public.questions (id, category, banca, question, options, "correctAnswer", explanation)
VALUES
    (9001, 'Fundamentos de Enfermagem', 'Vunesp', 'Durante a aferição da Pressão Arterial em um paciente obeso, o uso de um manguito de tamanho padrão (menor que o ideal para a circunferência do braço) tende a resultar em valores:', '[
        {"id": "A", "text": "Falsamente elevados (superestimados)."},
        {"id": "B", "text": "Falsamente diminuídos (subestimados)."},
        {"id": "C", "text": "Inalterados, pois a pressão interna da artéria não muda."},
        {"id": "D", "text": "Variáveis, ora elevados, ora diminuídos."},
        {"id": "E", "text": "Impossíveis de serem aferidos."}
    ]', 'A', 'O uso de um manguito menor que o ideal para a circunferência do braço do paciente resulta em valores falsamente elevados (superestimados). Isso ocorre porque o manguito estreito não comprime a artéria braquial de maneira uniforme, exigindo uma pressão maior na bolsa para ocluir o fluxo sanguíneo.'),
    (9002, 'Fundamentos de Enfermagem', 'FGV', 'De acordo com a Resolução COFEN 358/2009, a etapa do Processo de Enfermagem que é privativa do Enfermeiro e consiste no julgamento clínico sobre as respostas do indivíduo, família ou comunidade a problemas de saúde/processos vitais reais ou potenciais é a(o):', '[
        {"id": "A", "text": "Coleta de Dados de Enfermagem."},
        {"id": "B", "text": "Planejamento de Enfermagem."},
        {"id": "C", "text": "Diagnóstico de Enfermagem."},
        {"id": "D", "text": "Implementação."},
        {"id": "E", "text": "Avaliação de Enfermagem."}
    ]', 'C', 'O Diagnóstico de Enfermagem é a única etapa do Processo de Enfermagem que é privativa do Enfermeiro. Consiste na análise e interpretação dos dados coletados para identificar os problemas e necessidades do paciente, sendo a base para o planejamento das intervenções.'),
    (9003, 'Fundamentos de Enfermagem', 'IBFC', 'Foi prescrito 3.500.000 UI de Penicilina Cristalina EV. Na unidade, há frascos-ampola de 5.000.000 UI. Sabendo que o pó do frasco corresponde a 2ml de volume e que foi utilizado 8ml de Água Destilada para a diluição, quantos ml da solução devem ser aspirados para administrar a dose correta?', '[
        {"id": "A", "text": "5,0 ml"},
        {"id": "B", "text": "6,5 ml"},
        {"id": "C", "text": "7,0 ml"},
        {"id": "D", "text": "8,0 ml"},
        {"id": "E", "text": "3,5 ml"}
    ]', 'C', 'Primeiro, calcula-se o volume final da solução: 8ml (diluente) + 2ml (pó) = 10ml. Agora, temos uma solução com 5.000.000 UI em 10ml. Usando a regra de três: Se 5.000.000 UI estão em 10ml, 3.500.000 UI estarão em X ml. X = (3.500.000 * 10) / 5.000.000 = 35.000.000 / 5.000.000 = 7ml.'),
    (9004, 'Fundamentos de Enfermagem', 'Cebraspe', 'Ao avaliar um paciente acamado, o enfermeiro observa uma área de pele íntegra na região sacral, com coloração púrpura persistente que não embranquece à digitopressão. Segundo as diretrizes da NPUAP (National Pressure Ulcer Advisory Panel), esta lesão é classificada como:', '[
        {"id": "A", "text": "Lesão por Pressão Estágio 1."},
        {"id": "B", "text": "Lesão por Pressão Estágio 2."},
        {"id": "C", "text": "Suspeita de Lesão Tissular Profunda."},
        {"id": "D", "text": "Lesão por Pressão Não Estadiável."},
        {"id": "E", "text": "Dermatite associada à incontinência."}
    ]', 'C', 'A descrição de uma área localizada de pele íntegra com coloração púrpura ou vermelho-escura persistente, que não embranquece, é a definição clássica da Suspeita de Lesão Tissular Profunda. Indica um dano no tecido mole subjacente devido à pressão e/ou cisalhamento.'),
    (9005, 'Fundamentos de Enfermagem', 'FCC', 'Para prevenir a formação de fístula uretroescrotal e lesões por tração, a fixação da sonda vesical de demora em pacientes do sexo masculino, sem restrição de mobilidade, deve ser realizada preferencialmente na:', '[
        {"id": "A", "text": "Face interna da coxa."},
        {"id": "B", "text": "Região hipogástrica (abdome inferior)."},
        {"id": "C", "text": "Região inguinal direita."},
        {"id": "D", "text": "Bolsa escrotal."},
        {"id": "E", "text": "Lateral da coxa."}
    ]', 'B', 'A fixação da sonda na região hipogástrica (abdome inferior) mantém o pênis em uma posição anatômica, apontado para o umbigo. Isso evita a formação de uma curvatura peniana na junção peno-escrotal, que é a principal causa de lesão por pressão e formação de fístula nesse local. A fixação na coxa é a recomendação para pacientes do sexo feminino.'),
    (9006, 'Fundamentos de Enfermagem', 'AOCP', 'Um paciente com diagnóstico de Tuberculose Pulmonar Bacilífera e outro com Meningite Meningocócica são admitidos na mesma unidade de internação. Os tipos de precaução respiratória recomendados, respectivamente, para cada paciente são:', '[
        {"id": "A", "text": "Gotículas e Contato."},
        {"id": "B", "text": "Aerossóis e Gotículas."},
        {"id": "C", "text": "Contato e Aerossóis."},
        {"id": "D", "text": "Gotículas e Aerossóis."},
        {"id": "E", "text": "Padrão e Contato."}
    ]', 'B', 'A Tuberculose é transmitida por aerossóis (partículas < 5 micra que ficam suspensas no ar), exigindo precaução para aerossóis com uso de máscara N95/PFF2 e quarto com pressão negativa. A Meningite Meningocócica é transmitida por gotículas (partículas > 5 micra que caem rapidamente), exigindo precaução para gotículas com uso de máscara cirúrgica para quem se aproxima a menos de 1 metro do paciente.');