import { useState, useEffect } from 'react';
import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function AppContent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={!user ? <Welcome /> : <Navigate to={`/${user.role}-dashboard`} replace />}
      />
      <Route
        path="/login"
        element={
          !user ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Navigate to={`/${user.role}-dashboard`} replace />
          )
        }
      />
      <Route
        path="/worker-dashboard"
        element={
          user?.role === 'worker' ? (
            <WorkerDashboard user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/admin-dashboard"
        element={
          user?.role === 'admin' ? (
            <AdminDashboard user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  const RouterComponent =
    typeof window !== 'undefined' && window.location.protocol === 'file:'
      ? HashRouter
      : BrowserRouter;

  return (
    <RouterComponent>
      <AppContent />
    </RouterComponent>
  );
}

export default App;