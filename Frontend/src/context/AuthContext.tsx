import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { adminApi } from "../lib/api";

interface Admin {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("yugantran_admin_token");
    const savedAdmin = localStorage.getItem("yugantran_admin");
    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await adminApi.login(username, password);
    const { token: jwt, admin: adminData } = res.data;
    setToken(jwt);
    setAdmin(adminData);
    localStorage.setItem("yugantran_admin_token", jwt);
    localStorage.setItem("yugantran_admin", JSON.stringify(adminData));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem("yugantran_admin_token");
    localStorage.removeItem("yugantran_admin");
  };

  return (
    <AuthContext.Provider
      value={{ admin, token, isLoading, login, logout, isAuthenticated: !!token && !!admin }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
