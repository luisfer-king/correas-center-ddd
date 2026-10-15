import type { ConsultaPublica } from '../../ports/consulta-publica-detalle-producto.js'
import { LeerPublico, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import { sinDetallePublico, type AccesoDetallePublico } from '../../../../../shared/application/acceso-detalle-publico.js'
import type { DetalleProductoPublico } from '../../../../../../shared/publico/catalogo.js'
export class LeerDetalleProducto extends LeerPublico<DetalleProductoPublico|null,string> {
 constructor(empresas:ConsultaEmpresaPublicable, consulta:ConsultaPublica, acceso:AccesoDetallePublico=sinDetallePublico) {
  super(empresas,async(id,slug)=>{const p=await consulta.obtener(id,slug);return p?{...p,detalleCategoriasDisponible:(await acceso.permitidos(id,[p.id])).has(p.id)}:null})
 }
}
