import { useState, useEffect, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Loader2, Plus, Trash2, Check, Search, 
  ArrowLeft, FileText, MoreVertical, PenLine, Calendar, Clock, NotebookText, Save
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
  const [isEditing, setIsEditing] = useState(true); // Default true para edição imediata
  const [noteSearchTerm, setNoteSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  // Estado para controlar a visualização mobile (Lista vs Editor)
  const [mobileView, setMobileView] = useState<"list" | "editor">("list");

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
      setIsEditing(true); 
    }
    // NOTA: Se selectedNote for null, não limpamos automaticamente aqui para permitir
    // que o usuário inicie uma nova nota sem limpar se ele clicar em "Nova Nota"
  }, [selectedNote]);

  // Handler para iniciar uma nova nota (Reseta estados)
  const handleNewNote = () => {
    setSelectedNoteId(null);
    setTitle("");
    setContent("");
    setIsEditing(true);
    if (isMobile) setMobileView("editor");
  };

  const saveNoteMutation = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("Usuário não autenticado.");
      
      // Se tiver ID, atualiza. Se não, cria.
      if (selectedNoteId) {
        const { error } = await supabase.from("notes").update({ 
          title, 
          content,
          updated_at: new Date().toISOString()
        }).eq("id", selectedNoteId);
        if (error) throw error;
        return { id: selectedNoteId, type: 'update' };
      } else {
        const { data, error } = await supabase.from("notes").insert({
          user_id: profile.id,
          title: title || "Sem Título",
          content
        }).select().single();
        if (error) throw error;
        return { id: data.id, type: 'create' };
      }
    },
    onMutate: () => {
      setIsSaving(true);
      setIsSaved(false);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes", profile?.id] });
      setIsSaving(false);
      setIsSaved(true);
      
      if (data.type === 'create') {
        setSelectedNoteId(data.id);
        toast.success("Nota criada com sucesso!");
      }

      setTimeout(() => setIsSaved(false), 2000);
    },
    onError: (error) => {
      setIsSaving(false);
      toast.error("Erro ao salvar nota", { description: error.message });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", noteId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", profile?.id] });
      // Se deletou a nota atual, volta para modo 'nova nota'
      if (selectedNoteId) {
        handleNewNote();
      }
      setIsDeleteDialogOpen(false);
      if (isMobile) setMobileView("list");
      toast.success("Nota excluída.");
    },
    onError: (error) => toast.error("Erro ao excluir", { description: error.message }),
  });

  // Auto-save logic (Apenas se já tiver ID, para não criar notas lixo enquanto digita a primeira vez)
  useEffect(() => {
    if (!selectedNoteId) return;
    
    // Evita salvar se não houve mudança real comparado ao banco
    if (selectedNote && title === selectedNote.title && content === selectedNote.content) {
      return;
    }

    const handler = setTimeout(() => {
      saveNoteMutation.mutate();
    }, 1500); // Debounce de 1.5s para autosave

    return () => clearTimeout(handler);
  }, [title, content, selectedNoteId]);

  const handleManualSave = () => {
    if (!title && !content) {
      toast.warning("Escreva algo para salvar.");
      return;
    }
    saveNoteMutation.mutate();
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
    if (isMobile) setMobileView("editor");
  };

  const handleBackToList = () => {
    setMobileView("list");
    // Não limpamos o selectedNoteId imediatamente para manter o estado se voltar, 
    // mas se quiser comportamento de "fechar", poderia limpar.
  };

  // Renderização da Lista de Notas
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
            onClick={handleNewNote}
            size="sm" 
            className="rounded-full shadow-sm bg-primary hover:bg-primary/90 text-xs px-3"
          >
            <Plus className="w-3 h-3 mr-1" />
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
            <Button variant="link" onClick={handleNewNote} className="text-xs mt-1">Criar a primeira nota</Button>
          </div>
        ) : (
          <div className="space-y-2 pb-20 md:pb-0">
            {filteredNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => handleSelectNote(note.id)}
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
                    {note.content || "..."}
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

  // Renderização do Editor
  const renderEditor = () => {
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
                 selectedNote ? format(new Date(selectedNote.updated_at), "dd 'de' MMM, HH:mm", { locale: ptBR }) : "Nova Anotação"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Botão de Salvar Manual (Principalmente para notas novas) */}
            <Button 
               variant="default"
               size="sm"
               onClick={handleManualSave}
               disabled={isSaving || (!title && !content)}
               className="h-8 text-xs font-semibold bg-primary hover:bg-primary/90 rounded-full px-4 shadow-sm"
            >
               {isSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3 mr-1.5" />}
               Salvar
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(!isEditing)}
              className={cn("text-xs font-medium h-8 px-3 rounded-full transition-all hidden sm:flex", isEditing ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {isEditing ? "Visualizar" : "Editar"}
            </Button>
            
            {selectedNoteId && (
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
            )}
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
                {selectedNote ? format(new Date(selectedNote.updated_at), "dd MMM yyyy", { locale: ptBR }) : "Rascunho"}
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
                autoFocus={!isMobile && !selectedNoteId} // Autofocus se for nova nota no desktop
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
      {/* Mobile: Mostra lista SE view for 'list'. Desktop: Sempre mostra lista */}
      {(!isMobile || mobileView === "list") && renderNoteList()}
      
      {/* Mobile: Mostra editor SE view for 'editor'. Desktop: Sempre mostra editor (ao lado) */}
      {(!isMobile || mobileView === "editor") && (
        <div className="flex-1 h-full overflow-hidden border-l border-border/40">
           {renderEditor()}
        </div>
      )}
    </div>
  );
};

export default BlocoDeNotas;