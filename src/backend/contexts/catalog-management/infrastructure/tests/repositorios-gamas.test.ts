import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Prisma, type PrismaClient } from '../../../../generated/prisma/client.js'
import { aValorGama, datosValorTecnico } from '../mappers/valor-gama.js'
import { aGrupoColumnaGama } from '../mappers/grupo-columna-gama.js'
import { aGrupoFilaGama } from '../mappers/grupo-fila-gama.js'
import { aColumnaGama } from '../mappers/columna-gama.js'
import { aFilaGama } from '../mappers/fila-gama.js'
import { aGamaCategoria } from '../mappers/gama-categoria.js'
import { aPlantillaGamaProducto } from '../mappers/plantilla-gama-producto.js'
import { aAtributoTecnico } from '../mappers/atributo-tecnico.js'
import { aAsignacionAtributo } from '../mappers/asignacion-atributo.js'
import { ValorTecnico } from '../../domain/valor-tecnico.js'
import { validarPermutacion, nuevaVersionGama, visibilidadGama, jsonGama } from '../operaciones-gamas.js'
import { PrismaUnidadTrabajoGamas } from '../prisma-unidad-trabajo-gamas.js'
const fecha=new Date('2026-10-10T00:00:00Z')
const base={id:1n,estado:'activo' as const,creadoEn:fecha,actualizadoEn:fecha,eliminadoEn:null}
const fGama={...base,categoriaId:1n,productoId:1n,gamaOrigenId:null,titulo:'Gama',descripcion:null,imagen:null}
const fColumna={...base,gamaId:1n,atributoId:1n,tipoDato:'numero' as const,grupoId:null,etiqueta:null,unidadMedida:null,orden:1}
const fFila={...base,gamaId:1n,grupoId:null,codigo:'a',nombre:'A',descripcion:null,enlaceDetalle:null,orden:1}
const fValor={filaId:1n,columnaId:1n,gamaId:1n,tipoDato:'numero' as const,valorTexto:null,valorBooleano:null,valorNumero:new Prisma.Decimal('123456789012345678901234567890.123456789'),creadoEn:fecha,actualizadoEn:fecha}
test('mappers mantienen IDs bigint, fechas y grupos independientes',()=>{
  const f={...base,gamaId:1n,codigo:'grupo',nombre:'Grupo',orden:1}
  assert.equal(aGrupoColumnaGama(f).clase,'columnas');assert.equal(aGrupoFilaGama(f).clase,'filas')
  assert.equal(aColumnaGama(fColumna).atributoId,1n);assert.equal(aFilaGama(fFila).detalle.enlaceDetalle,null)
  assert.equal(aGamaCategoria(fGama).productoId,1n)
})
test('mapper decimal usa notación fija y evita pérdida de precisión',()=>{
  assert.equal(aValorGama(fValor).valor.valor,'123456789012345678901234567890.123456789')
  assert.equal(aValorGama({...fValor,valorNumero:new Prisma.Decimal('0.00000000000000000001')}).valor.valor,'0.00000000000000000001')
})
test('mappers heredados admiten decimales de gran magnitud',()=>{
  const numero=new Prisma.Decimal('123456789012345678901234567890.123456789')
  const a=aAtributoTecnico({...base,tipoAtributoId:1n,nombre:'Ancho',descripcion:null,valorNumerico:numero,unidadMedida:null,orden:1,tipoDato:'numero'})
  const c=aAsignacionAtributo({...base,categoriaId:1n,atributoId:1n,valorPersonalizado:numero,valorTexto:null,valorBooleano:null,orden:1,tipoDato:'numero'})
  assert.equal(a.valores.valorNumerico,numero.toFixed());assert.equal(c.valorPersonalizado,numero.toFixed())
})
test('mapper rechaza celdas corruptas y conserva false/texto vacío',()=>{
  assert.throws(()=>aValorGama({...fValor,valorTexto:'extra'}),/corrupta/)
  assert.throws(()=>aValorGama({...fValor,valorNumero:null}),/corrupta/)
  assert.throws(()=>aValorGama({...fValor,tipoDato:'booleano'}),/incompatible/)
  assert.equal(aValorGama({...fValor,tipoDato:'booleano',valorNumero:null,valorBooleano:false}).valor.valor,false)
  assert.equal(aValorGama({...fValor,tipoDato:'texto',valorNumero:null,valorTexto:''}).valor.valor,'')
})
test('serialización de celda limpia los campos de los otros tipos',()=>{
  assert.deepEqual(datosValorTecnico(ValorTecnico.crear({tipo:'booleano',valor:false})),{tipoDato:'booleano',valorNumero:null,valorTexto:null,valorBooleano:false})
})
test('mapper de plantilla impide producto distinto y gama inactiva',()=>{
  const f={productoId:1n,gamaId:1n,creadoEn:fecha,actualizadoEn:fecha,gama:fGama}
  assert.equal(aPlantillaGamaProducto(f).gamaId,1n)
  assert.throws(()=>aPlantillaGamaProducto({...f,productoId:2n}))
  assert.throws(()=>aPlantillaGamaProducto({...f,gama:{...fGama,estado:'inactivo'}}))
})
test('reordenación exige permutación completa y controla desbordamiento',()=>{
  const actuales=[{id:1n,orden:3},{id:2n,orden:7}]
  assert.equal(validarPermutacion([2n,1n],actuales),7)
  for (const ids of [[1n],[1n,1n],[1n,3n]]) assert.throws(()=>validarPermutacion(ids,actuales))
  assert.throws(()=>validarPermutacion([1n],[{id:1n,orden:2147483647}]))
  assert.equal(validarPermutacion([],[]),0)
})
test('versión siempre avanza incluso si el reloj está atrasado',()=>{
  const futura=new Date('2099-01-01T00:00:00Z')
  assert.equal(nuevaVersionGama(futura).getTime(),futura.getTime()+1)
})
test('lectura sin eliminados oculta sus celdas y mantiene historia explícita',()=>{
  const fila=aFilaGama({...fFila,estado:'eliminado',eliminadoEn:fecha})
  const d={gama:aGamaCategoria(fGama),estructura:{gruposColumnas:[],gruposFilas:[],columnas:[aColumnaGama(fColumna)],filas:[fila],valores:[aValorGama(fValor)]}}
  assert.equal(visibilidadGama(d,false)?.estructura.valores.length,0)
  assert.equal(visibilidadGama(d,true)?.estructura.valores.length,1)
  assert.doesNotThrow(()=>JSON.stringify(jsonGama(d)))
})
test('unidad de trabajo comprueba permiso antes de llamar al trabajo y usa Serializable',async()=>{
  let llamado=false
  const tx={perfil:{findFirst:async()=>null}}
  const db={$transaction:async(fn:(t:typeof tx)=>Promise<unknown>,opciones:unknown)=>{assert.deepEqual(opciones,{isolationLevel:'Serializable'});return fn(tx)}} as unknown as PrismaClient
  const repo=new PrismaUnidadTrabajoGamas(db)
  await assert.rejects(repo.editar(1n,fecha,'11111111-1111-4111-8111-111111111111',async()=>{llamado=true}),/Acceso denegado/)
  assert.equal(llamado,false)
})
