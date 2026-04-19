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
  PAID:    'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  PENDING: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  OVERDUE: 'bg-red-500/10 text-red-300 border border-red-500/20',
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
          <div className="text-xs text-white/40">{student.email}</div>
        </div>

        {/* Level */}
        <div className="hidden sm:block text-sm text-white/70 w-24 shrink-0">
          {student.levelGroup ?? <span className="text-white/25">—</span>}
        </div>

        {/* Joined */}
        <div className="hidden md:block text-xs text-white/40 w-28 shrink-0">
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
            <span className="text-xs text-white/25">—</span>
          )}
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-xs border border-white/[0.08] rounded-lg px-3 py-1.5 text-white/70 hover:border-brand-orange hover:text-brand-orange transition-colors whitespace-nowrap shrink-0 bg-white/[0.02]"
        >
          {open ? 'Cancel' : 'Record Payment'}
        </button>
      </div>

      {/* Inline record payment form */}
      {open && (
        <div className="mt-3 bg-white/[0.03] rounded-xl p-4 border border-white/[0.08]">
          <form action={formAction} className="space-y-3">
            <input type="hidden" name="studentId" value={student.id} />

            {state?.status === 'error' && (
              <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{state.message}</p>
            )}
            {state?.status === 'success' && (
              <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">{state.message}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Amount ($) *</label>
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  placeholder="120.00"
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Due date *</label>
                <input
                  name="dueDate"
                  type="date"
                  required
                  className="input-base [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Status</label>
                <select
                  name="status"
                  defaultValue="PENDING"
                  className="input-base [color-scheme:dark]"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Method</label>
                <select
                  name="method"
                  className="input-base [color-scheme:dark]"
                >
                  <option value="">— optional —</option>
                  <option value="ZELLE">Zelle</option>
                  <option value="CASH">Cash</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Date paid</label>
                <input
                  name="paidDate"
                  type="date"
                  className="input-base [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Notes</label>
                <input
                  name="notes"
                  type="text"
                  placeholder="Optional..."
                  className="input-base"
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

  return (
    <div className="space-y-4">
      {/* Stats */}
      <p className="text-sm text-white/50">
        <span className="text-emerald-300 font-medium">{paid} paid</span>
        {' · '}
        <span className="text-red-300 font-medium">{overdue} overdue</span>
        {' · '}
        <span className="font-medium text-white/70">{students.length} total</span>
      </p>

      {/* Filters */}
      <div className="glass p-4 space-y-3">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-base w-full"
        />

        <div className="flex flex-wrap gap-2">
          <select value={levelFilter} onChange={(e) => setLevel(e.target.value)} className="input-base [color-scheme:dark] w-auto">
            <option value="">All Levels</option>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>

          <select value={statusFilter} onChange={(e) => setStatus(e.target.value)} className="input-base [color-scheme:dark] w-auto">
            <option value="">All Statuses</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="input-base [color-scheme:dark] w-auto">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">Name A–Z</option>
          </select>
        </div>
      </div>

      {/* Student list */}
      {filtered.length === 0 ? (
        <div className="glass p-8 text-center">
          <p className="text-white/40 text-sm">No students match your filters.</p>
        </div>
      ) : (
        <div className="glass overflow-hidden">
          {/* Column headers (desktop) */}
          <div className="hidden sm:grid grid-cols-[1fr_6rem_7rem_5rem_auto] gap-3 px-4 py-2 border-b border-white/[0.05]">
            <span className="eyebrow">Student</span>
            <span className="eyebrow">Level</span>
            <span className="hidden md:block eyebrow">Joined</span>
            <span className="eyebrow">Latest</span>
            <span />
          </div>

          <ul className="divide-y divide-white/[0.05]">
            {filtered.map((s) => (
              <StudentRow key={s.id} student={s} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
