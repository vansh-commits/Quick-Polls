"use client"
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

export function Navbar() {
  const { isLoggedIn, userEmail, logout } = useAuth()

  return (
    <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <Link href="/" className="text-2xl font-bold">QuickPolls</Link>
      <nav className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
        <Link href="/polls" className="hover:underline">All Polls</Link>
        <Link href="/polls/create" className="hover:underline">Create Poll</Link>
        <div className="flex items-center gap-2">
          {isLoggedIn === null && <span className="text-sm muted">Loading...</span>}
          {isLoggedIn === true && (
            <>
              <span className="text-sm muted">{userEmail}</span>
              <Link href="/account" className="btn-secondary text-sm px-3 py-1">Account</Link>
              <button onClick={logout} className="text-sm text-red-400 hover:underline bg-red-900/20 border border-red-500/50 px-3 py-1 rounded">Logout</button>
            </>
          )}
          {isLoggedIn === false && (
            <>
              <Link href="/login" className="btn-secondary text-sm px-3 py-1">Login</Link>
              <Link href="/signup" className="btn-primary text-sm px-3 py-1">Sign up</Link>
            </>
          )}
        </div>
        <span id="health-indicator" className="ml-2 rounded-full px-2 py-1 text-xs glass-border" data-status="checking">Checking...</span>
      </nav>
    </header>
  )
}
