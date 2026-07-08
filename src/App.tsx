import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';

// Lazy-load all pages for better initial load performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AICopilotPage = lazy(() => import('./pages/AICopilotPage'));
const DistrictMapPage = lazy(() => import('./pages/DistrictMapPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const PredictionsPage = lazy(() => import('./pages/PredictionsPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin border-[3px]" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <LoginPage />;

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={
          <Suspense fallback={<PageLoader />}><Dashboard /></Suspense>
        } />
        <Route path="copilot" element={
          <Suspense fallback={<PageLoader />}><AICopilotPage /></Suspense>
        } />
        <Route path="map" element={
          <Suspense fallback={<PageLoader />}><DistrictMapPage /></Suspense>
        } />
        <Route path="reports" element={
          <Suspense fallback={<PageLoader />}><ReportsPage /></Suspense>
        } />
        <Route path="predictions" element={
          <Suspense fallback={<PageLoader />}><PredictionsPage /></Suspense>
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppRoutes />
            </BrowserRouter>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
