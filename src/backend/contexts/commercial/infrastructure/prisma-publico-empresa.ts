import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-empresa.js'
import { publicable, ordenPublico, paginar, nombreBuscado } from '../../../shared/infrastructure/paginacion-publica.js'
import type { ConsultaPaginaPublica } from '../../../../shared/publico/comun.js'
export class PrismaPublicoEmpresa implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, entrada: void) {
  const filas = await this.db.empresa.findFirst({ where: { id: empresaId, ...publicable }, select: { id: true, nombre: true, logo: true } })
  return filas ? ({ id: String(filas.id), nombre: filas.nombre, logo: filas.logo }) : null
 }
}
