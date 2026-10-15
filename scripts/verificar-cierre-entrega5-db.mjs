/** Usa PostgreSQL temporal; no lee DATABASE_URL ni modifica la BD del usuario. */
import assert from 'node:assert/strict'
import {readFile,readdir} from 'node:fs/promises'
import {PGlite} from '@electric-sql/pglite'
import {PGLiteSocketServer} from '@electric-sql/pglite-socket'
import {PrismaPg} from '@prisma/adapter-pg'
import {PrismaClient} from '../src/backend/generated/prisma/client.ts'
import {PrismaItemsMenu} from '../src/backend/contexts/content-management-system/infrastructure/prisma-menu-item.ts'
import {Orden} from '../src/backend/shared/domain/value-objects.ts'
const memoria=new PGlite();let servidor,db,pruebas=0
const comprobar=async(nombre,fn)=>{await fn();pruebas++;console.log('OK '+nombre)}
try{
 for(const nombre of (await readdir('prisma/migrations')).filter(n=>/^\d/.test(n)).sort())await memoria.exec(await readFile('prisma/migrations/'+nombre+'/migration.sql','utf8'))
 servidor=new PGLiteSocketServer({db:memoria,host:'127.0.0.1',port:0,maxConnections:1});await servidor.start();const direccion=servidor.getServerConn()
 db=new PrismaClient({adapter:new PrismaPg({connectionString:direccion.startsWith('postgres')?direccion:'postgresql://postgres:postgres@'+direccion+'/postgres',max:1}),transactionOptions:{timeout:20000}})
 const usuario=await db.usuario.create({data:{email:'prueba-subenlaces@example.test'}})
 await db.perfil.create({data:{id:usuario.id,nombreCompleto:'Prueba temporal'}})
 const rol=await db.rol.create({data:{nombre:'Editor temporal',slug:'editor_temporal'}}),permiso=await db.permiso.create({data:{nombre:'Gestionar subenlaces temporal',slug:'cms.items_menu.manage',grupo:'cms'}})
 await db.rolPermiso.create({data:{rolId:rol.id,permisoId:permiso.id}});await db.usuarioRol.create({data:{usuarioId:usuario.id,rolId:rol.id}})
 const antes=new Date('2020-01-01'),empresa=await db.empresa.create({data:{nombre:'Empresa temporal'}}),producto=await db.producto.create({data:{empresaId:empresa.id,nombre:'Correas',slug:'correas'}})
 const categorias=[];for(const [i,nombre] of ['Trapezoidales','Sincronas','Acanaladas','Variadoras'].entries())categorias.push(await db.categoria.create({data:{productoId:producto.id,nombre,slug:'correas/'+nombre.toLowerCase(),orden:i+1}}))
 const menu=await db.menu.create({data:{empresaId:empresa.id,grupo:'Producto',tipoRegistro:'producto',registroId:producto.id,ruta:'/products/correas/',creadoEn:antes,actualizadoEn:antes}})
 const ids=[];for(const [i,c] of categorias.slice(0,3).entries())ids.push((await db.menuItem.create({data:{menuId:menu.id,nombre:c.nombre,categoriaId:c.id,ruta:'/products/'+c.slug+'/',orden:i+1,creadoEn:antes,actualizadoEn:antes}})).id)
 const repo=new PrismaItemsMenu(db);let tiempo=Date.now();const contexto=()=>({actorId:usuario.id,cuando:new Date(tiempo+=1000),ipAddress:'127.0.0.1',userAgent:'prueba-cierre-5'})
 const posiciones=async()=> (await db.menuItem.findMany({where:{menuId:menu.id,eliminadoEn:null},orderBy:{orden:'asc'}})).map(f=>[String(f.id),f.orden])
 await comprobar('editar un subenlace guarda y registra auditoría sin conflicto artificial',async()=>{
  const e=await repo.obtener(ids[0]),version=e.actualizadoEn,ctx=contexto();e.editar('Correas en V',categorias[0].id,ctx.cuando);await repo.guardar(e,version,ctx)
  const f=await db.menuItem.findUnique({where:{id:ids[0]}});assert.equal(f.nombre,'Correas en V');assert.equal(f.orden,1);assert.equal(f.actualizadoEn.getTime(),ctx.cuando.getTime());assert.equal((await db.eventoAuditoria.count()),1)
 })
 await comprobar('versión antigua sigue rechazándose sin modificar registros',async()=>{
  const e=await repo.obtener(ids[0]),ctx=contexto();e.editar('No debe guardar',e.categoriaId,ctx.cuando)
  await assert.rejects(repo.guardar(e,antes,ctx),/modificado/);assert.equal((await db.menuItem.findUnique({where:{id:ids[0]}})).nombre,'Correas en V')
 })
 await comprobar('reordenar mueve todos los hermanos y registra cada cambio',async()=>{
  const e=await repo.obtener(ids[2]),version=e.actualizadoEn,ctx=contexto();e.reordenar(Orden.create(1),ctx.cuando);await repo.guardar(e,version,ctx)
  assert.deepEqual(await posiciones(),[[String(ids[2]),1],[String(ids[0]),2],[String(ids[1]),3]]);assert.equal(await db.eventoAuditoria.count(),4)
 })
 await comprobar('inactivar y activar conservan identidad y orden',async()=>{
  for(const accion of ['inactivar','activar']){const e=await repo.obtener(ids[0]),version=e.actualizadoEn,ctx=contexto();e[accion](ctx.cuando);await repo.guardar(e,version,ctx);assert.equal((await db.menuItem.findUnique({where:{id:ids[0]}})).estado,accion==='inactivar'?'inactivo':'activo')}
 })
 await comprobar('eliminar compacta posiciones con Prisma real',async()=>{
  const e=await repo.obtener(ids[0]),version=e.actualizadoEn,ctx=contexto();e.eliminar(ctx.cuando);await repo.guardar(e,version,ctx)
  assert.deepEqual(await posiciones(),[[String(ids[2]),1],[String(ids[1]),2]]);assert.equal((await db.menuItem.findUnique({where:{id:ids[0]}})).estado,'eliminado')
 })
 await comprobar('crear subenlace después de compactar agrega al final',async()=>{
  const e=await repo.crear({menuId:menu.id,nombre:'Variadoras',categoriaId:categorias[3].id},contexto());assert.equal(e.orden.value,3);assert.equal(e.ruta.value,'/products/correas/variadoras/')
 })
 await comprobar('usuario sin permisos sigue sin poder guardar',async()=>{
  const e=await repo.obtener(ids[2]),version=e.actualizadoEn,ctx=contexto();e.editar('No autorizado',e.categoriaId,ctx.cuando)
  await db.usuarioRol.update({where:{usuarioId_rolId:{usuarioId:usuario.id,rolId:rol.id}},data:{estado:'inactivo'}})
  await assert.rejects(repo.guardar(e,version,ctx),/Acceso denegado/);assert.equal((await db.menuItem.findUnique({where:{id:ids[2]}})).nombre,'Acanaladas')
 })
 console.log(pruebas+' comprobaciones aprobadas con Prisma y PostgreSQL temporal.')
}finally{if(db)await db.$disconnect();if(servidor)await servidor.stop();await memoria.close()}
