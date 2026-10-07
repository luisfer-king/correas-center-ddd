import type { RepositorioContenidosRegistro } from '../../ports/repositorio-contenido-registro.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms, exigirVersionCms, obtenerEditableCms } from '../../operaciones-cms.js'

export class ActivarContenidoRegistro {
  constructor(private readonly repo: RepositorioContenidosRegistro, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, id: bigint, version: Date) {
    await permitirCms(this.auth, contexto.actorId, 'contenidos_registro', 'manage')
    const entidad = await obtenerEditableCms(this.repo, id)
    exigirVersionCms(entidad.actualizadoEn, version)
    const escritura = contextoEscrituraCms(contexto, this.reloj, version)
    entidad.activar(escritura.cuando)
    await this.repo.guardar(entidad, version, escritura)
    return entidad
  }
}
