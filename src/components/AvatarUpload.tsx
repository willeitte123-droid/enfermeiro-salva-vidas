import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface AvatarUploadProps {
  avatarUrl: string | null;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  getInitials: () => string;
}

export function AvatarUpload({ avatarUrl, onFileChange, getInitials }: AvatarUploadProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarUrl || undefined} alt="Avatar do usuário" />
        <AvatarFallback className="text-4xl bg-primary/20">{getInitials()}</AvatarFallback>
      </Avatar>
      <Button asChild variant="outline">
        <label htmlFor="avatar-upload">
          <Upload className="mr-2 h-4 w-4" />
          Escolher Foto
          <Input id="avatar-upload" type="file" accept="image/*" onChange={onFileChange} className="hidden" />
        </label>
      </Button>
    </div>
  );
}