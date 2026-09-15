import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { adminApi } from "../lib/api";

interface Admin {
  id: string;
  username: string;
  name: string;
  role: string;
}

interface AuthCtx {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: Admin | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx>({
  isAuthenticated: false,
  isLoading: true,
  admin: null,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("yugantran_admin_token");
    if (!token) { setIsLoading(false); return; }

    adminApi.me()
      .then((res) => {
        setAdmin(res.data.admin);
      })
      .catch(() => {
        localStorage.removeItem("yugantran_admin_token");
        localStorage.removeItem("yugantran_admin");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const res = await adminApi.login(username, password);
    const { token, admin: adminData } = res.data;
    localStorage.setItem("yugantran_admin_token", token);
    localStorage.setItem("yugantran_admin", JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("yugantran_admin_token");
    localStorage.removeItem("yugantran_admin");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!admin, isLoading, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
