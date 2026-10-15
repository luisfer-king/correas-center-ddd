import type { FastifyInstance } from 'fastify'
import type { LeerMarcas } from '../application/use-cases/publico/leer-marcas.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarMarcasPublico(app: FastifyInstance, caso: LeerMarcas, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/catalogo/marcas', caso, empresaId, 'pagina', 'CATALOGO público')
}
