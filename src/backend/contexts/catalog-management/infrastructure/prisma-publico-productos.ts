import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-productos.js'
import { publicable, ordenPublico, paginar, nombreBuscado } from '../../../shared/infrastructure/paginacion-publica.js'
import type { ConsultaPaginaPublica } from '../../../../shared/publico/comun.js'
export class PrismaPublicoProductos implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, entrada: ConsultaPaginaPublica) {
  const filas = await this.db.producto.findMany({ where: { empresaId, ...publicable, ...nombreBuscado(entrada.q), ...(entrada.slug ? { slug: entrada.slug } : {}) }, select: { id: true, nombre: true, slug: true, imagen: true, orden: true,
   relCategoria: { where: publicable, orderBy: ordenPublico, select: { id: true, nombre: true, slug: true, uso: true } },
   relProductoMarca: { where: { estado: 'activo', marca: publicable }, orderBy: ordenPublico, select: { marca: { select: { id: true, nombre: true, slug: true, logo: true, orden: true } } } },
  }, skip: entrada.desplazamiento, take: entrada.limite + 1, orderBy: ordenPublico })
  return paginar(filas.map(f => ({ id: String(f.id), nombre: f.nombre, slug: f.slug, imagen: f.imagen, orden: f.orden,
   categorias: (f.relCategoria ?? []).map(c => ({ ...c, id: String(c.id) })),
   marcas: (f.relProductoMarca ?? []).map(({marca:m}) => ({ ...m, id: String(m.id) })),
  })), entrada)
 }
}
