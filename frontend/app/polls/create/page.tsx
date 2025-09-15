"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreatePollPage() {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const addOption = () => setOptions((o) => [...o, ''])
  const updateOption = (idx: number, val: string) => setOptions((o) => o.map((v, i) => i === idx ? val : v))
  const removeOption = (idx: number) => setOptions((o) => o.filter((_, i) => i !== idx))

  const submit = async () => {
    setLoading(true)
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const res = await fetch(api + '/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, options: options.filter(Boolean) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      router.push(`/polls/${data.id}`)
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = question.trim().length > 2 && options.filter((o) => o.trim()).length >= 2

  return (
    <main className="max-w-2xl">
      <h2 className="mb-4 text-2xl font-semibold">Create a Poll</h2>
      <div className="space-y-4 rounded border bg-white p-4 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium">Question</label>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full rounded border px-3 py-2" placeholder="Which JS framework?" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Options</label>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input value={opt} onChange={(e) => updateOption(i, e.target.value)} className="flex-1 rounded border px-3 py-2" placeholder={`Option ${i + 1}`} />
                {options.length > 2 && (
                  <button onClick={() => removeOption(i)} className="rounded border px-3 py-2 hover:bg-gray-100">Remove</button>
                )}
              </div>
            ))}
          </div>
          <button onClick={addOption} className="mt-3 text-sm text-blue-600 hover:underline">+ Add option</button>
        </div>
        <button disabled={!canSubmit || loading} onClick={submit} className="rounded bg-black px-4 py-2 text-white transition-transform active:scale-[0.98] disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Poll'}
        </button>
      </div>
    </main>
  )
}


