import type { Prisma } from '../../../../generated/prisma/client.js'
import { Sesion } from '../../domain/sesion.js'

export type FilaSesion = Prisma.SesionGetPayload<{}>
export function aSesion(fila: FilaSesion): Sesion {
    return new Sesion({
        id: fila.id, usuarioId: fila.usuarioId, huellaToken: fila.huellaToken,
        expiraEn: fila.expiraEn, revocadaEn: fila.revocadaEn, estado: fila.estado,
        fechas: { creadoEn: fila.creadoEn, actualizadoEn: fila.actualizadoEn, eliminadoEn: fila.eliminadoEn },
    })
}