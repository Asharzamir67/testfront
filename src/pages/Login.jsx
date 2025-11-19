// src/pages/Login.jsx
import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const roleFromUrl = searchParams.get('role') || 'worker';
  const usernameRef = useRef(null);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: roleFromUrl
  });

  // Reset form when component mounts or when role changes
  useEffect(() => {
    resetForm();
    
    // Focus the username field on mount and when window regains focus
 const handleFocus = () => {
      if (usernameRef.current) {
        usernameRef.current.focus();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    // Use the exposed electron API
    const cleanup = window.electron?.onWindowFocus?.(handleFocus);
    
    // Initial focus
    handleFocus();
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [roleFromUrl]);

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      role: roleFromUrl
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.username && formData.password) {
      const userData = {
        username: formData.username,
        role: formData.role,
        id: Math.random().toString(36).substr(2, 9)
      };
      onLogin(userData);
      // Navigate to dashboard after login
      navigate(`/${userData.role}-dashboard`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Sealant Detection System</h1>
          <p>Please login to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className={`role-badge role-badge-${formData.role}`}>
            <span className="role-icon">
              {formData.role === 'worker' ? '👷' : '👔'}
            </span>
            <div className="role-info">
              <span className="role-label">Logging in as</span>
              <span className="role-value">
                {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              ref={usernameRef}
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="login-footer">
          <p>Use any credentials for prototype</p>
        </div>
      </div>
    </div>
  );
}

export default Login;