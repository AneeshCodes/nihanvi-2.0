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

  const levelOptions  = [
    { value: '',     label: 'All levels' },
    ...LEVELS.map(l => ({ value: l, label: l })),
    { value: 'none', label: 'No level' },
  ]

  const statusOptions = [
    { value: '',         label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'all',      label: 'Everyone' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex flex-wrap gap-3 items-center">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mr-1">Filter</span>

      {/* Level pills */}
      <div className="flex flex-wrap gap-2">
        {levelOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => update('level', opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[32px]
              ${level === opt.value
                ? 'bg-brand-orange text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-brand-orange'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-gray-200 hidden sm:block" />

      {/* Status pills */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map(opt => (
          <button
            key={opt.value}
            onClick={() => update('status', opt.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors min-h-[32px]
              ${status === opt.value
                ? 'bg-brand-brown-dark text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
