// frontend/src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/image.png";
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
      // Auto-generate fixed userId based on role
      let userId = "";
      if (form.role === "doctor") userId = "doctor981130694";
      else if (form.role === "patient") userId = "patient849590996";
      else if (form.role === "pharmacist") userId = "pharmacist902316739";

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
        <img src={logo} alt="Hospital Logo" className="signup-logo" />
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

        {/* Back to Login button */}
        <button
          type="button"
          className="back-login-btn"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
