import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-pasos-wizard.js'
import { publicable, ordenPublico, paginar, nombreBuscado } from '../../../shared/infrastructure/paginacion-publica.js'
import type { ConsultaPaginaPublica } from '../../../../shared/publico/comun.js'
export class PrismaPublicoPasosWizard implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, entrada: ConsultaPaginaPublica) {
  const filas = await this.db.pasoWizard.findMany({ where: { empresaId, ...publicable }, select: { id: true, identificador: true, titulo: true, descripcion: true, fuenteDatos: true, campoFiltro: true, orden: true }, skip: entrada.desplazamiento, take: entrada.limite + 1, orderBy: ordenPublico })
  return paginar(filas.map(f => ({ id: String(f.id), identificador: f.identificador, titulo: f.titulo, descripcion: f.descripcion, fuenteDatos: f.fuenteDatos, campoFiltro: f.campoFiltro, orden: f.orden })), entrada)
 }
}
