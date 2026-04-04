'use client'

import { useFormState } from 'react-dom'
import { createEventAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

export function CreateEventForm() {
  const [state, action] = useFormState(createEventAction, null)

  return (
    <form action={action} className="space-y-4">
      {state?.status === 'success' && (
        <p className="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2">{state.message}</p>
      )}
      {state?.status === 'error' && (
        <p className="text-sm text-brand-red bg-red-50 rounded-lg px-4 py-2">{state.message}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-brand-red">*</span>
        </label>
        <input
          name="title"
          type="text"
          required
          placeholder="e.g. Spring Recital"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date &amp; time <span className="text-brand-red">*</span>
        </label>
        <input
          name="eventDate"
          type="datetime-local"
          required
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description / location</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Location, dress code, notes..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white resize-none"
        />
      </div>

      <SubmitButton label="Create Event" pendingLabel="Creating..." />
    </form>
  )
}
