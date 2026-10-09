import type { PrismaClient } from '../../../generated/prisma/client.js'
import { ObtenerVistaPublica } from '../application/use-cases/publico/obtener-vista-publica.js'
import { PrismaVistaPublica } from './prisma-vista-publica.js'
export function componerCmsPublico(db: PrismaClient) { return new ObtenerVistaPublica(new PrismaVistaPublica(db)) }
export function empresaPublicaDesdeEntorno(): bigint {
 const valor = process.env.PUBLIC_EMPRESA_ID
 if (!valor || !/^[1-9][0-9]{0,18}$/.test(valor) || BigInt(valor) > 9223372036854775807n) throw new Error('Configura PUBLIC_EMPRESA_ID con el ID real de la empresa pública')
 return BigInt(valor)
}
