'use client'

import { useFormState } from 'react-dom'
import Link from 'next/link'
import { forgotPasswordAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [state, action] = useFormState(forgotPasswordAction, null)

  return (
    <div className="glass-raised overflow-hidden">
      <div className="px-7 py-7">
        <div className="mb-6">
          <span className="eyebrow">Recovery</span>
          <h2 className="font-display italic text-3xl text-white mt-2 tracking-tight">
            Reset your password
          </h2>
          <p className="text-sm text-white/50 mt-2">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form action={action} noValidate className="space-y-5">
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
            {state?.status === 'error' && (
              <div role="alert" className="mt-3 flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {state.message}
              </div>
            )}
          </div>

          <SubmitButton label="Send reset link" pendingLabel="Sending…" />
        </form>
      </div>

      <div className="px-7 py-4 border-t border-white/[0.05] bg-white/[0.02] text-center">
        <Link
          href="/login"
          className="text-xs text-white/50 hover:text-brand-orange transition-colors font-medium inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to sign in
        </Link>
      </div>
    </div>
  )
}
