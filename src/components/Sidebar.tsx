import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Bot, Map, FileBarChart2, TrendingUp, Heart, Activity,
} from 'lucide-react';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/copilot', icon: Bot, label: 'AI Copilot' },
  { to: '/map', icon: Map, label: 'District Map' },
  { to: '/reports', icon: FileBarChart2, label: 'Reports' },
  { to: '/predictions', icon: TrendingUp, label: 'Predictions' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gradient-to-b from-blue-950 to-blue-900 text-white flex flex-col shrink-0 shadow-xl">
      {/* Logo */}
      <div className="p-5 border-b border-blue-800/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-white">HealthOS</h1>
            <p className="text-blue-300 text-xs">AI District Manager</p>
          </div>
        </div>
      </div>

      {/* District Info */}
      <div className="px-5 py-3 border-b border-blue-800/60 bg-blue-900/40">
        <div className="flex items-center gap-2 text-sm text-blue-200">
          <Activity className="w-3.5 h-3.5" />
          <span className="font-medium">Kanpur District</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-300">System Online</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white text-blue-900 shadow-md shadow-black/10'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={clsx('w-5 h-5 shrink-0', isActive ? 'text-blue-600' : '')} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-800/60 text-xs text-blue-400/80">
        <p className="font-medium text-blue-300">HealthOS AI v1.0</p>
        <p className="mt-0.5">UP State Health Mission</p>
      </div>
    </aside>
  );
}
