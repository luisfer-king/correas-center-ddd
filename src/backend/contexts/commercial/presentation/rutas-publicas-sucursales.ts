import type { FastifyInstance } from 'fastify'
import type { LeerSucursales } from '../application/use-cases/publico/leer-sucursales.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarSucursalesPublico(app: FastifyInstance, caso: LeerSucursales, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/commercial/sucursales', caso, empresaId, 'pagina', 'COMMERCIAL público')
}
