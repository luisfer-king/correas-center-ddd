import { PasoWizard } from '../../domain/paso-wizard.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import type { EstadoCMS } from '../../domain/cms-values.js'

/** Campos escalares del modelo Prisma PasoWizard; no requiere cliente ni conexión. */
export type FilaPasoWizard = Readonly<{
  id: bigint
  empresaId: bigint
  identificador: string
  titulo: string
  descripcion: string
  fuenteDatos: string
  campoFiltro: string | null
  orden: number
  estado: EstadoCMS
  eliminadoEn: Date | null
  creadoEn: Date
  actualizadoEn: Date
}>

export function mapearPasoWizard(fila: FilaPasoWizard): PasoWizard {
  return new PasoWizard({
    id: fila.id,
    empresaId: fila.empresaId,
    identificador: fila.identificador,
    titulo: fila.titulo,
    descripcion: fila.descripcion,
    fuenteDatos: fila.fuenteDatos,
    campoFiltro: fila.campoFiltro,
    orden: Orden.create(fila.orden),
    estado: fila.estado,
    fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
  })
}
