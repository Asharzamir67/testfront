import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../components/logo.png'
import './AdminDashboard.css'

function AdminDashboard({ user, onLogout }) {
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Redirect to home if user is not logged in
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(false)
    onLogout()
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  // Don't render if user is not logged in (will redirect)
  if (!user || user.role !== 'admin') {
    return null
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p className="user-info">Welcome, {user?.username}</p>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="admin-section">
          <h2>Admin Controls</h2>
          
          <div className="admin-card">
            <h3>Reports & Analytics</h3>
            <p>View production reports and analytics</p>
            <button className="admin-action">View Reports</button>
          </div>

          <div className="admin-card">
            <h3>Model Retraining</h3>
            <p>Retrain the sealant detection model</p>
            <button className="admin-action">Retrain Model</button>
          </div>
        </div>
      </main>

      {showLogoutConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to end this session?</p>
            <div className="modal-actions">
              <button className="button-secondary" onClick={cancelLogout}>
                Cancel
              </button>
              <button className="button-danger" onClick={confirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

