import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import api from "../api";

const AuthContext = createContext();

const authApi = axios.create({
  baseURL: "http://localhost:5000/api",
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { access_token, user: currentUser } = response.data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(currentUser));
    setToken(access_token);
    setUser(currentUser);
  };

  const register = async (name, email, password, role) => {
    const response = await api.post("/auth/register", { name, email, password, role });
    const { access_token, user: newUser } = response.data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(access_token);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, authApi }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
