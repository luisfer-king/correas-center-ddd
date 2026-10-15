import type { ConsultaPublica } from '../../ports/consulta-publica-marcas.js'
import { LeerPublico, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import type { MarcaPublica } from '../../../../../../shared/publico/catalogo.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../../shared/publico/comun.js'
export class LeerMarcas extends LeerPublico<PaginaPublica<MarcaPublica>, ConsultaPaginaPublica> {
 constructor(empresas: ConsultaEmpresaPublicable, consulta: ConsultaPublica) { super(empresas, (id, entrada) => consulta.obtener(id, entrada)) }
}
