import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContextType } from './context/AuthContext';

// Layouts e Páginas Públicas (Carregamento Normal)
import MainLayout from './components/MainLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UpdatePassword from './pages/UpdatePassword';
import NotFound from './pages/NotFound';

// Páginas Internas (Carregamento Lazy - Só baixam quando o usuário entra no app)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Emergency = lazy(() => import('./pages/Emergency'));
const Medications = lazy(() => import('./pages/Medications'));
const WoundCare = lazy(() => import('./pages/WoundCare'));
const Procedures = lazy(() => import('./pages/Procedures'));
const Questions = lazy(() => import('./pages/Questions'));
const Admin = lazy(() => import('./pages/Admin'));
const ThemeCustomizer = lazy(() => import('./pages/admin/ThemeCustomizer'));
const Scales = lazy(() => import('./pages/Scales'));
const GlasgowScale = lazy(() => import('./pages/scales/GlasgowScale'));
const BradenScale = lazy(() => import('./pages/scales/BradenScale'));
const RassScale = lazy(() => import('./pages/scales/RassScale'));
const WongBakerScale = lazy(() => import('./pages/scales/WongBakerScale'));
const FugulinScale = lazy(() => import('./pages/scales/FugulinScale'));
const MorseScale = lazy(() => import('./pages/scales/MorseScale'));
const AldreteScale = lazy(() => import('./pages/scales/AldreteScale'));
const ApgarScale = lazy(() => import('./pages/scales/ApgarScale'));
const ManchesterScale = lazy(() => import('./pages/scales/ManchesterScale'));
const ParklandScale = lazy(() => import('./pages/scales/ParklandScale'));
const AsaScale = lazy(() => import('./pages/scales/AsaScale'));
const KatzScale = lazy(() => import('./pages/scales/KatzScale'));
const EcgGuide = lazy(() => import('./pages/EcgGuide'));
const ProfilePage = lazy(() => import('./pages/Profile'));
const PublicProfile = lazy(() => import('./pages/PublicProfile'));
const Semiology = lazy(() => import('./pages/Semiology'));
const SemioTechnique = lazy(() => import('./pages/Semiotechnique'));
const AnatomyPhysiology = lazy(() => import('./pages/AnatomyPhysiology'));
const ConcurseiroArea = lazy(() => import('./pages/ConcurseiroArea'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const Ranking = lazy(() => import('./pages/Ranking'));
const DoseCalculator = lazy(() => import('./pages/tools/DoseCalculator'));
const LabValues = lazy(() => import('./pages/tools/LabValues'));
const BlocoDeNotas = lazy(() => import('./pages/tools/BlocoDeNotas'));
const IntegratedCalculators = lazy(() => import('./pages/tools/IntegratedCalculators'));
const MyPerformance = lazy(() => import('./pages/tools/MyPerformance'));
const SimuladoPage = lazy(() => import('./pages/SimuladoPage'));
const ReviewArea = lazy(() => import('./pages/ReviewArea'));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const NursingNotesGuide = lazy(() => import('./pages/NursingNotesGuide'));
const TechnicalTerms = lazy(() => import('./pages/TechnicalTerms'));
const StudyTracks = lazy(() => import('./pages/StudyTracks'));
const DeepStudy = lazy(() => import('./pages/DeepStudy'));
const ClinicalCases = lazy(() => import('./pages/ClinicalCases'));
const Concursos = lazy(() => import('./pages/Concursos'));
const VideoLibrary = lazy(() => import('./pages/VideoLibrary'));

interface AppRoutesProps {
  auth: AuthContextType;
}

export const AppRoutes = ({ auth }: AppRoutesProps) => {
  const { session, authEvent } = auth;

  const isPasswordRecovery = session && authEvent === 'PASSWORD_RECOVERY';

  if (isPasswordRecovery) {
    return (
      <Routes>
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="*" element={<Navigate to="/update-password" replace />} />
      </Routes>
    );
  }

  // Se NÃO estiver logado
  if (!session) {
    return (
      <Routes>
        <Route path="/oferta" element={<LandingPage />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Se ESTIVER logado
  return (
    <Routes>
      <Route path="/oferta" element={<LandingPage />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="calculator" element={<Calculator />} />
        <Route path="emergency" element={<Emergency />} />
        <Route path="medications" element={<Medications />} />
        <Route path="wound-care" element={<WoundCare />} />
        <Route path="procedures" element={<Procedures />} />
        <Route path="questions" element={<Questions />} />
        <Route path="admin" element={<Admin />} />
        <Route path="admin/theme" element={<ThemeCustomizer />} />
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
        <Route path="scales/katz" element={<KatzScale />} />
        <Route path="ecg" element={<EcgGuide />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="user/:userId" element={<PublicProfile />} />
        <Route path="semiology" element={<Semiology />} />
        <Route path="semiotechnique" element={<SemioTechnique />} />
        <Route path="anatomy" element={<AnatomyPhysiology />} />
        <Route path="concurseiro" element={<ConcurseiroArea />} />
        <Route path="library" element={<DeepStudy />} />
        <Route path="video-library" element={<VideoLibrary />} />
        <Route path="flashcards" element={<Flashcards />} />
        <Route path="ranking" element={<Ranking />} />
        <Route path="tools/dose-calculator" element={<DoseCalculator />} />
        <Route path="tools/lab-values" element={<LabValues />} />
        <Route path="tools/bloco-de-notas" element={<BlocoDeNotas />} />
        <Route path="tools/integrated-calculators" element={<IntegratedCalculators />} />
        <Route path="tools/performance" element={<MyPerformance />} />
        <Route path="simulado" element={<SimuladoPage />} />
        <Route path="review-area" element={<ReviewArea />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="nursing-notes" element={<NursingNotesGuide />} />
        <Route path="technical-terms" element={<TechnicalTerms />} />
        <Route path="study-tracks" element={<StudyTracks />} />
        <Route path="clinical-cases" element={<ClinicalCases />} />
        <Route path="concursos" element={<Concursos />} />
        <Route path="update-password" element={<UpdatePassword />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/register" element={<Navigate to="/" replace />} />
    </Routes>
  );
};