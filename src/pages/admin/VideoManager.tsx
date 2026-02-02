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
  Search, RefreshCw, Layers, Save, Video, Database, AlertTriangle, CheckCircle
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
  
  // States para gestão de categorias
  const [categoryAction, setCategoryAction] = useState<'rename' | 'delete'>('rename');
  const [targetCategory, setTargetCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

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

  const saveVideoMutation = useMutation({
    mutationFn: async (video: Partial<VideoData>) => {
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

  // Configurar Banco de Dados e Restaurar Vídeos
  const setupDatabase = async () => {
    const toastId = toast.loading("Configurando e restaurando vídeos...");
    try {
      const { data, error } = await supabase.functions.invoke('setup-database');
      if (error) throw error;
      
      if (data.success) {
        toast.success(data.message, { id: toastId });
        refetch(); // Recarrega a lista para mostrar os vídeos restaurados
      } else {
        throw new Error(data.error || "Erro desconhecido");
      }
    } catch (err: any) {
      toast.error("Falha ao configurar: " + err.message, { id: toastId });
    }
  };

  const resetForm = () => {
    setCurrentVideo({ is_public: true, category: "Geral" });
    setIsEditing(false);
  };

  const openNewVideo = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditVideo = (video: VideoData) => {
    setCurrentVideo(video);
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
        <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Banco de Dados Não Detectado</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-3">
            <p>A tabela de vídeos ainda não existe no seu banco de dados Supabase.</p>
            <Button 
              onClick={setupDatabase} 
              variant="outline" 
              className="w-fit bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <Database className="mr-2 h-4 w-4" /> Criar Tabela e Restaurar Vídeos
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* SUCCESS STATE BUT EMPTY */}
      {!isError && videos.length === 0 && !isLoading && (
        <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-200">
          <Database className="h-4 w-4" />
          <AlertTitle>Tabela Vazia</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-3">
            <p>A tabela existe mas não tem vídeos. Você pode restaurar os vídeos originais agora.</p>
            <Button 
              onClick={setupDatabase} 
              variant="outline" 
              className="w-fit bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Restaurar Vídeos Padrão
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
          <div className="p-12 text-center text-muted-foreground">Aguardando configuração...</div>
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

      {/* DIALOG: NOVO/EDITAR VÍDEO */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Vídeo" : "Adicionar Novo Vídeo"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">ID YouTube</Label>
              <Input 
                value={currentVideo.youtube_id || ""} 
                onChange={e => setCurrentVideo({...currentVideo, youtube_id: e.target.value})}
                className="col-span-3" 
                placeholder="Ex: jHMqEVgDjd8"
              />
            </div>
            {currentVideo.youtube_id && (
               <div className="grid grid-cols-4 items-center gap-4">
                 <div className="col-start-2 col-span-3">
                    <div className="w-32 h-20 bg-muted rounded overflow-hidden border">
                       <img src={`https://img.youtube.com/vi/${currentVideo.youtube_id}/mqdefault.jpg`} className="w-full h-full object-cover" />
                    </div>
                 </div>
               </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Título</Label>
              <Input 
                value={currentVideo.title || ""} 
                onChange={e => setCurrentVideo({...currentVideo, title: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Categoria</Label>
              <div className="col-span-3 flex gap-2">
                 <Select 
                    value={currentVideo.category} 
                    onValueChange={val => setCurrentVideo({...currentVideo, category: val})}
                 >
                    <SelectTrigger className="w-full">
                       <SelectValue placeholder="Selecione ou digite..." />
                    </SelectTrigger>
                    <SelectContent>
                       {existingCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                 </Select>
                 <Input 
                    placeholder="Nova categoria..." 
                    className="w-1/2"
                    onChange={e => setCurrentVideo({...currentVideo, category: e.target.value})}
                    value={!existingCategories.includes(currentVideo.category || "") ? currentVideo.category : ""}
                 />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Autor/Canal</Label>
              <Input 
                value={currentVideo.author || ""} 
                onChange={e => setCurrentVideo({...currentVideo, author: e.target.value})}
                className="col-span-3" 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Duração</Label>
              <Input 
                value={currentVideo.duration || ""} 
                onChange={e => setCurrentVideo({...currentVideo, duration: e.target.value})}
                className="col-span-3" 
                placeholder="Ex: Aprox. 20 min"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Visibilidade</Label>
              <div className="col-span-3 flex items-center gap-2">
                 <Switch 
                    checked={currentVideo.is_public} 
                    onCheckedChange={checked => setCurrentVideo({...currentVideo, is_public: checked})} 
                 />
                 <span className="text-sm text-muted-foreground">{currentVideo.is_public ? "Público (Todos veem)" : "Privado (Só Admins veem)"}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveVideoMutation.mutate(currentVideo)} disabled={saveVideoMutation.isPending}>
              {saveVideoMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DIALOG: GERENCIAR CATEGORIAS */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
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

          <DialogFooter>
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