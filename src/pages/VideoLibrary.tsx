import { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Play, Search, MonitorPlay, Youtube, X, 
  SkipBack, SkipForward, ListMusic, Pause, Clock, AlertCircle, Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { VIDEO_LIBRARY, VideoLesson } from "@/data/videoLibrary";
import FavoriteButton from "@/components/FavoriteButton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
}

// Categorias
const CATEGORIES = [
  "Todos", 
  "Legislação do SUS", 
  "Saúde Pública", 
  "Fundamentos e SAE", 
  "Saúde da Mulher", 
  "Biossegurança e CME"
];

const VideoCard = ({ video, onClick, userId }: { video: VideoLesson; onClick: () => void; userId?: string }) => {
  return (
    <div className="group relative w-[280px] sm:w-[340px] flex-shrink-0 cursor-pointer" onClick={onClick}>
      {/* Thumbnail Container com Efeito Glow no Hover */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900 shadow-md transition-all duration-500 group-hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)] group-hover:scale-[1.02] ring-1 ring-white/10 group-hover:ring-primary/50">
        <img 
          src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
          onError={(e) => {
             (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
          }}
        />
        
        {/* Gradiente Inferior para legibilidade */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Badge Duration */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 rounded-md bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-bold text-white border border-white/10">
            {video.duration}
          </div>
        )}

        {/* Play Overlay Central */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-xl backdrop-blur-sm">
            <Play className="h-6 w-6 ml-1 fill-current" />
          </div>
        </div>
        
        {/* Botão Favorito (Aparece no Hover) */}
        {userId && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
                <FavoriteButton 
                    userId={userId} 
                    itemId={`video-${video.id}`} 
                    itemType="Vídeo Aula" 
                    itemTitle={video.title}
                    className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-md border border-white/10"
                />
            </div>
        )}
      </div>

      {/* Info Minimalista */}
      <div className="mt-3 px-1 space-y-1">
        <h3 className="line-clamp-2 text-sm sm:text-base font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
           <span className="font-medium truncate max-w-[150px]">{video.author}</span>
        </div>
      </div>
    </div>
  );
};

// Item da Playlist (Lateral)
const PlaylistItem = ({ video, isActive, onClick }: { video: VideoLesson, isActive: boolean, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border group",
        isActive 
          ? "bg-primary/10 border-primary/30 shadow-inner" 
          : "bg-transparent border-transparent hover:bg-muted/50 hover:border-border/50"
      )}
    >
      <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-900 shadow-sm group-hover:shadow-md transition-shadow">
        <img 
          src={`https://img.youtube.com/vi/${video.id}/default.jpg`} 
          alt={video.title}
          className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        {isActive && (
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[1px] flex items-center justify-center">
            <ListMusic className="h-4 w-4 text-white animate-pulse" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={cn("text-xs font-semibold truncate leading-tight mb-0.5", isActive ? "text-primary" : "text-foreground group-hover:text-foreground/80")}>
          {video.title}
        </h4>
        <p className="text-[10px] text-muted-foreground truncate">{video.author}</p>
      </div>
    </div>
  )
}

