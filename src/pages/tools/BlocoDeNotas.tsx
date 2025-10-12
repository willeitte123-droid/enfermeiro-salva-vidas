import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Loader2, PlusCircle, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Profile {
  id: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const fetchNotes = async (userId: string) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const BlocoDeNotas = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["notes", profile?.id],
    queryFn: () => fetchNotes(profile!.id),
    enabled: !!profile,
  });

  const selectedNote = useMemo(() => {
    return notes.find(note => note.id === selectedNoteId);
  }, [notes, selectedNoteId]);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [selectedNote]);

  const createNoteMutation = useMutation({
    mutationFn: async (newNote: { title: string; content: string }) => {
      if (!profile) throw new Error("Usuário não autenticado.");
      const noteToInsert = { ...newNote, user_id: profile.id };
      const { data, error } = await supabase.from("notes").insert(noteToInsert).select().single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes", profile?.id] });
      setSelectedNoteId(data.id);
      toast.success("Anotação criada com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao criar anotação", { description: error.message });
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async (updatedNote: { id: string; title: string; content: string }) => {
      const { error } = await supabase.from("notes").update({ title: updatedNote.title, content: updatedNote.content }).eq("id", updatedNote.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", profile?.id] });
      toast.success("Anotação salva com sucesso!");
    },
    onError: (error) => {
      toast.error("Erro ao salvar anotação", { description: error.message });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", noteId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", profile?.id] });
      setSelectedNoteId(null);
      toast.success("Anotação apagada com sucesso.");
    },
    onError: (error) => {
      toast.error("Erro ao apagar anotação", { description: error.message });
    },
  });

  const handleNewNote = () => {
    createNoteMutation.mutate({ title: "Nova Anotação", content: "" });
  };

  const handleSave = () => {
    if (selectedNoteId) {
      updateNoteMutation.mutate({ id: selectedNoteId, title, content });
    }
  };

  const handleDelete = () => {
    if (selectedNoteId) {
      deleteNoteMutation.mutate(selectedNoteId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Bloco de Anotações</h1>
        <p className="text-muted-foreground">Suas anotações pessoais, salvas e disponíveis a qualquer momento.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        <Card className="lg:col-span-1 flex flex-col">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">Minhas Anotações</CardTitle>
            <Button size="icon" variant="ghost" onClick={handleNewNote} disabled={createNoteMutation.isPending}>
              {createNoteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-5 w-5" />}
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full"><Loader2 className="h-6 w-6 animate-spin" /></div>
                ) : notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center p-4">Nenhuma anotação encontrada. Crie uma nova!</p>
                ) : (
                  notes.map(note => (
                    <button
                      key={note.id}
                      onClick={() => setSelectedNoteId(note.id)}
                      className={cn(
                        "w-full text-left p-3 rounded-md transition-colors flex items-start gap-3",
                        selectedNoteId === note.id ? "bg-primary/10" : "hover:bg-accent"
                      )}
                    >
                      <FileText className="h-4 w-4 mt-1 flex-shrink-0" />
                      <div className="flex-1 truncate">
                        <p className={cn("font-semibold truncate", selectedNoteId === note.id && "text-primary")}>{note.title || "Sem Título"}</p>
                        <p className="text-xs text-muted-foreground truncate">{note.content || "Nenhum conteúdo"}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 flex flex-col">
          {selectedNoteId ? (
            <>
              <CardHeader>
                <Input
                  placeholder="Título da anotação"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-xl font-bold border-0 shadow-none focus-visible:ring-0 p-0"
                />
              </CardHeader>
              <CardContent className="flex-1">
                <Textarea
                  placeholder="Comece a digitar..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="h-full resize-none border-0 shadow-none focus-visible:ring-0 p-0"
                />
              </CardContent>
              <CardFooter className="justify-end gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={deleteNoteMutation.isPending}>
                      {deleteNoteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader><AlertDialogTitle>Apagar Anotação?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Apagar</AlertDialogAction></AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button onClick={handleSave} disabled={updateNoteMutation.isPending}>
                  {updateNoteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Salvar
                </Button>
              </CardFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <FileText className="h-12 w-12 mb-4" />
              <p className="font-semibold">Selecione uma anotação para visualizar</p>
              <p className="text-sm">Ou crie uma nova clicando no botão <PlusCircle className="inline h-4 w-4 mx-1" />.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default BlocoDeNotas;