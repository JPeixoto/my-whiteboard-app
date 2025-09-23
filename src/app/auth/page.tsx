'use client'

import { useEffect, useState } from 'react'
import { ClientSafeProvider, getProviders, signIn } from 'next-auth/react'
import Link from 'next/link'

type Mode = 'signin' | 'signup'

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null)

  useEffect(() => {
    let active = true
    const loadProviders = async () => {
      try {
        const available = await getProviders()
        if (active) {
          setProviders(available)
        }
      } catch {
        if (active) {
          setProviders({})
        }
      }
    }
    void loadProviders()
    return () => {
      active = false
    }
  }, [])

  const googleProvider = providers?.google
  const githubProvider = providers?.github
  const oauthButtonCount = Number(Boolean(googleProvider)) + Number(Boolean(githubProvider))
  const showOAuthProviders = oauthButtonCount > 0

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signup') {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        })
        if (!res.ok) {
          const j = await res.json().catch(() => ({}))
          throw new Error(j.error || 'Failed to register')
        }
      }
      const result = await signIn('credentials', { email, password, callbackUrl: '/', redirect: true })
      if (!result) return
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Authentication failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md bg-white/90 backdrop-blur shadow-2xl rounded-2xl p-6">
        <div className="flex justify-center mb-4">
          <div className="inline-flex p-1 bg-gray-100 rounded-lg">
            <button
              className={`px-4 py-2 rounded-md text-sm ${mode==='signin' ? 'bg-white shadow' : ''}`}
              onClick={() => setMode('signin')}
            >Sign in</button>
            <button
              className={`px-4 py-2 rounded-md text-sm ${mode==='signup' ? 'bg-white shadow' : ''}`}
              onClick={() => setMode('signup')}
            >Sign up</button>
          </div>
        </div>
        <h1 className="text-xl font-semibold text-center mb-4">Welcome to Whiteboard</h1>
        {error && <div className="text-red-600 text-sm text-center mb-3">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} />
          </div>
          <button disabled={loading} className="w-full bg-black text-white rounded py-2 disabled:opacity-50">
            {loading ? (mode==='signup' ? 'Creating...' : 'Signing in...') : (mode==='signup' ? 'Create account' : 'Sign in')}
          </button>
        </form>
        {showOAuthProviders && (
          <>
            <div className="my-4 flex items-center">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="px-3 text-xs text-gray-500">or continue with</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <div className={`${oauthButtonCount > 1 ? 'grid grid-cols-2' : 'grid grid-cols-1'} gap-2`}>
              {googleProvider && (
                <button
                  type="button"
                  onClick={() => signIn(googleProvider.id, { callbackUrl: '/' })}
                  className="border rounded py-2 hover:bg-gray-50"
                >
                  Google
                </button>
              )}
              {githubProvider && (
                <button
                  type="button"
                  onClick={() => signIn(githubProvider.id, { callbackUrl: '/' })}
                  className="border rounded py-2 hover:bg-gray-50"
                >
                  GitHub
                </button>
              )}
            </div>
          </>
        )}
        <div className="text-center text-xs text-gray-500 mt-4">
          <Link href="/">Back to whiteboard</Link>
        </div>
      </div>
    </div>
  )
}

