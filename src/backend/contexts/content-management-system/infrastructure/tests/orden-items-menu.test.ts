import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Orden } from '../../../../shared/domain/value-objects.js'
import { PrismaItemsMenu } from '../prisma-menu-item.js'
import { mapearMenuItem } from '../mappers/menu-item.js'
import { entorno, antes, despues, contexto } from './soporte-pruebas-cms.js'
function preparar(){
  const env=entorno('menuItem'),base=env.fila()
  env.tablas.menuItem=[{...base,id:2n,orden:1},{...base,id:3n,orden:2,estado:'inactivo'},{...base,id:4n,orden:3},{...base,id:5n,menuId:2n,orden:1}]
  return env
}
function posiciones(env:ReturnType<typeof entorno>){return env.tablas.menuItem.filter(x=>x.menuId===1n&&x.eliminadoEn===null).sort((a,b)=>a.orden-b.orden).map(x=>[x.id,x.orden])}
for(const [id,orden,esperado] of [[4n,1,[[4n,1],[2n,2],[3n,3]]],[2n,3,[[3n,1],[4n,2],[2n,3]]]] as const){
  test(`ítems: mover ${id} a ${orden} desplaza hermanos e incluye inactivos`,async()=>{
    const env=preparar(),e=mapearMenuItem(env.tablas.menuItem.find(x=>x.id===id) as Parameters<typeof mapearMenuItem>[0])
    e.reordenar(Orden.create(orden),despues);await new PrismaItemsMenu(env.db).guardar(e,antes,contexto)
    assert.deepEqual(posiciones(env),esperado)
    assert.equal(env.tablas.menuItem.find(x=>x.id===5n)!.actualizadoEn.getTime(),antes.getTime())
    assert.equal(env.auditorias.length,3)
    assert.ok(env.tablas.menuItem.every(x=>x.orden>0))
    const writes=env.consultas.filter(x=>x.modelo==='menuItem'&&x.metodo==='updateMany')
    assert.deepEqual(writes.slice(0,3).map(x=>x.args.data.orden),[-1,-2,-3])
  })
}
test('ítems: creación inicia en 1, está activa y genera ruta de categoría',async()=>{
  const env=preparar();env.tablas.menuItem=env.tablas.menuItem.filter(x=>x.menuId!==1n)
  const r=await new PrismaItemsMenu(env.db).crear({menuId:1n,nombre:'Correas en V',categoriaId:1n},contexto)
  assert.equal(r.orden.value,1);assert.equal(r.estado,'activo');assert.equal(r.nombre,'Correas en V')
  assert.equal(r.ruta.value,'/products/correas-industriales/correas-en-v/')
})
test('ítems: creación agrega al final del menú y conserva otro padre',async()=>{
  const env=preparar(),r=await new PrismaItemsMenu(env.db).crear({menuId:1n,nombre:'Nuevo',categoriaId:1n},contexto)
  assert.equal(r.orden.value,4);assert.equal(env.tablas.menuItem.find(x=>x.id===5n)!.orden,1)
})
test('ítems: baja compacta el orden sin eliminar hermanos inactivos',async()=>{
  const env=preparar(),e=mapearMenuItem(env.fila() as Parameters<typeof mapearMenuItem>[0]);e.eliminar(despues)
  await new PrismaItemsMenu(env.db).guardar(e,antes,contexto)
  assert.deepEqual(posiciones(env),[[3n,1],[4n,2]])
  assert.equal(env.tablas.menuItem.find(x=>x.id===2n)!.estado,'eliminado')
})
test('ítems: auditoría fallida revierte todos los órdenes y la versión del padre',async()=>{
  const env=preparar();env.opciones.fallarAuditoria=true
  const e=mapearMenuItem(env.fila() as Parameters<typeof mapearMenuItem>[0]);e.reordenar(Orden.create(3),despues)
  await assert.rejects(new PrismaItemsMenu(env.db).guardar(e,antes,contexto),/Fallo auditoría/)
  assert.deepEqual(posiciones(env),[[2n,1],[3n,2],[4n,3]])
  assert.equal(env.tablas.menu.find(x=>x.id===1n)!.actualizadoEn.getTime(),antes.getTime())
})
test('ítems: posición fuera del rango no altera los hermanos',async()=>{
  const env=preparar(),e=mapearMenuItem(env.fila() as Parameters<typeof mapearMenuItem>[0]);e.reordenar(Orden.create(4),despues)
  await assert.rejects(new PrismaItemsMenu(env.db).guardar(e,antes,contexto),/Posición/)
  assert.deepEqual(posiciones(env),[[2n,1],[3n,2],[4n,3]])
})
for(const tipo of ['industria','servicio'] as const)test(`ítems: ruta usa el registro ${tipo} del padre`,async()=>{
  const env=preparar();env.tablas.menu.find(x=>x.id===1n)!.tipoRegistro=tipo
  if(tipo==='servicio')env.tablas.servicio[0].nombre='Asesoría Técnica'
  const r=await new PrismaItemsMenu(env.db).crear({menuId:1n,nombre:'Categoría',categoriaId:1n},contexto)
  assert.equal(r.ruta.value,tipo==='industria'?'/applications/correas-industriales/correas-en-v/':'/services/asesoria-tecnica/correas-en-v/')
})
test('ítems: categoría de otra empresa no genera enlaces',async()=>{
  const env=preparar();env.tablas.producto[0].empresaId=9n
  await assert.rejects(new PrismaItemsMenu(env.db).crear({menuId:1n,nombre:'Categoría',categoriaId:1n},contexto),/otra empresa/)
  assert.equal(env.auditorias.length,0)
})

test('ítems: se pueden inactivar aunque la categoría ya no esté activa',async()=>{
  const env=preparar();env.tablas.categoria[0].estado='inactivo'
  const e=mapearMenuItem(env.fila() as Parameters<typeof mapearMenuItem>[0]);e.inactivar(despues)
  await new PrismaItemsMenu(env.db).guardar(e,antes,contexto)
  assert.equal(env.tablas.menuItem.find(x=>x.id===2n)!.estado,'inactivo')
  assert.deepEqual(posiciones(env),[[2n,1],[3n,2],[4n,3]])
})
