import { useState } from 'react'
import logo from '../components/logo.png'
import './AdminDashboard.css'

function AdminDashboard({ user, onLogout }) {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout()
    }
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
    </div>
  )
}

export default AdminDashboard

