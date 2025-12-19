import { useState, useEffect } from "react";
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
import { Eye, EyeOff, Loader2, Mail, Lock, CheckCircle2 } from "lucide-react";
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
import { useThemeCustomization } from "@/context/ThemeCustomizationContext";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [cooldown, setCooldown] = useState(0);
  const { themeSettings, isLoading: isThemeLoading } = useThemeCustomization();

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => {
      setCooldown(cooldown - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

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
        description: "Credenciais inválidas. Verifique seus dados.",
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
    setCooldown(60);

    if (error) {
      toast.error("Erro ao enviar e-mail", { description: error.message });
    } else {
      toast.success("Link enviado!", {
        description: "Verifique sua caixa de entrada (e spam) para redefinir a senha.",
      });
      setIsResetDialogOpen(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      {/* Seção Visual (Topo) */}
      <div className="relative w-full flex flex-col items-center justify-center pt-16 pb-12 px-6 bg-slate-900 overflow-hidden shrink-0">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-800 via-slate-900 to-slate-950 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/medical-icons.png')] opacity-5"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl text-center flex flex-col items-center">
          <div className="mb-6 p-4 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-700">
            {isThemeLoading ? (
              <Skeleton className="h-20 w-20 rounded-xl bg-white/20" />
            ) : (
              <img 
                src={themeSettings.logo_url || "/logo.svg"} 
                alt="Logo Enfermagem Pro" 
                className="h-20 w-20 object-contain drop-shadow-md" 
              />
            )}
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
            Enfermagem Pro
          </h1>
          
          <p className="text-lg sm:text-xl font-medium text-blue-100 mb-6 leading-relaxed">
            Domine a arte e a ciência do cuidar.
          </p>
          
          <div className="hidden sm:flex flex-wrap justify-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 
              <span>Cálculos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 
              <span>Protocolos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 
              <span>Concursos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção do Formulário (Baixo) */}
      <div className="flex-1 flex items-start justify-center p-6 sm:p-10 -mt-8 z-20">
        <div className="bg-card w-full max-w-md p-8 rounded-xl shadow-xl border border-border/50 animate-in slide-in-from-bottom-8 duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Acesse sua conta</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Insira suas credenciais para continuar.
            </p>
          </div>

          <div className="grid gap-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input 
                            placeholder="seu@email.com" 
                            className="pl-9 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all" 
                            {...field} 
                          />
                        </div>
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
                        <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <Button variant="link" className="text-xs font-medium text-primary px-0 h-auto" tabIndex={-1}>
                              Esqueceu a senha?
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Redefinir Senha</AlertDialogTitle>
                              <AlertDialogDescription>
                                Enviaremos um link seguro para o seu e-mail para que você possa criar uma nova senha.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="space-y-3 py-2">
                              <Label htmlFor="reset-email">Seu e-mail cadastrado</Label>
                              <Input
                                id="reset-email"
                                type="email"
                                placeholder="exemplo@email.com"
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={handlePasswordReset} disabled={isResetting || cooldown > 0}>
                                {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : cooldown > 0 ? `Aguarde ${cooldown}s` : "Enviar Link"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div className="relative">
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-9 pr-10 h-11 bg-muted/30 border-muted-foreground/20 focus:bg-background transition-all"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute top-0 right-0 h-full px-3 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...</> : "Acessar Plataforma"}
                </Button>
              </form>
            </Form>
          </div>
          
          <p className="text-center text-xs text-muted-foreground mt-8 px-4">
            Ao continuar, você concorda com nossos <a href="#" className="underline hover:text-primary">Termos de Serviço</a> e <a href="#" className="underline hover:text-primary">Política de Privacidade</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;