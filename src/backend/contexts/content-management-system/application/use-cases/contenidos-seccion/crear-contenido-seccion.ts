import type { RepositorioContenidosSeccion } from '../../ports/repositorio-contenido-seccion.js'
import type { AutorizacionCms, ContextoAccionCms } from '../../seguridad-cms.js'
import { permitirCms } from '../../seguridad-cms.js'
import type { RelojCms } from '../../operaciones-cms.js'
import { contextoEscrituraCms } from '../../operaciones-cms.js'
import type { RepositorioTiposSeccion } from '../../ports/repositorio-tipo-seccion.js'
import { normalizarCrearContenidoSeccion } from './datos-contenido-seccion.js'
import type { DatosCrearContenidoSeccion } from './datos-contenido-seccion.js'

export class CrearContenidoSeccion {
  constructor(private readonly repo: RepositorioContenidosSeccion, private readonly auth: AutorizacionCms, private readonly reloj: RelojCms, private readonly tipos: RepositorioTiposSeccion) {}
  async ejecutar(contexto: ContextoAccionCms, entrada: DatosCrearContenidoSeccion) {
    await permitirCms(this.auth, contexto.actorId, 'contenidos_seccion', 'manage')
    const datos = normalizarCrearContenidoSeccion(entrada)
    const tipo = await this.tipos.obtener(datos.tipoSeccionId)
    if (!tipo || tipo.estado !== 'activo') throw new Error('Tipo de sección no disponible')
    tipo.validarMetadata(datos.metadata)
    const escritura = contextoEscrituraCms(contexto, this.reloj)
    return this.repo.crear(datos, escritura)
  }
}
