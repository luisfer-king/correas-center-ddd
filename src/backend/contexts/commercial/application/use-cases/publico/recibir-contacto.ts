import type { ContactoPublico } from '../../../../../../shared/publico/captacion.js'
import type { RecepcionContactosPublicos } from '../../ports/recepcion-contactos-publicos.js'
import { EmpresaNoPublicada, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import { textoPublico,emailPublico,consentimientoPublico } from './validar-captacion.js'
export class RecibirContactoPublico {
 constructor(private readonly empresas:ConsultaEmpresaPublicable,private readonly contactos:RecepcionContactosPublicos){}
 async ejecutar(empresaId:bigint,d:ContactoPublico){
  if(!await this.empresas.obtener(empresaId))throw new EmpresaNoPublicada()
  consentimientoPublico(d.consentimiento)
  const datos={empresaId,nombre:textoPublico(d.nombre,'Nombre',120,2),empresaDeclarada:d.empresaDeclarada?.trim()?textoPublico(d.empresaDeclarada,'Empresa',160):null,telefono:textoPublico(d.telefono,'Teléfono',40,5),email:emailPublico(d.email),mensaje:textoPublico(d.mensaje,'Mensaje',5000,10)}
  if(!d.sitioWeb?.trim())await this.contactos.recibir(datos)
  return {recibido:true as const}
 }
}
