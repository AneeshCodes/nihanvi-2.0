'use client'

import { useFormState } from 'react-dom'
import { inviteStudentAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

export function InviteForm() {
  const [state, action] = useFormState(inviteStudentAction, null)

  return (
    <form action={action} noValidate>
      <div className="flex gap-3">
        <div className="flex-1">
          <label htmlFor="invite-email" className="sr-only">Student or parent email</label>
          <input
            id="invite-email"
            name="email"
            type="email"
            placeholder="student@example.com"
            autoComplete="off"
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"
          />
        </div>
        <SubmitButton label="Send Invite" pendingLabel="Sending…" />
      </div>

      {state?.status === 'error' && (
        <p role="alert" className="mt-2 text-sm text-brand-red">{state.message}</p>
      )}
      {state?.status === 'success' && (
        <p role="status" className="mt-2 text-sm text-green-600">{state.message}</p>
      )}
    </form>
  )
}
