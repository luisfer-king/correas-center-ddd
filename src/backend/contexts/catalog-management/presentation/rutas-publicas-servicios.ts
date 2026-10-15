import type { FastifyInstance } from 'fastify'
import type { LeerServicios } from '../application/use-cases/publico/leer-servicios.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarServiciosPublico(app: FastifyInstance, caso: LeerServicios, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/catalogo/servicios', caso, empresaId, 'pagina', 'CATALOGO público')
}
