import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  GraduationCap, Search, Download, FileText,
  Lightbulb, Trophy, Sparkles, Loader2, ArrowDownToLine, Eye, X, PenLine, Check
} from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface Profile {
  id: string;
}

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  file_size: string;
  page_count: number;
  is_premium: boolean;
}

// Dados de backup (Mocks) para caso o banco esteja vazio ou não configurado
const MOCK_MATERIALS: StudyMaterial[] = [
  {
    id: "mock-1",
    title: "Resumo Definitivo: Lei 8.080/90",
    description: "Mapas mentais, mnemônicos e os artigos que mais caem em provas de concursos e residências. Foco na organização do SUS.",
    category: "Legislação do SUS",
    file_url: "#",
    file_size: "2.4 MB",
    page_count: 35,
    is_premium: true
  }
];

const fetchMaterials = async () => {
  const { data, error } = await supabase
    .from('study_materials')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    if (error.code === '42P01') {
      return MOCK_MATERIALS;
    }
    throw error;
  }
  
  return data.length > 0 ? (data as StudyMaterial[]) : MOCK_MATERIALS;
};

const ConcurseiroArea = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const queryClient = useQueryClient();
  const { addActivity } = useActivityTracker();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  
  // Estados para Leitura e Download
  const [readingMaterial, setReadingMaterial] = useState<StudyMaterial | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Estados do Bloco de Notas Integrado
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteId, setNoteId] = useState<string | null>(null);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Área do Concurseiro', path: '/concurseiro', icon: 'GraduationCap' });
  }, [addActivity]);

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ['studyMaterials'],
    queryFn: fetchMaterials,
  });

  // Busca anotação prévia do usuário para o material aberto
  const { data: documentNote } = useQuery({
    queryKey: ['documentNote', profile?.id, readingMaterial?.id],
    queryFn: async () => {
      if (!profile || !readingMaterial) return null;
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', profile.id)
        .eq('title', `Anotações: ${readingMaterial.title}`)
        .maybeSingle();
      
      if (error) throw error;
      return data || { id: null, content: "" };
    },
    enabled: !!profile && !!readingMaterial,
    staleTime: Infinity, 
  });

  // Sincroniza o estado local quando a anotação carrega do banco
  useEffect(() => {
    if (documentNote && readingMaterial) {
      setNoteContent(documentNote.content || "");
      setNoteId(documentNote.id || null);
    }
  }, [documentNote, readingMaterial]);

  // Mutação para salvar a anotação
  const saveNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!profile || !readingMaterial) return;
      setIsSavingNote(true);
      const noteTitle = `Anotações: ${readingMaterial.title}`;
      
      if (noteId) {
        const { error } = await supabase.from('notes').update({ content, updated_at: new Date().toISOString() }).eq('id', noteId);
        if (error) throw error;
        return { id: noteId };
      } else {
        const { data, error } = await supabase.from('notes').insert({
          user_id: profile.id,
          title: noteTitle,
          content
        }).select().single();
        if (error) throw error;
        return { id: data.id };
      }
    },
    onSuccess: (data) => {
      if (data?.id && !noteId) setNoteId(data.id);
      setIsSavingNote(false);
      setIsNoteSaved(true);
      setTimeout(() => setIsNoteSaved(false), 2000);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    }
  });

  // Autosave Effect
  useEffect(() => {
    if (!isNotesOpen || !readingMaterial || !profile) return;
    // Previne salvar se o conteúdo for igual ao que veio do banco
    if (documentNote && noteContent === (documentNote.content || "")) return;

    const handler = setTimeout(() => {
      saveNoteMutation.mutate(noteContent);
    }, 1500);

    return () => clearTimeout(handler);
  }, [noteContent, isNotesOpen, profile, readingMaterial, documentNote]);

  const categories = useMemo(() => {
    const cats = new Set(materials.map(m => m.category));
    return ["Todas", ...Array.from(cats).sort()];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const matchesSearch = 
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "Todas" || material.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [materials, searchTerm, activeCategory]);

  const handleOpenReader = (material: StudyMaterial) => {
    setIframeLoading(true);
    setReadingMaterial(material);
    setIsNotesOpen(false);
  };

  const handleCloseReader = () => {
    setReadingMaterial(null);
    setIsNotesOpen(false);
    setNoteContent("");
    setNoteId(null);
  };

  const handleDownload = async (url: string, title: string, id: string) => {
    if (url === "#") {
      toast.info("Este é apenas um material de demonstração.");
      return;
    }

    try {
      setDownloadingId(id);
      toast.info("Preparando download...");
      
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      const safeTitle = title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "_");
      link.download = `EnfermagemPro_${safeTitle}.pdf`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
      toast.success("Download concluído!");
    } catch (error) {
      console.error("Erro no download:", error);
      toast.error("Erro ao fazer o download automático. Abrindo na nova aba.");
      window.open(url, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* HEADER PREMIUM */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0a0f1c] border border-blue-900/30 p-8 sm:p-12 text-white shadow-2xl isolate">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 -z-10" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-300">
              <Trophy className="h-3 w-3" /> Exclusivo Assinantes
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Materiais em <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">PDF</span>
            </h1>
            <p className="text-blue-100/80 text-sm sm:text-lg max-w-xl leading-relaxed">
              Leia os resumos esquematizados diretamente na plataforma, anote na tela dividida ou baixe para imprimir.
            </p>
          </div>

          <div className="hidden lg:block shrink-0">
             <div className="relative w-32 h-40 bg-gradient-to-tr from-white to-slate-200 rounded-lg shadow-2xl rotate-12 transform hover:rotate-0 transition-transform duration-500 border border-slate-300 p-2">
                <div className="w-full h-full bg-slate-50 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                   <FileText className="h-10 w-10 mb-2 text-blue-500" />
                   <div className="w-16 h-1 bg-slate-300 rounded-full mb-1"></div>
                   <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
                </div>
             </div>
          </div>
        </div>

        {profile && (
          <div className="absolute top-4 right-4 z-20">
            <FavoriteButton
              userId={profile.id}
              itemId="/concurseiro"
              itemType="Estudo"
              itemTitle="Materiais PDF"
              className="text-white hover:text-yellow-300"
            />
          </div>
        )}
      </div>

      {/* BIZU DO DIA */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-900/50 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-10"><Lightbulb className="w-16 h-16 text-amber-500" /></div>
         <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl shrink-0 z-10">
            <Lightbulb className="h-6 w-6 text-amber-600 dark:text-amber-400" />
         </div>
         <div className="z-10">
            <h4 className="font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wide text-xs sm:text-sm mb-1">Bizu do Dia</h4>
            <p className="text-sm sm:text-base text-amber-900/80 dark:text-amber-200/80 font-medium italic">
               "Ao abrir um PDF para ler, clique no botão 'Fazer Resumo' no topo para ativar a tela dividida. Suas anotações são salvas automaticamente no seu Bloco de Notas!"
            </p>
         </div>
      </div>

      {/* CONTROLES E FILTROS */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, assunto ou palavra-chave..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-card border-border/50 shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-xl pb-2">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="flex w-max space-x-2 bg-transparent p-0 h-auto">
              {categories.map((cat) => (
                <TabsTrigger 
                  key={cat} 
                  value={cat}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs sm:text-sm font-bold transition-all shadow-sm",
                    activeCategory === cat 
                      ? "bg-blue-600 text-white border-blue-600" 
                      : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border-border/50"
                  )}
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      {/* GRID DE MATERIAIS */}
      {isLoading ? (
         <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-semibold text-sm">Carregando a biblioteca...</p>
         </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-20" />
          <h3 className="text-lg font-bold text-foreground">Nenhum material encontrado</h3>
          <p className="text-muted-foreground text-sm mt-1">Tente buscar com outras palavras ou limpe os filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
             <Card key={material.id} className="group hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl flex flex-col overflow-hidden bg-card border-border/50">
                <CardHeader className="pb-4 relative bg-muted/10 border-b border-border/50">
                   <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 font-bold uppercase text-[10px]">
                         {material.category}
                      </Badge>
                      {material.is_premium && (
                         <div className="p-1.5 bg-yellow-100 text-yellow-700 rounded-md" title="Conteúdo Premium">
                            <Sparkles className="w-3.5 h-3.5" />
                         </div>
                      )}
                   </div>
                   <CardTitle className="text-lg sm:text-xl font-bold leading-tight group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                      {material.title}
                   </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-4 flex-1 flex flex-col">
                   <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed flex-1">
                      {material.description}
                   </p>
                   
                   <div className="flex items-center gap-4 mt-6 text-xs font-semibold text-slate-500 dark:text-slate-400 bg-muted/30 p-2.5 rounded-lg border border-border/50">
                      <div className="flex items-center gap-1.5">
                         <FileText className="w-3.5 h-3.5" /> {material.page_count} págs
                      </div>
                      <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <div className="flex items-center gap-1.5">
                         <ArrowDownToLine className="w-3.5 h-3.5" /> {material.file_size}
                      </div>
                   </div>
                </CardContent>

                <CardFooter className="pt-0 pb-5 px-5 flex gap-3">
                   <Button 
                      onClick={() => handleOpenReader(material)} 
                      variant="outline" 
                      className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/50 font-semibold"
                   >
                      <Eye className="w-4 h-4 mr-2" /> Ler
                   </Button>
                   <Button 
                      onClick={() => handleDownload(material.file_url, material.title, material.id)}
                      disabled={downloadingId === material.id}
                      className="flex-1 bg-slate-900 hover:bg-blue-600 text-white shadow-md transition-all font-bold"
                   >
                      {downloadingId === material.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Baixar
                   </Button>
                </CardFooter>
             </Card>
          ))}
        </div>
      )}

      {/* MODAL DE LEITURA DO PDF */}
      <Dialog open={!!readingMaterial} onOpenChange={(open) => !open && handleCloseReader()}>
        <DialogContent className="max-w-[98vw] sm:max-w-7xl w-[98vw] h-[95vh] p-0 overflow-hidden flex flex-col gap-0 border-none bg-background rounded-xl">
          <VisuallyHidden.Root>
             <DialogTitle>Leitor de PDF</DialogTitle>
          </VisuallyHidden.Root>
          
          {/* Header do Modal */}
          <div className="p-3 sm:p-4 border-b bg-card flex flex-row items-center justify-between shrink-0 shadow-sm z-20">
            <div className="flex flex-col min-w-0 pr-2 sm:pr-4">
               <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{readingMaterial?.category}</span>
               <h3 className="font-bold text-sm sm:text-base truncate max-w-[200px] sm:max-w-md">{readingMaterial?.title}</h3>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
               {profile && (
                 <Button 
                    size="sm" 
                    variant={isNotesOpen ? "default" : "outline"} 
                    className={cn(
                       "hidden sm:flex transition-all gap-2", 
                       isNotesOpen 
                         ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-md" 
                         : "border-border hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:hover:bg-amber-900/30"
                    )}
                    onClick={() => setIsNotesOpen(!isNotesOpen)}
                 >
                    <PenLine className="w-4 h-4" /> {isNotesOpen ? "Fechar Resumo" : "Fazer Resumo"}
                 </Button>
               )}
               <Button 
                  size="sm" 
                  variant="outline" 
                  className="hidden sm:flex"
                  onClick={() => readingMaterial && handleDownload(readingMaterial.file_url, readingMaterial.title, readingMaterial.id)}
               >
                  <Download className="w-4 h-4 mr-2" /> Baixar
               </Button>
               <Button variant="ghost" size="icon" onClick={handleCloseReader} className="rounded-full bg-muted/50 hover:bg-destructive/10 hover:text-destructive shrink-0 ml-1 sm:ml-2">
                  <X className="h-5 w-5"/>
               </Button>
            </div>
          </div>
          
          {/* Corpo do Modal (Split Screen: Iframe + Editor) */}
          <div className="flex-1 w-full h-full flex flex-col lg:flex-row relative bg-slate-100 dark:bg-slate-900 overflow-hidden">
            
            {/* Lado Esquerdo: PDF */}
            <div className={cn("relative h-full transition-all duration-300 ease-in-out", isNotesOpen ? "lg:w-2/3" : "w-full")}>
              {readingMaterial && (
                <>
                  {iframeLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 z-10">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                      <p className="text-sm text-muted-foreground font-medium">Carregando documento...</p>
                    </div>
                  )}
                  <iframe 
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(readingMaterial.file_url)}&embedded=true`} 
                    className="w-full h-full border-0 absolute inset-0 z-20"
                    title={readingMaterial.title}
                    onLoad={() => setIframeLoading(false)}
                  />
                </>
              )}
            </div>

            {/* Lado Direito: Bloco de Notas (Visível apenas se ativado) */}
            {isNotesOpen && profile && (
               <div className="w-full lg:w-1/3 h-1/3 lg:h-full border-t lg:border-t-0 lg:border-l border-border bg-background flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] z-30 animate-in slide-in-from-right-8 duration-300">
                 <div className="p-3 border-b bg-amber-50/50 dark:bg-amber-950/20 flex justify-between items-center shrink-0">
                   <span className="font-bold text-sm flex items-center gap-2 text-amber-800 dark:text-amber-400">
                     <PenLine className="h-4 w-4" /> Suas Anotações
                   </span>
                   <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                     {isSavingNote ? (
                       <><Loader2 className="w-3 h-3 animate-spin text-amber-500" /> Salvando</>
                     ) : isNoteSaved ? (
                       <><Check className="w-3 h-3 text-green-500" /> Salvo</>
                     ) : (
                       "Autosave ON"
                     )}
                   </span>
                 </div>
                 <Textarea 
                   value={noteContent}
                   onChange={(e) => setNoteContent(e.target.value)}
                   placeholder="Digite seus resumos, macetes e pontos importantes aqui. Eles serão salvos automaticamente no seu Bloco de Notas pessoal e ficarão vinculados a este material."
                   className="flex-1 resize-none border-none focus-visible:ring-0 p-4 sm:p-6 text-sm sm:text-base leading-relaxed bg-transparent font-serif text-foreground/90 placeholder:text-muted-foreground/40"
                 />
                 <div className="p-2 bg-muted/20 text-center text-[10px] text-muted-foreground border-t shrink-0">
                    Acesse depois em <strong>Ferramentas {'>'} Bloco de Notas</strong>
                 </div>
               </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ConcurseiroArea;