import { readFile, writeFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'
export function actualizarSchema(texto) {
  if(!/model ContenidoRegistro\s*\{/.test(texto))throw new Error('No se encontró el modelo ContenidoRegistro')
  return texto.replace(/(model ContenidoRegistro\s*\{)([\s\S]*?)(\n\})/,(_todo,inicio,cuerpo,fin)=>inicio+cuerpo.replace(/^[ \t]*stats[ \t]+[^\r\n]*(?:\r?\n|$)/gm,'')+fin)
}
export function quitarAcceso(texto,archivo) {
  const sf=ts.createSourceFile(archivo,texto,ts.ScriptTarget.Latest,true,archivo.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS)
  const cambios=[]
  const rutas=new Set(['cms/contenidos-registro','/portal/cms/contenidos-registro','contenidos-registro'])
  function borrarElemento(n){
    let inicio=n.getStart(sf),fin=n.end
    if(texto.slice(fin).match(/^\s*,/)){fin+=texto.slice(fin).match(/^\s*,/)[0].length}
    else {const anterior=texto.slice(0,inicio).match(/,\s*$/);if(anterior)inicio-=anterior[0].length}
    cambios.push({inicio,fin,texto:''})
  }
  function visitar(n){
    if(ts.isJsxSelfClosingElement(n)&&n.tagName.getText(sf)==='Route'){
      const attr=n.attributes.properties.find(a=>ts.isJsxAttribute(a)&&a.name.getText(sf)==='path')
      if(attr?.initializer&&ts.isStringLiteral(attr.initializer)&&rutas.has(attr.initializer.text)){cambios.push({inicio:n.getStart(sf),fin:n.end,texto:''});return}
    }
    if(ts.isObjectLiteralExpression(n)&&ts.isArrayLiteralExpression(n.parent)){
      const ruta=n.properties.find(p=>ts.isPropertyAssignment(p)&&p.name.getText(sf).replace(/['"]/g,'')==='ruta')
      if(ruta&&ts.isStringLiteral(ruta.initializer)&&rutas.has(ruta.initializer.text)){borrarElemento(n);return}
    }
    if(ts.isImportDeclaration(n)&&n.importClause?.namedBindings&&ts.isNamedImports(n.importClause.namedBindings)){
      const bindings=n.importClause.namedBindings
      const quedan=bindings.elements.filter(e=>(e.propertyName??e.name).text!=='ListadoContenidoRegistro')
      if(quedan.length!==bindings.elements.length){
        if(!quedan.length&&!n.importClause.name)cambios.push({inicio:n.getStart(sf),fin:n.end,texto:''})
        else cambios.push({inicio:bindings.getStart(sf),fin:bindings.end,texto:`{ ${quedan.map(e=>e.getText(sf)).join(', ')} }`})
      }
    }
    ts.forEachChild(n,visitar)
  }
  visitar(sf)
  for(const c of cambios.sort((a,b)=>b.inicio-a.inicio))texto=texto.slice(0,c.inicio)+c.texto+texto.slice(c.fin)
  return texto
}
export async function integrar(raiz=process.cwd()){
  const paths=['prisma/schema.prisma','src/frontend/app/rutas.tsx','src/frontend/features/iam/presentation/navegacion-portal.ts','src/frontend/features/cms/presentation/navegacion-cms.ts']
  const cambios=[]
  for(const path of paths){
    const archivo=resolve(raiz,path);let texto
    try{texto=await readFile(archivo,'utf8')}catch(e){if(e.code==='ENOENT'&&path.includes('navegacion-'))continue;throw e}
    const nuevo=path.endsWith('.prisma')?actualizarSchema(texto):quitarAcceso(texto,path)
    if(nuevo!==texto)cambios.push({archivo,texto,nuevo})
  }
  for(const c of cambios){const backup=c.archivo+'.antes-registros-v1';try{await access(backup)}catch{await writeFile(backup,c.texto,{flag:'wx'})}await writeFile(c.archivo,c.nuevo)}
  console.log(`Registros: ${cambios.length} archivos integrados. Conserva los respaldos .antes-registros-v1.`)
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await integrar()
