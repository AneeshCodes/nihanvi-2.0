'use client'

import { useState } from 'react'
import { unarchiveHomeworkAction } from './actions'
import { ChevronDown } from 'lucide-react'

type ArchivedHW = {
  id: string
  youtubeUrl: string
  description: string | null
  targetType: string
  targetLevel: string | null
  targetStudent: { name: string } | null
  postedAt: Date
}

function targetLabel(hw: ArchivedHW) {
  if (hw.targetType === 'ALL')     return 'Everyone'
  if (hw.targetType === 'LEVEL')   return `Level: ${hw.targetLevel}`
  if (hw.targetType === 'STUDENT') return hw.targetStudent?.name ?? 'Unknown'
  return '—'
}

export function ArchivedSection({ items }: { items: ArchivedHW[] }) {
  const [open, setOpen] = useState(false)

  if (items.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <span>Archived assignments ({items.length})</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul className="divide-y divide-gray-50 border-t border-gray-100">
          {items.map((hw) => (
            <li key={hw.id} className="px-5 py-4 opacity-60">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                      {targetLabel(hw)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{hw.youtubeUrl || '—'}</p>
                  {hw.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{hw.description}</p>
                  )}
                </div>
                <form action={unarchiveHomeworkAction.bind(null, hw.id)}>
                  <button
                    type="submit"
                    className="text-xs text-brand-orange hover:text-brand-brown-mid transition-colors whitespace-nowrap"
                  >
                    Unarchive
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
