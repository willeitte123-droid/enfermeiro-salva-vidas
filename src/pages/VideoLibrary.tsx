import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  Play, Search, MonitorPlay, Filter, Youtube, Clock, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { VIDEO_LIBRARY, VideoLesson } from "@/data/videoLibrary";
import FavoriteButton from "@/components/FavoriteButton";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
}

const CATEGORIES = ["Todos", "Destaques", "Urgência e Emergência", "Farmacologia", "Anatomia", "Procedimentos"];

const VideoCard = ({ video, onClick, userId }: { video: VideoLesson; onClick: (v: VideoLesson) => void; userId?: string }) => {
  return (
    <div className="group relative w-[280px] sm:w-[320px] flex-shrink-0 cursor-pointer" onClick={() => onClick(video)}>
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
        
        {/* Badge YouTube */}
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
          <Youtube className="h-3 w-3 text-red-600 fill-red-600" />
          YouTube
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
            {video.duration}
          </div>
        )}

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/50 shadow-lg">
            <Play className="h-5 w-5 text-white fill-white ml-1" />
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

const VideoLibrary = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header Estilo "Explorar" */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Explorar</h1>
          <p className="text-muted-foreground text-lg mt-1">Aulas e conteúdos práticos para sua conexão com o saber.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar aula ou professor..." 
            className="pl-10 rounded-full bg-muted/50 border-transparent focus:bg-background transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtros em Pílulas */}
      <div className="w-full overflow-hidden">
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-2 pb-4">
            {CATEGORIES.map((cat) => (
                <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                    "inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    activeCategory === cat
                    ? "bg-foreground text-background shadow-md scale-105"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                >
                {activeCategory === cat && cat !== "Todos" && <MonitorPlay className="mr-2 h-3.5 w-3.5" />}
                {cat}
                </button>
            ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      </div>

      {/* Conteúdo: Listas Horizontais */}
      <div className="space-y-10">
        {Object.entries(groupedVideos).map(([category, videos]) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground border-l-4 border-primary pl-3">
                {category}
                </h2>
                {activeCategory === "Todos" && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-muted-foreground hover:text-primary"
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
                    onClick={setSelectedVideo} 
                    userId={profile?.id}
                  />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        ))}

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

      {/* Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-4xl p-0 bg-black border-slate-800 overflow-hidden">
            <div className="relative w-full aspect-video bg-black">
                {selectedVideo && (
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
                        title={selectedVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                )}
            </div>
            {selectedVideo && (
                <div className="p-4 sm:p-6 bg-card border-t border-border">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-foreground">{selectedVideo.title}</h2>
                            <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">{selectedVideo.category}</span>
                                <span>•</span>
                                <span>{selectedVideo.author}</span>
                            </p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedVideo(null)} className="shrink-0 rounded-full hover:bg-muted">
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoLibrary;