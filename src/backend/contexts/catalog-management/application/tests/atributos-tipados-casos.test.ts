import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CrearAtributoTecnico } from '../use-cases/atributos-tecnicos/crear-atributo-tecnico.js'
import { CrearAsignacionAtributo } from '../use-cases/asignaciones-atributo/crear-asignacion-atributo.js'
import { EditarAsignacionAtributo } from '../use-cases/asignaciones-atributo/editar-asignacion-atributo.js'
import { valorAsignacion, type DatosValorAsignacion } from '../valor-asignacion-aplicacion.js'
import type { RepositorioAtributosTecnicos, DatosNuevoAtributoTecnico } from '../ports/repositorio-atributos-tecnicos.js'
import type { RepositorioAsignacionesAtributo, DatosNuevaAsignacionAtributo } from '../ports/repositorio-asignaciones-atributo.js'
import type { AutorizacionCatalogo } from '../acceso-catalogo.js'
import { AsignacionAtributo } from '../../domain/asignacion-atributo.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
const autorizar:AutorizacionCatalogo={ejecutar:async()=>{},tienePermiso:async()=>true,tieneRolActivo:async()=>false}
const actor='11111111-1111-4111-8111-111111111111',fecha=new Date('2026-10-10T00:00:00Z')
test('crear atributo conserva defecto numérico y admite definición textual',async()=>{
  const tipos:string[]=[]
  const repo={crear:async(d:DatosNuevoAtributoTecnico)=>{tipos.push(d.tipoDato!)}} as unknown as RepositorioAtributosTecnicos
  const caso=new CrearAtributoTecnico(repo,autorizar),d={tipoAtributoId:1n,nombre:'Material',valores:{descripcion:null,valorNumerico:null,unidadMedida:null},orden:1}
  await caso.ejecutar(actor,d);await caso.ejecutar(actor,{...d,tipoDato:'texto'})
  assert.deepEqual(tipos,['numero','texto'])
  await assert.rejects(caso.ejecutar(actor,{...d,tipoDato:'texto',valores:{...d.valores,valorNumerico:'1'}}),/no admite/)
})
test('crear asignación conserva false y admite el contrato numérico anterior',async()=>{
  const datos:DatosNuevaAsignacionAtributo[]=[]
  const repo={crear:async(d:DatosNuevaAsignacionAtributo)=>{datos.push(d)}} as unknown as RepositorioAsignacionesAtributo
  const caso=new CrearAsignacionAtributo(repo,autorizar),d={categoriaId:1n,atributoId:1n,orden:1}
  await caso.ejecutar(actor,{...d,valor:{tipo:'booleano',valor:false}})
  await caso.ejecutar(actor,{...d,valorPersonalizado:'0'})
  assert.equal(datos[0].valorBooleano,false);assert.equal(datos[1].valorPersonalizado,'0')
})
test('editar asignación textual guarda el valor tipado con versión previa',async()=>{
  const registro=new AsignacionAtributo({id:1n,categoriaId:1n,atributoId:1n,tipoDato:'texto',valorPersonalizado:null,valorTexto:'Caucho',orden:Orden.create(1),estado:'activo',fechas:{creadoEn:fecha,actualizadoEn:fecha}})
  let version:Date|undefined
  const repo={buscarPorId:async()=>registro,guardar:async(_e:AsignacionAtributo,v:Date)=>{version=v}} as unknown as RepositorioAsignacionesAtributo
  await new EditarAsignacionAtributo(repo,autorizar,{ahora:()=>fecha}).ejecutar(actor,1n,{valor:{tipo:'texto',valor:'Reforzado'},orden:2})
  assert.equal(registro.valorTexto,'Reforzado');assert.equal(version?.getTime(),fecha.getTime())
})
test('contratos ambiguos no sobrescriben silenciosamente un valor',()=>{
  assert.throws(()=>valorAsignacion({valor:{tipo:'texto',valor:'A'},valorPersonalizado:'1'} as unknown as DatosValorAsignacion),/ambiguo/)
  assert.throws(()=>valorAsignacion({} as DatosValorAsignacion),/obligatorio/)
  assert.equal(valorAsignacion({valor:null}).valor,null)
})
