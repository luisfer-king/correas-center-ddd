import { solicitarApi } from '../../../../shared/api/cliente-http'
import type { ContactoPublico,SuscripcionPublica,RecepcionPublica } from '../../../../../shared/publico/captacion'
export const enviarContactoPublico=(cuerpo:ContactoPublico)=>solicitarApi<RecepcionPublica>('/api/publico/commercial/contactos',{metodo:'POST',cuerpo})
export const solicitarSuscripcionPublica=(cuerpo:SuscripcionPublica)=>solicitarApi<RecepcionPublica>('/api/publico/commercial/suscripciones',{metodo:'POST',cuerpo})
