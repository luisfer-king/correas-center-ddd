import type { Prisma } from '../../../../generated/prisma/client.js'
import { GrupoColumnaGama } from '../../domain/grupo-columna-gama.js'
export type FilaGrupoColumnaGama = Prisma.GrupoColumnaGamaGetPayload<{}>
export function aGrupoColumnaGama(f: FilaGrupoColumnaGama): GrupoColumnaGama {
  return new GrupoColumnaGama({ ...f, fechas: { creadoEn: f.creadoEn, actualizadoEn: f.actualizadoEn, eliminadoEn: f.eliminadoEn } })
}
export function datosGrupoColumnaGama(e: GrupoColumnaGama) {
  return { ...{ codigo: e.codigo, nombre: e.nombre }, orden: e.orden, estado: e.estado, eliminadoEn: e.eliminadoEn }
}
