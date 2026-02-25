import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call logout API
      await authService.logout();
      // Clear local auth state
      logout();
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, clear local state
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/">Task Manager</Link>
        </div>
        
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/tasks" className="nav-link">My Tasks</Link>
              <span className="nav-user">{user?.username || user?.email}</span>
              <button 
                onClick={handleLogout} 
                className="nav-button logout-button"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
