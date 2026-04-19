'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-white/70
                 hover:text-white bg-white/[0.04] hover:bg-white/[0.08]
                 rounded-xl transition-all min-h-[40px] font-medium
                 border border-white/[0.07]"
    >
      <LogOut className="w-4 h-4 shrink-0" />
      Sign out
    </button>
  )
}
