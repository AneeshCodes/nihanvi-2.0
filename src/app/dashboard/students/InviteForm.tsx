'use client'

import { useFormState } from 'react-dom'
import { inviteStudentAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

export function InviteForm() {
  const [state, action] = useFormState(inviteStudentAction, null)

  return (
    <form action={action} noValidate className="space-y-3">
      <div>
        <label htmlFor="invite-email" className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
          Student or parent email
        </label>
        <input
          id="invite-email"
          name="email"
          type="email"
          placeholder="student@example.com"
          autoComplete="off"
          required
          className="input-base"
        />
      </div>
      <SubmitButton label="Send Invite" pendingLabel="Sending…" />

      {state?.status === 'error' && (
        <p role="alert" className="text-sm text-red-300">{state.message}</p>
      )}
      {state?.status === 'success' && (
        <div className="space-y-2">
          <p role="status" className="text-sm text-emerald-300">{state.message}</p>
          {state.enrollUrl && (
            <div className="bg-white/[0.03] rounded-lg p-3 space-y-1 border border-white/[0.08]">
              <p className="text-xs text-white/50">
                If the email doesn&apos;t arrive, share this link directly:
              </p>
              <input
                readOnly
                value={state.enrollUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="w-full text-xs text-brand-orange bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 cursor-pointer focus:outline-none"
              />
              <p className="text-xs text-white/40">Tap to select, then copy</p>
            </div>
          )}
        </div>
      )}
    </form>
  )
}
