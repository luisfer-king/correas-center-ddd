import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-marcas.js'
import { publicable, ordenPublico, paginar, nombreBuscado } from '../../../shared/infrastructure/paginacion-publica.js'
import type { ConsultaPaginaPublica } from '../../../../shared/publico/comun.js'
export class PrismaPublicoMarcas implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, entrada: ConsultaPaginaPublica) {
  const filas = await this.db.marca.findMany({ where: { ...publicable, ...nombreBuscado(entrada.q), relProductoMarca: { some: { estado: 'activo', producto: { empresaId, ...publicable } } } }, select: { id: true, nombre: true, slug: true, logo: true, orden: true }, skip: entrada.desplazamiento, take: entrada.limite + 1, orderBy: ordenPublico })
  return paginar(filas.map(f => ({ id: String(f.id), nombre: f.nombre, slug: f.slug, logo: f.logo, orden: f.orden })), entrada)
 }
}
