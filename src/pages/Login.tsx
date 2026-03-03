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
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
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

const MicrosoftLogo = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
  </svg>
);

const GoogleLogo = () => (
  <svg width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.5 10.74c0-.73-.06-1.43-.19-2.11H10.5v3.99h5.62c-.24 1.28-.97 2.37-2.07 3.11v2.58h3.35c1.96-1.8 3.1-4.46 3.1-7.57z" fill="#4285F4"/>
    <path d="M10.5 20.9c2.81 0 5.17-.93 6.89-2.52l-3.35-2.58c-.93.63-2.12 1-3.54 1-2.71 0-5.19-1.83-6.01-4.29H1.07v2.66C2.84 18.72 6.43 20.9 10.5 20.9z" fill="#34A853"/>
    <path d="M4.49 12.51c-.21-.63-.33-1.3-.33-2.01s.12-1.38.33-2.01V5.83H1.07C.38 7.2 0 8.81 0 10.5s.38 3.3 1.07 4.67l3.42-2.66z" fill="#FBBC05"/>
    <path d="M10.5 4.1c1.53 0 2.9.53 3.98 1.56l2.99-2.99C15.66.99 13.3 0 10.5 0 6.43 0 2.84 2.18 1.07 5.83l3.42 2.66c.82-2.46 3.3-4.39 6.01-4.39z" fill="#EA4335"/>
  </svg>
);

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
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

  const handleMicrosoftLogin = async () => {
    setIsMicrosoftLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        scopes: 'email',
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setIsMicrosoftLoading(false);
      toast.error("Erro no login com Microsoft", { description: error.message });
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setIsGoogleLoading(false);
      toast.error("Erro no login com Google", { description: error.message });
    }
  };

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
                
                <Button type="submit" className="w-full h-11 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all" disabled={isLoading || isMicrosoftLoading || isGoogleLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Entrando...</> : "Acessar Plataforma"}
                </Button>
              </form>
            </Form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-11 bg-background hover:bg-muted/50 border-muted-foreground/20"
                onClick={handleGoogleLogin}
                disabled={isLoading || isMicrosoftLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <GoogleLogo />
                )}
                <span className="ml-2">Google</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-11 bg-background hover:bg-muted/50 border-muted-foreground/20"
                onClick={handleMicrosoftLogin}
                disabled={isLoading || isMicrosoftLoading || isGoogleLoading}
              >
                {isMicrosoftLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MicrosoftLogo />
                )}
                <span className="ml-2">Microsoft</span>
              </Button>
            </div>
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