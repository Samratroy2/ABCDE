import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Pages where Navbar should NOT be shown
  const hiddenPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];

  // Hide Navbar if current path matches or starts with a hidden path
  const isHidden = hiddenPaths.some(path => location.pathname.startsWith(path));
  if (isHidden) return null;

  // Logout and redirect to login
  const handleLogout = () => {
    logout();           // Call logout from AuthContext
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">Telemedicine</span>
      <div className="navbar-links">
        <Link to="/doctors">Doctors</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/pharmacists">Pharmacists</Link>

        {user ? (
          <>
            <Link to="/profile">{user.name}</Link>
            {user.email === 'trysamrat1@gmail.com' && <Link to="/admin">Admin Panel</Link>}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
