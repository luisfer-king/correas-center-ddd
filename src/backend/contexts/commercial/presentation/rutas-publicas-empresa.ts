import type { FastifyInstance } from 'fastify'
import type { LeerEmpresa } from '../application/use-cases/publico/leer-empresa.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarEmpresaPublico(app: FastifyInstance, caso: LeerEmpresa, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/commercial/empresa', caso, empresaId, 'ninguna', 'COMMERCIAL público')
}
