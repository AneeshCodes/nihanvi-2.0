// src/app/(auth)/login/LoginForm.tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function LoginForm() {
  const router  = useRouter()
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

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

    // Redirect to /dashboard — middleware redirects students to /portal automatically
    router.push('/dashboard')
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* h2: layout's h1 is the logo above; card heading sits at h2 */}
      <h2 className="sr-only">Sign in to Nihanvi School of Dance</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
          />
          {error && (
            <p role="alert" className="mt-2 text-sm text-brand-red flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-orange text-white font-bold py-4 rounded-lg text-sm
                     hover:bg-brand-brown-mid transition-colors disabled:opacity-50
                     flex items-center justify-center gap-2 min-h-[44px]"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Signing in…</span>
            </>
          ) : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-4">
        <Link
          href="/forgot-password"
          className="text-sm text-brand-orange hover:text-brand-brown-mid py-3 inline-flex items-center justify-center min-h-[44px]"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  )
}
