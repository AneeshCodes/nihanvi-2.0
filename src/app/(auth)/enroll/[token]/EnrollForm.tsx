'use client'

import { useFormState } from 'react-dom'
import { enrollAction } from './actions'
import { SubmitButton } from '@/components/forms/SubmitButton'

function FieldError({ state, field }: { state: { status: string; message: string; field?: string } | null; field: string }) {
  if (!state || state.status !== 'error' || state.field !== field) return null
  return <p role="alert" className="mt-1 text-sm text-brand-red">{state.message}</p>
}

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1.5">
      {children}
      {required && <span className="text-brand-red ml-1" aria-hidden="true">*</span>}
    </label>
  )
}

const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange bg-white"

export function EnrollForm({ token, prefillEmail }: { token: string; prefillEmail: string }) {
  const [state, action] = useFormState(enrollAction, null)

  return (
    <form action={action} noValidate className="space-y-5">
      <input type="hidden" name="token" value={token} />

      {/* Student info */}
      <div>
        <Label htmlFor="studentName" required>Student&apos;s full name</Label>
        <input id="studentName" name="studentName" type="text" autoComplete="name" required className={inputClass} />
        <FieldError state={state} field="studentName" />
      </div>

      <div>
        <Label htmlFor="dateOfBirth" required>Date of birth</Label>
        <input id="dateOfBirth" name="dateOfBirth" type="date" required className={inputClass} />
        <FieldError state={state} field="dateOfBirth" />
      </div>

      {/* Parent/guardian */}
      <div>
        <Label htmlFor="parentName" required>Parent / guardian name</Label>
        <input id="parentName" name="parentName" type="text" autoComplete="name" required className={inputClass} />
        <FieldError state={state} field="parentName" />
      </div>

      <div>
        <Label htmlFor="primaryPhone" required>Primary phone</Label>
        <input id="primaryPhone" name="primaryPhone" type="tel" autoComplete="tel" required className={inputClass} />
        <FieldError state={state} field="primaryPhone" />
      </div>

      <div>
        <Label htmlFor="altPhone">Alternative phone</Label>
        <input id="altPhone" name="altPhone" type="tel" autoComplete="tel" className={inputClass} />
      </div>

      <div>
        <Label htmlFor="address" required>Home address</Label>
        <input id="address" name="address" type="text" autoComplete="street-address" required className={inputClass} />
        <FieldError state={state} field="address" />
      </div>

      <div>
        <Label htmlFor="email" required>Email address</Label>
        <input id="email" name="email" type="email" autoComplete="email" defaultValue={prefillEmail} required className={inputClass} />
        <FieldError state={state} field="email" />
      </div>

      {/* Background */}
      <div>
        <Label htmlFor="experience">Previous dance experience</Label>
        <textarea id="experience" name="experience" rows={3} className={inputClass} />
      </div>

      <div>
        <Label htmlFor="medicalConditions">Medical conditions / allergies</Label>
        <textarea id="medicalConditions" name="medicalConditions" rows={2} className={inputClass} />
      </div>

      {/* Interests */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Interests</p>
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
          <input type="checkbox" name="certificationInterest" className="w-4 h-4 rounded accent-brand-orange" />
          <span className="text-sm text-gray-700">Interested in certification</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
          <input type="checkbox" name="performanceInterest" className="w-4 h-4 rounded accent-brand-orange" />
          <span className="text-sm text-gray-700">Interested in performances</span>
        </label>
      </div>

      {/* Signature */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-sm text-gray-500 mb-4">
          By signing below, you confirm the information is accurate and consent to enrollment.
        </p>
        <Label htmlFor="signature" required>Full name as signature</Label>
        <input id="signature" name="signature" type="text" required className={inputClass} />
        <FieldError state={state} field="signature" />
      </div>

      {/* Generic error */}
      {state?.status === 'error' && state.field === 'token' && (
        <p role="alert" className="text-sm text-brand-red text-center">{state.message}</p>
      )}

      <SubmitButton label="Complete Enrollment" pendingLabel="Submitting…" />
    </form>
  )
}
