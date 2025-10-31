import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Stethoscope, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setIsLoading(false);

    if (error) {
      toast.error("Falha no login", {
        description: "Por favor, verifique seus dados e tente novamente.",
      });
    }
  }

  async function handlePasswordReset() {
    if (!resetEmail) {
      toast.error("Por favor, insira um e-mail.");
      return;
    }
    setIsResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setIsResetting(false);

    if (error) {
      toast.error("Erro ao enviar e-mail", { description: error.message });
    } else {
      toast.success("E-mail de recuperação enviado!", {
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      setIsResetDialogOpen(false);
    }
  }

  return (
    <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
      <div className="w-full min-h-screen flex flex-col bg-muted/40">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Redefinir sua senha</AlertDialogTitle>
            <AlertDialogDescription>
              Digite seu e-mail abaixo. Se ele estiver em nosso sistema, enviaremos um link para você redefinir sua senha.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reset-email">E-mail</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="seu@email.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordReset} disabled={isResetting}>
              {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar E-mail
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

        <div className="flex flex-col items-center justify-center bg-primary text-primary-foreground p-6 text-center shadow-md">
          <Stethoscope className="h-16 w-16 mb-4" />
          <h1 className="text-3xl font-bold">Enfermagem Pro</h1>
          <p className="mt-4 text-base font-medium text-primary-foreground max-w-lg">
            Sua plataforma completa de ferramentas e conhecimento para a prática de enfermagem.
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Acesse sua conta</h1>
              <p className="text-muted-foreground">
                Bem-vindo de volta! Insira seus dados para continuar.
              </p>
            </div>
            <div className="bg-background p-6 rounded-lg shadow-sm border">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Senha</FormLabel>
                          <AlertDialogTrigger asChild>
                            <Button variant="link" className="text-sm text-primary hover:underline p-0 h-auto">
                              Esqueceu a senha?
                            </Button>
                          </AlertDialogTrigger>
                        </div>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </Form>
            </div>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{" "}
              <Link to="/register" className="underline text-primary">
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AlertDialog>
  );
};

export default Login;