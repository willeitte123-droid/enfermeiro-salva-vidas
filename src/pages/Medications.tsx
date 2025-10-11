import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Syringe, Search } from "lucide-react";

interface Medication {
  name: string;
  activeIngredient: string;
  indication: string;
  contraindication: string;
  adverseEffects: string;
  category: string;
}

const Medications = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const medications: Medication[] = [
    {
      name: "Dipirona Sódica (Metamizol)",
      activeIngredient: "Dipirona Sódica",
      indication: "Analgésico não opioide e antipirético. Indicado para dor leve a moderada (cefaleia, dor pós-operatória, cólica) e febre refratária. Dose adulto: 500mg-1g IV/IM a cada 6-8h (máx 4g/dia).",
      contraindication: "Hipersensibilidade a pirazolonas, porfiria aguda intermitente, deficiência de G6PD, discrasias sanguíneas, último trimestre de gestação.",
      adverseEffects: "Hipotensão (administração IV rápida - infundir em mínimo 5 min), reações alérgicas/anafiláticas, agranulocitose (rara mas grave), náusea. Monitorar PA durante infusão.",
      category: "Analgésico/Antipirético"
    },
    {
      name: "Tramadol",
      activeIngredient: "Cloridrato de Tramadol",
      indication: "Analgésico opioide fraco para dor moderada a intensa (pós-operatória, oncológica, traumática). Dose adulto: 50-100mg IV/IM a cada 6-8h (máx 400mg/dia). Início de ação: 15-30 min.",
      contraindication: "Hipersensibilidade, uso concomitante ou recente de IMAOs (<14 dias), intoxicação aguda por álcool/psicotrópicos/opioide, epilepsia não controlada, insuficiência respiratória grave.",
      adverseEffects: "Náuseas/vômitos (comum), tontura, cefaleia, sonolência, constipação intestinal, sudorese, boca seca. Risco de dependência (opioide). Pode reduzir limiar convulsivo. Cuidado em idosos (risco quedas).",
      category: "Analgésico Opioide"
    },
    {
      name: "Metoclopramida (Plasil)",
      activeIngredient: "Cloridrato de Metoclopramida",
      indication: "Antiemético e procinético. Indicado para náuseas/vômitos, DRGE, gastroparesia. Dose adulto: 10mg IV/IM a cada 8h. Administrar lentamente (mínimo 3 min) para reduzir efeitos extrapiramidais.",
      contraindication: "Obstrução/perfuração gastrointestinal, hemorragia digestiva, feocromocitoma, epilepsia, uso de depressores do SNC, hipersensibilidade.",
      adverseEffects: "Sintomas extrapiramidais (distonias agudas, acatisia - mais comum em jovens/mulheres), sonolência, fadiga, diarreia, boca seca. Risco de discinesia tardia (uso prolongado). Antídoto para reações extrapiramidais: Prometazina 25-50mg IM ou Biperideno 5mg IM/IV.",
      category: "Antiemético/Procinético"
    },
    {
      name: "Omeprazol",
      activeIngredient: "Omeprazol",
      indication: "Inibidor de bomba de prótons (IBP). Tratamento de úlcera péptica, DRGE, esofagite erosiva, síndrome de Zollinger-Ellison, prevenção de úlcera de estresse. Dose adulto IV: 40mg/dia (reconstituir e diluir em SF 0,9% ou SG 5%, infundir em 20-30 min).",
      contraindication: "Hipersensibilidade ao omeprazol ou outros IBPs. Cuidado em hepatopatas graves (ajuste de dose).",
      adverseEffects: "Cefaleia, diarreia/constipação, náusea, dor abdominal, flatulência. Uso prolongado: deficiência de B12, magnésio, cálcio, risco aumentado de fraturas ósseas e infecções (C. difficile, pneumonia).",
      category: "Inibidor Bomba Prótons"
    },
    {
      name: "Furosemida (Lasix)",
      activeIngredient: "Furosemida",
      indication: "Diurético de alça potente. Edema agudo de pulmão, ICC descompensada, edema refratário (renal, hepático, cardíaco), HAS grave, hipercalcemia. Dose adulto: 20-40mg IV em bolus lento (pode repetir/aumentar). Início: 5 min, pico: 30 min.",
      contraindication: "Anúria, depleção grave de eletrólitos (K+, Na+), desidratação severa, insuficiência hepática grave com coma, hipersensibilidade a sulfonamidas.",
      adverseEffects: "Hipocalemia (principal - monitorar K+ e considerar reposição), hiponatremia, hipomagnesemia, desidratação, hipotensão, alcalose metabólica, hiperuricemia, ototoxicidade (altas doses IV rápido). Monitorar eletrólitos, função renal e balanço hídrico.",
      category: "Diurético de Alça"
    },
    {
      name: "Heparina Não-Fracionada (HNF)",
      activeIngredient: "Heparina Sódica",
      indication: "Anticoagulante parenteral. Profilaxia e tratamento de TVP/TEP, SCA, fibrilação atrial, CEC, hemodiálise. Profilaxia: 5.000 UI SC 8/8h ou 12/12h. Terapêutica: bolus IV 80 UI/kg seguido de infusão contínua 18 UI/kg/h (ajustar por TTPa).",
      contraindication: "Hemorragia ativa não controlável, plaquetopenia induzida por heparina (HIT) prévia, hipersensibilidade, neurocirurgia/punção lombar recente, endocardite bacteriana.",
      adverseEffects: "Hemorragia (principal - antídoto: Sulfato de Protamina 1mg neutraliza 100 UI heparina), trombocitopenia (HIT tipo II - suspender imediatamente), osteoporose (uso prolongado), reações alérgicas. Monitorar: TTPa (manter 1,5-2,5x controle), plaquetas, Hb/Ht.",
      category: "Anticoagulante"
    },
    {
      name: "Adrenalina (Epinefrina)",
      activeIngredient: "Cloridrato/Tartarato de Epinefrina",
      indication: "PCR (1ª linha - 1mg IV a cada 3-5min), choque anafilático (0,3-0,5mg IM 1:1000), broncoespasmo grave refratário, choque séptico (infusão contínua). Potente α e β agonista: vasopressor, inotrópico +, cronotrópico +, broncodilatador.",
      contraindication: "Contraindicações relativas (emergências justificam uso): uso concomitante anestésicos halogenados (arritmias), arritmias ventriculares, HAS grave não controlada, IAM recente. Cuidado em cardiopatas, hipertireoidismo.",
      adverseEffects: "Taquicardia, arritmias (TV, FV), hipertensão arterial, tremores, ansiedade, cefaleia, palpitações, isquemia miocárdica, hiperglicemia, hipocalemia, necrose tecidual (extravasamento - antídoto: fentolamina). Monitorar: ECG, PA, glicemia.",
      category: "Catecolamina/Vasopressor"
    },
    {
      name: "Amiodarona",
      activeIngredient: "Cloridrato de Amiodarona",
      indication: "Antiarrítmico classe III. TV/FV refratária (PCR: 300mg IV bolus, pode repetir 150mg), taquiarritmias supraventriculares (FA, flutter), arritmias ventriculares. Infusão: diluir em SG 5% (não usar SF - precipita). Início lento (horas).",
      contraindication: "Bloqueio AV 2º/3º grau (sem marcapasso), bradicardia sinusal grave, síncope por bradicardia, disfunção tireoidiana descompensada, hipersensibilidade iodo, gestação/lactação.",
      adverseEffects: "Agudos: hipotensão (infusão rápida), bradicardia, flebite. Crônicos: disfunção tireoidiana (hipo/hipertireoidismo - contém iodo), fotossensibilidade, depósitos corneanos, fibrose pulmonar (grave), hepatotoxicidade, coloração azul-acinzentada da pele. Monitorar: TSH, função hepática, Rx tórax.",
      category: "Antiarrítmico Classe III"
    },
    {
      name: "Insulina Regular (Rápida/R)",
      activeIngredient: "Insulina Humana Regular",
      indication: "Única insulina para uso IV. Cetoacidose diabética (infusão contínua 0,1 UI/kg/h), estado hiperglicêmico hiperosmolar, hiperglicemia hospitalar, hipercalemia (+ glicose). SC: início 30min, pico 2-4h, duração 6-8h. Aplicar 30min antes das refeições.",
      contraindication: "Hipoglicemia (<70 mg/dL). Nunca administrar se glicemia baixa.",
      adverseEffects: "Hipoglicemia (principal - tratar conforme protocolo), reações no local (dor, eritema, lipodistrofia - rodar locais), hipocalemia (insulina desloca K+ para célula - monitorar), ganho de peso, edema, reações alérgicas (raras). Sempre ter glicose disponível.",
      category: "Hipoglicemiante/Insulina"
    },
    {
      name: "Hidrocortisona",
      activeIngredient: "Succinato Sódico de Hidrocortisona",
      indication: "Corticosteroide de curta ação. Insuficiência adrenal aguda (crise addisoniana - 100mg IV bolus), choque séptico refratário, choque anafilático (adjuvante), reações alérgicas graves. Dose: 100-500mg IV a cada 6h conforme gravidade. Menor ação mineralocorticoide vs cortisona.",
      contraindication: "Contraindicações relativas (emergências justificam): infecções fúngicas sistêmicas não tratadas, hipersensibilidade. Usar com cautela em diabetes, HAS, úlcera péptica, osteoporose.",
      adverseEffects: "Agudos: hiperglicemia (monitorar glicemia), retenção Na+/H₂O (edema, HAS), hipocalemia, imunossupressão (risco infecção), psicose/agitação, úlcera péptica (associar IBP), miopatia. Crônicos: síndrome de Cushing, osteoporose, catarata. Não suspender abruptamente (risco insuficiência adrenal).",
      category: "Corticosteroide"
    },
    {
      name: "Morfina",
      activeIngredient: "Sulfato de Morfina",
      indication: "Analgésico opioide potente para dor intensa (IAM, pós-operatório, oncológica, trauma grave). Também usado em edema agudo de pulmão (reduz pré-carga). Dose adulto: 2-10mg IV lento a cada 4h ou infusão contínua. Titular conforme resposta.",
      contraindication: "Hipersensibilidade, depressão respiratória, asma aguda, íleo paralítico, abdome agudo não diagnosticado, trauma craniano com ↑PIC, uso de IMAOs recente.",
      adverseEffects: "Depressão respiratória (principal - antídoto: Naloxona 0,4-2mg IV), náusea/vômito, constipação intestinal, sonolência, miose, retenção urinária, prurido, hipotensão, bradicardia, dependência física. Monitorar: FR, SatO₂, nível consciência.",
      category: "Analgésico Opioide"
    },
    {
      name: "Fentanil",
      activeIngredient: "Citrato de Fentanil",
      indication: "Analgésico opioide ultrapotente (80-100x morfina). Analgesia/sedação para procedimentos, intubação, ventilação mecânica, dor intensa refratária. Dose: 25-100mcg IV (titulação lenta). Início rápido (1-2min), curta duração (30-60min).",
      contraindication: "Hipersensibilidade, intolerância a opioide, depressão respiratória não monitorada, miastenia gravis.",
      adverseEffects: "Depressão respiratória grave (início rápido - antídoto: Naloxona), rigidez muscular torácica (altas doses/infusão rápida), bradicardia, hipotensão, náusea, prurido. Risco de apneia. Usar apenas em ambiente com recursos de ventilação.",
      category: "Analgésico Opioide"
    },
    {
      name: "Midazolam",
      activeIngredient: "Midazolam",
      indication: "Benzodiazepínico de ação rápida. Sedação para procedimentos, pré-anestésico, convulsões refratárias, agitação psicomotora, intubação de sequência rápida. Dose adulto: 1-5mg IV lento (titular). Estado de mal epiléptico: 0,1-0,2mg/kg IV.",
      contraindication: "Hipersensibilidade a benzodiazepínicos, glaucoma de ângulo fechado, depressão respiratória grave, insuficiência respiratória aguda, miastenia gravis.",
      adverseEffects: "Depressão respiratória (especialmente com opioides - antídoto: Flumazenil 0,2mg IV), hipotensão, amnésia anterógrada, confusão, paradoxo (agitação em idosos), hipersalivação. Monitorar: FR, SatO₂, PA, nível consciência.",
      category: "Benzodiazepínico/Sedativo"
    },
    {
      name: "Diazepam",
      activeIngredient: "Diazepam",
      indication: "Benzodiazepínico de longa ação. Crises convulsivas (5-10mg IV lento, pode repetir), estado de mal epiléptico, ansiedade grave, abstinência alcoólica, relaxante muscular. Não diluir em soro (precipita) - administrar puro IV lento (5mg/min).",
      contraindication: "Hipersensibilidade, glaucoma de ângulo fechado, miastenia gravis, insuficiência respiratória grave, apneia do sono, primeiro trimestre gestação.",
      adverseEffects: "Sedação, sonolência, hipotensão, depressão respiratória, flebite/tromboflebite (irritante venoso - preferir veias calibrosas), amnésia, confusão (idosos), dependência (uso prolongado). Antídoto: Flumazenil.",
      category: "Benzodiazepínico/Anticonvulsivante"
    },
    {
      name: "Ondansetrona (Zofran)",
      activeIngredient: "Cloridrato de Ondansetrona",
      indication: "Antiemético potente (antagonista 5-HT3). Náusea/vômito induzido por quimioterapia, radioterapia, pós-operatório. Dose adulto: 4-8mg IV lento a cada 8h. Infundir em 2-5 min. Não causa efeitos extrapiramidais (vantagem vs metoclopramida).",
      contraindication: "Hipersensibilidade, uso concomitante com apomorfina, síndrome QT longo congênito.",
      adverseEffects: "Cefaleia, constipação intestinal, elevação transitória de transaminases, tontura. Prolongamento QT (raros casos de Torsades de Pointes - cuidado em cardiopatas, hipocalemia). Reações alérgicas (raras).",
      category: "Antiemético"
    },
    {
      name: "Ranitidina",
      activeIngredient: "Cloridrato de Ranitidina",
      indication: "Antagonista H2 (bloqueador histamina). Úlcera péptica, DRGE, profilaxia úlcera de estresse em UTI, síndrome de Zollinger-Ellison. Dose adulto: 50mg IV a cada 8h (infundir em 5 min) ou infusão contínua 6,25mg/h.",
      contraindication: "Hipersensibilidade. Ajustar dose em insuficiência renal (ClCr <50 mL/min).",
      adverseEffects: "Cefaleia, tontura, constipação/diarreia. Raros: confusão mental (idosos, insuficiência renal), bradicardia (infusão rápida), trombocitopenia, hepatotoxicidade. Pode mascarar sintomas de câncer gástrico.",
      category: "Antagonista H2"
    },
    {
      name: "Dexametasona",
      activeIngredient: "Fosfato Dissódico de Dexametasona",
      indication: "Corticosteroide potente de longa ação (25x potência cortisona). Edema cerebral, compressão medular, reações alérgicas graves, antiemético (quimioterapia), COVID grave. Dose: 4-20mg IV conforme indicação. Sem ação mineralocorticoide.",
      contraindication: "Contraindicações relativas: infecções fúngicas sistêmicas não tratadas, úlcera péptica ativa, psicose. Usar com cautela em diabetes, HAS, osteoporose.",
      adverseEffects: "Hiperglicemia (pronunciada - monitorar glicemia), imunossupressão (risco infeccioso), retenção hídrica (menor que outros corticoides), psicose/agitação, miopatia, osteoporose (uso crônico), supressão eixo HHA. Não suspender abruptamente.",
      category: "Corticosteroide"
    },
    {
      name: "Atropina",
      activeIngredient: "Sulfato de Atropina",
      indication: "Anticolinérgico. Bradicardia sintomática (0,5-1mg IV, repetir a cada 3-5min até 3mg), intoxicação por organofosforados/carbamatos (2-5mg IV repetido), pré-anestésico (reduz secreções). PCR: bradicardia/AESP.",
      contraindication: "Glaucoma de ângulo fechado, estenose pilórica, íleo paralítico, megacólon tóxico, miastenia gravis, taquiarritmias, feocromocitoma.",
      adverseEffects: "Taquicardia, boca seca, midríase (visão turva), retenção urinária, constipação, confusão mental/delirium (idosos - 'louco como um chapeleiro'), hipertermia (↓sudorese), rubor facial. Doses <0,5mg podem causar bradicardia paradoxal.",
      category: "Anticolinérgico"
    },
    {
      name: "Ceftriaxona",
      activeIngredient: "Ceftriaxona Sódica",
      indication: "Cefalosporina 3ª geração amplo espectro. Infecções graves: meningite, pneumonia, sepse, gonorreia, pielonefrite, infecções intra-abdominais. Dose adulto: 1-2g IV/IM a cada 12-24h (meningite: 2g 12/12h). Reconstituir com água estéril.",
      contraindication: "Hipersensibilidade a cefalosporinas (reação cruzada com penicilinas 10%). Neonatos com hiperbilirrubinemia (desloca bilirrubina). Não administrar com soluções contendo cálcio (precipitação).",
      adverseEffects: "Diarreia, rash, eosinofilia, trombocitose. Colelitíase/pseudolitíase (precipitados cálcio-ceftriaxona reversíveis), elevação enzimas hepáticas. Colite pseudomembranosa (C. difficile). Reações alérgicas (anafilaxia rara).",
      category: "Antibiótico Cefalosporina"
    },
    {
      name: "Ampicilina + Sulbactam",
      activeIngredient: "Ampicilina Sódica + Sulbactam Sódico",
      indication: "Penicilina + inibidor β-lactamase. Infecções por gram+ e anaeróbios: pneumonia aspirativa, infecções pele/partes moles, intra-abdominais, ginecológicas. Dose adulto: 1,5-3g (ampicilina 1-2g + sulbactam 0,5-1g) IV a cada 6h.",
      contraindication: "Hipersensibilidade a penicilinas. Mononucleose infecciosa (risco rash). Ajustar em insuficiência renal.",
      adverseEffects: "Diarreia, náusea, rash (comum em infectados EBV), flebite (local). Reações de hipersensibilidade (urticária, anafilaxia), neutropenia, trombocitopenia, colite pseudomembranosa, elevação transaminases.",
      category: "Antibiótico Penicilina"
    },
    {
      name: "Vancomicina",
      activeIngredient: "Cloridrato de Vancomicina",
      indication: "Glicopeptídeo para gram+ resistentes (MRSA). Endocardite, meningite, bacteremia, osteomielite, pneumonia nosocomial. Dose: 15-20mg/kg IV a cada 8-12h (infundir em 60min - mínimo). Ajustar por nível sérico e função renal.",
      contraindication: "Hipersensibilidade. Cuidado em insuficiência renal (ajuste rigoroso), perda auditiva prévia.",
      adverseEffects: "Síndrome do Homem Vermelho (liberação histamina por infusão rápida: rubor, prurido, hipotensão - prevenir: infusão lenta ≥60min, pré-medicação anti-histamínico), nefrotoxicidade (monitorar creatinina), ototoxicidade (irreversível), flebite, neutropenia. Monitorar: nível sérico (vale 15-20 mcg/mL).",
      category: "Antibiótico Glicopeptídeo"
    },
    {
      name: "Gentamicina",
      activeIngredient: "Sulfato de Gentamicina",
      indication: "Aminoglicosídeo para gram- e sinergismo com β-lactâmicos. Sepse grave, pielonefrite, endocardite (associado), infecções intra-abdominais. Dose adulto: 3-5mg/kg/dia IV dose única diária ou dividido 8/8h. Infundir em 30-60min.",
      contraindication: "Hipersensibilidade a aminoglicosídeos, miastenia gravis. Cuidado em insuficiência renal (ajuste), gestação.",
      adverseEffects: "Nefrotoxicidade (20% - geralmente reversível, monitorar creatinina diariamente), ototoxicidade (vestibular e coclear - irreversível, perguntar tontura/zumbido), bloqueio neuromuscular (raramente apneia), hipocalemia/hipocalcemia/hipomagnesemia. Monitorar: função renal, nível sérico (pico e vale).",
      category: "Antibiótico Aminoglicosídeo"
    },
    {
      name: "Metronidazol",
      activeIngredient: "Metronidazol",
      indication: "Antimicrobiano para anaeróbios e protozoários. Infecções intra-abdominais, pélvicas, colite pseudomembranosa (C. difficile), abscesso cerebral, endocardite, infecções pele/partes moles. Dose adulto: 500mg IV a cada 8h (infusão 60min).",
      contraindication: "Hipersensibilidade, primeiro trimestre gestação, uso álcool (efeito dissulfiram), porfiria. Reduzir dose em hepatopata grave.",
      adverseEffects: "Náusea, gosto metálico, anorexia, urina escura (benigno). Neuropatia periférica (uso prolongado - parestesias), encefalopatia (cerebelar), leucopenia, reação tipo dissulfiram (com álcool: rubor, vômitos, taquicardia). Evitar álcool durante e 48h após tratamento.",
      category: "Antibiótico/Antiprotozoário"
    },
    {
      name: "Cefazolina",
      activeIngredient: "Cefazolina Sódica",
      indication: "Cefalosporina 1ª geração. Profilaxia cirúrgica (1ª escolha), infecções pele/partes moles, osteomielite, bacteremia por gram+ (S. aureus sensível). Dose adulto: 1-2g IV a cada 8h. Profilaxia cirúrgica: 2g dose única pré-operatória.",
      contraindication: "Hipersensibilidade a cefalosporinas. Reação cruzada com penicilinas (10%). Ajustar em insuficiência renal.",
      adverseEffects: "Flebite (local), rash, diarreia, elevação transaminases. Reações alérgicas (urticária, anafilaxia rara), neutropenia, trombocitopenia, teste de Coombs +, colite pseudomembranosa (raro).",
      category: "Antibiótico Cefalosporina"
    },
    {
      name: "Noradrenalina (Norepinefrina)",
      activeIngredient: "Bitartarato/Hemitartarato de Noradrenalina",
      indication: "Vasopressor de escolha (α agonista > β). Choque séptico, choque cardiogênico, hipotensão refratária a volume. Dose: 0,05-0,5 mcg/kg/min IV contínuo (titular para PAM ≥65 mmHg). Diluir em SG 5% ou SF 0,9%, acesso central preferencialmente.",
      contraindication: "Hipovolemia não corrigida (corrigir volume antes), hipóxia/hipercapnia não corrigida. Contraindicações relativas: arritmias, isquemia mesentérica.",
      adverseEffects: "Isquemia periférica (vasoconstrição intensa), necrose tecidual (extravasamento - antídoto: fentolamina 5-10mg diluído infiltrado local), arritmias, bradicardia reflexa, hipertensão excessiva, ansiedade, cefaleia. Monitorar: PA invasiva contínua, perfusão periférica, débito urinário.",
      category: "Catecolamina/Vasopressor"
    },
    {
      name: "Dobutamina",
      activeIngredient: "Cloridrato de Dobutamina",
      indication: "Inotrópico (β1 agonista). Choque cardiogênico, IC descompensada, baixo débito cardíaco (↑contratilidade/DC, ↓RVP). Dose: 2,5-20 mcg/kg/min IV contínuo (titular). Diluir em SG 5% ou SF 0,9%, acesso central preferencialmente.",
      contraindication: "Estenose aórtica grave, cardiomiopatia hipertrófica obstrutiva, tamponamento cardíaco, hipersensibilidade. Corrigir hipovolemia antes.",
      adverseEffects: "Taquicardia (dose-dependente, limita uso), arritmias (TV, FA), palpitações, tremor, cefaleia, náusea, hipertensão/hipotensão, isquemia miocárdica (↑consumo O₂), necrose tecidual (extravasamento). Pode ↓PA em vasodilatados. Monitorar: ECG contínuo, PA, DC se disponível.",
      category: "Inotrópico/Catecolamina"
    },
    {
      name: "Bicarbonato de Sódio 8,4%",
      activeIngredient: "Bicarbonato de Sódio",
      indication: "Correção acidose metabólica grave (pH <7,1, HCO3 <10), hipercalemia (temporiza), intoxicação por antidepressivos tricíclicos, rabdomiólise (alcalinização urina). PCR prolongada (controverso). Dose: calcular déficit HCO3 ou 1 mEq/kg IV lento.",
      contraindication: "Alcalose metabólica/respiratória, hipocalcemia, edema pulmonar. Cuidado em hipernatremia, ICC, insuficiência renal.",
      adverseEffects: "Hipernatremia, sobrecarga volume (edema, ICC), alcalose metabólica (↓ventilação, hipocalemia), hipocalcemia (tetania), hiperosmolaridade, necrose tecidual (extravasamento - hipertônico), ↓liberação O₂ tecidual (desvio curva Hb). Monitorar: gasometria, eletrólitos, balanço hídrico.",
      category: "Eletrólito/Alcalinizante"
    },
    {
      name: "Glicose 50% (Hipertônica)",
      activeIngredient: "Glicose",
      indication: "Hipoglicemia grave (<40 mg/dL ou sintomática). Dose adulto: 25-50 mL (12,5-25g) IV em bolus lento (preferir 2-5 min). Também usado em hipercalemia (com insulina). Solução hipertônica irritante - preferir veia calibrosa.",
      contraindication: "Hiperglicemia, hemorragia intracraniana aguda (piora edema), AVC isquêmico agudo nas primeiras horas (piora prognóstico). Cuidado em deficiência tiamina (precipitar Wernicke - administrar tiamina antes se suspeita).",
      adverseEffects: "Hiperglicemia rebote, flebite/tromboflebite (solução hipertônica irritante - preferir veias calibrosas), necrose tecidual (extravasamento), diurese osmótica, hipocalemia (glicose estimula secreção insulina). Encefalopatia de Wernicke (alcoólatras - dar tiamina antes).",
      category: "Hipoglicemiante/Nutriente"
    },
    {
      name: "Fitomenadiona (Vitamina K1)",
      activeIngredient: "Fitomenadiona",
      indication: "Reversão anticoagulação oral (varfarina), deficiência vitamina K, doença hemorrágica do recém-nascido. Dose adulto: 1-10mg IV lento (máx 1mg/min) ou IM/SC conforme INR e sangramento. Efeito em 6-24h (fatores de coagulação demoram síntese).",
      contraindication: "Hipersensibilidade. Via IV possui maior risco anafilaxia (preferir IM/SC se não urgente). Não reverte heparina (usar protamina).",
      adverseEffects: "Reações anafilactóides (infusão IV rápida - administrar lento, diluído), resistência transitória a varfarina (dias-semanas), dor/hematoma local (IM). Raro: hemólise em neonatos com deficiência G6PD. Via IV diluir em SF ou SG, infundir em 20-30 min.",
      category: "Vitamina/Antídoto"
    },
    {
      name: "Complexo B",
      activeIngredient: "Vitaminas B1, B2, B6, B12, Nicotinamida",
      indication: "Deficiências vitamínicas (desnutrição, alcoolismo, má absorção), profilaxia encefalopatia de Wernicke (B1-tiamina), neuropatias, anemias megaloblásticas (B12). Dose: 1-2 ampolas IV/IM ao dia. Administrar ANTES de glicose em alcoólatras/desnutridos.",
      contraindication: "Hipersensibilidade. Cuidado na doença de Leber (B12 pode piorar). Evitar via IV rápida (risco reação alérgica).",
      adverseEffects: "Reações alérgicas (especialmente via IV - urticária, anafilaxia rara), dor local (IM), coloração urina (amarela - B2 riboflavina, benigno), náusea. Neuropatia periférica (doses altas B6 - >200mg/dia crônico).",
      category: "Vitaminas/Suplemento"
    },
    {
      name: "Aminofilina",
      activeIngredient: "Aminofilina",
      indication: "Broncodilatador (metilxantina - teofilina + etilenediamina). Broncoespasmo grave refratário (asma, DPOC), apneia da prematuridade. Dose ataque: 5-6mg/kg IV em 20-30min. Manutenção: 0,4-0,9 mg/kg/h IV contínuo. Índice terapêutico estreito (monitorar nível sérico).",
      contraindication: "Hipersensibilidade, arritmias não controladas, estado de mal epiléptico, úlcera péptica ativa, porfiria. Cuidado em cardiopatas, hepatopatas.",
      adverseEffects: "Náusea/vômito (comum - relacionado dose), cefaleia, insônia, tremor, taquicardia/arritmias (toxicidade), convulsões (níveis tóxicos - >20 mcg/mL), hiperglicemia, hipocalemia. Toxicidade grave: arritmias ventriculares, convulsões refratárias. Monitorar: nível sérico (terapêutico 10-20 mcg/mL), ECG, eletrólitos.",
      category: "Broncodilatador"
    },
    {
      name: "Cloreto de Potássio (KCl)",
      activeIngredient: "Cloreto de Potássio",
      indication: "Hipocalemia (<3,5 mEq/L). Reposição K+ em perdas (diuréticos, diarreia, vômitos). NUNCA BOLUS IV (parada cardíaca). Diluir e infundir lentamente: máx 10-20 mEq/h periférico, até 40 mEq/h central. Máx concentração: 40 mEq/L periférico, 80 mEq/L central.",
      contraindication: "Hipercalemia (>5,5 mEq/L), insuficiência renal grave (oligúria/anúria), doença de Addison não tratada, bloqueio AV, uso IECA/BRA/diuréticos poupadores K+.",
      adverseEffects: "Flebite/flebosclerose (irritante venoso), dor local durante infusão, hipercalemia (parada cardíaca), arritmias, parestesias, fraqueza muscular, confusão mental. Necrose tecidual (extravasamento). MONITORAR: K+ sérico, ECG (especialmente se rápido), função renal. Nunca infundir rápido.",
      category: "Eletrólito"
    },
    {
      name: "Cloreto de Cálcio 10%",
      activeIngredient: "Cloreto de Cálcio",
      indication: "Hipocalcemia sintomática (tetania, convulsões, arritmias), hipercalemia grave (estabilização membrana), hipermagnesemia, overdose bloqueadores canal cálcio. Dose: 5-10 mL (500-1000mg) IV lento (máx 1 mL/min). Contém 3x mais cálcio elementar que gluconato.",
      contraindication: "Hipercalcemia, intoxicação digitálica (↑toxicidade), fibrilação ventricular durante RCP (controverso). Cuidado em uso digoxina.",
      adverseEffects: "Bradicardia/arritmias (infusão rápida ou uso digoxina), hipotensão (vasodilatação), sensação calor/rubor, gosto cálcico, náusea. Necrose tecidual grave (extravasamento - mais cáustico que gluconato - preferir veia calibrosa/central). Pode precipitar com bicarbonato (não misturar).",
      category: "Eletrólito"
    },
    {
      name: "Fenobarbital",
      activeIngredient: "Fenobarbital Sódico",
      indication: "Barbitúrico anticonvulsivante. Convulsões refratárias, estado de mal epiléptico (3ª linha após benzodiazepínicos e fenitoína). Dose ataque: 15-20 mg/kg IV lento (máx 100mg/min). Manutenção: 1-4 mg/kg/dia dividido.",
      contraindication: "Hipersensibilidade a barbitúricos, porfiria aguda, insuficiência respiratória grave, dependência barbitúrica. Cuidado em hepatopatas, idosos.",
      adverseEffects: "Sedação profunda, depressão respiratória (dose-dependente), hipotensão (infusão rápida), nistagmo, ataxia, confusão (idosos). Crônicos: dependência física, síndrome abstinência (convulsões), hiperplasia gengival, deficiência ácido fólico, osteomalácia (induz metabolismo vit D). Monitorar: FR, PA, nível consciência, nível sérico.",
      category: "Anticonvulsivante/Barbitúrico"
    },
    {
      name: "Fenitoína",
      activeIngredient: "Fenitoína Sódica",
      indication: "Anticonvulsivante. Estado de mal epiléptico (após benzodiazepínico), profilaxia convulsões (neurocirurgia, TCE). Dose ataque: 15-20 mg/kg IV lento (máx 50mg/min). Diluir APENAS em SF 0,9% (precipita em glicose). Infusão através filtro 0,22 micra.",
      contraindication: "Hipersensibilidade, bloqueio AV 2º/3º grau, bradicardia sinusal, síndrome de Adams-Stokes. Cuidado em hepatopatas (ajuste).",
      adverseEffects: "Síndrome do luva roxa (necrose/flebite - fármaco alcalino pH 12, infundir veia calibrosa, flush com SF), hipotensão/arritmias (infusão rápida - monitorar ECG/PA), nistagmo/ataxia (toxicidade), hiperplasia gengival (crônico), hirsutismo, síndrome Stevens-Johnson (raro). Crônicos: osteomalácia, linfadenopatia, deficiência ácido fólico. Monitorar: nível sérico (10-20 mcg/mL), ECG, PA durante infusão.",
      category: "Anticonvulsivante"
    }
  ];

  const filteredMedications = medications.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Medicamentos Injetáveis</h1>
        <p className="text-muted-foreground">Principais medicações, farmacologia e orientações de uso</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, princípio ativo ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredMedications.map((medication, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Syringe className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>{medication.name}</CardTitle>
                    <CardDescription className="mt-1">{medication.activeIngredient}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary">{medication.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm text-primary mb-1">Indicação</h4>
                <p className="text-sm">{medication.indication}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-destructive mb-1">Contraindicação</h4>
                <p className="text-sm">{medication.contraindication}</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-1">Efeitos Adversos</h4>
                <p className="text-sm">{medication.adverseEffects}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMedications.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum medicamento encontrado para "{searchTerm}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Medications;
