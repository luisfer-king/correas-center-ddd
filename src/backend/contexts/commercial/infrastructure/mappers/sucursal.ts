import type { Prisma } from '../../../../generated/prisma/client.js'
import { Email, Orden } from '../../../../shared/domain/value-objects.js'
import { Ubicacion } from '../../domain/commercial-values.js'
import { Sucursal } from '../../domain/sucursal.js'

export type FilaSucursal = Prisma.SucursalGetPayload<{}>

export function aSucursal(fila: FilaSucursal): Sucursal {
    return new Sucursal({
        id: fila.id,
        empresaId: fila.empresaId,
        datos: {
            nombre: fila.nombre,
            direccion: fila.direccion,
            telefono: fila.telefono,
            email: fila.email === null ? null : Email.create(fila.email),
            horarios: fila.horarios,
            mapaIncrustado: fila.mapaIncrustado,
            ubicacion: Ubicacion.create(fila.latitud?.toString() ?? null,
                fila.longitud?.toString() ?? null),
        },
        esPrincipal: fila.esPrincipal,
        orden: Orden.create(fila.orden),
        estado: fila.estado,
        fechas: {
            creadoEn: fila.creadoEn,
            actualizadoEn: fila.actualizadoEn,
            eliminadoEn: fila.eliminadoEn,
        },
    })
}
