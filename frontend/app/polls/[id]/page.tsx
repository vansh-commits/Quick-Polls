"use client"
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { io as clientIO } from 'socket.io-client'
import { useAuth } from '../../contexts/AuthContext'
import { useBackendStatus } from '../../contexts/BackendStatusContext'

type Poll = { id: string; question: string; options: { text: string; votes: number }[] }

export default function PollDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const { showPopup } = useBackendStatus()
  const id = params.id
  const [poll, setPoll] = useState<Poll | null>(null)
  const api = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') as string

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push('/login')
      return
    }
    if (!isLoggedIn) return

    const run = async () => {
      try {
        const res = await fetch(`${api}/polls/${id}`, { cache: 'no-store' })
        const data = await res.json()
        setPoll(data)
      } catch (e) {
        const errorMessage = (e as Error).message
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
          showPopup()
        }
        setPoll(null)
      }
    }
    run()
  }, [api, id, isLoggedIn, router])

  useEffect(() => {
    if (!isLoggedIn) return
    const socket = clientIO(api, { path: '/socket.io' })
    socket.emit('join-poll', id)
    socket.on('poll-updated', (data: Poll) => setPoll(data))
    return () => { socket.disconnect() }
  }, [api, id, isLoggedIn])

  const total = useMemo(() => poll?.options.reduce((a, b) => a + b.votes, 0) ?? 0, [poll])

  const vote = async (idx: number) => {
    const token = localStorage.getItem('qp_token')
    if (!token) {
      router.push('/login')
      return
    }
    try {
      const res = await fetch(`${api}/polls/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ optionIndex: idx })
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        alert(j.error || 'Failed to vote')
      }
    } catch (e) {
      const errorMessage = (e as Error).message
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        showPopup()
      } else {
        alert(errorMessage)
      }
    }
  }

  if (isLoggedIn === null) return <div className="card p-4">Loading...</div>
  if (isLoggedIn === false) return <div className="card p-4">Redirecting to login...</div>
  if (!poll) return <div className="card p-4">Loading poll...</div>

  return (
    <main className="space-y-6 px-4">
      <h2 className="text-xl sm:text-2xl font-semibold">{poll.question}</h2>
      <div className="grid gap-3">
        {poll.options.map((o, i) => {
          const pct = total ? Math.round((o.votes / total) * 100) : 0
          return (
            <div key={i} className="card p-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="font-medium text-sm sm:text-base">{o.text}</span>
                <button onClick={() => vote(i)} className="btn-primary text-sm w-full sm:w-auto">Vote</button>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded glass-border">
                <div style={{ width: `${pct}%` }} className="h-full bg-blue-500 transition-[width] duration-300" />
              </div>
              <div className="mt-1 text-xs muted">{o.votes} votes ({pct}%)</div>
            </div>
          )
        })}
      </div>
      <div className="text-sm muted">Total votes: {total}</div>
    </main>
  )
}


