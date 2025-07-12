import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount and expose for login
  const checkSession = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth/me` : "http://localhost:3000/api/auth/me",
        { withCredentials: true }
      );
      setUser({
        id: res.data.user.id,
        username: res.data.user.username,
        email: res.data.user.email,
        role: res.data.user.role
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await axios.post(
        import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth/login` : "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      await checkSession();
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post(
        import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth/logout` : "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      await axios.post(
        import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/auth/register` : "http://localhost:3000/api/auth/register",
        { username, email, password },
        { withCredentials: true }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
