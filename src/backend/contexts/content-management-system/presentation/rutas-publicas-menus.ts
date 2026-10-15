import type { FastifyInstance } from 'fastify'
import type { LeerMenus } from '../application/use-cases/publico/leer-menus.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarMenusPublico(app: FastifyInstance, caso: LeerMenus, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/cms/menus', caso, empresaId, 'pagina', 'CMS público')
}
