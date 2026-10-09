import assert from 'node:assert/strict'
import {test} from 'node:test'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {ContenidosRegistro} from '../src/frontend/features/cms/presentation/contenidos-registro'
import {FormularioContenidoRegistro} from '../src/frontend/features/cms/presentation/formulario-contenido-registro'
import {vistaRegistroCMS} from '../src/frontend/features/cms/presentation/vista-registros-cms'
import {gruposNavegacionCms} from '../src/frontend/features/cms/presentation/navegacion-cms'
Object.assign(globalThis,{React})
test('registro: creación no presenta un campo de orden manual',()=>{assert.ok(!vistaRegistroCMS.crear.some(c=>c.clave==='orden'))})
test('contenido: el formulario fija padre, tiene empresa buscable y subtítulo opcional',()=>{
 const html=renderToStaticMarkup(<FormularioContenidoRegistro registroId="7" nombrePadre="Infraestructura" guardar={async()=>{}} ocupado={false} cancelar={()=>{}}/>)
 assert.match(html,/Infraestructura · #7/);assert.match(html,/readOnly/);assert.match(html,/type="search"/);assert.match(html,/Subtítulo \(opcional\)/)
 assert.match(html,/automático desde 1 dentro de este registro/);assert.doesNotMatch(html,/Stats|type="number"/)
})
test('contenidos: modal solo permite gestionar cuando se tiene permiso',()=>{
 const props={registroId:'7',nombrePadre:'Infraestructura',verEliminados:false,cerrar:()=>{}}
 assert.match(renderToStaticMarkup(<ContenidosRegistro {...props} gestionar/>),/Agregar contenido/)
 assert.doesNotMatch(renderToStaticMarkup(<ContenidosRegistro {...props} gestionar={false}/>),/Agregar contenido/)
})
test('navegación: conserva Registros y retira el enlace independiente a contenidos',()=>{
 const enlaces=gruposNavegacionCms.flatMap(g=>g.enlaces)
 assert.ok(enlaces.some(e=>e.ruta==='registros-cms'));assert.ok(!enlaces.some(e=>e.ruta==='contenidos-registro'))
})
