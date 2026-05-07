import { PrismaClient } from '@prisma/client'

// ─── Prisma Client Singleton ──────────────────────────────────────────────────
// Padrão recomendado para evitar múltiplas instâncias em desenvolvimento (HMR).
// Em produção, sempre cria uma única instância.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// ─── Re-exporta tipos do Prisma para conveniência ─────────────────────────────
export type {
  Lead,
  Client,
  Project,
  Delivery,
  AutomationTemplate,
  AutomationExecution,
  LeadStatus,
  ServiceType,
  ProjectStatus,
  AutomationStatus,
} from '@prisma/client'

export { Prisma } from '@prisma/client'
