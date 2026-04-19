'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'

export function LoginForm() {
  const router  = useRouter()
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form     = e.currentTarget
    const email    = (form.elements.namedItem('email')    as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    const result = await signIn('credentials', { email, password, redirect: false })

    if (result?.error) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200 overflow-hidden">
      <div className="px-7 py-6 border-b border-gray-100 bg-gray-50/60">
        <h2 className="text-lg font-bold text-gray-900">Welcome back</h2>
        <p className="text-sm text-gray-500 mt-0.5">Sign in to your account to continue</p>
      </div>

      <div className="px-7 py-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                         bg-gray-50 placeholder:text-gray-400 transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                           bg-gray-50 placeholder:text-gray-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div role="alert" className="mt-2.5 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-orange text-white font-semibold py-3 rounded-xl text-sm
                       hover:bg-brand-brown-mid transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 min-h-[44px]
                       shadow-lg shadow-brand-orange/30 hover:shadow-brand-orange/40"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Signing in…</span></>
            ) : (
              <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="text-center mt-5">
          <Link
            href="/forgot-password"
            className="text-sm text-brand-orange hover:text-brand-brown-mid transition-colors font-medium"
          >
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  )
}
