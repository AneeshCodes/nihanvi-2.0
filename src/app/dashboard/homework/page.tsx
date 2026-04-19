import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostHomeworkForm } from './PostHomeworkForm'
import { ArchiveButton } from './ArchiveButton'
import { ArchivedSection } from './ArchivedSection'
import { BookOpen, Clock } from 'lucide-react'

function targetLabel(hw: { targetType: string; targetLevel: string | null; targetStudent: { name: string } | null }) {
  if (hw.targetType === 'ALL')     return 'Everyone'
  if (hw.targetType === 'LEVEL')   return `Level: ${hw.targetLevel}`
  if (hw.targetType === 'STUDENT') return hw.targetStudent?.name ?? 'Unknown'
  return '—'
}

export default async function HomeworkPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const [activeHW, archivedHW, students] = await Promise.all([
    db.homework.findMany({
      where: { archived: false },
      orderBy: { postedAt: 'desc' },
      include: { targetStudent: true, submissions: true },
    }),
    db.homework.findMany({
      where: { archived: true },
      orderBy: { postedAt: 'desc' },
      include: { targetStudent: true },
    }),
    db.user.findMany({
      where: { role: 'STUDENT', active: true },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    }),
  ])

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
          <BookOpen className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-brown-dark">Homework</h1>
          <p className="text-sm text-gray-400 mt-0.5">{activeHW.length} active assignment{activeHW.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Post form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-orange" />
          <h2 className="font-semibold text-gray-700 text-sm">Post new assignment</h2>
        </div>
        <div className="p-5">
          <PostHomeworkForm students={students} />
        </div>
      </div>

      {/* Active list */}
      {activeHW.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-amber-400" />
          </div>
          <p className="text-gray-400 text-sm font-medium">No active assignments</p>
          <p className="text-gray-300 text-xs mt-1">Post one above to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active</span>
            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">{activeHW.length}</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {activeHW.map((hw) => {
              const done = hw.submissions.filter((s) => s.markedDone).length
              const total = students.length
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <li key={hw.id} className="px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs bg-orange-50 text-brand-orange border border-orange-100 px-2.5 py-0.5 rounded-full font-semibold">
                          {targetLabel(hw)}
                        </span>
                        {hw.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            Due {new Date(hw.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                      {hw.youtubeUrl ? (
                        <a
                          href={hw.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-brand-orange hover:underline truncate block"
                        >
                          {hw.youtubeUrl}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No video link</p>
                      )}
                      {hw.description && (
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{hw.description}</p>
                      )}
                      {/* Progress bar */}
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-400 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 shrink-0">{done}/{total} done</span>
                      </div>
                    </div>
                    <ArchiveButton id={hw.id} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <ArchivedSection items={archivedHW} />
    </div>
  )
}
