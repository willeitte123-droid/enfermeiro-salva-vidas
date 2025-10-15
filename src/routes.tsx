import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import MainLayout from './components/MainLayout';

// Importações diretas para pré-carregamento
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import Emergency from './pages/Emergency';
import Medications from './pages/Medications';
import WoundCare from './pages/WoundCare';
import Procedures from './pages/Procedures';
import Questions from './pages/Questions';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import KiwifyAdmin from './pages/admin/KiwifyAdmin';
import Scales from './pages/Scales';
import GlasgowScale from './pages/scales/GlasgowScale';
import BradenScale from './pages/scales/BradenScale';
import RassScale from './pages/scales/RassScale';
import WongBakerScale from './pages/scales/WongBakerScale';
import FugulinScale from './pages/scales/FugulinScale';
import MorseScale from './pages/scales/MorseScale';
import AldreteScale from './pages/scales/AldreteScale';
import ApgarScale from './pages/scales/ApgarScale';
import ManchesterScale from './pages/scales/ManchesterScale';
import ParklandScale from './pages/scales/ParklandScale';
import AsaScale from './pages/scales/AsaScale';
import EcgGuide from './pages/EcgGuide';
import ProfilePage from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Semiology from './pages/Semiology';
import SemioTechnique from './pages/Semiotechnique';
import DoseCalculator from './pages/tools/DoseCalculator';
import LabValues from './pages/tools/LabValues';
import BlocoDeNotas from './pages/tools/BlocoDeNotas';
import IntegratedCalculators from './pages/tools/IntegratedCalculators';
import SimuladoPage from './pages/SimuladoPage';
import ReviewArea from './pages/ReviewArea';
import FavoritesPage from './pages/FavoritesPage';

interface AppRoutesProps {
  session: any;
}

export const AppRoutes = ({ session }: AppRoutesProps) => {
  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<MainLayout session={session} />}>
        <Route index element={<Dashboard />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="emergency" element={<Emergency />} />
        <Route path="medications" element={<Medications />} />
        <Route path="wound-care" element={<WoundCare />} />
        <Route path="procedures" element={<Procedures />} />
        <Route path="questions" element={<Questions />} />
        <Route path="admin" element={<Admin />} />
        <Route path="admin/kiwify" element={<KiwifyAdmin />} />
        <Route path="scales" element={<Scales />} />
        <Route path="scales/glasgow" element={<GlasgowScale />} />
        <Route path="scales/braden" element={<BradenScale />} />
        <Route path="scales/rass" element={<RassScale />} />
        <Route path="scales/wong-baker" element={<WongBakerScale />} />
        <Route path="scales/fugulin" element={<FugulinScale />} />
        <Route path="scales/morse" element={<MorseScale />} />
        <Route path="scales/aldrete" element={<AldreteScale />} />
        <Route path="scales/apgar" element={<ApgarScale />} />
        <Route path="scales/manchester" element={<ManchesterScale />} />
        <Route path="scales/parkland" element={<ParklandScale />} />
        <Route path="scales/asa" element={<AsaScale />} />
        <Route path="ecg" element={<EcgGuide />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="user/:userId" element={<PublicProfile />} />
        <Route path="semiology" element={<Semiology />} />
        <Route path="semiotechnique" element={<SemioTechnique />} />
        <Route path="tools/dose-calculator" element={<DoseCalculator />} />
        <Route path="tools/lab-values" element={<LabValues />} />
        <Route path="tools/bloco-de-notas" element={<BlocoDeNotas />} />
        <Route path="tools/integrated-calculators" element={<IntegratedCalculators />} />
        <Route path="simulado" element={<SimuladoPage />} />
        <Route path="review-area" element={<ReviewArea />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// O Suspense não é mais necessário aqui para as rotas, então renomeamos para simplificar.
export const SuspendedAppRoutes = (props: AppRoutesProps) => (
  <AppRoutes {...props} />
);