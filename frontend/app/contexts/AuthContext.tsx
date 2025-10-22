"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

interface AuthContextType {
  isLoggedIn: boolean | null
  userEmail: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('qp_token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUserEmail(payload.email)
        setIsLoggedIn(true)
      } catch {
        localStorage.removeItem('qp_token')
        setIsLoggedIn(false)
      }
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  const login = (token: string) => {
    localStorage.setItem('qp_token', token)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setUserEmail(payload.email)
      setIsLoggedIn(true)
    } catch {
      localStorage.removeItem('qp_token')
      setIsLoggedIn(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('qp_token')
    setIsLoggedIn(false)
    setUserEmail(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
