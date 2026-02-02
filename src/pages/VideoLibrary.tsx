import { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Play, Search, MonitorPlay, Youtube, X, 
  SkipBack, SkipForward, ListMusic, Pause, Clock, AlertCircle, Sparkles,
  Gavel, Globe, BookOpen, Heart, ShieldCheck, Layers, ChevronDown, ChevronUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { VIDEO_LIBRARY, VideoLesson } from "@/data/videoLibrary";
import FavoriteButton from "@/components/FavoriteButton";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import YouTube, { YouTubePlayer, YouTubeEvent } from 'react-youtube';
import { useIsMobile } from "@/hooks/use-mobile";

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
    <div 
      className="group relative w-[85vw] sm:w-[300px] md:w-[320px] flex-shrink-0 cursor-pointer snap-start" 
      onClick={onClick}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-md border border-border/50 transition-all duration-300 group-hover:shadow-xl group-hover:ring-2 ring-primary/50">
        <img 
          src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
             (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
          }}
        />
        
        {/* Badge YouTube Destacado */}
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
          <Youtube className="h-3 w-3 fill-white text-white" />
          <span>YouTube</span>
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 z-20 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md flex items-center gap-1">
            <Clock className="h-2.5 w-2.5" />
            {video.duration.replace("Aprox. ", "")}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 z-10" />

        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg scale-90 group-hover:scale-100 transition-transform">
            <Play className="h-5 w-5 fill-current ml-1" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-1">
        <div className="flex justify-between items-start gap-3">
            <h3 className="line-clamp-2 text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors flex-1" title={video.title}>
              {video.title}
            </h3>
            {userId && (
                <div onClick={(e) => e.stopPropagation()} className="shrink-0 -mt-1 -mr-1">
                    <FavoriteButton 
                        userId={userId} 
                        itemId={`video-${video.id}`} 
                        itemType="Vídeo Aula" 
                        itemTitle={video.title}
                        className="h-8 w-8 hover:bg-muted/50"
                    />
                </div>
            )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground font-medium flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0"></div>
          <span className="truncate">{video.author}</span>
        </p>
      </div>
    </div>
  );
};

const PlaylistItem = ({ video, isActive, onClick }: { video: VideoLesson, isActive: boolean, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border group relative overflow-hidden",
        isActive 
          ? "bg-primary/5 border-primary/40" 
          : "bg-card hover:bg-accent/50 border-transparent hover:border-border/50"
      )}
    >
      {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
      
      <div className="relative h-14 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted shadow-sm">
        <img 
          src={`https://img.youtube.com/vi/${video.id}/default.jpg`} 
          alt={video.title}
          className="h-full w-full object-cover"
        />
        {isActive && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="flex gap-0.5 items-end h-3">
               <div className="w-1 bg-white animate-[music-bar_0.6s_ease-in-out_infinite]" />
               <div className="w-1 bg-white animate-[music-bar_0.8s_ease-in-out_infinite_0.1s]" />
               <div className="w-1 bg-white animate-[music-bar_1.0s_ease-in-out_infinite_0.2s]" />
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h4 className={cn("text-xs sm:text-sm font-semibold leading-tight line-clamp-2", isActive ? "text-primary" : "text-foreground group-hover:text-primary transition-colors")}>
          {video.title}
        </h4>
        <p className="text-[10px] sm:text-xs text-muted-foreground truncate mt-0.5">{video.author}</p>
      </div>
    </div>
  )
}

