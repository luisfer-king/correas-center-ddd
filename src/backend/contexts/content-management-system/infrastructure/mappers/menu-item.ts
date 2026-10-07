import { MenuItem } from '../../domain/menu-item.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import type { EstadoCMS } from '../../domain/cms-values.js'
import { RutaInterna } from '../../domain/cms-values.js'

/** Campos escalares del modelo Prisma MenuItem; no requiere cliente ni conexión. */
export type FilaMenuItem = Readonly<{
  id: bigint
  menuId: bigint
  ruta: string
  orden: number
  estado: EstadoCMS
  eliminadoEn: Date | null
  creadoEn: Date
  actualizadoEn: Date
}>

export function mapearMenuItem(fila: FilaMenuItem): MenuItem {
  return new MenuItem({
    id: fila.id,
    menuId: fila.menuId,
    ruta: RutaInterna.create(fila.ruta),
    orden: Orden.create(fila.orden),
    estado: fila.estado,
    fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
  })
}
