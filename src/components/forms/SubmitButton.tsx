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
      className={`btn-primary ${className ?? ''}`}
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
