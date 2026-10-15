import type { ConsultaPublica } from '../../ports/consulta-publica-registros.js'
import { LeerPublico, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import type { RegistroPublicado } from '../../../../../../shared/publico/cms.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../../shared/publico/comun.js'
export class LeerRegistros extends LeerPublico<PaginaPublica<RegistroPublicado>, ConsultaPaginaPublica> {
 constructor(empresas: ConsultaEmpresaPublicable, consulta: ConsultaPublica) { super(empresas, (id, entrada) => consulta.obtener(id, entrada)) }
}
