/** Integración Prisma/Fastify contra PostgreSQL en memoria. Nunca lee DATABASE_URL ni el respaldo del usuario. */
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'
import { PGLiteSocketServer } from '@electric-sql/pglite-socket'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/backend/generated/prisma/client.ts'
import { componerPublicacion } from '../src/backend/composition/componer-publicacion.ts'
import { createApp } from '../src/backend/app.ts'
import { enlacePublico, slugServicio } from '../src/shared/publico/rutas.ts'
const memoria = new PGlite()
let servidor, db, app, pruebas = 0, fallo = false
const prueba = async (nombre, ejecutar) => { await ejecutar(); pruebas++; console.log('OK ' + nombre) }
try {
 const carpeta = new URL('../prisma/migrations/', import.meta.url)
 for (const nombre of (await readdir(carpeta)).sort()) {
  if (!/^\d/.test(nombre)) continue
  await memoria.exec(await readFile(new URL(nombre + '/migration.sql', carpeta), 'utf8'))
 }
 servidor = new PGLiteSocketServer({ db: memoria, host: '127.0.0.1', port: 0, maxConnections: 1 })
 await servidor.start()
 const direccion = servidor.getServerConn()
 const connectionString = direccion.startsWith('postgres') ? direccion : `postgresql://postgres:postgres@${direccion}/postgres`
 db = new PrismaClient({ adapter: new PrismaPg({ connectionString, max: 1 }) })
 const a = await db.empresa.create({ data: { id: 9007199254740993n, nombre: 'Empresa pública de prueba' } })
 const b = await db.empresa.create({ data: { nombre: 'Empresa ajena' } })
 const p = await db.producto.create({ data: { empresaId: a.id, nombre: 'Correas', slug: 'correas' } })
 const p2 = await db.producto.create({ data: { empresaId: a.id, nombre: 'Mangueras', slug: 'mangueras' } })
 const ajeno = await db.producto.create({ data: { empresaId: b.id, nombre: 'Ajeno', slug: 'ajeno' } })
 const inactivo = await db.producto.create({ data: { empresaId: a.id, nombre: 'Oculto', slug: 'oculto', estado: 'inactivo' } })
 const eliminado = await db.producto.create({ data: { empresaId: a.id, nombre: 'Baja', slug: 'baja', eliminadoEn: new Date() } })
 const c = await db.categoria.create({ data: { productoId: p.id, nombre: 'Correas V', slug: 'correas-v' } })
 const cAjena = await db.categoria.create({ data: { productoId: ajeno.id, nombre: 'Ajena', slug: 'ajena' } })
 await db.categoria.create({ data: { productoId: p.id, nombre: 'Categoría oculta', slug: 'categoria-oculta', estado: 'inactivo' } })
 const marca = await db.marca.create({ data: { nombre: 'Marca pública', slug: 'marca-publica' } })
 const marcaInactiva = await db.marca.create({ data: { nombre: 'Marca inactiva', slug: 'marca-inactiva', estado: 'inactivo' } })
 const marcaAjena = await db.marca.create({ data: { nombre: 'Marca ajena', slug: 'marca-ajena' } })
 for (const m of [marca, marcaInactiva]) await db.productoMarca.create({ data: { productoId: p.id, marcaId: m.id } })
 await db.productoMarca.create({ data: { productoId: ajeno.id, marcaId: marcaAjena.id } })
 await db.sucursal.create({ data: { empresaId: a.id, nombre: 'Central', direccion: 'Calle de prueba', telefono: '000', latitud: '-17.1234567890123456789', longitud: '-63.1234567890123456789' } })
 await db.sucursal.create({ data: { empresaId: b.id, nombre: 'Otra', direccion: 'Otra', telefono: '000' } })
 const servicio = await db.servicio.create({ data: { empresaId: a.id, nombre: 'Reparación de cilindros' } })
 const industria = await db.industria.create({ data: { empresaId: a.id, nombre: 'Agroindustria', slug: 'agroindustria' } })
 const tipo = await db.tipoSeccion.create({ data: { nombre: 'Hero prueba', slug: 'hero-prueba' } })
 const tipoOculto = await db.tipoSeccion.create({ data: { nombre: 'Tipo oculto', slug: 'tipo-oculto', estado: 'inactivo' } })
 const sec = tipoSeccionId => ({ empresaId: a.id, tipoSeccionId, titulo: 'Bienvenido', metadata: { badge_text: 'Industria' } })
 await db.contenidoSeccion.create({ data: sec(tipo.id) })
 await db.contenidoSeccion.create({ data: { ...sec(tipo.id), mostrar: false } })
 await db.contenidoSeccion.create({ data: sec(tipoOculto.id) })
 const registro = await db.registroCMS.create({ data: { identificador: 'nosotros-prueba', nombre: 'Nosotros' } })
 await db.contenidoRegistro.create({ data: { empresaId: a.id, registroId: registro.id, titulo: 'Historia' } })
 await db.contenidoRegistro.create({ data: { empresaId: b.id, registroId: registro.id, titulo: 'Contenido ajeno' } })
 const menu = await db.menu.create({ data: { empresaId: a.id, grupo: 'Producto', tipoRegistro: 'producto', registroId: p.id, ruta: '/products/correas', cargarSubmenu: 'activo' } })
 await db.menuItem.create({ data: { menuId: menu.id, nombre: 'Nombre personalizado', categoriaId: c.id, ruta: '/products/correas/correas-v', orden: 1 } })
 await db.menuItem.create({ data: { menuId: menu.id, nombre: 'Ajeno', categoriaId: cAjena.id, ruta: '/products/ajeno/ajena', orden: 2 } })
 await db.menuItem.create({ data: { menuId: menu.id, nombre: 'Privado', ruta: '/portal/usuarios', orden: 3 } })
 await db.menu.create({ data: { empresaId: a.id, grupo: 'Producto', tipoRegistro: 'producto', registroId: inactivo.id, ruta: '/products/oculto' } })
 await db.footerElemento.create({ data: { empresaId: a.id, tipo: 'red_social', titulo: 'Red social', url: 'javascript:alert(1)' } })
 await db.footerElemento.create({ data: { empresaId: a.id, tipo: 'red_social', titulo: 'Red social', url: 'https://example.com' } })
 await db.pasoWizard.create({ data: { empresaId: a.id, identificador: 'industria', titulo: 'Industria', descripcion: 'Seleccionar', fuenteDatos: 'industrias' } })
 for (const datos of [
  { clave: 'whatsapp_numero', valor: '111', empresaId: null },
  { clave: 'whatsapp_numero', valor: '222', empresaId: a.id },
  { clave: 'whatsapp_numero', valor: '999', empresaId: b.id },
  { clave: 'whatsapp_activo', valor: 'true', empresaId: a.id },
  { clave: 'smtp_password', valor: 'privado', empresaId: a.id },
 ]) await db.configuracionSitio.create({ data: datos })
 await db.footerElemento.create({ data: { empresaId: a.id, tipo: 'producto', tipoRegistro: 'producto', registroId: inactivo.id, titulo: 'Producto oculto', url: '/products/oculto' } })
 const tipoAtributo = await db.tipoAtributo.create({ data: { nombre: 'Medidas', slug: 'medidas', permiteValorNumerico: true } })
 for (const [i, tipoDato, valor] of [[1,'numero','0'],[2,'numero','12345678901234567890.123456789'],[3,'texto','Caucho'],[4,'booleano',false]]) {
  const atributo = await db.atributoTecnico.create({ data: { tipoAtributoId: tipoAtributo.id, nombre: 'Atributo ' + i, tipoDato } })
  await db.categoriaAtributo.create({ data: { categoriaId: c.id, atributoId: atributo.id, tipoDato, orden: i,
   ...(tipoDato === 'numero' ? { valorPersonalizado: valor } : tipoDato === 'texto' ? { valorTexto: valor } : { valorBooleano: valor }) } })
 }
 const casos = componerPublicacion(db)
 const config = { origen: 'http://localhost:3000', cookie: 'cc_prueba', secure: false }
 app = await createApp({ casos: { comprobar: { ejecutar: async () => { throw Error('Sin sesión') } }, activarRol: { ejecutar: async () => {} }, inactivarRol: { ejecutar: async () => {} }, eliminarRol: { ejecutar: async () => {} } }, config, publico: casos, empresaPublicaId: a.id })
 const get = async (url, estado = 200) => { const r = await app.inject({ url }); assert.equal(r.statusCode, estado, url); return r }
 await prueba('API integrada en createApp: 19 endpoints documentados y acceso anónimo', async () => {
  await app.ready()
  const paths = Object.keys(app.swagger().paths).filter(p => p.startsWith('/api/publico/'))
  assert.equal(paths.length, 19)
  assert.equal((await get('/api/publico/commercial/empresa')).json().id, String(a.id))
 })
 await prueba('aislamiento, estado activo y baja lógica en productos', async () => {
  const r = await get('/api/publico/catalogo/productos?empresaId=' + b.id)
  assert.deepEqual(r.json().items.map(p => p.slug).sort(), ['correas','mangueras'])
  assert.equal(r.headers['cache-control'], 'no-store')
  assert.ok(!r.body.includes('creadoEn') && !r.body.includes('eliminadoEn') && !r.body.includes('empresaId'))
 })
 await prueba('paginación estable sin pérdida y búsqueda por nombre', async () => {
  const uno = (await get('/api/publico/catalogo/productos?limite=1')).json()
  const dos = (await get('/api/publico/catalogo/productos?limite=1&desplazamiento=1')).json()
  assert.equal(uno.hayMas,true); assert.equal(dos.hayMas,false); assert.notEqual(uno.items[0].id,dos.items[0].id)
  assert.deepEqual((await get('/api/publico/catalogo/productos?q=cor')).json().items.map(p => p.slug), ['correas'])
 })
 await prueba('HTTP rechaza límites y consultas inválidas', async () => {
  for (const q of ['limite=101','limite=0','desplazamiento=-1','desplazamiento=10001','q=a','q=%20%20','slug=a%2Fb','slug=a%20b','slug=a%5Cb']) await get('/api/publico/catalogo/productos?' + q,400)
 })
 await prueba('detalle de producto filtra categorías y marcas no publicables', async () => {
  const d = (await get('/api/publico/catalogo/productos/correas')).json()
  assert.deepEqual(d.categorias.map(c => c.slug),['correas-v']);assert.equal(d.marcas.length,1)
  for (const slug of ['ajeno','oculto','baja','inexistente']) await get('/api/publico/catalogo/productos/'+slug,404)
 })
 await prueba('categoría valida producto padre y conserva cero, false y precisión', async () => {
  const cat = (await get('/api/publico/catalogo/categorias?slug=correas-v&productoSlug=correas')).json().items[0]
  assert.deepEqual(cat.atributos.map(a => a.valor),['0','12345678901234567890.123456789','Caucho',false])
  assert.equal((await get('/api/publico/catalogo/categorias?slug=correas-v&productoSlug=mangueras')).json().items.length,0)
  assert.equal((await get('/api/publico/catalogo/categorias?slug=ajena')).json().items.length,0)
 })
 await prueba('marcas limitadas a vínculos activos de la empresa', async () => assert.deepEqual((await get('/api/publico/catalogo/marcas')).json().items.map(m => m.slug),['marca-publica']))
 await prueba('CMS respeta mostrar y estado del tipo de sección', async () => assert.equal((await get('/api/publico/cms/secciones')).json().items.length,1))
 await prueba('contenido institucional aislado por empresa', async () => assert.deepEqual((await get('/api/publico/cms/registros')).json().items[0].contenidos.map(c => c.titulo),['Historia']))
 await prueba('menú conserva nombres y omite referencias ajenas y rutas privadas', async () => {
  const m = (await get('/api/publico/cms/menus')).json().items
  assert.equal(m.length,1);assert.equal(m[0].items.length,1);assert.equal(m[0].items[0].nombre,'Nombre personalizado')
  await db.menu.update({ where: { id: menu.id }, data: { cargarSubmenu: 'inactivo' } })
  assert.equal((await get('/api/publico/cms/menus')).json().items[0].items[0].ruta,'/products/correas')
 })
 await prueba('configuración explícita con preferencia por empresa y sin claves privadas', async () => {
  const r = await get('/api/publico/cms/configuracion');assert.equal(r.json().whatsapp.numero,'222');assert.equal(r.json().whatsapp.activo,true)
  assert.ok(!r.body.includes('smtp') && !r.body.includes('privado') && !r.body.includes('999'))
 })
 await prueba('sucursales conservan coordenadas y no muestran otras empresas', async () => {
  const items = (await get('/api/publico/commercial/sucursales')).json().items
  assert.equal(items.length,1);assert.equal(items[0].latitud,'-17.1234567890123456789')
 })
 await prueba('footer descarta esquemas ejecutables y permite enlaces HTTPS', async () => {
  const f = (await get('/api/publico/cms/footer')).json().items;assert.equal(f.length,2);assert.equal(f[0].url,null);assert.equal(f[1].url,'https://example.com')
 })
 await prueba('wizard, industrias y slug de servicio disponibles', async () => {
  assert.equal((await get('/api/publico/cms/pasos-wizard')).json().items.length,1)
  assert.equal((await get('/api/publico/catalogo/industrias')).json().items.length,1)
  assert.equal((await get('/api/publico/catalogo/servicios')).json().items[0].slug,'reparacion-de-cilindros')
 })
 await prueba('rutas ejecutables, administrativas y escapes inválidos rechazados', async () => {
  for (const r of ['//externo.test','javascript:alert(1)','/portal/roles','/admin','/api/publico','/%2fexterno.test','/%5cexterno.test','/%61dmin','/%zz']) assert.equal(enlacePublico(r),null,r)
  assert.equal(enlacePublico('/products/correas/'),'/products/correas/');assert.equal(slugServicio('Reparación de Cilindros'),'reparacion-de-cilindros')
 })
 await prueba('IAM conserva protección del portal', async () => { await get('/api/portal/iam/roles',401) })
 await prueba('no se habilitan escrituras comerciales ni del catálogo', async () => {
  for (const url of ['/api/publico/catalogo/productos','/api/publico/commercial/suscriptores']) assert.equal((await app.inject({ method:'POST',url,payload:{} })).statusCode,404)
 })
 await prueba('slug compuesto real funciona por sufijo y no duplica rutas del menú',async()=>{
  await db.menu.update({where:{id:menu.id},data:{cargarSubmenu:'activo'}})
  await db.categoria.update({where:{id:c.id},data:{slug:'correas/trapezoidales'}})
  for(const slug of ['trapezoidales','correas/trapezoidales']){const r=(await get('/api/publico/catalogo/categorias?productoSlug=correas&slug='+encodeURIComponent(slug))).json();assert.equal(r.items[0].id,String(c.id));assert.equal(r.items[0].detalleDisponible,true)}
  assert.equal((await get('/api/publico/cms/menus')).json().items[0].items[0].ruta,'/products/correas/trapezoidales')
 })
 const gama=await db.gamaCategoria.create({data:{categoriaId:c.id,productoId:p.id,titulo:'Gama integrada'}})
 const grupoGama=await db.grupoColumnaGama.create({data:{gamaId:gama.id,codigo:'medidas',nombre:'Medidas',orden:1}})
 const grupoOculto=await db.grupoColumnaGama.create({data:{gamaId:gama.id,codigo:'oculto',nombre:'Oculto',orden:2,estado:'inactivo'}})
 const ancho=await db.atributoTecnico.create({data:{tipoAtributoId:tipoAtributo.id,nombre:'Ancho gama',tipoDato:'numero',unidadMedida:'mm'}})
 const compatibilidad=await db.atributoTecnico.create({data:{tipoAtributoId:tipoAtributo.id,nombre:'Compatible',tipoDato:'booleano'}})
 const oculto=await db.atributoTecnico.create({data:{tipoAtributoId:tipoAtributo.id,nombre:'No publicar',tipoDato:'texto'}})
 const col1=await db.columnaGama.create({data:{gamaId:gama.id,atributoId:ancho.id,tipoDato:'numero',grupoId:grupoGama.id,orden:1}})
 const col2=await db.columnaGama.create({data:{gamaId:gama.id,atributoId:compatibilidad.id,tipoDato:'booleano',grupoId:grupoGama.id,orden:2}})
 const col3=await db.columnaGama.create({data:{gamaId:gama.id,atributoId:oculto.id,tipoDato:'texto',grupoId:grupoOculto.id,orden:3}})
 const fila=await db.filaGama.create({data:{gamaId:gama.id,codigo:'a',nombre:'Sección A',orden:1}})
 await db.filaGama.create({data:{gamaId:gama.id,codigo:'b',nombre:'Oculta',orden:2,estado:'inactivo'}})
 for(const [col,tipoDato,valor] of [[col1,'numero','0.000000000000000123'],[col2,'booleano',false],[col3,'texto','Dato oculto']])await db.valorGama.create({data:{filaId:fila.id,columnaId:col.id,gamaId:gama.id,tipoDato,...(tipoDato==='numero'?{valorNumero:valor}:tipoDato==='booleano'?{valorBooleano:valor}:{valorTexto:valor})}})
 const urlGama='/api/publico/catalogo/categorias/'+c.id+'/gama'
 await prueba('gama Prisma pública conserva unidades/precisión/false y filtra grupos y filas inactivos',async()=>{
  const g=(await get(urlGama)).json();assert.equal(g.columnas.length,2);assert.equal(g.filas.length,1);assert.equal(g.columnas[0].nombre,'Ancho gama');assert.equal(g.columnas[0].unidadMedida,'mm');assert.deepEqual(g.valores.map(v=>v.valor),['0.000000000000000123',false]);assert.ok(!JSON.stringify(g).includes('Dato oculto'));assert.ok(!JSON.stringify(g).includes('creadoEn'))
 })
 await prueba('cargar_submenu inactivo bloquea detalle/gama sin ocultar categorías del producto',async()=>{
  await db.menu.update({where:{id:menu.id},data:{cargarSubmenu:'inactivo'}})
  const p=(await get('/api/publico/catalogo/productos/correas')).json();assert.equal(p.detalleCategoriasDisponible,false);assert.equal(p.categorias.length,1)
  assert.equal((await get('/api/publico/catalogo/categorias?productoSlug=correas&slug=trapezoidales')).json().items.length,0);await get(urlGama,404)
  await db.menu.update({where:{id:menu.id},data:{cargarSubmenu:'activo'}})
 })
 await prueba('gama ajena, inactiva y atributos inactivos no se publican',async()=>{
  await get('/api/publico/catalogo/categorias/'+cAjena.id+'/gama',404)
  await db.atributoTecnico.update({where:{id:ancho.id},data:{estado:'inactivo'}});assert.equal((await get(urlGama)).json().columnas.length,1)
  await db.gamaCategoria.update({where:{id:gama.id},data:{estado:'inactivo'}});await get(urlGama,404)
 })
 await prueba('industria resuelve asignaciones polimórficas, orden, duplicados y aislamiento',async()=>{
  const oculto=await db.servicio.create({data:{empresaId:a.id,nombre:'Servicio oculto',estado:'inactivo'}})
  const baja=await db.servicio.create({data:{empresaId:a.id,nombre:'Servicio baja',eliminadoEn:new Date()}})
  const ajeno=await db.servicio.create({data:{empresaId:b.id,nombre:'Servicio ajeno'}})
  for(const [tipoRegistro,registroId,orden,estado] of [['categoria',c.id,3,'activo'],['servicio',servicio.id,1,'activo'],['categoria',cAjena.id,2,'activo'],['servicio',oculto.id,4,'activo'],['servicio',baja.id,5,'activo'],['servicio',ajeno.id,6,'activo'],['categoria',c.id,7,'activo'],['servicio',999999n,8,'activo'],['categoria',999999n,9,'activo']])await db.industriaAsignacion.create({data:{industriaId:industria.id,tipoRegistro,registroId,orden,estado}})
  const detalle=(await get('/api/publico/catalogo/industrias/agroindustria')).json()
  assert.deepEqual(detalle.categorias.map(x=>x.id),[String(c.id)]);assert.deepEqual(detalle.servicios.map(x=>x.id),[String(servicio.id)])
  assert.equal(detalle.categorias[0].producto.slug,'correas');assert.ok(!JSON.stringify(detalle).includes('empresaId'))
  await db.producto.update({where:{id:p.id},data:{estado:'inactivo'}});assert.equal((await get('/api/publico/catalogo/industrias/agroindustria')).json().categorias.length,0)
  await db.producto.update({where:{id:p.id},data:{estado:'activo'}})
 })
 await prueba('servicio enlaza industrias activas y rechaza slug ambiguo',async()=>{
  const detalle=(await get('/api/publico/catalogo/servicios/reparacion-de-cilindros')).json();assert.deepEqual(detalle.industrias.map(i=>i.slug),['agroindustria'])
  await db.industria.update({where:{id:industria.id},data:{estado:'inactivo'}});assert.equal((await get('/api/publico/catalogo/servicios/reparacion-de-cilindros')).json().industrias.length,0);await get('/api/publico/catalogo/industrias/agroindustria',404)
  await db.industria.update({where:{id:industria.id},data:{estado:'activo'}})
  const duplicado=await db.servicio.create({data:{empresaId:a.id,nombre:'Reparacion de cilindros'}});await get('/api/publico/catalogo/servicios/reparacion-de-cilindros',404);await db.servicio.delete({where:{id:duplicado.id}})
  await get('/api/publico/catalogo/servicios/inexistente',404)
 })
 await prueba('footer genera enlace de industria sin menú asociado',async()=>{
  await db.footerElemento.create({data:{empresaId:a.id,tipo:'industria',tipoRegistro:'industria',registroId:industria.id}})
  assert.equal((await get('/api/publico/cms/footer')).json().items.find(i=>i.registroId===String(industria.id)).url,'/applications/agroindustria')
 })

 const payload={nombre:'Visitante prueba',empresaDeclarada:'Empresa interesada',telefono:'70000000',email:'VISITANTE@example.test',mensaje:'Necesito información sobre correas.',consentimiento:true}
 let ipSolicitud=1
 const post=async(ruta,payload,estado=202,headers={origin:'http://localhost:3000'},remoteAddress)=>{const r=await app.inject({method:'POST',url:ruta,payload,headers,remoteAddress:remoteAddress||'10.10.0.'+(ipSolicitud++)});assert.equal(r.statusCode,estado,ruta+': '+r.body);return r}
 const urlContacto='/api/publico/commercial/contactos',urlSuscripcion='/api/publico/commercial/suscripciones'
 await prueba('contacto público registra contacto y lead atómicos, ignora empresa manipulada y evita reintento duplicado',async()=>{
  assert.deepEqual((await post(urlContacto,{...payload,empresaId:String(b.id),estado:'respondido'})).json(),{recibido:true})
  await post(urlContacto,payload)
  const contactos=await db.contactoEntrante.findMany({where:{email:'visitante@example.test'}});assert.equal(contactos.length,1);assert.equal(contactos[0].empresaId,a.id);assert.equal(contactos[0].estado,'nuevo')
  assert.equal(await db.lead.count({where:{contactoId:contactos[0].id,estado:'nuevo'}}),1)
 })
 await prueba('captación rechaza origen externo, falta de consentimiento y entradas inválidas',async()=>{
  await post(urlContacto,payload,403,{origin:'https://ajeno.test'})
  await post(urlContacto,payload,403,{})
  for(const cambio of [{email:'incorrecto'},{nombre:'  '},{mensaje:'corto'},{consentimiento:false},{mensaje:'x'.repeat(5001)}])await post(urlContacto,{...payload,...cambio},400)
  await post(urlContacto,{...payload,email:'bot@example.test',sitioWeb:'spam'})
  assert.equal(await db.contactoEntrante.count({where:{email:'bot@example.test'}}),0)
 })
 await prueba('si falla el lead, revierte también el contacto y permite reintentar',async()=>{
  await memoria.exec("CREATE FUNCTION rechazar_lead_prueba() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Fallo de prueba'; END $$; CREATE TRIGGER fallo_lead BEFORE INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION rechazar_lead_prueba();")
  await post(urlContacto,{...payload,email:'rollback@example.test'},500)
  assert.equal(await db.contactoEntrante.count({where:{email:'rollback@example.test'}}),0)
  await memoria.exec('DROP TRIGGER fallo_lead ON public.leads; DROP FUNCTION rechazar_lead_prueba();')
  await post(urlContacto,{...payload,email:'rollback@example.test'})
 })
 await prueba('suscripción idempotente y no verificada, sin reactivar bajas ni transferir empresa',async()=>{
  const d={email:'NOVEDADES@example.test',consentimiento:true};await post(urlSuscripcion,d);await post(urlSuscripcion,d)
  const s=await db.suscriptor.findUnique({where:{email:'novedades@example.test'}});assert.equal(s.estado,'inactivo');assert.equal(s.emailVerificadoEn,null)
  await db.suscriptor.update({where:{id:s.id},data:{estado:'desuscrito'}});await post(urlSuscripcion,d);assert.equal((await db.suscriptor.findUnique({where:{id:s.id}})).estado,'desuscrito')
  await db.suscriptor.create({data:{empresaId:b.id,email:'ajeno@example.test',estado:'activo'}})
  assert.deepEqual((await post(urlSuscripcion,{email:'ajeno@example.test',consentimiento:true})).json(),{recibido:true})
  assert.equal((await db.suscriptor.findUnique({where:{email:'ajeno@example.test'}})).empresaId,b.id)
 })
 await prueba('límite de envíos por IP aplicado a captación',async()=>{
  for(let i=0;i<5;i++)await post(urlSuscripcion,{email:'limite@example.test',consentimiento:true},202,{origin:'http://localhost:3000'},'10.20.1.1')
  await post(urlSuscripcion,{email:'limite@example.test',consentimiento:true},429,{origin:'http://localhost:3000'},'10.20.1.1')
 })
 await prueba('empresa inactiva cierra todas las lecturas', async () => {
  await db.empresa.update({ where: { id: a.id }, data: { estado:'inactivo' } })
  await post(urlContacto,payload,404);await post(urlSuscripcion,{email:'nuevo@example.test',consentimiento:true},404)
  for (const ruta of Object.keys(app.swagger().paths).filter(p => p.startsWith('/api/publico/'))) await get(ruta.replace('{slug}','correas').replace('{id}',String(c.id)),404)
 })
 console.log(`${pruebas} comprobaciones integradas aprobadas. Solo se modificó PostgreSQL temporal en memoria.`)
} catch (error) {
 console.error('Verificación fallida:', error.name, error.message?.slice(0,600));fallo=true
} finally {
 if (app) await app.close()
 if (db) await db.$disconnect()
 if (servidor) await servidor.stop()
 await memoria.close()
}
if (fallo) process.exit(1)
