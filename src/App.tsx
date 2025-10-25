import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useQuery, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "./lib/supabase";
import { ThemeProvider, useTheme } from "./components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

// Layouts
import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Pages
import Dashboard from "@/pages/Dashboard";
import DripCalculator from "@/pages/DripCalculator";
import ClinicalScales from "@/pages/ClinicalScales";
import ScaleDetail from "@/pages/ScaleDetail";
import Medications from "@/pages/Medications";
import MedicationDetail from "@/pages/MedicationDetail";
import Procedures from "@/pages/Procedures";
import ProcedureDetail from "@/pages/ProcedureDetail";
import Profile from "@/pages/Profile";
import Favorites from "@/pages/Favorites";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ThemeCustomizer from "@/pages/admin/ThemeCustomizer";
import UserManagement from "@/pages/admin/UserManagement";
import ContentManagement from "@/pages/admin/ContentManagement";

const queryClient = new QueryClient();

const fetchThemeSettings = async () => {
  const { data, error } = await supabase
    .from('app_theme')
    .select('settings')
    .eq('id', 1)
    .single();
  if (error && error.code !== 'PGRST116') { // Ignore 'not found' error
    console.error("Error fetching theme:", error);
    return null;
  }
  return data?.settings || {};
};

const ThemeLoader = () => {
  const { setTheme } = useTheme();
  const { data: themeSettings } = useQuery({
    queryKey: ['themeSettings'],
    queryFn: fetchThemeSettings,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  useEffect(() => {
    if (themeSettings) {
      const root = window.document.documentElement;
      // Apply light theme variables
      Object.entries(themeSettings).forEach(([key, value]) => {
        if (typeof value === 'string' && !key.startsWith('--dark-') && key !== 'logo_url' && key !== 'font_family') {
          root.style.setProperty(key, value);
        }
      });
      // Apply dark theme variables
      Object.entries(themeSettings).forEach(([key, value]) => {
        if (typeof value === 'string' && key.startsWith('--dark-')) {
          const lightKey = key.replace('--dark-', '--');
          root.style.setProperty(lightKey, value, 'dark');
        }
      });
       // Apply font family
      if (themeSettings.font_family) {
        root.style.setProperty('--font-sans', themeSettings.font_family);
      }
    }
  }, [themeSettings]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("vite-ui-theme") as "light" | "dark" | "system" | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [setTheme]);


  return null;
};


const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <ThemeLoader />
        <Router>
          <Routes>
            {/* Main Application Routes */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/calculator" element={<DripCalculator />} />
              <Route path="/scales" element={<ClinicalScales />} />
              <Route path="/scales/:id" element={<ScaleDetail />} />
              <Route path="/medications" element={<Medications />} />
              <Route path="/medications/:id" element={<MedicationDetail />} />
              <Route path="/procedures" element={<Procedures />} />
              <Route path="/procedures/:id" element={<ProcedureDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>

            {/* Authentication Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
               <Route index element={<Navigate to="dashboard" replace />} />
               <Route path="dashboard" element={<AdminDashboard />} />
               <Route path="appearance" element={<ThemeCustomizer />} />
               <Route path="users" element={<UserManagement />} />
               <Route path="content" element={<ContentManagement />} />
            </Route>
          </Routes>
        </Router>
        <Toaster richColors />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;