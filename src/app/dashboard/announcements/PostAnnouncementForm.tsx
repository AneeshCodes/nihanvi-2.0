'use client'

import { useFormState } from 'react-dom'
import { postAnnouncementAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { LEVELS } from '@/lib/levels'

export function PostAnnouncementForm() {
  const [state, action] = useFormState(postAnnouncementAction, null)

  return (
    <form action={action} className="space-y-4">
      {state?.status === 'success' && (
        <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">{state.message}</p>
      )}
      {state?.status === 'error' && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{state.message}</p>
      )}

      <div>
        <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
          Message <span className="text-red-300">*</span>
        </label>
        <textarea
          name="body"
          rows={4}
          required
          placeholder="Write your announcement here..."
          className="input-base resize-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
          Target level <span className="text-white/40 font-normal normal-case tracking-normal">(leave blank to send to everyone)</span>
        </label>
        <select
          name="targetLevel"
          className="input-base [color-scheme:dark]"
        >
          <option value="">— everyone —</option>
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <SubmitButton label="Post Announcement" pendingLabel="Posting..." />
    </form>
  )
}
