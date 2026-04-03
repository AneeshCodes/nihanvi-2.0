// prisma.config.ts  — must be at the project root, NOT inside prisma/
import { defineConfig } from 'prisma/config'
import dotenv from 'dotenv'
import path from 'path'

// Load .env.local for local dev. Vercel injects DATABASE_URL directly.
dotenv.config({ path: path.join(process.cwd(), '.env.local') })

export default defineConfig({
  schema: 'prisma/schema.prisma',
})
