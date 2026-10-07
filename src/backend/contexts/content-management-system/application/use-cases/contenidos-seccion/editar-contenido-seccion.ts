import type { RepositorioContenidosSeccion } from '../../ports/repositorio-contenido-seccion.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms, exigirVersionCms, obtenerEditableCms } from '../../operaciones-cms.js'
import type { RepositorioTiposSeccion } from '../../ports/repositorio-tipo-seccion.js'
import { normalizarEditarContenidoSeccion } from './datos-contenido-seccion.js'
import type { DatosEditarContenidoSeccion } from './datos-contenido-seccion.js'

export class EditarContenidoSeccion {
  constructor(private readonly repo: RepositorioContenidosSeccion, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms, private readonly tipos: RepositorioTiposSeccion) {}
  async ejecutar(contexto: ContextoAccionCms, id: bigint, version: Date, entrada: DatosEditarContenidoSeccion) {
    await permitirCms(this.auth, contexto.actorId, 'contenidos_seccion', 'manage')
    const entidad = await obtenerEditableCms(this.repo, id)
    exigirVersionCms(entidad.actualizadoEn, version)
    const datos = normalizarEditarContenidoSeccion(entrada)
    const tipo = await this.tipos.obtener(entidad.tipoSeccionId)
    if (!tipo || tipo.estado !== 'activo') throw new Error('Tipo de sección no disponible')
    const escritura = contextoEscrituraCms(contexto, this.reloj, version)
    entidad.editar(datos.campos, datos.metadata, tipo, escritura.cuando)
    await this.repo.guardar(entidad, version, escritura)
    return entidad
  }
}
