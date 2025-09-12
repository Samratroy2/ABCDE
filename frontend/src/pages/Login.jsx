import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';
import logo from '../assets/image.png';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setLoading(true);

    try {
      // Call login function from AuthContext
      await login(form.email, form.password);
      navigate('/doctors'); // Redirect to doctors page on success
    } catch (err) {
      // Display backend error or default message
      setMsg(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <img src={logo} alt="Hospital Logo" className="login-logo" />
        <h1 className="login-title">Login</h1>

        <form onSubmit={handleSubmit} className="login-form">
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
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-links">
          <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          <span> | </span>
          <Link to="/signup" className="signup-link">Signup</Link>
        </div>

        {msg && <p className="login-error" style={{ color: 'red' }}>{msg}</p>}
      </div>
    </div>
  );
}
