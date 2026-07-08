import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AICopilotPage from './pages/AICopilotPage';
import DistrictMapPage from './pages/DistrictMapPage';
import ReportsPage from './pages/ReportsPage';
import PredictionsPage from './pages/PredictionsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="copilot" element={<AICopilotPage />} />
          <Route path="map" element={<DistrictMapPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="predictions" element={<PredictionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
