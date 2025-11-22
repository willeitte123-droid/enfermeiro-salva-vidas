import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Workflow, BookOpen } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import FavoriteButton from "@/components/FavoriteButton";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import { MindMapRenderer, MindMapNode } from "@/components/MindMapRenderer";
import mindMapsData from "@/data/mindMaps.json";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
}

interface MindMap {
  id: string;
  title: string;
  category: string;
  description: string;
  root: MindMapNode;
}

const mindMaps: MindMap[] = mindMapsData;

const MindMaps = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { addActivity } = useActivityTracker();

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Mapas Mentais', path: '/mind-maps', icon: 'Workflow' });
  }, [addActivity]);

  const categories = useMemo(() => {
    const cats = new Set(mindMaps.map(m => m.category));
    return ["Todos", ...Array.from(cats)];
  }, []);

  const filteredMaps = useMemo(() => {
    return mindMaps.filter(map => {
      const matchesSearch = 
        map.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        map.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "Todos" || map.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="space-y-6">
      <div className="text-center px-2">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">Mapas Mentais</h1>
          {profile && (
            <FavoriteButton
              userId={profile.id}
              itemId="/mind-maps"
              itemType="Guia"
              itemTitle="Mapas Mentais"
            />
          )}
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">Resumos visuais para facilitar a fixação de conteúdos complexos.</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar mapa mental..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <ScrollArea className="w-full whitespace-nowrap rounded-md border bg-card p-2 shadow-sm max-w-[100vw]">
          <div className="flex w-max space-x-2 p-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {filteredMaps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaps.map((map) => (
            <Dialog key={map.id}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg group-hover:text-primary transition-colors">
                      <Workflow className="h-5 w-5" />
                      {map.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">{map.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-end">
                    <div className="w-full p-2 bg-muted/50 rounded-md flex items-center justify-center text-xs text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                      <BookOpen className="h-3 w-3 mr-1.5" />
                      Clique para visualizar
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Workflow className="h-6 w-6 text-primary" />
                    {map.title}
                  </DialogTitle>
                  <p className="text-muted-foreground text-sm">{map.description}</p>
                </DialogHeader>
                <div className="mt-4">
                  <MindMapRenderer data={map.root} />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum mapa mental encontrado para "{searchTerm}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MindMaps;