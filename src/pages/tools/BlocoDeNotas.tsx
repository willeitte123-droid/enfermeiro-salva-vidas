import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  notes?: string;
}

const BlocoDeNotas = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [noteContent, setNoteContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setIsLoading(true);
      // O perfil já é carregado no layout principal, então podemos usá-lo diretamente.
      // Se as anotações não estiverem no perfil inicial, teríamos que buscá-las aqui.
      setNoteContent(profile.notes || "");
      setIsLoading(false);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;

    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ notes: noteContent })
      .eq("id", profile.id);
    
    setIsSaving(false);

    if (error) {
      toast.error("Erro ao salvar anotações", { description: error.message });
    } else {
      toast.success("Anotações salvas com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Bloco de Anotações</h1>
        <p className="text-muted-foreground">Suas anotações pessoais, salvas e disponíveis a qualquer momento.</p>
      </div>
      
      <Alert variant="default" className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          Tudo que você escreve aqui é salvo automaticamente na sua conta. Use este espaço para rascunhos, lembretes de estudo ou o que mais precisar.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Suas Anotações</CardTitle>
          <CardDescription>Este é o seu espaço pessoal. Sinta-se à vontade para organizar suas ideias.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Textarea
              placeholder="Comece a digitar suas anotações aqui..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="h-96 text-base leading-relaxed"
            />
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar Anotações
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlocoDeNotas;