import { LeerPublico, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import type { ConsultaPublica } from '../../ports/consulta-publica-menus.js'
import type { ResolverDestinosPublicos } from '../../ports/resolver-destinos-publicos.js'
import { rutaProductoPublica, rutaCategoriaPublica, enlacePublico } from '../../../../../../shared/publico/rutas.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../../shared/publico/comun.js'
import type { MenuPublicado } from '../../../../../../shared/publico/cms.js'
export class LeerMenus extends LeerPublico<PaginaPublica<MenuPublicado>, ConsultaPaginaPublica> {
 constructor(empresas: ConsultaEmpresaPublicable, consulta: ConsultaPublica, resolver: ResolverDestinosPublicos) {
  super(empresas, async (id, p) => {
   const pagina = await consulta.obtener(id, p)
   const refs = pagina.items.flatMap(m => [{ tipo: m.tipoRegistro, id: m.registroId }, ...m.items.filter(i => i.categoriaId).map(i => ({ tipo: 'categoria', id: i.categoriaId! }))])
   const destinos = new Map((await resolver.resolver(id, refs)).map(d => [d.tipo + ':' + d.id, d]))
   const items = pagina.items.flatMap(m => {
    const destino = destinos.get(m.tipoRegistro + ':' + m.registroId), ruta = m.tipoRegistro==='producto'&&destino?enlacePublico(rutaProductoPublica(destino.slug)):enlacePublico(m.ruta)
    if (!destino || !ruta) return []
    return [{ ...m, nombre: destino.nombre, ruta, items: m.items.flatMap(i => {
     const categoria = i.categoriaId ? destinos.get('categoria:' + i.categoriaId) : null
     if (i.categoriaId && (!categoria || m.tipoRegistro !== 'producto' || categoria.productoId !== m.registroId)) return []
     const enlace = enlacePublico(m.cargarSubmenu ? (categoria? rutaCategoriaPublica(destino.slug,categoria.slug):i.ruta) : ruta)
     return enlace ? [{ ...i, nombre: i.nombre || categoria?.nombre || '', ruta: enlace }] : []
    }) }]
   })
   // El cursor avanza por los registros consultados, incluso si algún vínculo ya no es publicable.
   return { ...pagina, items }
  })
 }
}
