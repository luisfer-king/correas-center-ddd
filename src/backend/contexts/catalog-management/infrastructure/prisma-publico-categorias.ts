import type { PrismaClient } from '../../../generated/prisma/client.js'
import type { ConsultaPublica } from '../application/ports/consulta-publica-categorias.js'
import type { ConsultaPaginaPublica } from '../../../../shared/publico/comun.js'
import { publicable, ordenPublico, nombreBuscado, paginar } from '../../../shared/infrastructure/paginacion-publica.js'
export class PrismaPublicoCategorias implements ConsultaPublica {
 constructor(private readonly db: PrismaClient) {}
 async obtener(empresaId: bigint, p: ConsultaPaginaPublica) {
  const filas = await this.db.categoria.findMany({ where: { ...publicable, ...nombreBuscado(p.q), ...(p.slug ? { OR: [{slug:p.slug},...(p.productoSlug&&!p.slug.includes('/')?[{slug:p.productoSlug+'/'+p.slug}]:[])] } : {}), producto: { empresaId, ...publicable, ...(p.productoSlug ? { slug: p.productoSlug } : {}) } },
   orderBy: ordenPublico, skip: p.desplazamiento, take: p.limite + 1,
   select: { id: true, nombre: true, slug: true, imagen: true, descripcion: true, descripcionCorta: true, uso: true, orden: true,
    producto: { select: { id: true, nombre: true, slug: true, imagen: true, orden: true } },
    relCategoriaAtributo: { where: { estado: 'activo', atributoTecnico: { ...publicable, tipoAtributo: publicable } }, orderBy: ordenPublico,
     select: { id: true, tipoDato: true, valorTexto: true, valorBooleano: true, valorPersonalizado: true, orden: true,
      atributoTecnico: { select: { nombre: true, descripcion: true, valorNumerico: true, unidadMedida: true, tipoAtributo: { select: { nombre: true, slug: true, icono: true } } } } } },
   },
  })
  return paginar(filas.map(f => ({ id: String(f.id), nombre: f.nombre, slug: f.slug, imagen: f.imagen, descripcion: f.descripcion, descripcionCorta: f.descripcionCorta, uso: f.uso, orden: f.orden,
   producto: { ...f.producto, id: String(f.producto.id) },
   atributos: f.relCategoriaAtributo.map(a => ({ id: String(a.id), nombre: a.atributoTecnico.nombre, descripcion: a.atributoTecnico.descripcion, tipoDato: a.tipoDato,
    valor: a.tipoDato === 'booleano' ? a.valorBooleano : a.tipoDato === 'texto' ? a.valorTexto : (a.valorPersonalizado ?? a.atributoTecnico.valorNumerico)?.toString() ?? null,
    unidadMedida: a.atributoTecnico.unidadMedida, orden: a.orden, tipo: a.atributoTecnico.tipoAtributo })),
  })), p)
 }
}
