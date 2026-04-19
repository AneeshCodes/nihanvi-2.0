'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { deleteEventAction, updateEventAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { RsvpBreakdown } from './RsvpBreakdown'

type RsvpEntry = {
  response: 'YES' | 'NO' | 'MAYBE'
  student: { name: string }
}

type EventData = {
  id: string
  title: string
  eventDate: Date
  description: string | null
  rsvps: RsvpEntry[]
}

const pad = (n: number) => String(n).padStart(2, '0')

const toDateInput = (d: Date) => {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`
}

const toTimeInput = (d: Date) => {
  const dt = new Date(d)
  return `${pad(dt.getHours())}:${pad(dt.getMinutes())}`
}

export function EventItem({ event: e, past = false }: { event: EventData; past?: boolean }) {
  const [editing, setEditing] = useState(false)
  const boundAction = updateEventAction.bind(null, e.id)
  const [state, formAction] = useFormState(boundAction, null)

  return (
    <li className={`px-5 py-4${past ? ' opacity-60' : ''}`}>
      {/* Content row */}
      <div className="flex items-start gap-3">
        <div
          className={`rounded-lg px-2 py-1 text-center min-w-[44px] shrink-0 border ${
            past
              ? 'bg-white/[0.04] border-white/[0.08]'
              : 'bg-brand-orange/10 border-brand-orange/20'
          }`}
        >
          <div className={`text-xs font-bold ${past ? 'text-white/50' : 'text-brand-orange'}`}>
            {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
          </div>
          <div className={`text-sm font-bold ${past ? 'text-white/70' : 'text-white'}`}>
            {new Date(e.eventDate).getDate()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-white/90">{e.title}</div>
          <div className="text-xs text-white/40 mt-0.5">
            {new Date(e.eventDate).toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
            })}{', '}
            {new Date(e.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
          {e.description && (
            <div className="text-xs text-white/50 mt-0.5">{e.description}</div>
          )}
          <div className="mt-1.5">
            <RsvpBreakdown rsvps={e.rsvps} />
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setEditing((ed) => !ed)}
            className="text-xs text-white/40 hover:text-brand-orange transition-colors"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <form action={deleteEventAction.bind(null, e.id)}>
            <button
              type="submit"
              className="text-xs text-white/40 hover:text-red-300 transition-colors"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {/* Inline edit form */}
      {editing && (
        <div className="mt-3 bg-white/[0.03] rounded-xl p-4 border border-white/[0.08]">
          <form action={formAction} className="space-y-3">
            {state?.status === 'error' && (
              <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{state.message}</p>
            )}
            {state?.status === 'success' && (
              <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">{state.message}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  defaultValue={e.title}
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Date</label>
                <input
                  name="eventDate"
                  type="date"
                  required
                  defaultValue={toDateInput(e.eventDate)}
                  className="input-base [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Time</label>
                <input
                  name="eventTime"
                  type="time"
                  required
                  defaultValue={toTimeInput(e.eventDate)}
                  className="input-base [color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Description / location</label>
              <textarea
                name="description"
                rows={2}
                defaultValue={e.description ?? ''}
                placeholder="Location, dress code, notes..."
                className="input-base resize-none"
              />
            </div>

            <SubmitButton label="Save changes" pendingLabel="Saving..." />
          </form>
        </div>
      )}
    </li>
  )
}
