import { useState } from 'react';
import { Bell, Sun, Moon, LogOut, User, ChevronDown, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import NotificationDrawer from './NotificationDrawer';
import clsx from 'clsx';

interface Props {
  pageTitle?: string;
}

export default function GlobalHeader({ pageTitle }: Props) {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-6 gap-4 shrink-0 z-30">
        {pageTitle && (
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate hidden sm:block">
              {pageTitle}
            </h2>
          </div>
        )}
        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className={clsx(
              'relative w-10 h-10 flex items-center justify-center rounded-xl transition-all',
              'hover:bg-gray-100 dark:hover:bg-gray-800',
              'text-gray-500 dark:text-gray-400'
            )}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark
              ? <Sun className="w-5 h-5 text-yellow-400" />
              : <Moon className="w-5 h-5" />
            }
          </button>

          {/* Notifications */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user?.avatar ?? 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{user?.role}</p>
              </div>
              <ChevronDown className={clsx('w-4 h-4 text-gray-400 transition-transform hidden md:block', profileOpen && 'rotate-180')} />
            </button>

            {profileOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 animate-slide-in-up overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.email}</p>
                    <span className="inline-block mt-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
                      {user?.role}
                    </span>
                  </div>
                  <div className="p-2">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>
                  <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={() => { setProfileOpen(false); logout(); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <NotificationDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
