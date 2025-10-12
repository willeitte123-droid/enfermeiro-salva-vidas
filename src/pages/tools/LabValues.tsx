import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertTriangle } from "lucide-react";
import { labValuesData } from "@/data/labValues";

const LabValues = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return labValuesData;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return labValuesData
      .map(category => {
        const filteredValues = category.values.filter(
          value =>
            value.name.toLowerCase().includes(lowercasedFilter) ||
            (value.notes && value.notes.toLowerCase().includes(lowercasedFilter))
        );
        return { ...category, values: filteredValues };
      })
      .filter(category => category.values.length > 0);
  }, [searchTerm]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Guia de Valores Laboratoriais</h1>
        <p className="text-muted-foreground">Consulte rapidamente os valores de referência para exames laboratoriais.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por exame (ex: Potássio, Hb, Glicose...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Alert variant="default" className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800 dark:text-amber-300">
          Os valores de referência podem variar entre laboratórios. Sempre consulte os valores fornecidos pela sua instituição.
        </AlertDescription>
      </Alert>

      {filteredData.length > 0 ? (
        <div className="space-y-6">
          {filteredData.map(category => {
            const Icon = category.icon;
            return (
              <Card key={category.category}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-3 ${category.color}`}>
                    <Icon /> {category.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30%]">Exame</TableHead>
                        <TableHead className="w-[30%]">Valor de Referência</TableHead>
                        <TableHead>Notas</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.values.map(value => (
                        <TableRow key={value.name}>
                          <TableCell className="font-medium">{value.name}</TableCell>
                          <TableCell>{value.value} {value.unit}</TableCell>
                          <TableCell className="text-muted-foreground">{value.notes}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum exame encontrado para "{searchTerm}".
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LabValues;