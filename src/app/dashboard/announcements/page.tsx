import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostAnnouncementForm } from './PostAnnouncementForm'
import { AnnouncementItem } from './EditAnnouncementRow'

export default async function AnnouncementsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const announcements = await db.announcement.findMany({
    orderBy: { postedAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold text-brand-brown-dark">Announcements</h1>
          <p className="text-sm text-gray-400 mt-0.5">{announcements.length} total</p>
        </div>
      </div>

      {/* Post form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-brand-orange" />
          <h2 className="font-semibold text-gray-700 text-sm">Post new announcement</h2>
        </div>
        <div className="p-5">
          <PostAnnouncementForm />
        </div>
      </div>

      {/* List */}
      {announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm font-medium">No announcements yet</p>
          <p className="text-gray-300 text-xs mt-1">Post one above to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">All Announcements</span>
            <span className="text-xs text-gray-400">{announcements.length}</span>
          </div>
          <ul className="divide-y divide-gray-50">
            {announcements.map((a) => (
              <AnnouncementItem key={a.id} announcement={a} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
