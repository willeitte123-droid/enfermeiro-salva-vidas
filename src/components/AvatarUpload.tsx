import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Upload } from "lucide-react";
import { useOutletContext } from "react-router-dom";

interface Profile {
  id: string;
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
}

export function AvatarUpload() {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (profile?.avatar_url) {
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!selectedFile || !profile) return;

    setUploading(true);
    const fileExt = selectedFile.name.split('.').pop();
    const filePath = `${profile.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, selectedFile);

    if (uploadError) {
      toast.error("Erro no upload", { description: uploadError.message });
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const newAvatarUrl = data.publicUrl;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: newAvatarUrl })
      .eq('id', profile.id);

    if (updateError) {
      toast.error("Erro ao atualizar perfil", { description: updateError.message });
    } else {
      setAvatarUrl(newAvatarUrl);
      toast.success("Avatar atualizado com sucesso!");
    }
    setUploading(false);
    setSelectedFile(null);
  };
  
  const getInitials = () => {
    const firstName = profile?.first_name?.[0] || '';
    const lastName = profile?.last_name?.[0] || '';
    return `${firstName}${lastName}`.toUpperCase();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarUrl || undefined} alt="Avatar do usuário" />
        <AvatarFallback className="text-4xl bg-primary/20">{getInitials()}</AvatarFallback>
      </Avatar>
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <label htmlFor="avatar-upload">
            <Upload className="mr-2 h-4 w-4" />
            Escolher Foto
            <Input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </Button>
        {selectedFile && (
          <Button onClick={uploadAvatar} disabled={uploading}>
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Salvar
          </Button>
        )}
      </div>
    </div>
  );
}