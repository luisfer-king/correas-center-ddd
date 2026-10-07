import React from 'react'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderToString } from 'react-dom/server'
import { FormularioCms } from '../src/frontend/features/cms/presentation/formulario-cms'
import { vistaTipoSeccion } from '../src/frontend/features/cms/presentation/vista-tipos-seccion'
import { agregarClaveCms, construirDatosCms, parsearClavesCms, valoresInicialesCms } from '../src/frontend/features/cms/presentation/campos-cms'
Object.defineProperty(globalThis,'React',{value:React,configurable:true})
test('Formulario genera slug y solicita orden automático al dejarlo vacío',()=>{
 const valores=valoresInicialesCms(vistaTipoSeccion.crear,{nombre:'Nuestros Servicios',icono:'Wrench'})
 const datos=construirDatosCms(vistaTipoSeccion.crear,valores)
 assert.equal(datos.slug,'nuestros-servicios');assert.equal(datos.orden,null);assert.deepEqual(datos.camposMetadata,[]);assert.equal(datos.icono,'Wrench')
 valores.orden='0';assert.equal(construirDatosCms(vistaTipoSeccion.crear,valores).orden,0)
 valores.orden='-1';assert.throws(()=>construirDatosCms(vistaTipoSeccion.crear,valores));valores.orden='1.5';assert.throws(()=>construirDatosCms(vistaTipoSeccion.crear,valores))
})
test('Claves dinámicas opcionales, sin duplicados; roundtrip conserva claves JSON',()=>{
 assert.deepEqual(parsearClavesCms(''),[])
 const claves=agregarClaveCms([], ' badge_text ');assert.deepEqual(claves,['badge_text']);assert.throws(()=>agregarClaveCms(claves,'badge_text'));assert.throws(()=>agregarClaveCms(claves,' '));assert.throws(()=>agregarClaveCms(claves,'__proto__'))
 const especiales=['badge_text','clave,con,comas'];const valores=valoresInicialesCms(vistaTipoSeccion.crear,{nombre:'Tipo',camposMetadata:especiales})
 assert.deepEqual(construirDatosCms(vistaTipoSeccion.crear,valores).camposMetadata,especiales)
})
test('Presenta chips removibles, entrada Agregar, slug readonly, Lucide y orden manual opcional',()=>{
 const html=renderToString(<FormularioCms campos={vistaTipoSeccion.crear} datos={{nombre:'Mi sección',camposMetadata:['cta_primary_text']}} guardar={async()=>{}} ocupado={false} cancelar={()=>{}} />)
 assert.match(html,/readOnly/);assert.match(html,/mi-seccion/);assert.match(html,/Quitar cta_primary_text/);assert.match(html,/Agregar/);assert.match(html,/opcional/);assert.match(html,/Asignar orden manualmente/);assert.match(html,/lucide.dev\/icons/)
})
