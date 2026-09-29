import type { Prisma } from '../../../../generated/prisma/client.js'
import { Empresa } from '../../domain/empresa.js'

export type FilaEmpresa = Prisma.EmpresaGetPayload<{}>

export function aEmpresa(fila: FilaEmpresa): Empresa {
    return new Empresa({
        id: fila.id,
        nombre: fila.nombre,
        logo: fila.logo,
        estado: fila.estado,
        fechas: {
            creadoEn: fila.creadoEn,
            actualizadoEn: fila.actualizadoEn,
            eliminadoEn: fila.eliminadoEn,
        },
    })
}
