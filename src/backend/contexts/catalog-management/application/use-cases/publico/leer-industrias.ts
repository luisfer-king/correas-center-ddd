import type { ConsultaPublica } from '../../ports/consulta-publica-industrias.js'
import { LeerPublico, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import type { IndustriaPublica } from '../../../../../../shared/publico/catalogo.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../../shared/publico/comun.js'
export class LeerIndustrias extends LeerPublico<PaginaPublica<IndustriaPublica>, ConsultaPaginaPublica> {
 constructor(empresas: ConsultaEmpresaPublicable, consulta: ConsultaPublica) { super(empresas, (id, entrada) => consulta.obtener(id, entrada)) }
}
