import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-registros.js'
import { publicable, ordenPublico, paginar, nombreBuscado } from '../../../shared/infrastructure/paginacion-publica.js'
import type { ConsultaPaginaPublica } from '../../../../shared/publico/comun.js'
export class PrismaPublicoRegistros implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, entrada: ConsultaPaginaPublica) {
  const filas = await this.db.registroCMS.findMany({ where: { ...publicable, ...(entrada.slug ? { identificador: entrada.slug } : {}), relContenidoRegistro: { some: { empresaId, ...publicable } } }, select: { id: true, identificador: true, nombre: true, descripcion: true, orden: true, relContenidoRegistro: { where: { empresaId, ...publicable }, orderBy: ordenPublico, select: { id: true, titulo: true, subtitulo: true, descripcion: true, icono: true, orden: true } } }, skip: entrada.desplazamiento, take: entrada.limite + 1, orderBy: ordenPublico })
  return paginar(filas.map(f => ({ id: String(f.id), identificador: f.identificador, nombre: f.nombre, descripcion: f.descripcion, orden: f.orden, contenidos: f.relContenidoRegistro.map(c => ({ id: String(c.id), titulo: c.titulo, subtitulo: c.subtitulo, descripcion: c.descripcion, icono: c.icono, orden: c.orden })) })), entrada)
 }
}
