import assert from 'node:assert/strict'
import {test} from 'node:test'
import React from 'react'
import {renderToStaticMarkup} from 'react-dom/server'
import {FormularioFooter} from '../src/frontend/features/cms/presentation/formulario-footer'
Object.assign(globalThis,{React})
const props={guardar:async()=>{},ocupado:false,cancelar:()=>{}}
test('footer: empresa buscable, cuatro tipos y orden automático sin entrada manual',()=>{
 const html=renderToStaticMarkup(<FormularioFooter {...props}/>)
 assert.match(html,/type="search"/);assert.match(html,/Empresa \*/)
 for(const tipo of ['producto','industria','servicio','red_social'])assert.ok(html.includes(`value="${tipo}"`))
 assert.match(html,/automático desde 1 por empresa y tipo/);assert.doesNotMatch(html,/type="number"/)
 assert.match(html,/Vincular un registro del catálogo \(opcional\)/)
 assert.match(html,/Font Awesome/);assert.match(html,/fa-brands fa-facebook-f/)
 assert.doesNotMatch(html,/Lucide/)
})
test('footer: red social no obliga a vincular registro ni rellenar URL',()=>{
 const html=renderToStaticMarkup(<FormularioFooter {...props} datos={{empresaId:'1',tipo:'red_social'}}/>)
 assert.doesNotMatch(html,/Vincular un registro|Tipo de registro/);assert.match(html,/URL \(opcional\)/)
})
test('footer: edición conserva referencia, título, URL e icono históricos',()=>{
 const html=renderToStaticMarkup(<FormularioFooter {...props} editar datos={{empresaId:'1',tipo:'producto',destino:{tipo:'producto',id:'17'},titulo:'Correas',enlace:'/products/correas/',icono:'fas fa-cog',orden:3}}/>)
 assert.match(html,/value="17"/);assert.match(html,/value="Correas"/);assert.match(html,/value="fas fa-cog"/)
 assert.match(html,/Tipo de registro/);assert.match(html,/disabled/)
})
