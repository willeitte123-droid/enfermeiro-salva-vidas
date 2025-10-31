import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";

const SuspendedAccount = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-lg border">
        <h1 className="text-2xl font-bold mb-4 text-destructive">Conta Suspensa</h1>
        <p className="text-muted-foreground mb-6">
          A sua conta foi suspensa. Isso pode ocorrer devido a um reembolso, violação dos termos de uso ou outras questões administrativas.
        </p>
        <p className="text-muted-foreground mb-6">
          Se acredita que isto é um erro, por favor, entre em contato com o suporte.
        </p>
        <Button onClick={() => supabase.auth.signOut()} className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default SuspendedAccount;