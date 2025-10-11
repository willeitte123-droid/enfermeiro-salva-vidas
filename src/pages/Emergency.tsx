import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, Heart, Stethoscope, Siren } from "lucide-react";

const Emergency = () => {
  const emergencies = [
    {
      title: "Parada Cardiorrespiratória (PCR)",
      icon: Heart,
      content: [
        "1. Verificar responsividade: chamar em voz alta e tocar nos ombros",
        "2. Avaliar respiração: observar movimentos torácicos (máx 10 segundos)",
        "3. Acionar código de emergência/SAMU 192",
        "4. Posicionar em superfície rígida e plana",
        "5. Iniciar compressões torácicas: 30 compressões",
        "   • Centro do tórax (linha intermamilar)",
        "   • Profundidade: 5-6 cm (adultos)",
        "   • Frequência: 100-120/minuto",
        "   • Permitir retorno total do tórax",
        "6. Abrir vias aéreas (manobra head tilt-chin lift)",
        "7. Realizar 2 ventilações (1 segundo cada)",
        "8. Manter ciclos 30:2 até chegada do DEA/equipe",
        "9. Aplicar DEA assim que disponível e seguir comandos",
        "10. Minimizar interrupções nas compressões (<10 seg)",
        "11. Trocar compressor a cada 2 minutos",
        "12. Continuar até retorno da circulação espontânea (RCE) ou ordem médica"
      ]
    },
    {
      title: "Obstrução de Vias Aéreas por Corpo Estranho (OVACE)",
      icon: AlertCircle,
      content: [
        "1. Identificar sinais de obstrução:",
        "   • Sinal universal de engasgo (mãos no pescoço)",
        "   • Incapacidade de falar/tossir (obstrução total)",
        "   • Tosse fraca, sibilos (obstrução parcial)",
        "2. OBSTRUÇÃO PARCIAL (vítima consegue tossir):",
        "   • Encorajar tosse vigorosa",
        "   • Não interferir enquanto tosse eficaz",
        "   • Permanecer ao lado e monitorar",
        "3. OBSTRUÇÃO TOTAL (vítima consciente - adulto/criança >1 ano):",
        "   • Posicionar-se atrás da vítima",
        "   • Aplicar 5 golpes dorsais entre as escápulas",
        "   • Realizar 5 compressões abdominais (Manobra de Heimlich)",
        "   • Alternar até desobstrução ou inconsciência",
        "4. GESTANTES E OBESOS:",
        "   • Realizar compressões torácicas ao invés de abdominais",
        "5. LACTENTES (<1 ano):",
        "   • Alternar 5 golpes dorsais + 5 compressões torácicas",
        "   • NUNCA realizar Heimlich em lactentes",
        "6. Se vítima perder consciência:",
        "   • Posicionar no chão e iniciar RCP",
        "   • Antes de cada ventilação, verificar e remover objeto visível"
      ]
    },
    {
      title: "Choque Anafilático",
      icon: Siren,
      content: [
        "1. Reconhecer sinais e sintomas:",
        "   • Urticária, prurido, angioedema",
        "   • Broncoespasmo, dispneia, sibilos",
        "   • Hipotensão, taquicardia",
        "   • Sintomas gastrointestinais (náusea, vômito, diarreia)",
        "2. Acionar equipe de emergência imediatamente",
        "3. Remover agente causador quando possível",
        "4. Posicionar paciente:",
        "   • Decúbito dorsal com MMII elevados (Trendelenburg)",
        "   • Se dispneia: posição de Fowler",
        "   • Se vômito: decúbito lateral",
        "5. EPINEFRINA IM (PRIMEIRA LINHA):",
        "   • Adultos: 0,3-0,5 mg (1:1000) IM vasto lateral da coxa",
        "   • Crianças: 0,01 mg/kg (máx 0,3 mg)",
        "   • Repetir após 5-15 min se necessário",
        "6. Garantir via aérea pérvia e administrar O₂ 10-15 L/min",
        "7. Obter acesso venoso calibroso (14-16G)",
        "8. Reposição volêmica vigorosa: SF 0,9% 1000-2000 mL rápido",
        "9. Medicações adjuvantes:",
        "   • Anti-histamínicos: Difenidramina 25-50 mg IV",
        "   • Corticoides: Hidrocortisona 200 mg IV ou Metilprednisolona 125 mg IV",
        "   • Broncodilatadores se broncoespasmo persistente",
        "10. Monitorização contínua: PA, FC, SatO₂, ECG",
        "11. Manter observação por no mínimo 4-6 horas (risco reação bifásica)"
      ]
    },
    {
      title: "Crise Convulsiva / Estado de Mal Epiléptico",
      icon: AlertCircle,
      content: [
        "DURANTE A CRISE:",
        "1. Manter calma e anotar hora do início",
        "2. Proteger a cabeça (travesseiro, mão espalmada)",
        "3. Afastar objetos e móveis ao redor",
        "4. Afrouxar roupas apertadas (gravata, cinto, colarinho)",
        "5. NUNCA colocar nada na boca da vítima",
        "6. NUNCA tentar conter movimentos ou segurar a língua",
        "7. Observar características: tipo, duração, localização",
        "APÓS A CRISE:",
        "8. Posicionar em decúbito lateral (posição de recuperação)",
        "9. Manter vias aéreas pérvias e aspirar se necessário",
        "10. Avaliar nível de consciência (Escala de Glasgow)",
        "11. Verificar sinais vitais",
        "12. Oferecer O₂ se disponível (SatO₂ <94%)",
        "13. Manter ambiente calmo e seguro",
        "ESTADO DE MAL EPILÉPTICO (>5 min ou crises repetidas):",
        "14. Acionar equipe médica imediatamente",
        "15. Obter acesso venoso",
        "16. Glicemia capilar (hipoglicemia pode causar convulsão)",
        "17. Benzodiazepínico IV:",
        "    • Diazepam 5-10 mg IV lento ou",
        "    • Midazolam 5-10 mg IM/IV",
        "18. Encaminhar para avaliação médica após primeira crise",
        "19. Investigar causa: trauma, febre, medicamentos, abstinência"
      ]
    },
    {
      title: "Hemorragia e Choque Hipovolêmico",
      icon: Heart,
      content: [
        "CONTROLE IMEDIATO DA HEMORRAGIA:",
        "1. Avaliar tipo e local do sangramento:",
        "   • Hemorragia externa: visível",
        "   • Hemorragia interna: suspeitar por sinais clínicos",
        "2. Comprimir diretamente o local com gaze/compressa estéril",
        "3. Aplicar pressão firme e contínua (mínimo 5-10 min)",
        "4. Elevar membro afetado acima do nível do coração (se não houver fratura)",
        "5. NÃO remover primeiro curativo se encharcado - adicionar mais sobre ele",
        "6. Considerar compressão de pontos arteriais proximais se ineficaz:",
        "   • Artéria braquial (braço)",
        "   • Artéria femoral (coxa)",
        "7. Uso de torniquete APENAS em hemorragias graves não controláveis",
        "SINAIS DE CHOQUE HIPOVOLÊMICO:",
        "8. Monitorar constantemente:",
        "   • Taquicardia (FC >100 bpm)",
        "   • Hipotensão (PAS <90 mmHg)",
        "   • Pele fria, pálida, sudoreica",
        "   • Enchimento capilar >2 segundos",
        "   • Alteração do nível de consciência",
        "   • Oligúria (<30 mL/h)",
        "INTERVENÇÕES:",
        "9. Acionar equipe médica/cirúrgica imediatamente",
        "10. Posicionar em Trendelenburg modificado (MMII elevados)",
        "11. Obter 2 acessos venosos calibrosos (14-16G)",
        "12. Reposição volêmica agressiva: SF 0,9% ou Ringer Lactato",
        "13. Avaliar necessidade de hemotransfusão",
        "14. Manter aquecimento corporal (prevenir hipotermia)",
        "15. Monitorização contínua: PA, FC, SatO₂, diurese"
      ]
    },
    {
      title: "Hipoglicemia",
      icon: Stethoscope,
      content: [
        "IDENTIFICAÇÃO:",
        "1. Confirmar glicemia capilar:",
        "   • Hipoglicemia: <70 mg/dL",
        "   • Hipoglicemia grave: <54 mg/dL",
        "2. Reconhecer sinais e sintomas:",
        "   • Neuroglicopênicos: confusão, tontura, alteração comportamental, convulsão, coma",
        "   • Adrenérgicos: sudorese, tremor, taquicardia, palidez, fome",
        "PACIENTE CONSCIENTE E CAPAZ DE DEGLUTIR:",
        "3. Regra dos 15:",
        "   • Administrar 15g de carboidrato simples VO:",
        "     - 150 mL de suco de laranja ou",
        "     - 1 colher de sopa de açúcar ou mel ou",
        "     - 3-4 tabletes de glicose (dextrose)",
        "   • Aguardar 15 minutos",
        "   • Reavaliar glicemia capilar",
        "   • Repetir se glicemia ainda <70 mg/dL",
        "4. Após normalização, oferecer lanche com carboidrato complexo + proteína",
        "PACIENTE INCONSCIENTE OU INCAPAZ DE DEGLUTIR:",
        "5. NÃO administrar nada por via oral (risco de broncoaspiração)",
        "6. Obter acesso venoso imediatamente",
        "7. Administrar glicose hipertônica IV:",
        "   • Adultos: Glicose 50% - 25-50 mL (12,5-25g) IV em bolus",
        "   • Crianças: Glicose 10-25% - 2-4 mL/kg IV em bolus",
        "8. Alternativa se sem acesso venoso: Glucagon 1 mg IM ou SC",
        "   • Repetir após 15 min se necessário",
        "   • Menos eficaz em alcoolistas e hepatopatas",
        "9. Reavaliar glicemia a cada 15 minutos até estabilização",
        "10. Manter infusão de SG 5-10% para prevenir nova queda",
        "PÓS-ESTABILIZAÇÃO:",
        "11. Investigar causa: jejum prolongado, dose excessiva insulina/hipoglicemiante, exercício, álcool",
        "12. Ajustar esquema terapêutico se necessário",
        "13. Orientar paciente sobre prevenção e reconhecimento precoce"
      ]
    },
    {
      title: "Hipotensão e Choque",
      icon: Siren,
      content: [
        "DEFINIÇÃO E IDENTIFICAÇÃO:",
        "1. Hipotensão: PAS <90 mmHg ou PAM <65 mmHg ou queda >40 mmHg do basal",
        "2. Choque: hipotensão + sinais de hipoperfusão tecidual",
        "3. Reconhecer sinais de hipoperfusão:",
        "   • Alteração do nível de consciência",
        "   • Pele fria, pálida, pegajosa",
        "   • Enchimento capilar >2 segundos",
        "   • Oligúria (<0,5 mL/kg/h)",
        "   • Lactato elevado (>2 mmol/L)",
        "AVALIAÇÃO INICIAL - IDENTIFICAR TIPO DE CHOQUE:",
        "4. CHOQUE HIPOVOLÊMICO (perda de volume):",
        "   • Causas: hemorragia, desidratação, queimadura",
        "   • Sinais: taquicardia, extremidades frias, turgor ↓",
        "   • Tratamento: reposição volêmica agressiva",
        "5. CHOQUE CARDIOGÊNICO (falha da bomba):",
        "   • Causas: IAM, arritmia, IC descompensada",
        "   • Sinais: estase jugular, B3, edema pulmonar, extremidades frias",
        "   • Tratamento: inotrópicos, reduzir pré-carga com cautela",
        "6. CHOQUE DISTRIBUTIVO (vasodilatação):",
        "   • Séptico: febre/hipotermia, foco infeccioso",
        "   • Anafilático: exposição a alérgeno, urticária, broncoespasmo",
        "   • Neurogênico: trauma raquimedular, extremidades quentes",
        "   • Tratamento: volume + vasopressores",
        "7. CHOQUE OBSTRUTIVO (obstrução do fluxo):",
        "   • Causas: TEP, tamponamento cardíaco, pneumotórax hipertensivo",
        "   • Tratamento: remover obstrução (específico para causa)",
        "MANEJO IMEDIATO:",
        "8. Posicionar em Trendelenburg ou MMII elevados (exceto choque cardiogênico)",
        "9. Garantir via aérea pérvia e O₂ suplementar (alvo SatO₂ >94%)",
        "10. Obter 2 acessos venosos calibrosos (14-16G)",
        "11. REPOSIÇÃO VOLÊMICA (exceto choque cardiogênico):",
        "    • Bolus rápido: 500-1000 mL SF 0,9% ou Ringer Lactato em 15-30 min",
        "    • Reavaliar após cada bolus (ausculta pulmonar, PVC se disponível)",
        "    • Meta: PAM ≥65 mmHg",
        "12. Colher exames: hemograma, lactato, gasometria, função renal, coagulograma, culturas (se sepse)",
        "VASOPRESSORES (se refratário a volume):",
        "13. Noradrenalina (1ª escolha): iniciar 0,05-0,1 mcg/kg/min, titular",
        "14. Dopamina: 5-20 mcg/kg/min (alternativa se bradicardia)",
        "15. Adrenalina: 0,05-0,5 mcg/kg/min (choque refratário)",
        "16. Vasopressina: 0,03-0,04 U/min (adjuvante)",
        "CHOQUE SÉPTICO ESPECÍFICO:",
        "17. Antibiótico de amplo espectro na primeira hora",
        "18. Colher 2 hemoculturas antes do antibiótico",
        "19. Controle do foco infeccioso (drenagem, debridamento)",
        "20. Hidrocortisona 50 mg IV 6/6h se refratário a vasopressor",
        "MONITORIZAÇÃO CONTÍNUA:",
        "21. PA não-invasiva contínua ou PAM invasiva",
        "22. FC, ECG, SatO₂, FR",
        "23. Débito urinário horário (SVD)",
        "24. Nível de consciência",
        "25. Lactato seriado (a cada 2-4h até normalizar)",
        "26. Balanço hídrico rigoroso",
        "METAS DO TRATAMENTO:",
        "27. PAM ≥65 mmHg",
        "28. Diurese ≥0,5 mL/kg/h",
        "29. Lactato <2 mmol/L ou clearance >10%/h",
        "30. SatO₂ >94%, ScvO₂ >70%",
        "31. Normalização do nível de consciência"
      ]
    }
  ];


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Urgências e Emergências</h1>
        <p className="text-muted-foreground">Protocolos de primeiros socorros e atendimento de emergência</p>
      </div>

      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Importante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Este conteúdo serve como referência rápida. Sempre siga os protocolos institucionais e busque 
            capacitação contínua em suporte básico e avançado de vida.
          </p>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="space-y-4">
        {emergencies.map((emergency, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4 bg-card">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <emergency.icon className="h-5 w-5 text-primary" />
                <span className="font-semibold">{emergency.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 mt-2 ml-8">
                {emergency.content.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-2">
                    <span className="text-primary font-semibold min-w-[1.5rem]">{stepIndex + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Emergency;
