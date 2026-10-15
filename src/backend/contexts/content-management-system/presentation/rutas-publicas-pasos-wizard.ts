import type { FastifyInstance } from 'fastify'
import type { LeerPasosWizard } from '../application/use-cases/publico/leer-pasos-wizard.js'
import { registrarLecturaPublica } from '../../../shared/presentation/lecturas-publicas-http.js'
export function registrarPasosWizardPublico(app: FastifyInstance, caso: LeerPasosWizard, empresaId: bigint) {
 registrarLecturaPublica(app, '/api/publico/cms/pasos-wizard', caso, empresaId, 'pagina', 'CMS público')
}
