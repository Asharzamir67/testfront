import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Create a wrapper component to use useLocation
function AppContent() {
  const location = useLocation();
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
        element={!user ? <Welcome /> : <Navigate to={`/${user.role}-dashboard`} />} 
      />
      // In App.jsx, update the Login route to:
<Route 
  path="/login" 
  element={
    !user ? (
      <Login onLogin={handleLogin} />
    ) : (
      <Navigate to={`/${user.role}-dashboard`} />
    )
  } 
/>
      <Route 
        path="/worker-dashboard" 
        element={user?.role === 'worker' ? <WorkerDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
      />
      <Route 
        path="/admin-dashboard" 
        element={user?.role === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />} 
      />
    </Routes>
  );
}

// Main App component that wraps everything with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;