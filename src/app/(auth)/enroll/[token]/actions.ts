'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { createToken } from '@/lib/tokens'
import { sendSetupPasswordEmail } from '@/lib/email'

export async function enrollAction(
  _prev: { status: string; message: string; field?: string } | null,
  formData: FormData
) {
  const token          = formData.get('token')         as string
  const studentName    = (formData.get('studentName')  as string).trim()
  const dobRaw         = formData.get('dateOfBirth')   as string
  const parentName     = (formData.get('parentName')   as string | null)?.trim() || null
  const primaryPhone   = (formData.get('primaryPhone') as string).trim()
  const altPhone       = (formData.get('altPhone')     as string | null)?.trim() || null
  const streetAddress  = (formData.get('streetAddress') as string).trim()
  const city           = (formData.get('city')          as string).trim()
  const stateVal       = (formData.get('state')         as string).trim()
  const zip            = (formData.get('zip')           as string).trim()
  const address        = [streetAddress, city, stateVal, zip].filter(Boolean).join(', ')
  const email          = (formData.get('email')        as string).trim()
  const experience     = (formData.get('experience')   as string | null)?.trim() || null
  const certInt        = formData.get('certificationInterest') === 'on'
  const perfInt        = formData.get('performanceInterest')   === 'on'
  const medical        = (formData.get('medicalConditions') as string | null)?.trim() || null
  const signature      = (formData.get('signature')    as string).trim()

  // Validations
  if (!studentName) return { status: 'error', message: 'Student name is required.', field: 'studentName' }
  if (!dobRaw)      return { status: 'error', message: 'Date of birth is required.', field: 'dateOfBirth' }

  // Validate DOB early so we can check age for parent name requirement
  const dateOfBirthEarly = new Date(dobRaw)
  if (isNaN(dateOfBirthEarly.getTime())) {
    return { status: 'error', message: 'Invalid date of birth.', field: 'dateOfBirth' }
  }
  const ageMs  = Date.now() - dateOfBirthEarly.getTime()
  const age    = Math.floor(ageMs / (1000 * 60 * 60 * 24 * 365.25))
  const isMinor = age < 18

  if (isMinor && !parentName) {
    return { status: 'error', message: 'Parent/guardian name is required for students under 18.', field: 'parentName' }
  }
  if (!primaryPhone) return { status: 'error', message: 'Phone number is required.', field: 'primaryPhone' }
  if (!address)     return { status: 'error', message: 'Address is required.', field: 'address' }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'Valid email is required.', field: 'email' }
  }
  if (!signature)   return { status: 'error', message: 'Signature is required.', field: 'signature' }

  // Find registration
  const registration = await db.registration.findUnique({ where: { enrollToken: token } })
  if (!registration || registration.tokenUsed) {
    return { status: 'error', message: 'This enrollment link has expired or already been used.', field: 'token' }
  }

  const dateOfBirth = dateOfBirthEarly

  // Create User + update Registration in a transaction
  const user = await db.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name:         studentName,
        email,
        passwordHash: await bcrypt.hash(crypto.randomUUID(), 12), // temp hash, overwritten on setup
        role:         'STUDENT',
        active:       true,
        registrationId: registration.id,
      },
    })

    await tx.registration.update({
      where: { id: registration.id },
      data: {
        studentName,
        dateOfBirth,
        parentName: parentName ?? '',
        primaryPhone,
        alternativePhone: altPhone,
        address,
        email,
        experience,
        certificationInterest: certInt,
        performanceInterest:   perfInt,
        medicalConditions:     medical,
        signature,
        signedDate: new Date(),
        tokenUsed:  true,
      },
    })

    return newUser
  })

  // Send setup password email
  const setupToken  = await createToken(user.id, 'SETUP', 72)
  const setupUrl    = `${process.env.NEXT_PUBLIC_SITE_URL}/setup-password/${setupToken}`
  await sendSetupPasswordEmail(email, studentName, setupUrl)

  redirect('/enroll/success')
}
