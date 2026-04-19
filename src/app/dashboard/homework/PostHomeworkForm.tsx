'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { postHomeworkAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { LEVELS } from '@/lib/levels'

type Student = { id: string; name: string }

export function PostHomeworkForm({ students }: { students: Student[] }) {
  const [state, action]     = useFormState(postHomeworkAction, null)
  const [targetType, setTargetType] = useState('ALL')

  return (
    <form action={action} className="space-y-4">
      {state?.status === 'success' && (
        <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">{state.message}</p>
      )}
      {state?.status === 'error' && (
        <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">{state.message}</p>
      )}

      <div>
        <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Assign to</label>
        <select
          name="targetType"
          value={targetType}
          onChange={e => setTargetType(e.target.value)}
          className="input-base [color-scheme:dark]"
        >
          <option value="ALL">Everyone</option>
          <option value="LEVEL">Level group</option>
          <option value="STUDENT">Specific student</option>
        </select>
      </div>

      {targetType === 'LEVEL' && (
        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
            Level group <span className="text-red-300">*</span>
          </label>
          <select
            name="targetLevel"
            className="input-base [color-scheme:dark]"
          >
            <option value="">— select level —</option>
            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      )}

      {targetType === 'STUDENT' && (
        <div>
          <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">
            Student <span className="text-red-300">*</span>
          </label>
          <select
            name="targetStudentId"
            className="input-base [color-scheme:dark]"
          >
            <option value="">— select student —</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">YouTube URL</label>
        <input
          name="youtubeUrl"
          type="url"
          placeholder="https://youtube.com/..."
          className="input-base"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Practice notes or instructions..."
          className="input-base resize-none"
        />
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-white/50 uppercase tracking-widest mb-1">Due date</label>
        <input
          name="dueDate"
          type="date"
          className="input-base [color-scheme:dark]"
        />
      </div>

      <SubmitButton label="Post Homework" pendingLabel="Posting..." />
    </form>
  )
}
