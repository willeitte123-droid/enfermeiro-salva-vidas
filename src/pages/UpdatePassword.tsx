import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const formSchema = z.object({
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

const UpdatePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });
    setIsLoading(false);

    if (error) {
      toast.error("Falha ao atualizar a senha", {
        description: error.message || "Por favor, tente novamente.",
      });
    } else {
      toast.success("Senha atualizada com sucesso!", {
        description: "Você já pode fazer login com sua nova senha.",
      });
      await supabase.auth.signOut();
      navigate("/login");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-slate-900 border border-white/10 shadow-2xl flex items-center justify-center mb-4 overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
            <img 
              src="/images/logo-navbar-new.png" 
              alt="Logo Enfermagem Pro" 
              className="w-full h-full object-cover relative z-10"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Crie sua nova senha</CardTitle>
          <CardDescription>
            Digite e confirme sua nova senha abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Mínimo 6 caracteres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nova Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Repita a senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-bold shadow-lg shadow-primary/20" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Salvar Nova Senha"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdatePassword;