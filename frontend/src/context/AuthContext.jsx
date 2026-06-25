import { createContext, useContext, useMemo, useState } from "react";
import { authApi } from "../api/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("visiontrace_token"));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("visiontrace_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (payload) => {
    const { data } = await authApi.login(payload);
    localStorage.setItem("visiontrace_token", data.access_token);
    localStorage.setItem("visiontrace_user", JSON.stringify(data.user));
    setToken(data.access_token);
    setUser(data.user);
  };

  const register = async (payload) => {
    await authApi.register(payload);
    await login({ email: payload.email, password: payload.password });
  };

  const logout = () => {
    localStorage.removeItem("visiontrace_token");
    localStorage.removeItem("visiontrace_user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
