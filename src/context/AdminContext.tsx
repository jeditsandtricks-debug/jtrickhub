// src/context/AdminContext.tsx
// Place this file at: src/context/AdminContext.tsx

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AdminContextType {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  login: () => false,
  logout: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if already logged in (persists across refresh)
  useEffect(() => {
    const stored = localStorage.getItem("jtrick_admin");
    if (stored === "true") setIsAdmin(true);
  }, []);

  const login = (password: string): boolean => {
    // Get password from localStorage (set by AdminSettings) or use default
    const savedPw = localStorage.getItem("jtrick_admin_pw") || "admin123";
    if (password === savedPw) {
      setIsAdmin(true);
      localStorage.setItem("jtrick_admin", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem("jtrick_admin");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
