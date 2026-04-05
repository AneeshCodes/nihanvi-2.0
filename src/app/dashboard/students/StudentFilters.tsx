'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { LEVELS } from '@/lib/levels'

export function StudentFilters() {
  const router       = useRouter()
  const pathname     = usePathname()
  const searchParams = useSearchParams()

  const level  = searchParams.get('level')  ?? ''
  const status = searchParams.get('status') ?? ''

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex flex-wrap gap-3 items-center">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Filter by</span>

      <select
        value={level}
        onChange={e => update('level', e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white text-gray-700"
      >
        <option value="">All levels</option>
        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        <option value="none">No level assigned</option>
      </select>

      <select
        value={status}
        onChange={e => update('status', e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white text-gray-700"
      >
        <option value="">Active students</option>
        <option value="inactive">Inactive students</option>
        <option value="all">All students</option>
      </select>
    </div>
  )
}
