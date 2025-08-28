'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { meQuery } from '@/lib/queries/me';
import { useQuery } from '@tanstack/react-query';

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data, isLoading } = useQuery(meQuery);

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        setUser(data);
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [data, isLoading]);

  useEffect(() => {
    console.log('user', user);
    if (!loading) {
      if (!user) {
        router.push('/signin');
      } else {
        router.push('/');
      }
    }
  }, [user, loading, router]);

  const login = (user: User) => {
    setUser(user);
    router.push('/');
  };

  const logout = () => {
    setUser(null);
    router.push('/signin');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
