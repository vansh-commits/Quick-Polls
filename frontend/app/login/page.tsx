"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import { useBackendStatus } from '../contexts/BackendStatusContext'

export default function LoginPage(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState('')
  const router = useRouter()
  const { login } = useAuth()
  const { showPopup } = useBackendStatus()
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  const submit = async()=>{
    if(!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    setError('')
    try{
      const res = await fetch(api + '/auth/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ email: email.trim(), password })
      })
      const data = await res.json()
      if(!res.ok) throw new Error(data.error || 'Login failed')
      login(data.token)
      router.push('/account')
    }catch(e){
      const errorMessage = (e as Error).message
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        showPopup()
      } else {
        setError(errorMessage)
      }
    }finally{
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto px-4">
      <h2 className="mb-4 text-2xl font-semibold">Login</h2>
      <div className="card p-4 space-y-4">
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-300 px-3 py-2 rounded text-sm">
            {error}
          </div>
        )}
        <input 
          className="w-full rounded glass-border bg-transparent px-3 py-2" 
          placeholder="Email" 
          type="email"
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
        />
        <input 
          className="w-full rounded glass-border bg-transparent px-3 py-2" 
          placeholder="Password" 
          type="password" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
        />
        <button disabled={loading} onClick={submit} className="btn-primary disabled:opacity-50 w-full">
          {loading? 'Signing in...' : 'Sign in'}
        </button>
      </div>
    </main>
  )
}


