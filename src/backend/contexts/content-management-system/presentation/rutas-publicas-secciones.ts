import type { FastifyInstance } from 'fastify'
import type { LeerSecciones } from '../application/use-cases/publico/leer-secciones.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarSeccionesPublico(app: FastifyInstance, caso: LeerSecciones, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/cms/secciones', caso, empresaId, 'pagina', 'CMS público')
}
