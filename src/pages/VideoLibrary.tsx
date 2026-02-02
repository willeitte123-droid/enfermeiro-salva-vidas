import { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Play, Search, MonitorPlay, Youtube, X, 
  SkipBack, SkipForward, ListMusic, Pause, Clock, AlertCircle, Sparkles,
  Gavel, Globe, BookOpen, Heart, ShieldCheck, Layers
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

// Categorias atualizadas
const CATEGORIES = [
  "Todos", 
  "Legislação do SUS", 
  "Saúde Pública", 
  "Fundamentos e SAE", 
  "Saúde da Mulher", 
  "Biossegurança e CME"
];

// Configuração Visual das Categorias
const CATEGORY_STYLES: Record<string, { icon: any, gradient: string, shadow: string }> = {
  "Todos": { 
    icon: Layers, 
    gradient: "from-slate-700 to-slate-900",
    shadow: "shadow-slate-500/20"
  },
  "Legislação do SUS": { 
    icon: Gavel, 
    gradient: "from-blue-600 to-indigo-700",
    shadow: "shadow-blue-500/30"
  },
  "Saúde Pública": { 
    icon: Globe, 
    gradient: "from-emerald-500 to-teal-700",
    shadow: "shadow-emerald-500/30"
  },
  "Fundamentos e SAE": { 
    icon: BookOpen, 
    gradient: "from-violet-600 to-purple-700",
    shadow: "shadow-violet-500/30"
  },
  "Saúde da Mulher": { 
    icon: Heart, 
    gradient: "from-pink-500 to-rose-700",
    shadow: "shadow-pink-500/30"
  },
  "Biossegurança e CME": { 
    icon: ShieldCheck, 
    gradient: "from-amber-500 to-orange-700",
    shadow: "shadow-orange-500/30"
  }
};

const VideoCard = ({ video, onClick, userId }: { video: VideoLesson; onClick: () => void; userId?: string }) => {
  return (
    <div className="group relative w-[280px] sm:w-[320px] flex-shrink-0 cursor-pointer" onClick={onClick}>
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-md transition-all duration-300 group-hover:shadow-xl group-hover:ring-2 ring-primary/50">
        <img 
          src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
             // Fallback se maxresdefault não existir
             (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
          }}
        />
        
        {/* Badge YouTube Destacado */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
          <Youtube className="h-3.5 w-3.5 fill-white text-white" />
          YouTube
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 z-20 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
            {video.duration}
          </div>
        )}

        {/* Gradiente Inferior para legibilidade */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-60 z-10" />

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-20">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg scale-90 group-hover:scale-100 transition-transform">
            <Play className="h-5 w-5 fill-current ml-1" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-1">
        <div className="flex justify-between items-start gap-2">
            <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
            {video.title}
            </h3>
            {userId && (
                <div onClick={(e) => e.stopPropagation()}>
                    <FavoriteButton 
                        userId={userId} 
                        itemId={`video-${video.id}`} 
                        itemType="Vídeo Aula" 
                        itemTitle={video.title}
                        className="h-6 w-6"
                    />
                </div>
            )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground font-medium">{video.author}</p>
      </div>
    </div>
  );
};

// Item da Playlist (Lista Lateral/Inferior)
const PlaylistItem = ({ video, isActive, onClick }: { video: VideoLesson, isActive: boolean, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border group",
        isActive 
          ? "bg-primary/10 border-primary/50" 
          : "bg-card hover:bg-accent border-transparent hover:border-border"
      )}
    >
      <div className="relative h-12 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <img 
          src={`https://img.youtube.com/vi/${video.id}/default.jpg`} 
          alt={video.title}
          className="h-full w-full object-cover"
        />
        {isActive && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={cn("text-xs font-semibold truncate", isActive ? "text-primary" : "text-foreground group-hover:text-primary transition-colors")}>
          {video.title}
        </h4>
        <p className="text-[10px] text-muted-foreground truncate">{video.author}</p>
      </div>
      {isActive && <MonitorPlay className="h-4 w-4 text-primary" />}
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
    // Garante a ordem das categorias
    CATEGORIES.filter(c => c !== "Todos").forEach(cat => {
        const vids = filteredVideos.filter(v => v.category === cat);
        if (vids.length > 0) groups[cat] = vids;
    });
    return groups;
  }, [filteredVideos, activeCategory]);

  // Handlers do Player
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
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header Estilo "Moderno/Profissional" */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary w-fit">
            <Sparkles className="h-3 w-3 fill-current" /> Acervo Premium
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Videoteca <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600">Digital</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl leading-relaxed">
            Videoaulas de alta performance: da legislação à prática assistencial.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar aula ou professor..." 
            className="pl-10 h-11 rounded-xl bg-muted/50 border-transparent shadow-sm focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros em Pílulas Modernas */}
      <div className="w-full overflow-hidden py-2">
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-3 pb-2 px-1">
            {CATEGORIES.map((cat) => {
                const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES["Todos"];
                const Icon = style.icon;
                const isActive = activeCategory === cat;

                return (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "group relative flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 overflow-hidden border border-transparent",
                            isActive
                            ? `text-white ${style.shadow} shadow-lg scale-105 ring-2 ring-white/20`
                            : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground hover:border-border/50"
                        )}
                    >
                        {/* Background Ativo (Gradiente) */}
                        {isActive && (
                            <div className={cn("absolute inset-0 bg-gradient-to-r opacity-100 transition-opacity", style.gradient)} />
                        )}
                        
                        {/* Background Hover (Sutil) */}
                        {!isActive && (
                           <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}

                        <span className="relative z-10 flex items-center gap-2">
                            <Icon className={cn("h-4 w-4 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                            {cat}
                        </span>
                    </button>
                );
            })}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      {/* Conteúdo: Listas Horizontais */}
      <div className="space-y-10">
        {Object.entries(groupedVideos).map(([category, videos]) => {
            const style = CATEGORY_STYLES[category] || CATEGORY_STYLES["Todos"];
            return (
                <div key={category} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn("h-8 w-1.5 rounded-r-full bg-gradient-to-b", style.gradient)}></div>
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                                {category}
                            </h2>
                        </div>
                        {activeCategory === "Todos" && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline hover:no-underline"
                                onClick={() => setActiveCategory(category)}
                            >
                                Ver tudo
                            </Button>
                        )}
                    </div>
                    
                    <ScrollArea className="w-full whitespace-nowrap rounded-xl">
                    <div className="flex w-max space-x-4 pb-4 px-1">
                        {videos.map((video) => (
                        <VideoCard 
                            key={video.id} 
                            video={video} 
                            onClick={() => handleOpenVideo(video, videos)} 
                            userId={profile?.id}
                        />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </div>
            );
        })}

        {Object.keys(groupedVideos).length === 0 && (
           <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-2xl border border-dashed border-muted">
             <div className="bg-muted p-4 rounded-full mb-4">
               <MonitorPlay className="h-8 w-8 text-muted-foreground opacity-50" />
             </div>
             <h3 className="text-lg font-bold text-foreground">Nenhum vídeo encontrado</h3>
             <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2">
               Tente ajustar sua busca ou mudar a categoria.
             </p>
             <Button variant="link" onClick={() => {setSearchTerm(""); setActiveCategory("Todos");}} className="mt-2 text-primary">
               Limpar filtros
             </Button>
           </div>
        )}
      </div>

      {/* Disclaimer Legal com Destaque */}
      <div className="mt-12 border-t border-border/40 pt-8">
        <Alert className="bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                <div>
                    <AlertTitle className="text-amber-800 dark:text-amber-200 font-bold mb-1">Aviso de Direitos Autorais</AlertTitle>
                    <AlertDescription className="text-xs sm:text-sm text-amber-700/90 dark:text-amber-300/90 leading-relaxed font-medium">
                        EnfermagemPro utiliza a tecnologia de incorporação (embed) para reproduzir conteúdos públicos hospedados no YouTube.
                        Não hospedamos, armazenamos ou comercializamos estes arquivos de mídia.
                        Todos os direitos de propriedade intelectual, visualizações e monetização pertencem exclusivamente aos criadores e às suas respectivas gravadoras.
                    </AlertDescription>
                </div>
            </div>
        </Alert>
      </div>

      {/* NOVO PLAYER MODAL ESTILO NETFLIX/YOUTUBE */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 bg-black border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
          {selectedVideo && (
            <>
              {/* VIDEO AREA */}
              <div className="relative w-full aspect-video bg-black shrink-0">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all z-20"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* CONTROLS & INFO */}
              <div className="bg-card border-t border-border flex flex-col flex-1 min-h-0">
                {/* Meta Info Bar */}
                <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/50 shrink-0">
                  <div className="space-y-1 flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-foreground leading-tight line-clamp-1" title={selectedVideo.title}>
                      {selectedVideo.title}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-primary">{selectedVideo.author}</span>
                      <span>•</span>
                      <span>{selectedVideo.category}</span>
                      {selectedVideo.duration && (
                        <>
                           <span>•</span>
                           <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {selectedVideo.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Player Controls */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <Button variant="outline" size="icon" onClick={handlePrev} title="Anterior">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNext} title="Próximo">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    {profile && (
                        <FavoriteButton 
                            userId={profile.id} 
                            itemId={`video-${selectedVideo.id}`} 
                            itemType="Vídeo Aula" 
                            itemTitle={selectedVideo.title}
                            className="h-10 w-10 border rounded-md"
                        />
                    )}
                  </div>
                </div>

                {/* Playlist Section */}
                <div className="flex-1 min-h-0 flex flex-col bg-muted/10">
                  <div className="px-4 py-2 border-b border-border/50 bg-muted/20 flex items-center gap-2">
                    <ListMusic className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Fila de Reprodução ({currentPlaylist.length})</span>
                  </div>
                  
                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-2">
                      {currentPlaylist.map((video) => (
                        <PlaylistItem 
                          key={video.id} 
                          video={video} 
                          isActive={video.id === selectedVideo.id}
                          onClick={() => setSelectedVideo(video)}
                        />
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