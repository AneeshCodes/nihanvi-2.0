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
          className={`rounded-lg px-2 py-1 text-center min-w-[44px] shrink-0 ${
            past ? 'bg-gray-100' : 'bg-brand-orange/10'
          }`}
        >
          <div className={`text-xs font-bold ${past ? 'text-gray-500' : 'text-brand-orange'}`}>
            {new Date(e.eventDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
          </div>
          <div className={`text-sm font-bold ${past ? 'text-gray-600' : 'text-brand-brown-dark'}`}>
            {new Date(e.eventDate).getDate()}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-800">{e.title}</div>
          <div className="text-xs text-gray-400 mt-0.5">
            {new Date(e.eventDate).toLocaleDateString('en-US', {
              weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
            })}{', '}
            {new Date(e.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </div>
          {e.description && (
            <div className="text-xs text-gray-500 mt-0.5">{e.description}</div>
          )}
          <div className="mt-1.5">
            <RsvpBreakdown rsvps={e.rsvps} />
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setEditing((ed) => !ed)}
            className="text-xs text-gray-400 hover:text-brand-orange transition-colors"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
          <form action={deleteEventAction.bind(null, e.id)}>
            <button
              type="submit"
              className="text-xs text-gray-400 hover:text-brand-red transition-colors"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      {/* Inline edit form */}
      {editing && (
        <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <form action={formAction} className="space-y-3">
            {state?.status === 'error' && (
              <p className="text-xs text-brand-red bg-red-50 rounded-lg px-3 py-2">{state.message}</p>
            )}
            {state?.status === 'success' && (
              <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">{state.message}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                <input
                  name="title"
                  type="text"
                  required
                  defaultValue={e.title}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                <input
                  name="eventDate"
                  type="date"
                  required
                  defaultValue={toDateInput(e.eventDate)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white [color-scheme:light]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Time</label>
                <input
                  name="eventTime"
                  type="time"
                  required
                  defaultValue={toTimeInput(e.eventDate)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white [color-scheme:light]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Description / location</label>
              <textarea
                name="description"
                rows={2}
                defaultValue={e.description ?? ''}
                placeholder="Location, dress code, notes..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white resize-none"
              />
            </div>

            <SubmitButton label="Save changes" pendingLabel="Saving..." />
          </form>
        </div>
      )}
    </li>
  )
}
