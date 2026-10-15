import type { ConsultaGamaPublica } from '../../ports/consulta-publica-gamas.js'
import type { AccesoDetallePublico } from '../../../../../shared/application/acceso-detalle-publico.js'
import { LeerPublico, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import type { GamaPublica } from '../../../../../../shared/publico/gamas.js'
export class LeerGamaCategoria extends LeerPublico<GamaPublica|null,string> {
 constructor(empresas:ConsultaEmpresaPublicable,consulta:ConsultaGamaPublica,acceso:AccesoDetallePublico) {
  super(empresas,async(id,categoria)=>{const g=await consulta.obtener(id,categoria);return g&&(await acceso.permitidos(id,[g.productoId])).has(g.productoId)?g:null})
 }
}
