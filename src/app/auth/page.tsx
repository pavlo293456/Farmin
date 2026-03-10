'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode]       = useState<'login' | 'signup'>('login')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setSuccess('Check your email for a confirmation link!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
      else router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-farm-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Back */}
        <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:text-farm-green mb-8 transition-colors">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"/>
          </svg>
          Back to map
        </Link>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card p-8" style={{ borderTop: '4px solid #2d6a4f' }}>
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🌾</div>
            <h1 className="font-display font-bold text-2xl text-gray-900">
              {mode === 'login' ? 'Welcome back' : 'Join FarmSearch'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {mode === 'login' ? 'Sign in to manage your vendor profile' : 'Create an account to list your products'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-farm-green transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-farm-green transition-colors"
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error   && <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</p>}
            {success && <p className="text-green-600 text-sm bg-green-50 px-4 py-3 rounded-xl">{success}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || !email || !password}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all disabled:opacity-50"
              style={{ background: '#2d6a4f' }}
            >
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); setSuccess(null) }}
              className="text-sm text-gray-500 hover:text-farm-green transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Are you a farmer or market vendor?{' '}
          <Link href="/vendors" className="text-farm-green hover:underline">Browse all vendors →</Link>
        </p>
      </div>
    </div>
  )
}
