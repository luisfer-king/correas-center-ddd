import type { Prisma } from '../../../../generated/prisma/client.js'
import { Email } from '../../../../shared/domain/value-objects.js'
import { ContactoEntrante } from '../../domain/contacto-entrante.js'

export type FilaContactoEntrante = Prisma.ContactoEntranteGetPayload<{}>

export function aContactoEntrante(fila: FilaContactoEntrante): ContactoEntrante {
    return new ContactoEntrante({
        id: fila.id,
        empresaId: fila.empresaId,
        nombre: fila.nombre,
        empresaDeclarada: fila.empresaDeclarada,
        telefono: fila.telefono,
        email: Email.create(fila.email),
        mensaje: fila.mensaje,
        estado: fila.estado,
        fechas: {
            creadoEn: fila.creadoEn,
            actualizadoEn: fila.actualizadoEn,
            eliminadoEn: fila.eliminadoEn,
        },
    })
}
