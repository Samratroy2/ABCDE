import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Hide navbar on these routes
  const hiddenPaths = ["/login", "/signup", "/forgot-password", "/reset-password"];
  if (hiddenPaths.some((path) => location.pathname.startsWith(path))) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <span
        className="navbar-brand"
        style={{ cursor: "pointer" }}
      >
        Telemedicine
      </span>

      <div className="navbar-links">
        {/* ✅ Search link styled like other buttons */}
        

        <Link to="/doctors">Doctors</Link>
        <Link to="/patients">Patients</Link>
        <Link to="/pharmacists">Pharmacists</Link>
        <Link to="/search-medicine">🔍 Search Medicine</Link>

        {user ? (
          <>
            <Link to="/profile">{user.name}</Link>
            {user.email === "trysamrat1@gmail.com" && (
              <Link to="/admin">Admin Panel</Link>
            )}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
