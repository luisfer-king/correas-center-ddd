import React from 'react'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { urlImagen } from '../src/frontend/shared/imagenes/url-imagen'
import { MiniaturaImagen } from '../src/frontend/shared/imagenes/miniatura-imagen'
import { CampoImagen } from '../src/frontend/shared/imagenes/campo-imagen'
import { SelectorLogoEmpresa } from '../src/frontend/features/commercial/presentation/selector-logo-empresa'
import { imagenPublica } from '../src/frontend/features/publico/presentation/imagen-publica'
import { gruposPortal, gruposPermitidos } from '../src/frontend/features/iam/presentation/navegacion-portal'
import { NavegacionAgrupada } from '../src/frontend/shared/navegacion/navegacion-agrupada'
import type { CapacidadesCatalogo } from '../src/frontend/features/catalog/api/tipos-catalogo'
Object.assign(globalThis,{React})
const ruta='/api/public/catalogo/imagenes/categorias/d703746c-4ac6-4a8f-bf47-1756b7bc3d48.png'
const antigua='http://localhost:5173'+ruta
test('subidas propias y registros antiguos funcionan sin fijar host o puerto',()=>{
 for(const host of ['localhost:5173','127.0.0.1:3001','[::1]:5173'])assert.equal(urlImagen('http://'+host+ruta),ruta)
 assert.equal(urlImagen(ruta),ruta)
 assert.equal(imagenPublica(antigua),ruta)
})
test('preserva proveedores externos y rechaza esquemas o rutas inseguros',()=>{
 assert.equal(urlImagen('https://cdn.example.com'+ruta),'https://cdn.example.com'+ruta)
 assert.equal(urlImagen('http://localhost:8080/otro-servidor.png'),'http://localhost:8080/otro-servidor.png')
 for(const v of ['javascript:alert(1)','//externo.test/a.png','/\\externo.test/a.png','file:///foto.png','https://u:p@externo.test/foto.png',null])assert.equal(urlImagen(v),'')
})
test('listado y formulario previsualizan la URL reparada',()=>{
 for(const componente of [<MiniaturaImagen url={antigua}/>,<CampoImagen etiqueta="Imagen" valor={antigua} endpoint="/api/portal/catalogo/imagenes/categorias" actualizar={()=>{}} actividad={()=>{}}/>]){
  const html=renderToStaticMarkup(componente)
  assert.ok(html.includes(`src="${ruta}"`));assert.ok(!html.includes(`src="${antigua}"`))
 }
 const logo='/api/public/crm/logos/9c08f768-8984-4506-abb8-7fafbe266d19.png'
 const html=renderToStaticMarkup(<SelectorLogoEmpresa valor={'http://localhost:5173'+logo} actualizar={()=>{}} actividad={()=>{}} bloqueado={false}/>)
 assert.ok(html.includes(`src="${logo}"`))
})
test('navegación limpia conserva el acceso contextual y el filtro por permisos',()=>{
 const links=gruposPortal.flatMap(g=>g.enlaces)
 for(const path of ['asignaciones-marca','asignaciones-atributo','items-menu','contenidos-registro'])assert.ok(!links.some(l=>l.ruta.endsWith('/'+path)))
 assert.ok(links.some(l=>l.ruta.endsWith('/asignaciones-industria')))
 assert.deepEqual(gruposPermitidos(null,null,null,null).map(g=>g.id),['cuenta'])
 const capacidades={recursos:{categorias:{leer:true,gestionar:false}}} as CapacidadesCatalogo
 const grupos=gruposPermitidos(null,null,capacidades,null)
 assert.deepEqual(grupos.find(g=>g.id==='catalogo')?.enlaces.map(l=>l.etiqueta),['Categorías'])
 const html=renderToStaticMarkup(<MemoryRouter><NavegacionAgrupada grupos={grupos}/></MemoryRouter>)
 assert.match(html,/Oferta/);assert.doesNotMatch(html,/Especificaciones técnicas/)
})
