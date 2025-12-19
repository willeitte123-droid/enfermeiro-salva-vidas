import { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Loader2, Plus, Trash2, Check, Search, 
  ArrowLeft, FileText, MoreVertical, PenLine 
} from "lucide-react";
import { toast } from "sonner";
import { useOutletContext } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { useIsMobile } from "@/hooks/use-mobile";

interface Profile {
  id: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

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
  const { addActivity } = useActivityTracker();
  const isMobile = useIsMobile();

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Modo leitura vs edição (útil para markdown)
  const [noteSearchTerm, setNoteSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    addActivity({ type: 'Ferramenta', title: 'Bloco de Anotações', path: '/tools/bloco-de-notas', icon: 'NotebookText' });
  }, [addActivity]);

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["notes", profile?.id],
    queryFn: () => fetchNotes(profile!.id),
    enabled: !!profile,
  });

  const filteredNotes = useMemo(() => {
    if (!noteSearchTerm) return notes;
    return notes.filter(note =>
      (note.title || "").toLowerCase().includes(noteSearchTerm.toLowerCase()) ||
      (note.content || "").toLowerCase().includes(noteSearchTerm.toLowerCase())
    );
  }, [notes, noteSearchTerm]);

  const selectedNote = useMemo(() => {
    return notes.find(note => note.id === selectedNoteId);
  }, [notes, selectedNoteId]);

  // Sincroniza estado local quando a nota selecionada muda
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || "");
      setContent(selectedNote.content || "");
      // No mobile, ao selecionar, entramos no modo edição por padrão
      // No desktop, mantemos o estado anterior ou default
      if (isMobile) setIsEditing(true); 
    } else {
      setTitle("");
      setContent("");
    }
  }, [selectedNote, isMobile]);

  // Seleciona a primeira nota automaticamente apenas no Desktop
  useEffect(() => {
    if (!isMobile && !selectedNoteId && notes.length > 0 && !isLoading) {
      setSelectedNoteId(notes[0].id);
    }
  }, [notes, isMobile, isLoading, selectedNoteId]);

  const createNoteMutation = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("Usuário não autenticado.");
      const { data, error } = await supabase.from("notes").insert({
        user_id: profile.id,
        title: "",
        content: ""
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes", profile?.id] });
      setSelectedNoteId(data.id);
      setTitle("");
      setContent("");
      setIsEditing(true);
      if (isMobile) {
        // Foca no título se possível, ou apenas garante que a view mude
      }
    },
    onError: (error) => toast.error("Erro ao criar nota", { description: error.message }),
  });

  const updateNoteMutation = useMutation({
    mutationFn: async (updatedNote: { id: string; title: string; content: string }) => {
      const { error } = await supabase.from("notes").update({ 
        title: updatedNote.title, 
        content: updatedNote.content,
        updated_at: new Date().toISOString()
      }).eq("id", updatedNote.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", profile?.id] });
    },
    onError: () => setIsSaving(false),
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", noteId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", profile?.id] });
      setSelectedNoteId(null);
      setIsDeleteDialogOpen(false);
      toast.success("Nota excluída.");
    },
    onError: (error) => toast.error("Erro ao excluir", { description: error.message }),
  });

  // Auto-save logic
  useEffect(() => {
    if (!selectedNoteId) return;
    
    // Evita salvar se não houve mudança real
    if (title === selectedNote?.title && content === selectedNote?.content) {
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
        }
      });
    }, 1000); // Debounce de 1s

    return () => clearTimeout(handler);
  }, [title, content, selectedNoteId]);

  const handleBackToList = () => {
    setSelectedNoteId(null);
  };

  // Renderização da Lista de Notas (Sidebar ou Tela Cheia Mobile)
  const renderNoteList = () => (
    <div className={cn(
      "flex flex-col h-full bg-background border-r transition-all duration-300",
      isMobile ? "w-full" : "w-80 lg:w-96"
    )}>
      {/* Header da Lista */}
      <div className="p-4 border-b flex flex-col gap-4 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text">
            Minhas Notas
          </h1>
          <Button 
            onClick={() => createNoteMutation.mutate()} 
            size="icon" 
            className="rounded-full shadow-md bg-primary hover:bg-primary/90"
            disabled={createNoteMutation.isPending}
          >
            {createNoteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar..." 
            className="pl-9 bg-muted/50 border-transparent focus:bg-background transition-all"
            value={noteSearchTerm}
            onChange={(e) => setNoteSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Lista */}
      <ScrollArea className="flex-1 px-3 py-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">Carregando...</span>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-center px-4">
            <FileText className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm">Nenhuma nota encontrada.</p>
            {noteSearchTerm && <p className="text-xs mt-1">Tente outro termo.</p>}
          </div>
        ) : (
          <div className="space-y-2 pb-20 md:pb-0">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl transition-all duration-200 border group hover:shadow-md",
                  selectedNoteId === note.id
                    ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
                    : "bg-card border-border/40 hover:border-primary/20 hover:bg-accent/50"
                )}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={cn("font-bold truncate pr-2 text-base", !note.title && "text-muted-foreground italic")}>
                    {note.title || "Nova Nota"}
                  </h3>
                  {selectedNoteId === note.id && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed h-8">
                  {note.content || "Sem conteúdo adicional..."}
                </p>
                <span className="text-[10px] text-muted-foreground/60 mt-3 block font-medium uppercase tracking-wide">
                  {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: ptBR })}
                </span>
              </button>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );

  // Renderização do Editor (Tela Cheia no Mobile, Coluna Direita no Desktop)
  const renderEditor = () => {
    if (!selectedNoteId) {
      return (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-muted-foreground bg-muted/10 h-full">
          <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-4">
            <PenLine className="w-10 h-10 opacity-30" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Selecione ou crie uma nota</h2>
          <p className="text-sm max-w-xs text-center">Capture ideias, listas e lembretes instantaneamente.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-background animate-in fade-in slide-in-from-right-4 duration-300 w-full">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-background/80 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={handleBackToList} className="-ml-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
              {isSaving ? <><Loader2 className="w-3 h-3 animate-spin" /> Salvando</> : 
               isSaved ? <><Check className="w-3 h-3 text-green-500" /> Salvo</> : 
               "Pronto"}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className={cn("text-xs font-medium px-3", isEditing ? "bg-accent" : "")}
            >
              {isEditing ? "Visualizar" : "Editar"}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"><MoreVertical className="w-4 h-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Excluir Nota
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Editor Body */}
        <ScrollArea className="flex-1 w-full">
          <div className="max-w-3xl mx-auto px-6 py-8 min-h-[calc(100vh-10rem)]">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da Nota"
              className="text-3xl sm:text-4xl font-black border-none shadow-none focus-visible:ring-0 px-0 bg-transparent placeholder:text-muted-foreground/40 mb-4 h-auto"
            />
            
            {isEditing ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Comece a escrever..."
                className="w-full resize-none border-none shadow-none focus-visible:ring-0 px-0 text-base sm:text-lg leading-relaxed bg-transparent min-h-[60vh] font-sans text-foreground/90"
                autoFocus={!isMobile} // Evita teclado pulando no mobile ao abrir
              />
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-p:leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content || "*Nenhum conteúdo.*"}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Dialog de Exclusão */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir esta nota?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. A nota será permanentemente removida.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => selectedNoteId && deleteNoteMutation.mutate(selectedNoteId)}
                className="bg-destructive hover:bg-destructive/90"
              >
                {deleteNoteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-hidden rounded-lg md:border bg-background md:shadow-sm flex">
      {/* Mobile: Mostra lista SE nenhuma nota selecionada. Desktop: Sempre mostra lista */}
      {(!isMobile || !selectedNoteId) && renderNoteList()}
      
      {/* Mobile: Mostra editor SE nota selecionada. Desktop: Sempre mostra editor (ao lado) */}
      {(!isMobile || selectedNoteId) && renderEditor()}
    </div>
  );
};

export default BlocoDeNotas;