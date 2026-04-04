import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { EnrollForm } from './EnrollForm'

export default async function EnrollPage({ params }: { params: { token: string } }) {
  const registration = await db.registration.findUnique({
    where: { enrollToken: params.token },
  })

  if (!registration || registration.tokenUsed) {
    notFound()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-xl font-bold text-brand-brown-dark mb-1">Enrollment Form</h2>
      <p className="text-sm text-gray-500 mb-6">
        Please fill in the details below to complete your enrollment.
      </p>
      <EnrollForm token={params.token} prefillEmail={registration.email} />
    </div>
  )
}
