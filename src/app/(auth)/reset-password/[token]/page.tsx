'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { resetPasswordAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [state, action] = useFormState(resetPasswordAction, null)

  // Invalid/expired token — render error card instead of form
  if (state?.message === 'token_invalid') {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-brand-brown-dark mb-2">Link expired or invalid</h2>
        <p className="text-sm text-gray-500 mb-6">
          This link has expired or has already been used.
        </p>
        <Link href="/forgot-password" className="text-sm text-brand-orange hover:text-brand-brown-mid py-3 inline-flex items-center min-h-[44px]">
          Request a new link →
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-brand-brown-dark mb-6">Set a new password</h2>

      <form action={action} noValidate>
        <input type="hidden" name="token" value={params.token} />

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
          />
          <p className="mt-1 text-xs text-gray-400">At least 8 characters</p>
          {state?.status === 'error' && state.message !== 'token_invalid' &&
            !state.message.includes('match') && (
            <p role="alert" className="mt-1 text-sm text-brand-red">{state.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
          />
          {state?.message?.includes('match') && (
            <p role="alert" className="mt-1 text-sm text-brand-red">{state.message}</p>
          )}
        </div>

        <SubmitButton label="Update password" pendingLabel="Updating…" />
      </form>
    </div>
  )
}
