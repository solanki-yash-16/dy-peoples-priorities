'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { authService } from '../services/auth.service';
import { User, LoginDTO, RegisterDTO } from '../types/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginDTO) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = Cookies.get('token');
      if (storedToken) {
        setToken(storedToken);
        try {
          // If we have a token, fetch the user profile
          const res = await authService.getMe();
          setUser(res.data);
        } catch (error) {
          console.error('Failed to authenticate:', error);
          Cookies.remove('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [pathname]);

  const login = async (data: LoginDTO) => {
    setIsLoading(true);
    try {
      const res = await authService.login(data);
      if (res.token) {
        Cookies.set('token', res.token, { expires: 7 }); // Store in cookie for 7 days
        setToken(res.token);
        // We could fetch getMe here, but for now we just wait for the reload or set it if returned
        toast.success('Logged in successfully!');
        
        // After login, fetch the user immediately
        const userRes = await authService.getMe();
        setUser(userRes.data);
        
        window.location.href = '/';
      }
    } catch (error) {
      // Error is usually handled globally in interceptor, but we can catch it here if we want
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterDTO) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data);
      if (res.token) {
        Cookies.set('token', res.token, { expires: 7 });
        setToken(res.token);
        
        const userRes = await authService.getMe();
        setUser(userRes.data);
        
        toast.success('Registered successfully!');
        window.location.href = '/';
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout().catch(() => {}); // Catch if backend fails
      await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {}); // Clear Next.js HttpOnly cookie
    } finally {
      Cookies.remove('token');
      setToken(null);
      setUser(null);
      toast.success('Logged out successfully');
      window.location.href = '/login';
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
