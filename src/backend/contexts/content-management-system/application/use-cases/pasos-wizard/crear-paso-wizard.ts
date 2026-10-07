import type { RepositorioPasosWizard } from '../../ports/repositorio-paso-wizard.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms } from '../../operaciones-cms.js'
import type { FuentesWizardCms } from '../../validaciones-cms.js'
import { normalizarCrearPasoWizard } from './datos-paso-wizard.js'
import type { DatosCrearPasoWizard } from './datos-paso-wizard.js'

export class CrearPasoWizard {
  constructor(private readonly repo: RepositorioPasosWizard, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms, private readonly fuentes: FuentesWizardCms) {}
  async ejecutar(contexto: ContextoAccionCms, entrada: DatosCrearPasoWizard) {
    await permitirCms(this.auth, contexto.actorId, 'pasos_wizard', 'manage')
    const datos = normalizarCrearPasoWizard(entrada)
    this.fuentes.validar(datos.fuenteDatos, datos.campoFiltro)
    const escritura = contextoEscrituraCms(contexto, this.reloj)
    return this.repo.crear(datos, escritura)
  }
}
