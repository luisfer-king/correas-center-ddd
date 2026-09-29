import type { Prisma } from '../../../../generated/prisma/client.js'
import { Lead } from '../../domain/lead.js'

export type FilaLead = Prisma.LeadGetPayload<{}>

export function aLead(fila: FilaLead): Lead {
    return new Lead({
        id: fila.id,
        empresaId: fila.empresaId,
        contactoId: fila.contactoId,
        responsableId: fila.responsableId,
        estado: fila.estado,
        creadoEn: fila.creadoEn,
        actualizadoEn: fila.actualizadoEn,
        eliminadoEn: fila.eliminadoEn,
    })
}
