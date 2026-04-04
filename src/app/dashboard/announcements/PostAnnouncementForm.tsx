'use client'

import { useFormState } from 'react-dom'
import { postAnnouncementAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

export function PostAnnouncementForm() {
  const [state, action] = useFormState(postAnnouncementAction, null)

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
          Message <span className="text-brand-red">*</span>
        </label>
        <textarea
          name="body"
          rows={4}
          required
          placeholder="Write your announcement here..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target level <span className="text-gray-400">(leave blank to send to everyone)</span>
        </label>
        <input
          name="targetLevel"
          type="text"
          placeholder="e.g. Beginner"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white"
        />
      </div>

      <SubmitButton label="Post Announcement" pendingLabel="Posting..." />
    </form>
  )
}
