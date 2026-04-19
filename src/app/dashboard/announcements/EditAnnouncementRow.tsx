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
            <span className="inline-block text-xs bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded-full font-medium mb-1 border border-brand-orange/20">
              {a.targetLevel}
            </span>
          )}
          <p className="text-sm text-white/90 whitespace-pre-wrap">{a.body}</p>
          <p className="text-xs text-white/40 mt-1">
            {new Date(a.postedAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setEditing((e) => !e)}
            className="text-xs text-white/40 hover:text-brand-orange transition-colors"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <form action={deleteAnnouncementAction.bind(null, a.id)}>
            <button
              type="submit"
              className="text-xs text-white/40 hover:text-red-300 transition-colors"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {/* Inline edit form — full width, below content row */}
      {editing && (
        <div className="mt-3 bg-white/[0.03] rounded-xl p-4 border border-white/[0.08]">
          <form action={formAction} className="space-y-3">
            {state?.status === 'error' && (
              <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{state.message}</p>
            )}
            {state?.status === 'success' && (
              <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">{state.message}</p>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Message</label>
              <textarea
                name="body"
                rows={3}
                required
                defaultValue={a.body}
                className="input-base resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Target level</label>
              <select
                name="targetLevel"
                defaultValue={a.targetLevel ?? ''}
                className="input-base [color-scheme:dark]"
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
