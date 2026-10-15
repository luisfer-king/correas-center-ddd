import type { FastifyInstance } from 'fastify'
import type { LeerRegistros } from '../application/use-cases/publico/leer-registros.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarRegistrosPublico(app: FastifyInstance, caso: LeerRegistros, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/cms/registros', caso, empresaId, 'pagina', 'CMS público')
}
