import assert from 'node:assert/strict'
import {test} from 'node:test'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {FormularioItemMenu} from '../src/frontend/features/cms/presentation/formulario-item-menu'
import {gruposPortalCms} from '../src/frontend/features/cms/presentation/grupo-portal-cms'
import type {CapacidadesCms} from '../src/frontend/features/cms/api/modelos-cms'
Object.assign(globalThis,{React})
test('ítem: nombre obligatorio, categoría buscable, ruta solo lectura y estado activo',()=>{
 const html=renderToStaticMarkup(<FormularioItemMenu padre={{empresaId:'1',tipoRegistro:'producto',registroId:'1'}} guardar={async()=>{}} ocupado={false} cancelar={()=>{}}/>)
 assert.match(html,/Nombre \*/);assert.match(html,/required="" maxLength="255"/)
 assert.match(html,/Categoría de destino/);assert.match(html,/type="search"/)
 assert.match(html,/Ruta resultante<input readOnly=""/);assert.match(html,/Estado: activo/)
 assert.match(html,/automático desde 1/)
})
test('ítems no tienen enlace independiente incluso con todos los permisos',()=>{
 const recursos=['tipos_seccion','contenidos_seccion','metadata_seccion','menus','items_menu','elementos_footer','configuracion_sitio','pasos_wizard','registros_cms','contenidos_registro']
 const c={verEliminados:false,recursos:Object.fromEntries(recursos.map(r=>[r,{leer:true,gestionar:true}]))} as CapacidadesCms
 const enlaces=gruposPortalCms(c).flatMap(g=>g.enlaces)
 assert.ok(enlaces.some(e=>e.ruta==='/portal/cms/menus'))
 assert.ok(!enlaces.some(e=>e.ruta.includes('items-menu')))
})
