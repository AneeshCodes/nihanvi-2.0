import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { PostAnnouncementForm } from './PostAnnouncementForm'
import { AnnouncementItem } from './EditAnnouncementRow'
import { Megaphone } from 'lucide-react'

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
        <div className="w-11 h-11 rounded-2xl bg-sky-100 flex items-center justify-center shrink-0">
          <Megaphone className="w-6 h-6 text-sky-600" />
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
          <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-3">
            <Megaphone className="w-6 h-6 text-sky-300" />
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
