import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { AppRoutes } from "./routes";
import { Toaster } from "@/components/ui/sonner";
import { Loader2 } from "lucide-react";
import { TimerProvider } from "./context/TimerContext";

function App() {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Router>
      <TimerProvider>
        <AppRoutes auth={auth} />
        <Toaster richColors position="top-right" />
      </TimerProvider>
    </Router>
  );
}

export default App;