'use client'

import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps {
  label: string
  pendingLabel?: string
  className?: string
}

export function SubmitButton({ label, pendingLabel = 'Please wait…', className }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full bg-brand-orange text-white font-semibold py-3 rounded-xl text-sm
                 hover:bg-brand-brown-mid transition-all duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2 min-h-[44px]
                 shadow-md shadow-brand-orange/25 hover:shadow-lg hover:shadow-brand-orange/30 ${className ?? ''}`}
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{pendingLabel}</span>
        </>
      ) : (
        label
      )}
    </button>
  )
}
