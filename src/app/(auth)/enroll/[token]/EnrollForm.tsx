'use client'

import { useFormState } from 'react-dom'
import { useState } from 'react'
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

const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white"
const selectClass = "border border-gray-200 rounded-lg px-3 py-3 text-sm focus:outline-none focus:border-brand-orange bg-white"

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const COUNTRY_CODES = [
  { code: '+1',   label: '🇺🇸 +1 (US/CA)' },
  { code: '+44',  label: '🇬🇧 +44 (UK)' },
  { code: '+91',  label: '🇮🇳 +91 (India)' },
  { code: '+61',  label: '🇦🇺 +61 (Australia)' },
  { code: '+971', label: '🇦🇪 +971 (UAE)' },
  { code: '+65',  label: '🇸🇬 +65 (Singapore)' },
  { code: '+60',  label: '🇲🇾 +60 (Malaysia)' },
  { code: '+64',  label: '🇳🇿 +64 (NZ)' },
  { code: '+353', label: '🇮🇪 +353 (Ireland)' },
]

function formatUSPhone(digits: string): string {
  const d = digits.replace(/\D/g, '').slice(0, 10)
  if (d.length <= 3) return d
  if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3)}`
  return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`
}

function computeAge(year: string, month: string, day: string): number | null {
  if (!year || !month || !day) return null
  const dob = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

function daysInMonth(month: string, year: string): number {
  if (!month) return 31
  return new Date(parseInt(year) || 2000, parseInt(month), 0).getDate()
}

function PhoneInput({ name, id, required }: { name: string; id: string; required?: boolean }) {
  const [countryCode, setCountryCode] = useState('+1')
  const [display, setDisplay] = useState('')

  function handleChange(raw: string) {
    if (countryCode === '+1') {
      setDisplay(formatUSPhone(raw))
    } else {
      setDisplay(raw.replace(/[^\d\s\-+()]/g, ''))
    }
  }

  function handleCodeChange(code: string) {
    setCountryCode(code)
    setDisplay('')
  }

  const digits = display.replace(/\D/g, '')
  const fullNumber = `${countryCode}${digits}`

  return (
    <div className="flex gap-2">
      <select
        value={countryCode}
        onChange={e => handleCodeChange(e.target.value)}
        className={`${selectClass} shrink-0 w-44`}
        aria-label="Country code"
      >
        {COUNTRY_CODES.map(c => (
          <option key={c.code} value={c.code}>{c.label}</option>
        ))}
      </select>
      <input
        id={id}
        type="tel"
        value={display}
        onChange={e => handleChange(e.target.value)}
        placeholder={countryCode === '+1' ? '(813) 555-0100' : 'Phone number'}
        required={required}
        className={`${inputClass} flex-1`}
      />
      <input type="hidden" name={name} value={fullNumber} />
    </div>
  )
}

function DOBPicker({ onAgeChange }: { onAgeChange: (age: number | null) => void }) {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1929 }, (_, i) => currentYear - i)

  const [month, setMonth] = useState('')
  const [day,   setDay]   = useState('')
  const [year,  setYear]  = useState('')

  function update(m: string, d: string, y: string) {
    setMonth(m); setDay(d); setYear(y)
    onAgeChange(computeAge(y, m, d))
  }

  const maxDay = daysInMonth(month, year)
  const days = Array.from({ length: maxDay }, (_, i) => i + 1)
  const dobValue = year && month && day
    ? `${year}-${month.padStart(2,'0')}-${day.padStart(2,'0')}`
    : ''

  return (
    <div>
      <div className="grid grid-cols-3 gap-2">
        {/* Month */}
        <select
          value={month}
          onChange={e => update(e.target.value, day, year)}
          className={`${selectClass} w-full`}
          aria-label="Birth month"
        >
          <option value="">Month</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={String(i + 1)}>{m}</option>
          ))}
        </select>

        {/* Day */}
        <select
          value={day}
          onChange={e => update(month, e.target.value, year)}
          className={`${selectClass} w-full`}
          aria-label="Birth day"
        >
          <option value="">Day</option>
          {days.map(d => (
            <option key={d} value={String(d)}>{d}</option>
          ))}
        </select>

        {/* Year */}
        <select
          value={year}
          onChange={e => update(month, day, e.target.value)}
          className={`${selectClass} w-full`}
          aria-label="Birth year"
        >
          <option value="">Year</option>
          {years.map(y => (
            <option key={y} value={String(y)}>{y}</option>
          ))}
        </select>
      </div>
      <input type="hidden" name="dateOfBirth" value={dobValue} />
    </div>
  )
}

export function EnrollForm({ token, prefillEmail }: { token: string; prefillEmail: string }) {
  const [state, action] = useFormState(enrollAction, null)
  const [isMinor, setIsMinor] = useState<boolean | null>(null)

  function handleAgeChange(age: number | null) {
    setIsMinor(age === null ? null : age < 18)
  }

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
        <Label htmlFor="dob-month" required>Date of birth</Label>
        <DOBPicker onAgeChange={handleAgeChange} />
        <FieldError state={state} field="dateOfBirth" />
      </div>

      {/* Parent name — only if minor or not yet determined */}
      {isMinor !== false && (
        <div>
          <Label htmlFor="parentName" required={isMinor === true}>
            Parent / guardian name
            {isMinor === null && <span className="text-gray-400 font-normal ml-1">(required if under 18)</span>}
          </Label>
          <input
            id="parentName"
            name="parentName"
            type="text"
            autoComplete="name"
            required={isMinor === true}
            className={inputClass}
          />
          <FieldError state={state} field="parentName" />
        </div>
      )}

      {/* Phone numbers */}
      <div>
        <Label htmlFor="primaryPhone" required>Primary phone</Label>
        <PhoneInput id="primaryPhone" name="primaryPhone" required />
        <FieldError state={state} field="primaryPhone" />
      </div>

      <div>
        <Label htmlFor="altPhone">Alternative phone</Label>
        <PhoneInput id="altPhone" name="altPhone" />
      </div>

      {/* Address */}
      <fieldset className="space-y-3">
        <legend className="block text-sm font-medium text-gray-700">
          Home address <span className="text-brand-red" aria-hidden="true">*</span>
        </legend>
        <input
          name="streetAddress"
          type="text"
          placeholder="Street address"
          autoComplete="address-line1"
          required
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            name="city"
            type="text"
            placeholder="City"
            autoComplete="address-level2"
            required
            className={inputClass}
          />
          <input
            name="state"
            type="text"
            placeholder="State"
            autoComplete="address-level1"
            required
            className={inputClass}
          />
        </div>
        <input
          name="zip"
          type="text"
          placeholder="ZIP / Postal code"
          autoComplete="postal-code"
          required
          className={`${inputClass} w-40`}
        />
        <FieldError state={state} field="address" />
      </fieldset>

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

      {state?.status === 'error' && state.field === 'token' && (
        <p role="alert" className="text-sm text-brand-red text-center">{state.message}</p>
      )}

      <SubmitButton label="Complete Enrollment" pendingLabel="Submitting…" />
    </form>
  )
}
