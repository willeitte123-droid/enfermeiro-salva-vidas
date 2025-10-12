import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Trash2 } from "lucide-react";

interface AvatarUploadProps {
  avatarUrl: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  getInitials: () => string;
}

export function AvatarUpload({ avatarUrl, onFileChange, onDelete, getInitials }: AvatarUploadProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarUrl || undefined} alt="Avatar do usuário" className="object-cover" />
        <AvatarFallback className="text-4xl bg-primary/20">{getInitials()}</AvatarFallback>
      </Avatar>
      <div className="flex gap-2">
        <Button asChild variant="outline">
          <label htmlFor="avatar-upload">
            <Upload className="mr-2 h-4 w-4" />
            Alterar Foto
            <Input id="avatar-upload" type="file" accept="image/*" onChange={onFileChange} className="hidden" />
          </label>
        </Button>
        {avatarUrl && (
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Remover
          </Button>
        )}
      </div>
    </div>
  );
}