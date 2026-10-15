import type { ConsultaPublica } from '../../ports/consulta-publica-productos.js'
import { LeerPublico, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import type { ProductoPublico } from '../../../../../../shared/publico/catalogo.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../../shared/publico/comun.js'
export class LeerProductos extends LeerPublico<PaginaPublica<ProductoPublico>, ConsultaPaginaPublica> {
 constructor(empresas: ConsultaEmpresaPublicable, consulta: ConsultaPublica) { super(empresas, (id, entrada) => consulta.obtener(id, entrada)) }
}
