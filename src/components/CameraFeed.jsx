import { useState, useEffect } from 'react'
import './CameraFeed.css'

function CameraFeed({ name, cameraId, status }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const getStatusClass = () => {
    return status === 'good' ? 'status-good' : 'status-ng'
  }

  const getStatusText = () => {
    return status === 'good' ? 'Good' : 'NG'
  }

  return (
    <div className="camera-feed">
      <div className="camera-header">
        <h3>{name}</h3>
        <div className={`camera-status ${getStatusClass()}`}>
          {getStatusText()}
        </div>
      </div>
      
      <div className="camera-viewport">
        {loading ? (
          <div className="loading-spinner">Loading Camera Feed...</div>
        ) : (
          <div className="camera-placeholder">
            {/* This will be replaced with actual camera feed */}
            <div className="placeholder-content">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <p>Camera Feed</p>
              <small className="camera-id">ID: {cameraId}</small>
            </div>
          </div>
        )}
      </div>

      <div className="camera-footer">
        <div className={`status-indicator ${getStatusClass()}`}>
          <span className="status-dot"></span>
          <span className="status-label">{getStatusText()}</span>
        </div>
      </div>
    </div>
  )
}

export default CameraFeed

