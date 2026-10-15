import assert from 'node:assert/strict'
import { test } from 'node:test'
import Fastify from 'fastify'
import { LeerCategorias } from '../src/backend/contexts/catalog-management/application/use-cases/publico/leer-categorias'
import { LeerDetalleProducto } from '../src/backend/contexts/catalog-management/application/use-cases/publico/leer-detalle-producto'
import { LeerGamaCategoria } from '../src/backend/contexts/catalog-management/application/use-cases/publico/leer-gama-categoria'
import { PrismaPublicoAccesoDetalle } from '../src/backend/contexts/content-management-system/infrastructure/prisma-publico-acceso-detalle'
import { PrismaPublicoCategorias } from '../src/backend/contexts/catalog-management/infrastructure/prisma-publico-categorias'
import { PrismaPublicoGamas } from '../src/backend/contexts/catalog-management/infrastructure/prisma-publico-gamas'
import { registrarCategoriasPublico } from '../src/backend/contexts/catalog-management/presentation/rutas-publicas-categorias'
import { registrarProductosPublico } from '../src/backend/contexts/catalog-management/presentation/rutas-publicas-productos'
import { registrarGamaPublico } from '../src/backend/contexts/catalog-management/presentation/rutas-publicas-gamas'
import { registrarErroresCms } from '../src/backend/contexts/content-management-system/presentation/errores-http-cms'
import { LeerMenus } from '../src/backend/contexts/content-management-system/application/use-cases/publico/leer-menus'
const empresas={obtener:async()=>({id:'1',nombre:'Empresa',logo:null})},si={permitidos:async()=>new Set(['1'])},no={permitidos:async()=>new Set<string>()}
const producto={id:'1',nombre:'Correas',slug:'correas',imagen:null,orden:1},categoria={id:'1',nombre:'Trapezoidales',slug:'correas/trapezoidales',imagen:null,descripcion:null,descripcionCorta:null,uso:null,orden:1,producto,atributos:[]}
const gama={id:'1',categoriaId:'1',productoId:'1',titulo:'Gama',descripcion:null,imagen:null,gruposColumnas:[],gruposFilas:[],columnas:[],filas:[],valores:[]}
test('CMS restringe la política a productos activos de la empresa y submenú activo',async()=>{
 let consulta:any;const repo=new PrismaPublicoAccesoDetalle({menu:{findMany:async(c:unknown)=>{consulta=c;return[{registroId:1n}]}}} as never)
 assert.ok((await repo.permitidos(42n,['1','1','2'])).has('1'));assert.equal(consulta.where.empresaId,42n);assert.equal(consulta.where.mostrar,true);assert.equal(consulta.where.estado,'activo');assert.equal(consulta.where.eliminadoEn,null);assert.equal(consulta.where.cargarSubmenu,'activo');assert.deepEqual(consulta.where.registroId.in,[1n,2n]);assert.equal((await repo.permitidos(42n,[])).size,0)
})
test('producto conserva categorías con detalle apagado; consulta directa de categoría no publica atributos',async()=>{
 const detalle=new LeerDetalleProducto(empresas,{obtener:async()=>({...producto,categorias:[],marcas:[]})},no)
 assert.equal((await detalle.ejecutar(1n,'correas'))?.detalleCategoriasDisponible,false)
 const consulta={obtener:async()=>({items:[categoria],limite:12,desplazamiento:0,hayMas:false})}
 const apagado=new LeerCategorias(empresas,consulta,no),activo=new LeerCategorias(empresas,consulta,si)
 assert.equal((await apagado.ejecutar(1n,{limite:12,desplazamiento:0})).items[0].detalleDisponible,false)
 assert.equal((await apagado.ejecutar(1n,{limite:1,desplazamiento:0,slug:'correas/trapezoidales',productoSlug:'correas'})).items.length,0)
 assert.equal((await activo.ejecutar(1n,{limite:1,desplazamiento:0,slug:'correas/trapezoidales'})).items[0].detalleDisponible,true)
})
test('HTTP acepta el slug compuesto solo para categorías y rechaza segmentos inválidos',async()=>{
 const app=Fastify();let slug='';const caso={ejecutar:async(_e:bigint,p:any)=>{slug=p.slug;return{items:[],limite:1,desplazamiento:0,hayMas:false}}}
 registrarCategoriasPublico(app,caso as never,1n);registrarProductosPublico(app,caso as never,1n)
 try{assert.equal((await app.inject('/api/publico/catalogo/categorias?slug=correas%2Ftrapezoidales&productoSlug=correas')).statusCode,200);assert.equal(slug,'correas/trapezoidales');assert.equal((await app.inject('/api/publico/catalogo/productos?slug=correas%2Ftrapezoidales')).statusCode,400);assert.equal((await app.inject('/api/publico/catalogo/categorias?slug=..%2Ftrapezoidales')).statusCode,400)}finally{await app.close()}
})
test('consulta de categorías admite sufijo o slug compuesto manteniendo el producto y empresa',async()=>{
 let consulta:any;const repo=new PrismaPublicoCategorias({categoria:{findMany:async(c:unknown)=>{consulta=c;return[]}}} as never)
 await repo.obtener(42n,{limite:1,desplazamiento:0,slug:'trapezoidales',productoSlug:'correas'})
 assert.deepEqual(consulta.where.OR,[{slug:'trapezoidales'},{slug:'correas/trapezoidales'}]);assert.equal(consulta.where.producto.empresaId,42n);assert.equal(consulta.where.producto.slug,'correas')
 await repo.obtener(42n,{limite:1,desplazamiento:0,slug:'correas/trapezoidales',productoSlug:'correas'});assert.deepEqual(consulta.where.OR,[{slug:'correas/trapezoidales'}])
})
test('proyección de gama filtra grupos/atributos y no publica celdas de columnas omitidas',async()=>{
 let consulta:any
 const grupo={id:5n,codigo:'medidas',nombre:'Medidas',orden:1},columna={id:10n,grupoId:5n,etiqueta:null,unidadMedida:null,tipoDato:'numero',orden:1,atributo:{nombre:'Ancho',unidadMedida:'mm'}}
 const repo=new PrismaPublicoGamas({gamaCategoria:{findFirst:async(c:unknown)=>{consulta=c;return{...gama,id:1n,categoriaId:1n,productoId:1n,gruposColumnas:[grupo],gruposFilas:[],columnas:[columna],filas:[{id:20n,grupoId:null,codigo:'A',nombre:'A',descripcion:null,enlaceDetalle:'javascript:alert(1)',orden:1,valores:[{columnaId:10n,tipoDato:'numero',valorNumero:{toFixed:()=> '0.000000000000000123'},valorTexto:null,valorBooleano:null},{columnaId:99n,tipoDato:'texto',valorTexto:'Oculto'}]}]}}}} as never)
 const g=await repo.obtener(42n,'1');assert.equal(g?.columnas[0].nombre,'Ancho');assert.equal(g?.columnas[0].unidadMedida,'mm');assert.equal(g?.valores.length,1);assert.equal(g?.valores[0].valor,'0.000000000000000123');assert.equal(g?.filas[0].enlaceDetalle,null);assert.equal(consulta.where.categoria.producto.empresaId,42n);assert.equal(consulta.select.columnas.where.atributo.tipoAtributo.estado,'activo');assert.equal(consulta.select.columnas.where.OR[1].grupo.estado,'activo');assert.ok(!('gamaOrigenId' in g!))
})
test('gama HTTP no publica datos con submenú apagado o empresa no disponible',async()=>{
 let lecturas=0;const consulta={obtener:async()=>{lecturas++;return gama}}
 for(const [empresa,acceso,estado] of [[empresas,si,200],[empresas,no,404],[{obtener:async()=>null},si,404]] as const){const app=Fastify();registrarGamaPublico(app,new LeerGamaCategoria(empresa,consulta,acceso),1n);try{const antes=lecturas;assert.equal((await app.inject('/api/publico/catalogo/categorias/1/gama')).statusCode,estado);if(empresa!==empresas)assert.equal(lecturas,antes);assert.equal((await app.inject('/api/publico/catalogo/categorias/0/gama')).statusCode,400)}finally{await app.close()}}
})
test('gama ausente es 404 y fallos internos no exponen detalles de persistencia',async()=>{
 for(const [obtener,estado] of [[async()=>null,404],[async()=>{throw Error('postgres secreto SELECT tabla')},500]] as const){const app=Fastify();registrarGamaPublico(app,new LeerGamaCategoria(empresas,{obtener},si),1n);try{const r=await app.inject('/api/publico/catalogo/categorias/1/gama');assert.equal(r.statusCode,estado);assert.ok(!r.body.includes('postgres secreto'))}finally{await app.close()}}
})
test('menús de producto y categorías publican rutas canónicas sin duplicar prefijos',async()=>{
 for(const activo of [true,false]){const menu={id:'1',grupo:'Producto',tipoRegistro:'producto',registroId:'1',ruta:'/ruta-personalizada',icono:null,orden:1,cargarSubmenu:activo,items:[{id:'2',nombre:'Trapezoidales',categoriaId:'1',ruta:'/ruta-editada',orden:1}]}
 const caso=new LeerMenus(empresas,{obtener:async()=>({items:[menu],limite:100,desplazamiento:0,hayMas:false})},{resolver:async()=>[{tipo:'producto',id:'1',nombre:'Correas',slug:'correas'},{tipo:'categoria',id:'1',productoId:'1',nombre:'Trapezoidales',slug:'correas/trapezoidales'}]})
 const r=await caso.ejecutar(1n,{limite:100,desplazamiento:0});assert.equal(r.items[0].ruta,'/products/correas');assert.equal(r.items[0].items[0].ruta,activo?'/products/correas/trapezoidales':'/products/correas')}
})
test('CMS diferencia colisión de IDs de un conflicto de versión',async()=>{
 const app=Fastify();registrarErroresCms(app);app.post('/crear',async()=>{throw Object.assign(new Error('PK interna'),{code:'P2002'})});app.patch('/editar',async()=>{throw Error('Registro modificado por otra operación')})
 try{const crear=await app.inject({method:'POST',url:'/crear'}),editar=await app.inject({method:'PATCH',url:'/editar'});assert.equal(crear.statusCode,409);assert.match(crear.json().error,/secuencia/);assert.ok(!crear.json().error.includes('vuelve a cargar'));assert.equal(editar.statusCode,409);assert.match(editar.json().error,/vuelve a cargar/)}finally{await app.close()}
})
