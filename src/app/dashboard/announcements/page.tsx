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
    <div className="space-y-10">
      <header>
        <p className="eyebrow">Broadcast</p>
        <h1 className="editorial-title mt-2">Announcements</h1>
        <p className="text-sm text-white/50 mt-2">{announcements.length} total</p>
      </header>

      {/* Post form */}
      <section className="glass overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.05] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-orange shadow-[0_0_8px_rgba(232,130,12,0.8)]" />
          <h2 className="text-xs font-semibold text-white/80 uppercase tracking-widest">Post announcement</h2>
        </div>
        <div className="p-5">
          <PostAnnouncementForm />
        </div>
      </section>

      {/* List */}
      {announcements.length === 0 ? (
        <div className="glass px-6 py-14 text-center">
          <p className="text-sm text-white/50 italic">No announcements yet</p>
          <p className="text-xs text-white/30 mt-1">Post one above to get started.</p>
        </div>
      ) : (
        <div className="glass overflow-hidden">
          <div className="px-5 py-3 border-b border-white/[0.05] flex items-center justify-between">
            <span className="eyebrow">All announcements</span>
            <span className="text-xs text-white/40 font-medium">{announcements.length}</span>
          </div>
          <ul className="divide-y divide-white/[0.04]">
            {announcements.map((a) => (
              <AnnouncementItem key={a.id} announcement={a} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
