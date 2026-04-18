import Link from 'next/link'

export default function EnrollSuccessPage() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-brand-brown-dark/5 border border-orange-100 p-7 text-center">
      <div className="flex justify-center mb-5">
        <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
      <h2 className="text-xl font-bold text-brand-brown-dark mb-2">Enrollment complete!</h2>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        Check your email for a link to set up your password and access the student portal.
      </p>
      <Link href="/login" className="text-sm text-brand-orange hover:text-brand-brown-mid transition-colors py-2 inline-flex items-center justify-center gap-1.5">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to sign in
      </Link>
    </div>
  )
}
