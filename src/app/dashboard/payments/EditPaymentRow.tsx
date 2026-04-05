'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { updatePaymentAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

const statusStyles: Record<string, string> = {
  PAID:    'bg-green-50 text-green-700',
  PENDING: 'bg-yellow-50 text-yellow-700',
  OVERDUE: 'bg-red-50 text-brand-red',
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
            <span className="font-medium text-sm text-gray-800">{p.studentName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[p.status]}`}>
              {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
            </span>
            {p.method && (
              <span className="text-xs text-gray-400">{methodLabel[p.method]}</span>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            Due {new Date(p.dueDate).toLocaleDateString()}
            {p.paidDate && ` · Paid ${new Date(p.paidDate).toLocaleDateString()}`}
            {p.notes && ` · ${p.notes}`}
          </div>
        </div>
        <div className="text-sm font-bold text-gray-800 shrink-0">
          ${(p.amount / 100).toFixed(2)}
        </div>
        <button
          type="button"
          onClick={() => setEditing((e) => !e)}
          className="text-xs text-gray-400 hover:text-brand-orange transition-colors whitespace-nowrap"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {/* Inline edit form — full width, below content row */}
      {editing && (
        <div className="mt-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <form action={formAction} className="space-y-3">
            {state?.status === 'error' && (
              <p className="text-xs text-brand-red bg-red-50 rounded-lg px-3 py-2">{state.message}</p>
            )}
            {state?.status === 'success' && (
              <p className="text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">{state.message}</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount ($)</label>
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  required
                  defaultValue={(p.amount / 100).toFixed(2)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <select
                  name="status"
                  defaultValue={p.status}
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
                  defaultValue={p.method ?? ''}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white"
                >
                  <option value="">— none —</option>
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
                  defaultValue={toDateInput(p.paidDate)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white [color-scheme:light]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
              <input
                name="notes"
                type="text"
                defaultValue={p.notes ?? ''}
                placeholder="Optional notes..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-orange bg-white"
              />
            </div>

            <SubmitButton label="Save changes" pendingLabel="Saving..." />
          </form>
        </div>
      )}
    </li>
  )
}
