import type { FastifyInstance } from 'fastify'
import type { LeerCategorias } from '../application/use-cases/publico/leer-categorias.js'
import { registrarLecturaPublica, esquemaPaginaCategoriaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarCategoriasPublico(app: FastifyInstance, caso: LeerCategorias, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/catalogo/categorias', caso, empresaId, 'pagina', 'CATALOGO público',esquemaPaginaCategoriaPublica)
}
