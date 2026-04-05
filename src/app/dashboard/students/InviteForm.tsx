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
        <p role="alert" className="mt-2 text-sm text-brand-red">{state.message}</p>
      )}
      {state?.status === 'success' && (
        <p role="status" className="mt-2 text-sm text-green-600">{state.message}</p>
      )}
    </form>
  )
}
