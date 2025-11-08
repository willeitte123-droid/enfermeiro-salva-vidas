import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload, Trash2, Palette, RefreshCw } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useOutletContext } from "react-router-dom";

interface Profile {
  id: string;
  role: 'admin' | 'user';
}

// Helper Functions
const hexToHsl = (hex: string): string => {
  if (!hex) return "";
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

const hslToHex = (hsl: string): string => {
  if (!hsl) return "#000000";
  const [h, s, l] = hsl.replace(/%/g, '').split(' ').map(Number);
  const s_norm = s / 100;
  const l_norm = l / 100;
  const c = (1 - Math.abs(2 * l_norm - 1)) * s_norm;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l_norm - c / 2;
  let r = 0, g = 0, b = 0;
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
  const toHex = (val: number) => Math.round((val + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const defaultSettings = {
  logo_url: "/logo.svg",
  font_family: "Inter, sans-serif",
  "--primary": "210 90% 48%", "--secondary": "260 70% 55%", "--accent": "40 80% 96%", "--background": "40 50% 98%", "--foreground": "215 25% 15%", "--card": "0 0% 100%", "--destructive": "0 72% 51%", "--border": "40 30% 92%",
  "--dark-primary": "210 90% 58%", "--dark-secondary": "260 65% 60%", "--dark-accent": "215 25% 16%", "--dark-background": "215 30% 8%", "--dark-foreground": "210 20% 98%", "--dark-card": "215 25% 12%", "--dark-destructive": "0 72% 51%", "--dark-border": "215 20% 18%",
  "--sidebar-background": "215 25% 12%", "--sidebar-foreground": "210 20% 85%", "--sidebar-active-background": "210 90% 48%", "--sidebar-active-foreground": "0 0% 100%", "--sidebar-hover-background": "215 20% 18%",
  "--dark-sidebar-background": "215 25% 12%", "--dark-sidebar-foreground": "210 20% 85%", "--dark-sidebar-active-background": "210 90% 58%", "--dark-sidebar-active-foreground": "0 0% 100%", "--dark-sidebar-hover-background": "215 20% 18%",
};

const colorFields = [
  { id: "primary", label: "Primária" }, { id: "secondary", label: "Secundária" }, { id: "accent", label: "Acento" }, { id: "background", label: "Fundo" }, { id: "foreground", label: "Texto" }, { id: "card", label: "Card" }, { id: "destructive", label: "Destrutiva" }, { id: "border", label: "Borda" },
];

const sidebarColorFields = [
  { id: "sidebar-background", label: "Fundo da Sidebar" }, { id: "sidebar-foreground", label: "Texto da Sidebar" }, { id: "sidebar-active-background", label: "Fundo do Item Ativo" }, { id: "sidebar-active-foreground", label: "Texto do Item Ativo" }, { id: "sidebar-hover-background", label: "Fundo do Hover" },
];

const fetchThemeSettings = async () => {
  const { data, error } = await supabase.from('app_theme').select('settings').eq('id', 1).single();
  if (error && error.code !== 'PGRST116') throw error;
  return { ...defaultSettings, ...(data?.settings || {}) };
};

const ColorPickerInput = ({ control, name, label }: { control: any, name: string, label: string }) => (
  <Controller
    control={control}
    name={name}
    render={({ field }) => (
      <div className="flex items-center justify-between rounded-md border p-3">
        <Label htmlFor={name}>{label}</Label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{field.value}</span>
          <Input id={name} type="color" {...field} className="w-10 h-10 p-1" />
        </div>
      </div>
    )}
  />
);

const ThemeCustomizer = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const { data: themeSettings, isLoading } = useQuery({ queryKey: ['themeSettingsAdmin'], queryFn: fetchThemeSettings });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { control, handleSubmit, reset, watch } = useForm();
  const logoUrl = watch('logo_url');

  useEffect(() => {
    if (themeSettings) {
      const formValues: { [key: string]: any } = {
        font_family: themeSettings.font_family,
        logo_url: themeSettings.logo_url,
      };
      [...colorFields, ...sidebarColorFields].forEach(({ id }) => {
        formValues[`--${id}`] = hslToHex(themeSettings[`--${id}`]);
        formValues[`--dark-${id}`] = hslToHex(themeSettings[`--dark-${id}`]);
      });
      reset(formValues);
    }
  }, [themeSettings, reset]);

  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      let newLogoUrl = formData.logo_url;
      if (logoFile) {
        const filePath = `public/logo-${Date.now()}`;
        const { error: uploadError } = await supabase.storage.from('theme').upload(filePath, logoFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('theme').getPublicUrl(filePath);
        newLogoUrl = data.publicUrl;
      }

      const settingsToSave: { [key: string]: any } = {
        logo_url: newLogoUrl,
        font_family: formData.font_family,
      };
      [...colorFields, ...sidebarColorFields].forEach(({ id }) => {
        settingsToSave[`--${id}`] = hexToHsl(formData[`--${id}`]);
        settingsToSave[`--dark-${id}`] = hexToHsl(formData[`--dark-${id}`]);
      });

      const { error } = await supabase.from('app_theme').update({ settings: settingsToSave }).eq('id', 1);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Tema salvo com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['themeSettings'] });
      queryClient.invalidateQueries({ queryKey: ['themeSettingsAdmin'] });
      setLogoFile(null);
      setLogoPreview(null);
    },
    onError: (error: any) => toast.error("Erro ao salvar tema", { description: error.message }),
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleReset = async () => {
    const { error } = await supabase.from('app_theme').update({ settings: defaultSettings }).eq('id', 1);
    if (error) {
      toast.error("Erro ao resetar tema", { description: error.message });
    } else {
      toast.success("Tema restaurado para o padrão.");
      queryClient.invalidateQueries({ queryKey: ['themeSettings'] });
      queryClient.invalidateQueries({ queryKey: ['themeSettingsAdmin'] });
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Personalização da Aparência</h1>
          <p className="text-muted-foreground">Modifique as cores, fontes e logo do seu aplicativo.</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleReset}><RefreshCw className="h-4 w-4 mr-2" />Restaurar Padrão</Button>
          <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Palette className="h-4 w-4 mr-2" />}Salvar Tema</Button>
        </div>
      </div>

      <Card><CardHeader><CardTitle>Logo e Fonte</CardTitle></CardHeader><CardContent className="space-y-4">
        {profile?.role === 'admin' && (
          <div><Label>Logo</Label><div className="flex items-center gap-4 mt-2">
            <Avatar className="h-16 w-16 rounded-md"><AvatarImage src={logoPreview || logoUrl} className="object-contain" /><AvatarFallback className="rounded-md">Logo</AvatarFallback></Avatar>
            <div className="flex-1 space-y-2">
              <Button asChild variant="outline"><label htmlFor="logo-upload"><Upload className="mr-2 h-4 w-4" />Alterar Logo<Input id="logo-upload" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" /></label></Button>
              {(logoPreview || (logoUrl && logoUrl !== defaultSettings.logo_url)) && <Button variant="destructive" size="sm" onClick={() => { setLogoFile(null); setLogoPreview(null); reset({ ...watch(), logo_url: defaultSettings.logo_url }); }}><Trash2 className="mr-2 h-4 w-4" />Remover</Button>}
            </div>
          </div></div>
        )}
        <div><Label>Fonte Principal</Label><Controller control={control} name="font_family" render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="Inter, sans-serif">Inter (Padrão)</SelectItem><SelectItem value="Poppins, sans-serif">Poppins</SelectItem><SelectItem value="Roboto Slab, serif">Roboto Slab</SelectItem></SelectContent>
          </Select>
        )} /></div>
      </CardContent></Card>

      <Tabs defaultValue="light">
        <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="light">Tema Claro</TabsTrigger><TabsTrigger value="dark">Tema Escuro</TabsTrigger></TabsList>
        <TabsContent value="light" className="space-y-6">
          <Card><CardHeader><CardTitle>Cores Gerais (Tema Claro)</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorFields.map(field => <ColorPickerInput key={field.id} control={control} name={`--${field.id}`} label={field.label} />)}
          </CardContent></Card>
          <Card><CardHeader><CardTitle>Cores da Sidebar (Tema Claro)</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sidebarColorFields.map(field => <ColorPickerInput key={field.id} control={control} name={`--${field.id}`} label={field.label} />)}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="dark" className="space-y-6">
          <Card><CardHeader><CardTitle>Cores Gerais (Tema Escuro)</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorFields.map(field => <ColorPickerInput key={field.id} control={control} name={`--dark-${field.id}`} label={field.label} />)}
          </CardContent></Card>
          <Card><CardHeader><CardTitle>Cores da Sidebar (Tema Escuro)</CardTitle></CardHeader><CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sidebarColorFields.map(field => <ColorPickerInput key={field.id} control={control} name={`--dark-${field.id}`} label={field.label} />)}
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default ThemeCustomizer;