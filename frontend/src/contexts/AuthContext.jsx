import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { user: userData, token } = res.data;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return userData;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      throw err.response?.data || { message: err.message };
    }
  };

  // Signup
  const signup = async (name, email, password, role) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", { name, email, password, role });
      const { user: userData, token } = res.data;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      setUser(userData);
      setToken(token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return userData;
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      throw err.response?.data || { message: err.message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  // Refresh current user
  const fetchCurrentUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/users/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Fetch current user error:", err.response?.data || err.message);
      logout(); // logout if token invalid
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout, setUser, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
