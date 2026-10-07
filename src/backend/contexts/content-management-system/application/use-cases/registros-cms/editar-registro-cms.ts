import type { RepositorioRegistrosCMS } from '../../ports/repositorio-registro-cms.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms, exigirVersionCms, obtenerEditableCms } from '../../operaciones-cms.js'
import { normalizarEditarRegistroCMS } from './datos-registro-cms.js'
import type { DatosEditarRegistroCMS } from './datos-registro-cms.js'

export class EditarRegistroCMS {
  constructor(private readonly repo: RepositorioRegistrosCMS, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, id: bigint, version: Date, entrada: DatosEditarRegistroCMS) {
    await permitirCms(this.auth, contexto.actorId, 'registros_cms', 'manage')
    const entidad = await obtenerEditableCms(this.repo, id)
    exigirVersionCms(entidad.actualizadoEn, version)
    const datos = normalizarEditarRegistroCMS(entrada)
    const escritura = contextoEscrituraCms(contexto, this.reloj, version)
    entidad.editar(datos.nombre, datos.descripcion, escritura.cuando)
    await this.repo.guardar(entidad, version, escritura)
    return entidad
  }
}
