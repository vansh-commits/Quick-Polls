"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import { useBackendStatus } from '../../contexts/BackendStatusContext'

export default function CreatePollPage() {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState<string[]>(['', ''])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { isLoggedIn } = useAuth()
  const { showPopup } = useBackendStatus()

  useEffect(() => {
    if (isLoggedIn === false) {
      router.push('/login')
    }
  }, [isLoggedIn, router])

  const addOption = () => setOptions((o) => [...o, ''])
  const updateOption = (idx: number, val: string) => setOptions((o) => o.map((v, i) => i === idx ? val : v))
  const removeOption = (idx: number) => setOptions((o) => o.filter((_, i) => i !== idx))

  const submit = async () => {
    const token = localStorage.getItem('qp_token')
    if (!token) {
      router.push('/login')
      return
    }
    setLoading(true)
    try {
      const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const res = await fetch(api + '/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ question, options: options.filter(Boolean) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      router.push(`/polls/${data.id}`)
    } catch (e) {
      const errorMessage = (e as Error).message
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        showPopup()
      } else {
        alert(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = question.trim().length > 2 && options.filter((o) => o.trim()).length >= 2

  if (isLoggedIn === null) return <div className="card p-4">Loading...</div>
  if (isLoggedIn === false) return <div className="card p-4">Redirecting to login...</div>

  return (
    <main className="max-w-2xl mx-auto px-4">
      <h2 className="mb-4 text-2xl font-semibold">Create a Poll</h2>
      <div className="space-y-4 card p-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Question</label>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} className="w-full rounded glass-border bg-transparent px-3 py-2" placeholder="Which JS framework?" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Options</label>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2">
                <input value={opt} onChange={(e) => updateOption(i, e.target.value)} className="flex-1 rounded glass-border bg-transparent px-3 py-2" placeholder={`Option ${i + 1}`} />
                {options.length > 2 && (<button onClick={() => removeOption(i)} className="btn-secondary text-sm">Remove</button>)}
              </div>
            ))}
          </div>
          <button onClick={addOption} className="mt-3 text-sm text-white hover:underline">+ Add option</button>
        </div>
        <button disabled={!canSubmit || loading} onClick={submit} className="btn-primary disabled:opacity-50 w-full sm:w-auto">
          {loading ? 'Creating...' : 'Create Poll'}
        </button>
      </div>
    </main>
  )
}


