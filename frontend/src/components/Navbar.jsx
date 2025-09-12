import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Pages where Navbar should NOT be shown
  const hiddenPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];
  if (hiddenPaths.includes(location.pathname)) return null;

  return (
    <nav className="navbar">
      {/* Logo / Brand */}
      <Link to="/" className="navbar-brand">
        Telemedicine
      </Link>

      {/* Navigation Links */}
      <div className="navbar-links">
        <Link to="/doctors">Doctors</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/pharmacists">Pharmacists</Link>

        {user ? (
          <>
            <Link to="/profile">{user.name}</Link>
            {/* Admin Panel link only for super admin */}
            {user.email === 'trysamrat1@gmail.com' && <Link to="/admin">Admin Panel</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
