"use client"
import React from 'react'
import Link from 'next/link'

const Home = () => {
  return (
    <main className="space-y-8 sm:space-y-12">
      <section className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold opacity-0 animate-fade-in-up">Create polls and get live results</h1>
        <p className="mt-3 muted">Quick, simple, and real-time.</p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link className="btn-primary" href="/polls/create">Create Poll</Link>
          <Link className="btn-secondary" href="/polls">Browse Polls</Link>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-4 sm:p-6">
          <h3 className="text-lg font-semibold">Real-time Updates</h3>
          <p className="mt-2 muted text-sm sm:text-base">Watch results change live as votes come in.</p>
        </div>
        <div className="card p-4 sm:p-6">
          <h3 className="text-lg font-semibold">Share Instantly</h3>
          <p className="mt-2 muted text-sm sm:text-base">Send a link to friends or teams in seconds.</p>
        </div>
        <div className="card p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold">Secure & Private</h3>
          <p className="mt-2 muted text-sm sm:text-base">Sign in to track your own voting history.</p>
        </div>
      </section>
    </main>
  )
}

export default Home
