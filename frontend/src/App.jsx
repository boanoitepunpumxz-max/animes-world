import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Suspense, lazy } from 'react';
import LoadingScreen from './components/ui/LoadingScreen';

// Auth
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'));

// Main
const HomePage = lazy(() => import('./pages/HomePage'));
const AnimesPage = lazy(() => import('./pages/AnimesPage'));
const AnimeDetailPage = lazy(() => import('./pages/AnimeDetailPage'));
const WatchPage = lazy(() => import('./pages/WatchPage'));
const GenresPage = lazy(() => import('./pages/GenresPage'));
const GenreDetailPage = lazy(() => import('./pages/GenreDetailPage'));
const PopularPage = lazy(() => import('./pages/PopularPage'));
const SeasonsPage = lazy(() => import('./pages/SeasonsPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));

// User
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const WatchlistPage = lazy(() => import('./pages/WatchlistPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));

// Info
const SupportPage = lazy(() => import('./pages/SupportPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminAnimes = lazy(() => import('./pages/admin/AdminAnimes'));
const AdminEpisodes = lazy(() => import('./pages/admin/AdminEpisodes'));
const AdminSecurity = lazy(() => import('./pages/admin/AdminSecurity'));
const AdminSync = lazy(() => import('./pages/admin/AdminSync'));
const AdminTickets = lazy(() => import('./pages/admin/AdminTickets'));

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}

function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Públicas — redirecionam se logado */}
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Root redireciona */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Principais */}
        <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/animes" element={<PrivateRoute><AnimesPage /></PrivateRoute>} />
        <Route path="/anime/:slug" element={<PrivateRoute><AnimeDetailPage /></PrivateRoute>} />
        <Route path="/watch/:animeSlug/:episodeId" element={<PrivateRoute><WatchPage /></PrivateRoute>} />
        <Route path="/generos" element={<PrivateRoute><GenresPage /></PrivateRoute>} />
        <Route path="/generos/:slug" element={<PrivateRoute><GenreDetailPage /></PrivateRoute>} />
        <Route path="/populares" element={<PrivateRoute><PopularPage /></PrivateRoute>} />
        <Route path="/temporadas" element={<PrivateRoute><SeasonsPage /></PrivateRoute>} />
        <Route path="/busca" element={<PrivateRoute><SearchPage /></PrivateRoute>} />

        {/* Usuário */}
        <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/configuracoes" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/historico" element={<PrivateRoute><HistoryPage /></PrivateRoute>} />
        <Route path="/minha-lista" element={<PrivateRoute><WatchlistPage /></PrivateRoute>} />
        <Route path="/notificacoes" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />

        {/* Institucionais */}
        <Route path="/suporte" element={<SupportPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/termos-de-uso" element={<TermsPage />} />
        <Route path="/privacidade" element={<PrivacyPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<AdminUsers />} />
          <Route path="animes" element={<AdminAnimes />} />
          <Route path="episodios" element={<AdminEpisodes />} />
          <Route path="seguranca" element={<AdminSecurity />} />
          <Route path="sincronizacao" element={<AdminSync />} />
          <Route path="suporte" element={<AdminTickets />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
