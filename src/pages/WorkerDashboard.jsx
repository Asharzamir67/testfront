import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CameraFeed from '../components/CameraFeed'
import logo from '../components/logo.png'
import './WorkerDashboard.css'

function WorkerDashboard({ user, onLogout }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'worker') {
      navigate('/', { replace: true })
    }
  }, [user, navigate])

  const [cameraStatuses, setCameraStatuses] = useState({
    frontend1: 'good',
    frontend2: 'good',
    backend1: 'ng',
    backend2: 'good'
  })

  const [cameraStreams, setCameraStreams] = useState({
    frontend1: null,
    frontend2: null,
    backend1: null,
    backend2: null
  })

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Helper functions for Electron / Web compatibility
  const getMedia = async (constraints) => {
    // Prefer the renderer's native API when available —
    // MediaStream objects cannot be serialized across the contextBridge,
    // so calling `electronAPI.getUserMedia` from preload can fail.
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return await navigator.mediaDevices.getUserMedia(constraints)
    }
    if (window.electronAPI?.getUserMedia) {
      return await window.electronAPI.getUserMedia(constraints)
    }
    throw new Error('getUserMedia not available')
  }

  const enumerateDevices = async () => {
    // Prefer renderer API; fallback to preload if needed
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      return await navigator.mediaDevices.enumerateDevices()
    }
    if (window.electronAPI?.enumerateDevices) {
      return await window.electronAPI.enumerateDevices()
    }
    return []
  }

  useEffect(() => {
    const initCameras = async () => {
      if (!navigator.mediaDevices && !window.electronAPI?.getUserMedia) {
        console.error('Camera API not supported')
        return
      }

      try {
        await getMedia({ video: true }) // permission check
      } catch (err) {
        alert('Camera permission is required.')
        return
      }

      const devices = await enumerateDevices()
      const videoInputs = devices.filter(d => d.kind === 'videoinput')

      const cameraIds = ['frontend1','frontend2','backend1','backend2']
      const streams = {}

      for (let i = 0; i < cameraIds.length; i++) {
        const camId = cameraIds[i]
        if (i < videoInputs.length) {
          try {
            const stream = await getMedia({
              video: { deviceId: { exact: videoInputs[i].deviceId }, width: 1280, height: 720 }
            })
            streams[camId] = stream
          } catch (err) {
            console.error(`Camera ${camId} failed:`, err)
            streams[camId] = null
          }
        } else streams[camId] = null
      }

      setCameraStreams(streams)
    }

    initCameras()

    return () => {
      Object.values(cameraStreams).forEach(stream => {
        if (stream) stream.getTracks().forEach(track => track.stop())
      })
    }
  }, [])

  // Simulate camera status changes (demo)
  useEffect(() => {
    const interval = setInterval(() => {
      setCameraStatuses(prev => {
        const newStatus = { ...prev }
        const cams = ['frontend1','frontend2','backend1','backend2']
        const randomCam = cams[Math.floor(Math.random() * cams.length)]
        newStatus[randomCam] = Math.random() > 0.5 ? 'good' : 'ng'
        return newStatus
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => setShowLogoutConfirm(true)
  const confirmLogout = () => { setShowLogoutConfirm(false); onLogout() }
  const cancelLogout = () => setShowLogoutConfirm(false)

  if (!user || user.role !== 'worker') return null

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <img src={logo} alt="Logo" className="dashboard-logo" />
          <div className="header-content">
            <h1>Worker Dashboard</h1>
            <p className="user-info">Welcome, {user.username}</p>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
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
                stream={cameraStreams.frontend1}
              />
              <CameraFeed
                name="Frontend Camera 2"
                cameraId="frontend2"
                status={cameraStatuses.frontend2}
                stream={cameraStreams.frontend2}
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
                stream={cameraStreams.backend1}
              />
              <CameraFeed
                name="Backend Camera 2"
                cameraId="backend2"
                status={cameraStatuses.backend2}
                stream={cameraStreams.backend2}
              />
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h3>System Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Good Cases:</span>
              <span className="summary-value good">
                {Object.values(cameraStatuses).filter(s => s === 'good').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">NG Cases:</span>
              <span className="summary-value ng">
                {Object.values(cameraStatuses).filter(s => s === 'ng').length}
              </span>
            </div>
          </div>
        </div>
      </main>

      {showLogoutConfirm && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-card">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to end this session?</p>
            <div className="modal-actions">
              <button className="button-secondary" onClick={cancelLogout}>Cancel</button>
              <button className="button-danger" onClick={confirmLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkerDashboard
