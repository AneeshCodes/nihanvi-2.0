// src/components/forms/SubmitButton.tsx
'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  label: string
  pendingLabel?: string
}

export function SubmitButton({ label, pendingLabel = 'Please wait…' }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-brand-orange text-white font-bold py-4 rounded-lg text-sm
                 hover:bg-brand-brown-mid transition-colors disabled:opacity-50
                 flex items-center justify-center gap-2 min-h-[44px]"
    >
      {pending ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>{pendingLabel}</span>
        </>
      ) : (
        label
      )}
    </button>
  )
}
