'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignOutButton } from './SignOutButton'
import {
  Music2,
  LayoutDashboard,
  Users,
  BookOpen,
  Megaphone,
  Calendar,
  CreditCard,
  Home,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface AppShellProps {
  navItems: NavItem[]
  userName: string
  initials: string
  children: React.ReactNode
}

export function AppShell({ navItems, userName, initials, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const nav = (
    <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
      {navItems.map((item) => {
        const active = pathname === item.href ||
          (item.href !== '/dashboard' && item.href !== '/portal' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 min-h-[44px] group relative
              ${active
                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/30'
                : 'text-orange-100/60 hover:bg-white/10 hover:text-white'
              }`}
          >
            <span className="w-5 h-5 shrink-0">{item.icon}</span>
            <span className="flex-1">{item.label}</span>
            {active && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
          </Link>
        )
      })}
    </nav>
  )

  const sidebar = (
    <div className="flex flex-col h-full bg-gradient-to-b from-brand-brown-dark to-[#1a0500]">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-orange flex items-center justify-center shadow-lg shadow-brand-orange/40 shrink-0">
            <Music2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-display text-base text-white leading-tight block">Nihanvi</span>
            <span className="text-[11px] text-orange-200/50 leading-tight block tracking-wide">School of Dance</span>
          </div>
        </div>
      </div>

      {nav}

      {/* User + sign out */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 py-2 mb-2 rounded-xl hover:bg-white/5 transition-colors">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-brand-brown-mid flex items-center justify-center shrink-0 shadow-md ring-2 ring-white/10">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-sm font-medium text-white/90 truncate block">{userName}</span>
            <span className="text-xs text-white/40">Signed in</span>
          </div>
        </div>
        <SignOutButton />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-60 lg:flex-col shadow-2xl">
        {sidebar}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        id="mobile-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col lg:hidden transform transition-transform duration-300 ease-in-out shadow-2xl
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebar}
      </div>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 lg:hidden shadow-sm">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          aria-label="Open menu"
          aria-expanded={sidebarOpen}
          aria-controls="mobile-sidebar"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <div className="w-6 h-6 rounded-lg bg-brand-orange flex items-center justify-center shadow-sm">
            <Music2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display text-base text-brand-brown-dark">Nihanvi</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-brand-brown-mid flex items-center justify-center shadow-sm ring-2 ring-orange-100">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
      </div>

      {/* Main content */}
      <main className="lg:pl-60 min-h-screen">
        <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
