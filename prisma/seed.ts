// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const db = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('nihanvi123', 12)

  await db.user.upsert({
    where: { email: 'aneeshparasa@gmail.com' },
    update: {},
    create: {
      name:                 'Nihanvi Teacher',
      email:                'aneeshparasa@gmail.com',
      passwordHash,
      role:                 'TEACHER',
      active:               true,
      passwordLastChangedAt: new Date(),
    },
  })

  console.log('✓ Teacher account seeded')
  console.log('  Email:    aneeshparasa@gmail.com')
  console.log('  Password: nihanvi123  ← change this before going live')
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect())