// Miniplayer específico para Mobile
const MobileMiniPlayer = ({ 
    video, 
    onClose, 
    onNext,
    hasNext
}: { 
    video: VideoLesson, 
    onClose: () => void, 
    onNext: () => void,
    hasNext: boolean
}) => {
    return (
        <div className="fixed bottom-4 left-2 right-2 z-[150] animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-card border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col w-full max-w-md mx-auto">
                {/* Área do Vídeo */}
                <div className="relative w-full aspect-video bg-black">
                    <YouTube 
                        videoId={video.id} 
                        opts={{
                            height: '100%',
                            width: '100%',
                            playerVars: {
                                autoplay: 1,
                                playsinline: 1,
                                modestbranding: 1,
                                rel: 0,
                                controls: 1,
                            },
                        }}
                        className="w-full h-full"
                        iframeClassName="w-full h-full absolute inset-0"
                        onEnd={() => hasNext && onNext()}
                    />
                    <button 
                        onClick={onClose}
                        className="absolute -top-3 -right-3 bg-black text-white rounded-full p-2 shadow-md z-20 border border-white/20 active:scale-95 transition-transform"
                        aria-label="Fechar"
                    >
                        <X size={16} />
                    </button>
                </div>
                
                {/* Controles e Info */}
                <div className="p-3 flex items-center justify-between bg-card/95 backdrop-blur-sm">
                    <div className="flex-1 pr-3 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{video.title}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{video.author}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                        {hasNext && (
                            <Button size="icon" variant="ghost" onClick={onNext} className="h-8 w-8 text-foreground hover:bg-muted/50 rounded-full">
                                <SkipForward size={18} />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const VideoLibrary = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const isMobile = useIsMobile();
  
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Estado do Player
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<VideoLesson[]>([]);
  const playerRef = useRef<YouTubePlayer | null>(null);

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

  const onPlayerReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    event.target.playVideo();
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-28 w-full max-w-full overflow-x-hidden">
      
      {/* Header Mobile-First */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-1">
        <div className="space-y-3 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary w-fit uppercase tracking-wider">
            <Sparkles className="h-3 w-3 fill-current" /> Conteúdo Premium
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight">
            Videoteca <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600">Digital</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
            Videoaulas de alta performance selecionadas para sua evolução.
          </p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar aula..." 
            className="pl-10 h-12 rounded-xl bg-card border-border/50 shadow-sm focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros em Pílulas Modernas - Scroll Safe */}
      <div className="w-full -mx-4 px-4 sm:mx-0 sm:px-0">
        <ScrollArea className="w-full whitespace-nowrap pb-2">
            <div className="flex w-max space-x-2 sm:space-x-3 px-1">
            {CATEGORIES.map((cat) => {
                const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES["Todos"];
                const Icon = style.icon;
                const isActive = activeCategory === cat;

                return (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn(
                            "group relative flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 overflow-hidden border",
                            isActive
                            ? `text-white ${style.shadow} shadow-lg scale-105 ring-2 ring-white/20`
                            : "bg-card text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
                        )}
                    >
                        {isActive && (
                            <div className={cn("absolute inset-0 bg-gradient-to-r opacity-100 transition-opacity", style.gradient)} />
                        )}
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
      <div className="space-y-8 sm:space-y-10">
        {Object.entries(groupedVideos).map(([category, videos]) => {
            const style = CATEGORY_STYLES[category] || CATEGORY_STYLES["Todos"];
            return (
                <div key={category} className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <div className={cn("h-6 sm:h-8 w-1 sm:w-1.5 rounded-r-full bg-gradient-to-b", style.gradient)}></div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-foreground line-clamp-1">
                                {category}
                            </h2>
                        </div>
                        {activeCategory === "Todos" && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-xs text-muted-foreground hover:text-primary transition-colors no-underline hover:no-underline pr-0 shrink-0"
                                onClick={() => setActiveCategory(category)}
                            >
                                Ver tudo
                            </Button>
                        )}
                    </div>
                    
                    {/* Lista com Snap Scrolling para Mobile */}
                    <ScrollArea className="w-full whitespace-nowrap rounded-xl -mx-4 sm:mx-0 w-[calc(100%+2rem)] sm:w-full">
                        <div className="flex w-max space-x-3 sm:space-x-4 pb-4 px-4 sm:px-1 snap-x snap-mandatory touch-pan-x">
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
           <div className="flex flex-col items-center justify-center py-24 text-center bg-muted/20 rounded-3xl border border-dashed border-muted mx-1">
             <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
               <MonitorPlay className="h-10 w-10 text-muted-foreground/50" />
             </div>
             <h3 className="text-lg font-bold text-foreground">Nenhuma aula encontrada</h3>
             <p className="text-sm text-muted-foreground max-w-md mx-auto mt-2 px-4">
               Não encontramos vídeos para "{searchTerm}" nesta categoria.
             </p>
             <Button variant="outline" onClick={() => {setSearchTerm(""); setActiveCategory("Todos");}} className="mt-4">
               Limpar filtros
             </Button>
           </div>
        )}
      </div>

      {/* Disclaimer Legal */}
      <div className="mt-12 border-t border-border/40 pt-8 px-1">
        <Alert className="bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
            <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
                <div>
                    <AlertTitle className="text-amber-800 dark:text-amber-200 font-bold text-xs uppercase tracking-wide mb-1">Nota Legal</AlertTitle>
                    <AlertDescription className="text-xs sm:text-sm text-amber-700/90 dark:text-amber-300/90 leading-relaxed font-medium">
                        EnfermagemPro utiliza a tecnologia de incorporação (embed) para reproduzir conteúdos públicos hospedados no YouTube.
                    </AlertDescription>
                </div>
            </div>
        </Alert>
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL: Mobile Miniplayer vs Desktop Dialog */}
      {selectedVideo && (
        isMobile ? (
          <MobileMiniPlayer 
            video={selectedVideo} 
            onClose={() => setSelectedVideo(null)} 
            onNext={handleNext}
            hasNext={currentPlaylist.length > 1}
          />
        ) : (
          <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
            <DialogContent 
                className="max-w-5xl h-[85vh] p-0 gap-0 border-slate-800 bg-black overflow-hidden outline-none flex flex-col"
                onOpenAutoFocus={(e) => e.preventDefault()} 
            >
              <VisuallyHidden.Root>
                <DialogTitle>{selectedVideo?.title || "Video Player"}</DialogTitle>
              </VisuallyHidden.Root>

              {/* VIDEO AREA */}
              <div className="relative w-full aspect-video bg-black shrink-0 shadow-2xl z-20">
                <YouTube
                    videoId={selectedVideo.id}
                    opts={{
                        height: '100%',
                        width: '100%',
                        playerVars: {
                            autoplay: 1,
                            modestbranding: 1,
                            rel: 0,
                        },
                    }}
                    onReady={onPlayerReady}
                    className="absolute inset-0 w-full h-full"
                    iframeClassName="w-full h-full"
                />
                
                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all z-30"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* DESKTOP INFO & PLAYLIST */}
              <div className="bg-card flex flex-col flex-1 min-h-0 overflow-hidden relative z-10">
                <div className="p-4 border-b border-border/50 bg-card shrink-0 flex justify-between gap-4">
                   <div className="flex-1 space-y-1.5">
                      <h2 className="text-xl font-bold leading-tight line-clamp-1" title={selectedVideo.title}>{selectedVideo.title}</h2>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                         <span className="font-semibold text-primary">{selectedVideo.author}</span>
                         <span>•</span>
                         <span>{selectedVideo.category}</span>
                      </div>
                   </div>
                   <div className="flex gap-2">
                       <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentPlaylist.length <= 1}><SkipBack className="h-4 w-4 mr-2" /> Anterior</Button>
                       <Button variant="outline" size="sm" onClick={handleNext} disabled={currentPlaylist.length <= 1}>Próximo <SkipForward className="h-4 w-4 ml-2" /></Button>
                   </div>
                </div>

                <div className="flex-1 flex flex-col bg-muted/10 min-h-0">
                  <div className="px-4 py-2 border-b border-border/50 bg-muted/30 flex items-center gap-2 sticky top-0 backdrop-blur-sm z-10 shrink-0">
                    <ListMusic className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">A seguir na Playlist</span>
                  </div>
                  <ScrollArea className="flex-1 w-full">
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
            </DialogContent>
          </Dialog>
        )
      )}
    </div>
  );
};

export default VideoLibrary;