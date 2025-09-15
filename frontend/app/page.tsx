"use client"
import React from 'react'
import Link from 'next/link'

const Home = () => {
  return (
    <main className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold opacity-0 animate-fade-in-up">Create polls and get live results</h1>
        <p className="mt-3 text-gray-600">Quick, simple, and real-time.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link className="rounded bg-black px-4 py-2 text-white hover:opacity-90" href="/polls/create">Create Poll</Link>
          <Link className="rounded border px-4 py-2 hover:bg-gray-100" href="/polls">Browse Polls</Link>
        </div>
      </section>
    </main>
  )
}

export default Home
