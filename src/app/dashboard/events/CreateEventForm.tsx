'use client'

import { useFormState } from 'react-dom'
import { createEventAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

export function CreateEventForm() {
  const [state, action] = useFormState(createEventAction, null)

  return (
    <form action={action} className="space-y-4">
      {state?.status === 'success' && (
        <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">{state.message}</p>
      )}
      {state?.status === 'error' && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{state.message}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
            Title <span className="text-red-300">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            placeholder="e.g. Annual Recital"
            className="input-base"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
            Date <span className="text-red-300">*</span>
          </label>
          <input
            name="eventDate"
            type="date"
            required
            className="input-base [color-scheme:dark]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
            Time <span className="text-red-300">*</span>
          </label>
          <input
            name="eventTime"
            type="time"
            required
            className="input-base [color-scheme:dark]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
          Description <span className="text-white/40 font-normal normal-case tracking-normal">(optional — location, dress code, etc.)</span>
        </label>
        <textarea
          name="description"
          rows={3}
          placeholder="Location, dress code, etc."
          className="input-base resize-none"
        />
      </div>

      <div className="flex justify-end">
        <div className="w-full sm:w-auto sm:min-w-[160px]">
          <SubmitButton label="Create Event" pendingLabel="Creating..." />
        </div>
      </div>
    </form>
  )
}
