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
import { componerGamas } from '../src/backend/contexts/catalog-management/infrastructure/componer-gamas.ts'
import { Orden } from '../src/backend/shared/domain/value-objects.ts'
const archivo=process.argv[2]
if (!archivo) throw new Error('Uso: node --import tsx scripts/verificar-casos-gamas.mjs respaldo.sql')
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
  for (const slug of ['catalog.categorias.manage','catalog.categorias.read','catalog.atributos_tecnicos.manage','catalog.asignaciones_atributo.manage']) {
    const permiso=await db.permiso.upsert({where:{slug},create:{slug,nombre:slug,grupo:'prueba-gamas'},update:{estado:'activo',eliminadoEn:null}})
    await db.rolPermiso.create({data:{rolId:rolPrueba.id,permisoId:permiso.id}})
  }
  await db.usuarioRol.create({data:{usuarioId:perfil.id,rolId:rolPrueba.id}})
  const actor=perfil.id,casos=componerGamas(db),lecturas=new PrismaGamas(db),uow=new PrismaUnidadTrabajoGamas(db)
  const todas=await db.categoria.findMany({where:{estado:'activo'},orderBy:{id:'asc'},select:{id:true,productoId:true}})
  const agrupadas=Map.groupBy(todas,c=>c.productoId)
  const grupo=[...agrupadas.values()].find(g=>g.length>=5)
  assert.ok(grupo,'Se necesitan cinco categorías del mismo producto en el respaldo')
  const [ca,cb,cc,cd,ce]=grupo,externa=todas.find(c=>c.productoId!==ca.productoId)
  assert.ok(externa)
  const tipo=await db.tipoAtributo.create({data:{nombre:'Casos gama',slug:'casos-gama',permiteValorNumerico:true}})
  const atributos={}
  for (const tipoDato of ['numero','texto','booleano']) atributos[tipoDato]=await db.atributoTecnico.create({data:{tipoAtributoId:tipo.id,nombre:tipoDato,tipoDato}})
  let id,version,gc,gf,columnas=[],filas=[],copiaEstructura,copiaCompleta,refInicial
  const edit=()=>({gamaId:id,version})
  const escribir=async(caso,...args)=>{const r=await caso.ejecutar(actor,edit(),...args);version=r.version;return r.resultado}
  await prueba('gama vacía no se convierte en plantilla',async()=>{
    const r=await casos.gamas.crear.ejecutar(actor,{categoriaId:ca.id,titulo:'Correas A',imagen:'/storage/diagrama.webp'});id=r.gamaId;version=r.version
    assert.equal(await casos.plantillas.obtener.ejecutar(actor,ca.productoId),null)
  })
  await prueba('primera columna configura y selecciona la referencia automáticamente',async()=>{
    gc=await escribir(casos.gruposColumnas.crear,{codigo:'medidas',nombre:'Dimensiones'})
    gf=await escribir(casos.gruposFilas.crear,{codigo:'clasicas',nombre:'Clásicas'})
    for (const tipoDato of ['numero','texto','booleano']) columnas.push(await escribir(casos.columnas.crear,{atributoId:atributos[tipoDato].id,tipoDato,grupoId:gc,etiqueta:tipoDato,unidadMedida:tipoDato==='numero'?'mm':null}))
    refInicial=await casos.plantillas.obtener.ejecutar(actor,ca.productoId)
    assert.equal(refInicial.gamaId,id)
  })
  await prueba('filas y lote de valores conservan precisión, cero y false',async()=>{
    for (const codigo of ['a','b']) filas.push(await escribir(casos.filas.crear,{codigo,nombre:codigo,grupoId:gf,descripcion:null,enlaceDetalle:'/products/origen/'+codigo+'/'}))
    await escribir(casos.valores.guardar,[{filaId:filas[0],columnaId:columnas[0],valor:{tipo:'numero',valor:'123456789012345678901234567890.123456789'}},{filaId:filas[0],columnaId:columnas[1],valor:{tipo:'texto',valor:'Caucho'}},{filaId:filas[0],columnaId:columnas[2],valor:{tipo:'booleano',valor:false}},{filaId:filas[1],columnaId:columnas[0],valor:{tipo:'numero',valor:'0'}}])
    assert.equal((await lecturas.buscarPorId(id)).estructura.valores.length,4)
  })
  await prueba('consulta, edición y estados de grupos y elementos',async()=>{
    assert.equal((await casos.gamas.porCategoria.ejecutar(actor,ca.id)).gama.id,id)
    assert.ok((await casos.gamas.listar.ejecutar(actor,ca.productoId)).some(g=>g.id===id))
    await escribir(casos.gruposColumnas.editar,gc,'Dimensiones personalizadas')
    await escribir(casos.gruposFilas.editar,gf,'Correas clásicas')
    await escribir(casos.columnas.editar,columnas[0],{grupoId:gc,etiqueta:'Ancho',unidadMedida:'mm'})
    await escribir(casos.filas.inactivar,filas[1]);await escribir(casos.filas.activar,filas[1])
  })
  await prueba('copia por defecto crea solo estructura con IDs nuevos',async()=>{
    copiaEstructura=await casos.plantillas.copiar.ejecutar(actor,cb.id)
    const copia=await lecturas.buscarPorId(copiaEstructura.gamaId),origen=await lecturas.buscarPorId(id)
    assert.equal(copia.gama.gamaOrigenId,id);assert.equal(copia.estructura.filas.length,0);assert.equal(copia.estructura.valores.length,0)
    assert.equal(copia.estructura.columnas.length,3);assert.notEqual(copia.estructura.gruposColumnas[0].id,gc)
    assert.ok(copia.estructura.columnas.every(c=>!columnas.includes(c.id)))
    assert.equal(copia.estructura.columnas[0].presentacion.etiqueta,origen.estructura.columnas[0].presentacion.etiqueta)
    assert.equal((await casos.plantillas.obtener.ejecutar(actor,ca.productoId)).gamaId,id)
  })
  await prueba('copia completa remapea filas, grupos y celdas; omite enlaces por defecto',async()=>{
    copiaCompleta=await casos.plantillas.copiar.ejecutar(actor,cc.id,{copiarFilas:true,copiarValores:true,titulo:'Correas C'})
    const copia=await lecturas.buscarPorId(copiaCompleta.gamaId)
    assert.equal(copia.gama.titulo,'Correas C');assert.equal(copia.estructura.valores.length,4)
    assert.ok(copia.estructura.filas.every(f=>!filas.includes(f.id)&&f.detalle.enlaceDetalle===null))
    assert.ok(copia.estructura.valores.every(v=>v.gamaId===copia.gama.id&&!filas.includes(v.filaId)&&!columnas.includes(v.columnaId)))
    assert.equal(copia.estructura.valores.find(v=>v.valor.tipo==='booleano').valor.valor,false)
  })
  await prueba('editar la copia y el origen no propaga cambios',async()=>{
    let copia=await lecturas.buscarPorId(copiaCompleta.gamaId)
    const r=await casos.columnas.editar.ejecutar(actor,{gamaId:copia.gama.id,version:copia.gama.actualizadoEn},copia.estructura.columnas[0].id,{grupoId:null,etiqueta:'Ancho C',unidadMedida:'cm'})
    assert.equal((await lecturas.buscarPorId(id)).estructura.columnas[0].presentacion.etiqueta,'Ancho')
    await escribir(casos.gamas.editar,{titulo:'Origen editado',descripcion:null,imagen:null})
    copia=await lecturas.buscarPorId(copiaCompleta.gamaId)
    assert.equal(copia.gama.titulo,'Correas C');assert.equal(copia.gama.imagen,'/storage/diagrama.webp');assert.equal(copia.gama.actualizadoEn.getTime(),r.version.getTime())
  })
  await prueba('opciones incoherentes y sobrescritura de categoría son rechazadas',async()=>{
    await assert.rejects(casos.plantillas.copiar.ejecutar(actor,cd.id,{copiarValores:true}),/requiere copiar filas/)
    assert.equal(await lecturas.buscarPorCategoria(cd.id),null)
    await assert.rejects(casos.plantillas.copiar.ejecutar(actor,cc.id),/ya tiene una gama/)
    await assert.rejects(casos.plantillas.copiar.ejecutar(actor,ca.id),/su categoría/)
  })
  await prueba('copia directa exige mismo producto y versión actual',async()=>{
    await assert.rejects(casos.plantillas.copiarDesdeGama.ejecutar(actor,{categoriaId:externa.id,origenId:id,versionOrigen:version}),/Origen incompatible/)
    await assert.rejects(casos.plantillas.copiarDesdeGama.ejecutar(actor,{categoriaId:cd.id,origenId:id,versionOrigen:new Date(version.getTime()-1)}),/Origen modificado/)
    const r=await casos.plantillas.copiarDesdeGama.ejecutar(actor,{categoriaId:cd.id,origenId:id,versionOrigen:version,copiarFilas:true,copiarEnlaces:true})
    const copia=await lecturas.buscarPorId(r.gamaId)
    assert.equal(copia.estructura.valores.length,0);assert.ok(copia.estructura.filas.every(f=>f.detalle.enlaceDetalle!==null))
  })
  await prueba('la transacción vuelve a comprobar la versión del origen',async()=>{
    const vieja=version;await escribir(casos.gamas.editar,{titulo:'Versión nueva',descripcion:null,imagen:null})
    let ejecutado=false
    await assert.rejects(uow.crear({categoriaId:ce.id,titulo:'Intento',descripcion:null,imagen:null,gamaOrigenId:id},actor,async()=>{ejecutado=true},{origen:{gamaId:id,version:vieja}}),/Origen modificado/)
    assert.equal(ejecutado,false);assert.equal(await lecturas.buscarPorCategoria(ce.id),null)
  })
  await prueba('cambiar la referencia invalida una copia preparada con la plantilla anterior',async()=>{
    const nueva=await casos.plantillas.seleccionar.ejecutar(actor,ca.productoId,copiaCompleta.gamaId,refInicial.actualizadoEn)
    await assert.rejects(uow.crear({categoriaId:ce.id,titulo:'Intento',descripcion:null,imagen:null,gamaOrigenId:id},actor,async()=>{},{origen:{gamaId:id,version,versionPlantilla:refInicial.actualizadoEn}}),/Plantilla modificada/)
    await casos.plantillas.seleccionar.ejecutar(actor,ca.productoId,id,nueva.actualizadoEn)
  })
  await prueba('mover una fila reorganiza la lista y rechaza una edición obsoleta',async()=>{
    const anterior=version
    await escribir(casos.filas.mover,filas[1],1)
    assert.deepEqual((await lecturas.buscarPorId(id)).estructura.filas.map(f=>f.id),[filas[1],filas[0]])
    await assert.rejects(casos.filas.mover.ejecutar(actor,{gamaId:id,version:anterior},filas[0],1),/modificada por otra operación/)
  })
  await prueba('error en segunda celda revierte todo el lote',async()=>{
    const antes=(await lecturas.buscarPorId(id)).estructura.valores.find(v=>v.filaId===filas[1]).valor.valor
    await assert.rejects(casos.valores.guardar.ejecutar(actor,edit(),[{filaId:filas[1],columnaId:columnas[0],valor:{tipo:'numero',valor:'99'}},{filaId:filas[0],columnaId:columnas[1],valor:{tipo:'numero',valor:'13'}}]),/incompatible/)
    const despues=await lecturas.buscarPorId(id)
    assert.equal(despues.gama.actualizadoEn.getTime(),version.getTime());assert.equal(despues.estructura.valores.find(v=>v.filaId===filas[1]).valor.valor,antes)
  })
  await prueba('eliminación de fila renumera y preserva sus valores históricos',async()=>{
    await escribir(casos.filas.eliminar,filas[1])
    assert.deepEqual((await lecturas.buscarPorId(id)).estructura.filas.map(f=>f.orden),[1])
    assert.equal((await lecturas.buscarPorId(id,true)).estructura.valores.length,4)
    await assert.rejects(casos.gruposFilas.eliminar.ejecutar(actor,edit(),gf),/Grupo no disponible/)
  })
  await prueba('plantilla protege la última columna activa',async()=>{
    await escribir(casos.columnas.inactivar,columnas[1]);await escribir(casos.columnas.inactivar,columnas[2])
    await assert.rejects(casos.columnas.inactivar.ejecutar(actor,edit(),columnas[0]),/última columna activa/)
    await assert.rejects(casos.gamas.inactivar.ejecutar(actor,edit()),/Retira o cambia/)
  })
  await prueba('permisos de aplicación deniegan antes de crear otra gama',async()=>{
    await assert.rejects(casos.gamas.crear.ejecutar('11111111-1111-4111-8111-111111111111',{categoriaId:ce.id,titulo:'No autorizado'}))
    assert.equal(await lecturas.buscarPorCategoria(ce.id),null)
  })
  await prueba('fallo de auditoría revierte también la selección automática de plantilla',async()=>{
    const vacia=await casos.gamas.crear.ejecutar(actor,{categoriaId:externa.id,titulo:'Vacía'})
    await db.$executeRawUnsafe("CREATE FUNCTION public.fallar_caso_gama_prueba() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN IF NEW.tabla_afectada = 'gamas_categoria' THEN RAISE EXCEPTION 'auditoria_prueba'; END IF; RETURN NEW; END; $$")
    await db.$executeRawUnsafe('CREATE TRIGGER fallar_caso_gama_prueba BEFORE INSERT ON public.auditoria FOR EACH ROW EXECUTE FUNCTION public.fallar_caso_gama_prueba()')
    try {
      await assert.rejects(casos.columnas.crear.ejecutar(actor,{gamaId:vacia.gamaId,version:vacia.version},{atributoId:atributos.numero.id,tipoDato:'numero',grupoId:null,etiqueta:null,unidadMedida:null}),/auditoria_prueba/)
      assert.equal(await casos.plantillas.obtener.ejecutar(actor,externa.productoId),null)
      assert.equal((await lecturas.buscarPorId(vacia.gamaId)).estructura.columnas.length,0)
    } finally {await db.$executeRawUnsafe('DROP TRIGGER fallar_caso_gama_prueba ON public.auditoria');await db.$executeRawUnsafe('DROP FUNCTION public.fallar_caso_gama_prueba()')}
  })
  await prueba('retirar referencia permite baja lógica sin afectar las copias',async()=>{
    const referencia=await casos.plantillas.obtener.ejecutar(actor,ca.productoId)
    await casos.plantillas.quitar.ejecutar(actor,ca.productoId,referencia.actualizadoEn)
    await escribir(casos.gamas.eliminar)
    assert.equal(await lecturas.buscarPorId(id),null)
    assert.equal((await lecturas.buscarPorId(copiaCompleta.gamaId)).gama.estado,'activo')
  })
  console.log(`${pruebas} escenarios de casos de uso correctos. Base temporal descartada.`)
} catch (e) {
  fallo = true;
  console.error('Integración fallida:', e);
}
finally {if(db)await db.$disconnect();if(servidor)await servidor.stop();await memoria.close()}
if(fallo)process.exit(1)
