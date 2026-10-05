import type { RepositorioElementosFooter } from '../../ports/repositorio-footer-elemento.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms, exigirVersionCms, obtenerEditableCms } from '../../operaciones-cms.js'

export class InactivarFooterElemento {
  constructor(private readonly repo: RepositorioElementosFooter, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, id: bigint, version: Date) {
    await permitirCms(this.auth, contexto.actorId, 'elementos_footer', 'manage')
    const entidad = await obtenerEditableCms(this.repo, id)
    exigirVersionCms(entidad.actualizadoEn, version)
    const escritura = contextoEscrituraCms(contexto, this.reloj, version)
    entidad.inactivar(escritura.cuando)
    await this.repo.guardar(entidad, version, escritura)
    return entidad
  }
}
