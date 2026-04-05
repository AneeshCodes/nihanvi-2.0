'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { LEVELS } from '@/lib/levels'

export function StudentFilters() {
  const router      = useRouter()
  const pathname    = usePathname()
  const searchParams = useSearchParams()

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  const level  = searchParams.get('level')  ?? ''
  const status = searchParams.get('status') ?? ''

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={level}
        onChange={e => update('level', e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white"
      >
        <option value="">All levels</option>
        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        <option value="none">No level assigned</option>
      </select>

      <select
        value={status}
        onChange={e => update('status', e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white"
      >
        <option value="">Active only</option>
        <option value="inactive">Inactive only</option>
        <option value="all">All students</option>
      </select>
    </div>
  )
}
