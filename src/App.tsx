import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Calculator from "./pages/Calculator";
import Emergency from "./pages/Emergency";
import Medications from "./pages/Medications";
import WoundCare from "./pages/WoundCare";
import Questions from "./pages/Questions";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const AppContent = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/medications" element={<Medications />} />
          <Route path="/wound-care" element={<WoundCare />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;