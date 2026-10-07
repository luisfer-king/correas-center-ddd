import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { integrarRutasCms, integrarMarcoCms, integrarNavegacionCms, integrarFrontendCms, recursosCms } from './integrar-cms-frontend.mjs'
const rutas=`import { Route } from 'react-router-dom'
export function Rutas() {return <Route element={<PortalProtegido />}><Route element={<MarcoPortal />}>
 <Route index element={<PortalBase />} />
 <Route path="catalogo/productos" element={<MisProductos />} />
 <Route path="crm/empresas" element={<MiEmpresa />} />
 </Route></Route>}`
const marco=`import { gruposPermitidos } from './navegacion-portal'
export function MarcoPortal() {const crm=null;return <nav><NavegacionAgrupada grupos={gruposPermitidos(capacidadesIam, crm, catalogo)} /><button>Tema personalizado</button></nav>}`
const nav=`import type { CapacidadesRoles } from '../api/tipos-iam'
import type { CapacidadesCrm } from '../../commercial/api/cliente-crm'
import type { CapacidadesCatalogo } from '../../catalog/api/tipos-catalogo'
export type AccesoPortal = { contexto: 'iam'; permiso: keyof CapacidadesRoles } | { contexto: 'crm'; recurso: keyof CapacidadesCrm['recursos'] } | { contexto: 'catalogo'; recurso: keyof CapacidadesCatalogo['recursos'] }
export interface EnlacePortal { etiqueta: string; ruta: string; acceso?: AccesoPortal }
export interface GrupoPortal {id:string;titulo:string;enlaces: readonly EnlacePortal[]}
export const gruposPortal: readonly GrupoPortal[] = [
 {id:'mis-compras',titulo:'Mi grupo personalizado',enlaces:[{etiqueta:'Mis empresas',ruta:'/portal/crm/empresas',acceso:{contexto:'crm',recurso:'empresas'}}]},
 {id:'cuenta',titulo:'Mis accesos',enlaces:[{etiqueta:'Cuenta',ruta:'/portal/mi-perfil'}]}
]
export function gruposPermitidos(iam: CapacidadesRoles | null, crm: CapacidadesCrm | null, catalogo: CapacidadesCatalogo | null): GrupoPortal[] {
 return gruposPortal.map(grupo=>({...grupo,enlaces:grupo.enlaces.filter(({acceso})=>{
 if(!acceso)return true
 if(acceso.contexto==='iam')return iam?.[acceso.permiso]===true
 if(acceso.contexto==='crm')return crm?.recursos[acceso.recurso]?.leer===true
 return catalogo?.recursos[acceso.recurso]?.leer === true
 })})).filter(g=>g.enlaces.length>0)
}`
test('Declara diez rutas visibles después del index PortalBase y dentro de MarcoPortal',()=>{
 const n=integrarRutasCms(rutas);assert.doesNotMatch(n,/cms\/\*/);assert.ok(n.indexOf('<Route index element={<PortalBase />} />')<n.indexOf('<Route element={<PortalCms />} >'.replace('} >','}>')))
 assert.match(n,/path="cms" element=\{<InicioCms \/>\}/)
 for(const [ruta,nombre]of recursosCms)assert.ok(n.includes(`<Route path="cms/${ruta}" element={<Listado${nombre} />} />`))
 assert.ok(n.includes('<Route path="catalogo/productos" element={<MisProductos />} />'));assert.ok(n.includes('<Route path="crm/empresas" element={<MiEmpresa />} />'))
 assert.equal(integrarRutasCms(n),n)
})
test('Migra cms/* de entrega 5, elimina import duplicado y conserva index',()=>{
 const viejo="// CMS: integración frontend entrega 5\nimport { PortalCms } from '../features/cms/presentation/portal-cms'\n"+rutas.replace('<Route index','<Route path="cms/*" element={<PortalCms />} />\n <Route index')
 const n=integrarRutasCms(viejo);assert.doesNotMatch(n,/cms\/\*/);assert.equal((n.match(/import \{ PortalCms \}/g)||[]).length,1);assert.equal(integrarRutasCms(n),n)
})
test('Conserva títulos, enlaces, orden y permisos personalizados en navegación central',()=>{
 const n=integrarNavegacionCms(nav);assert.ok(n.includes("titulo:'Mi grupo personalizado'"));assert.ok(n.includes("etiqueta:'Mis empresas'"));assert.ok(n.includes("titulo:'Mis accesos'"));assert.match(n,/contexto: 'cms'/);assert.match(n,/cms\?\.recursos\[acceso.recurso\]\?\.leer/)
 for(const [ruta]of recursosCms)assert.ok(n.includes(`ruta: '/portal/cms/${ruta}'`))
 assert.equal(integrarNavegacionCms(n),n)
})
test('Marco usa únicamente gruposPermitidos con capacidades CMS',()=>{
 const n=integrarMarcoCms(marco);assert.ok(n.includes('gruposPermitidos(capacidadesIam, crm, catalogo, cms.datos)'));assert.ok(n.includes('Tema personalizado'));assert.doesNotMatch(n,/MenuCms|gruposPortalCms/);assert.equal(integrarMarcoCms(n),n)
})
test('Migra el agregado externo de la entrega anterior a la navegación central',()=>{
 const viejo="// CMS: integración frontend entrega 5\nimport { gruposPortalCms } from '../../cms/presentation/grupo-portal-cms'\nimport { usarCargaCapacidadesCms } from '../../cms/presentation/capacidades-cms'\n"+marco.replace('const crm=null;','const cms = usarCargaCapacidadesCms();const crm=null;').replace('grupos={gruposPermitidos(capacidadesIam, crm, catalogo)}','grupos={[...gruposPermitidos(capacidadesIam, crm, catalogo), ...gruposPortalCms(cms.datos)]}')
 const n=integrarMarcoCms(viejo);assert.doesNotMatch(n,/gruposPortalCms/);assert.equal((n.match(/const cms =/g)||[]).length,1);assert.equal((n.match(/import \{ usarCargaCapacidadesCms \}/g)||[]).length,1)
})
test('No inserta rutas fuera de MarcoPortal ni modifica estructuras no reconocidas',()=>{
 assert.throws(()=>integrarRutasCms(rutas.replace('<Route index element={<PortalBase />} />','')))
 assert.throws(()=>integrarRutasCms(rutas.replace('<Route element={<MarcoPortal />}>','<Route element={<OtroMarco />}>')))
 assert.throws(()=>integrarNavegacionCms('const grupos=[]'))
 assert.throws(()=>integrarMarcoCms('export function MarcoPortal(){return <MenuCms/>}'))
})
test('Check no escribe, valida tres archivos, respalda originales y es idempotente',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'cms-nav-v2-'));const paths=['src/frontend/app/rutas.tsx','src/frontend/features/iam/presentation/marco-portal.tsx','src/frontend/features/iam/presentation/navegacion-portal.ts'];const textos=[rutas,marco,nav]
 for(let i=0;i<paths.length;i++){const p=join(dir,paths[i]);await mkdir(join(p,'..'),{recursive:true});await writeFile(p,textos[i])}
 await integrarFrontendCms(dir,true);for(let i=0;i<paths.length;i++)assert.equal(await readFile(join(dir,paths[i]),'utf8'),textos[i])
 await writeFile(join(dir,paths[2]),'const x=1');await assert.rejects(integrarFrontendCms(dir));assert.equal(await readFile(join(dir,paths[0]),'utf8'),rutas);await writeFile(join(dir,paths[2]),nav)
 await integrarFrontendCms(dir);for(let i=0;i<paths.length;i++)assert.equal(await readFile(join(dir,paths[i])+'.antes-cms-v2','utf8'),textos[i]);assert.equal(await integrarFrontendCms(dir),'CMS ya integrado')
})

test('Filtra permisos CMS sin cambiar los accesos ni títulos de los otros grupos',async()=>{
 const ts=createRequire(resolve(process.cwd(),'package.json'))('typescript')
 const js=ts.transpileModule(integrarNavegacionCms(nav),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
 const {gruposPermitidos}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'))
 const sin=gruposPermitidos(null,{recursos:{empresas:{leer:true}}},null)
 assert.deepEqual(sin.map(g=>g.titulo),['Mi grupo personalizado','Mis accesos'])
 const con=gruposPermitidos(null,{recursos:{empresas:{leer:true}}},null,{recursos:{menus:{leer:true},items_menu:{leer:false}}})
 assert.equal(con[0].enlaces[0].etiqueta,'Mis empresas')
 assert.deepEqual(con.find(g=>g.id==='cms').enlaces.map(e=>e.ruta),['/portal/cms/menus'])
 assert.equal(gruposPermitidos(null,null,null,{recursos:{menus:{leer:false,gestionar:true}}}).some(g=>g.id==='cms'),false)
})
