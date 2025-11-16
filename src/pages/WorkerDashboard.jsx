import { useState, useEffect } from 'react'
import CameraFeed from '../components/CameraFeed'
import logo from '../components/logo.png'
import './WorkerDashboard.css'

function WorkerDashboard({ user, onLogout }) {
  const [cameraStatuses, setCameraStatuses] = useState({
    frontend1: 'good',
    frontend2: 'good',
    backend1: 'ng',
    backend2: 'good'
  })

  // Simulate status changes (for prototype)
  useEffect(() => {
    const interval = setInterval(() => {
      setCameraStatuses(prev => {
        const newStatus = { ...prev }
        // Randomly change one status for demo
        const cameras = ['frontend1', 'frontend2', 'backend1', 'backend2']
        const randomCamera = cameras[Math.floor(Math.random() * cameras.length)]
        newStatus[randomCamera] = Math.random() > 0.5 ? 'good' : 'ng'
        return newStatus
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout()
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <div className="header-content">
            <h1>Worker Dashboard</h1>
            <p className="user-info">Welcome, {user?.username}</p>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <div className="camera-grid">
          <div className="camera-section">
            <h2 className="section-title">Frontend Cameras</h2>
            <div className="camera-group">
              <CameraFeed 
                name="Frontend Camera 1"
                cameraId="frontend1"
                status={cameraStatuses.frontend1}
              />
              <CameraFeed 
                name="Frontend Camera 2"
                cameraId="frontend2"
                status={cameraStatuses.frontend2}
              />
            </div>
          </div>

          <div className="camera-section">
            <h2 className="section-title">Backend Cameras</h2>
            <div className="camera-group">
              <CameraFeed 
                name="Backend Camera 1"
                cameraId="backend1"
                status={cameraStatuses.backend1}
              />
              <CameraFeed 
                name="Backend Camera 2"
                cameraId="backend2"
                status={cameraStatuses.backend2}
              />
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h3>System Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Good Cases:</span>
              <span className="summary-value good">{Object.values(cameraStatuses).filter(s => s === 'good').length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">NG Cases:</span>
              <span className="summary-value ng">{Object.values(cameraStatuses).filter(s => s === 'ng').length}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default WorkerDashboard

