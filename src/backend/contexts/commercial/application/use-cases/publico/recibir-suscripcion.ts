import type { SuscripcionPublica } from '../../../../../../shared/publico/captacion.js'
import type { RecepcionSuscripcionesPublicas } from '../../ports/recepcion-suscripciones-publicas.js'
import { EmpresaNoPublicada, type ConsultaEmpresaPublicable } from '../../../../../shared/application/lectura-publica.js'
import { emailPublico,consentimientoPublico } from './validar-captacion.js'
export class RecibirSuscripcionPublica {
 constructor(private readonly empresas:ConsultaEmpresaPublicable,private readonly suscripciones:RecepcionSuscripcionesPublicas){}
 async ejecutar(empresaId:bigint,d:SuscripcionPublica){
  if(!await this.empresas.obtener(empresaId))throw new EmpresaNoPublicada()
  consentimientoPublico(d.consentimiento);const email=emailPublico(d.email)
  if(!d.sitioWeb?.trim())await this.suscripciones.recibir(empresaId,email)
  return {recibido:true as const}
 }
}
