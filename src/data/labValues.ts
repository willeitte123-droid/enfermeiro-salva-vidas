import { TestTube, Droplet, Wind, Clock } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface LabValue {
  name: string;
  value: string;
  unit: string;
  notes?: string;
}

export interface LabCategory {
  category: string;
  icon: LucideIcon;
  color: string;
  values: LabValue[];
}

export const labValuesData: LabCategory[] = [
  {
    category: "Hemograma",
    icon: Droplet,
    color: "text-red-500",
    values: [
      { name: "Hemácias (H)", value: "4,5 - 5,5", unit: "milhões/mm³", notes: "↓ Anemia / ↑ Policitemia" },
      { name: "Hemoglobina (Hb)", value: "13 - 18 (H) / 12 - 16 (M)", unit: "g/dL", notes: "Principal indicador de anemia" },
      { name: "Hematócrito (Ht)", value: "40 - 50 (H) / 35 - 45 (M)", unit: "%", notes: "Relação entre hemácias e volume sanguíneo" },
      { name: "Leucócitos", value: "4.000 - 11.000", unit: "/mm³", notes: "↑ Leucocitose (infecção) / ↓ Leucopenia" },
      { name: "Plaquetas", value: "150.000 - 450.000", unit: "/mm³", notes: "↓ Plaquetopenia (risco de sangramento)" },
    ],
  },
  {
    category: "Bioquímica Sanguínea",
    icon: TestTube,
    color: "text-blue-500",
    values: [
      { name: "Glicose (jejum)", value: "70 - 99", unit: "mg/dL", notes: "↑ Hiperglicemia / ↓ Hipoglicemia" },
      { name: "Ureia", value: "10 - 50", unit: "mg/dL", notes: "↑ Função renal diminuída, desidratação" },
      { name: "Creatinina", value: "0,7 - 1,3", unit: "mg/dL", notes: "Principal marcador da função renal" },
      { name: "Sódio (Na+)", value: "135 - 145", unit: "mEq/L", notes: "Distúrbios hidroeletrolíticos" },
      { name: "Potássio (K+)", value: "3,5 - 5,0", unit: "mEq/L", notes: "Crítico para a função cardíaca" },
      { name: "Cálcio Iônico", value: "4,5 - 5,5", unit: "mg/dL", notes: "Regula contração muscular e coagulação" },
      { name: "Magnésio (Mg++)", value: "1,8 - 2,4", unit: "mg/dL", notes: "Importante para função neuromuscular" },
      { name: "Proteína C Reativa (PCR)", value: "< 5", unit: "mg/L", notes: "Marcador de inflamação aguda" },
      { name: "Troponina I", value: "< 0,04", unit: "ng/mL", notes: "Marcador de lesão miocárdica (infarto)" },
      { name: "CK-MB", value: "< 5", unit: "ng/mL", notes: "Enzima cardíaca, marcador de infarto" },
      { name: "Bilirrubinas Totais", value: "0,2 - 1,2", unit: "mg/dL", notes: "↑ Icterícia, problemas hepáticos/biliares" },
      { name: "TGO (AST)", value: "5 - 40", unit: "U/L", notes: "Enzima hepática, marcador de lesão" },
      { name: "TGP (ALT)", value: "7 - 56", unit: "U/L", notes: "Enzima hepática, mais específica que TGO" },
    ],
  },
  {
    category: "Gasometria Arterial",
    icon: Wind,
    color: "text-emerald-500",
    values: [
      { name: "pH", value: "7,35 - 7,45", unit: "", notes: "Equilíbrio ácido-básico" },
      { name: "pCO₂", value: "35 - 45", unit: "mmHg", notes: "Componente respiratório" },
      { name: "pO₂", value: "80 - 100", unit: "mmHg", notes: "Oxigenação do sangue" },
      { name: "HCO₃⁻ (Bicarbonato)", value: "22 - 26", unit: "mEq/L", notes: "Componente metabólico" },
      { name: "Saturação de O₂ (SaO₂)", value: "> 95", unit: "%", notes: "Saturação arterial de oxigênio" },
      { name: "Lactato", value: "< 2", unit: "mmol/L", notes: "Marcador de hipoperfusão tecidual (choque)" },
    ],
  },
  {
    category: "Coagulação",
    icon: Clock,
    color: "text-amber-500",
    values: [
      { name: "Tempo de Protrombina (TP)", value: "10 - 14", unit: "segundos", notes: "Avalia via extrínseca" },
      { name: "INR (RNI)", value: "0,8 - 1,2 (normal) / 2,0 - 3,0 (alvo terapêutico)", unit: "", notes: "Monitoramento de anticoagulantes orais (Varfarina)" },
      { name: "TTPa", value: "25 - 35", unit: "segundos", notes: "Avalia via intrínseca, monitoramento de heparina" },
      { name: "Dímero-D", value: "< 500", unit: "ng/mL", notes: "Produto da degradação da fibrina, ↑ em tromboses (TEP, TVP)" },
    ],
  },
];