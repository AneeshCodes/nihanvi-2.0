'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { deleteAnnouncementAction, updateAnnouncementAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { LEVELS } from '@/lib/levels'

type Announcement = {
  id: string
  body: string
  targetLevel: string | null
  postedAt: Date
}

export function AnnouncementItem({ announcement: a }: { announcement: Announcement }) {
  const [editing, setEditing] = useState(false)
  const boundAction = updateAnnouncementAction.bind(null, a.id)
  const [state, formAction] = useFormState(boundAction, null)

  return (
    <li className="px-5 py-4">
      {/* Content row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {a.targetLevel && (
            <span className="inline-block text-xs bg-orange-50 text-brand-orange px-2 py-0.5 rounded-full font-medium mb-1">
              {a.targetLevel}
            </span>
          )}
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{a.body}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(a.postedAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            className="text-xs text-gray-400 hover:text-brand-orange transition-colors"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <form action={deleteAnnouncementAction.bind(null, a.id)}>
            <button
              type="submit"
              className="text-xs text-gray-400 hover:text-brand-red transition-colors"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {/* Inline edit form — full width, below content row */}
      {editing && (
        <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <form action={formAction} className="space-y-3">
            {state?.status === 'error' && (
              <p className="text-xs text-brand-red bg-red-50 rounded-lg px-3 py-2">{state.message}</p>
            )}
            {state?.status === 'success' && (
              <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">{state.message}</p>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Message</label>
              <textarea
                name="body"
                rows={3}
                required
                defaultValue={a.body}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Target level</label>
              <select
                name="targetLevel"
                defaultValue={a.targetLevel ?? ''}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white"
              >
                <option value="">— everyone —</option>
                {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <SubmitButton label="Save changes" pendingLabel="Saving..." />
          </form>
        </div>
      )}
    </li>
  )
}
