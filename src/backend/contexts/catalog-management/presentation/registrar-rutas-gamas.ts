import type { FastifyInstance } from 'fastify'
import type { CasosIam } from '../../identity-access-management/infrastructure/componer-iam.js'
import type { SeguridadIam } from '../../identity-access-management/presentation/seguridad-http.js'
import { conContextoAuditoriaHttp } from '../../identity-access-management/infrastructure/contexto-auditoria-http.js'
import type { CasosGamas } from './http-gamas.js'
import { registrarErroresCatalogo } from './errores-http-catalogo.js'
import { rutasGamas } from './rutas-gamas.js'
import { rutasGruposColumnasGama } from './rutas-grupos-columnas-gama.js'
import { rutasGruposFilasGama } from './rutas-grupos-filas-gama.js'
import { rutasColumnasGama } from './rutas-columnas-gama.js'
import { rutasFilasGama } from './rutas-filas-gama.js'
import { rutasValoresGama } from './rutas-valores-gama.js'
import { rutasPlantillasGama } from './rutas-plantillas-gama.js'
export async function registrarRutasGamas(app:FastifyInstance,casos:CasosGamas,iam:CasosIam,config:SeguridadIam) {
 app.addHook('onRequest',(request,_reply,done)=>{
  const userAgent=request.headers['user-agent']?.replace(/[\r\n\u0000-\u001f\u007f]/g,'').slice(0,2048)||null
  conContextoAuditoriaHttp({ipAddress:request.ip||null,userAgent},done)
 })
 registrarErroresCatalogo(app)
 const contexto={app,casos,iam,config}
 rutasGamas(contexto,casos.registrarLectura)
 rutasGruposColumnasGama(contexto);rutasGruposFilasGama(contexto)
 rutasColumnasGama(contexto);rutasFilasGama(contexto)
 rutasValoresGama(contexto);rutasPlantillasGama(contexto,casos.registrarLectura)
}
