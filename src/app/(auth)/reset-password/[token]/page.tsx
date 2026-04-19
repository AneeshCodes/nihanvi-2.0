'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { resetPasswordAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { AlertCircle, ChevronRight, XCircle } from 'lucide-react'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [state, action] = useFormState(resetPasswordAction, null)

  if (state?.message === 'token_invalid') {
    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200 overflow-hidden">
        <div className="px-7 py-8 text-center">
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
              <XCircle className="w-7 h-7 text-brand-red" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Link expired or invalid</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            This link has expired or has already been used.
          </p>
          <Link href="/forgot-password" className="text-sm text-brand-orange hover:text-brand-brown-mid transition-colors font-medium inline-flex items-center gap-1">
            Request a new link
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-200 overflow-hidden">
      <div className="px-7 py-6 border-b border-gray-100 bg-gray-50/60">
        <h2 className="text-lg font-bold text-gray-900">Set a new password</h2>
        <p className="text-sm text-gray-500 mt-0.5">Choose a strong password for your account.</p>
      </div>

      <div className="px-7 py-6">
        <form action={action} noValidate className="space-y-5">
          <input type="hidden" name="token" value={params.token} />

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              New password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="At least 8 characters"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                         bg-gray-50 placeholder:text-gray-400 transition-all"
            />
            {state?.status === 'error' && state.field === 'password' && (
              <div role="alert" className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {state.message}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Re-enter your password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange
                         bg-gray-50 placeholder:text-gray-400 transition-all"
            />
            {state?.status === 'error' && state.field === 'confirmPassword' && (
              <div role="alert" className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {state.message}
              </div>
            )}
          </div>

          <SubmitButton label="Update password" pendingLabel="Updating…" />
        </form>
      </div>
    </div>
  )
}
