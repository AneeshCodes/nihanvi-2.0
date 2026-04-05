'use client'

import { useState, useMemo } from 'react'
import { useFormState } from 'react-dom'
import { recordPaymentAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { LEVELS } from '@/lib/levels'

type LatestPayment = {
  id: string
  status: string
  amount: number
  dueDate: Date
} | null

type Student = {
  id: string
  name: string
  email: string
  levelGroup: string | null
  createdAt: Date
  latestPayment: LatestPayment
}

const statusStyles: Record<string, string> = {
  PAID:    'bg-green-50 text-green-700',
  PENDING: 'bg-yellow-50 text-yellow-700',
  OVERDUE: 'bg-red-50 text-brand-red',
}

function StudentRow({ student }: { student: Student }) {
  const [open, setOpen] = useState(false)
  const [state, formAction] = useFormState(recordPaymentAction, null)

  return (
    <li className="px-4 py-3">
      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
        {/* Name + email */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-brand-orange">{student.name}</div>
          <div className="text-xs text-gray-400">{student.email}</div>
        </div>

        {/* Level */}
        <div className="hidden sm:block text-sm text-gray-600 w-24 shrink-0">
          {student.levelGroup ?? <span className="text-gray-300">—</span>}
        </div>

        {/* Joined */}
        <div className="hidden md:block text-xs text-gray-400 w-28 shrink-0">
          {new Date(student.createdAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
          })}
        </div>

        {/* Latest payment status */}
        <div className="w-20 shrink-0">
          {student.latestPayment ? (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[student.latestPayment.status]}`}>
              {student.latestPayment.status.charAt(0) + student.latestPayment.status.slice(1).toLowerCase()}
            </span>
          ) : (
            <span className="text-xs text-gray-300">—</span>
          )}
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:border-brand-orange hover:text-brand-orange transition-colors whitespace-nowrap shrink-0"
        >
          {open ? 'Cancel' : 'Record Payment'}
        </button>
      </div>

      {/* Inline record payment form */}
      {open && (
        <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <form action={formAction} className="space-y-3">
            <input type="hidden" name="studentId" value={student.id} />

            {state?.status === 'error' && (
              <p className="text-xs text-brand-red bg-red-50 rounded-lg px-3 py-2">{state.message}</p>
            )}
            {state?.status === 'success' && (
              <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">{state.message}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount ($) *</label>
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="120.00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Due date *</label>
                <input
                  name="dueDate"
                  type="date"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white [color-scheme:light]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  name="status"
                  defaultValue="PENDING"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Method</label>
                <select
                  name="method"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white"
                >
                  <option value="">— optional —</option>
                  <option value="ZELLE">Zelle</option>
                  <option value="CASH">Cash</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date paid</label>
                <input
                  name="paidDate"
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white [color-scheme:light]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
                <input
                  name="notes"
                  type="text"
                  placeholder="Optional..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white"
                />
              </div>
            </div>

            <SubmitButton label="Record Payment" pendingLabel="Saving..." />
          </form>
        </div>
      )}
    </li>
  )
}

type Props = {
  students: Student[]
}

export function PaymentsView({ students }: Props) {
  const [search,     setSearch]     = useState('')
  const [levelFilter, setLevel]     = useState('')
  const [statusFilter, setStatus]   = useState('')
  const [sort,       setSort]       = useState<'newest' | 'oldest' | 'az'>('newest')

  const paid    = students.filter((s) => s.latestPayment?.status === 'PAID').length
  const overdue = students.filter((s) => s.latestPayment?.status === 'OVERDUE').length

  const filtered = useMemo(() => {
    let list = [...students]

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q))
    }
    if (levelFilter)  list = list.filter((s) => s.levelGroup === levelFilter)
    if (statusFilter) list = list.filter((s) => s.latestPayment?.status === statusFilter || (!s.latestPayment && statusFilter === 'NONE'))

    list.sort((a, b) => {
      if (sort === 'az')     return a.name.localeCompare(b.name)
      if (sort === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // newest
    })

    return list
  }, [students, search, levelFilter, statusFilter, sort])

  const inputClass = 'border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white'

  return (
    <div className="space-y-4">
      {/* Stats */}
      <p className="text-sm text-gray-500">
        <span className="text-green-600 font-medium">{paid} paid</span>
        {' · '}
        <span className="text-brand-red font-medium">{overdue} overdue</span>
        {' · '}
        <span className="font-medium">{students.length} total</span>
      </p>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full ${inputClass}`}
        />

        <div className="flex flex-wrap gap-2">
          <select value={levelFilter} onChange={(e) => setLevel(e.target.value)} className={inputClass}>
            <option value="">All Levels</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>

          <select value={statusFilter} onChange={(e) => setStatus(e.target.value)} className={inputClass}>
            <option value="">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className={inputClass}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Student list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">No students match your filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Column headers (desktop) */}
          <div className="hidden sm:grid grid-cols-[1fr_6rem_7rem_5rem_auto] gap-3 px-4 py-2 border-b border-gray-50">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Student</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Level</span>
            <span className="hidden md:block text-xs font-semibold text-gray-400 uppercase tracking-wide">Joined</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Latest</span>
            <span />
          </div>

          <ul className="divide-y divide-gray-50">
            {filtered.map((s) => (
              <StudentRow key={s.id} student={s} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
