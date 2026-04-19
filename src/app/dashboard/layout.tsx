import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { AppShell } from '@/components/layout/AppShell'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Megaphone,
  Calendar,
  CreditCard,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard',              icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Students',  href: '/dashboard/students',     icon: <Users           className="w-5 h-5" /> },
  { label: 'Homework',  href: '/dashboard/homework',     icon: <BookOpen        className="w-5 h-5" /> },
  { label: 'Announcements', href: '/dashboard/announcements', icon: <Megaphone  className="w-5 h-5" /> },
  { label: 'Events',    href: '/dashboard/events',       icon: <Calendar        className="w-5 h-5" /> },
  { label: 'Payments',  href: '/dashboard/payments',     icon: <CreditCard      className="w-5 h-5" /> },
]

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userName = session.user?.name ?? 'Teacher'
  const initials = getInitials(userName)

  return (
    <AppShell navItems={navItems} userName={userName} initials={initials}>
      {children}
    </AppShell>
  )
}
