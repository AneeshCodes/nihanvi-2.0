import crypto from 'crypto'
import { db } from './db'
import { TokenType } from '@prisma/client'

export async function createToken(
  userId: string,
  type: TokenType,
  expiresInHours: number
): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex') // 64-char hex string
  const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
  await db.token.create({ data: { userId, type, token, expiresAt } })
  return token
}

export async function validateAndConsumeToken(
  token: string,
  type: TokenType
): Promise<
  | { valid: true; userId: string }
  | { valid: false; reason: 'not_found' | 'wrong_type' | 'expired' | 'already_used' }
> {
  return db.$transaction(async (tx) => {
    const record = await tx.token.findUnique({ where: { token } })

    if (!record)                       return { valid: false, reason: 'not_found' }
    if (record.type !== type)          return { valid: false, reason: 'wrong_type' }
    if (record.expiresAt < new Date()) return { valid: false, reason: 'expired' }
    if (record.usedAt)                 return { valid: false, reason: 'already_used' }

    await tx.token.update({ where: { id: record.id }, data: { usedAt: new Date() } })
    return { valid: true, userId: record.userId }
  })
}
