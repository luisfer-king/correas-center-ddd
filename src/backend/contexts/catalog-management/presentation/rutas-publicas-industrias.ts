import type { FastifyInstance } from 'fastify'
import type { LeerIndustrias } from '../application/use-cases/publico/leer-industrias.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarIndustriasPublico(app: FastifyInstance, caso: LeerIndustrias, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/catalogo/industrias', caso, empresaId, 'pagina', 'CATALOGO público')
}
