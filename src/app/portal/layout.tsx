import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AppShell } from '@/components/layout/AppShell'
import { Home, Megaphone, BookOpen, Calendar } from 'lucide-react'

const navItems = [
  { label: 'Home',          href: '/portal',              icon: <Home      className="w-5 h-5" /> },
  { label: 'Announcements', href: '/portal/announcements', icon: <Megaphone className="w-5 h-5" /> },
  { label: 'Homework',      href: '/portal/homework',      icon: <BookOpen  className="w-5 h-5" /> },
  { label: 'Events',        href: '/portal/events',        icon: <Calendar  className="w-5 h-5" /> },
]

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userName = session.user?.name ?? 'Student'
  const initials = getInitials(userName)

  return (
    <AppShell navItems={navItems} userName={userName} initials={initials}>
      {children}
    </AppShell>
  )
}
