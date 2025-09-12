// frontend/src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Signup.css";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "patient" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      // Automatically generate unique userId
      const userId = form.role + Date.now() + Math.floor(Math.random() * 1000);

      // Send form data + userId to signup
      const userData = await signup({ ...form, userId });

      // Redirect based on role
      if (userData.role === "doctor") navigate("/doctors");
      else if (userData.role === "patient") navigate("/patients");
      else if (userData.role === "pharmacist") navigate("/pharmacists");
      else navigate("/");
    } catch (err) {
      setMsg(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1 className="signup-title">Signup</h1>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <div className="role-selection">
            <label>
              <input
                type="radio"
                name="role"
                value="patient"
                checked={form.role === "patient"}
                onChange={handleChange}
              /> Patient
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="doctor"
                checked={form.role === "doctor"}
                onChange={handleChange}
              /> Doctor
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="pharmacist"
                checked={form.role === "pharmacist"}
                onChange={handleChange}
              /> Pharmacist
            </label>
          </div>

          <button type="submit" disabled={loading} className="signup-btn">
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        {msg && <p className="signup-msg">{msg}</p>}
      </div>
    </div>
  );
}
