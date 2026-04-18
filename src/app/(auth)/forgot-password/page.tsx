'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { forgotPasswordAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

export default function ForgotPasswordPage() {
  const [state, action] = useFormState(forgotPasswordAction, null)

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-brand-brown-dark/5 border border-orange-100 p-7">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-brand-brown-dark">Reset your password</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form action={action} noValidate className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email address
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
          {state?.status === 'error' && (
            <p role="alert" className="mt-2 text-sm text-brand-red flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {state.message}
            </p>
          )}
        </div>

        <div className="pt-1">
          <SubmitButton label="Send reset link" pendingLabel="Sending…" />
        </div>
      </form>

      <div className="text-center mt-5">
        <Link href="/login" className="text-sm text-brand-orange hover:text-brand-brown-mid transition-colors py-2 inline-flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
