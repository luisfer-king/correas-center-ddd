import type { RepositorioPasosWizard } from '../../ports/repositorio-paso-wizard.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { FuentesWizardCms } from '../../validaciones-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms, exigirVersionCms, obtenerEditableCms } from '../../operaciones-cms.js'

export class ActivarPasoWizard {
  constructor(private readonly repo: RepositorioPasosWizard, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms, private readonly fuentes: FuentesWizardCms) {}
  async ejecutar(contexto: ContextoAccionCms, id: bigint, version: Date) {
    await permitirCms(this.auth, contexto.actorId, 'pasos_wizard', 'manage')
    const entidad = await obtenerEditableCms(this.repo, id)
    exigirVersionCms(entidad.actualizadoEn, version)
    const escritura = contextoEscrituraCms(contexto, this.reloj, version)
    this.fuentes.validar(entidad.fuenteDatos, entidad.campoFiltro)
    entidad.activar(escritura.cuando)
    await this.repo.guardar(entidad, version, escritura)
    return entidad
  }
}
