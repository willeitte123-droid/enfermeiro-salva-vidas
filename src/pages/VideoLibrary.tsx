import { useState, useMemo, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Play, Search, MonitorPlay, Youtube, X, 
  SkipBack, SkipForward, ListMusic, Clock, Sparkles,
  Gavel, Globe, BookOpen, Heart, ShieldCheck, Layers, ChevronUp, ChevronDown, Info, ClipboardList
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"; 
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { VIDEO_LIBRARY, VideoLesson } from "@/data/videoLibrary";
import FavoriteButton from "@/components/FavoriteButton";
import { cn } from "@/lib/utils";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import YouTube, { YouTubePlayer, YouTubeEvent } from 'react-youtube';

interface Profile {
  id: string;
}

const CATEGORIES = [
  "Todos", 
  "Legislação do SUS", 
  "Saúde Pública", 
  "Fundamentos e SAE", 
  "Saúde da Mulher", 
  "Biossegurança e CME",
  "Procedimentos de enfermagem"
];

const CATEGORY_STYLES: Record<string, { icon: any, gradient: string, shadow: string }> = {
  "Todos": { icon: Layers, gradient: "from-slate-700 to-slate-900", shadow: "shadow-slate-500/20" },
  "Legislação do SUS": { icon: Gavel, gradient: "from-blue-600 to-indigo-700", shadow: "shadow-blue-500/30" },
  "Saúde Pública": { icon: Globe, gradient: "from-emerald-500 to-teal-700", shadow: "shadow-emerald-500/30" },
  "Fundamentos e SAE": { icon: BookOpen, gradient: "from-violet-600 to-purple-700", shadow: "shadow-violet-500/30" },
  "Saúde da Mulher": { icon: Heart, gradient: "from-pink-500 to-rose-700", shadow: "shadow-pink-500/30" },
  "Biossegurança e CME": { icon: ShieldCheck, gradient: "from-amber-500 to-orange-700", shadow: "shadow-orange-500/30" },
  "Procedimentos de enfermagem": { icon: ClipboardList, gradient: "from-cyan-600 to-blue-700", shadow: "shadow-cyan-500/30" }
};

const VideoCard = ({ video, onClick, userId }: { video: VideoLesson; onClick: () => void; userId?: string }) => {
  return (
    <div 
      className="group relative w-[260px] sm:w-[320px] flex-shrink-0 cursor-pointer snap-start" 
      onClick={onClick}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-md border border-border/50 transition-all duration-300 group-hover:shadow-xl group-hover:ring-2 ring-primary/50">
        <img 
          src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
          alt={video.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5 rounded-full bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm">
          <Youtube className="h-3 w-3 fill-white text-white" />
          <span>YouTube</span>
        </div>

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

const MiniVideoPlayer = ({ selectedVideo, currentPlaylist, onClose, onNext, onPrev, onVideoChange }: any) => {
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    event.target.playVideo();
  };

  const hasNext = currentPlaylist.length > 0 && currentPlaylist[currentPlaylist.length - 1].id !== selectedVideo.id;
  const hasPrev = currentPlaylist.length > 0 && currentPlaylist[0].id !== selectedVideo.id;

  const handleStateChange = (event: YouTubeEvent) => {
    if (event.data === 0) { onNext(); }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:right-6 sm:left-auto z-[9999] flex flex-col animate-in slide-in-from-bottom-full fade-in duration-500 w-full sm:w-[380px] bg-background sm:rounded-2xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.2)] sm:shadow-2xl border-t sm:border border-border/50 overflow-hidden max-w-[100vw]">
      <div className="relative w-full bg-black group shrink-0">
           <div className="relative w-full pt-[56.25%]"> 
               <div className="absolute inset-0">
                   <YouTube 
                      key={selectedVideo.id}
                      videoId={selectedVideo.id} 
                      opts={{
                          height: '100%',
                          width: '100%',
                          playerVars: {
                              autoplay: 1,
                              controls: 1,
                              modestbranding: 1,
                              rel: 0,
                              playsinline: 1,
                              fs: 1
                          },
                      }} 
                      onReady={onReady}
                      onStateChange={handleStateChange}
                      className="w-full h-full"
                      iframeClassName="w-full h-full"
                   />
               </div>
           </div>
           <button onClick={onClose} className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors z-50 shadow-md backdrop-blur-sm"><X size={16} /></button>
      </div>
      <div className="p-3 bg-card text-card-foreground">
          <div className="flex justify-between items-center mb-2">
              <div className="flex-1 pr-2 overflow-hidden">
                  <p className="text-sm font-bold truncate text-foreground">{selectedVideo.title}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{selectedVideo.author}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="ghost" disabled={!hasPrev} onClick={onPrev} className="h-8 w-8 p-0 hover:bg-muted"><SkipBack size={16} /></Button>
                  <Button size="sm" variant="ghost" disabled={!hasNext} onClick={onNext} className="h-8 w-8 p-0 hover:bg-muted"><SkipForward size={16} /></Button>
              </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border/40">
              <Button variant="ghost" size="sm" onClick={() => setIsPlaylistOpen(!isPlaylistOpen)} className={cn("h-7 px-3 text-xs gap-2 rounded-full transition-all border", isPlaylistOpen ? "bg-primary text-primary-foreground border-primary" : "text-muted-foreground hover:bg-muted border-transparent")}>
                  <ListMusic size={14} /> Playlist {isPlaylistOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              </Button>
              <a href={`https://www.youtube.com/watch?v=${selectedVideo.id}`} target="_blank" rel="noreferrer">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-red-500 transition-colors cursor-pointer font-medium">
                      <Youtube size={14} /> Abrir no App
                  </div>
              </a>
          </div>
      </div>
      {isPlaylistOpen && (
          <div className="w-full bg-muted/30 border-t border-border/50 max-h-48 overflow-hidden flex flex-col">
              <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground font-bold bg-muted/50 border-b border-border/30">A seguir ({currentPlaylist.length})</div>
              <ScrollArea className="flex-1 w-full h-40">
                  <div className="flex flex-col p-1">
                      {currentPlaylist.map((item: VideoLesson, idx: number) => {
                          const isActive = item.id === selectedVideo.id;
                          return (
                              <button key={`${item.id}-${idx}`} onClick={() => onVideoChange(item)} className={cn("flex items-center gap-3 p-2 rounded-lg text-left transition-all group", isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-background border border-transparent")}>
                                  <div className="relative shrink-0 w-8 h-8 rounded overflow-hidden bg-black"><img src={`https://img.youtube.com/vi/${item.id}/default.jpg`} className={cn("w-full h-full object-cover", isActive ? "opacity-60" : "opacity-100")} alt="thumb" /></div>
                                  <div className="flex-1 overflow-hidden"><p className={cn("text-xs font-bold truncate", isActive ? "text-primary" : "text-foreground")}>{item.title}</p></div>
                                  {isActive && <Play size={10} className="text-primary fill-current" />}
                              </button>
                          );
                      })}
                  </div>
              </ScrollArea>
          </div>
      )}
    </div>
  );
};

const DesktopPlayerContent = ({ selectedVideo, currentPlaylist, onClose, onNext, onPrev, onVideoChange, profile }: any) => {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const onReady = (event: YouTubeEvent) => { playerRef.current = event.target; event.target.playVideo(); };
  return (
    <>
      <div className="relative w-full aspect-video bg-black shrink-0 shadow-2xl z-20">
        <YouTube videoId={selectedVideo.id} opts={{ height: '100%', width: '100%', playerVars: { autoplay: 1, playsinline: 1, modestbranding: 1, rel: 0, controls: 1 }}} onReady={onReady} onEnd={onNext} className="absolute inset-0 w-full h-full" iframeClassName="w-full h-full" />
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white backdrop-blur-md transition-all z-30"><X className="h-5 w-5" /></button>
      </div>
      <div className="bg-background sm:bg-card flex flex-col flex-1 min-h-0 overflow-hidden relative z-10">
        <div className="p-4 border-b border-border/50 bg-card shrink-0">
           <div className="flex justify-between gap-4">
              <div className="flex-1 space-y-1.5 min-w-0">
                 <h2 className="text-xl font-bold leading-tight line-clamp-2 pr-2">{selectedVideo.title}</h2>
                 <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span className="font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">{selectedVideo.author}</span><span className="text-border">•</span><span className="bg-muted px-2 py-0.5 rounded">{selectedVideo.category}</span>
                 </div>
              </div>
              {profile && (<div className="shrink-0 pt-0.5"><FavoriteButton userId={profile.id} itemId={`video-${selectedVideo.id}`} itemType="Vídeo Aula" itemTitle={selectedVideo.title} className="h-10 w-10 border bg-muted/20 hover:bg-muted/40" /></div>)}
           </div>
        </div>
        <div className="flex-1 flex flex-col bg-muted/5 min-h-0">
          <div className="px-4 py-2 border-b border-border/50 bg-muted/30 flex items-center gap-2 sticky top-0 backdrop-blur-sm z-10 shrink-0"><ListMusic className="h-3.5 w-3.5 text-primary" /><span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">A seguir ({currentPlaylist.length})</span></div>
          <ScrollArea className="flex-1 w-full"><div className="p-4 space-y-2 pb-safe-area">{currentPlaylist.map((video: VideoLesson) => (<PlaylistItem key={video.id} video={video} isActive={video.id === selectedVideo.id} onClick={() => onVideoChange(video)} />))}</div></ScrollArea>
        </div>
      </div>
    </>
  );
};

const VideoLibrary = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  const [isCompactMode, setIsCompactMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isSmallScreen = window.innerWidth < 1024;
      const userAgent = typeof navigator === 'undefined' ? '' : navigator.userAgent;
      const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      setIsCompactMode(isSmallScreen || isMobileUA);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleVideoChange = (video: VideoLesson) => {
    setSelectedVideo(video);
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
    // Adicionado min-w-0 e flex-col para garantir comportamento correto no flexbox
    <div className="flex flex-col w-full min-w-0 space-y-6 pb-24 overflow-x-hidden">
      
      {/* Header Responsivo - Adicionado min-w-0 nos containers filhos */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pt-4 w-full min-w-0">
        <div className="space-y-3 w-full min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary w-fit uppercase tracking-wider">
            <Sparkles className="h-3 w-3 fill-current" /> Conteúdo Premium
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-tight break-words whitespace-normal">
            Videoteca <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-600">Digital</span>
          </h1>
          
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed break-words">
            Videoaulas de alta performance selecionadas para sua evolução.
          </p>
        </div>
        
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar aula..." 
            className="pl-10 h-12 rounded-xl bg-card border-border/50 shadow-sm focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros - Empilhado no Mobile (multiline wrap) */}
      <div className="w-full min-w-0">
          <div className="w-full">
            <div className="flex flex-wrap gap-2 sm:gap-3">
                {CATEGORIES.map((cat) => {
                    const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES["Todos"];
                    const Icon = style.icon;
                    const isActive = activeCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={cn(
                                "group relative flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 overflow-hidden border shrink-0 flex-1 sm:flex-none justify-center sm:justify-start min-w-[140px]",
                                isActive
                                ? `text-white ${style.shadow} shadow-lg ring-2 ring-white/20`
                                : "bg-card text-muted-foreground border-border/50 hover:border-primary/30 hover:text-foreground"
                            )}
                        >
                            {isActive && <div className={cn("absolute inset-0 bg-gradient-to-r opacity-100 transition-opacity", style.gradient)} />}
                            <span className="relative z-10 flex items-center gap-2">
                                <Icon className={cn("h-4 w-4 transition-transform duration-300", isActive ? "text-white" : "text-muted-foreground group-hover:text-primary")} />
                                <span className="truncate">{cat}</span>
                            </span>
                        </button>
                    );
                })}
            </div>
          </div>
      </div>

      {/* Listas de Vídeos - Containers com min-w-0 */}
      <div className="space-y-8 w-full min-w-0">
        {Object.entries(groupedVideos).map(([category, videos]) => {
            const style = CATEGORY_STYLES[category] || CATEGORY_STYLES["Todos"];
            return (
                <div key={category} className="space-y-3 w-full min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn("h-6 w-1 rounded-r-full bg-gradient-to-b", style.gradient)}></div>
                            <h2 className="text-lg font-bold tracking-tight text-foreground line-clamp-1 break-words">{category}</h2>
                        </div>
                        {activeCategory === "Todos" && (
                            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-primary transition-colors pr-0 shrink-0" onClick={() => setActiveCategory(category)}>
                                Ver tudo
                            </Button>
                        )}
                    </div>
                    {/* Carrossel de Vídeos */}
                    <div className="w-full min-w-0">
                        <div className="w-full overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                            <div className="flex w-max space-x-3 sm:space-x-4">
                                {videos.map((video) => (
                                    <VideoCard key={video.id} video={video} onClick={() => handleOpenVideo(video, videos)} userId={profile?.id} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        })}
      </div>

      {/* Disclaimer Section */}
      <div className="mx-auto w-full max-w-4xl mt-12 p-6 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Info className="h-5 w-5" />
          <p className="text-xs sm:text-sm font-medium leading-relaxed max-w-2xl">
            "EnfermagemPro utiliza a tecnologia de incorporação (embed) para reproduzir conteúdos públicos hospedados no YouTube. Não hospedamos, armazenamos ou comercializamos estes arquivos de mídia. Todos os direitos de propriedade intelectual, visualizações e monetização pertencem exclusivamente aos criadores e às suas respectivas gravadoras."
          </p>
        </div>
      </div>

      {selectedVideo && (
        isCompactMode ? (
          <MiniVideoPlayer 
             selectedVideo={selectedVideo}
             currentPlaylist={currentPlaylist}
             onClose={() => setSelectedVideo(null)}
             onNext={handleNext}
             onPrev={handlePrev}
             onVideoChange={handleVideoChange}
          />
        ) : (
          <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
            <DialogContent 
                className="w-full h-full max-w-none m-0 p-0 border-none bg-black flex flex-col gap-0 rounded-none sm:rounded-lg sm:h-[85vh] sm:w-[90vw] sm:max-w-5xl sm:border sm:border-slate-800 overflow-hidden outline-none z-[150]"
                onOpenAutoFocus={(e) => e.preventDefault()} 
            >
              <VisuallyHidden.Root><DialogTitle>{selectedVideo?.title || "Video Player"}</DialogTitle></VisuallyHidden.Root>
              <DesktopPlayerContent 
                  selectedVideo={selectedVideo} 
                  currentPlaylist={currentPlaylist}
                  onClose={() => setSelectedVideo(null)}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onVideoChange={handleVideoChange}
                  profile={profile}
              />
            </DialogContent>
          </Dialog>
        )
      )}
    </div>
  );
};

export default VideoLibrary;