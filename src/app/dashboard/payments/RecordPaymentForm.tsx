'use client'

import { useFormState } from 'react-dom'
import { recordPaymentAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

type Student = { id: string; name: string }

export function RecordPaymentForm({ students }: { students: Student[] }) {
  const [state, action] = useFormState(recordPaymentAction, null)

  return (
    <form action={action} className="space-y-4">
      {state?.status === 'success' && (
        <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">{state.message}</p>
      )}
      {state?.status === 'error' && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{state.message}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
            Student <span className="text-red-300">*</span>
          </label>
          <select
            name="studentId"
            required
            className="input-base [color-scheme:dark]"
          >
            <option value="">— select student —</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
            Amount ($) <span className="text-red-300">*</span>
          </label>
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            required
            placeholder="e.g. 120.00"
            className="input-base"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
            Due date <span className="text-red-300">*</span>
          </label>
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
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Notes</label>
        <input
          name="notes"
          type="text"
          placeholder="Optional notes..."
          className="input-base"
        />
      </div>

      <SubmitButton label="Record Payment" pendingLabel="Saving..." />
    </form>
  )
}
