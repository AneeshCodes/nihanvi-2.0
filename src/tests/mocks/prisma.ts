import { vi, beforeEach } from 'vitest'

export const prismaM = {
  user: {
    findUnique: vi.fn(),
    create:     vi.fn(),
    update:     vi.fn(),
  },
  token: {
    create:     vi.fn(),
    findUnique: vi.fn(),
    update:     vi.fn(),
  },
  $transaction: vi.fn((fn: (tx: typeof prismaM) => unknown) => fn(prismaM)),
}

vi.mock('@/lib/db', () => ({ db: prismaM }))

beforeEach(() => {
  vi.clearAllMocks()
})
