import { ContenidoRegistro } from '../../domain/contenido-registro.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import type { EstadoCMS } from '../../domain/cms-values.js'

/** Campos escalares del modelo Prisma ContenidoRegistro; no requiere cliente ni conexión. */
export type FilaContenidoRegistro = Readonly<{
  id: bigint
  empresaId: bigint
  registroId: bigint
  titulo: string | null
  subtitulo: string | null
  descripcion: string | null
  icono: string | null
  stats: string | null
  orden: number
  estado: EstadoCMS
  eliminadoEn: Date | null
  creadoEn: Date
  actualizadoEn: Date
}>

export function mapearContenidoRegistro(fila: FilaContenidoRegistro): ContenidoRegistro {
  return new ContenidoRegistro({
    id: fila.id,
    empresaId: fila.empresaId,
    registroId: fila.registroId,
    orden: Orden.create(fila.orden),
    estado: fila.estado,
    fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
    campos: { titulo: fila.titulo, subtitulo: fila.subtitulo, descripcion: fila.descripcion, icono: fila.icono, stats: fila.stats },
  })
}
