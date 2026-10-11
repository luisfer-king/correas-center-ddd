import assert from 'node:assert/strict'
import {test} from 'node:test'
import ts from 'typescript'
import {actualizarSchema,quitarAcceso} from './integrar-registros.mjs'
test('schema: retira solo stats de ContenidoRegistro y es idempotente',()=>{
 const original='model ContenidoRegistro {\n id BigInt @id\n stats String? @db.VarChar\n titulo String?\n}\nmodel Otro {\n stats String?\n}'
 const nuevo=actualizarSchema(original)
 assert.equal(nuevo,'model ContenidoRegistro {\n id BigInt @id\n titulo String?\n}\nmodel Otro {\n stats String?\n}')
 assert.equal(actualizarSchema(nuevo),nuevo)
})
test('schema: soporta saltos de línea de Windows',()=>{
 const original='model ContenidoRegistro {\r\n id BigInt @id\r\n stats String? @db.VarChar\r\n}'
 assert.doesNotMatch(actualizarSchema(original),/stats/)
})
test('rutas: conserva el portal y las vistas públicas y retira solo el acceso independiente',()=>{
 const original=`import {ListadoContenidoRegistro,Otra} from './cms';export const r=<Routes><Route index element={<PortalBase/>}/><Route path="cms/registros-cms" element={<Registros/>}/><Route path="cms/contenidos-registro" element={<ListadoContenidoRegistro/>}/><Route path="products/:slug" element={<Producto/>}/></Routes>`
 const nuevo=quitarAcceso(original,'rutas.tsx')
 assert.doesNotMatch(nuevo,/ListadoContenidoRegistro|cms\/contenidos-registro/);assert.match(nuevo,/PortalBase|products\/:slug/);assert.match(nuevo,/cms\/registros-cms/)
 assert.equal(ts.createSourceFile('rutas.tsx',nuevo,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX).parseDiagnostics.length,0)
 assert.equal(quitarAcceso(nuevo,'rutas.tsx'),nuevo)
})
test('navegación: mantiene los enlaces personalizados',()=>{
 const original="export const enlaces=[{ruta:'/portal/cms/registros-cms'},{ruta:'/portal/cms/contenidos-registro'},{ruta:'/portal/personalizado'}]"
 const nuevo=quitarAcceso(original,'navegacion.ts');assert.doesNotMatch(nuevo,/contenidos-registro/);assert.match(nuevo,/personalizado/);assert.match(nuevo,/registros-cms/)
})
