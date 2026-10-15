import type { ConsultaPublica } from '../../ports/consulta-publica-categorias.js'
import { LeerPublico, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import { sinDetallePublico, type AccesoDetallePublico } from '../../../../../shared/application/acceso-detalle-publico.js'
import type { CategoriaPublica } from '../../../../../../shared/publico/catalogo.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../../shared/publico/comun.js'
export class LeerCategorias extends LeerPublico<PaginaPublica<CategoriaPublica>,ConsultaPaginaPublica> {
 constructor(empresas:ConsultaEmpresaPublicable,consulta:ConsultaPublica,acceso:AccesoDetallePublico=sinDetallePublico) {
  super(empresas,async(id,p)=>{const pagina=await consulta.obtener(id,p),permitidos=await acceso.permitidos(id,pagina.items.map(c=>c.producto.id))
   const items=pagina.items.flatMap(c=>{const detalleDisponible=permitidos.has(c.producto.id);return p.slug&&!detalleDisponible?[]:[{...c,detalleDisponible,atributos:detalleDisponible?c.atributos:[]}]})
   return {...pagina,items}
  })
 }
}
