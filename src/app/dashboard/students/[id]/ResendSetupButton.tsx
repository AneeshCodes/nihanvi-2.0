'use client'

import { useState } from 'react'
import { resendSetupLinkAction } from './actions'
import { Mail, CheckCircle2 } from 'lucide-react'

export function ResendSetupButton({ userId }: { userId: string }) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function handleClick() {
    setStatus('sending')
    await resendSetupLinkAction(userId)
    setStatus('sent')
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleClick}
        disabled={status !== 'idle'}
        className="text-sm text-brand-orange hover:text-brand-yellow disabled:opacity-50 transition-colors min-h-[44px] inline-flex items-center gap-1.5"
      >
        {status === 'sent' ? <CheckCircle2 className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
        {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent!' : 'Resend setup link'}
      </button>
      {status === 'sent' && (
        <span className="text-sm text-emerald-300">Setup email sent.</span>
      )}
    </div>
  )
}
