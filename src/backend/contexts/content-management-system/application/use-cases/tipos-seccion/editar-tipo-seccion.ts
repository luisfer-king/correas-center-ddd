import type { RepositorioTiposSeccion } from '../../ports/repositorio-tipo-seccion.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms, exigirVersionCms, obtenerEditableCms } from '../../operaciones-cms.js'
import { normalizarEditarTipoSeccion } from './datos-tipo-seccion.js'
import type { DatosEditarTipoSeccion } from './datos-tipo-seccion.js'

export class EditarTipoSeccion {
  constructor(private readonly repo: RepositorioTiposSeccion, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms) {}
  async ejecutar(contexto: ContextoAccionCms, id: bigint, version: Date, entrada: DatosEditarTipoSeccion) {
    await permitirCms(this.auth, contexto.actorId, 'tipos_seccion', 'manage')
    const entidad = await obtenerEditableCms(this.repo, id)
    exigirVersionCms(entidad.actualizadoEn, version)
    const datos = normalizarEditarTipoSeccion(entrada)
    const escritura = contextoEscrituraCms(contexto, this.reloj, version)
    entidad.editar(datos.nombre, datos.descripcion, datos.icono, escritura.cuando)
    await this.repo.guardar(entidad, version, escritura)
    return entidad
  }
}
