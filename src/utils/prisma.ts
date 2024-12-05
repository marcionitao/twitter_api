// ficheiro de conexão com o banco de dados
import { PrismaClient } from '@prisma/client'

/**
 * O objetivo dessa linha de código é provavelmente permitir que o Prisma Client seja acessado globalmente em todo o aplicativo, sem precisar passar a instância do Prisma Client como um argumento para cada função ou módulo que precise usá-lo.
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

// se houve uma conexão com o banco de dados, use-a, senão, crie uma nova instância
export const prisma = globalForPrisma.prisma || new PrismaClient()

// se o ambiente de desenvolvimento for diferente de "production", ou seja, se for "development", defina o prisma como globalForPrisma.prisma e aproveite a minha conexão
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
