import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ReferenciaPublica, DestinoPublico } from '../../../../shared/publico/catalogo.js'
import type { ConsultaDestinosPublicos } from '../application/ports/consulta-publica-destinos.js'
import { publicable } from '../../../shared/infrastructure/paginacion-publica.js'
import { slugServicio } from '../../../../shared/publico/rutas.js'
export class PrismaPublicoDestinos implements ConsultaDestinosPublicos {
 constructor(private readonly db: PrismaClient) {}
 async resolver(empresaId: bigint, referencias: ReferenciaPublica[]): Promise<DestinoPublico[]> {
  const ids = (tipo: string) => [...new Set(referencias.filter(r => r.tipo === tipo && /^[1-9][0-9]{0,18}$/.test(r.id) && BigInt(r.id) <= 9223372036854775807n).map(r => r.id))].map(BigInt)
  const [productos, industrias, servicios, categorias] = await Promise.all([
   this.db.producto.findMany({ where: { id: { in: ids('producto') }, empresaId, ...publicable }, select: { id: true, nombre: true, slug: true } }),
   this.db.industria.findMany({ where: { id: { in: ids('industria') }, empresaId, ...publicable }, select: { id: true, nombre: true, slug: true } }),
   this.db.servicio.findMany({ where: { id: { in: ids('servicio') }, empresaId, ...publicable }, select: { id: true, nombre: true } }),
   this.db.categoria.findMany({ where: { id: { in: ids('categoria') }, ...publicable, producto: { empresaId, ...publicable } }, select: { id: true, nombre: true, slug: true, productoId: true } }),
  ])
  return [
   ...productos.map(p => ({ tipo: 'producto', id: String(p.id), nombre: p.nombre, slug: p.slug })),
   ...industrias.map(p => ({ tipo: 'industria', id: String(p.id), nombre: p.nombre, slug: p.slug })),
   ...servicios.map(p => ({ tipo: 'servicio', id: String(p.id), nombre: p.nombre, slug: slugServicio(p.nombre) })),
   ...categorias.map(p => ({ tipo: 'categoria', id: String(p.id), nombre: p.nombre, slug: p.slug, productoId: String(p.productoId) })),
  ]
 }
}
