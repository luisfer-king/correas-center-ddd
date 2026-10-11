import assert from 'node:assert/strict'
import {test} from 'node:test'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {FormularioPasoWizard} from '../src/frontend/features/cms/presentation/formulario-paso-wizard'
Object.assign(globalThis,{React})
const props={guardar:async()=>{},ocupado:false,cancelar:()=>{}}
test('wizard: empresa buscable y orden automático sin campo numérico',()=>{
 const html=renderToStaticMarkup(<FormularioPasoWizard {...props}/>)
 assert.match(html,/type="search"/);assert.match(html,/Empresa \*/)
 assert.match(html,/automático desde 1 por empresa/);assert.doesNotMatch(html,/type="number"/)
 for(const fuente of ['industrias','productos','categorias'])assert.ok(html.includes(`value="${fuente}"`))
})
test('wizard: editar conserva código, orden y filtro de categoría',()=>{
 const html=renderToStaticMarkup(<FormularioPasoWizard {...props} editar datos={{empresaId:'1',identificador:'categoria',titulo:'Categoría',descripcion:'Selecciona',fuenteDatos:'categorias',campoFiltro:'producto_id',orden:3}}/>)
 assert.match(html,/readOnly=""[^>]*value="categoria"/);assert.match(html,/value="producto_id"/);assert.match(html,/Orden: 3/)
 assert.match(html,/disabled/)
})
