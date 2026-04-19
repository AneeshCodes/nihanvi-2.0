'use client'

import { archiveHomeworkAction } from './actions'

export function ArchiveButton({ id }: { id: string }) {
  async function handleClick() {
    if (!confirm('Archive this assignment? Students will no longer see it.')) return
    await archiveHomeworkAction(id)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-xs text-white/40 hover:text-red-300 transition-colors whitespace-nowrap"
    >
      Archive
    </button>
  )
}
