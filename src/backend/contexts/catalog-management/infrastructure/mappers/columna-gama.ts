import type { Prisma } from '../../../../generated/prisma/client.js'
import { ColumnaGama } from '../../domain/columna-gama.js'
export type FilaColumnaGama = Prisma.ColumnaGamaGetPayload<{}>
export function aColumnaGama(f: FilaColumnaGama): ColumnaGama {
  return new ColumnaGama({ ...f, fechas: { creadoEn: f.creadoEn, actualizadoEn: f.actualizadoEn, eliminadoEn: f.eliminadoEn } })
}
export function datosColumnaGama(e: ColumnaGama) {
  return { ...{ atributoId: e.atributoId, tipoDato: e.tipoDato, ...e.presentacion }, orden: e.orden, estado: e.estado, eliminadoEn: e.eliminadoEn }
}
