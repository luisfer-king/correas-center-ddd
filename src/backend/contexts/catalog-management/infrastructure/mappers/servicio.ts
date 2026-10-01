import type { Prisma } from '../../../../generated/prisma/client.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import { Servicio } from '../../domain/servicio.js'

export type FilaServicio = Prisma.ServicioGetPayload<{}>

export function aServicio(fila: FilaServicio): Servicio {
  return new Servicio({
    id: fila.id, empresaId: fila.empresaId, nombre: fila.nombre, descripcion: fila.descripcion,
    imagen: fila.imagen, orden: Orden.create(fila.orden),
    estado: fila.estado, fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
  })
}
