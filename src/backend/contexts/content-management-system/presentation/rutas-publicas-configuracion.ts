import type { FastifyInstance } from 'fastify'
import type { LeerConfiguracion } from '../application/use-cases/publico/leer-configuracion.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarConfiguracionPublico(app: FastifyInstance, caso: LeerConfiguracion, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/cms/configuracion', caso, empresaId, 'ninguna', 'CMS público')
}
