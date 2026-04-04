'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AuthResponse, AuthUser } from '@/lib/auth/types';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error?: { message: string } }>;
  signUp: (email: string, password: string) => Promise<{ error?: { message: string } }>;
  signOut: () => Promise<{ error?: { message: string } }>;
  refreshSession: () => Promise<boolean>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const getErrorMessage = async (response: Response, fallbackMessage: string) => {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as AuthResponse;
    return data.user;
  }, []);

  const refreshSession = useCallback(async () => {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      setUser(null);
      return false;
    }

    const data = (await response.json()) as AuthResponse;
    setUser(data.user);
    return true;
  }, []);

  const syncSession = useCallback(async () => {
    setLoading(true);

    try {
      const currentUser = await loadUser();

      if (currentUser) {
        setUser(currentUser);
        return;
      }

      const refreshed = await refreshSession();

      if (!refreshed) {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loadUser, refreshSession]);

  useEffect(() => {
    void syncSession();
  }, [syncSession]);

  const signIn = useCallback(async (email: string, password: string, rememberMe?: boolean) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        return {
          error: {
            message: await getErrorMessage(response, 'Unable to sign in right now.'),
          },
        };
      }

      const data = (await response.json()) as AuthResponse;
      setUser(data.user);

      return {};
    } catch {
      return { error: { message: 'Network error. Please try again.' } };
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return {
          error: {
            message: await getErrorMessage(response, 'Unable to create your account right now.'),
          },
        };
      }

      const data = (await response.json()) as AuthResponse;
      setUser(data.user);

      return {};
    } catch {
      return { error: { message: 'Network error. Please try again.' } };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);

      if (!response.ok) {
        return { error: { message: 'Unable to sign out right now.' } };
      }

      return {};
    } catch {
      setUser(null);
      return { error: { message: 'Network error. Please try again.' } };
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut,
      refreshSession,
      isAuthenticated: !!user,
    }),
    [loading, refreshSession, signIn, signOut, signUp, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
