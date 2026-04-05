import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostHomeworkForm } from './PostHomeworkForm'
import { ArchiveButton } from './ArchiveButton'
import { ArchivedSection } from './ArchivedSection'

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
      <h1 className="text-2xl font-bold text-brand-brown-dark">Homework</h1>

      {/* Post form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Post new assignment</h2>
        <PostHomeworkForm students={students} />
      </div>

      {/* Active list */}
      {activeHW.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-gray-400 text-sm">No active assignments.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-50">
            {activeHW.map((hw) => {
              const done = hw.submissions.filter((s) => s.markedDone).length
              return (
                <li key={hw.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs bg-orange-50 text-brand-orange px-2 py-0.5 rounded-full font-medium">
                          {targetLabel(hw)}
                        </span>
                        {hw.dueDate && (
                          <span className="text-xs text-gray-400">
                            Due {new Date(hw.dueDate).toLocaleDateString()}
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
                        <p className="text-xs text-gray-500 mt-0.5">{hw.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {done} student{done !== 1 ? 's' : ''} marked done
                      </p>
                    </div>
                    <ArchiveButton id={hw.id} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Archived */}
      <ArchivedSection items={archivedHW} />
    </div>
  )
}
