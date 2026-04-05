'use client'

import { useFormState } from 'react-dom'
import { postHomeworkAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'
import { LEVELS } from '@/lib/levels'

type Student = { id: string; name: string }

export function PostHomeworkForm({ students }: { students: Student[] }) {
  const [state, action] = useFormState(postHomeworkAction, null)

  return (
    <form action={action} className="space-y-4">
      {state?.status === 'success' && (
        <p className="text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2">{state.message}</p>
      )}
      {state?.status === 'error' && (
        <p className="text-sm text-brand-red bg-red-50 rounded-lg px-4 py-2">{state.message}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Assign to</label>
        <select
          name="targetType"
          defaultValue="ALL"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white"
        >
          <option value="ALL">Everyone</option>
          <option value="LEVEL">Level group</option>
          <option value="STUDENT">Specific student</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Level group <span className="text-gray-400">(if targeting by level)</span></label>
        <select
          name="targetLevel"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white"
        >
          <option value="">— select level —</option>
          {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Student <span className="text-gray-400">(if targeting specific student)</span></label>
        <select
          name="targetStudentId"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white"
        >
          <option value="">— select student —</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL <span className="text-brand-red">*</span></label>
        <input
          name="youtubeUrl"
          type="url"
          placeholder="https://youtube.com/..."
          required
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Practice notes or instructions..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Due date</label>
        <input
          name="dueDate"
          type="date"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white"
        />
      </div>

      <SubmitButton label="Post Homework" pendingLabel="Posting..." />
    </form>
  )
}
