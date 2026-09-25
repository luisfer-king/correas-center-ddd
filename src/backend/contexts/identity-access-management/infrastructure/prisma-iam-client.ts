import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../../generated/prisma/client.js'

// Crear una vez en la composición del backend; cerrar al finalizar la aplicación.
export function crearClienteIam(databaseUrl: string): PrismaClient {
    const url = new URL(databaseUrl)
    if (url.protocol !== 'postgresql:' && url.protocol !== 'postgres:') {
        throw new Error('DATABASE_URL debe usar PostgreSQL')
    }
    if (!url.hostname || !url.pathname || url.pathname === '/') {
        throw new Error('DATABASE_URL no incluye host o base de datos')
    }
    return new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) })
}