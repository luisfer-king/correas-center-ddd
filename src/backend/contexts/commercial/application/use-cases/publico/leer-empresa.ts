import type { ConsultaPublica } from '../../ports/consulta-publica-empresa.js'
import { LeerPublico, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import type { EmpresaPublica } from '../../../../../../shared/publico/comun.js'
import type { ConsultaPaginaPublica, PaginaPublica } from '../../../../../../shared/publico/comun.js'
export class LeerEmpresa extends LeerPublico<EmpresaPublica | null, void> {
 constructor(empresas: ConsultaEmpresaPublicable, consulta: ConsultaPublica) { super(empresas, (id, entrada) => consulta.obtener(id, entrada)) }
}
