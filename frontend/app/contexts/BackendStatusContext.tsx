"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface BackendStatusContextType {
  isBackendUp: boolean | null
  showPopup: () => void
  hidePopup: () => void
}

const BackendStatusContext = createContext<BackendStatusContextType | undefined>(undefined)

export function BackendStatusProvider({ children }: { children: ReactNode }) {
  const [isBackendUp, setIsBackendUp] = useState<boolean | null>(null)
  const [showStatusPopup, setShowStatusPopup] = useState(false)
  const [lastPopupTime, setLastPopupTime] = useState(0)

  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(`${api}/health`, { cache: 'no-store' })
        const data = await response.json()
        setIsBackendUp(data.ok && data.dbReady)
      } catch {
        setIsBackendUp(false)
      }
    }

    // Initial check
    checkBackendStatus()
    
    // Check every 10 seconds
    const interval = setInterval(checkBackendStatus, 10000)
    
    return () => clearInterval(interval)
  }, [])

  const showPopup = () => {
    const now = Date.now()
    // Only show popup if backend is down AND we haven't shown it in the last 30 seconds
    if (isBackendUp === false && now - lastPopupTime > 30000) {
      setShowStatusPopup(true)
      setLastPopupTime(now)
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowStatusPopup(false)
      }, 5000)
    }
  }

  const hidePopup = () => {
    setShowStatusPopup(false)
  }

  return (
    <BackendStatusContext.Provider value={{ isBackendUp, showPopup, hidePopup }}>
      {children}
      {showStatusPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-3">Backend Not Available</h3>
            <p className="text-gray-700 mb-4">
              The backend server is currently warming up. Please wait approximately 50 seconds 
              and check the status indicator in the top right corner. Once it turns green, 
              you can try again.
            </p>
            <div className="flex justify-end">
              <button 
                onClick={hidePopup}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </BackendStatusContext.Provider>
  )
}

export function useBackendStatus() {
  const context = useContext(BackendStatusContext)
  if (context === undefined) {
    throw new Error('useBackendStatus must be used within a BackendStatusProvider')
  }
  return context
}
