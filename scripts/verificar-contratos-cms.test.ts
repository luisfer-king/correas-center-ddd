import { test } from 'node:test'
import assert from 'node:assert/strict'
import { servidorCms } from '../src/backend/contexts/content-management-system/presentation/tests/soporte-http-cms.js'
import { entrada } from '../src/backend/contexts/content-management-system/application/tests/soporte-pruebas-cms.js'
import { construirDatosCms, valoresInicialesCms } from '../src/frontend/features/cms/presentation/campos-cms'
import { idRutaCms, validarVersionCms } from '../src/frontend/features/cms/api/operaciones-cms'
import { metadataSeccionApi } from '../src/frontend/features/cms/api/cliente-metadata-seccion'
import { capacidadesCmsApi } from '../src/frontend/features/cms/api/cliente-capacidades'
import { tipos_seccionApi } from '../src/frontend/features/cms/api/cliente-tipos-seccion'
import { vistaTipoSeccion } from '../src/frontend/features/cms/presentation/vista-tipos-seccion'
import { contenidos_seccionApi } from '../src/frontend/features/cms/api/cliente-contenidos-seccion'
import { vistaContenidoSeccion } from '../src/frontend/features/cms/presentation/vista-contenidos-seccion'
import { menusApi } from '../src/frontend/features/cms/api/cliente-menus'
import { vistaMenu } from '../src/frontend/features/cms/presentation/vista-menus'
import { items_menuApi } from '../src/frontend/features/cms/api/cliente-items-menu'
import { vistaMenuItem } from '../src/frontend/features/cms/presentation/vista-items-menu'
import { elementos_footerApi } from '../src/frontend/features/cms/api/cliente-elementos-footer'
import { vistaFooterElemento } from '../src/frontend/features/cms/presentation/vista-elementos-footer'
import { configuracion_sitioApi } from '../src/frontend/features/cms/api/cliente-configuracion-sitio'
import { vistaConfiguracionSitio } from '../src/frontend/features/cms/presentation/vista-configuracion-sitio'
import { pasos_wizardApi } from '../src/frontend/features/cms/api/cliente-pasos-wizard'
import { vistaPasoWizard } from '../src/frontend/features/cms/presentation/vista-pasos-wizard'
import { registros_cmsApi } from '../src/frontend/features/cms/api/cliente-registros-cms'
import { vistaRegistroCMS } from '../src/frontend/features/cms/presentation/vista-registros-cms'
import { contenidos_registroApi } from '../src/frontend/features/cms/api/cliente-contenidos-registro'
import { vistaContenidoRegistro } from '../src/frontend/features/cms/presentation/vista-contenidos-registro'
// Transporte de prueba: pasa las solicitudes reales del cliente por los esquemas,
// casos de uso y repositorios del backend con persistencia en memoria.
async function conectar(modelo: string, t: { after: (fn: () => unknown) => void }) {
 const servidor = await servidorCms(modelo); const original = globalThis.fetch
 globalThis.fetch = (async (ruta: string, init?: RequestInit) => {
  const headers = Object.fromEntries(new Headers(init?.headers).entries())
  assert.equal(init?.credentials,'same-origin')
  if (init?.method !== 'GET') assert.equal(headers['x-portal-request'],'1')
  headers.cookie='cc_portal_local=ok'; headers.origin='http://localhost:5173'
  const respuesta = await servidor.app.inject({method:init?.method as 'GET'|'POST'|'PATCH'|'PUT',url:ruta,headers,payload:init?.body as string | undefined})
  return new Response(respuesta.body,{status:respuesta.statusCode,headers:{'content-type':'application/json'}})
 }) as typeof fetch
 t.after(async()=>{globalThis.fetch=original;await servidor.app.close()})
 return servidor
}
test('Contrato frontend/backend: tipos-seccion', async t => {
 const servidor = await conectar('tipoSeccion',t)
 const vista = vistaTipoSeccion
 const original = JSON.parse(JSON.stringify(entrada('TipoSeccion'), (_k,v)=>typeof v==='bigint'?v.toString():v))
 const crear = construirDatosCms(vista.crear,valoresInicialesCms(vista.crear,original))
 assert.deepEqual(crear,original)
 const filas = await vista.api.listar({limite:25,desplazamiento:0}); assert.ok(filas.length)
 const actual = await vista.api.obtener('2'); assert.equal(String(actual.id),'2')
 const nuevo = await vista.api.crear(crear); assert.equal(String(nuevo.id),'99'); for (const k of Object.keys(crear)) assert.deepEqual(nuevo[k],crear[k], `Creación preserva ${k}`)
 const editar = construirDatosCms(vista.editar,valoresInicialesCms(vista.editar,actual))
 const editado = await vista.api.editar('2',actual.actualizadoEn,editar)
 assert.ok(editado.actualizadoEn); for (const k of Object.keys(editar)) assert.deepEqual(editado[k],editar[k], `Edición preserva ${k}`)
 await assert.rejects(vista.api.editar('2',actual.actualizadoEn,editar),e => e instanceof Error && 'estado' in e && e.estado===409)
 const accion = await vista.api.accion('2',editado.actualizadoEn,'reordenar', {orden:7})
 assert.equal(accion.orden,7)
 servidor.env.opciones.permiso=false
 await assert.rejects(tipos_seccionApi.obtener('2'),e=>e instanceof Error && 'estado' in e && e.estado===403)
})
test('Contrato frontend/backend: contenidos-seccion', async t => {
 const servidor = await conectar('contenidoSeccion',t)
 const vista = vistaContenidoSeccion
 const original = JSON.parse(JSON.stringify(entrada('ContenidoSeccion'), (_k,v)=>typeof v==='bigint'?v.toString():v))
 const crear = construirDatosCms(vista.crear,valoresInicialesCms(vista.crear,original))
 assert.deepEqual(crear,original)
 const filas = await vista.api.listar({limite:25,desplazamiento:0}); assert.ok(filas.length)
 const actual = await vista.api.obtener('2'); assert.equal(String(actual.id),'2')
 const nuevo = await vista.api.crear(crear); assert.equal(String(nuevo.id),'99'); for (const k of Object.keys(crear)) assert.deepEqual(nuevo[k],crear[k], `Creación preserva ${k}`)
 const editar = construirDatosCms(vista.editar,valoresInicialesCms(vista.editar,actual))
 const editado = await vista.api.editar('2',actual.actualizadoEn,editar)
 assert.ok(editado.actualizadoEn); for (const k of Object.keys(editar)) assert.deepEqual(editado[k],editar[k], `Edición preserva ${k}`)
 await assert.rejects(vista.api.editar('2',actual.actualizadoEn,editar),e => e instanceof Error && 'estado' in e && e.estado===409)
 const accion = await vista.api.accion('2',editado.actualizadoEn,'reordenar', {orden:7})
 assert.equal(accion.orden,7)
 servidor.env.opciones.permiso=false
 await assert.rejects(contenidos_seccionApi.obtener('2'),e=>e instanceof Error && 'estado' in e && e.estado===403)
})
test('Contrato frontend/backend: menus', async t => {
 const servidor = await conectar('menu',t)
 const vista = vistaMenu
 const original = JSON.parse(JSON.stringify(entrada('Menu'), (_k,v)=>typeof v==='bigint'?v.toString():v))
 const crear = construirDatosCms(vista.crear,valoresInicialesCms(vista.crear,original))
 assert.deepEqual(crear,original)
 const filas = await vista.api.listar({limite:25,desplazamiento:0}); assert.ok(filas.length)
 const actual = await vista.api.obtener('2'); assert.equal(String(actual.id),'2')
 const nuevo = await vista.api.crear(crear); assert.equal(String(nuevo.id),'99'); for (const k of Object.keys(crear)) assert.deepEqual(nuevo[k],crear[k], `Creación preserva ${k}`)
 const editar = construirDatosCms(vista.editar,valoresInicialesCms(vista.editar,actual))
 const editado = await vista.api.editar('2',actual.actualizadoEn,editar)
 assert.ok(editado.actualizadoEn); for (const k of Object.keys(editar)) assert.deepEqual(editado[k],editar[k], `Edición preserva ${k}`)
 await assert.rejects(vista.api.editar('2',actual.actualizadoEn,editar),e => e instanceof Error && 'estado' in e && e.estado===409)
 const accion = await vista.api.accion('2',editado.actualizadoEn,'reordenar', {orden:7})
 assert.equal(accion.orden,7)
 servidor.env.opciones.permiso=false
 await assert.rejects(menusApi.obtener('2'),e=>e instanceof Error && 'estado' in e && e.estado===403)
})
test('Contrato frontend/backend: items-menu', async t => {
 const servidor = await conectar('menuItem',t)
 const vista = vistaMenuItem
 const original = JSON.parse(JSON.stringify(entrada('MenuItem'), (_k,v)=>typeof v==='bigint'?v.toString():v))
 const crear = construirDatosCms(vista.crear,valoresInicialesCms(vista.crear,original))
 assert.deepEqual(crear,original)
 const filas = await vista.api.listar({limite:25,desplazamiento:0}); assert.ok(filas.length)
 const actual = await vista.api.obtener('2'); assert.equal(String(actual.id),'2')
 const nuevo = await vista.api.crear(crear); assert.equal(String(nuevo.id),'99'); for (const k of Object.keys(crear)) assert.deepEqual(nuevo[k],crear[k], `Creación preserva ${k}`)
 const editar = construirDatosCms(vista.editar,valoresInicialesCms(vista.editar,actual))
 const editado = await vista.api.editar('2',actual.actualizadoEn,editar)
 assert.ok(editado.actualizadoEn); for (const k of Object.keys(editar)) assert.deepEqual(editado[k],editar[k], `Edición preserva ${k}`)
 await assert.rejects(vista.api.editar('2',actual.actualizadoEn,editar),e => e instanceof Error && 'estado' in e && e.estado===409)
 const accion = await vista.api.accion('2',editado.actualizadoEn,'reordenar', {orden:7})
 assert.equal(accion.orden,7)
 servidor.env.opciones.permiso=false
 await assert.rejects(items_menuApi.obtener('2'),e=>e instanceof Error && 'estado' in e && e.estado===403)
})
test('Contrato frontend/backend: elementos-footer', async t => {
 const servidor = await conectar('footerElemento',t)
 const vista = vistaFooterElemento
 const original = JSON.parse(JSON.stringify(entrada('FooterElemento'), (_k,v)=>typeof v==='bigint'?v.toString():v))
 const crear = construirDatosCms(vista.crear,valoresInicialesCms(vista.crear,original))
 assert.deepEqual(crear,original)
 const filas = await vista.api.listar({limite:25,desplazamiento:0}); assert.ok(filas.length)
 const actual = await vista.api.obtener('2'); assert.equal(String(actual.id),'2')
 const nuevo = await vista.api.crear(crear); assert.equal(String(nuevo.id),'99'); for (const k of Object.keys(crear)) assert.deepEqual(nuevo[k],crear[k], `Creación preserva ${k}`)
 const editar = construirDatosCms(vista.editar,valoresInicialesCms(vista.editar,actual))
 const editado = await vista.api.editar('2',actual.actualizadoEn,editar)
 assert.ok(editado.actualizadoEn); for (const k of Object.keys(editar)) assert.deepEqual(editado[k],editar[k], `Edición preserva ${k}`)
 await assert.rejects(vista.api.editar('2',actual.actualizadoEn,editar),e => e instanceof Error && 'estado' in e && e.estado===409)
 const accion = await vista.api.accion('2',editado.actualizadoEn,'reordenar', {orden:7})
 assert.equal(accion.orden,7)
 servidor.env.opciones.permiso=false
 await assert.rejects(elementos_footerApi.obtener('2'),e=>e instanceof Error && 'estado' in e && e.estado===403)
})
test('Contrato frontend/backend: configuracion-sitio', async t => {
 const servidor = await conectar('configuracionSitio',t)
 const vista = vistaConfiguracionSitio
 const original = JSON.parse(JSON.stringify(entrada('ConfiguracionSitio'), (_k,v)=>typeof v==='bigint'?v.toString():v))
 const crear = construirDatosCms(vista.crear,valoresInicialesCms(vista.crear,original))
 assert.deepEqual(crear,original)
 const filas = await vista.api.listar({limite:25,desplazamiento:0}); assert.ok(filas.length)
 const actual = await vista.api.obtener('2'); assert.equal(String(actual.id),'2')
 const nuevo = await vista.api.crear(crear); assert.equal(String(nuevo.id),'99'); for (const k of Object.keys(crear)) assert.deepEqual(nuevo[k],crear[k], `Creación preserva ${k}`)
 const editar = construirDatosCms(vista.editar,valoresInicialesCms(vista.editar,actual))
 const editado = await vista.api.editar('2',actual.actualizadoEn,editar)
 assert.ok(editado.actualizadoEn); for (const k of Object.keys(editar)) assert.deepEqual(editado[k],editar[k], `Edición preserva ${k}`)
 await assert.rejects(vista.api.editar('2',actual.actualizadoEn,editar),e => e instanceof Error && 'estado' in e && e.estado===409)
 const accion = await vista.api.accion('2',editado.actualizadoEn,'actividad', {activo:false})
 assert.equal(accion.activo,false)
 servidor.env.opciones.permiso=false
 await assert.rejects(configuracion_sitioApi.obtener('2'),e=>e instanceof Error && 'estado' in e && e.estado===403)
})
test('Contrato frontend/backend: pasos-wizard', async t => {
 const servidor = await conectar('pasoWizard',t)
 const vista = vistaPasoWizard
 const original = JSON.parse(JSON.stringify(entrada('PasoWizard'), (_k,v)=>typeof v==='bigint'?v.toString():v))
 const crear = construirDatosCms(vista.crear,valoresInicialesCms(vista.crear,original))
 assert.deepEqual(crear,original)
 const filas = await vista.api.listar({limite:25,desplazamiento:0}); assert.ok(filas.length)
 const actual = await vista.api.obtener('2'); assert.equal(String(actual.id),'2')
 const nuevo = await vista.api.crear(crear); assert.equal(String(nuevo.id),'99'); for (const k of Object.keys(crear)) assert.deepEqual(nuevo[k],crear[k], `Creación preserva ${k}`)
 const editar = construirDatosCms(vista.editar,valoresInicialesCms(vista.editar,actual))
 const editado = await vista.api.editar('2',actual.actualizadoEn,editar)
 assert.ok(editado.actualizadoEn); for (const k of Object.keys(editar)) assert.deepEqual(editado[k],editar[k], `Edición preserva ${k}`)
 await assert.rejects(vista.api.editar('2',actual.actualizadoEn,editar),e => e instanceof Error && 'estado' in e && e.estado===409)
 const accion = await vista.api.accion('2',editado.actualizadoEn,'reordenar', {orden:7})
 assert.equal(accion.orden,7)
 servidor.env.opciones.permiso=false
 await assert.rejects(pasos_wizardApi.obtener('2'),e=>e instanceof Error && 'estado' in e && e.estado===403)
})
test('Contrato frontend/backend: registros-cms', async t => {
 const servidor = await conectar('registroCMS',t)
 const vista = vistaRegistroCMS
 const original = JSON.parse(JSON.stringify(entrada('RegistroCMS'), (_k,v)=>typeof v==='bigint'?v.toString():v))
 const crear = construirDatosCms(vista.crear,valoresInicialesCms(vista.crear,original))
 assert.deepEqual(crear,original)
 const filas = await vista.api.listar({limite:25,desplazamiento:0}); assert.ok(filas.length)
 const actual = await vista.api.obtener('2'); assert.equal(String(actual.id),'2')
 const nuevo = await vista.api.crear(crear); assert.equal(String(nuevo.id),'99'); for (const k of Object.keys(crear)) assert.deepEqual(nuevo[k],crear[k], `Creación preserva ${k}`)
 const editar = construirDatosCms(vista.editar,valoresInicialesCms(vista.editar,actual))
 const editado = await vista.api.editar('2',actual.actualizadoEn,editar)
 assert.ok(editado.actualizadoEn); for (const k of Object.keys(editar)) assert.deepEqual(editado[k],editar[k], `Edición preserva ${k}`)
 await assert.rejects(vista.api.editar('2',actual.actualizadoEn,editar),e => e instanceof Error && 'estado' in e && e.estado===409)
 const accion = await vista.api.accion('2',editado.actualizadoEn,'reordenar', {orden:7})
 assert.equal(accion.orden,7)
 servidor.env.opciones.permiso=false
 await assert.rejects(registros_cmsApi.obtener('2'),e=>e instanceof Error && 'estado' in e && e.estado===403)
})
test('Contrato frontend/backend: contenidos-registro', async t => {
 const servidor = await conectar('contenidoRegistro',t)
 const vista = vistaContenidoRegistro
 const original = JSON.parse(JSON.stringify(entrada('ContenidoRegistro'), (_k,v)=>typeof v==='bigint'?v.toString():v))
 const crear = construirDatosCms(vista.crear,valoresInicialesCms(vista.crear,original))
 assert.deepEqual(crear,original)
 const filas = await vista.api.listar({limite:25,desplazamiento:0}); assert.ok(filas.length)
 const actual = await vista.api.obtener('2'); assert.equal(String(actual.id),'2')
 const nuevo = await vista.api.crear(crear); assert.equal(String(nuevo.id),'99'); for (const k of Object.keys(crear)) assert.deepEqual(nuevo[k],crear[k], `Creación preserva ${k}`)
 const editar = construirDatosCms(vista.editar,valoresInicialesCms(vista.editar,actual))
 const editado = await vista.api.editar('2',actual.actualizadoEn,editar)
 assert.ok(editado.actualizadoEn); for (const k of Object.keys(editar)) assert.deepEqual(editado[k],editar[k], `Edición preserva ${k}`)
 await assert.rejects(vista.api.editar('2',actual.actualizadoEn,editar),e => e instanceof Error && 'estado' in e && e.estado===409)
 const accion = await vista.api.accion('2',editado.actualizadoEn,'reordenar', {orden:7})
 assert.equal(accion.orden,7)
 servidor.env.opciones.permiso=false
 await assert.rejects(contenidos_registroApi.obtener('2'),e=>e instanceof Error && 'estado' in e && e.estado===403)
})
test('Contrato de metadata y capacidades',async t=>{
 await conectar('contenidoSeccion',t)
 const caps=await capacidadesCmsApi();assert.equal(caps.recursos.metadata_seccion.gestionar,true)
 const datos=await metadataSeccionApi.obtener('2');assert.equal(datos.contenidoSeccionId,'2')
 const actualizado=await metadataSeccionApi.reemplazar('2',datos.actualizadoEn,datos.metadata)
 assert.notEqual(actualizado.actualizadoEn,datos.actualizadoEn)
 await assert.rejects(metadataSeccionApi.reemplazar('2',datos.actualizadoEn,{}),e=>e instanceof Error && 'estado' in e && e.estado===409)
})
test('IDs grandes permanecen strings; IDs y fechas malformados no salen por HTTP',()=>{
 assert.equal(idRutaCms('9223372036854775807'),'9223372036854775807')
 for(const id of ['1/activar','-1','0','9223372036854775808'])assert.throws(()=>idRutaCms(id))
 assert.throws(()=>idRutaCms('2147483648',true));assert.throws(()=>validarVersionCms(null));assert.equal(validarVersionCms(null,true),null)
 for(const v of ['2026-02-30T00:00:00.000Z','2026-01-01','invalid'])assert.throws(()=>validarVersionCms(v))
})
test('Formulario rechaza JSON no objeto, claves duplicadas y orden fuera de rango',()=>{
 assert.throws(()=>construirDatosCms([{clave:'metadata',etiqueta:'Metadata',tipo:'json'}],{metadata:'[]'}))
 assert.throws(()=>construirDatosCms([{clave:'claves',etiqueta:'Claves',tipo:'claves'}],{claves:'cta,cta'}))
 for(const orden of ['-1','1.5','2147483648',''])assert.throws(()=>construirDatosCms([{clave:'orden',etiqueta:'Orden',tipo:'numero'}],{orden}))
})

test('Configuración admite versión y textos nulos sin convertirlos a falsos o vacíos',async t=>{
 const servidor=await conectar('configuracionSitio',t)
 const fila=servidor.env.tablas.configuracionSitio.find(f=>f.id===2)!
 fila.actualizadoEn=null
 const actual=await configuracion_sitioApi.obtener(2);assert.equal(actual.actualizadoEn,null);assert.equal(actual.activo,null)
 const cambiado=await configuracion_sitioApi.editar(2,null,{valor:null,tipo:null,descripcion:null,grupo:null})
 assert.equal(cambiado.tipo,null);assert.equal(cambiado.valor,null);assert.equal(cambiado.activo,null);assert.ok(cambiado.actualizadoEn)
})
