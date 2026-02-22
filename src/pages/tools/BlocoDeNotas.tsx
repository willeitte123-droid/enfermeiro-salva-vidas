import { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Loader2, Plus, Trash2, Check, Search, 
  ArrowLeft, FileText, MoreVertical, PenLine, Calendar, Clock, NotebookText
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
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { useIsMobile } from "@/hooks/use-mobile";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
      "flex flex-col h-full bg-muted/10 border-r transition-all duration-300",
      isMobile ? "w-full" : "w-80 lg:w-96"
    )}>
      {/* Header da Lista */}
      <div className="p-4 border-b flex flex-col gap-4 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 text-transparent bg-clip-text flex items-center gap-2">
            <NotebookText className="w-5 h-5 text-primary" /> Notas
          </h1>
          <Button 
            onClick={() => createNoteMutation.mutate()} 
            size="sm" 
            className="rounded-full shadow-sm bg-primary hover:bg-primary/90 text-xs px-3"
            disabled={createNoteMutation.isPending}
          >
            {createNoteMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
            Nova Nota
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar anotações..." 
            className="pl-9 h-9 text-sm bg-background border-border/50 focus:border-primary/30 transition-all rounded-lg"
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
            <FileText className="w-10 h-10 mb-2 opacity-10" />
            <p className="text-sm font-medium">Sua lista está vazia</p>
            {noteSearchTerm && <p className="text-xs mt-1 opacity-70">Tente outro termo de busca.</p>}
          </div>
        ) : (
          <div className="space-y-2 pb-20 md:pb-0">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-all duration-200 border group relative overflow-hidden",
                  selectedNoteId === note.id
                    ? "bg-background border-primary/40 shadow-sm ring-1 ring-primary/10"
                    : "bg-transparent border-transparent hover:bg-background/50 hover:border-border/50"
                )}
              >
                {selectedNoteId === note.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                
                <div className="pl-2">
                  <h3 className={cn("font-semibold truncate pr-2 text-sm", !note.title && "text-muted-foreground italic")}>
                    {note.title || "Sem título"}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-0.5 opacity-80 h-8">
                    {note.content || "Toque para escrever..."}
                  </p>
                  <span className="text-[10px] text-muted-foreground/50 mt-2 block font-medium">
                    {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true, locale: ptBR })}
                  </span>
                </div>
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
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-muted-foreground bg-background h-full">
          <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-4">
            <PenLine className="w-8 h-8 opacity-20" />
          </div>
          <h2 className="text-lg font-semibold text-foreground/80">Nenhuma nota selecionada</h2>
          <p className="text-sm text-muted-foreground mt-1">Selecione uma nota ou crie uma nova para começar.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-background w-full relative">
        {/* Top Decorative Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-50" />

        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3 border-b bg-background/80 backdrop-blur-sm z-20 sticky top-0">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={handleBackToList} className="-ml-2 h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1.5">
                {isSaving ? <><Loader2 className="w-3 h-3 animate-spin text-primary" /> Salvando...</> : 
                 isSaved ? <><Check className="w-3 h-3 text-green-500" /> Salvo</> : 
                 selectedNote ? format(new Date(selectedNote.updated_at), "dd 'de' MMM, HH:mm", { locale: ptBR }) : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className={cn("text-xs font-medium h-8 px-3 rounded-full transition-all", isEditing ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {isEditing ? "Visualizar" : "Editar"}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full"><MoreVertical className="w-4 h-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive cursor-pointer gap-2"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="w-4 h-4" /> Excluir Nota
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Editor Body */}
        <ScrollArea className="flex-1 w-full bg-background">
          <div className="max-w-3xl mx-auto px-6 sm:px-10 py-8 min-h-[calc(100vh-10rem)]">
            
            {/* Título Moderno */}
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da Nota"
              className="text-4xl sm:text-5xl font-extrabold border-none shadow-none focus-visible:ring-0 px-0 bg-transparent placeholder:text-muted-foreground/20 h-auto tracking-tight leading-tight text-foreground"
            />

            {/* Metadados / Badges */}
            <div className="flex items-center gap-3 mt-4 mb-6">
              <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground border-border/60 bg-muted/10 gap-1.5 py-0.5">
                <Calendar className="w-3 h-3" /> 
                {selectedNote ? format(new Date(selectedNote.updated_at), "dd MMM yyyy", { locale: ptBR }) : "Hoje"}
              </Badge>
              <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground border-border/60 bg-muted/10 gap-1.5 py-0.5">
                <Clock className="w-3 h-3" />
                {content.split(/\s+/).filter(Boolean).length} palavras
              </Badge>
            </div>

            <Separator className="mb-8 bg-border/40" />
            
            {isEditing ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Comece a escrever suas ideias..."
                className="w-full resize-none border-none shadow-none focus-visible:ring-0 px-0 text-base sm:text-lg leading-relaxed bg-transparent min-h-[50vh] font-serif text-foreground/90 placeholder:text-muted-foreground/30"
                autoFocus={!isMobile} 
              />
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none prose-lg prose-headings:font-bold prose-p:leading-loose prose-a:text-primary">
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
                Esta ação não pode ser desfeita. A nota será movida para a lixeira permanentemente.
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
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] overflow-hidden rounded-xl border bg-background shadow-sm flex flex-col md:flex-row">
      {/* Mobile: Mostra lista SE nenhuma nota selecionada. Desktop: Sempre mostra lista */}
      {(!isMobile || !selectedNoteId) && renderNoteList()}
      
      {/* Mobile: Mostra editor SE nota selecionada. Desktop: Sempre mostra editor (ao lado) */}
      {(!isMobile || selectedNoteId) && (
        <div className="flex-1 h-full overflow-hidden border-l border-border/40">
           {renderEditor()}
        </div>
      )}
    </div>
  );
};

export default BlocoDeNotas;