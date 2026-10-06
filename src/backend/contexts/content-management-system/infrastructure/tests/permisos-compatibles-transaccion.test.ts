import { test } from 'node:test'
import assert from 'node:assert/strict'
import { gestionarCms, type TxCms } from '../operaciones-cms.js'
import { PrismaLecturasCms } from '../prisma-lecturas-cms.js'
import type { PrismaClient } from '../../../../generated/prisma/client.js'
const actor = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
test('Escritura comprueba el permiso agrupado en la misma transacción',async()=>{
 const consultados: string[] = []
 const tx = {perfil:{findFirst:async ({where}: {where: {id: string; estado: string; eliminadoEn: null; AND: Array<{relUsuarioRol:{some:{rol:{relRolPermiso:{some:{permiso:{slug: string; estado: string}}}}}}}>}})=>{
  assert.equal(where.id,actor);assert.equal(where.estado,'activo');assert.equal(where.eliminadoEn,null)
  const permiso=where.AND[0].relUsuarioRol.some.rol.relRolPermiso.some.permiso;assert.equal(permiso.estado,'activo');consultados.push(permiso.slug)
  return permiso.slug==='cms.secciones.manage'?{id:actor}:null
 }}} as unknown as TxCms
 await gestionarCms(tx,{actorId:actor,cuando:new Date()},'contenidos-seccion')
 assert.deepEqual(consultados,['cms.contenidos_seccion.manage','cms.secciones.manage'])
 await assert.rejects(gestionarCms(tx,{actorId:actor,cuando:new Date()},'menus'),/Acceso denegado/)
})
test('Lectura del portal incluye permisos existentes y exige perfil activo',async()=>{
 let auditada=false
 const tx={perfil:{findFirst:async ({where}:any)=>{
  assert.equal(where.id,actor);assert.equal(where.estado,'activo');assert.equal(where.eliminadoEn,null)
  const permiso=where.relUsuarioRol.some.rol.relRolPermiso.some.permiso
  assert.equal(permiso.estado,'activo');assert.ok(permiso.slug.in.includes('cms.footers.read'));assert.ok(permiso.slug.in.includes('cms.wizard.manage'))
  return {id:actor}
 }},$executeRaw:async()=>{auditada=true;return 1}}
 const db={$transaction:async(fn:(tx:unknown)=>Promise<void>)=>fn(tx)} as unknown as PrismaClient
 await new PrismaLecturasCms(db,{ahora:()=>new Date()}).ejecutar({actorId:actor},'portal')
 assert.equal(auditada,true)
})
