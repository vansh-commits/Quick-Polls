"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'

type VoteItem = { pollId: string; question: string; optionIndex: number; optionText: string }

export default function AccountPage(){
  const [votes, setVotes] = useState<VoteItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  useEffect(()=>{
    const token = localStorage.getItem('qp_token')
    if(!token){ setError('Please login to view your votes.'); return }
    fetch(api + '/me/votes', { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' })
      .then(r=> r.ok ? r.json() : r.json().then(j=>Promise.reject(j.error||'Failed')))
      .then(setVotes)
      .catch((e)=> setError(String(e)))
  },[api])

  return (
    <main className="px-4">
      <h2 className="mb-4 text-2xl font-semibold">Your Votes</h2>
      {!votes && !error && (
        <div className="card p-4">Loading your votes...</div>
      )}
      {error && (
        <div className="card p-4">
          <div className="mb-2">{error}</div>
          <Link href="/login" className="text-white hover:underline">Login</Link>
        </div>
      )}
      {votes && (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {votes.map((v,i)=> (
            <li key={i} className="card p-4">
              <div className="font-medium text-sm sm:text-base">{v.question}</div>
              <div className="muted text-sm mt-1">You chose: {v.optionText}</div>
              <Link href={`/polls/${v.pollId}`} className="text-white text-sm mt-2 inline-block hover:underline">View poll</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}


