import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Map,
  FileBarChart2,
  TrendingUp,
  Heart,
  Activity,
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
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">HealthOS</h1>
            <p className="text-blue-300 text-xs">AI District Manager</p>
          </div>
        </div>
      </div>

      {/* District Info */}
      <div className="px-6 py-4 border-b border-blue-700">
        <div className="flex items-center gap-2 text-sm text-blue-200">
          <Activity className="w-4 h-4" />
          <span>Kanpur District</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-xs text-green-300">System Online</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all',
                isActive
                  ? 'bg-white text-blue-900 shadow-md'
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              )
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-blue-700 text-xs text-blue-400">
        <p>HealthOS AI v1.0</p>
        <p>UP State Health Mission</p>
      </div>
    </aside>
  );
}
