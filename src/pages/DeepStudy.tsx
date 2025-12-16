import { useState, useEffect, useRef, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  BookOpen, ArrowLeft, Search, Bookmark, 
  Type, Move, Grid, List, Clock, Scale, 
  Gavel, FileText, ChevronUp, ChevronDown, CheckCircle2,
  Highlighter, Trash2, X, PenTool
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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

  // Mutation to save highlight
  const addHighlightMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!profile || !selectedDoc) throw new Error("Usuário ou documento não identificado");
      
      // Verifica duplicatas locais antes de enviar
      const isDuplicate = highlights.some(h => h.selected_text === text);
      if (isDuplicate) return; // Não salva se já existe

      const { error } = await supabase.from('user_highlights').insert({
        user_id: profile.id,
        document_id: selectedDoc.id,
        selected_text: text,
        color: 'yellow' 
      }).select(); // .select() é importante para confirmar a inserção
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      setSelectionRect(null);
      setSelectedText("");
      
      // Se não estiver no modo contínuo, mostra toast
      if (!isHighlighterMode) {
        toast.success("Texto grifado!");
      }
      
      // Limpar seleção visual
      if (window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }
    },
    onError: (error) => {
      // Ignora erro silenciosamente se for apenas seleção vazia, mas alerta se for erro de rede
      console.error("Erro ao salvar grifo:", error);
    }
  });

  // Mutation to delete highlight
  const deleteHighlightMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('user_highlights').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['highlights'] });
      toast.success("Grifo removido.");
    }
  });

  // Handler de Scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
    // Hide popover on scroll
    if (selectionRect) {
      setSelectionRect(null);
      setSelectedText("");
    }
  };

  // Handler de Seleção de Texto
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectionRect(null);
      setSelectedText("");
      return;
    }

    const text = selection.toString().trim();
    if (text.length > 0) {
      // Se o modo grifador estiver ATIVO, salva direto
      if (isHighlighterMode) {
        addHighlightMutation.mutate(text);
      } else {
        // Se NÃO estiver ativo, mostra o menu flutuante
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setSelectionRect(rect);
        setSelectedText(text);
      }
    }
  };

  const handleHighlightButton = () => {
    if (selectedText) {
      addHighlightMutation.mutate(selectedText);
    }
  };

  // Processar conteúdo para exibir grifos
  const processedContent = useMemo(() => {
    if (!selectedDoc) return "";
    let content = selectedDoc.content;

    // Ordenar highlights por tamanho (maiores primeiro) para evitar conflitos de replace
    const sortedHighlights = [...highlights].sort((a, b) => b.selected_text.length - a.selected_text.length);

    sortedHighlights.forEach(h => {
      // Previne que a substituição quebre tags HTML existentes ou outros grifos
      // Usamos uma estratégia de split/join segura
      const parts = content.split(h.selected_text);
      if (parts.length > 1) {
        // Apenas substitui se encontrar o texto exato
        content = parts.join(`<mark class="bg-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-100 rounded-sm px-0.5 cursor-pointer hover:bg-yellow-300 transition-colors" title="Texto grifado">${h.selected_text}</mark>`);
      }
    });

    return content;
  }, [selectedDoc, highlights]);

  const filteredDocs = libraryData.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Todas" || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Todas", ...Array.from(new Set(libraryData.map(d => d.category)))];

  // SVG Cursor Data URI (Amarelo)
  const highlighterCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="%23fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 2-7 20-4-9-9-4Z"/><path d="M13 6 7 7"/></svg>') 0 32, text`;

  // LEITOR IMERSIVO
  if (selectedDoc) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in duration-300">
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
              <>
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

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative" title="Meus Grifos">
                      <Highlighter className="h-4 w-4" />
                      {highlights.length > 0 && (
                        <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
                          {highlights.length}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Meus Grifos</SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
                      {highlights.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                          <Highlighter className="h-10 w-10 mx-auto mb-2 opacity-20" />
                          <p>Nenhum texto grifado ainda.</p>
                          <p className="text-xs">Ative o grifador ou selecione um texto.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {highlights.map((h) => (
                            <Card key={h.id} className="relative group hover:border-yellow-400 transition-colors">
                              <CardContent className="p-3 text-sm">
                                <p className="line-clamp-4 italic bg-yellow-50 dark:bg-yellow-900/10 p-1 rounded">"{h.selected_text}"</p>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                                  onClick={() => deleteHighlightMutation.mutate(h.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </SheetContent>
                </Sheet>
              </>
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
            onTouchEnd={handleMouseUp} // Suporte melhorado para mobile
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
              <CheckCircle2 className="h-12 w-12 text-green-500 opacity-20" />
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