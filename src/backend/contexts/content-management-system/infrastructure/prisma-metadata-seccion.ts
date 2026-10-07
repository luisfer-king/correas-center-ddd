import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { RepositorioMetadataSeccion, MetadataPersistidaSeccion } from '../application/ports/repositorio-metadata-seccion.js'
import type { EscrituraContenidoSeccion } from '../application/ports/repositorio-contenido-seccion.js'
import type { MetadataSeccion } from '../domain/metadata-seccion.js'
import type { ContenidoSeccion } from '../domain/contenido-seccion.js'
import { idCMS } from '../domain/cms-values.js'
import { mapearContenidoSeccion } from './mappers/contenido-seccion.js'
import { mapearMetadataSeccion } from './mappers/metadata-seccion.js'
import { transaccionCms, gestionarCms, cambioCms, mismoCms, jsonObjetoCms, auditarCms } from './operaciones-cms.js'
import { validarContenidoSeccion } from './reglas-cms.js'

export class PrismaMetadataSeccion implements RepositorioMetadataSeccion {
  constructor(private readonly db: PrismaClient) {}
  async obtener(contenidoSeccionId: bigint): Promise<MetadataPersistidaSeccion | null> {
    const fila = await this.db.contenidoSeccion.findUnique({ where: { id: idCMS(contenidoSeccionId) } })
    if (fila === null) return null
    const entidad = mapearContenidoSeccion(fila)
    return { contenidoSeccionId: entidad.id, empresaId: entidad.empresaId, tipoSeccionId: entidad.tipoSeccionId,
      metadata: entidad.metadata, actualizadoEn: entidad.actualizadoEn }
  }
  async reemplazar(contenidoSeccionId: bigint, metadata: MetadataSeccion, actualizadoEnAnterior: Date,
    contexto: EscrituraContenidoSeccion): Promise<ContenidoSeccion> {
    return transaccionCms(this.db, async tx => {
      await gestionarCms(tx, contexto, 'metadata-seccion')
      cambioCms(actualizadoEnAnterior, contexto.cuando, contexto)
      const anterior = await tx.contenidoSeccion.findUnique({ where: { id: idCMS(contenidoSeccionId) } })
      if (!anterior || anterior.eliminadoEn !== null) throw new Error('Sección no disponible')
      if (!mismoCms(anterior.actualizadoEn, actualizadoEnAnterior)) throw new Error('Sección modificada por otra operación')
      const nueva = mapearContenidoSeccion({ ...anterior, metadata: mapearMetadataSeccion(metadata), actualizadoEn: contexto.cuando })
      await validarContenidoSeccion(tx, nueva)
      const cambio = await tx.contenidoSeccion.updateMany({ where: { id: anterior.id, actualizadoEn: actualizadoEnAnterior, eliminadoEn: null },
        data: { metadata: jsonObjetoCms(nueva.metadata), actualizadoEn: contexto.cuando } })
      if (cambio.count !== 1) throw new Error('Sección modificada por otra operación')
      await auditarCms(tx, contexto, 'metadata-seccion', 'contenido_seccion', anterior.id, anterior, nueva)
      return nueva
    })
  }
}