const VideoLibrary = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado do Player
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<VideoLesson[]>([]);

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Biblioteca de Vídeos', path: '/video-library', icon: 'MonitorPlay' });
  }, [addActivity]);

  const filteredVideos = useMemo(() => {
    return VIDEO_LIBRARY.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            video.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "Todos" || video.category === activeCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  // Agrupa por categoria para o modo "Todos"
  const groupedVideos = useMemo(() => {
    if (activeCategory !== "Todos") return { [activeCategory]: filteredVideos };
    
    const groups: Record<string, VideoLesson[]> = {};
    CATEGORIES.filter(c => c !== "Todos").forEach(cat => {
        const vids = filteredVideos.filter(v => v.category === cat);
        if (vids.length > 0) groups[cat] = vids;
    });
    return groups;
  }, [filteredVideos, activeCategory]);

  const handleOpenVideo = (video: VideoLesson, playlist: VideoLesson[]) => {
    setSelectedVideo(video);
    setCurrentPlaylist(playlist);
  };

  const handleNext = () => {
    if (!selectedVideo || currentPlaylist.length === 0) return;
    const currentIndex = currentPlaylist.findIndex(v => v.id === selectedVideo.id);
    const nextIndex = (currentIndex + 1) % currentPlaylist.length;
    setSelectedVideo(currentPlaylist[nextIndex]);
  };

  const handlePrev = () => {
    if (!selectedVideo || currentPlaylist.length === 0) return;
    const currentIndex = currentPlaylist.findIndex(v => v.id === selectedVideo.id);
    const prevIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    setSelectedVideo(currentPlaylist[prevIndex]);
  };

  return (
    <div className="min-h-screen pb-12 animate-in fade-in duration-700 bg-background/50">
      
      {/* 1. Hero Section Imersiva (Cinema Style) */}
      <div className="relative w-full h-[300px] sm:h-[400px] overflow-hidden rounded-b-[2rem] sm:rounded-b-[3rem] shadow-2xl bg-slate-950 mb-8 sm:mb-12 group">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black opacity-80" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-2187d80a1b9a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-[20s]" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-12 z-10 flex flex-col items-start gap-4">
          <Badge variant="outline" className="text-indigo-200 border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md px-3 py-1 text-xs uppercase tracking-widest font-bold">
            <Sparkles className="w-3 h-3 mr-2 text-indigo-400 fill-indigo-400" />
            Acervo Digital
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-xl max-w-3xl leading-none">
            Aprenda com <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">Expertise Visual</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-lg max-w-xl font-medium leading-relaxed drop-shadow-md">
            Uma curadoria de aulas essenciais para sua formação, selecionadas para máxima retenção e aplicação prática.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-20 -mt-8">
        
        {/* 2. Barra de Controle Flutuante (Glassmorphism) */}
        <div className="sticky top-4 z-40 mb-8">
          <div className="bg-background/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl rounded-2xl p-2 sm:p-3 flex flex-col md:flex-row items-center gap-3 sm:gap-4 transition-all">
            
            {/* Search */}
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Buscar aula, tema ou professor..." 
                className="pl-11 h-10 sm:h-12 rounded-xl bg-background/50 border-transparent focus:bg-background focus:border-primary/20 shadow-inner transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Pills */}
            <div className="w-full overflow-hidden">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-2 px-1 py-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300",
                        activeCategory === cat
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent hover:border-border/50"
                      )}
                    >
                      {activeCategory === cat && cat !== "Todos" && <MonitorPlay className="mr-1.5 h-3 w-3" />}
                      {cat}
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* 3. Conteúdo Estilo Streaming */}
        <div className="space-y-12 pb-12">
          {Object.entries(groupedVideos).map(([category, videos]) => (
            <div key={category} className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-1 bg-primary rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    {category}
                    </h2>
                </div>
                {activeCategory === "Todos" && (
                    <Button 
                        variant="link" 
                        size="sm" 
                        className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline hover:no-underline"
                        onClick={() => setActiveCategory(category)}
                    >
                        Ver todos <span className="sr-only">de {category}</span>
                    </Button>
                )}
              </div>
              
              <ScrollArea className="w-full whitespace-nowrap rounded-2xl">
                <div className="flex w-max space-x-4 pb-8 pt-2 px-2">
                  {videos.map((video) => (
                    <VideoCard 
                      key={video.id} 
                      video={video} 
                      onClick={() => handleOpenVideo(video, videos)} 
                      userId={profile?.id}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
              </ScrollArea>
            </div>
          ))}

          {Object.keys(groupedVideos).length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-card/30 rounded-3xl border border-dashed border-muted animate-in zoom-in-95 duration-500">
              <div className="bg-muted/50 p-6 rounded-full mb-6">
                <Search className="h-12 w-12 text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Nenhum resultado encontrado</h3>
              <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
                Não encontramos vídeos correspondentes à sua busca em "{activeCategory}".
              </p>
              <Button variant="outline" onClick={() => {setSearchTerm(""); setActiveCategory("Todos");}} className="mt-6 rounded-full">
                Limpar filtros
              </Button>
            </div>
          )}
        </div>

        {/* 4. Disclaimer Legal (Discreto) */}
        <div className="mt-8 border-t border-border/50 pt-8 opacity-70 hover:opacity-100 transition-opacity">
            <Alert className="bg-muted/20 border-muted-foreground/10 text-muted-foreground max-w-3xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-foreground text-xs font-semibold">Aviso de Direitos Autorais</AlertTitle>
                <AlertDescription className="text-[10px] sm:text-xs mt-1 leading-relaxed">
                    EnfermagemPro utiliza a tecnologia de incorporação (embed) para reproduzir conteúdos públicos hospedados no YouTube.
                    Não hospedamos, armazenamos ou comercializamos estes arquivos de mídia.
                    Todos os direitos de propriedade intelectual, visualizações e monetização pertencem exclusivamente aos criadores e às suas respectivas gravadoras.
                </AlertDescription>
            </Alert>
        </div>
      </div>

      {/* PLAYER MODAL (Netflix Style) */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-[95vw] w-full md:max-w-6xl p-0 bg-slate-950 border-slate-800 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[80vh] shadow-2xl">
          {selectedVideo && (
            <>
              {/* ÁREA DO VÍDEO (Esquerda/Topo) */}
              <div className="flex-1 flex flex-col min-h-0 bg-black relative group/player">
                <div className="relative w-full aspect-video md:h-full bg-black">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
                
                {/* Meta Info Mobile (Aparece abaixo do vídeo no mobile) */}
                <div className="md:hidden p-4 bg-slate-900 border-b border-slate-800">
                    <h2 className="text-base font-bold text-white line-clamp-2 mb-1">{selectedVideo.title}</h2>
                    <p className="text-xs text-slate-400">{selectedVideo.author}</p>
                </div>

                {/* Close Button Floating */}
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-red-600/80 rounded-full text-white backdrop-blur-md transition-all z-20 opacity-0 group-hover/player:opacity-100 md:opacity-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* SIDEBAR DA PLAYLIST (Direita/Baixo) */}
              <div className="w-full md:w-[350px] bg-slate-900 border-l border-slate-800 flex flex-col h-[40vh] md:h-full">
                {/* Info Desktop */}
                <div className="hidden md:block p-6 border-b border-slate-800 bg-slate-950/50">
                    <Badge variant="outline" className="mb-3 border-indigo-500/30 text-indigo-300 bg-indigo-500/10 text-[10px] uppercase tracking-wider">
                        Reproduzindo
                    </Badge>
                    <h2 className="text-xl font-bold text-white leading-tight mb-2">
                      {selectedVideo.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="font-medium text-indigo-400">{selectedVideo.author}</span>
                      <span>•</span>
                      <span>{selectedVideo.duration || "Vídeo"}</span>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 mt-6">
                        <Button variant="secondary" size="sm" onClick={handlePrev} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border-0">
                            <SkipBack className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="sm" onClick={handleNext} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white border-0">
                            <SkipForward className="h-4 w-4" />
                        </Button>
                        {profile && (
                            <div className="flex-shrink-0">
                                <FavoriteButton 
                                    userId={profile.id} 
                                    itemId={`video-${selectedVideo.id}`} 
                                    itemType="Vídeo Aula" 
                                    itemTitle={selectedVideo.title}
                                    className="h-9 w-9 bg-slate-800 border-0 text-slate-300 hover:text-white"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Lista */}
                <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
                  <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                        <ListMusic className="h-3 w-3" /> A seguir ({currentPlaylist.length})
                    </span>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="p-3 space-y-1">
                      {currentPlaylist.map((video) => (
                        <div 
                            key={video.id}
                            onClick={() => setSelectedVideo(video)}
                            className={cn(
                                "flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-all group",
                                video.id === selectedVideo.id 
                                ? "bg-indigo-600/20 border border-indigo-500/30" 
                                : "hover:bg-slate-800 border border-transparent"
                            )}
                        >
                            <div className="relative w-24 aspect-video flex-shrink-0 rounded-md overflow-hidden bg-black">
                                <img 
                                    src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} 
                                    alt="" 
                                    className={cn("w-full h-full object-cover", video.id === selectedVideo.id ? "opacity-50" : "opacity-80 group-hover:opacity-100")}
                                />
                                {video.id === selectedVideo.id && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-3 w-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_10px_#6366f1]" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 py-1">
                                <p className={cn("text-xs font-semibold leading-tight line-clamp-2 mb-1", video.id === selectedVideo.id ? "text-indigo-300" : "text-slate-200 group-hover:text-white")}>
                                    {video.title}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate">{video.author}</p>
                            </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoLibrary;