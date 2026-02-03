import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Loader2, Plus, Edit, Trash2, Eye, EyeOff, Youtube, 
  Search, RefreshCw, Layers, Save, Video, Database, AlertTriangle, CheckCircle, Wrench, Sparkles, Link as LinkIcon, Clipboard
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VideoData {
  id: string;
  youtube_id: string;
  title: string;
  author: string;
  category: string;
  duration: string;
  is_public: boolean;
  created_at?: string;
}

export default function VideoManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Partial<VideoData>>({});
  
  // Estado para link colado
  const [pastedLink, setPastedLink] = useState("");
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  // States para gestão de categorias
  const [categoryAction, setCategoryAction] = useState<'rename' | 'delete'>('rename');
  const [targetCategory, setTargetCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  
  // State para loading do setup
  const [isSettingUp, setIsSettingUp] = useState(false);

  // 1. Buscar Vídeos
  const { data: videos = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ["adminVideos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as VideoData[];
    },
    retry: 1
  });

  const existingCategories = useMemo(() => {
    const cats = new Set(videos.map(v => v.category));
    return Array.from(cats).sort();
  }, [videos]);

  // Função para buscar metadados do YouTube
  const fetchVideoMetadata = async (url: string) => {
    if (!url) return;
    setIsLoadingMetadata(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-youtube-info', {
        body: { url }
      });

      if (error) throw error;

      if (data.valid) {
        setCurrentVideo(prev => ({
          ...prev,
          youtube_id: data.videoId,
          title: data.title,
          author: data.author
        }));
        setPastedLink(`https://youtu.be/${data.videoId}`);
        toast.success("Dados do vídeo importados!");
      } else {
        toast.error("Vídeo não encontrado ou inválido.");
      }
    } catch (err: any) {
      console.error(err);
      // Tenta extrair ao menos o ID localmente se a API falhar
      const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/))([^"&?\/\s]{11})/);
      if (videoIdMatch) {
         setCurrentVideo(prev => ({ ...prev, youtube_id: videoIdMatch[1] }));
         toast.warning("Dados não carregados, mas ID extraído.");
      } else {
         toast.error("Link inválido.");
      }
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setPastedLink(text);
        // Opcional: já tenta importar se parecer um link válido
        if (text.includes("youtube") || text.includes("youtu.be")) {
           toast.info("Link colado! Clique em Importar.");
        }
      }
    } catch (err) {
      toast.error("Não foi possível acessar a área de transferência. Tente Ctrl+V.");
    }
  };

  // Função para Reparar/Configurar Banco de Dados
  const handleSetupDatabase = async () => {
    setIsSettingUp(true);
    const toastId = toast.loading("Configurando banco de dados e restaurando vídeos...");
    
    try {
      const { data, error } = await supabase.functions.invoke('setup-database');
      if (error) throw error;
      
      if (data.success) {
        toast.success(data.message, { id: toastId });
        await queryClient.invalidateQueries({ queryKey: ["adminVideos"] });
        await refetch();
      } else {
        throw new Error(data.error || "Erro desconhecido ao configurar.");
      }
    } catch (err: any) {
      toast.error("Falha na configuração: " + err.message, { id: toastId });
    } finally {
      setIsSettingUp(false);
    }
  };

  const saveVideoMutation = useMutation({
    mutationFn: async (video: Partial<VideoData>) => {
      if (!video.youtube_id || !video.title || !video.category) {
         throw new Error("Preencha os campos obrigatórios (Link, Título, Categoria)");
      }

      if (video.id) {
        const { error } = await supabase.from("videos").update({
          youtube_id: video.youtube_id,
          title: video.title,
          author: video.author,
          category: video.category,
          duration: video.duration,
          is_public: video.is_public
        }).eq("id", video.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("videos").insert({
          youtube_id: video.youtube_id,
          title: video.title,
          author: video.author,
          category: video.category,
          duration: video.duration,
          is_public: video.is_public ?? true
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? "Vídeo atualizado!" : "Vídeo adicionado!");
      queryClient.invalidateQueries({ queryKey: ["adminVideos"] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (err) => toast.error("Erro ao salvar: " + err.message)
  });

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("videos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Vídeo excluído.");
      queryClient.invalidateQueries({ queryKey: ["adminVideos"] });
    },
    onError: (err) => toast.error("Erro ao excluir: " + err.message)
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: async ({ id, is_public }: { id: string, is_public: boolean }) => {
      const { error } = await supabase.from("videos").update({ is_public }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminVideos"] });
      toast.success("Visibilidade alterada.");
    },
    onError: (err) => toast.error("Erro: " + err.message)
  });

  const manageCategoryMutation = useMutation({
    mutationFn: async () => {
      if (categoryAction === 'rename') {
        if (!targetCategory || !newCategoryName) throw new Error("Preencha os campos");
        const { error } = await supabase
          .from("videos")
          .update({ category: newCategoryName })
          .eq("category", targetCategory);
        if (error) throw error;
      } else {
        if (!targetCategory) throw new Error("Selecione uma categoria");
        const { error } = await supabase
          .from("videos")
          .delete()
          .eq("category", targetCategory);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(categoryAction === 'rename' ? "Categoria renomeada!" : "Categoria e vídeos excluídos!");
      queryClient.invalidateQueries({ queryKey: ["adminVideos"] });
      setIsCategoryDialogOpen(false);
      setNewCategoryName("");
      setTargetCategory("");
    },
    onError: (err) => toast.error("Erro: " + err.message)
  });

  const resetForm = () => {
    setCurrentVideo({ is_public: true, category: "Geral" });
    setPastedLink("");
    setIsEditing(false);
  };

  const openNewVideo = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditVideo = (video: VideoData) => {
    setCurrentVideo(video);
    setPastedLink(`https://youtu.be/${video.youtube_id}`);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* ERROR HANDLER / SETUP BUTTON */}
      {isError && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200 animate-in fade-in slide-in-from-top-4">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Atenção: Banco de Dados Não Detectado</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-4">
            <p className="text-sm">A tabela de vídeos não foi encontrada no sistema. Isso é normal na primeira configuração.</p>
            <Button 
              onClick={handleSetupDatabase} 
              disabled={isSettingUp}
              className="w-fit bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg"
            >
              {isSettingUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wrench className="mr-2 h-4 w-4" />}
              {isSettingUp ? "Configurando..." : "Reparar Banco de Dados e Restaurar Vídeos"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* SUCCESS STATE BUT EMPTY */}
      {!isError && videos.length === 0 && !isLoading && (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-200">
          <Database className="h-4 w-4" />
          <AlertTitle>Tabela de Vídeos Vazia</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-3">
            <p>A tabela existe mas não tem vídeos. Você pode restaurar os vídeos originais agora.</p>
            <Button 
              onClick={handleSetupDatabase} 
              disabled={isSettingUp}
              variant="outline" 
              className="w-fit bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              {isSettingUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Restaurar Vídeos Padrão
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Video className="h-6 w-6 text-primary" /> Gestão da Videoteca
          </h2>
          <p className="text-sm text-muted-foreground">Adicione aulas, organize categorias e controle o acesso.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)} className="flex-1 sm:flex-none" disabled={isError}>
            <Layers className="mr-2 h-4 w-4" /> Categorias
          </Button>
          <Button onClick={openNewVideo} className="flex-1 sm:flex-none" disabled={isError}>
            <Plus className="mr-2 h-4 w-4" /> Novo Vídeo
          </Button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Buscar por título ou categoria..." 
          className="border-none shadow-none focus-visible:ring-0"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          disabled={isError}
        />
      </div>

      {/* Lista de Vídeos */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
        ) : isError ? (
          <div className="p-12 text-center text-muted-foreground bg-muted/20">
            <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
            <p>Conexão com banco de dados não estabelecida.</p>
            <p className="text-sm mt-2">Utilize o botão de reparo acima.</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Nenhum vídeo encontrado.</div>
        ) : (
          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[80px]">Capa</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Categoria</TableHead>
                  <TableHead className="hidden sm:table-cell">Autor</TableHead>
                  <TableHead>Visibilidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVideos.map((video) => (
                  <TableRow key={video.id} className="group">
                    <TableCell>
                      <div className="w-16 h-9 bg-black rounded overflow-hidden relative">
                        <img 
                          src={`https://img.youtube.com/vi/${video.youtube_id}/default.jpg`} 
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium line-clamp-2 text-sm">{video.title}</div>
                      <div className="md:hidden text-xs text-muted-foreground mt-1">{video.category}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{video.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {video.author}
                    </TableCell>
                    <TableCell>
                      <button 
                        onClick={() => toggleVisibilityMutation.mutate({ id: video.id, is_public: !video.is_public })}
                        className={cn(
                          "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold transition-all",
                          video.is_public 
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300" 
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
                        )}
                      >
                        {video.is_public ? <><Eye className="h-3 w-3" /> Público</> : <><EyeOff className="h-3 w-3" /> Privado</>}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditVideo(video)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            if(confirm("Tem certeza que deseja excluir este vídeo?")) deleteVideoMutation.mutate(video.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </div>

      {/* DIALOG: NOVO/EDITAR VÍDEO (REFORMULADO) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl w-[95vw] rounded-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
               {isEditing ? <Edit className="h-5 w-5 text-primary"/> : <Plus className="h-5 w-5 text-primary"/>}
               {isEditing ? "Editar Vídeo" : "Adicionar Novo Vídeo"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            
            {/* SEÇÃO PRINCIPAL: LINK */}
            <div className="space-y-2">
              <Label className="text-sm font-bold flex items-center gap-2">
                 <LinkIcon className="h-4 w-4 text-red-500" /> Link do YouTube
              </Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex flex-1 gap-2">
                    <Input 
                      value={pastedLink} 
                      onChange={e => {
                        setPastedLink(e.target.value);
                        if(!e.target.value) setCurrentVideo(prev => ({ ...prev, youtube_id: "" }));
                      }}
                      className="flex-1 min-w-0" 
                      placeholder="Cole aqui: https://www.youtube.com/watch?v=..."
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      size="icon"
                      title="Colar"
                      onClick={handlePasteFromClipboard}
                      className="shrink-0"
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                </div>
                <Button 
                   type="button" 
                   onClick={() => fetchVideoMetadata(pastedLink)}
                   disabled={isLoadingMetadata || !pastedLink}
                   className="sm:w-auto w-full min-w-[100px] shrink-0"
                >
                   {isLoadingMetadata ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Sparkles className="h-4 w-4 mr-2 text-yellow-300"/>}
                   {isLoadingMetadata ? "..." : "Importar"}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground">
                 Dica: Cole o link e clique em "Importar" para preencher automaticamente.
              </p>
            </div>

            {/* PREVIEW SE TIVER ID */}
            {currentVideo.youtube_id && (
               <div className="bg-muted/30 p-3 rounded-lg border flex flex-col sm:flex-row items-start gap-4 animate-in fade-in zoom-in duration-300">
                   <div className="w-full sm:w-32 h-32 sm:h-20 bg-black rounded overflow-hidden shrink-0 shadow-sm border border-border/50">
                      <img src={`https://img.youtube.com/vi/${currentVideo.youtube_id}/mqdefault.jpg`} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0 py-1">
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Preview</p>
                      <p className="text-sm font-medium truncate">{currentVideo.title || "Sem título..."}</p>
                      <p className="text-xs text-muted-foreground mt-1">{currentVideo.author || "Autor desconhecido"}</p>
                   </div>
               </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Título do Vídeo</Label>
                    <Input 
                        value={currentVideo.title || ""} 
                        onChange={e => setCurrentVideo({...currentVideo, title: e.target.value})}
                        placeholder="Título principal"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Autor / Canal</Label>
                    <Input 
                        value={currentVideo.author || ""} 
                        onChange={e => setCurrentVideo({...currentVideo, author: e.target.value})}
                        placeholder="Nome do canal"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Categoria</Label>
                    <div className="flex gap-2">
                        <Select 
                            value={currentVideo.category} 
                            onValueChange={val => setCurrentVideo({...currentVideo, category: val})}
                        >
                            <SelectTrigger className="flex-1">
                            <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                            {existingCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Input manual para nova categoria se não selecionar */}
                    <Input 
                        placeholder="Ou digite nova categoria..." 
                        className="text-xs mt-1"
                        onChange={e => setCurrentVideo({...currentVideo, category: e.target.value})}
                        value={!existingCategories.includes(currentVideo.category || "") ? currentVideo.category : ""}
                    />
                </div>
                
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Duração Estimada</Label>
                        <Input 
                            value={currentVideo.duration || ""} 
                            onChange={e => setCurrentVideo({...currentVideo, duration: e.target.value})}
                            placeholder="Ex: Aprox. 20 min"
                        />
                    </div>
                    <div className="flex items-center justify-between bg-muted/30 p-2 rounded-lg border">
                        <Label className="cursor-pointer">Visibilidade Pública</Label>
                        <Switch 
                            checked={currentVideo.is_public} 
                            onCheckedChange={checked => setCurrentVideo({...currentVideo, is_public: checked})} 
                        />
                    </div>
                </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveVideoMutation.mutate(currentVideo)} disabled={saveVideoMutation.isPending || !currentVideo.youtube_id}>
              {saveVideoMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar Vídeo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: GERENCIAR CATEGORIAS */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="w-[95vw] max-w-lg rounded-lg">
          <DialogHeader>
            <DialogTitle>Gerenciar Categorias</DialogTitle>
            <DialogDescription>
              Ações em lote. Cuidado: Excluir uma categoria apaga todos os vídeos dela.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="rename" onValueChange={(val) => setCategoryAction(val as any)}>
             <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="rename">Renomear</TabsTrigger>
                <TabsTrigger value="delete" className="text-destructive data-[state=active]:text-destructive">Excluir</TabsTrigger>
             </TabsList>
             
             <div className="py-4 space-y-4">
                <div className="space-y-2">
                   <Label>Categoria Alvo</Label>
                   <Select value={targetCategory} onValueChange={setTargetCategory}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                         {existingCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                   </Select>
                </div>

                {categoryAction === 'rename' && (
                   <div className="space-y-2">
                      <Label>Novo Nome</Label>
                      <Input 
                        value={newCategoryName} 
                        onChange={e => setNewCategoryName(e.target.value)} 
                        placeholder="Digite o novo nome..."
                      />
                   </div>
                )}

                {categoryAction === 'delete' && targetCategory && (
                   <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm border border-red-200 dark:border-red-900">
                      <p className="font-bold flex items-center gap-2"><Trash2 className="h-4 w-4"/> Atenção!</p>
                      <p>Isso excluirá permanentemente todos os vídeos da categoria <strong>"{targetCategory}"</strong>.</p>
                   </div>
                )}
             </div>
          </Tabs>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancelar</Button>
            <Button 
               variant={categoryAction === 'delete' ? "destructive" : "default"}
               onClick={() => manageCategoryMutation.mutate()}
               disabled={manageCategoryMutation.isPending || !targetCategory}
            >
              {manageCategoryMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {categoryAction === 'rename' ? "Renomear Categoria" : "Excluir Categoria e Vídeos"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}