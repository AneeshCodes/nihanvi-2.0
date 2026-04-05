'use client'

import { useState } from 'react'

type RsvpEntry = {
  response: 'YES' | 'NO' | 'MAYBE'
  student: { name: string }
}

export function RsvpBreakdown({ rsvps }: { rsvps: RsvpEntry[] }) {
  const [open, setOpen] = useState(false)

  if (rsvps.length === 0) return <p className="text-xs text-gray-400">No RSVPs yet.</p>

  const going  = rsvps.filter((r) => r.response === 'YES')
  const maybe  = rsvps.filter((r) => r.response === 'MAYBE')
  const no     = rsvps.filter((r) => r.response === 'NO')

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-gray-400 hover:text-brand-orange transition-colors"
      >
        {rsvps.length} RSVP{rsvps.length !== 1 ? 's' : ''} · {going.length} going, {maybe.length} maybe, {no.length} can&apos;t
        <span className="ml-1">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-2 space-y-2">
          {[
            { label: 'Going', items: going, color: 'text-green-700 bg-green-50' },
            { label: 'Maybe', items: maybe, color: 'text-yellow-700 bg-yellow-50' },
            { label: "Can't go", items: no, color: 'text-brand-red bg-red-50' },
          ].map(({ label, items, color }) =>
            items.length > 0 ? (
              <div key={label}>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{label}</span>
                <p className="text-xs text-gray-500 mt-1 ml-1">
                  {items.map((r) => r.student.name).join(', ')}
                </p>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  )
}
