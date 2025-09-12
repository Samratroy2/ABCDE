// frontend/src/contexts/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user + token from localStorage on app start
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

  // Utility: Extract error message
  const getErrorMessage = (err, fallback = "Something went wrong") => {
    return (
      err?.response?.data?.message ||
      err?.message ||
      err?.toString() ||
      fallback
    );
  };

  // ================= LOGIN =================
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { user: userData, token: newToken } = res.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", newToken);

      setUser(userData);
      setToken(newToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: getErrorMessage(err, "Login failed") };
    }
  };

  // ================= SIGNUP =================
  const signup = async ({ name, email, password, role, userId }) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
        role,
        userId,
      });

      const { user: userData, token: newToken } = res.data;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", newToken);

      setUser(userData);
      setToken(newToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

      return { success: true, user: userData };
    } catch (err) {
      return { success: false, message: getErrorMessage(err, "Signup failed") };
    }
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  // ================= FETCH CURRENT USER =================
  const fetchCurrentUser = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("Fetch current user error:", getErrorMessage(err));
      logout();
    }
  };

  // ================= FORGOT PASSWORD (SEND OTP) =================
  const sendForgotPassword = async (email) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: getErrorMessage(err, "Failed to send OTP") };
    }
  };

  // ================= RESET PASSWORD =================
  const resetPassword = async (email, otp, newPassword) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          email: email.trim(),
          otp: otp.toString().trim(),
          newPassword,
        }
      );
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: getErrorMessage(err, "Failed to reset password") };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        signup,
        logout,
        setUser,
        fetchCurrentUser,
        sendForgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
