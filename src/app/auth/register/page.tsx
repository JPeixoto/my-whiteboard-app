'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Failed to register')
      }
      await signIn('credentials', { email, password, callbackUrl: '/' })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to register'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white/90 backdrop-blur shadow-xl rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Create account</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} />
        </div>
        <button disabled={loading} className="w-full bg-black text-white rounded py-2 disabled:opacity-50">
          {loading ? 'Creating...' : 'Sign up'}
        </button>
        <div className="text-center text-sm text-gray-600">
          Already have an account? <Link className="underline" href="/api/auth/signin">Sign in</Link>
        </div>
      </form>
    </div>
  )
}
