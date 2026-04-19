'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { forgotPasswordAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [state, action] = useFormState(forgotPasswordAction, null)

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200 overflow-hidden">
      <div className="px-7 py-6 border-b border-gray-100 bg-gray-50/60">
        <h2 className="text-lg font-bold text-gray-900">Reset your password</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <div className="px-7 py-6">
        <form action={action} noValidate className="space-y-5">
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
            {state?.status === 'error' && (
              <div role="alert" className="mt-2.5 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {state.message}
              </div>
            )}
          </div>

          <SubmitButton label="Send reset link" pendingLabel="Sending…" />
        </form>

        <div className="text-center mt-5">
          <Link
            href="/login"
            className="text-sm text-brand-orange hover:text-brand-brown-mid transition-colors font-medium inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
