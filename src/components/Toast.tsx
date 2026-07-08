import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import clsx from 'clsx';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (type: ToastType, title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const STYLES = {
  success: 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700',
  error: 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700',
  warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700',
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-700',
};

const ICON_STYLES = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

const TITLE_STYLES = {
  success: 'text-green-800 dark:text-green-300',
  error: 'text-red-800 dark:text-red-300',
  warning: 'text-yellow-800 dark:text-yellow-300',
  info: 'text-blue-800 dark:text-blue-300',
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          return (
            <div
              key={toast.id}
              className={clsx(
                'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg',
                'animate-slide-in-up max-w-sm w-full',
                STYLES[toast.type]
              )}
            >
              <Icon className={clsx('w-5 h-5 shrink-0 mt-0.5', ICON_STYLES[toast.type])} />
              <div className="flex-1 min-w-0">
                <p className={clsx('font-semibold text-sm', TITLE_STYLES[toast.type])}>
                  {toast.title}
                </p>
                {toast.message && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
