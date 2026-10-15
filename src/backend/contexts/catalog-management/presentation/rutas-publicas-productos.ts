import type { FastifyInstance } from 'fastify'
import type { LeerProductos } from '../application/use-cases/publico/leer-productos.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarProductosPublico(app: FastifyInstance, caso: LeerProductos, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/catalogo/productos', caso, empresaId, 'pagina', 'CATALOGO público')
}
