import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Edit, Trash2, FileText, Upload, Download, FileDown } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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

const CATEGORIES = [
  "Legislação do SUS", "Urgência e Emergência", "Fundamentos de Enfermagem", 
  "Saúde Pública", "Saúde da Mulher", "Saúde da Criança", "Ética e Bioética", 
  "Administração", "Centro Cirúrgico", "Outros"
];

export default function MaterialsManager() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Partial<StudyMaterial>>({ category: "Legislação do SUS", is_premium: false });
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["adminMaterials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("study_materials").select("*").order("created_at", { ascending: false });
      if (error && error.code !== '42P01') throw error; // Ignora erro se tabela não existir ainda
      return (data || []) as StudyMaterial[];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      setIsUploading(true);
      let fileUrl = currentMaterial.file_url;
      let fileSize = currentMaterial.file_size;

      // Se houver um arquivo novo para upload
      if (pdfFile) {
        const fileExt = pdfFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `pdfs/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('concurso_pdfs').upload(filePath, pdfFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('concurso_pdfs').getPublicUrl(filePath);
        fileUrl = urlData.publicUrl;
        
        // Calcula o tamanho em MB
        fileSize = (pdfFile.size / (1024 * 1024)).toFixed(1) + " MB";
      }

      if (!fileUrl) throw new Error("É necessário fazer upload de um arquivo PDF.");

      const payload = {
        title: currentMaterial.title,
        description: currentMaterial.description,
        category: currentMaterial.category,
        page_count: currentMaterial.page_count,
        file_url: fileUrl,
        file_size: fileSize,
        is_premium: currentMaterial.is_premium
      };

      if (isEditing && currentMaterial.id) {
        const { error } = await supabase.from("study_materials").update(payload).eq("id", currentMaterial.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("study_materials").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? "Material atualizado!" : "Material adicionado!");
      queryClient.invalidateQueries({ queryKey: ["adminMaterials"] });
      queryClient.invalidateQueries({ queryKey: ["studyMaterials"] });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => toast.error("Erro ao salvar: " + err.message),
    onSettled: () => setIsUploading(false)
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("study_materials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Material excluído.");
      queryClient.invalidateQueries({ queryKey: ["adminMaterials"] });
    },
    onError: (err: any) => toast.error("Erro ao excluir: " + err.message)
  });

  const resetForm = () => {
    setCurrentMaterial({ category: "Legislação do SUS", is_premium: false });
    setPdfFile(null);
    setIsEditing(false);
  };

  const openNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEdit = (material: StudyMaterial) => {
    setCurrentMaterial(material);
    setPdfFile(null);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const filteredMaterials = materials.filter(m => m.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileDown className="h-6 w-6 text-primary" /> Materiais PDF
          </h2>
          <p className="text-sm text-muted-foreground">Gerencie os PDFs premium da Área do Concurseiro.</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Novo Material</Button>
      </div>

      <div className="bg-card p-2 rounded-lg border shadow-sm">
        <Input 
          placeholder="Buscar material..." 
          className="border-none shadow-none focus-visible:ring-0"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <ScrollArea className="h-[500px]">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0 z-10">
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Páginas</TableHead>
                  <TableHead>Tamanho</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
                ) : filteredMaterials.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground">Nenhum material encontrado.</TableCell></TableRow>
                ) : (
                  filteredMaterials.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-red-500" />
                          {item.title}
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                      <TableCell>{item.page_count || 0} págs</TableCell>
                      <TableCell>{item.file_size || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" asChild>
                           <a href={item.file_url} target="_blank" rel="noopener noreferrer" title="Baixar">
                             <Download className="h-4 w-4 text-blue-500" />
                           </a>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => { if(confirm("Excluir material?")) deleteMutation.mutate(item.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Material" : "Novo Material PDF"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Título do Material</Label>
              <Input value={currentMaterial.title || ""} onChange={e => setCurrentMaterial({...currentMaterial, title: e.target.value})} placeholder="Ex: Resumo SUS Definitivo" />
            </div>
            
            <div className="space-y-2">
              <Label>Descrição / Bizu</Label>
              <Textarea value={currentMaterial.description || ""} onChange={e => setCurrentMaterial({...currentMaterial, description: e.target.value})} placeholder="Um breve resumo para atrair o clique..." className="h-20 resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select value={currentMaterial.category} onValueChange={val => setCurrentMaterial({...currentMaterial, category: val})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Nº de Páginas</Label>
                <Input type="number" value={currentMaterial.page_count || ""} onChange={e => setCurrentMaterial({...currentMaterial, page_count: parseInt(e.target.value)})} placeholder="Ex: 45" />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label>Arquivo PDF</Label>
              <div className="flex items-center gap-2">
                <Button variant="outline" asChild className="w-full relative overflow-hidden">
                  <label className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    {pdfFile ? pdfFile.name : (currentMaterial.file_url ? "Substituir Arquivo" : "Selecionar PDF do PC")}
                    <Input type="file" accept="application/pdf" className="hidden" onChange={e => setPdfFile(e.target?.files?.[0] || null)} />
                  </label>
                </Button>
              </div>
              {currentMaterial.file_url && !pdfFile && <p className="text-xs text-green-600 mt-1">Arquivo já anexado. Você pode substituir se quiser.</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
            <Button onClick={() => saveMutation.mutate()} disabled={isUploading || (!currentMaterial.file_url && !pdfFile)}>
              {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null} Salvar Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}