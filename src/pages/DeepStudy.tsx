import { useState, useEffect, useRef, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  BookOpen, ArrowLeft, Search, Bookmark, 
  Type, Move, Grid, List, Clock, Scale, 
  Gavel, FileText, ChevronUp, ChevronDown, CheckCircle2,
  Highlighter, Trash2, X, PenTool, Eraser, Library
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import libraryData from "@/data/libraryData.json";
import FavoriteButton from "@/components/FavoriteButton";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Profile {
  id: string;
}

interface Document {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  content: string;
}

interface UserHighlight {
  id: string;
  document_id: string;
  selected_text: string;
  color: string;
  created_at: string;
}

const DeepStudy = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const queryClient = useQueryClient();
  
  // State para navegação
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  
  // State para o leitor
  const [fontSize, setFontSize] = useState(18); // Aumentei o default para melhor leitura
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHighlighterMode, setIsHighlighterMode] = useState(false);
  
  // State para seleção de texto
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // State para remoção de grifos
  const [highlightToRemove, setHighlightToRemove] = useState<{ids: string[], text: string} | null>(null);

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Biblioteca Digital', path: '/library', icon: 'BookOpen' });
  }, [addActivity]);

  // Fetch Highlights
  const { data: highlights = [], isLoading: isLoadingHighlights } = useQuery({
    queryKey: ['highlights', selectedDoc?.id, profile?.id],
    queryFn: async () => {
      if (!selectedDoc || !profile) return [];
      const { data, error } = await supabase
        .from('user_highlights')
        .select('*')
        .eq('user_id', profile.id)
        .eq('document_id', selectedDoc.id);
      if (error) throw error;
      return data as UserHighlight[];
    },
    enabled: !!selectedDoc && !!profile
  });

  // Mutation to save highlight with OPTIMISTIC UPDATES
  const addHighlightMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!profile || !selectedDoc) throw new Error("Usuário ou documento não identificado");
      
      const { data, error } = await supabase.from('user_highlights').insert({
        user_id: profile.id,
        document_id: selectedDoc.id,
        selected_text: text,
        color: 'yellow' 
      }).select().single();
      
      if (error) throw error;
      return data;
    },
    onMutate: async (newText) => {
      await queryClient.cancelQueries({ queryKey: ['highlights', selectedDoc?.id, profile?.id] });
      const previousHighlights = queryClient.getQueryData(['highlights', selectedDoc?.id, profile?.id]);

      if (profile && selectedDoc) {
        queryClient.setQueryData(['highlights', selectedDoc.id, profile.id], (old: UserHighlight[] | undefined) => {
          const newHighlight: UserHighlight = {
            id: `temp-${Date.now()}`,
            document_id: selectedDoc.id,
            selected_text: newText,
            color: 'yellow',
            created_at: new Date().toISOString()
          };
          return old ? [...old, newHighlight] : [newHighlight];
        });
      }

      setSelectionRect(null);
      setSelectedText("");
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }

      return { previousHighlights };
    },
    onError: (err, newText, context) => {
      if (context?.previousHighlights) {
        queryClient.setQueryData(['highlights', selectedDoc?.id, profile?.id], context.previousHighlights);
      }
      toast.error("Erro ao salvar grifo.");
      console.error(err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights', selectedDoc?.id, profile?.id] });
    }
  });

  // Mutation to delete highlights
  const deleteHighlightMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('user_highlights').delete().in('id', ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      toast.success("Grifo removido.");
      setHighlightToRemove(null);
    },
    onError: (error) => {
      toast.error("Erro ao remover grifo.");
      console.error(error);
    }
  });

  // Handler de Scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
    if (selectionRect) {
      setSelectionRect(null);
      setSelectedText("");
    }
  };

  // Handler de Seleção de Texto Otimizado
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selectedDoc) {
      setSelectionRect(null);
      setSelectedText("");
      return;
    }

    const plainText = selection.toString().trim();
    if (plainText.length > 0) {
      const words = plainText.split(/\s+/).filter(w => w.trim().length > 0);
      if (words.length === 0) return;

      const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const glue = '(?:<[^>]+>|&[^;]+;|\\s|[\\r\\n]|[^a-zA-Z0-9À-ÿ])*?';
      const pattern = escapedWords.join(glue);
      
      try {
        const regex = new RegExp(pattern, 'gi'); 
        const match = selectedDoc.content.match(regex);
        const textToSave = match ? match[0] : plainText;

        const isDuplicate = highlights.some(h => h.selected_text === textToSave);
        if (isDuplicate) {
          window.getSelection()?.removeAllRanges();
          return;
        }

        if (isHighlighterMode) {
          addHighlightMutation.mutate(textToSave);
        } else {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          setSelectionRect(rect);
          setSelectedText(textToSave);
        }
      } catch (e) {
        console.error("Erro ao criar regex para seleção", e);
        if (isHighlighterMode) addHighlightMutation.mutate(plainText);
      }
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'MARK' && window.getSelection()?.toString().trim() === '') {
      const markHtml = target.innerHTML;
      const idsToDelete = highlights
        .filter(h => h.selected_text.includes(markHtml) || markHtml.includes(h.selected_text))
        .map(h => h.id);

      if (idsToDelete.length > 0) {
        setHighlightToRemove({ ids: idsToDelete, text: target.textContent || "" });
      }
    }
  };

  const handleHighlightButton = () => {
    if (selectedText) {
      addHighlightMutation.mutate(selectedText);
    }
  };

  const processedContent = useMemo(() => {
    if (!selectedDoc) return "";
    let content = selectedDoc.content;
    const ranges: {start: number, end: number}[] = [];

    if (!highlights || highlights.length === 0) return content;

    highlights.forEach(h => {
      if (!h.selected_text) return;
      const term = h.selected_text;
      let pos = content.indexOf(term);
      
      if (pos === -1) {
         try {
            const words = term.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.trim().length > 0);
            const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const glue = '(?:<[^>]+>|&[^;]+;|\\s|[\\r\\n]|[^a-zA-Z0-9À-ÿ])*?';
            const pattern = escapedWords.join(glue);
            const regex = new RegExp(pattern, 'gi'); 
            let match;
            while ((match = regex.exec(content)) !== null) {
               ranges.push({ start: match.index, end: match.index + match[0].length });
            }
         } catch (e) {}
      } else {
        while (pos !== -1) {
          ranges.push({ start: pos, end: pos + term.length });
          pos = content.indexOf(term, pos + 1);
        }
      }
    });

    if (ranges.length === 0) return content;

    ranges.sort((a, b) => a.start - b.start);
    const mergedRanges: {start: number, end: number}[] = [];
    if (ranges.length > 0) {
        let currentRange = ranges[0];
        for (let i = 1; i < ranges.length; i++) {
        const nextRange = ranges[i];
        if (nextRange.start <= currentRange.end) {
            currentRange.end = Math.max(currentRange.end, nextRange.end);
        } else {
            mergedRanges.push(currentRange);
            currentRange = nextRange;
        }
        }
        mergedRanges.push(currentRange);
    }

    let result = content;
    for (let i = mergedRanges.length - 1; i >= 0; i--) {
      const { start, end } = mergedRanges[i];
      const markStart = `<mark class="bg-yellow-200 dark:bg-yellow-500/30 text-inherit rounded-sm px-0.5 cursor-pointer hover:bg-yellow-300 dark:hover:bg-yellow-500/50 transition-colors box-decoration-clone decoration-clone" title="Clique para remover">`;
      const markEnd = `</mark>`;
      result = result.substring(0, start) + markStart + result.substring(start, end) + markEnd + result.substring(end);
    }

    return result;
  }, [selectedDoc, highlights]);

  const filteredDocs = libraryData.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Todas" || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Todas", ...Array.from(new Set(libraryData.map(d => d.category)))];

  const highlighterCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path d="M18.8 4l1.2 1.2c0.8 0.8 0.8 2 0 2.8L9.2 18.8 6 15.6 16.8 4.8c0.8-0.8 2-0.8 2.8 0z" fill="%23facc15" stroke="%23854d0e" stroke-width="1.5"/><path d="M9.2 18.8L6 15.6 3 21l6-2.2z" fill="%23fef9c3" stroke="%23854d0e" stroke-width="1.5"/><line x1="15.5" y1="7.5" x2="13.5" y2="9.5" stroke="%23a16207" stroke-width="1.5"/></svg>') 4 28, text`;

  // LEITOR IMERSIVO
  if (selectedDoc) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in zoom-in-95 duration-300">
        
        {/* Modal de Remoção */}
        <AlertDialog open={!!highlightToRemove} onOpenChange={(open) => !open && setHighlightToRemove(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover Grifo</AlertDialogTitle>
              <AlertDialogDescription>
                Deseja remover o destaque do texto abaixo?
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border text-sm italic font-medium line-clamp-3 text-foreground/80">
                  "{highlightToRemove?.text}"
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => highlightToRemove && deleteHighlightMutation.mutate(highlightToRemove.ids)}
                className="bg-destructive hover:bg-destructive/90"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remover
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Barra de Progresso */}
        <div className="h-1 w-full bg-muted/30 fixed top-0 z-[60]">
          <div className="h-full bg-primary transition-all duration-150 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]" style={{ width: `${scrollProgress}%` }} />
        </div>

        {/* Toolbar Flutuante Responsiva */}
        <header className="sticky top-0 z-50 px-3 py-2 sm:px-4 sm:py-3 bg-background/80 backdrop-blur-md border-b flex items-center justify-between transition-all">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Button variant="ghost" size="icon" onClick={() => setSelectedDoc(null)} title="Voltar para a biblioteca" className="rounded-full hover:bg-muted h-8 w-8 sm:h-10 sm:w-10 shrink-0">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-sm sm:text-base truncate max-w-[200px] sm:max-w-md">{selectedDoc.title}</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
                {selectedDoc.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {profile && (
              <Button 
                variant={isHighlighterMode ? "secondary" : "ghost"} 
                size="sm" 
                className={cn("gap-2 rounded-full transition-all border h-8 px-2 sm:px-4 sm:h-9", isHighlighterMode ? "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800" : "border-transparent")}
                onClick={() => {
                  setIsHighlighterMode(!isHighlighterMode);
                  if (!isHighlighterMode) {
                      toast.info("Modo Grifador Ativado", { description: "Selecione o texto para grifar automaticamente." });
                  }
                }}
              >
                <PenTool className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline font-medium">{isHighlighterMode ? "Grifando..." : "Grifar"}</span>
              </Button>
            )}

            {profile && (
              <FavoriteButton 
                userId={profile.id}
                itemId={`/library/${selectedDoc.id}`}
                itemType="Documento"
                itemTitle={selectedDoc.title}
                className="hover:bg-muted rounded-full h-8 w-8 sm:h-10 sm:w-10"
              />
            )}
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted h-8 w-8 sm:h-10 sm:w-10"><Type className="h-4 w-4" /></Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-semibold text-sm">Aparência do Texto</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      <span>Pequeno</span><span>Tamanho</span><span>Grande</span>
                    </div>
                    <Slider defaultValue={[fontSize]} min={14} max={28} step={1} onValueChange={(val) => setFontSize(val[0])} className="cursor-pointer" />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Menu Flutuante de Seleção */}
        {selectionRect && profile && !isHighlighterMode && (
          <div 
            className="fixed z-[60] animate-in fade-in zoom-in duration-200 drop-shadow-lg"
            style={{
              top: `${selectionRect.top - 50}px`,
              left: `${selectionRect.left + (selectionRect.width / 2) - 50}px`
            }}
          >
            <div className="bg-foreground text-background rounded-full px-1.5 py-1 flex items-center gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 rounded-full hover:bg-background/20 hover:text-background text-xs font-semibold px-3"
                onClick={handleHighlightButton}
              >
                <Highlighter className="h-3.5 w-3.5 mr-2" /> Destacar
              </Button>
              <div className="w-px h-4 bg-background/20" />
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-background/20 hover:text-background"
                onClick={() => { setSelectionRect(null); setSelectedText(""); }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="w-2 h-2 bg-foreground rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
          </div>
        )}

        {/* Área de Leitura Responsiva */}
        <div className="flex-1 overflow-y-auto bg-background scroll-smooth" onScroll={handleScroll}>
          <div 
            className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16 selection:bg-primary/20 selection:text-foreground" 
            ref={contentRef} 
            onMouseUp={handleMouseUp} 
            onTouchEnd={handleMouseUp}
            onClick={handleContentClick}
            style={{ cursor: isHighlighterMode ? highlighterCursor : 'text' }}
          >
            <div className="mb-6 sm:mb-10 text-center sm:text-left">
              <Badge variant="outline" className="mb-3 sm:mb-4 bg-primary/5 border-primary/20 text-primary px-3 py-1 text-[10px] sm:text-xs uppercase tracking-widest font-semibold">
                {selectedDoc.category}
              </Badge>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground mb-4 sm:mb-6 leading-tight tracking-tight">
                {selectedDoc.title}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground border-y py-3 sm:py-4">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> {selectedDoc.readTime} de leitura</span>
                <span className="hidden sm:inline w-1 h-1 rounded-full bg-muted-foreground/30"></span>
                <span className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Documento Oficial</span>
              </div>
            </div>

            <article 
              className="prose prose-slate dark:prose-invert max-w-none prose-base sm:prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg marker:text-primary/50 leading-loose"
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            <div className="mt-12 sm:mt-20 p-6 sm:p-8 rounded-2xl bg-muted/30 border border-dashed flex flex-col items-center gap-3 sm:gap-4 text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base sm:text-lg">Leitura Concluída</h3>
                <p className="text-muted-foreground text-sm">Você chegou ao final deste documento.</p>
              </div>
              <Button onClick={() => setSelectedDoc(null)} variant="outline" className="mt-2 w-full sm:w-auto">Voltar para a Biblioteca</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MODO ESTANTE (LIBRARY)
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Modern Header Mobile-Optimized */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-950 p-6 sm:p-12 text-white shadow-2xl isolate">
        <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-600/30 rounded-full blur-[60px] sm:blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10" />
        <div className="absolute bottom-0 left-0 w-[200px] sm:w-[400px] h-[200px] sm:h-[400px] bg-teal-600/20 rounded-full blur-[40px] sm:blur-[80px] translate-y-1/3 -translate-x-1/3 -z-10" />
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-medium text-indigo-200 mb-4 sm:mb-6">
            <Library className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Biblioteca Digital
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mb-3 sm:mb-4 leading-tight">
            Aprofunde seus <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-teal-300">Conhecimentos</span>
          </h1>
          <p className="text-sm sm:text-lg text-slate-300 max-w-xl leading-relaxed">
            Acesso completo a leis, códigos de ética, protocolos e manuais técnicos essenciais para sua formação e prática profissional.
          </p>
        </div>
      </div>

      {/* Sticky Search & Filter Bar Mobile-Friendly */}
      <div className="sticky top-0 z-20 py-2 sm:py-4 -mx-4 px-4 sm:mx-0 sm:px-0 bg-background/80 backdrop-blur-lg border-b sm:border-none sm:bg-transparent transition-all">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-between">
          
          {/* Barra de Busca - Full width no mobile */}
          <div className="relative w-full md:w-80 group order-1 md:order-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 sm:h-11 bg-card border-transparent shadow-sm ring-1 ring-border/50 focus:bg-background focus:ring-primary/50 transition-all rounded-xl text-sm"
            />
          </div>

          {/* Abas com Scroll Horizontal - Native Scrolling for better mobile feel */}
          <div className="w-full md:w-auto order-2 md:order-1 -mx-4 md:mx-0">
            <Tabs defaultValue="Todas" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <div className="w-full overflow-x-auto pb-2 px-4 md:px-0 no-scrollbar">
                <TabsList className="flex w-max space-x-2 bg-transparent p-0 h-auto">
                  {categories.map(cat => (
                    <TabsTrigger 
                      key={cat} 
                      value={cat} 
                      className="rounded-full border border-border/50 bg-background/50 px-4 py-2 text-xs font-medium whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary shadow-sm transition-all"
                    >
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Grid de Documentos Responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredDocs.map((doc, idx) => (
          <div 
            key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            className="group relative bg-card hover:bg-card/50 border rounded-xl sm:rounded-2xl p-1 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden ring-1 ring-border/50 hover:ring-primary/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative h-full flex flex-col p-4 sm:p-5 rounded-lg sm:rounded-xl bg-card/50 backdrop-blur-sm">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-0 text-[10px] sm:text-xs">
                  {doc.category}
                </Badge>
                {profile && (
                  <div onClick={(e) => e.stopPropagation()} className="relative z-20">
                    <FavoriteButton 
                      userId={profile.id}
                      itemId={`/library/${doc.id}`}
                      itemType="Documento"
                      itemTitle={doc.title}
                      className="h-7 w-7 sm:h-8 sm:w-8 hover:bg-background"
                    />
                  </div>
                )}
              </div>
              
              <h3 className="text-base sm:text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                {doc.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 mb-4 sm:mb-6 flex-1 leading-relaxed">
                {doc.description}
              </p>
              
              <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-border/50 mt-auto">
                <span className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> {doc.readTime}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-primary flex items-center gap-1 opacity-100 sm:opacity-0 sm:-translate-x-2 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 transition-all duration-300">
                  Ler Agora <ArrowLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5 rotate-180" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20 bg-muted/20 rounded-2xl sm:rounded-3xl border border-dashed text-center animate-in fade-in zoom-in duration-500">
          <div className="bg-muted p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
            <Search className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground">Nenhum documento encontrado</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xs">Tente ajustar seus termos de busca ou filtros.</p>
          <Button variant="link" onClick={() => { setSearchTerm(""); setActiveCategory("Todas"); }} className="mt-1 sm:mt-2 text-xs sm:text-sm">
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default DeepStudy;