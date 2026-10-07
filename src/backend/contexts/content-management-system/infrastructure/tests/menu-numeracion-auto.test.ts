import assert from 'node:assert/strict'
import {test} from 'node:test'
import {PrismaMenus} from '../prisma-menu.js'
import {RutaInterna} from '../../domain/cms-values.js'
import {entorno,contexto,antes,despues} from './soporte-pruebas-cms.js'
const datos=(grupo='Producto',id=1n)=>({empresaId:1n,grupo,destino:{tipo:grupo==='Producto'?'producto' as const:grupo==='Aplicacion'?'industria' as const:'servicio' as const,id},ruta:RutaInterna.create('/products'),icono:'Package',mostrar:true,cargarSubmenu:null})
test('menús: solo orden es consecutivo; conserva un ID real distinto de ese orden',async()=>{
  const env=entorno('menu');env.tablas.menu=[];env.tablas.producto[0].id=500n
  const repo=new PrismaMenus(env.db),a=await repo.crear(datos('Producto',500n),contexto),b=await repo.crear(datos('Producto',500n),contexto)
  assert.equal(a.orden.value,1);assert.equal(b.orden.value,2);assert.equal(a.destino.id,500n);assert.equal(b.destino.id,500n)
  assert.deepEqual(env.consultas.find(c=>c.metodo==='aggregate')!.args._max,{orden:true})
})
test('menús: Aplicacion apunta a industria; cada grupo tiene su contador',async()=>{
  const env=entorno('menu');env.tablas.menu=[]
  for(const grupo of ['Producto','Aplicacion','Servicio']) {
    const m=await new PrismaMenus(env.db).crear(datos(grupo),contexto)
    assert.equal(m.orden.value,1);if(grupo==='Aplicacion')assert.equal(m.destino.tipo,'industria')
  }
})
test('menús: incluye inactivos y alias, omite eliminados; nunca usa registroId para ordenar',async()=>{
  const env=entorno('menu');const fila=env.tablas.menu[0];fila.grupo='Productos';fila.estado='inactivo';fila.orden=4;fila.registroId=5000n
  env.tablas.menu.push({...fila,id:10n,orden:100,eliminadoEn:antes,estado:'eliminado'})
  const m=await new PrismaMenus(env.db).crear(datos(),contexto)
  assert.equal(m.orden.value,5);assert.equal(m.destino.id,1n)
})
test('menús: cambiar registro y grupo conserva hijos y asigna solo nuevo orden',async()=>{
  const env=entorno('menu');env.tablas.menuItem[0].menuId=2n;env.tablas.industria[0].id=77n
  const repo=new PrismaMenus(env.db),m=(await repo.obtener(2n))!
  m.editar({grupo:'Aplicacion',destino:{tipo:'industria',id:77n},ruta:m.ruta,icono:'LayoutGrid',mostrar:true,cargarSubmenu:'activo'},despues)
  await repo.guardar(m,antes,contexto)
  assert.equal(m.orden.value,1);assert.equal(m.destino.id,77n);assert.equal(env.tablas.menu[0].registroId,77n);assert.equal(env.tablas.menuItem[0].menuId,2n)
})
test('menús: ID inexistente, empresa distinta y tipo incompatible no persisten',async()=>{
  for(const modo of ['ausente','empresa','tipo']) {
    const env=entorno('menu');if(modo==='empresa')env.tablas.producto[0].empresaId=9n
    const d=datos('Producto',modo==='ausente'?999n:1n);if(modo==='tipo')d.destino.tipo='servicio'
    await assert.rejects(new PrismaMenus(env.db).crear(d,contexto));assert.equal(env.auditorias.length,0)
  }
})
test('menús: orden agotado no escribe',async()=>{
  const env=entorno('menu');env.tablas.menu[0].orden=2147483647
  await assert.rejects(new PrismaMenus(env.db).crear(datos(),contexto),/fuera de rango/)
  assert.equal(env.auditorias.length,0)
})
test('subenlaces públicos: activos visibles también con carga inactiva, apuntando al padre',async()=>{
  const env=entorno('menu');env.tablas.menuItem[0].menuId=2n
  const m=(await new PrismaMenus(env.db).obtener(2n))!
  m.editar({grupo:m.grupo,ruta:m.ruta,icono:null,mostrar:true,cargarSubmenu:'inactivo'},despues)
  assert.equal(m.itemsPublicos().length,1);assert.equal(m.rutaDestinoItem(m.itemsPublicos()[0]).value,m.ruta.value)
  m.editar({grupo:m.grupo,ruta:m.ruta,icono:null,mostrar:true,cargarSubmenu:'activo'},despues)
  assert.equal(m.rutaDestinoItem(m.itemsPublicos()[0]).value,m.itemsPublicos()[0].ruta.value)
  m.editar({grupo:m.grupo,ruta:m.ruta,icono:null,mostrar:false,cargarSubmenu:'activo'},despues)
  assert.equal(m.itemsPublicos().length,0)
})
