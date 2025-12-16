import { useState, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  BookOpen, ArrowLeft, Search, Bookmark, 
  Type, Move, Grid, List, Clock, Scale, 
  Gavel, FileText, ChevronUp, ChevronDown, CheckCircle2 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useActivityTracker } from "@/hooks/useActivityTracker";
import libraryData from "@/data/libraryData.json";
import FavoriteButton from "@/components/FavoriteButton";
import { cn } from "@/lib/utils";

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

const DeepStudy = () => {
  const { profile } = useOutletContext<{ profile: Profile | null }>();
  const { addActivity } = useActivityTracker();
  
  // State para navegação
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");
  
  // State para o leitor
  const [fontSize, setFontSize] = useState(16);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    addActivity({ type: 'Estudo', title: 'Biblioteca', path: '/library', icon: 'BookOpen' });
  }, [addActivity]);

  // Handler de Scroll para Barra de Progresso
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
  };

  const filteredDocs = libraryData.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "Todas" || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["Todas", ...Array.from(new Set(libraryData.map(d => d.category)))];

  // LEITOR IMERSIVO
  if (selectedDoc) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in duration-300">
        {/* Barra de Progresso de Leitura */}
        <div className="h-1 w-full bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-100 ease-out" 
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Toolbar do Leitor */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-card/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSelectedDoc(null)} title="Voltar para a estante">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="hidden sm:block">
              <h1 className="font-bold text-sm sm:text-base truncate max-w-[200px] sm:max-w-md">{selectedDoc.title}</h1>
              <p className="text-xs text-muted-foreground">{selectedDoc.category} • {selectedDoc.readTime}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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
                <Button variant="outline" size="icon">
                  <Type className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="space-y-4">
                  <h4 className="font-medium leading-none">Ajustes de Leitura</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>A-</span>
                      <span>Tamanho da Fonte</span>
                      <span>A+</span>
                    </div>
                    <Slider 
                      defaultValue={[fontSize]} 
                      min={12} 
                      max={24} 
                      step={1} 
                      onValueChange={(val) => setFontSize(val[0])} 
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </header>

        {/* Área de Conteúdo */}
        <div 
          className="flex-1 overflow-y-auto" 
          onScroll={handleScroll}
        >
          <div className="max-w-3xl mx-auto px-6 py-10 sm:py-16">
            <div className="mb-8 border-b pb-4">
              <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-4 leading-tight">{selectedDoc.title}</h1>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">{selectedDoc.category}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Leitura estimada: {selectedDoc.readTime}
                </span>
              </div>
            </div>

            <article 
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary prose-strong:text-foreground marker:text-muted-foreground"
              style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
              dangerouslySetInnerHTML={{ __html: selectedDoc.content }}
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