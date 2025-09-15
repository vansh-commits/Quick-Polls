"use client"
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { io as clientIO } from 'socket.io-client'

type Poll = { id: string; question: string; options: { text: string; votes: number }[] }

export default function PollDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params.id
  const [poll, setPoll] = useState<Poll | null>(null)
  const api = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') as string

  useEffect(() => {
    const run = async () => {
      const res = await fetch(`${api}/polls/${id}`, { cache: 'no-store' })
      const data = await res.json()
      setPoll(data)
    }
    run()
  }, [api, id])

  useEffect(() => {
    const socket = clientIO(api, { path: '/socket.io' })
    socket.emit('join-poll', id)
    socket.on('poll-updated', (data: Poll) => setPoll(data))
    return () => { socket.disconnect() }
  }, [api, id])

  const total = useMemo(() => poll?.options.reduce((a, b) => a + b.votes, 0) ?? 0, [poll])

  const vote = async (idx: number) => {
    const res = await fetch(`${api}/polls/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionIndex: idx })
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      alert(j.error || 'Failed to vote')
    }
  }

  if (!poll) return <p>Loading...</p>

  return (
    <main className="space-y-6">
      <h2 className="text-2xl font-semibold">{poll.question}</h2>
      <div className="grid gap-3">
        {poll.options.map((o, i) => {
          const pct = total ? Math.round((o.votes / total) * 100) : 0
          return (
            <div key={i} className="rounded border bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{o.text}</span>
                <button onClick={() => vote(i)} className="rounded bg-black px-3 py-1 text-sm text-white hover:opacity-90">Vote</button>
              </div>
              <div className="mt-2 h-3 w-full overflow-hidden rounded bg-gray-100">
                <div style={{ width: `${pct}%` }} className="h-full bg-blue-500 transition-[width] duration-300" />
              </div>
              <div className="mt-1 text-xs text-gray-600">{o.votes} votes ({pct}%)</div>
            </div>
          )
        })}
      </div>
      <div className="text-sm text-gray-600">Total votes: {total}</div>
    </main>
  )
}


