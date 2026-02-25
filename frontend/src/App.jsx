import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TasksPage from './pages/TasksPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
import './App.css';

// 404 Not Found Page Component
const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/">Go to Home</a>
    </div>
  );
};

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <Navigation />
      <main className="main-content">
        <Routes>
          {/* Redirect root to tasks if authenticated, otherwise to login */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/tasks" replace /> : <Navigate to="/login" replace />
            } 
          />
          
          {/* Public routes - redirect to tasks if already authenticated */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/tasks" replace /> : <LoginPage />
            } 
          />
          <Route 
            path="/register" 
            element={
              isAuthenticated ? <Navigate to="/tasks" replace /> : <RegisterPage />
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
