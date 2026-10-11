import type { Prisma } from '../../../../generated/prisma/client.js'
import { FilaGama } from '../../domain/fila-gama.js'
export type FilaFilaGama = Prisma.FilaGamaGetPayload<{}>
export function aFilaGama(f: FilaFilaGama): FilaGama {
  return new FilaGama({ ...f, fechas: { creadoEn: f.creadoEn, actualizadoEn: f.actualizadoEn, eliminadoEn: f.eliminadoEn } })
}
export function datosFilaGama(e: FilaGama) {
  return { ...{ codigo: e.codigo, ...e.detalle }, orden: e.orden, estado: e.estado, eliminadoEn: e.eliminadoEn }
}
