import assert from 'node:assert/strict'
import {test} from 'node:test'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {FormularioConfiguracionSitio,datosConfiguracionSitio,gruposConfiguracionSitio} from '../src/frontend/features/cms/presentation/formulario-configuracion-sitio'
Object.assign(globalThis,{React})
const props={guardar:async()=>{},ocupado:false,cancelar:()=>{}}
const base={empresa:'1',global:false,clave:'whatsapp_activo',valor:'true',tipo:'booleano',descripcion:'Mostrar WhatsApp',grupo:'whatsapp',activo:'true'}
test('configuración: empresa buscable y los cinco grupos seleccionables',()=>{
 const html=renderToStaticMarkup(<FormularioConfiguracionSitio {...props}/>)
 assert.match(html,/type="search"/);assert.match(html,/Empresa \*/)
 assert.deepEqual(gruposConfiguracionSitio,['general','analytics','whatsapp','chat','redes_sociales'])
 for(const grupo of gruposConfiguracionSitio)assert.ok(html.includes(`value="${grupo}"`))
})
test('configuración: global no obliga a seleccionar empresa; vacío conserva null',()=>{
 const html=renderToStaticMarkup(<FormularioConfiguracionSitio {...props} datos={{empresaId:null}}/>)
 assert.doesNotMatch(html,/type="search"/);assert.match(html,/Empresa: configuración global/)
 const datos=datosConfiguracionSitio({...base,global:true,empresa:'',valor:'',tipo:'',descripcion:'',grupo:'',activo:''})
 assert.deepEqual(datos,{empresaId:null,clave:'whatsapp_activo',valor:null,tipo:null,descripcion:null,grupo:null,activo:null})
})
test('configuración: valor booleano es texto independiente de actividad del registro',()=>{
 const datos=datosConfiguracionSitio({...base,valor:'false'})
 assert.equal(datos.valor,'false');assert.ok('activo' in datos);assert.equal(datos.activo,true)
})
test('configuración: editar conserva identidad y grupo histórico sin enviar activo',()=>{
 const html=renderToStaticMarkup(<FormularioConfiguracionSitio {...props} editar datos={{empresaId:'1',clave:'titulo_sitio',grupo:'historico',valor:'Correas Center',tipo:'texto'}}/>)
 assert.match(html,/readOnly=""/);assert.match(html,/historico \(actual\)/);assert.match(html,/disabled/)
 const datos=datosConfiguracionSitio({...base,grupo:'historico'},true)
 assert.ok(!('empresaId' in datos));assert.ok(!('clave' in datos));assert.ok(!('activo' in datos));assert.equal(datos.grupo,'historico')
})
test('configuración: rechaza empresa vacía y preserva mensaje multilínea',()=>{
 assert.throws(()=>datosConfiguracionSitio({...base,empresa:''}),/Selecciona una empresa/)
 assert.throws(()=>datosConfiguracionSitio({...base,clave:'   '}),/clave es obligatoria/)
 assert.equal(datosConfiguracionSitio({...base,valor:'Hola\n• Correas\n• Rodamientos'}).valor,'Hola\n• Correas\n• Rodamientos')
})
