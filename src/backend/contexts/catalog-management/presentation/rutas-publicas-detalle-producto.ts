import type { FastifyInstance } from 'fastify'
import type { LeerDetalleProducto } from '../application/use-cases/publico/leer-detalle-producto.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarDetalleProductoPublico(app: FastifyInstance, caso: LeerDetalleProducto, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/catalogo/productos/:slug', caso, empresaId, 'slug', 'CATALOGO público')
}
