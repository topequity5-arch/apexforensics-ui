/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from "react";
import type { UserSession, AuthPayload, AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("hp_token");
  });

  const [user, setUser] = useState<UserSession | null>(() => {
    const savedUser = localStorage.getItem("hp_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading] = useState<boolean>(false);

  const login = (authPayload: AuthPayload) => {
    const accessToken = authPayload?.session?.access_token;
    const userData = authPayload?.user;

    if (!accessToken || !userData) {
      console.error("Invalid token authentication payload format received.");
      return;
    }

    const contextUser: UserSession = {
      id: userData.id,
      email: userData.email,
      fullName: userData.user_metadata?.full_name || "Anonymous User",
      role: userData.app_metadata?.role || "client",
    };

    setToken(accessToken);
    setUser(contextUser);
    localStorage.setItem("hp_token", accessToken);
    localStorage.setItem("hp_user", JSON.stringify(contextUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("hp_token");
    localStorage.removeItem("hp_user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be mounted inside an AuthProvider hierarchy.",
    );
  }
  return context;
}
