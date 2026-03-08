import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Edit, Trash2, FileText, Upload, Download, FileDown, Wrench, AlertTriangle, Sparkles, Globe, Search, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

// Categorias padrão sugeridas
const DEFAULT_CATEGORIES = [
  "Legislação do SUS", "Urgência e Emergência", "Fundamentos de Enfermagem", 
  "Saúde Pública", "Saúde da Mulher", "Saúde da Criança", "Ética e Legislação"
];

export default function MaterialsManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Estado do formulário
  const [currentMaterial, setCurrentMaterial] = useState<Partial<StudyMaterial>>({ 
    category: "Legislação do SUS", 
    is_premium: true 
  });
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  
  // Estado para controlar se o usuário quer digitar uma categoria nova
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  const { data: materials = [], isLoading, isError } = useQuery({
    queryKey: ["adminMaterials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("study_materials").select("*").order("created_at", { ascending: false });
      if (error) throw error; // Dispara o erro para mostrar a tela de instalação
      return (data || []) as StudyMaterial[];
    },
    retry: false
  });

  // Junta as categorias padrão com as categorias que já existem no banco
  const allCategories = useMemo(() => {
    const dbCategories = materials.map(m => m.category);
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...dbCategories])).sort();
  }, [materials]);

  const handleInstallDatabase = async () => {
    setIsInstalling(true);
    const toastId = toast.loading("Criando tabelas e pastas de armazenamento...");
    try {
      const { data, error } = await supabase.functions.invoke('install-schema');
      if (error) throw new Error(error.message);
      toast.success("Tudo pronto! Banco de dados configurado.", { id: toastId });
      // Força um reload para limpar erros de cache do React Query
      setTimeout(() => window.location.reload(), 1500);
    } catch (err: any) {
      toast.error("Erro: " + err.message, { id: toastId });
      setIsInstalling(false);
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      setIsUploading(true);
      let fileUrl = currentMaterial.file_url;
      let fileSize = currentMaterial.file_size;

      // 1. Lógica de Upload do Arquivo (Se houver arquivo novo selecionado)
      if (pdfFile) {
        const fileExt = pdfFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `pdfs/${fileName}`;

        // Correção Crucial: Adicionando contentType explícito para que o navegador reconheça como PDF e não faça download forçado
        const { error: uploadError } = await supabase.storage.from('concurso_pdfs').upload(filePath, pdfFile, {
          contentType: 'application/pdf',
          upsert: true
        });
        
        if (uploadError) {
            if (uploadError.message.includes('Bucket not found')) {
                throw new Error("O diretório de PDFs ainda não foi criado. Clique em 'Configurar Banco de Dados' acima.");
            }
            throw uploadError;
        }

        const { data: urlData } = supabase.storage.from('concurso_pdfs').getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
        
        // Calcula o tamanho em MB
        fileSize = (pdfFile.size / (1024 * 1024)).toFixed(1) + " MB";
      }

      if (!fileUrl) throw new Error("É necessário fazer upload de um arquivo PDF.");
      if (!currentMaterial.title) throw new Error("O título é obrigatório.");
      if (!currentMaterial.category) throw new Error("A categoria é obrigatória.");

      const payload = {
        title: currentMaterial.title,
        description: currentMaterial.description,
        category: currentMaterial.category,
        page_count: currentMaterial.page_count || 0,
        file_url: fileUrl,
        file_size: fileSize,
        is_premium: currentMaterial.is_premium
      };

      // 2. Lógica de Inserção ou Atualização no Banco
      if (isEditing && currentMaterial.id) {
        const { error } = await supabase.from("study_materials").update(payload).eq("id", currentMaterial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("study_materials").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? "Material atualizado com sucesso!" : "Novo material adicionado!");
      queryClient.invalidateQueries({ queryKey: ["adminMaterials"] });
      queryClient.invalidateQueries({ queryKey: ["studyMaterials"] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => toast.error("Erro ao salvar", { description: err.message }),
    onSettled: () => setIsUploading(false)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("study_materials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Material excluído permanentemente.");
      queryClient.invalidateQueries({ queryKey: ["adminMaterials"] });
      queryClient.invalidateQueries({ queryKey: ["studyMaterials"] });
    },
    onError: (err: any) => toast.error("Erro ao excluir", { description: err.message })
  });

  const resetForm = () => {
    setCurrentMaterial({ category: "Legislação do SUS", is_premium: true });
    setPdfFile(null);
    setIsEditing(false);
    setIsCustomCategory(false);
  };

  const openNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEdit = (material: StudyMaterial) => {
    setCurrentMaterial(material);
    setPdfFile(null);
    setIsEditing(true);
    // Se a categoria do material não estiver na lista padrão, ativa o modo customizado
    setIsCustomCategory(!DEFAULT_CATEGORIES.includes(material.category));
    setIsDialogOpen(true);
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* ALERTA DE INSTALAÇÃO DO BANCO */}
      {isError && (
        <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-lg font-bold">Configuração Necessária</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-4">
            <p className="text-sm">A tabela de materiais e a pasta de armazenamento de PDFs ainda não existem. Clique no botão abaixo para criá-las automaticamente.</p>
            <Button 
              onClick={handleInstallDatabase} 
              disabled={isInstalling}
              className="w-fit bg-red-600 hover:bg-red-700 text-white border-0 shadow-lg"
            >
              {isInstalling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wrench className="mr-2 h-4 w-4" />}
              {isInstalling ? "Configurando..." : "Configurar Banco de Dados"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* HEADER DA PÁGINA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileDown className="h-6 w-6 text-primary" /> Materiais em PDF
          </h2>
          <p className="text-sm text-muted-foreground">Gerencie os resumos e apostilas da Área do Concurseiro.</p>
        </div>
        <Button onClick={openNew} disabled={isError} className="w-full sm:w-auto shadow-md">
          <Plus className="mr-2 h-4 w-4" /> Novo Material
        </Button>
      </div>

      <div className="bg-card p-3 rounded-xl border shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar material por título ou categoria..." 
            className="pl-9 bg-muted/30 border-border/60 focus:bg-background transition-all"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            disabled={isError}
          />
        </div>
      </div>

      {/* TABELA DE DADOS */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <ScrollArea className="h-[500px]">
          <div className="min-w-[900px]">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[300px]">Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Páginas/Tamanho</TableHead>
                  <TableHead>Acesso</TableHead>
                  <TableHead className="text-right pr-6">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : isError ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">O banco de dados precisa ser configurado acima.</TableCell></TableRow>
                ) : filteredMaterials.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">Nenhum material cadastrado.</TableCell></TableRow>
                ) : (
                  filteredMaterials.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg shrink-0">
                            <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                          <span className="line-clamp-2" title={item.title}>{item.title}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {item.page_count} págs • {item.file_size}
                      </TableCell>
                      <TableCell>
                        {item.is_premium ? (
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-300 gap-1 px-2 py-0.5 shadow-sm">
                            <Sparkles className="h-3 w-3" /> Premium
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 px-2 py-0.5">
                            <Globe className="h-3 w-3" /> Grátis
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                             <a href={item.file_url} target="_blank" rel="noopener noreferrer" title="Baixar PDF">
                               <Download className="h-4 w-4" />
                             </a>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEdit(item)} className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => { if(confirm(`Deseja excluir "${item.title}" permanentemente?`)) deleteMutation.mutate(item.id); }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* DIALOG DE CRIAÇÃO / EDIÇÃO */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg w-[95vw] rounded-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
               {isEditing ? <Edit className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
               {isEditing ? "Editar Material PDF" : "Adicionar Novo PDF"}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados e faça o upload do arquivo para disponibilizar na Área do Concurseiro.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título do Material <span className="text-red-500">*</span></Label>
              <Input 
                value={currentMaterial.title || ""} 
                onChange={e => setCurrentMaterial({...currentMaterial, title: e.target.value})} 
                placeholder="Ex: Resumo Definitivo: Lei 8.080/90" 
                className="border-muted-foreground/30 focus-visible:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Descrição / Bizu</Label>
              <Textarea 
                value={currentMaterial.description || ""} 
                onChange={e => setCurrentMaterial({...currentMaterial, description: e.target.value})} 
                placeholder="Um breve resumo para atrair o clique e explicar o conteúdo..." 
                className="h-20 resize-none border-muted-foreground/30 focus-visible:ring-primary" 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria <span className="text-red-500">*</span></Label>
                {!isCustomCategory ? (
                  <Select 
                    value={currentMaterial.category} 
                    onValueChange={val => {
                      if (val === 'custom') {
                        setIsCustomCategory(true);
                        setCurrentMaterial({...currentMaterial, category: ""});
                      } else {
                        setCurrentMaterial({...currentMaterial, category: val});
                      }
                    }}
                  >
                    <SelectTrigger className="border-muted-foreground/30 focus-visible:ring-primary">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {allCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      <SelectItem value="custom" className="font-bold text-primary">+ Criar Nova Categoria</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input 
                      autoFocus
                      placeholder="Digite a nova categoria..." 
                      value={currentMaterial.category || ""} 
                      onChange={e => setCurrentMaterial({...currentMaterial, category: e.target.value})}
                      className="border-muted-foreground/30 focus-visible:ring-primary"
                    />
                    <Button variant="ghost" size="icon" onClick={() => { setIsCustomCategory(false); setCurrentMaterial({...currentMaterial, category: allCategories[0]}); }} title="Voltar para a lista">
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Nº de Páginas</Label>
                <Input 
                  type="number" 
                  value={currentMaterial.page_count || ""} 
                  onChange={e => setCurrentMaterial({...currentMaterial, page_count: parseInt(e.target.value)})} 
                  placeholder="Ex: 45" 
                  className="border-muted-foreground/30 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
               <div className="space-y-0.5">
                  <Label className="text-base font-semibold flex items-center gap-2">
                     <Sparkles className="h-4 w-4 text-amber-500" /> Acesso Premium
                  </Label>
                  <p className="text-xs text-muted-foreground">Se ativo, apenas assinantes poderão baixar.</p>
               </div>
               <Switch 
                  checked={currentMaterial.is_premium} 
                  onCheckedChange={checked => setCurrentMaterial({...currentMaterial, is_premium: checked})}
               />
            </div>

            <div className="space-y-2 pt-2 border-t border-dashed">
              <Label>Arquivo PDF <span className="text-red-500">*</span></Label>
              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild className="w-full relative overflow-hidden h-12 border-dashed border-2 hover:bg-primary/5 hover:text-primary hover:border-primary transition-all">
                  <label className="cursor-pointer">
                    <Upload className="h-5 w-5 mr-2" />
                    <span className="font-semibold">{pdfFile ? pdfFile.name : (currentMaterial.file_url ? "Substituir PDF existente" : "Procurar no Computador...")}</span>
                    <Input type="file" accept="application/pdf" className="hidden" onChange={e => setPdfFile(e.target?.files?.[0] || null)} />
                  </label>
                </Button>
              </div>
              {currentMaterial.file_url && !pdfFile && (
                 <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Arquivo atual salvo no sistema.
                 </p>
              )}
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">Cancelar</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={isUploading || (!currentMaterial.file_url && !pdfFile)} className="w-full sm:w-auto bg-primary shadow-lg">
              {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileDown className="h-4 w-4 mr-2" />} 
              {isUploading ? "Fazendo Upload..." : "Salvar Material"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}