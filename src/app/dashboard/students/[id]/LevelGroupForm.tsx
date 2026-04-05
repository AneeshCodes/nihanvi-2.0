'use client'

import { useState } from 'react'
import { updateLevelGroupAction } from './actions'
import { LEVELS } from '@/lib/levels'

export function LevelGroupForm({ userId, current }: { userId: string; current: string }) {
  const [value,  setValue]  = useState(current)
  const [saved,  setSaved]  = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await updateLevelGroupAction(userId, value)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="flex gap-3 items-center">
      <select
        value={value}
        onChange={e => { setValue(e.target.value); setSaved(false) }}
        className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm
                   focus:outline-none focus:border-brand-orange bg-white"
      >
        <option value="">— not assigned —</option>
        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-brand-orange text-white font-bold px-5 py-3 rounded-lg text-sm
                   hover:bg-brand-brown-mid transition-colors disabled:opacity-50 min-h-[44px] shrink-0"
      >
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
      </button>
    </div>
  )
}
