'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { setupPasswordAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { AlertCircle, ArrowLeft, XCircle } from 'lucide-react'

export default function SetupPasswordPage({ params }: { params: { token: string } }) {
  const [state, action] = useFormState(setupPasswordAction, null)

  if (state?.message === 'token_invalid') {
    return (
      <div className="glass-raised overflow-hidden">
        <div className="px-7 py-8 text-center">
          <div className="flex justify-center mb-5">
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center">
              <XCircle className="w-7 h-7 text-red-300" />
            </div>
          </div>
          <span className="eyebrow">Expired</span>
          <h2 className="font-display italic text-3xl text-white mt-2 tracking-tight">
            Link expired
          </h2>
          <p className="text-sm text-white/50 leading-relaxed mt-3 mb-6">
            This setup link has expired. Contact your teacher to resend it.
          </p>
          <Link href="/login" className="text-xs text-white/50 hover:text-brand-orange transition-colors font-medium inline-flex items-center gap-1.5">
            <ArrowLeft className="w-3 h-3" />
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-raised overflow-hidden">
      <div className="px-7 py-7">
        <div className="mb-6">
          <span className="eyebrow">Welcome</span>
          <h2 className="font-display italic text-3xl text-white mt-2 tracking-tight">
            Set your password
          </h2>
          <p className="text-sm text-white/50 mt-2">
            Choose a password to access your portal.
          </p>
        </div>

        <form action={action} noValidate className="space-y-5">
          <input type="hidden" name="token" value={params.token} />

          <div>
            <label htmlFor="password" className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-2">
              Password
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
              <div role="alert" className="mt-3 flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {state.message}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-2">
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
              <div role="alert" className="mt-3 flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {state.message}
              </div>
            )}
          </div>

          <SubmitButton label="Set password" pendingLabel="Setting up…" />
        </form>
      </div>
    </div>
  )
}
