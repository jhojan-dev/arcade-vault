"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const USER_KEY = "av_user";

interface UserContextType {
  user: string | null;
  login: (name: string) => void;
  logout: () => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(USER_KEY);
      setUser(stored);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (name: string) => {
    const clean = name.trim().toUpperCase().slice(0, 10);
    localStorage.setItem(USER_KEY, clean);
    setUser(clean);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de UserProvider");
  return ctx;
}