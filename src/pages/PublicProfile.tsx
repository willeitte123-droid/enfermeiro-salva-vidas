import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  bio: string;
}

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching public profile:", error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Usuário não encontrado</h2>
        <p className="text-muted-foreground">O perfil que você está procurando não existe ou não pôde ser carregado.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  const getInitials = () => {
    const firstName = profile?.first_name?.[0] || '';
    const lastName = profile?.last_name?.[0] || '';
    return `${firstName}${lastName}`.toUpperCase();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
       <Button asChild variant="outline" size="sm" className="mb-4">
          <Link to={-1 as any}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
        </Button>
      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="h-32 w-32 mb-4 border-4 border-primary/20">
            <AvatarImage src={profile.avatar_url} alt={`Avatar de ${profile.first_name}`} />
            <AvatarFallback className="text-4xl bg-primary/10">{getInitials()}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl">{`${profile.first_name} ${profile.last_name}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-2">Biografia</h3>
            <p className="text-muted-foreground italic">
              {profile.bio || "Nenhuma biografia adicionada ainda."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicProfile;