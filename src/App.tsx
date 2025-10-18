import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { SuspendedAppRoutes } from "./routes";
import { useAuth } from "./context/AuthContext";

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen w-full">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const AppContent = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  return <SuspendedAppRoutes session={session} />;
};

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </TooltipProvider>
);

export default App;