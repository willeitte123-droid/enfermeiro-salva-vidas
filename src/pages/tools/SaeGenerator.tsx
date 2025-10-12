import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

const initialFormData = {
  levelOfConsciousness: "consciente",
  orientation: "orientado",
  communication: "verbalizando",
  vitals: { pa: "", fc: "", fr: "", spo2: "", temp: "", dor: "0" },
  skin: { intact: false, hydrated: false, anicteric: false, acyanotic: false, normocolored: false },
  respiratory: { mvp: false, spo2_aa: false, o2_cateter: false, o2_mascara: false },
  cardiac: { brnf: false, normocardic: false },
  abdomen: { flaccid: false, painless: false, rha: false },
  eliminations: { spontaneousDiuresis: false, spontaneousEvacuation: false },
  devices: { avp: false, avpLocation: "", cvc: false, cvcLocation: "", svd: false, sne: false },
  interventions: { hygiene: false, dressing: false, dressingLocation: "", medication: false },
  observations: "",
};

const SaeGenerator = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [generatedNote, setGeneratedNote] = useState("");

  const handleCheckboxChange = (category: string, key: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category as keyof typeof prev], [key]: checked }
    }));
  };

  const handleInputChange = (category: string, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: { ...prev[category as keyof typeof prev], [key]: value }
    }));
  };

  const handleSimpleChange = (key: keyof typeof initialFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const generate = () => {
      let note = "";
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      note += `${time} - Paciente ${formData.levelOfConsciousness}, ${formData.orientation} e ${formData.communication}.`;

      const vitalsEntries = Object.entries(formData.vitals).filter(([, value]) => value);
      if (vitalsEntries.length > 0) {
        note += ` Apresenta SSVV: ${vitalsEntries.map(([key, value]) => `${key.toUpperCase()}: ${value}`).join(', ')}.`;
      }

      const skinEntries = Object.entries(formData.skin).filter(([, value]) => value);
      if (skinEntries.length > 0) {
        const skinDesc = skinEntries.map(([key]) => {
          if (key === 'intact') return 'íntegra';
          if (key === 'hydrated') return 'hidratada';
          if (key === 'anicteric') return 'anictérica';
          if (key === 'acyanotic') return 'acianótica';
          if (key === 'normocolored') return 'normocorada';
          return '';
        }).join(', ');
        note += ` Pele ${skinDesc}.`;
      }
      
      if (formData.respiratory.mvp) note += " Murmúrio vesicular presente em ambos hemitórax, sem ruídos adventícios.";
      if (formData.respiratory.spo2_aa) note += " Mantém boa saturação em ar ambiente.";
      if (formData.respiratory.o2_cateter) note += " Em uso de O2 via cateter nasal.";
      if (formData.respiratory.o2_mascara) note += " Em uso de O2 via máscara.";

      if (formData.cardiac.brnf) note += " Bulhas rítmicas normofonéticas em 2 tempos.";
      if (formData.cardiac.normocardic) note += " Ritmo cardíaco regular.";

      if (formData.abdomen.flaccid && formData.abdomen.painless && formData.abdomen.rha) {
        note += " Abdome flácido, indolor à palpação, com RHA presentes.";
      }

      if (formData.eliminations.spontaneousDiuresis) note += " Diurese espontânea presente.";
      if (formData.eliminations.spontaneousEvacuation) note += " Evacuação espontânea presente.";

      if (formData.devices.avp) note += ` Mantém AVP em ${formData.devices.avpLocation || 'local não especificado'}, pérvio e sem sinais flogísticos.`;
      if (formData.devices.cvc) note += ` Mantém CVC em ${formData.devices.cvcLocation || 'local não especificado'}, com curativo oclusivo e limpo.`;
      if (formData.devices.svd) note += " Mantém SVD com débito claro e presente.";
      if (formData.devices.sne) note += " Mantém SNE para dieta, sem sinais de obstrução.";

      if (formData.interventions.hygiene) note += " Realizado banho de aspersão/leito.";
      if (formData.interventions.dressing) note += ` Realizado curativo em ${formData.interventions.dressingLocation || 'local não especificado'}.`;
      if (formData.interventions.medication) note += " Administrado medicações conforme prescrição.";

      if (formData.observations) note += ` Observações: ${formData.observations}.`;

      note += " Segue aos cuidados da enfermagem.";
      setGeneratedNote(note.trim());
    };
    generate();
  }, [formData]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedNote);
    toast.success("Anotação copiada para a área de transferência!");
  };

  const resetForm = () => {
    setFormData(initialFormData);
    toast.info("Formulário limpo.");
  };

  const renderCheckbox = (category: string, key: string, label: string) => (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`${category}-${key}`}
        checked={formData[category as keyof typeof formData][key as keyof typeof initialFormData.skin]}
        onCheckedChange={(checked) => handleCheckboxChange(category, key, !!checked)}
      />
      <Label htmlFor={`${category}-${key}`}>{label}</Label>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Gerador de Anotações (SAE)</h1>
        <p className="text-muted-foreground">Estruture suas anotações de enfermagem de forma rápida e padronizada.</p>
      </div>
      
      <Alert variant="default" className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-300">
          Esta é uma ferramenta de auxílio. Adapte a anotação à realidade do seu paciente e siga os protocolos institucionais.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Card>
          <CardHeader><CardTitle>Parâmetros de Avaliação</CardTitle></CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full space-y-4">
              <AccordionItem value="geral"><AccordionTrigger>Estado Geral</AccordionTrigger><AccordionContent className="space-y-4 pt-2">
                <div className="grid grid-cols-3 gap-2">
                  {["consciente", "sonolento", "confuso"].map(item => <Button key={item} variant={formData.levelOfConsciousness === item ? "default" : "outline"} onClick={() => handleSimpleChange("levelOfConsciousness", item)}>{item}</Button>)}
                  {["orientado", "desorientado"].map(item => <Button key={item} variant={formData.orientation === item ? "default" : "outline"} onClick={() => handleSimpleChange("orientation", item)}>{item}</Button>)}
                  {["verbalizando", "afásico", "disártrico"].map(item => <Button key={item} variant={formData.communication === item ? "default" : "outline"} onClick={() => handleSimpleChange("communication", item)}>{item}</Button>)}
                </div>
              </AccordionContent></AccordionItem>
              <AccordionItem value="vitals"><AccordionTrigger>Sinais Vitais</AccordionTrigger><AccordionContent className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(formData.vitals).map(key => (
                    <div key={key} className="space-y-1"><Label>{key.toUpperCase()}</Label><Input value={formData.vitals[key as keyof typeof formData.vitals]} onChange={e => handleInputChange("vitals", key, e.target.value)} /></div>
                  ))}
                </div>
              </AccordionContent></AccordionItem>
              <AccordionItem value="exam"><AccordionTrigger>Exame Físico</AccordionTrigger><AccordionContent className="space-y-4 pt-2">
                <div><h4 className="font-semibold mb-2">Pele e Mucosas</h4><div className="grid grid-cols-2 gap-2">{renderCheckbox("skin", "intact", "Íntegra")}{renderCheckbox("skin", "hydrated", "Hidratada")}{renderCheckbox("skin", "anicteric", "Anictérica")}{renderCheckbox("skin", "acyanotic", "Acianótica")}{renderCheckbox("skin", "normocolored", "Normocorada")}</div></div>
                <div><h4 className="font-semibold mb-2">Respiratório</h4><div className="grid grid-cols-2 gap-2">{renderCheckbox("respiratory", "mvp", "MVP s/ RA")}{renderCheckbox("respiratory", "spo2_aa", "Sat. em ar ambiente")}{renderCheckbox("respiratory", "o2_cateter", "O2 por Cateter")}{renderCheckbox("respiratory", "o2_mascara", "O2 por Máscara")}</div></div>
                <div><h4 className="font-semibold mb-2">Cardíaco</h4><div className="grid grid-cols-2 gap-2">{renderCheckbox("cardiac", "brnf", "BRNF 2T")}{renderCheckbox("cardiac", "normocardic", "Normocárdico")}</div></div>
                <div><h4 className="font-semibold mb-2">Abdome</h4><div className="grid grid-cols-2 gap-2">{renderCheckbox("abdomen", "flaccid", "Flácido")}{renderCheckbox("abdomen", "painless", "Indolor")}{renderCheckbox("abdomen", "rha", "RHA+")}</div></div>
                <div><h4 className="font-semibold mb-2">Eliminações</h4><div className="grid grid-cols-2 gap-2">{renderCheckbox("eliminations", "spontaneousDiuresis", "Diurese espontânea")}{renderCheckbox("eliminations", "spontaneousEvacuation", "Evacuação espontânea")}</div></div>
              </AccordionContent></AccordionItem>
              <AccordionItem value="devices"><AccordionTrigger>Dispositivos</AccordionTrigger><AccordionContent className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">{renderCheckbox("devices", "avp", "AVP")}<Input placeholder="Localização (ex: MSD)" disabled={!formData.devices.avp} value={formData.devices.avpLocation} onChange={e => handleInputChange("devices", "avpLocation", e.target.value)} /></div>
                <div className="flex items-center space-x-2">{renderCheckbox("devices", "cvc", "CVC")}<Input placeholder="Localização (ex: JID)" disabled={!formData.devices.cvc} value={formData.devices.cvcLocation} onChange={e => handleInputChange("devices", "cvcLocation", e.target.value)} /></div>
                {renderCheckbox("devices", "svd", "SVD")}{renderCheckbox("devices", "sne", "SNE")}
              </AccordionContent></AccordionItem>
              <AccordionItem value="interventions"><AccordionTrigger>Intervenções</AccordionTrigger><AccordionContent className="space-y-4 pt-2">
                {renderCheckbox("interventions", "hygiene", "Higiene Corporal")}
                <div className="flex items-center space-x-2">{renderCheckbox("interventions", "dressing", "Curativo")}<Input placeholder="Localização" disabled={!formData.interventions.dressing} value={formData.interventions.dressingLocation} onChange={e => handleInputChange("interventions", "dressingLocation", e.target.value)} /></div>
                {renderCheckbox("interventions", "medication", "Administração de Medicação")}
              </AccordionContent></AccordionItem>
              <AccordionItem value="observations"><AccordionTrigger>Observações</AccordionTrigger><AccordionContent className="pt-2">
                <Textarea placeholder="Adicione queixas, intercorrências ou outras observações importantes..." value={formData.observations} onChange={e => handleSimpleChange("observations", e.target.value)} />
              </AccordionContent></AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <div className="sticky top-6">
          <Card>
            <CardHeader>
              <CardTitle>Anotação Gerada</CardTitle>
              <CardDescription>A anotação é atualizada em tempo real. Copie e cole no prontuário.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea readOnly value={generatedNote} className="h-64 text-sm leading-relaxed" />
              <div className="flex gap-2">
                <Button onClick={copyToClipboard} className="w-full"><Copy className="mr-2 h-4 w-4" />Copiar</Button>
                <Button onClick={resetForm} variant="outline" className="w-full"><RefreshCw className="mr-2 h-4 w-4" />Limpar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SaeGenerator;