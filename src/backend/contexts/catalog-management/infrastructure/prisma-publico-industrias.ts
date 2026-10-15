import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-industrias.js'
import { publicable, ordenPublico, paginar, nombreBuscado } from '../../../shared/infrastructure/paginacion-publica.js'
import type { ConsultaPaginaPublica } from '../../../../shared/publico/comun.js'
export class PrismaPublicoIndustrias implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, entrada: ConsultaPaginaPublica) {
  const filas = await this.db.industria.findMany({ where: { empresaId, ...publicable, ...nombreBuscado(entrada.q), ...(entrada.slug ? { slug: entrada.slug } : {}) }, select: { id: true, nombre: true, slug: true, imagen: true, orden: true }, skip: entrada.desplazamiento, take: entrada.limite + 1, orderBy: ordenPublico })
  return paginar(filas.map(f => ({ id: String(f.id), nombre: f.nombre, slug: f.slug, imagen: f.imagen, orden: f.orden })), entrada)
 }
}
