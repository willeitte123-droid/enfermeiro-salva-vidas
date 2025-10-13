import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Trash2, NotebookPen, Check } from "lucide-react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Profile {
  id: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

const noteColors = [
  "border-sky-500",
  "border-emerald-500",
  "border-amber-500",
  "border-rose-500",
  "border-violet-500",
];

const fetchNotes = async (userId: string) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const BlocoDeNotas = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
    } else if (notes.length > 0 && !selectedNoteId) {
      setSelectedNoteId(notes[0].id);
    } else if (notes.length === 0) {
      setSelectedNoteId(null);
      setTitle("");
      setContent("");
    }
  }, [notes, selectedNoteId, selectedNote]);

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

  const handleDelete = () => {
    if (selectedNoteId) {
      deleteNoteMutation.mutate(selectedNoteId);
    }
  };

  useEffect(() => {
    if (!selectedNoteId || (title === selectedNote?.title && content === selectedNote?.content)) {
      setIsSaved(false);
      return;
    }

    setIsSaving(true);
    setIsSaved(false);
    const handler = setTimeout(() => {
      updateNoteMutation.mutate({ id: selectedNoteId, title, content }, {
        onSuccess: () => {
          setIsSaving(false);
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        },
        onError: () => {
          setIsSaving(false);
          setIsSaved(false);
        }
      });
    }, 1500);

    return () => {
      clearTimeout(handler);
    };
  }, [title, content, selectedNoteId, selectedNote]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Bloco de Anotações</h1>
        <p className="text-muted-foreground">Suas anotações pessoais, salvas e disponíveis a qualquer momento.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 border rounded-lg h-[70vh] min-h-[500px] overflow-hidden bg-card">
        <div className="lg:col-span-1 border-r flex flex-col bg-muted/20">
          <div className="p-3 border-b">
            <Button variant="outline" className="w-full" onClick={handleNewNote} disabled={createNoteMutation.isPending}>
              {createNoteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlusCircle className="h-4 w-4 mr-2" />}
              Nova Anotação
            </Button>
          </div>
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center h-full p-4"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center p-4">Nenhuma anotação. Crie uma para começar.</p>
            ) : (
              <div className="p-2 space-y-1">
                {notes.map((note, index) => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-md transition-all border-l-4",
                      noteColors[index % noteColors.length],
                      selectedNoteId === note.id
                        ? "bg-primary/10"
                        : "bg-transparent hover:bg-muted/50"
                    )}
                  >
                    <p className="font-semibold truncate text-foreground">{note.title || "Sem Título"}</p>
                    <p className="text-xs text-muted-foreground truncate mt-1">{note.content || "Nenhum conteúdo"}</p>
                    <span className="text-xs text-muted-foreground/80 mt-2 block">
                      {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: ptBR })}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="lg:col-span-3 flex flex-col">
          {selectedNoteId && !isLoading ? (
            <>
              <div className="p-4 border-b flex items-center justify-between gap-4 flex-shrink-0">
                <Input
                  placeholder="Digite seu título aqui"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-3xl font-bold border-0 shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent tracking-tight"
                />
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground transition-opacity">
                    {isSaving && <><Loader2 className="h-3 w-3 animate-spin" /> Salvando...</>}
                    {isSaved && <><Check className="h-3 w-3 text-green-500" /> Salvo</>}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" title="Apagar anotação" disabled={deleteNoteMutation.isPending}>
                        {deleteNoteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-5 w-5 text-destructive" />}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>Apagar Anotação?</AlertDialogTitle><AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Apagar</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <Textarea
                  placeholder="Comece a digitar..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="h-full w-full resize-none border-0 shadow-none focus-visible:ring-0 p-8 text-lg leading-relaxed bg-transparent"
                />
              </ScrollArea>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-8">
              <NotebookPen className="h-16 w-16 mb-4 text-primary/30" />
              <p className="font-semibold text-lg">Selecione uma anotação para visualizar</p>
              <p className="text-sm max-w-xs">Ou crie uma nova para começar a escrever.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlocoDeNotas;