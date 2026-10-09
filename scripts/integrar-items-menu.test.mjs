import assert from 'node:assert/strict'
import { test } from 'node:test'
import ts from 'typescript'
import { actualizarSchema, quitarAcceso } from './integrar-items-menu.mjs'
test('schema agrega ambos campos sin alterar otros modelos y es idempotente',()=>{
  const original='model MenuItem {\n id BigInt @id\n ruta String\n}\nmodel Empresa {\n id BigInt @id\n}'
  const nuevo=actualizarSchema(original)
  assert.match(nuevo,/nombre String @db.VarChar\(255\)/);assert.match(nuevo,/categoriaId BigInt\?/)
  assert.ok(nuevo.endsWith('model Empresa {\n id BigInt @id\n}'));assert.equal(actualizarSchema(nuevo),nuevo)
})
test('rutas: elimina solo la ruta independiente y conserva portal y vista pública',()=>{
  const original=`import { ListadoMenuItem, OtraVista } from './cms';\nexport function Rutas(){return <Routes><Route path="/" element={<Publico/>}/><Route element={<PortalBase/>}><Route path="cms/menus" element={<ListadoMenu/>}/><Route path="cms/items-menu" element={<ListadoMenuItem/>}/><Route path="products/:slug" element={<Producto/>}/></Route></Routes>}`
  const nuevo=quitarAcceso(original,'rutas.tsx')
  assert.doesNotMatch(nuevo,/ListadoMenuItem|cms\/items-menu/);assert.match(nuevo,/OtraVista/)
  assert.match(nuevo,/element={<PortalBase\/>}/);assert.match(nuevo,/products\/:slug/);assert.match(nuevo,/path="\/"/)
  assert.equal(quitarAcceso(nuevo,'rutas.tsx'),nuevo)
  assert.equal(ts.createSourceFile('rutas.tsx',nuevo,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX).parseDiagnostics.length,0)
})
for(const posicion of ['primero','medio','ultimo'])test(`navegación conserva personalización cuando ítems es ${posicion}`,()=>{
  const item="{etiqueta:'Ítems',ruta:'/portal/cms/items-menu'}",otros=["{etiqueta:'Personalizado',ruta:'/portal/mi-ruta'}","{etiqueta:'Menús',ruta:'/portal/cms/menus'}"]
  const elementos=posicion==='primero'?[item,...otros]:posicion==='medio'?[otros[0],item,otros[1]]:[...otros,item]
  const nuevo=quitarAcceso(`export const enlaces=[${elementos.join(',')}];`,'navegacion.ts')
  assert.doesNotMatch(nuevo,/items-menu/);assert.match(nuevo,/Personalizado/);assert.match(nuevo,/cms\/menus/)
  assert.equal(ts.createSourceFile('navegacion.ts',nuevo,ts.ScriptTarget.Latest,true).parseDiagnostics.length,0)
})
