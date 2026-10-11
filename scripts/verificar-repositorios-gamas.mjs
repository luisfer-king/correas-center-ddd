/** Integración real Prisma + protocolo PostgreSQL + PGlite. Nunca usa la base del usuario. */
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/backend/generated/prisma/client.ts'
import { PrismaUnidadTrabajoGamas } from '../src/backend/contexts/catalog-management/infrastructure/prisma-unidad-trabajo-gamas.ts'
import { PrismaGamas } from '../src/backend/contexts/catalog-management/infrastructure/prisma-gamas.ts'
import { PrismaPlantillasGama } from '../src/backend/contexts/catalog-management/infrastructure/prisma-plantillas-gama.ts'
import { PrismaAtributosTecnicos } from '../src/backend/contexts/catalog-management/infrastructure/prisma-atributos-tecnicos.ts'
import { PrismaAsignacionesAtributo } from '../src/backend/contexts/catalog-management/infrastructure/prisma-asignaciones-atributo.ts'
import { ValorTecnico } from '../src/backend/contexts/catalog-management/domain/valor-tecnico.ts'
import { Orden } from '../src/backend/shared/domain/value-objects.ts'
const archivo=process.argv[2]
if (!archivo) throw new Error('Uso: node --import tsx scripts/verificar-repositorios-gamas.mjs respaldo.sql')
const memoria=new PGlite(); let servidor,db,fallo=false,pruebas=0
const prueba=async(nombre,fn)=>{await fn();pruebas++;console.log(`OK ${nombre}`)}
try {
  const respaldo=await readFile(archivo,'utf8')
  const sql=respaldo.replace(/^\\(?:restrict|unrestrict).*$/gm,'').replace(/^COPY ([^\n]+) FROM stdin;\r?\n([\s\S]*?)^\\\.\r?$/gm,(_todo,tabla,datos)=>{
    const filas=datos.length===0?[]:datos.replace(/\r?\n$/,'').split(/\r?\n/)
    return filas.length ? `INSERT INTO ${tabla} VALUES `+filas.map(f=>'('+f.split('\t').map(v=>v==='\\N'?'NULL':`E'${v.replaceAll("'","''")}'`).join(',')+')').join(',')+';' : ''
  })
  await memoria.exec(sql)
  await memoria.exec(await readFile(new URL('../prisma/migrations/20261010023000_gamas_categoria_modelo/migration.sql',import.meta.url),'utf8'))
  servidor=new PGLiteSocketServer({db:memoria,host:'127.0.0.1',port:0,maxConnections:1})
  await servidor.start()
  const direccion=servidor.getServerConn()
  const connectionString=direccion.startsWith('postgres')?direccion:`postgresql://postgres:postgres@${direccion}/postgres`
  db=new PrismaClient({adapter:new PrismaPg({connectionString,max:1}),transactionOptions:{timeout:20000,maxWait:10000}})
  await db.$connect()
  // Fixture IAM exclusivamente en la base temporal: no depende de los roles del respaldo.
  const perfil=await db.perfil.findFirst({where:{estado:'activo',eliminadoEn:null},select:{id:true}})
  assert.ok(perfil,'El respaldo debe contener un perfil activo')
  const rolPrueba=await db.rol.create({data:{nombre:'Prueba aislada gamas',slug:'prueba_aislada_gamas'}})
  for (const slug of ['catalog.categorias.manage','catalog.atributos_tecnicos.manage','catalog.asignaciones_atributo.manage']) {
    const permiso=await db.permiso.upsert({where:{slug},create:{slug,nombre:slug,grupo:'prueba-gamas'},update:{estado:'activo',eliminadoEn:null}})
    await db.rolPermiso.create({data:{rolId:rolPrueba.id,permisoId:permiso.id}})
  }
  await db.usuarioRol.create({data:{usuarioId:perfil.id,rolId:rolPrueba.id}})
  const actor=perfil.id, uow=new PrismaUnidadTrabajoGamas(db), lecturas=new PrismaGamas(db), plantillas=new PrismaPlantillasGama(db)
  const categorias=await db.categoria.findMany({where:{estado:'activo'},orderBy:{id:'asc'},select:{id:true,productoId:true}})
  const ca=categorias[0],cb=categorias.find(c=>c.productoId===ca.productoId&&c.id!==ca.id),cc=categorias.find(c=>c.productoId!==ca.productoId)
  assert.ok(cb&&cc)
  const tipo=await db.tipoAtributo.create({data:{nombre:'Prueba repositorios gama',slug:'prueba-repositorios-gama',permiteValorNumerico:true,permiteDescripcion:true,permiteUnidadMedida:true}})
  const atributos=new PrismaAtributosTecnicos(db),asignaciones=new PrismaAsignacionesAtributo(db)
  const at={}
  await prueba('atributos tipados y asignaciones generales conservan texto, false y precisión',async()=>{
    for (const tipoDato of ['texto','numero','booleano']) at[tipoDato]=await atributos.crear({tipoAtributoId:tipo.id,tipoDato,nombre:tipoDato,valores:{descripcion:null,valorNumerico:null,unidadMedida:null},orden:Orden.create(1)},actor)
    const texto=await asignaciones.crear({categoriaId:ca.id,atributoId:at.texto.id,valorPersonalizado:null,valorTexto:'Caucho',orden:Orden.create(1)},actor)
    texto.personalizarValor(ValorTecnico.crear({tipo:'texto',valor:'Reforzado'}),new Date(texto.actualizadoEn.getTime()+1))
    await asignaciones.guardar(texto,new Date(texto.actualizadoEn.getTime()-1),actor)
    assert.equal((await asignaciones.buscarPorId(texto.id,false)).valorTexto,'Reforzado')
    const booleano=await asignaciones.crear({categoriaId:ca.id,atributoId:at.booleano.id,valorPersonalizado:null,valorBooleano:false,orden:Orden.create(2)},actor)
    assert.equal(booleano.valorBooleano,false)
    const numero=await asignaciones.crear({categoriaId:ca.id,atributoId:at.numero.id,valorPersonalizado:'123456789012345678901234567890.123456789',orden:Orden.create(3)},actor)
    assert.equal(numero.valorPersonalizado,'123456789012345678901234567890.123456789')
  })
  const datos=categoriaId=>({categoriaId,titulo:'Gama de prueba',descripcion:null,imagen:null})
  let id,version,filas,columnas
  await prueba('creación atómica de estructura y celdas con orden automático',async()=>{
    const creado=await uow.crear(datos(ca.id),actor,async s=>{
      const gc=await s.gruposColumnas.crear({codigo:'medidas',nombre:'Medidas'}),gf=await s.gruposFilas.crear({codigo:'clasicas',nombre:'Clásicas'})
      columnas=[]
      for (const tipoDato of ['numero','texto','booleano']) columnas.push(await s.columnas.crear({atributoId:at[tipoDato].id,tipoDato,grupoId:gc.id,etiqueta:null,unidadMedida:null}))
      filas=[]
      for (const codigo of ['a','b']) filas.push(await s.filas.crear({codigo,nombre:codigo,grupoId:gf.id,descripcion:null,enlaceDetalle:null}))
      await s.valores.poner(filas[0].id,columnas[0].id,ValorTecnico.crear({tipo:'numero',valor:'123456789012345678901234567890.123456789'}))
      await s.valores.poner(filas[0].id,columnas[1].id,ValorTecnico.crear({tipo:'texto',valor:''}))
      await s.valores.poner(filas[0].id,columnas[2].id,ValorTecnico.crear({tipo:'booleano',valor:false}))
    });id=creado.gamaId;version=creado.version
    const leido=await lecturas.buscarPorCategoria(ca.id)
    assert.equal(leido.gama.id,id);assert.deepEqual(leido.estructura.filas.map(f=>f.orden),[1,2])
    assert.equal(leido.estructura.valores[0].valor.valor,'123456789012345678901234567890.123456789')
    assert.equal(leido.estructura.valores[2].valor.valor,false)
  })
  await prueba('denegación de permiso impide ejecutar el trabajo',async()=>{
    let ejecutado=false
    await assert.rejects(uow.editar(id,version,'11111111-1111-4111-8111-111111111111',async()=>{ejecutado=true}),/Acceso denegado/)
    assert.equal(ejecutado,false)
  })
  await prueba('rollback de creación parcial y su auditoría',async()=>{
    const antes=await db.eventoAuditoria.count()
    await assert.rejects(uow.crear(datos(cb.id),actor,async s=>{
      await s.filas.crear({codigo:'a',nombre:'A',grupoId:null,descripcion:null,enlaceDetalle:null})
      throw new Error('Fallo controlado')
    }),/Fallo controlado/)
    assert.equal(await lecturas.buscarPorCategoria(cb.id),null);assert.equal(await db.eventoAuditoria.count(),antes)
  })
  await prueba('reordenación real sin colisiones y rechazo de versión obsoleta',async()=>{
    const anterior=version
    const r=await uow.editar(id,version,actor,async s=>{await s.filas.reordenar([filas[1].id,filas[0].id]);await s.columnas.reordenar(columnas.map(c=>c.id).reverse())})
    version=r.version
    assert.deepEqual((await lecturas.buscarPorId(id)).estructura.filas.map(f=>f.id),[filas[1].id,filas[0].id])
    await assert.rejects(uow.editar(id,anterior,actor,async()=>{}),/modificada por otra operación/)
  })
  await prueba('rechazo de permutación incompleta y grupo con hijos vigentes',async()=>{
    await assert.rejects(uow.editar(id,version,actor,async s=>s.filas.reordenar([filas[0].id])),/todos los elementos/)
    await assert.rejects(uow.editar(id,version,actor,async s=>{const [g]=await s.gruposFilas.listar();g.eliminar(s.cuando);await s.gruposFilas.guardar(g)}),/Grupo no disponible/)
    assert.equal((await lecturas.buscarPorId(id)).gama.actualizadoEn.getTime(),version.getTime())
  })
  let otra
  await prueba('origen del mismo producto y aislamiento entre gamas',async()=>{
    otra=await uow.crear({...datos(cb.id),gamaOrigenId:id},actor,async()=>{})
    await assert.rejects(uow.editar(otra.gamaId,otra.version,actor,async s=>s.filas.guardar(filas[0])),/ajeno/)
    await assert.rejects(uow.editar(otra.gamaId,otra.version,actor,async s=>s.valores.poner(filas[0].id,columnas[0].id,ValorTecnico.crear({tipo:'numero',valor:'1'}))),/no disponible/)
    await assert.rejects(uow.crear({...datos(cc.id),gamaOrigenId:id},actor,async()=>{}),/Origen incompatible/)
  })
  await prueba('valores incompatibles no alteran la celda ni la versión',async()=>{
    await assert.rejects(uow.editar(id,version,actor,async s=>s.valores.poner(filas[0].id,columnas[0].id,ValorTecnico.crear({tipo:'texto',valor:'13'}))),/incompatible/)
    assert.equal((await lecturas.buscarPorId(id)).gama.actualizadoEn.getTime(),version.getTime())
  })
  await prueba('plantilla por producto con versión y protección frente a inactivación',async()=>{
    const p=await plantillas.seleccionar(ca.productoId,id,null,actor)
    assert.equal((await plantillas.buscarPorProducto(ca.productoId)).gamaId,id)
    await assert.rejects(plantillas.seleccionar(ca.productoId,otra.gamaId,null,actor),/modificada/)
    await assert.rejects(plantillas.seleccionar(cc.productoId,id,null,actor),/incompatible/)
    await assert.rejects(uow.editar(id,version,actor,async s=>s.gama.inactivar(s.cuando)),/Retira o cambia/)
    await plantillas.quitar(ca.productoId,p.actualizadoEn,actor)
  })
  await prueba('quitar celda representa ausencia, conservando las otras celdas',async()=>{
    const r=await uow.editar(id,version,actor,async s=>s.valores.quitar(filas[0].id,columnas[1].id));version=r.version
    assert.equal((await lecturas.buscarPorId(id)).estructura.valores.length,2)
  })
  await prueba('baja lógica de gama conserva historia y oculta el agregado',async()=>{
    const r=await uow.editar(id,version,actor,async s=>s.gama.eliminar(s.cuando));version=r.version
    assert.equal(await lecturas.buscarPorId(id),null)
    const historico=await lecturas.buscarPorId(id,true)
    assert.ok(historico.estructura.filas.every(f=>f.estado==='eliminado'))
    assert.equal(historico.estructura.valores.length,2)
    await assert.rejects(uow.editar(id,version,actor,async()=>{}),/no disponible/)
    const auditoria=await db.eventoAuditoria.findFirst({where:{tablaAfectada:'gamas_categoria',registroId:id.toString()},orderBy:{id:'desc'}})
    assert.equal(auditoria.datosNuevos.estado,'eliminado')
  })
  await prueba('un fallo de auditoría revierte los datos y la gama recién creada',async()=>{
    await db.$executeRawUnsafe("CREATE FUNCTION public.fallar_auditoria_gama_prueba() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.tabla_afectada = 'gamas_categoria' THEN RAISE EXCEPTION 'auditoria_prueba'; END IF; RETURN NEW; END; $$")
    await db.$executeRawUnsafe('CREATE TRIGGER fallar_auditoria_gama_prueba BEFORE INSERT ON public.auditoria FOR EACH ROW EXECUTE FUNCTION public.fallar_auditoria_gama_prueba()')
    try {
      await assert.rejects(uow.crear(datos(cc.id),actor,async s=>{await s.filas.crear({codigo:'a',nombre:'A',grupoId:null,descripcion:null,enlaceDetalle:null})}),/auditoria_prueba/)
      assert.equal(await lecturas.buscarPorCategoria(cc.id),null)
    } finally {
      await db.$executeRawUnsafe('DROP TRIGGER fallar_auditoria_gama_prueba ON public.auditoria')
      await db.$executeRawUnsafe('DROP FUNCTION public.fallar_auditoria_gama_prueba()')
    }
  })
  console.log(`${pruebas} escenarios de integración correctos. Base temporal descartada.`)
} catch(e) { fallo=true;console.error('Integración fallida:',e.code??e.name,e.message) }
finally { if(db)await db.$disconnect();if(servidor)await servidor.stop();await memoria.close() }
if(fallo)process.exit(1)
