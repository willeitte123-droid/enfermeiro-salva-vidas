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