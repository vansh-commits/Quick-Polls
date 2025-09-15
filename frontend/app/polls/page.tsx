import Link from 'next/link'
import { Suspense } from 'react'

type PollListItem = { id: string; question: string; options: { text: string; votes: number }[] }

async function fetchPolls() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
  const res = await fetch(api + '/polls', { cache: 'no-store' })
  return res.json()
}

export default async function PollListPage() {
  const polls: PollListItem[] = await fetchPolls()
  return (
    <main>
      <h2 className="mb-4 text-2xl font-semibold">All Polls</h2>
      <Suspense>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {polls?.map((p: PollListItem) => (
            <li key={p.id} className="rounded border bg-white p-4 shadow-sm">
              <h3 className="font-medium">{p.question}</h3>
              <Link href={`/polls/${p.id}`} className="mt-3 inline-block text-sm text-blue-600 hover:underline">View & Vote</Link>
            </li>
          ))}
        </ul>
      </Suspense>
    </main>
  )
}


