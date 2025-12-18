import { useState, useEffect, useRef, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  BookOpen, ArrowLeft, Search, Bookmark, 
  Type, Move, Grid, List, Clock, Scale, 
  Gavel, FileText, ChevronUp, ChevronDown, CheckCircle2,
  Highlighter, Trash2, X, PenTool, Eraser
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [fontSize, setFontSize] = useState(16);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHighlighterMode, setIsHighlighterMode] = useState(false);
  
  // State para seleção de texto
  const [selectionRect, setSelectionRect] = useState<DOMRect | null>(null);
  const [selectedText, setSelectedText] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

  // State para remoção de grifos
  const [highlightToRemove, setHighlightToRemove] = useState<{ids: string[], text: string} | null>(null);

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Biblioteca', path: '/library', icon: 'BookOpen' });
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
      // 1. Divide o texto em tokens (palavras), mas mantém pontuação simples colada se necessário
      // O split por whitespace é geralmente seguro para isolar palavras
      const words = plainText.split(/\s+/);
      
      // 2. Escapa caracteres especiais de regex
      const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      
      // 3. Padrão Ultra-Permissivo entre palavras:
      // Aceita:
      // - Tags HTML completas: <[^>]+>
      // - Entidades HTML: &[^;]+;
      // - Whitespace: \s
      // - Quebras de linha: \r, \n
      // - Caracteres que não sejam letras/números (pontuação solta): [^a-zA-Z0-9À-ÿ]
      // O (?:...)+ significa que pode haver um ou mais desses itens entre as palavras
      const glue = '(?:<[^>]+>|&[^;]+;|\\s|[\\r\\n]|[^a-zA-Z0-9À-ÿ])*';
      
      const pattern = escapedWords.join(glue);
      
      // 4. Busca no conteúdo HTML original
      try {
        const regex = new RegExp(pattern, 'i'); // Case insensitive
        const match = selectedDoc.content.match(regex);
        
        // Se encontrou no HTML, usa o texto original (com tags)
        // Se não encontrou (fallback), usa o texto simples, mas avisa
        const textToSave = match ? match[0] : plainText;

        // Evita duplicatas exatas
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
        // Fallback seguro: salva o texto plano se a regex falhar
        if (isHighlighterMode) addHighlightMutation.mutate(plainText);
      }
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Verifica se clicou em uma tag MARK (grifo)
    if (target.tagName === 'MARK' && window.getSelection()?.toString().trim() === '') {
      const markHtml = target.innerHTML;
      
      // Encontra highlights que contenham este trecho
      const idsToDelete = highlights
        .filter(h => {
            // Verifica se o texto do highlight contém o que foi clicado OU se o que foi clicado contém o highlight
            // Isso ajuda quando o highlight salvo é maior ou menor que o fragmento renderizado (devido a aninhamento)
            return h.selected_text.includes(markHtml) || markHtml.includes(h.selected_text);
        })
        .map(h => h.id);

      if (idsToDelete.length > 0) {
        setHighlightToRemove({ 
            ids: idsToDelete, 
            text: target.textContent || "" 
        });
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
      
      // Tenta encontrar a string exata
      let pos = content.indexOf(term);
      
      // Se não encontrar, tenta uma busca regex flexível (para lidar com pequenas diferenças de formatação salvas)
      if (pos === -1) {
         try {
            // Usa uma lógica similar à seleção para reencontrar o texto no HTML
            const words = term.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 0);
            const escapedWords = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            const glue = '(?:<[^>]+>|&[^;]+;|\\s|[\\r\\n]|[^a-zA-Z0-9À-ÿ])*';
            const pattern = escapedWords.join(glue);
            
            const regex = new RegExp(pattern, 'g'); // Global para achar todas as ocorrências
            let match;
            while ((match = regex.exec(content)) !== null) {
               // Verifica se é um match razoável (tamanho parecido)
               if (Math.abs(match[0].length - term.length) < term.length * 0.5) {
                   ranges.push({ start: match.index, end: match.index + match[0].length });
               }
            }
         } catch (e) {
            // Silently fail
         }
      } else {
        // Se encontrou exato
        while (pos !== -1) {
          ranges.push({ start: pos, end: pos + term.length });
          pos = content.indexOf(term, pos + 1);
        }
      }
    });

    if (ranges.length === 0) return content;

    // Mescla ranges sobrepostos para evitar HTML quebrado
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

    // Aplica as tags <mark> de trás para frente para não alterar os índices
    let result = content;
    for (let i = mergedRanges.length - 1; i >= 0; i--) {
      const { start, end } = mergedRanges[i];
      
      // Verifica se o range corta uma tag HTML ao meio (evita quebrar o HTML)
      const segment = result.substring(start, end);
      const openTags = (segment.match(/<[^/][^>]*>/g) || []).length;
      const closeTags = (segment.match(/<\/[^>]+>/g) || []).length;
      
      // Se o balanceamento de tags estiver ok, ou se não houver tags, aplica o mark
      // Se houver risco de quebrar HTML, aplicamos uma classe mais "agressiva" que o navegador tenta corrigir, 
      // ou usamos box-decoration-clone para spans que podem quebrar linha visualmente
      
      const markStart = `<mark class="bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-100 rounded-sm px-0.5 cursor-pointer hover:bg-yellow-300 transition-colors box-decoration-clone" title="Clique para remover">`;
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
      <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in duration-300">
        
        {/* Modal de Remoção */}
        <AlertDialog open={!!highlightToRemove} onOpenChange={(open) => !open && setHighlightToRemove(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remover Grifo</AlertDialogTitle>
              <AlertDialogDescription>
                Deseja remover o destaque do texto abaixo?
                <div className="mt-4 p-3 bg-muted rounded-md text-sm italic font-medium line-clamp-3">
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
        <div className="h-1 w-full bg-muted">
          <div className="h-full bg-primary transition-all duration-100 ease-out" style={{ width: `${scrollProgress}%` }} />
        </div>

        {/* Toolbar */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
          <div className="flex items-center gap-4 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => setSelectedDoc(null)} title="Voltar para a estante">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="hidden sm:block min-w-0">
              <h1 className="font-bold text-sm sm:text-base truncate">{selectedDoc.title}</h1>
              <p className="text-xs text-muted-foreground truncate">{selectedDoc.category} • {selectedDoc.readTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {profile && (
              <Button 
                variant={isHighlighterMode ? "default" : "outline"} 
                size="sm" 
                className={cn("gap-2 transition-all", isHighlighterMode ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500" : "")}
                onClick={() => {
                  setIsHighlighterMode(!isHighlighterMode);
                  if (!isHighlighterMode) {
                      toast.info("Modo Grifador Ativado", { description: "Selecione o texto para grifar automaticamente." });
                  }
                }}
              >
                <PenTool className="h-4 w-4" />
                <span className="hidden sm:inline">{isHighlighterMode ? "Grifador Ativo" : "Usar Grifador"}</span>
              </Button>
            )}

            {profile && (
              <FavoriteButton 
                userId={profile.id}
                itemId={`/library/${selectedDoc.id}`}
                itemType="Documento"
                itemTitle={selectedDoc.title}
              />
            )}
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon"><Type className="h-4 w-4" /></Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">Ajustes de Leitura</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>A-</span><span>Fonte</span><span>A+</span>
                    </div>
                    <Slider defaultValue={[fontSize]} min={14} max={28} step={1} onValueChange={(val) => setFontSize(val[0])} />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Menu Flutuante de Seleção (Apenas se o modo grifador NÃO estiver ativo) */}
        {selectionRect && profile && !isHighlighterMode && (
          <div 
            className="fixed z-50 animate-in fade-in zoom-in duration-200"
            style={{
              top: `${selectionRect.top - 50}px`,
              left: `${selectionRect.left + (selectionRect.width / 2) - 50}px`
            }}
          >
            <div className="bg-foreground text-background rounded-full shadow-xl px-2 py-1.5 flex items-center gap-1">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 rounded-full hover:bg-muted/20 hover:text-background text-xs font-semibold"
                onClick={handleHighlightButton}
              >
                <Highlighter className="h-3.5 w-3.5 mr-1.5" /> Grifar
              </Button>
              <div className="w-px h-4 bg-background/20" />
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full hover:bg-muted/20 hover:text-background"
                onClick={() => { setSelectionRect(null); setSelectedText(""); }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="w-3 h-3 bg-foreground rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
          </div>
        )}

        {/* Área de Conteúdo */}
        <div className="flex-1 overflow-y-auto bg-background" onScroll={handleScroll}>
          <div 
            className="max-w-3xl mx-auto px-6 py-10 sm:py-16" 
            ref={contentRef} 
            onMouseUp={handleMouseUp} 
            onTouchEnd={handleMouseUp}
            onClick={handleContentClick}
            style={{ cursor: isHighlighterMode ? highlighterCursor : 'text' }}
          >
            <div className="mb-8 border-b pb-4">
              <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4 leading-tight">{selectedDoc.title}</h1>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{selectedDoc.category}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {selectedDoc.readTime}</span>
              </div>
            </div>

            <article 
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-strong:text-foreground marker:text-muted-foreground select-text"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />

            <div className="mt-16 pt-8 border-t flex flex-col items-center gap-4 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-50 opacity-20" />
              <p className="text-muted-foreground text-sm">Você chegou ao final deste documento.</p>
              <Button onClick={() => setSelectedDoc(null)} variant="outline">Voltar para a Biblioteca</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MODO ESTANTE (LIBRARY)
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-gray-900 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Biblioteca de Aprofundamento</h1>
          </div>
          <p className="max-w-xl text-gray-300 text-lg">
            Acesso a documentos na íntegra, leis, códigos e protocolos para estudo detalhado.
          </p>
        </div>
        <div className="absolute top-0 right-0 opacity-10">
          <Scale className="w-64 h-64 -translate-y-12 translate-x-12" />
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur py-2 border-b md:border-none md:bg-transparent">
        <Tabs defaultValue="Todas" value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
          <TabsList className="w-full md:w-auto bg-muted/50 p-1 h-10">
            {categories.map(cat => (
              <TabsTrigger key={cat} value={cat} className="text-xs sm:text-sm">{cat}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>

      {/* Grid de Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <Card 
            key={doc.id} 
            className="group hover:shadow-lg transition-all duration-300 border-t-4 border-t-primary cursor-pointer hover:-translate-y-1 flex flex-col"
            onClick={() => setSelectedDoc(doc)}
          >
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="bg-primary/5">{doc.category}</Badge>
                {profile && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <FavoriteButton 
                      userId={profile.id}
                      itemId={`/library/${doc.id}`}
                      itemType="Documento"
                      itemTitle={doc.title}
                    />
                  </div>
                )}
              </div>
              <CardTitle className="text-xl leading-tight group-hover:text-primary transition-colors">{doc.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                {doc.description}
              </p>
            </CardContent>
            <CardFooter className="border-t pt-4 text-xs text-muted-foreground flex justify-between items-center bg-muted/20">
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {doc.readTime} de leitura</span>
              <span className="font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Ler Agora <ArrowLeft className="h-3 w-3 rotate-180" />
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-semibold text-muted-foreground">Nenhum documento encontrado</h3>
          <p className="text-sm text-muted-foreground/80">Tente buscar por outro termo.</p>
        </div>
      )}
    </div>
  );
};

export default DeepStudy;