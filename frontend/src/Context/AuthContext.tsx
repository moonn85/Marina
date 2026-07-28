// import { createContext, useContext, useEffect, useState } from "react";
// import { bootstrapAuth, login as doLogin, logout as doLogout } from "../libs/auth";
// import { apiGet } from "../libs/apis";

// type User = { id: string; name: string; email: string; role?: string };
// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshMe: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User|null>(null);
//   const [loading, setLoading] = useState(true);

//   const refreshMe = async () => {
//     try {
//       const res = await apiGet<User>("/auth/me");
//       if (res.success && res.data) setUser(res.data);
//       else setUser(null);
//     } catch { setUser(null); }
//   };

//   useEffect(() => {
//     (async () => {
//       await bootstrapAuth();      // lấy accessToken từ refresh cookie nếu có
//       await refreshMe();          // lấy thông tin user
//       setLoading(false);
//     })();
//   }, []);

//   const login = async (email: string, password: string) => {
//     await doLogin(email, password); // set accessToken in memory
//     await refreshMe();              // lấy user
//   };

//   const logout = async () => {
//     await doLogout();
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout, refreshMe }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };

import { createContext, useState, useEffect } from "react";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Dispatch custom event
    window.dispatchEvent(new Event("userLogin"));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    // Dispatch custom event
    window.dispatchEvent(new Event("userLogout"));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
