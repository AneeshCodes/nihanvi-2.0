'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Music2, LogOut, ChevronDown } from 'lucide-react'

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
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isActive = (href: string) =>
    pathname === href ||
    (href !== '/dashboard' && href !== '/portal' && pathname.startsWith(href))

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0604] via-[#0f0807] to-[#0a0604]" />
        <div className="absolute top-[-200px] left-1/4 w-[700px] h-[700px] bg-brand-orange/[0.08] rounded-full blur-[140px]" />
        <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] bg-amber-600/[0.06] rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-brown-mid/[0.05] rounded-full blur-[120px]" />
      </div>

      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-2xl bg-[#0a0604]/70 border-b border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand */}
          <Link href={navItems[0].href} className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-orange to-amber-700 flex items-center justify-center shadow-lg shadow-brand-orange/30">
              <Music2 className="w-4 h-4 text-white" />
              <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
            </div>
            <span className="font-display italic text-xl text-white tracking-tight hidden sm:block">
              Nihanvi
            </span>
          </Link>

          {/* Desktop floating pill nav */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-white/[0.04] border border-white/[0.08] rounded-full p-1 backdrop-blur-xl">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-xs font-medium rounded-full transition-all duration-200 ${
                    active
                      ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/40'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Avatar menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2.5 p-1 pl-3 rounded-full hover:bg-white/[0.05] transition-colors"
              aria-label="Account menu"
              aria-expanded={menuOpen}
            >
              <span className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-[9px] text-white/35 uppercase tracking-[0.15em]">Signed in</span>
                <span className="text-xs font-medium text-white/85 truncate max-w-[140px]">
                  {userName}
                </span>
              </span>
              <span className="relative w-9 h-9 rounded-full bg-gradient-to-br from-brand-orange to-amber-700 flex items-center justify-center shadow-lg shadow-brand-orange/25 ring-1 ring-white/15">
                <span className="text-xs font-bold text-white">{initials}</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform hidden sm:block ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-raised overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <div className="text-xs text-white/40">Signed in as</div>
                  <div className="text-sm font-medium text-white/90 truncate">{userName}</div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-white/70 hover:bg-white/[0.05] hover:text-white transition-colors min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-28 lg:pb-16">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-[#0a0604]/85 border-t border-white/[0.06] pb-safe">
        <div className="flex items-stretch">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-h-[60px] relative transition-colors ${
                  active ? 'text-brand-orange' : 'text-white/45 hover:text-white/70'
                }`}
              >
                {active && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-brand-orange rounded-full shadow-[0_0_12px_rgba(232,130,12,0.8)]" />
                )}
                <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                <span className="text-[10px] font-medium tracking-tight leading-none">
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
