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
    <div className="glass px-4 py-3 flex flex-wrap gap-3 items-center">
      <span className="eyebrow">Filter by</span>

      <select
        value={level}
        onChange={e => update('level', e.target.value)}
        className="input-base [color-scheme:dark] w-auto"
      >
        <option value="">All levels</option>
        {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        <option value="none">No level assigned</option>
      </select>

      <select
        value={status}
        onChange={e => update('status', e.target.value)}
        className="input-base [color-scheme:dark] w-auto"
      >
        <option value="">Active students</option>
        <option value="inactive">Inactive students</option>
        <option value="all">All students</option>
      </select>
    </div>
  )
}
