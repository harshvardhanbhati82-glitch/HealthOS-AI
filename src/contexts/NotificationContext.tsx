import { createContext, useContext, useState } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  time: Date;
  read: boolean;
  phc?: string;
}

interface NotificationContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  addNotification: (n: Omit<Notification, 'id' | 'time' | 'read'>) => void;
}

const NotificationContext = createContext<NotificationContextValue>({
  notifications: [],
  unreadCount: 0,
  markAllRead: () => {},
  markRead: () => {},
  addNotification: () => {},
});

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Critical Medicine Shortage',
    message: 'PHC Bilhaur medicine stock dropped to 12%. Emergency resupply needed within 24 hours.',
    type: 'critical',
    time: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    phc: 'PHC Bilhaur',
  },
  {
    id: 'n2',
    title: 'Doctor Shortage Alert',
    message: 'PHC Bilhaur has only 1 doctor managing 98 patients. Immediate reallocation required.',
    type: 'critical',
    time: new Date(Date.now() - 45 * 60 * 1000),
    read: false,
    phc: 'PHC Bilhaur',
  },
  {
    id: 'n3',
    title: 'High Patient Load',
    message: 'PHC Kanpur Rural is seeing 134 patients today with only 2 doctors on duty.',
    type: 'warning',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    phc: 'PHC Kanpur Rural',
  },
  {
    id: 'n4',
    title: 'Dengue Risk Elevated',
    message: 'AI Copilot detected rising dengue risk in Bilhaur and Sarbananda blocks. Confidence: 87%.',
    type: 'warning',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 'n5',
    title: 'Vaccination Drive Completed',
    message: 'PHC Pukhrayan achieved 100% Polio vaccination coverage for July 2026.',
    type: 'success',
    time: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: true,
    phc: 'PHC Pukhrayan',
  },
  {
    id: 'n6',
    title: 'Weekly Report Ready',
    message: 'District health report for Week 27, 2026 is ready for download.',
    type: 'info',
    time: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: true,
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const addNotification = (n: Omit<Notification, 'id' | 'time' | 'read'>) => {
    setNotifications((prev) => [
      { ...n, id: Math.random().toString(36).slice(2), time: new Date(), read: false },
      ...prev,
    ]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllRead, markRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
