import type { Prisma } from '../../../../generated/prisma/client.js'
import { Email } from '../../../../shared/domain/value-objects.js'
import { Suscriptor } from '../../domain/suscriptor.js'

export type FilaSuscriptor = Prisma.SuscriptorGetPayload<{}>

export function aSuscriptor(fila: FilaSuscriptor): Suscriptor {
    return new Suscriptor({
        id: fila.id,
        empresaId: fila.empresaId,
        email: Email.create(fila.email),
        nombre: fila.nombre,
        estado: fila.estado,
        emailVerificadoEn: fila.emailVerificadoEn,
        fechas: {
            creadoEn: fila.creadoEn,
            actualizadoEn: fila.actualizadoEn,
            eliminadoEn: fila.eliminadoEn,
        },
    })
}
