import { enlacePublico } from '../../../../shared/publico/rutas.js'
import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-footer.js'
import { publicable, ordenPublico, paginar, nombreBuscado } from '../../../shared/infrastructure/paginacion-publica.js'
import type { ConsultaPaginaPublica } from '../../../../shared/publico/comun.js'
export class PrismaPublicoFooter implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, entrada: ConsultaPaginaPublica) {
  const filas = await this.db.footerElemento.findMany({ where: { empresaId, ...publicable, mostrar: true }, select: { id: true, tipo: true, tipoRegistro: true, registroId: true, titulo: true, url: true, icono: true, orden: true }, skip: entrada.desplazamiento, take: entrada.limite + 1, orderBy: ordenPublico })
  return paginar(filas.map(f => ({ id: String(f.id), tipo: f.tipo, tipoRegistro: f.tipoRegistro, registroId: f.registroId === null ? null : String(f.registroId), titulo: f.titulo, url: enlacePublico(f.url, true), icono: f.icono, orden: f.orden })), entrada)
 }
}
