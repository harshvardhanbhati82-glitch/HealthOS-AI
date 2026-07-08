import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import GlobalHeader from './GlobalHeader';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'District Health Dashboard',
  '/copilot': 'AI Copilot',
  '/map': 'District Map',
  '/reports': 'Reports & Analytics',
  '/predictions': 'AI Health Predictions',
};

export default function Layout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'HealthOS AI';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <GlobalHeader pageTitle={title} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
