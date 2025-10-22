"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useBackendStatus } from '../contexts/BackendStatusContext'

type PollListItem = { id: string; question: string; options: { text: string; votes: number }[] }

export default function PollListPage() {
  const [polls, setPolls] = useState<PollListItem[]>([])
  const [loading, setLoading] = useState(true)
  const { showPopup } = useBackendStatus()
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await fetch(api + '/polls', { cache: 'no-store' })
        if (!res.ok) {
          setPolls([])
          return
        }
        const data = await res.json()
        setPolls(data)
      } catch (e) {
        const errorMessage = (e as Error).message
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
          showPopup()
        }
        setPolls([])
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()
  }, [api, showPopup])

  if (loading) {
    return (
      <main className="px-4">
        <h2 className="mb-4 text-2xl font-semibold">All Polls</h2>
        <div className="card p-4 text-center">Loading polls...</div>
      </main>
    )
  }

  return (
    <main className="px-4">
      <h2 className="mb-4 text-2xl font-semibold">All Polls</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(!polls || polls.length === 0) && (
          <li className="card p-4 col-span-full text-center">No polls yet</li>
        )}
        {polls?.map((p: PollListItem) => (
          <li key={p.id} className="card p-4">
            <h3 className="font-medium text-sm sm:text-base">{p.question}</h3>
            <Link href={`/polls/${p.id}`} className="mt-3 inline-block text-sm text-white hover:underline">View & Vote</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}


