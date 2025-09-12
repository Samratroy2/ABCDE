import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth(); // include loading
  const location = useLocation();

  // While AuthContext is initializing, show a loading message
  if (loading) return <p>Loading...</p>;

  // If user is not logged in, redirect to login and remember the attempted path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
