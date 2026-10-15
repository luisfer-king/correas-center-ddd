import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-detalle-producto.js'
import { publicable, ordenPublico } from '../../../shared/infrastructure/paginacion-publica.js'
export class PrismaPublicoDetalleProducto implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, slug: string) {
  const f = await this.db.producto.findFirst({ where: { empresaId, slug, ...publicable }, select: {
   id: true, nombre: true, slug: true, imagen: true, orden: true,
   relCategoria: { where: publicable, orderBy: ordenPublico, select: { id: true, nombre: true, slug: true, imagen: true, descripcion: true, descripcionCorta: true, uso: true, orden: true } },
   relProductoMarca: { where: { estado: 'activo', marca: publicable }, orderBy: ordenPublico, select: { marca: { select: { id: true, nombre: true, slug: true, logo: true, orden: true } } } },
  } })
  if (!f) return null
  return { id: String(f.id), nombre: f.nombre, slug: f.slug, imagen: f.imagen, orden: f.orden,
   categorias: f.relCategoria.map(c => ({ ...c, id: String(c.id) })),
   marcas: f.relProductoMarca.map(({ marca: m }) => ({ id: String(m.id), nombre: m.nombre, slug: m.slug, logo: m.logo, orden: m.orden })),
  }
 }
}
