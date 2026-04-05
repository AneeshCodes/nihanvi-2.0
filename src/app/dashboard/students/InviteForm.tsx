'use client'

import { useFormState } from 'react-dom'
import { inviteStudentAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

export function InviteForm() {
  const [state, action] = useFormState(inviteStudentAction, null)

  return (
    <form action={action} noValidate className="space-y-3">
      <div>
        <label htmlFor="invite-email" className="block text-sm font-medium text-gray-700 mb-1">
          Student or parent email
        </label>
        <input
          id="invite-email"
          name="email"
          type="email"
          placeholder="student@example.com"
          autoComplete="off"
          required
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                     focus:outline-none focus:border-brand-orange bg-white"
        />
      </div>
      <SubmitButton label="Send Invite" pendingLabel="Sending…" />

      {state?.status === 'error' && (
        <p role="alert" className="text-sm text-brand-red">{state.message}</p>
      )}
      {state?.status === 'success' && (
        <div className="space-y-2">
          <p role="status" className="text-sm text-green-600">{state.message}</p>
          {state.enrollUrl && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <p className="text-xs text-gray-500">
                If the email doesn&apos;t arrive, share this link directly:
              </p>
              <input
                readOnly
                value={state.enrollUrl}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="w-full text-xs text-brand-orange bg-white border border-gray-200 rounded px-3 py-2 cursor-pointer focus:outline-none"
              />
              <p className="text-xs text-gray-400">Tap to select, then copy</p>
            </div>
          )}
        </div>
      )}
    </form>
  )
}
