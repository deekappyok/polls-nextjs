import { PrismaClient } from '@prisma/client'

const globalPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalPrisma.prisma || new PrismaClient({ log: ['query'] })

if (process.env.NODE_ENV === 'development') {
  globalPrisma.prisma = prisma
}