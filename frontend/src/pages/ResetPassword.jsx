// frontend/src/pages/ResetPassword.jsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ResetPassword.css';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const preEmail = location.state?.email || '';

  const [form, setForm] = useState({
    email: preEmail,
    otp: '',
    newPassword: '',
  });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      // OTP is sent as a string
      const message = await resetPassword(form.email, form.otp, form.newPassword);
      setMsg(message);

      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-container">
        <h1>Reset Password</h1>
        <p>Enter the OTP sent to your email and set a new password.</p>
        <form onSubmit={handleSubmit} className="reset-form">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            readOnly
          />
          <input
            type="text"
            name="otp"
            placeholder="Enter OTP"
            value={form.otp}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {msg && <p style={{ color: msg.includes('successful') ? 'green' : 'red' }}>{msg}</p>}
      </div>
    </div>
  );
}
