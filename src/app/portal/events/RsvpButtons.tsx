'use client'

import { rsvpAction } from './actions'

type Response = 'YES' | 'NO' | 'MAYBE'

const options: { value: Response; label: string }[] = [
  { value: 'YES',   label: 'Going' },
  { value: 'MAYBE', label: 'Maybe' },
  { value: 'NO',    label: "Can't go" },
]

const activeStyles: Record<Response, string> = {
  YES:   'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
  MAYBE: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  NO:    'bg-red-500/15 border-red-500/30 text-red-300',
}

export function RsvpButtons({ eventId, current }: { eventId: string; current: Response | null }) {
  return (
    <div className="flex gap-2 mt-3">
      {options.map(({ value, label }) => (
        <form key={value} action={rsvpAction.bind(null, eventId, value)}>
          <button
            type="submit"
            className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium border transition-colors backdrop-blur-xl
              ${current === value
                ? activeStyles[value]
                : 'bg-white/[0.04] border-white/[0.08] text-white/60 hover:border-brand-orange/40 hover:text-brand-orange hover:bg-brand-orange/10'
              }`}
          >
            {label}
          </button>
        </form>
      ))}
    </div>
  )
}
