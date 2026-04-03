import bcrypt from 'bcryptjs'
import { db } from './db'

export async function setPassword(userId: string, newPassword: string): Promise<void> {
  const passwordHash = await bcrypt.hash(newPassword, 12)
  await db.user.update({
    where: { id: userId },
    data: {
      passwordHash,
      passwordLastChangedAt: new Date(),
    },
  })
}
