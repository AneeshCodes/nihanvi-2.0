'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { updatePaymentAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

const statusStyles: Record<string, string> = {
  PAID:    'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20',
  PENDING: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
  OVERDUE: 'bg-red-500/10 text-red-300 border border-red-500/20',
}

const methodLabel: Record<string, string> = {
  ZELLE: 'Zelle',
  CASH:  'Cash',
  OTHER: 'Other',
}

type Payment = {
  id: string
  amount: number        // cents
  status: string
  method: string | null
  dueDate: Date
  paidDate: Date | null
  notes: string | null
  studentName: string
}

const toDateInput = (d: Date | null) => {
  if (!d) return ''
  return new Date(d).toISOString().split('T')[0]
}

export function PaymentItem({ payment: p }: { payment: Payment }) {
  const [editing, setEditing] = useState(false)
  const boundAction = updatePaymentAction.bind(null, p.id)
  const [state, formAction] = useFormState(boundAction, null)

  return (
    <li className="px-5 py-4">
      {/* Content row */}
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm text-white/90">{p.studentName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[p.status]}`}>
              {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
            </span>
            {p.method && (
              <span className="text-xs text-white/40">{methodLabel[p.method]}</span>
            )}
          </div>
          <div className="text-xs text-white/40 mt-0.5">
            Due {new Date(p.dueDate).toLocaleDateString()}
            {p.paidDate && ` · Paid ${new Date(p.paidDate).toLocaleDateString()}`}
            {p.notes && ` · ${p.notes}`}
          </div>
        </div>
        <div className="text-sm font-bold text-white/90 shrink-0">
          ${(p.amount / 100).toFixed(2)}
        </div>
        <button
          type="button"
          onClick={() => setEditing((e) => !e)}
          className="text-xs text-white/40 hover:text-brand-orange transition-colors whitespace-nowrap"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Inline edit form — full width, below content row */}
      {editing && (
        <div className="mt-3 bg-white/[0.03] rounded-xl p-4 border border-white/[0.08]">
          <form action={formAction} className="space-y-3">
            {state?.status === 'error' && (
              <p className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{state.message}</p>
            )}
            {state?.status === 'success' && (
              <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">{state.message}</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Amount ($)</label>
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  defaultValue={(p.amount / 100).toFixed(2)}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={p.status}
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
                  defaultValue={p.method ?? ''}
                  className="input-base [color-scheme:dark]"
                >
                  <option value="">— none —</option>
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
                  defaultValue={toDateInput(p.paidDate)}
                  className="input-base [color-scheme:dark]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Notes</label>
              <input
                name="notes"
                type="text"
                defaultValue={p.notes ?? ''}
                placeholder="Optional notes..."
                className="input-base"
              />
            </div>

            <SubmitButton label="Save changes" pendingLabel="Saving..." />
          </form>
        </div>
      )}
    </li>
  )
}
