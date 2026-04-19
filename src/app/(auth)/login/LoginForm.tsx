'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
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
    <div className="glass-raised overflow-hidden">
      <div className="px-7 py-7">
        <div className="mb-6">
          <span className="eyebrow">Sign in</span>
          <h2 className="font-display italic text-3xl text-white mt-2 tracking-tight">
            Welcome back
          </h2>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="input-base"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-2">
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
                className="input-base pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white/80 transition-colors"
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-3 flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in…</span>
              </>
            ) : (
              <>
                <span>Sign in</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="px-7 py-4 border-t border-white/[0.05] bg-white/[0.02] text-center">
        <Link
          href="/forgot-password"
          className="text-xs text-white/50 hover:text-brand-orange transition-colors font-medium"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  )
}
