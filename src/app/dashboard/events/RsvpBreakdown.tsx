'use client'

import { useState } from 'react'

type RsvpEntry = {
  response: 'YES' | 'NO' | 'MAYBE'
  student: { name: string }
}

export function RsvpBreakdown({ rsvps }: { rsvps: RsvpEntry[] }) {
  const [showNames, setShowNames] = useState(false)

  const going = rsvps.filter((r) => r.response === 'YES')
  const no    = rsvps.filter((r) => r.response === 'NO')
  const maybe = rsvps.filter((r) => r.response === 'MAYBE')

  return (
    <div>
      <div className="flex items-center gap-3 flex-wrap text-xs">
        <span className="font-medium text-green-600">{going.length} Yes</span>
        <span className="font-medium text-brand-red">{no.length} No</span>
        <span className="font-medium text-yellow-600">{maybe.length} Maybe</span>
        {rsvps.length > 0 ? (
          <>
            <span className="text-gray-400">{rsvps.length} total</span>
            <button
              type="button"
              onClick={() => setShowNames((s) => !s)}
              className="text-gray-400 hover:text-brand-orange transition-colors underline underline-offset-2"
            >
              {showNames ? 'hide' : 'see who'}
            </button>
          </>
        ) : (
          <span className="text-gray-400">No responses yet</span>
        )}
      </div>

      {showNames && rsvps.length > 0 && (
        <div className="mt-2 space-y-1.5">
          {[
            { label: 'Going',    items: going, color: 'text-green-700 bg-green-50' },
            { label: 'Maybe',    items: maybe, color: 'text-yellow-700 bg-yellow-50' },
            { label: "Can't go", items: no,    color: 'text-brand-red bg-red-50' },
          ].map(({ label, items, color }) =>
            items.length > 0 ? (
              <div key={label}>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{label}</span>
                <p className="text-xs text-gray-500 mt-0.5 ml-1">
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
