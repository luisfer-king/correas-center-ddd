import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { AutorizacionCatalogo } from '../acceso-catalogo.js'
import type { UnidadTrabajoGamas, SesionGama } from '../ports/unidad-trabajo-gamas.js'
import type { RepositorioGamas } from '../ports/repositorio-gamas.js'
import { CrearGamaCategoria } from '../use-cases/gamas/crear-gama-categoria.js'
import { EditarGamaCategoria } from '../use-cases/gamas/editar-gama-categoria.js'
import { ObtenerGamaCategoria } from '../use-cases/gamas/obtener-gama-categoria.js'
import { ListarGamasProducto } from '../use-cases/gamas/listar-gamas-producto.js'
import { CopiarGamaCategoria } from '../use-cases/plantillas-gama/copiar-gama-categoria.js'
import { GuardarValoresGama } from '../use-cases/valores-gama/guardar-valores-gama.js'
import { validarOpcionesCopia } from '../copiar-estructura-gama.js'
import { moverElemento } from '../gamas-aplicacion.js'
import { GamaCategoria } from '../../domain/gama-categoria.js'
import type { ValorTecnico } from '../../domain/valor-tecnico.js'
const fecha=new Date('2026-10-10T00:00:00Z'),edicion={gamaId:1n,version:fecha},actor='11111111-1111-4111-8111-111111111111'
function autorizacion(permitir=true,superadmin=false) {
  const codigos:string[]=[]
  const autorizar:AutorizacionCatalogo={ejecutar:async(_actor,codigo)=>{codigos.push(codigo);if(!permitir)throw new Error('Acceso denegado')},tienePermiso:async()=>permitir,tieneRolActivo:async(_actor,roles)=>superadmin&&roles.includes('super_admin')}
  return {autorizar,codigos}
}
const gama=()=>new GamaCategoria({id:1n,categoriaId:1n,productoId:1n,gamaOrigenId:null,titulo:'Gama',descripcion:null,imagen:null,estado:'activo',fechas:{creadoEn:fecha,actualizadoEn:fecha,eliminadoEn:null}})
function escritura() {
  const valores:(string|boolean)[]=[],quitados:bigint[]=[]
  const s={gama:gama(),cuando:fecha,valores:{poner:async(_f:bigint,_c:bigint,v:ValorTecnico)=>{valores.push(v.valor)},quitar:async(f:bigint)=>{quitados.push(f)}}} as unknown as SesionGama
  let llamadas=0
  const uow={editar:async<T>(_id:bigint,version:Date,_actor:string,fn:(s:SesionGama)=>Promise<T>)=>{llamadas++;assert.equal(version.getTime(),fecha.getTime());return {gamaId:1n,version:fecha,resultado:await fn(s)}}} as UnidadTrabajoGamas
  return {uow,valores,quitados,get llamadas(){return llamadas}}
}
test('crear exige permiso antes de validar o tocar persistencia',async()=>{
  const {autorizar,codigos}=autorizacion(false)
  await assert.rejects(new CrearGamaCategoria({} as UnidadTrabajoGamas,autorizar).ejecutar(actor,{categoriaId:0n,titulo:'Gama'}),/Acceso denegado/)
  assert.deepEqual(codigos,['catalog.categorias.manage'])
})
test('crear normaliza opcionales y no permite inventar origen mediante datos extra',async()=>{
  let datos:unknown,opciones:unknown
  const uow={crear:async(d:unknown,_a:string,_fn:unknown,o:unknown)=>{datos=d;opciones=o}} as unknown as UnidadTrabajoGamas
  await new CrearGamaCategoria(uow,autorizacion().autorizar).ejecutar(actor,{categoriaId:1n,titulo:'Gama',gamaOrigenId:99n} as {categoriaId:bigint;titulo:string})
  assert.deepEqual(datos,{categoriaId:1n,titulo:'Gama',descripcion:null,imagen:null})
  assert.deepEqual(opciones,{asegurarPrimeraPlantilla:true})
})
test('consulta de eliminados depende del rol, no de un parámetro del cliente',async()=>{
  const visibles:boolean[]=[]
  const repo={buscarPorId:async(_id:bigint,incluir:boolean)=>{visibles.push(incluir);return null}} as unknown as RepositorioGamas
  await new ObtenerGamaCategoria(repo,autorizacion().autorizar).ejecutar(actor,1n)
  await new ObtenerGamaCategoria(repo,autorizacion(true,true).autorizar).ejecutar(actor,1n)
  assert.deepEqual(visibles,[false,true])
})
test('listar valida paginación antes del repositorio',async()=>{
  await assert.rejects(new ListarGamasProducto({} as RepositorioGamas,autorizacion().autorizar).ejecutar(actor,1n,0),/Página inválida/)
})
test('edición exige versión válida y pasa el control de concurrencia al puerto',async()=>{
  const c=escritura(),caso=new EditarGamaCategoria(c.uow,autorizacion().autorizar)
  await assert.rejects(caso.ejecutar(actor,{...edicion,version:new Date('invalid')},{titulo:'A',descripcion:null,imagen:null}),/Versión/)
  assert.equal(c.llamadas,0)
  await caso.ejecutar(actor,edicion,{titulo:'A',descripcion:null,imagen:null});assert.equal(c.llamadas,1)
})
test('mover construye una permutación completa con posiciones desde uno',()=>{
  const lista=[{id:1n},{id:2n},{id:3n}]
  assert.deepEqual(moverElemento(lista,3n,1),[3n,1n,2n]);assert.deepEqual(moverElemento(lista,1n,3),[2n,3n,1n])
  for (const pos of [0,4,1.5])assert.throws(()=>moverElemento(lista,1n,pos))
  assert.throws(()=>moverElemento(lista,9n,1))
})
test('lote detecta duplicados y tipos inválidos antes de la primera escritura',async()=>{
  const c=escritura(),caso=new GuardarValoresGama(c.uow,autorizacion().autorizar)
  const cambio={filaId:1n,columnaId:1n,valor:{tipo:'numero' as const,valor:'13'}}
  await assert.rejects(caso.ejecutar(actor,edicion,[cambio,cambio]),/duplicada/)
  await assert.rejects(caso.ejecutar(actor,edicion,[cambio,{...cambio,columnaId:2n,valor:{tipo:'numero',valor:'NaN'}}]),/Decimal inválido/)
  assert.equal(c.valores.length,0)
})
test('lote conserva cero, false y texto vacío; null retira la celda',async()=>{
  const c=escritura(),caso=new GuardarValoresGama(c.uow,autorizacion().autorizar)
  await caso.ejecutar(actor,edicion,[{filaId:1n,columnaId:1n,valor:{tipo:'numero',valor:'0'}},{filaId:1n,columnaId:2n,valor:{tipo:'booleano',valor:false}},{filaId:1n,columnaId:3n,valor:{tipo:'texto',valor:''}},{filaId:1n,columnaId:4n,valor:null}])
  assert.deepEqual(c.valores,['0',false,'']);assert.deepEqual(c.quitados,[1n])
})
test('copia es estructural por defecto y valida dependencias de las opciones',()=>{
  assert.deepEqual(validarOpcionesCopia({}),{copiarFilas:false,copiarValores:false,copiarEnlaces:false})
  assert.throws(()=>validarOpcionesCopia({copiarValores:true}),/requiere copiar filas/)
  assert.throws(()=>validarOpcionesCopia({copiarEnlaces:true}),/requiere copiar filas/)
  assert.throws(()=>validarOpcionesCopia({copiarFilas:'false' as unknown as boolean}),/inválidas/)
})
test('copia rechaza misma categoría y una versión de origen obsoleta',async()=>{
  const repo={buscarPorId:async()=>({gama:gama(),estructura:{gruposColumnas:[],gruposFilas:[],columnas:[],filas:[],valores:[]}})} as unknown as RepositorioGamas
  const caso=new CopiarGamaCategoria(repo,{} as UnidadTrabajoGamas,autorizacion().autorizar)
  await assert.rejects(caso.ejecutar(actor,{categoriaId:1n,origenId:1n,versionOrigen:fecha}),/su categoría/)
  await assert.rejects(caso.ejecutar(actor,{categoriaId:2n,origenId:1n,versionOrigen:new Date(fecha.getTime()-1)}),/Origen modificado/)
})
