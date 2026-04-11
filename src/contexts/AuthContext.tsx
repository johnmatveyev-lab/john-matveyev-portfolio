import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("jm_auth") === "true"
  );

  const login = async (password: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-submissions", {
        method: "GET",
        headers: { "x-admin-password": password },
      });
      if (error) return false;
      // If we get data back (not a 401), password is valid
      setIsAuthenticated(true);
      sessionStorage.setItem("jm_auth", "true");
      sessionStorage.setItem("jm_admin_pw", password);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("jm_auth");
    sessionStorage.removeItem("jm_admin_pw");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
