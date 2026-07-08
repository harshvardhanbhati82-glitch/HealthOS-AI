import { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@healthos.gov.in': {
    password: 'Admin@123',
    user: {
      name: 'Dr. Arvind Sharma',
      email: 'admin@healthos.gov.in',
      role: 'District Health Officer',
      avatar: 'AS',
    },
  },
  'doctor@healthos.gov.in': {
    password: 'Doctor@123',
    user: {
      name: 'Dr. Priya Mehta',
      email: 'doctor@healthos.gov.in',
      role: 'Medical Superintendent',
      avatar: 'PM',
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('healthos-user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem('healthos-user', JSON.stringify(user));
      else localStorage.removeItem('healthos-user');
    } catch {}
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800));
    const match = MOCK_USERS[email.toLowerCase()];
    if (match && match.password === password) {
      setUser(match.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem('healthos-user'); } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
