import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import RootLayout from "@/layouts/RootLayout";
import AuthLayout from "@/layouts/AuthLayout";
import AdminLayout from "@/layouts/AdminLayout";
import ErrorPage from "@/pages/ErrorPage";
import LoginPage from "@/pages/LoginPage";
import SignUpPage from "@/pages/SignUpPage";
import DashboardPage from "@/pages/DashboardPage";
import AdminPage from "@/pages/AdminPage";
import CalculatorPage from "@/pages/CalculatorPage";
import QuestionsPage from "@/pages/QuestionsPage";
import FavoritesPage from "@/pages/FavoritesPage";
import ScalesPage from "@/pages/ScalesPage";
import SimuladoPage from "@/pages/SimuladoPage";
import ReviewAreaPage from "@/pages/ReviewAreaPage";
import ProceduresPage from "@/pages/ProceduresPage";
import MedicationsPage from "@/pages/MedicationsPage";
import EmergencyPage from "@/pages/EmergencyPage";
import WoundCarePage from "@/pages/WoundCarePage";
import SemiologyPage from "@/pages/SemiologyPage";
import SemiotechniquePage from "@/pages/SemiotechniquePage";
import ECGGuidePage from "@/pages/ECGGuidePage";
import NursingNotesPage from "@/pages/NursingNotesPage";
import DoseCalculatorPage from "@/pages/tools/DoseCalculatorPage";
import IntegratedCalculatorsPage from "@/pages/tools/IntegratedCalculatorsPage";
import LabValuesPage from "@/pages/tools/LabValuesPage";
import NotepadPage from "@/pages/tools/NotepadPage";
import AdminThemePage from "@/pages/admin/AdminThemePage";
import SterilizationCenter from "@/pages/SterilizationCenter";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "/calculator", element: <CalculatorPage /> },
      { path: "/questions", element: <QuestionsPage /> },
      { path: "/favorites", element: <FavoritesPage /> },
      { path: "/scales", element: <ScalesPage /> },
      { path: "/simulado", element: <SimuladoPage /> },
      { path: "/review-area", element: <ReviewAreaPage /> },
      { path: "/procedures", element: <ProceduresPage /> },
      { path: "/medications", element: <MedicationsPage /> },
      { path: "/emergency", element: <EmergencyPage /> },
      { path: "/wound-care", element: <WoundCarePage /> },
      { path: "/semiology", element: <SemiologyPage /> },
      { path: "/semiotechnique", element: <SemiotechniquePage /> },
      { path: "/ecg", element: <ECGGuidePage /> },
      { path: "/nursing-notes", element: <NursingNotesPage /> },
      { path: "/tools/dose-calculator", element: <DoseCalculatorPage /> },
      { path: "/tools/integrated-calculators", element: <IntegratedCalculatorsPage /> },
      { path: "/tools/lab-values", element: <LabValuesPage /> },
      { path: "/tools/bloco-de-notas", element: <NotepadPage /> },
      { path: "/sterilization-center", element: <SterilizationCenter /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignUpPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminPage /> },
      { path: "theme", element: <AdminThemePage /> },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </QueryClientProvider>
  );
}

export default App;