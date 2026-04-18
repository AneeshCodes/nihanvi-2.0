'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { resetPasswordAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
  const [state, action] = useFormState(resetPasswordAction, null)

  if (state?.message === 'token_invalid') {
    return (
      <div className="bg-white rounded-2xl shadow-xl shadow-brand-brown-dark/5 border border-orange-100 p-7 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-brand-brown-dark mb-2">Link expired or invalid</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          This link has expired or has already been used.
        </p>
        <Link href="/forgot-password" className="text-sm text-brand-orange hover:text-brand-brown-mid transition-colors py-2 inline-flex items-center gap-1">
          Request a new link
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-brand-brown-dark/5 border border-orange-100 p-7">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-brand-brown-dark">Set a new password</h2>
        <p className="text-sm text-gray-500 mt-0.5">Choose a strong password for your account.</p>
      </div>

      <form action={action} noValidate className="space-y-4">
        <input type="hidden" name="token" value={params.token} />

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            placeholder="At least 8 characters"
            className="input-base"
          />
          {state?.status === 'error' && state.field === 'password' && (
            <p role="alert" className="mt-1.5 text-sm text-brand-red">{state.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            placeholder="Re-enter your password"
            className="input-base"
          />
          {state?.status === 'error' && state.field === 'confirmPassword' && (
            <p role="alert" className="mt-1.5 text-sm text-brand-red">{state.message}</p>
          )}
        </div>

        <div className="pt-1">
          <SubmitButton label="Update password" pendingLabel="Updating…" />
        </div>
      </form>
    </div>
  )
}
