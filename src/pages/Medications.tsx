import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Syringe, Search, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

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
      indication: "Analgésico e antipirético. Dor leve a moderada, febre. Dose: <strong>500mg-1g IV/IM</strong> a cada 6-8h.",
      contraindication: "Hipersensibilidade a pirazolonas, porfiria, deficiência de G6PD, discrasias sanguíneas.",
      adverseEffects: "<strong>Hipotensão (infusão IV rápida)</strong>, reações alérgicas, agranulocitose (rara mas grave).",
      category: "Analgésico/Antipirético"
    },
    {
      name: "Tramadol",
      activeIngredient: "Cloridrato de Tramadol",
      indication: "Analgésico opioide para dor moderada a intensa. Dose: <strong>50-100mg IV/IM</strong> a cada 6-8h.",
      contraindication: "Uso de IMAOs, epilepsia não controlada, intoxicação aguda por depressores do SNC.",
      adverseEffects: "Náuseas, vômitos, tontura, sonolência. <strong>Reduz o limiar convulsivo</strong>.",
      category: "Analgésico Opioide"
    },
    {
      name: "Metoclopramida (Plasil)",
      activeIngredient: "Cloridrato de Metoclopramida",
      indication: "Antiemético e procinético. Náuseas e vômitos. Dose: <strong>10mg IV/IM</strong> a cada 8h.",
      contraindication: "Obstrução/perfuração GI, hemorragia digestiva, feocromocitoma.",
      adverseEffects: "<strong>Sintomas extrapiramidais</strong> (distonias, acatisia), sonolência. Risco de discinesia tardia.",
      category: "Antiemético/Procinético"
    },
    {
      name: "Omeprazol",
      activeIngredient: "Omeprazol",
      indication: "Inibidor de bomba de prótons (IBP). Úlcera, DRGE, profilaxia. Dose: <strong>40mg IV/dia</strong> (infundir em 20-30 min).",
      contraindication: "Hipersensibilidade a IBPs.",
      adverseEffects: "Cefaleia, diarreia. Uso prolongado: deficiência de B12, Mg, Ca, risco de fraturas.",
      category: "Inibidor Bomba Prótons"
    },
    {
      name: "Furosemida (Lasix)",
      activeIngredient: "Furosemida",
      indication: "Diurético de alça. Edema agudo de pulmão, ICC, HAS grave. Dose: <strong>20-40mg IV</strong> em bolus lento.",
      contraindication: "Anúria, depleção grave de eletrólitos, desidratação severa.",
      adverseEffects: "<strong>Hipocalemia</strong>, hiponatremia, desidratação, hipotensão, ototoxicidade (doses altas IV rápido).",
      category: "Diurético de Alça"
    },
    {
      name: "Adrenalina (Epinefrina)",
      activeIngredient: "Cloridrato de Epinefrina",
      indication: "<strong>PCR (1mg IV a cada 3-5min)</strong>, choque anafilático (0,3-0,5mg IM), choque séptico.",
      contraindication: "Contraindicações relativas em emergências. Cuidado em cardiopatas.",
      adverseEffects: "Taquicardia, arritmias, hipertensão, isquemia miocárdica, necrose tecidual (extravasamento).",
      category: "Catecolamina/Vasopressor"
    },
    {
      name: "Amiodarona",
      activeIngredient: "Cloridrato de Amiodarona",
      indication: "Antiarrítmico. <strong>TV/FV refratária (PCR: 300mg IV bolus)</strong>, taquiarritmias. Diluir em SG 5%.",
      contraindication: "Bloqueio AV, bradicardia sinusal grave, disfunção tireoidiana, hipersensibilidade a iodo.",
      adverseEffects: "Agudos: hipotensão, bradicardia. Crônicos: disfunção tireoidiana, fibrose pulmonar, fotossensibilidade.",
      category: "Antiarrítmico"
    },
    {
      name: "Morfina",
      activeIngredient: "Sulfato de Morfina",
      indication: "Analgésico opioide potente para dor intensa (IAM, pós-op). Dose: <strong>2-10mg IV lento</strong> a cada 4h.",
      contraindication: "Depressão respiratória, asma aguda, trauma craniano com ↑PIC.",
      adverseEffects: "<strong>Depressão respiratória (antídoto: Naloxona)</strong>, náusea, constipação, sonolência, hipotensão.",
      category: "Analgésico Opioide"
    },
    {
      name: "Midazolam",
      activeIngredient: "Midazolam",
      indication: "Benzodiazepínico para sedação, convulsões. Dose: <strong>1-5mg IV lento</strong> (titular).",
      contraindication: "Hipersensibilidade, glaucoma de ângulo fechado, depressão respiratória grave.",
      adverseEffects: "<strong>Depressão respiratória (antídoto: Flumazenil)</strong>, hipotensão, amnésia anterógrada.",
      category: "Benzodiazepínico/Sedativo"
    },
    {
      name: "Ceftriaxona",
      activeIngredient: "Ceftriaxona Sódica",
      indication: "Cefalosporina 3ª geração. Infecções graves (meningite, pneumonia, sepse). Dose: <strong>1-2g IV/IM</strong> a cada 12-24h.",
      contraindication: "Hipersensibilidade a cefalosporinas. Neonatos com hiperbilirrubinemia.",
      adverseEffects: "Diarreia, rash. Pseudolitíase biliar. Não administrar com soluções contendo cálcio.",
      category: "Antibiótico Cefalosporina"
    },
    {
      name: "Vancomicina",
      activeIngredient: "Cloridrato de Vancomicina",
      indication: "Glicopeptídeo para gram+ resistentes (MRSA). Dose: <strong>15-20mg/kg IV</strong> a cada 8-12h (infundir em ≥60min).",
      contraindication: "Hipersensibilidade. Cuidado em insuficiência renal.",
      adverseEffects: "<strong>Síndrome do Homem Vermelho (infusão rápida)</strong>, nefrotoxicidade, ototoxicidade. Monitorar nível sérico.",
      category: "Antibiótico Glicopeptídeo"
    },
    {
      name: "Noradrenalina (Norepinefrina)",
      activeIngredient: "Bitartarato de Noradrenalina",
      indication: "Vasopressor de escolha no choque séptico. Dose: <strong>0,05-0,5 mcg/kg/min</strong> IV contínuo (titular para PAM ≥65 mmHg).",
      contraindication: "Hipovolemia não corrigida.",
      adverseEffects: "Isquemia periférica, necrose tecidual (extravasamento), arritmias, bradicardia reflexa.",
      category: "Catecolamina/Vasopressor"
    },
    {
      name: "Dobutamina",
      activeIngredient: "Cloridrato de Dobutamina",
      indication: "Suporte inotrópico para descompensação cardíaca (ICC, choque cardiogênico). Dose: <strong>2-20 mcg/kg/min</strong> em bomba de infusão contínua (BIC).",
      contraindication: "Estenose subaórtica hipertrófica idiopática, feocromocitoma.",
      adverseEffects: "Taquicardia, arritmias, hipertensão, dor torácica. <strong>Monitorização cardíaca e de PA contínua é essencial</strong>.",
      category: "Inotrópico/Simpaticomimético"
    },
    {
      name: "Heparina Sódica",
      activeIngredient: "Heparina Sódica",
      indication: "Anticoagulante para TVP, TEP, IAM. Dose: Bolus de <strong>5.000 UI IV</strong>, seguido de infusão contínua (BIC) ajustada por TTPa.",
      contraindication: "Hemorragia ativa, plaquetopenia grave, cirurgia recente do SNC/olhos.",
      adverseEffects: "<strong>Hemorragia (antídoto: Protamina)</strong>, trombocitopenia induzida por heparina (TIH). Monitorar TTPa e plaquetas.",
      category: "Anticoagulante"
    },
    {
      name: "Dexametasona (Decadron)",
      activeIngredient: "Fosfato de Dexametasona",
      indication: "Corticosteroide potente com ação anti-inflamatória e imunossupressora. Edema cerebral, reações alérgicas graves. Dose: <strong>4-20mg IV/IM</strong>.",
      contraindication: "Infecções fúngicas sistêmicas. Cautela em diabéticos e hipertensos.",
      adverseEffects: "Hiperglicemia, hipertensão, retenção de líquidos, insônia, aumento do risco de infecção.",
      category: "Corticosteroide"
    },
    {
      name: "Ondansetrona (Vonau)",
      activeIngredient: "Cloridrato de Ondansetrona",
      indication: "Antiemético para náuseas e vômitos induzidos por quimio/radioterapia ou pós-operatório. Dose: <strong>4-8mg IV lento</strong>.",
      contraindication: "Uso concomitante com apomorfina.",
      adverseEffects: "Cefaleia, constipação. <strong>Risco de prolongamento do intervalo QT</strong>, especialmente em doses altas.",
      category: "Antiemético (Antagonista 5-HT3)"
    },
    {
      name: "Cetoprofeno (Profenid)",
      activeIngredient: "Cetoprofeno",
      indication: "Anti-inflamatório não esteroide (AINE) para dor e inflamação. Dose: <strong>100mg IV/IM</strong> a cada 12-24h. Infundir IV em 20 min.",
      contraindication: "Hipersensibilidade a AINEs, úlcera péptica ativa, insuficiência renal/hepática/cardíaca grave.",
      adverseEffects: "Dor no local da injeção, dispepsia, náusea. <strong>Risco de lesão renal e sangramento gastrointestinal</strong>.",
      category: "Anti-inflamatório (AINE)"
    },
    {
      name: "Diazepam",
      activeIngredient: "Diazepam",
      indication: "Benzodiazepínico para estado de mal epiléptico, sedação, ansiedade aguda. Dose: <strong>5-10mg IV lento</strong> (não exceder 5mg/min).",
      contraindication: "Miastenia gravis, insuficiência respiratória grave, apneia do sono.",
      adverseEffects: "<strong>Depressão respiratória, hipotensão</strong>, sonolência, tontura. Risco de flebite (administrar em veia calibrosa).",
      category: "Benzodiazepínico/Anticonvulsivante"
    },
    {
      name: "Haloperidol (Haldol)",
      activeIngredient: "Haloperidol",
      indication: "Antipsicótico para agitação psicomotora aguda, delirium. Dose: <strong>2-5mg IM</strong> (preferencial) ou IV lento.",
      contraindication: "Doença de Parkinson, depressão grave do SNC, coma.",
      adverseEffects: "<strong>Sintomas extrapiramidais</strong>, sedação. Risco de <strong>prolongamento do intervalo QT</strong> e Torsades de Pointes (monitorar ECG).",
      category: "Antipsicótico"
    },
    {
      name: "Insulina Regular Humana",
      activeIngredient: "Insulina Humana Regular",
      indication: "Tratamento de hiperglicemia e cetoacidose diabética. Única insulina que pode ser usada <strong>IV</strong>. Dose variável, geralmente em BIC.",
      contraindication: "Hipoglicemia.",
      adverseEffects: "<strong>Hipoglicemia</strong> (principal efeito adverso), hipocalemia (quando em infusão contínua). Monitorização glicêmica rigorosa.",
      category: "Hormônio/Antidiabético"
    },
    {
      name: "Glicose 50%",
      activeIngredient: "Glicose Anidra",
      indication: "Tratamento de hipoglicemia grave em pacientes com acesso venoso. Dose: <strong>25-50 mL (1-2 ampolas) IV lento</strong>.",
      contraindication: "Hiperglicemia, anúria, hemorragia intracraniana.",
      adverseEffects: "Hiperglicemia de rebote, flebite, esclerose venosa (solução hipertônica). <strong>Administrar em veia calibrosa</strong>.",
      category: "Solução Hipertônica/Glicose"
    },
    {
      name: "Hidrocortisona (Solu-Cortef)",
      activeIngredient: "Succinato Sódico de Hidrocortisona",
      indication: "Corticosteroide para insuficiência adrenal, reações alérgicas graves, asma. Dose: <strong>100-500mg IV/IM</strong> a cada 2-6h.",
      contraindication: "Infecções fúngicas sistêmicas, hipersensibilidade.",
      adverseEffects: "Hiperglicemia, hipertensão, retenção de sódio e água, hipocalemia.",
      category: "Corticosteroide"
    },
    {
      name: "Fenitoína (Hidantal)",
      activeIngredient: "Fenitoína Sódica",
      indication: "Anticonvulsivante para estado de mal epiléptico. Dose de ataque: <strong>15-20mg/kg IV</strong>, infusão lenta (≤50mg/min).",
      contraindication: "Bradicardia sinusal, bloqueio AV. <strong>Incompatível com soro glicosado</strong> (usar SF 0,9%).",
      adverseEffects: "Hipotensão, arritmias (infusão rápida), flebite, nistagmo, ataxia. <strong>Requer monitorização cardíaca</strong>.",
      category: "Anticonvulsivante"
    },
    {
      name: "Atropina",
      activeIngredient: "Sulfato de Atropina",
      indication: "Anticolinérgico para bradicardia sinusal sintomática. Dose: <strong>1mg IV em bolus</strong>, repetir a cada 3-5min (máx 3mg).",
      contraindication: "Glaucoma de ângulo fechado, taquicardia, obstrução GI/urinária.",
      adverseEffects: "Taquicardia, boca seca, visão turva, retenção urinária, agitação.",
      category: "Anticolinérgico/Antiarrítmico"
    },
    {
      name: "Enoxaparina (Clexane)",
      activeIngredient: "Enoxaparina Sódica",
      indication: "Heparina de baixo peso molecular (HBPM) para profilaxia e tratamento de TVP/TEP. Dose profilática: <strong>40mg SC 1x/dia</strong>.",
      contraindication: "Hemorragia ativa, plaquetopenia grave, hipersensibilidade à heparina.",
      adverseEffects: "Hemorragia, hematoma no local da injeção, trombocitopenia. <strong>Não expelir a bolha de ar da seringa</strong>.",
      category: "Anticoagulante (HBPM)"
    },
    {
      name: "Meropenem (Meronem)",
      activeIngredient: "Meropenem Tri-hidratado",
      indication: "Antibiótico carbapenêmico de amplo espectro para infecções hospitalares graves. Dose: <strong>1-2g IV</strong> a cada 8h (infundir em 30 min).",
      contraindication: "Hipersensibilidade a carbapenêmicos ou beta-lactâmicos.",
      adverseEffects: "Náusea, vômito, diarreia, rash. Risco de convulsões em pacientes com histórico ou disfunção do SNC.",
      category: "Antibiótico Carbapenêmico"
    },
    {
      name: "Fentanil",
      activeIngredient: "Citrato de Fentanila",
      indication: "Analgésico opioide potente para dor intensa, sedação. Dose: <strong>25-100mcg IV lento</strong>. 100x mais potente que a morfina.",
      contraindication: "Depressão respiratória grave, uso de IMAOs.",
      adverseEffects: "<strong>Depressão respiratória, rigidez torácica (infusão rápida)</strong>, bradicardia, hipotensão. Antídoto: Naloxona.",
      category: "Analgésico Opioide"
    },
    {
      name: "Clonazepam (Rivotril)",
      activeIngredient: "Clonazepam",
      indication: "Benzodiazepínico para estado de mal epiléptico, crises de pânico. Dose: <strong>1mg IV lento</strong>, diluído.",
      contraindication: "Insuficiência respiratória grave, miastenia gravis, glaucoma de ângulo fechado.",
      adverseEffects: "Sonolência, depressão respiratória, hipotensão. <strong>Requer monitorização respiratória</strong>.",
      category: "Benzodiazepínico/Anticonvulsivante"
    },
    {
      name: "Tenoxicam (Tilatil)",
      activeIngredient: "Tenoxicam",
      indication: "AINE para dor e inflamação, especialmente em doenças reumáticas. Dose: <strong>20mg IV/IM</strong> 1x/dia.",
      contraindication: "Hipersensibilidade a AINEs, úlcera péptica ativa, insuficiência renal/hepática/cardíaca grave.",
      adverseEffects: "Dor no local da injeção, dispepsia. <strong>Risco de lesão renal e sangramento gastrointestinal</strong>.",
      category: "Anti-inflamatório (AINE)"
    },
    {
      name: "Benzetacil (Penicilina G Benzatina)",
      activeIngredient: "Penicilina G Benzatina",
      indication: "Antibiótico para infecções por estreptococos (faringite, febre reumática, sífilis). Dose: <strong>1.200.000 UI IM profundo</strong> (glúteo).",
      contraindication: "Hipersensibilidade a penicilinas ou cefalosporinas.",
      adverseEffects: "<strong>Dor intensa no local da aplicação</strong>. Reações alérgicas, incluindo anafilaxia (rara mas grave). <strong>NUNCA administrar IV (risco de embolia e PCR)</strong>.",
      category: "Antibiótico Penicilina"
    },
    {
      name: "Buscopan Simples",
      activeIngredient: "Butilbrometo de Escopolamina",
      indication: "Antiespasmódico para cólicas gastrointestinais, biliares e geniturinárias. Dose: <strong>20mg IV/IM</strong> a cada 6-8h.",
      contraindication: "Glaucoma de ângulo fechado, miastenia gravis, megacólon.",
      adverseEffects: "Boca seca, taquicardia, visão turva, retenção urinária. Administrar IV lentamente.",
      category: "Antiespasmódico"
    },
    {
      name: "Buscopan Composto",
      activeIngredient: "Butilbrometo de Escopolamina + Dipirona Sódica",
      indication: "Dor e cólica intensa (abdominal, renal, biliar). Dose: <strong>1 ampola IV lento (≥5 min)</strong> a cada 6-8h.",
      contraindication: "Mesmas da Dipirona e Buscopan Simples.",
      adverseEffects: "<strong>Hipotensão (infusão IV rápida)</strong>, boca seca, taquicardia. Risco de agranulocitose (raro).",
      category: "Antiespasmódico/Analgésico"
    },
    {
      name: "Hidralazina (Apresolina)",
      activeIngredient: "Cloridrato de Hidralazina",
      indication: "Vasodilatador para crises hipertensivas, especialmente na gestação (pré-eclâmpsia). Dose: <strong>5-10mg IV lento</strong>, pode repetir.",
      contraindication: "Doença arterial coronariana, dissecção de aorta.",
      adverseEffects: "Taquicardia reflexa, cefaleia, hipotensão, flushing. Requer monitorização contínua da PA.",
      category: "Anti-hipertensivo/Vasodilatador"
    },
    {
      name: "Complexo B",
      activeIngredient: "Vitaminas B1, B2, B3, B5, B6",
      indication: "Reposição vitamínica em etilistas, desnutridos, neuropatias. Dose: <strong>1-2 ampolas IM/IV lento</strong>.",
      contraindication: "Hipersensibilidade a qualquer componente.",
      adverseEffects: "Reações alérgicas (principalmente à Tiamina - B1), dor no local da injeção IM.",
      category: "Vitamina"
    },
    {
      name: "Vitamina C (Ácido Ascórbico)",
      activeIngredient: "Ácido Ascórbico",
      indication: "Deficiência de Vitamina C (escorbuto), auxiliar na cicatrização, antioxidante. Dose: <strong>500mg-1g IV/IM</strong> 1x/dia.",
      contraindication: "Litíase renal por oxalato.",
      adverseEffects: "Doses elevadas podem causar diarreia e formação de cálculos renais de oxalato.",
      category: "Vitamina"
    },
    {
      name: "Piperacilina + Tazobactam (Tazocin®)",
      activeIngredient: "Piperacilina Sódica + Tazobactam Sódico",
      indication: "Antibiótico de amplo espectro para infecções hospitalares graves (pneumonia, sepse, infecções intra-abdominais). Dose: <strong>4,5g IV</strong> a cada 6-8h (infundir em 30 min).",
      contraindication: "Hipersensibilidade a penicilinas, cefalosporinas ou inibidores de beta-lactamase.",
      adverseEffects: "Diarreia, rash, flebite. Pode causar neurotoxicidade (convulsões) em altas doses ou em pacientes com insuficiência renal.",
      category: "Antibiótico Penicilina"
    },
    {
      name: "Propofol (Diprivan®)",
      activeIngredient: "Propofol",
      indication: "Anestésico geral de curta duração para indução e manutenção de sedação em UTI ou procedimentos. Dose: <strong>Infusão contínua (BIC)</strong> titulada conforme o nível de sedação desejado.",
      contraindication: "Hipersensibilidade a ovo ou soja (presentes na emulsão lipídica).",
      adverseEffects: "<strong>Hipotensão, depressão respiratória, apneia</strong>. Dor no local da injeção. Risco de Síndrome da Infusão do Propofol (PRIS) em altas doses/longo tempo.",
      category: "Anestésico/Sedativo"
    },
    {
      name: "Cloreto de Potássio (KCl)",
      activeIngredient: "Cloreto de Potássio",
      indication: "Reposição de potássio em casos de hipocalemia. Dose variável, <strong>SEMPRE diluído</strong> e em infusão lenta.",
      contraindication: "Hipercalemia, insuficiência renal grave.",
      adverseEffects: "<strong>NUNCA administrar em bolus IV (risco de parada cardíaca)</strong>. Flebite, dor no local da infusão. A velocidade de infusão não deve exceder 10-20 mEq/h em acesso periférico.",
      category: "Eletrólito/Alta Vigilância"
    },
    {
      name: "Sulfato de Magnésio",
      activeIngredient: "Sulfato de Magnésio",
      indication: "Prevenção e tratamento de convulsões na pré-eclâmpsia/eclâmpsia. Tratamento de Torsades de Pointes, crises asmáticas graves. Dose de ataque na eclâmpsia: <strong>4-6g IV</strong> em 20 min.",
      contraindication: "Bloqueio cardíaco, insuficiência renal grave.",
      adverseEffects: "Rubor, sudorese, hipotensão. Sinais de toxicidade: <strong>perda do reflexo patelar, depressão respiratória</strong>. Antídoto: <strong>Gluconato de Cálcio</strong>.",
      category: "Eletrólito/Anticonvulsivante"
    },
    {
      name: "Gluconato de Cálcio 10%",
      activeIngredient: "Gluconato de Cálcio",
      indication: "Tratamento de hipocalcemia sintomática, toxicidade por sulfato de magnésio, proteção miocárdica na hipercalemia grave. Dose: <strong>10-20 mL IV lento</strong>.",
      contraindication: "Hipercalcemia, uso concomitante com digitálicos (risco de arritmias).",
      adverseEffects: "Bradicardia, hipotensão (infusão rápida). Irritante para as veias, risco de necrose tecidual com extravasamento. <strong>Administrar em veia calibrosa</strong>.",
      category: "Eletrólito"
    },
    {
      name: "Bicarbonato de Sódio 8,4%",
      activeIngredient: "Bicarbonato de Sódio",
      indication: "Tratamento de acidose metabólica grave, hipercalemia, intoxicação por antidepressivos tricíclicos. Dose guiada pela gasometria arterial.",
      contraindication: "Alcalose metabólica ou respiratória, hipocalcemia.",
      adverseEffects: "Alcalose metabólica, hipocalemia, sobrecarga de sódio. Extravasamento pode causar necrose tecidual. <strong>Incompatível com muitas drogas (ex: catecolaminas)</strong>.",
      category: "Solução Alcalinizante"
    },
    {
      name: "Manitol 20%",
      activeIngredient: "Manitol",
      indication: "Diurético osmótico para redução da pressão intracraniana (HIC) e tratamento de oligúria na insuficiência renal aguda. Dose: <strong>0,25-1 g/kg IV</strong>.",
      contraindication: "Anúria estabelecida, congestão pulmonar grave, sangramento intracraniano ativo.",
      adverseEffects: "Distúrbios hidroeletrolíticos, desidratação, edema pulmonar de rebote. <strong>Pode cristalizar em baixas temperaturas (inspecionar frasco)</strong>. Usar equipo com filtro.",
      category: "Diurético Osmótico"
    },
    {
      name: "Nitroprussiato de Sódio (Nipride®)",
      activeIngredient: "Nitroprussiato de Sódio",
      indication: "Vasodilatador potente para emergências hipertensivas e redução da pós-carga na ICC aguda. Dose: <strong>0,3-10 mcg/kg/min</strong> em BIC, titular para o efeito desejado.",
      contraindication: "Hipertensão compensatória (ex: shunt arteriovenoso), insuficiência hepática/renal grave.",
      adverseEffects: "Hipotensão profunda, taquicardia reflexa. <strong>Fotossensível (proteger frasco e equipo da luz)</strong>. Risco de toxicidade por cianeto em infusões prolongadas/altas doses.",
      category: "Anti-hipertensivo/Vasodilatador"
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
        <h1 className="text-3xl font-bold text-foreground mb-2">Guia Rápido de Medicamentos</h1>
        <p className="text-muted-foreground">Principais medicações injetáveis, indicações e cuidados essenciais</p>
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

      <div className="grid md:grid-cols-2 gap-4">
        {filteredMedications.map((medication, index) => (
          <Card key={index} className="flex flex-col">
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
            <CardContent className="space-y-4 flex-1">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-green-700 mb-1">Indicação</h4>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: medication.indication }} />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-red-700 mb-1">Contraindicação</h4>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: medication.contraindication }} />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm text-amber-700 mb-1">Efeitos Adversos / Cuidados</h4>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: medication.adverseEffects }} />
                </div>
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