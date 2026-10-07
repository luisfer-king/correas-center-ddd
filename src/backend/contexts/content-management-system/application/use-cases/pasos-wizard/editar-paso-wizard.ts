import type { RepositorioPasosWizard } from '../../ports/repositorio-paso-wizard.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms, exigirVersionCms, obtenerEditableCms } from '../../operaciones-cms.js'
import type { FuentesWizardCms } from '../../validaciones-cms.js'
import { normalizarEditarPasoWizard } from './datos-paso-wizard.js'
import type { DatosEditarPasoWizard } from './datos-paso-wizard.js'

export class EditarPasoWizard {
  constructor(private readonly repo: RepositorioPasosWizard, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms, private readonly fuentes: FuentesWizardCms) {}
  async ejecutar(contexto: ContextoAccionCms, id: bigint, version: Date, entrada: DatosEditarPasoWizard) {
    await permitirCms(this.auth, contexto.actorId, 'pasos_wizard', 'manage')
    const entidad = await obtenerEditableCms(this.repo, id)
    exigirVersionCms(entidad.actualizadoEn, version)
    const datos = normalizarEditarPasoWizard(entrada)
    this.fuentes.validar(datos.fuenteDatos, datos.campoFiltro)
    const escritura = contextoEscrituraCms(contexto, this.reloj, version)
    entidad.editar(datos, escritura.cuando)
    await this.repo.guardar(entidad, version, escritura)
    return entidad
  }
}
