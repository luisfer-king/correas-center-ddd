import type { Prisma } from '../../../../generated/prisma/client.js'
import { GamaCategoria } from '../../domain/gama-categoria.js'
export type FilaGamaCategoria = Prisma.GamaCategoriaGetPayload<{}>
export function aGamaCategoria(f: FilaGamaCategoria): GamaCategoria {
  return new GamaCategoria({ ...f, fechas: { creadoEn: f.creadoEn, actualizadoEn: f.actualizadoEn, eliminadoEn: f.eliminadoEn } })
}
export function datosGamaCategoria(e: GamaCategoria) {
  return { titulo: e.titulo, descripcion: e.descripcion, imagen: e.imagen, estado: e.estado, eliminadoEn: e.eliminadoEn }
}
