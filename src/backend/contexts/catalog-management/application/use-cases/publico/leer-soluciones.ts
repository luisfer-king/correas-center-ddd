import { LeerPublico, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import type { ConsultaPublicaSoluciones } from '../../ports/consulta-publica-soluciones.js'
import type { DetalleIndustriaPublica, DetalleServicioPublico } from '../../../../../../shared/publico/catalogo.js'
export class LeerIndustria extends LeerPublico<DetalleIndustriaPublica | null, string> {
 constructor(empresas: ConsultaEmpresaPublicable, consulta: ConsultaPublicaSoluciones) { super(empresas, (id, slug) => consulta.industria(id, slug)) }
}
export class LeerServicio extends LeerPublico<DetalleServicioPublico | null, string> {
 constructor(empresas: ConsultaEmpresaPublicable, consulta: ConsultaPublicaSoluciones) { super(empresas, (id, slug) => consulta.servicio(id, slug)) }
}
