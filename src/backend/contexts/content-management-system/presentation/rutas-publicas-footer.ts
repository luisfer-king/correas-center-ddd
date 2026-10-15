import type { FastifyInstance } from 'fastify'
import type { LeerFooter } from '../application/use-cases/publico/leer-footer.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarFooterPublico(app: FastifyInstance, caso: LeerFooter, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/cms/footer', caso, empresaId, 'pagina', 'CMS público')
}
