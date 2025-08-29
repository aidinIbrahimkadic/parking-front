// src/admin/auth/AuthContext.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";

const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/+$/, "") ||
  "http://localhost:4000/api/v1";

// Stabilan inicijalni shape zbog HMR-a (vite-plugin-react fast refresh)
const AuthContext = React.createContext({
  token: "",
  user: null,
  isAuthed: false,
  authHeader: {},
  login: async () => {
    throw new Error("AuthProvider not mounted");
  },
  signIn: async () => {
    throw new Error("AuthProvider not mounted");
  },
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return (
        localStorage.getItem("auth_token") ||
        localStorage.getItem("authToken") ||
        ""
      );
    } catch {
      return "";
    }
  });

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("auth_user") || "null");
    } catch {
      return null;
    }
  });

  const isAuthed = !!token;

  // Tihi verify /auth/me kada imamo token
  useEffect(() => {
    let cancelled = false;
    async function verify() {
      if (!token) return;
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (!cancelled) {
          setUser(data.user || null);
          localStorage.setItem("auth_user", JSON.stringify(data.user || null));
        }
      } catch {
        if (!cancelled) doLogout();
      }
    }
    verify();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const doLogin = useCallback(async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Neuspješna prijava");

    setToken(data.token);
    setUser(data.user || null);
    // spremi u oba ključa radi kompatibilnosti
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("auth_user", JSON.stringify(data.user || null));
    return data;
  }, []);

  const doLogout = useCallback(() => {
    setToken("");
    setUser(null);
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("auth_user");
    } catch {}
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthed,
      authHeader: token ? { Authorization: `Bearer ${token}` } : {},
      login: doLogin,
      signIn: doLogin, // alias za stariji kod
      logout: doLogout,
    }),
    [token, user, isAuthed, doLogin, doLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
