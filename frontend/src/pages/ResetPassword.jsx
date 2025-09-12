import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSearchParams, useNavigate } from "react-router-dom";
import logo from "../assets/image.png"; // <-- import logo
import "./ResetPassword.css"; // import CSS

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await resetPassword(email, otp, newPassword);
      if (res.success) {
        setMessage(res.message || "Password reset successful! Please log in.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(res.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(err.message || "Failed to reset password.");
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        {/* Logo at the top */}
        <img src={logo} alt="Hospital Logo" className="reset-password-logo" />
        <h2 className="reset-password-title">Reset Password</h2>
        <form onSubmit={handleSubmit} className="reset-password-form space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && <p className="reset-password-message">{message}</p>}
        {error && <p className="reset-password-error">{error}</p>}
      </div>
    </div>
  );
}
