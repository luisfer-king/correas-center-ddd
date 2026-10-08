import React from 'react'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { ProveedorCapacidadesCms } from '../src/frontend/features/cms/presentation/capacidades-cms'
import { ListadoCms } from '../src/frontend/features/cms/presentation/listado-cms'
import { FormularioCms } from '../src/frontend/features/cms/presentation/formulario-cms'
import { vistaTipoSeccion } from '../src/frontend/features/cms/presentation/vista-tipos-seccion'
import { vistaMenu } from '../src/frontend/features/cms/presentation/vista-menus'
import { gruposPortalCms } from '../src/frontend/features/cms/presentation/grupo-portal-cms'
import type { CapacidadesCms, RecursoCms } from '../src/frontend/features/cms/api/modelos-cms'
Object.assign(globalThis,{React})
const recursos: RecursoCms[] = ['tipos_seccion','contenidos_seccion','metadata_seccion','menus','items_menu','elementos_footer','configuracion_sitio','pasos_wizard','registros_cms','contenidos_registro']
function capacidades(leer: boolean, gestionar: boolean): CapacidadesCms { return {verEliminados:false,recursos:Object.fromEntries(recursos.map(r=>[r,{leer,gestionar}])) as CapacidadesCms['recursos']} }
function mostrar(c: CapacidadesCms) { return renderToString(<MemoryRouter><ProveedorCapacidadesCms datos={c}><ListadoCms configuracion={vistaTipoSeccion} /></ProveedorCapacidadesCms></MemoryRouter>) }
test('Acceso denegado no muestra controles de administración',()=>{const html=mostrar(capacidades(false,false));assert.match(html,/No tienes permiso/);assert.doesNotMatch(html,/Crear nuevo|Incluir eliminados|Buscar en esta página/)})
test('Lectura sin gestión oculta creación y eliminados; gestión permite creación',()=>{assert.doesNotMatch(mostrar(capacidades(true,false)),/Crear nuevo|Incluir eliminados/);assert.match(mostrar(capacidades(true,true)),/Crear nuevo/);const c=capacidades(true,true);c.verEliminados=true;assert.match(mostrar(c),/Incluir eliminados/)})
test('Grupos filtrados por permisos, sin mezclar los grupos anteriores',()=>{const c=capacidades(false,false);assert.deepEqual(gruposPortalCms(c),[]);c.recursos.menus.leer=true;assert.deepEqual(gruposPortalCms(c),[{id:'cms',titulo:'CMS',enlaces:[{etiqueta:'Menús',ruta:'/portal/cms/menus'}]}])})
test('Formulario de edición respeta los campos inmutables y bloquea envíos pendientes',()=>{const html=renderToString(<FormularioCms campos={vistaMenu.editar} datos={{grupo:'Principal',ruta:'/productos',mostrar:true,cargarSubmenu:null,icono:null}} guardar={async()=>{}} ocupado={true} cancelar={()=>{}} />);assert.match(html,/fieldset disabled/);assert.match(html,/Guardando/);assert.doesNotMatch(html,/Empresa \(ID\)|Destino \(ID\)|Tipo de destino/);assert.match(html,/for=/);assert.match(html,/Sin definir/)})
