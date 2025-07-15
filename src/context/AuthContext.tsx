import React, { createContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  userId: number | null;
  userRole: string | null;
  login: (token: string, userId: number, role: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  userRole: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );
  const [userId, setUserId] = useState<number | null>(() => {
    const stored = localStorage.getItem("userId");
    return stored ? parseInt(stored, 10) : null;
  });
  const [userRole, setUserRole] = useState<string | null>(() =>
    localStorage.getItem("userRole")
  );

  const login = (newToken: string, newUserId: number, role: string) => {
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("userId", newUserId.toString());
    localStorage.setItem("userRole", role);
    setToken(newToken);
    setUserId(newUserId);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    setToken(null);
    setUserId(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
