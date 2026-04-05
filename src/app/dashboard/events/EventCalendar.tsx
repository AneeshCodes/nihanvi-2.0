'use client'

import { useState } from 'react'

type CalEvent = {
  id: string
  eventDate: Date
  title: string
}

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export function EventCalendar({ events }: { events: CalEvent[] }) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const firstDay    = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startPad    = firstDay.getDay()

  const eventDays = new Set(
    events
      .filter((e) => {
        const d = new Date(e.eventDate)
        return d.getFullYear() === year && d.getMonth() === month
      })
      .map((e) => new Date(e.eventDate).getDate())
  )

  const isToday = (d: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === d

  const monthLabel = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const cells: (number | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const prev = () => {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
  }
  const next = () => {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="font-semibold text-gray-800 mb-4">Event Calendar</h2>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={prev}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500 text-lg"
        >
          ‹
        </button>
        <span className="font-semibold text-gray-800 text-sm">{monthLabel}</span>
        <button
          type="button"
          onClick={next}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500 text-lg"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => (
          <div
            key={i}
            className={`min-h-[44px] flex flex-col items-center justify-start pt-1 ${
              day === null ? 'bg-gray-50/70' : ''
            }`}
          >
            {day !== null && (
              <>
                <span
                  className={`text-sm w-8 h-8 flex items-center justify-center rounded-full font-medium transition-colors ${
                    isToday(day)
                      ? 'bg-brand-orange text-white font-bold'
                      : eventDays.has(day)
                      ? 'text-brand-orange font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {day}
                </span>
                {eventDays.has(day) && !isToday(day) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-0.5" />
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
