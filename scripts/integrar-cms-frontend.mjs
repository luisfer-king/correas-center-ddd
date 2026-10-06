import { readFile, writeFile, rename } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createRequire } from 'node:module'
const ts = createRequire(resolve(process.cwd(), 'package.json'))('typescript')
const marca = '// CMS: integración explícita y navegación central v2'
export const recursosCms = [
 ['tipos-seccion','TipoSeccion','Tipos de sección'], ['contenidos-seccion','ContenidoSeccion','Secciones'],
 ['menus','Menu','Menús'], ['items-menu','MenuItem','Ítems de menú'], ['elementos-footer','FooterElemento','Footer'],
 ['configuracion-sitio','ConfiguracionSitio','Configuración'], ['pasos-wizard','PasoWizard','Wizard'],
 ['registros-cms','RegistroCMS','Registros'], ['contenidos-registro','ContenidoRegistro','Contenidos de registro'],
]
function analizar(texto) {
 const fuente = ts.createSourceFile('archivo.tsx', texto, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
 if (fuente.parseDiagnostics.length) throw new Error('El archivo contiene sintaxis inválida; no se modificó')
 return fuente
}
function buscar(fuente, predicado) { const nodos=[]; function visitar(n) { if(predicado(n)) nodos.push(n);ts.forEachChild(n,visitar) } visitar(fuente);return nodos }
function atributo(n,nombre) {return n.attributes.properties.find(p=>ts.isJsxAttribute(p)&&p.name.text===nombre)}
function esComponente(n,nombre) {const a=atributo(n,'element');return a?.initializer?.getText().replace(/\s/g,'')===`{<${nombre}/>}`}
function limpiarMarca(t) {return t.replace(/^\/\/ CMS: integración frontend entrega 5\r?\n/m,'')}
function verificarSintaxis(t) {analizar(t);return t}
export function integrarRutasCms(original) {
 if(original.includes(marca)) {
  if(/path=["']cms\/\*/.test(original) || recursosCms.some(([ruta])=>!original.includes(`path="cms/${ruta}"`))) throw new Error('Rutas CMS incompletas')
  return original
 }
 let texto=limpiarMarca(original)
 // Migra exclusivamente la ruta generada por la entrega anterior.
 if (/path=["']cms\/\*/.test(texto)) {
  if(!original.includes('// CMS: integración frontend entrega 5')) throw new Error('Wildcard CMS no reconocido; revisa rutas.tsx')
  texto=texto.replace(/^[ \t]*<Route\s+path=["']cms\/\*["']\s+element=\{<PortalCms\s*\/>\}\s*\/>\r?\n?/m,'')
  texto=texto.replace(/^import\s*\{\s*PortalCms\s*\}\s*from\s*['"][^'"]+portal-cms['"];?\r?\n/m,'')
 }
 if(/path=["']cms(?:\/|["'])/.test(texto))throw new Error('Hay otras rutas CMS; no se sobrescriben')
 const fuente=analizar(texto)
 const marcos=buscar(fuente,n=>ts.isJsxElement(n)&&esComponente(n.openingElement,'MarcoPortal'))
 if(marcos.length!==1)throw new Error('Debe existir un contenedor MarcoPortal reconocido')
 const index=marcos[0].children.filter(n=>ts.isJsxSelfClosingElement(n)&&atributo(n,'index')&&esComponente(n,'PortalBase'))
 if(index.length!==1)throw new Error('No se encontró el index PortalBase dentro de MarcoPortal')
 const bloque='\n          <Route element={<PortalCms />}>\n            <Route path="cms" element={<InicioCms />} />\n'+recursosCms.map(([ruta,nombre])=>`            <Route path="cms/${ruta}" element={<Listado${nombre} />} />`).join('\n')+'\n          </Route>'
 texto=texto.slice(0,index[0].end)+bloque+texto.slice(index[0].end)
 const imports="import { PortalCms } from '../features/cms/presentation/portal-cms'\nimport { InicioCms } from '../features/cms/presentation/inicio-cms'\n"+recursosCms.map(([ruta,nombre])=>`import { Listado${nombre} } from '../features/cms/presentation/listado-${ruta}'`).join('\n')
 return verificarSintaxis(`${marca}\n${imports}\n${texto}`)
}
export function integrarNavegacionCms(original) {
 if(original.includes(marca)) {
  if(!original.includes("contexto: 'cms'") || !original.includes("acceso.contexto === 'cms'"))throw new Error('Navegación CMS incompleta')
  return original
 }
 let texto=original
 if(/contexto:\s*['"]cms['"]/.test(texto))throw new Error('Navegación CMS diferente; no se reemplaza')
 const firma=/export function gruposPermitidos\(iam: CapacidadesRoles \| null, crm: CapacidadesCrm \| null, catalogo: CapacidadesCatalogo \| null\): GrupoPortal\[\]/
 const filtro=/([ \t]*)return catalogo\?\.recursos\[acceso\.recurso\]\?\.leer === true/
 if(!firma.test(texto)||!filtro.test(texto))throw new Error('Filtro gruposPermitidos no reconocido; se conservaron tus archivos')
 const fuente=analizar(texto)
 const accesos=buscar(fuente,n=>ts.isTypeAliasDeclaration(n)&&n.name.text==='AccesoPortal')
 const grupos=buscar(fuente,n=>ts.isVariableDeclaration(n)&&n.name.getText()==='gruposPortal')
 if(accesos.length!==1||grupos.length!==1||!ts.isArrayLiteralExpression(grupos[0].initializer))throw new Error('Configuración gruposPortal no reconocida')
 const cambios=[
  {pos:accesos[0].type.end,t:"\n  | { contexto: 'cms'; recurso: keyof CapacidadesCms['recursos'] }"},
  {pos:grupos[0].initializer.end-1,t:"\n  // CMS: puedes cambiar estos títulos, mover enlaces o integrarlos en otros grupos.\n  { id: 'cms', titulo: 'CMS', enlaces: [\n"+recursosCms.map(([ruta,_nombre,etiqueta])=>`    { etiqueta: '${etiqueta}', ruta: '/portal/cms/${ruta}', acceso: { contexto: 'cms', recurso: '${ruta.replaceAll('-','_')}' } },`).join('\n')+"\n  ] },\n"},
 ]
 // Inserción antes del cierre del array: admite grupos personalizados con/sin coma final.
 const array=grupos[0].initializer
 if(array.elements.length && !array.elements.hasTrailingComma)cambios.push({pos:array.elements.at(-1).end,t:','})
 for(const {pos,t} of cambios.sort((a,b)=>b.pos-a.pos))texto=texto.slice(0,pos)+t+texto.slice(pos)
 texto=texto.replace(firma,"export function gruposPermitidos(iam: CapacidadesRoles | null, crm: CapacidadesCrm | null, catalogo: CapacidadesCatalogo | null, cms?: CapacidadesCms | null): GrupoPortal[]")
 texto=texto.replace(filtro,(_m,espacio)=>`${espacio}if (acceso.contexto === 'cms') return cms?.recursos[acceso.recurso]?.leer === true\n${espacio}return catalogo?.recursos[acceso.recurso]?.leer === true`)
 return verificarSintaxis(`${marca}\nimport type { CapacidadesCms } from '../../cms/api/modelos-cms'\n${texto}`)
}
export function integrarMarcoCms(original) {
 if(original.includes(marca)) {
  if(!original.includes('gruposPermitidos(capacidadesIam, crm, catalogo, cms.datos)'))throw new Error('Marco CMS incompleto')
  return original
 }
 let texto=limpiarMarca(original)
 const agrupada=/<NavegacionAgrupada\s+grupos=\{(?:\[\.\.\.)?gruposPermitidos\(capacidadesIam,\s*crm,\s*catalogo\)(?:,\s*\.\.\.gruposPortalCms\(cms\.datos\)\])?\}\s*\/>/
 if(!agrupada.test(texto)||!/from\s*['"]\.\/navegacion-portal['"]/.test(texto))throw new Error('No se reconoce el menú agrupado personalizado; restaura marco-portal.tsx.antes-cms-frontend si contiene tu menú anterior')
 texto=texto.replace(/^import\s*\{\s*gruposPortalCms\s*\}\s*from\s*['"][^'"]+grupo-portal-cms['"];?\r?\n/m,'')
 const firma=/export function MarcoPortal\(\)\s*\{/
 if(!firma.test(texto))throw new Error('Firma MarcoPortal no reconocida')
 if(!texto.includes('const cms = usarCargaCapacidadesCms()'))texto=texto.replace(firma,m=>`${m}\n  const cms = usarCargaCapacidadesCms()\n`)
 if(!/^import .*usarCargaCapacidadesCms.*from/m.test(texto))texto="import { usarCargaCapacidadesCms } from '../../cms/presentation/capacidades-cms'\n"+texto
 texto=texto.replace(agrupada,'<NavegacionAgrupada grupos={gruposPermitidos(capacidadesIam, crm, catalogo, cms.datos)} />')
 return verificarSintaxis(`${marca}\n${texto}`)
}
export async function integrarFrontendCms(directorio=process.cwd(),check=false) {
 const archivos=['src/frontend/app/rutas.tsx','src/frontend/features/iam/presentation/marco-portal.tsx','src/frontend/features/iam/presentation/navegacion-portal.ts'].map(p=>resolve(directorio,p))
 const actuales=await Promise.all(archivos.map(p=>readFile(p,'utf8')))
 const nuevos=[integrarRutasCms(actuales[0]),integrarMarcoCms(actuales[1]),integrarNavegacionCms(actuales[2])]
 const indices=actuales.map((t,i)=>t!==nuevos[i]?i:-1).filter(i=>i>=0)
 if(check)return indices.length?'Integración compatible; no se modificaron archivos':'CMS ya integrado'
 for(const i of indices) {try{await writeFile(`${archivos[i]}.antes-cms-v2`,actuales[i],{flag:'wx'})}catch(e){if(e.code!=='EEXIST')throw e}}
 const completados=[]
 try{for(const i of indices){await writeFile(`${archivos[i]}.cms-temporal`,nuevos[i]);await rename(`${archivos[i]}.cms-temporal`,archivos[i]);completados.push(i)}}catch(e){for(const i of completados)await writeFile(archivos[i],actuales[i]);throw e}
 return indices.length?'CMS integrado: rutas explícitas después de PortalBase y navegación central conservada':'CMS ya integrado'
}
if(process.argv[1] && import.meta.url===pathToFileURL(resolve(process.argv[1])).href)integrarFrontendCms(process.cwd(),process.argv.includes('--check')).then(console.log).catch(e=>{console.error(e.message);process.exitCode=1})
