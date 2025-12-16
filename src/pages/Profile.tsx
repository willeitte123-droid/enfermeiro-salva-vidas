import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/lib/supabase";
import { useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Loader2, Camera, MapPin, Briefcase, GraduationCap, 
  Edit2, Save, X, Plus, Trash2, Medal, Zap, Target
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import ImageCropperDialog from "@/components/ImageCropperDialog";
import { useUserLevel } from "@/hooks/useUserLevel";

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  profession?: string;
  specializations?: string[];
  role: string;
  email?: string;
}

const profileSchema = z.object({
  firstName: z.string().min(1, { message: "Nome obrigatório." }),
  lastName: z.string().min(1, { message: "Sobrenome obrigatório." }),
  bio: z.string().max(500).optional(),
  profession: z.string().optional(),
  location: z.string().optional(),
});

// Funções auxiliares para upload
const uploadAvatar = async (userId: string, file: Blob) => {
  const filePath = `${userId}-${Date.now()}.jpg`;
  const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { contentType: 'image/jpeg' });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
  return data.publicUrl;
};

const ProfilePage = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const { data: levelData } = useUserLevel(profile?.id);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Avatar States
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Specializations States
  const [specs, setSpecs] = useState<string[]>([]);
  const [newSpec, setNewSpec] = useState("");

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      profession: "",
      location: "",
    },
  });

  // Sincroniza dados do perfil com o formulário
  useEffect(() => {
    if (profile && !isEditing) {
      form.reset({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        bio: profile.bio || "",
        profession: profile.profession || "",
      });
      setSpecs(profile.specializations || []);
    }
  }, [profile, form, isEditing]);

  // Handlers de Imagem
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
      event.target.value = ''; 
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsCropperOpen(false);
    if (!profile) return;
    
    const toastId = toast.loading("Atualizando foto...");
    try {
      const publicUrl = await uploadAvatar(profile.id, croppedBlob);
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
      queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });
      toast.success("Foto atualizada!", { id: toastId });
    } catch (error: any) {
      toast.error("Erro ao atualizar foto", { id: toastId, description: error.message });
    }
  };

  // Handlers de Especialização
  const addSpec = () => {
    if (newSpec.trim() && !specs.includes(newSpec.trim())) {
      setSpecs([...specs, newSpec.trim()]);
      setNewSpec("");
    }
  };

  const removeSpec = (specToRemove: string) => {
    setSpecs(specs.filter(s => s !== specToRemove));
  };

  // Função dedicada para salvar SOMENTE especializações (chamada pelo botão do card de especializações)
  const handleSaveSpecializations = async () => {
    if (!profile) return;
    setIsLoading(true);

    // Captura o valor que está no input se o usuário esqueceu de clicar no "+"
    let finalSpecs = [...specs];
    if (newSpec.trim() && !finalSpecs.includes(newSpec.trim())) {
      finalSpecs.push(newSpec.trim());
      setSpecs(finalSpecs); // Atualiza visualmente imediatamente
      setNewSpec("");
    }

    try {
      const { error } = await supabase.from('profiles').update({
        specializations: finalSpecs
      }).eq('id', profile.id);

      if (error) throw error;

      toast.success("Especializações salvas com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });
      setIsEditing(false);
    } catch (error: any) {
      toast.error("Erro ao salvar especializações", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Geral do Formulário (chamado pelo botão do header)
  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!profile) return;
    setIsLoading(true);

    // Também verifica se há spec pendente no submit geral
    let finalSpecs = [...specs];
    if (newSpec.trim() && !finalSpecs.includes(newSpec.trim())) {
      finalSpecs.push(newSpec.trim());
    }

    try {
      const { error } = await supabase.from('profiles').update({
        first_name: values.firstName,
        last_name: values.lastName,
        bio: values.bio,
        profession: values.profession,
        specializations: finalSpecs
      }).eq('id', profile.id);

      if (error) throw error;
      
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
      setNewSpec(""); // Limpa input pendente
      queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });
    } catch (error: any) {
      toast.error("Erro ao salvar", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    const f = profile?.first_name?.[0] || '';
    const l = profile?.last_name?.[0] || '';
    return `${f}${l}`.toUpperCase();
  };

  return (
    <div className="min-h-screen pb-10 animate-in fade-in duration-500">
      <ImageCropperDialog 
        imageSrc={imageToCrop} 
        open={isCropperOpen} 
        onOpenChange={setIsCropperOpen} 
        onCropComplete={handleCropComplete} 
      />

      {/* Header / Capa */}
      <div className="relative h-48 md:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 shadow-lg">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute top-4 right-4">
          {!isEditing ? (
            <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)} className="shadow-lg backdrop-blur-md bg-white/20 hover:bg-white/30 text-white border-none">
              <Edit2 className="w-4 h-4 mr-2" /> Editar Perfil
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={() => setIsEditing(false)} disabled={isLoading}>
                <X className="w-4 h-4 mr-2" /> Cancelar
              </Button>
              <Button variant="default" size="sm" onClick={form.handleSubmit(onSubmit)} disabled={isLoading} className="bg-green-600 hover:bg-green-700">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Salvar Tudo
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Coluna Esquerda: Cartão de Identidade */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <Card className="border-none shadow-xl bg-card/95 backdrop-blur-sm overflow-visible">
              <CardContent className="pt-0 flex flex-col items-center">
                <div className="relative -mt-16 mb-4 group">
                  <Avatar className="w-32 h-32 border-4 border-card shadow-lg cursor-pointer">
                    <AvatarImage src={profile?.avatar_url || undefined} className="object-cover" />
                    <AvatarFallback className="text-4xl bg-primary/20 text-primary">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div 
                    className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg cursor-pointer hover:bg-primary/90 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-5 h-5" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileSelect} 
                  />
                </div>

                {isEditing ? (
                  <div className="w-full space-y-3 px-2 pb-4">
                    <div className="grid grid-cols-2 gap-2">
                      <Input {...form.register("firstName")} placeholder="Nome" className="text-center" />
                      <Input {...form.register("lastName")} placeholder="Sobrenome" className="text-center" />
                    </div>
                    <Select 
                      onValueChange={(val) => form.setValue("profession", val)} 
                      defaultValue={profile?.profession || ""}
                    >
                      <SelectTrigger><SelectValue placeholder="Selecione sua profissão" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Estudante de Enfermagem">Estudante de Enfermagem</SelectItem>
                        <SelectItem value="Técnico de Enfermagem">Técnico de Enfermagem</SelectItem>
                        <SelectItem value="Enfermeiro(a)">Enfermeiro(a)</SelectItem>
                        <SelectItem value="Auxiliar de Enfermagem">Auxiliar de Enfermagem</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="text-center pb-6">
                    <h2 className="text-2xl font-bold text-foreground">{profile?.first_name} {profile?.last_name}</h2>
                    <p className="text-muted-foreground font-medium flex items-center justify-center gap-1 mt-1">
                      <Briefcase className="w-4 h-4" /> {profile?.profession || "Profissional de Saúde"}
                    </p>
                    <Badge variant="outline" className="mt-3 border-primary/30 bg-primary/5 text-primary">
                      {levelData?.levelName || "Nível 1"} • {levelData?.currentXP || 0} XP
                    </Badge>
                  </div>
                )}

                {/* Resumo de Estatísticas (Mini) */}
                <div className="grid grid-cols-3 w-full border-t border-border pt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold">{levelData?.currentXP || 0}</p>
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Acertos</p>
                  </div>
                  <div className="text-center border-l border-r border-border">
                    <p className="text-lg font-bold">#{levelData?.currentLevel || 1}</p>
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Nível</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-500">Ativo</p>
                    <p className="text-[10px] uppercase text-muted-foreground font-bold">Status</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card de Especializações */}
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> Especializações / Interesses
                </CardTitle>
                {!isEditing && (
                  <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-muted" onClick={() => setIsEditing(true)} title="Editar Especializações">
                    <Edit2 className="w-3 h-3 text-muted-foreground" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing && (
                  <div className="flex gap-2 mb-3">
                    <Input 
                      placeholder="Adicione (ex: UTI, Pediatria)" 
                      value={newSpec} 
                      onChange={(e) => setNewSpec(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                      className="h-8 text-sm"
                    />
                    <Button size="sm" variant="secondary" onClick={addSpec} type="button"><Plus className="w-4 h-4" /></Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {specs.length > 0 ? specs.map((spec, i) => (
                    <Badge key={i} variant="secondary" className="px-2 py-1 flex items-center gap-1">
                      {spec}
                      {isEditing && (
                        <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => removeSpec(spec)} />
                      )}
                    </Badge>
                  )) : (
                    <p className="text-sm text-muted-foreground italic">Nenhuma especialização adicionada.</p>
                  )}
                </div>
                
                {isEditing && (
                  <div className="mt-4 flex justify-end border-t pt-3">
                    <Button size="sm" onClick={handleSaveSpecializations} disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto">
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Salvar Alterações
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita: Conteúdo Principal */}
          <div className="flex-1 space-y-6">
            
            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre Mim</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea 
                    {...form.register("bio")} 
                    placeholder="Escreva um pouco sobre sua trajetória profissional, objetivos e paixões na enfermagem..."
                    className="min-h-[150px] resize-none"
                  />
                ) : (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {profile?.bio || "Olá! Ainda não escrevi minha biografia."}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Abas de Informações */}
            <Tabs defaultValue="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                <TabsTrigger value="account">Conta</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stats" className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                        <Target className="w-5 h-5" /> Meta Semanal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-800 dark:text-green-300">
                        {levelData?.weeklyProgress || 0}<span className="text-sm text-muted-foreground font-normal">/{levelData?.weeklyTarget || 30}</span>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">Questões acertadas esta semana</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-amber-700 dark:text-amber-400">
                        <Medal className="w-5 h-5" /> Conquistas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-amber-800 dark:text-amber-300">
                        {/* Placeholder count, you can fetch actual badge count later */}
                        --
                      </div>
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Medalhas desbloqueadas</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="account" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes da Conta</CardTitle>
                    <CardDescription>Informações de acesso e plano.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium text-sm text-muted-foreground">Email</span>
                      <span className="text-sm font-semibold">{profile?.email || "Não disponível"}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium text-sm text-muted-foreground">Plano Atual</span>
                      <Badge variant="outline" className="capitalize">{profile?.plan || "Free"}</Badge>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-medium text-sm text-muted-foreground">Função</span>
                      <span className="text-sm font-semibold capitalize">{profile?.role === 'admin' ? 'Administrador' : 'Usuário'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-sm text-muted-foreground">ID de Usuário</span>
                      <span className="text-xs font-mono bg-muted p-1 rounded text-muted-foreground">{profile?.id}</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;