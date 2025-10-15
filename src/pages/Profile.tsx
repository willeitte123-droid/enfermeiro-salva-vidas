import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AvatarUpload } from "@/components/AvatarUpload";
import ImageCropperDialog from "@/components/ImageCropperDialog";
import { useQueryClient } from "@tanstack/react-query";

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
}

const profileSchema = z.object({
  firstName: z.string().min(1, { message: "O nome é obrigatório." }),
  lastName: z.string().min(1, { message: "O sobrenome é obrigatório." }),
  bio: z.string().max(500, { message: "A biografia não pode ter mais de 500 caracteres." }).optional(),
});

const ProfilePage = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.first_name || "",
        lastName: profile.last_name || "",
        bio: profile.bio || "",
      });
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
      event.target.value = ''; // Reset input
    }
  };

  const handleCropComplete = (croppedImage: Blob) => {
    setSelectedFile(croppedImage);
    setAvatarUrl(URL.createObjectURL(croppedImage));
    setIsCropperOpen(false);
  };

  const handleDeleteAvatar = async () => {
    if (!profile) return;
    setIsLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ avatar_url: null })
      .eq('id', profile.id);
    
    setIsLoading(false);
    if (error) {
      toast.error("Erro ao remover a foto", { description: error.message });
    } else {
      setAvatarUrl(null);
      setSelectedFile(null);
      toast.success("Foto de perfil removida.");
      queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });
    }
  };

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!profile) return;
    setIsLoading(true);

    let newAvatarUrl = avatarUrl;

    if (selectedFile) {
      const fileExt = 'jpg';
      const filePath = `${profile.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, selectedFile, { contentType: 'image/jpeg' });

      if (uploadError) {
        toast.error("Erro no upload da foto", { description: uploadError.message });
        setIsLoading(false);
        return;
      }
      
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      newAvatarUrl = data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: values.firstName,
        last_name: values.lastName,
        bio: values.bio,
        avatar_url: newAvatarUrl,
      })
      .eq('id', profile.id);

    setIsLoading(false);

    if (updateError) {
      toast.error("Erro ao atualizar perfil", { description: updateError.message });
    } else {
      toast.success("Perfil atualizado com sucesso!");
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ['profile', profile.id] });
    }
  }
  
  const getInitials = () => {
    const firstName = form.getValues("firstName")?.[0] || '';
    const lastName = form.getValues("lastName")?.[0] || '';
    return `${firstName}${lastName}`.toUpperCase();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <ImageCropperDialog
        imageSrc={imageToCrop}
        open={isCropperOpen}
        onOpenChange={setIsCropperOpen}
        onCropComplete={handleCropComplete}
      />
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Meu Perfil</h1>
        <p className="text-muted-foreground">Atualize suas informações pessoais e sua biografia.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <AvatarUpload 
                avatarUrl={avatarUrl}
                onFileChange={handleFileChange}
                onDelete={handleDeleteAvatar}
                getInitials={getInitials}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Seu nome e biografia serão exibidos em seu perfil público.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu sobrenome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografia</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Fale um pouco sobre você, sua área de atuação ou interesses na enfermagem..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfilePage;