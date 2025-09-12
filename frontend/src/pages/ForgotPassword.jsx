import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/image.png"; // <-- import logo
import "./ForgotPassword.css"; // import CSS

export default function ForgotPassword() {
  const { sendForgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await sendForgotPassword(email);
      if (res.success) {
        setMessage(res.message || "OTP sent to your email.");
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setError(res.message || "Failed to send OTP.");
      }
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
    }
  };

  return (
    <div className="forgot-password-container">
  <div className="forgot-password-card">
    <img src={logo} alt="Hospital Logo" className="forgot-password-logo" />
    <h2 className="forgot-password-title">Forgot Password</h2>

    <form onSubmit={handleSubmit} className="forgot-password-form space-y-4">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Send OTP</button>
    </form>

    {/* Centered container for messages and Back to Login button */}
    <div className="center-content">
      {message && <p className="forgot-password-message">{message}</p>}
      {error && <p className="forgot-password-error">{error}</p>}

      <button
        type="button"
        className="back-login-btn"
        onClick={() => navigate("/login")}
      >
        Back to Login
      </button>
    </div>
  </div>
</div>

  );
}
