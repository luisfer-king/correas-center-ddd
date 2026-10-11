import type { Prisma } from '../../../../generated/prisma/client.js'
import { GrupoFilaGama } from '../../domain/grupo-fila-gama.js'
export type FilaGrupoFilaGama = Prisma.GrupoFilaGamaGetPayload<{}>
export function aGrupoFilaGama(f: FilaGrupoFilaGama): GrupoFilaGama {
  return new GrupoFilaGama({ ...f, fechas: { creadoEn: f.creadoEn, actualizadoEn: f.actualizadoEn, eliminadoEn: f.eliminadoEn } })
}
export function datosGrupoFilaGama(e: GrupoFilaGama) {
  return { ...{ codigo: e.codigo, nombre: e.nombre }, orden: e.orden, estado: e.estado, eliminadoEn: e.eliminadoEn }
}
