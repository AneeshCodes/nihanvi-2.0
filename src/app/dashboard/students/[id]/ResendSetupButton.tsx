'use client'

import { useState } from 'react'
import { resendSetupLinkAction } from './actions'

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
        className="text-sm text-brand-orange hover:text-brand-brown-mid disabled:opacity-50 transition-colors min-h-[44px] inline-flex items-center gap-1.5"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
        {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent!' : 'Resend setup link'}
      </button>
      {status === 'sent' && (
        <span className="text-sm text-green-600">Setup email sent.</span>
      )}
    </div>
  )
}
