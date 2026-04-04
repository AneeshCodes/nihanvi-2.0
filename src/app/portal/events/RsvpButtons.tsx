'use client'

import { rsvpAction } from './actions'

type Response = 'YES' | 'NO' | 'MAYBE'

const options: { value: Response; label: string }[] = [
  { value: 'YES',   label: 'Going' },
  { value: 'MAYBE', label: 'Maybe' },
  { value: 'NO',    label: "Can't go" },
]

const activeStyles: Record<Response, string> = {
  YES:   'bg-green-500 text-white border-green-500',
  MAYBE: 'bg-yellow-400 text-white border-yellow-400',
  NO:    'bg-gray-400 text-white border-gray-400',
}

export function RsvpButtons({ eventId, current }: { eventId: string; current: Response | null }) {
  return (
    <div className="flex gap-2 mt-3">
      {options.map(({ value, label }) => (
        <form key={value} action={rsvpAction.bind(null, eventId, value)}>
          <button
            type="submit"
            className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium border transition-colors
              ${current === value
                ? activeStyles[value]
                : 'border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange bg-white'
              }`}
          >
            {label}
          </button>
        </form>
      ))}
    </div>
  )
}
