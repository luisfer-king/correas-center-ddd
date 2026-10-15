import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-secciones.js'
import { publicable, ordenPublico, paginar, nombreBuscado } from '../../../shared/infrastructure/paginacion-publica.js'
import type { ConsultaPaginaPublica } from '../../../../shared/publico/comun.js'
export class PrismaPublicoSecciones implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, entrada: ConsultaPaginaPublica) {
  const filas = await this.db.contenidoSeccion.findMany({ where: { empresaId, ...publicable, mostrar: true, tipoSeccion: { ...publicable, ...(entrada.slug ? { slug: entrada.slug } : {}) } }, select: { id: true, titulo: true, subtitulo: true, descripcion: true, imagen: true, icono: true, metadata: true, orden: true, tipoSeccion: { select: { slug: true } } }, skip: entrada.desplazamiento, take: entrada.limite + 1, orderBy: ordenPublico })
  return paginar(filas.map(f => ({ id: String(f.id), tipo: f.tipoSeccion.slug, titulo: f.titulo, subtitulo: f.subtitulo, descripcion: f.descripcion, imagen: f.imagen, icono: f.icono, metadata: f.metadata && typeof f.metadata === 'object' && !Array.isArray(f.metadata) ? f.metadata as Record<string, unknown> : {}, orden: f.orden })), entrada)
 }
}
