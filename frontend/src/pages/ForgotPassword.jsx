// frontend/src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { sendForgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const message = await sendForgotPassword(email);
      setMsg(message);

      // Redirect to ResetPassword page after 2 seconds
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-container">
        <h1>Forgot Password</h1>
        <p>Enter your email to receive an OTP for password reset.</p>
        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
        {msg && <p style={{ color: msg.includes('sent') ? 'green' : 'red' }}>{msg}</p>}
      </div>
    </div>
  );
}
