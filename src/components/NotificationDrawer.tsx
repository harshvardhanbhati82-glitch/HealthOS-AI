import { X, AlertTriangle, CheckCircle2, Info, Bell, Check } from 'lucide-react';
import { useNotifications, type Notification } from '../contexts/NotificationContext';
import clsx from 'clsx';

interface Props {
  open: boolean;
  onClose: () => void;
}

const TYPE_CONFIG = {
  critical: {
    icon: AlertTriangle,
    iconClass: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
    dot: 'bg-orange-500',
  },
  success: {
    icon: CheckCircle2,
    iconClass: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    dot: 'bg-green-500',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
};

function timeAgo(date: Date) {
  const secs = Math.floor((Date.now() - date.getTime()) / 1000);
  if (secs < 60) return 'just now';
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

function NotifItem({ n, onRead }: { n: Notification; onRead: () => void }) {
  const cfg = TYPE_CONFIG[n.type];
  const Icon = cfg.icon;
  return (
    <div
      className={clsx(
        'p-4 border rounded-xl transition-all cursor-pointer hover:shadow-sm',
        cfg.bg, cfg.border,
        !n.read && 'ring-1 ring-inset ring-offset-0',
        n.type === 'critical' && !n.read ? 'ring-red-300 dark:ring-red-700' : 'ring-transparent'
      )}
      onClick={onRead}
    >
      <div className="flex items-start gap-3">
        <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          n.type === 'critical' ? 'bg-red-100 dark:bg-red-900/40' :
          n.type === 'warning' ? 'bg-orange-100 dark:bg-orange-900/40' :
          n.type === 'success' ? 'bg-green-100 dark:bg-green-900/40' :
          'bg-blue-100 dark:bg-blue-900/40'
        )}>
          <Icon className={clsx('w-4 h-4', cfg.iconClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-sm text-gray-900 dark:text-white">{n.title}</p>
            {!n.read && (
              <span className={clsx('w-2 h-2 rounded-full shrink-0', cfg.dot)} />
            )}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{n.message}</p>
          <div className="flex items-center gap-3 mt-2">
            {n.phc && (
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
                {n.phc}
              </span>
            )}
            <span className="text-xs text-gray-400">{timeAgo(new Date(n.time))}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NotificationDrawer({ open, onClose }: Props) {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={clsx(
          'fixed top-0 right-0 h-full w-full sm:w-96 bg-white dark:bg-gray-900',
          'border-l border-gray-200 dark:border-gray-700 shadow-2xl z-50',
          'flex flex-col transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" />
            <h2 className="font-bold text-gray-900 dark:text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-300 dark:text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-500 dark:text-gray-400">All caught up!</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">No new notifications</p>
              </div>
            </div>
          ) : (
            notifications.map((n) => (
              <NotifItem key={n.id} n={n} onRead={() => markRead(n.id)} />
            ))
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 py-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Showing last 24 hours · Kanpur District
          </p>
        </div>
      </div>
    </>
  );
}
