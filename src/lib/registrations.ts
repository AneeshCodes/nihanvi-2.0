import { db } from './db'
import crypto from 'crypto'

export async function createInvite(email: string): Promise<string> {
  // Generate a unique enroll token
  const token = crypto.randomBytes(32).toString('hex')
  // Store a minimal Registration shell with just the email + token
  await db.registration.create({
    data: {
      studentName: '',
      dateOfBirth: new Date(0),   // placeholder — student fills this in
      parentName: '',
      primaryPhone: '',
      address: '',
      email,
      certificationInterest: false,
      performanceInterest: false,
      signature: '',
      signedDate: new Date(0),     // placeholder
      enrollToken: token,
    },
  })
  return token
}
