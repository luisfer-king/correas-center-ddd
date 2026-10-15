import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { PGlite } from '@electric-sql/pglite'
const reparar=await readFile('scripts/sql/reparar-secuencia-configuracion-sitio.sql','utf8'),importar=await readFile('scripts/sql/agregar-subenlaces-categorias-productos.sql','utf8')
const db=new PGlite()
try{
 await db.exec(`CREATE TABLE configuracion_sitio(id serial PRIMARY KEY,valor text);
 INSERT INTO configuracion_sitio(id,valor) SELECT n,'Dato original' FROM generate_series(1,17) n;
 SELECT setval('configuracion_sitio_id_seq',6,true);
 CREATE TABLE productos(id bigint PRIMARY KEY,empresa_id bigint,nombre text,slug text,estado text,eliminado_en timestamptz);
 CREATE TABLE categorias(id bigint PRIMARY KEY,producto_id bigint REFERENCES productos(id),nombre text,slug text,orden int,estado text,eliminado_en timestamptz);
 CREATE TABLE menus(id bigint PRIMARY KEY,empresa_id bigint,tipo_registro text,registro_id bigint,estado text,eliminado_en timestamptz,cargar_submenu text);
 CREATE TABLE menu_item(id bigserial PRIMARY KEY,menu_id bigint REFERENCES menus(id),categoria_id bigint REFERENCES categorias(id),nombre text,ruta text,orden int,estado text,eliminado_en timestamptz,creado_en timestamptz,actualizado_en timestamp);
 CREATE UNIQUE INDEX orden_menu ON menu_item(menu_id,orden) WHERE eliminado_en IS NULL AND orden>0;
 INSERT INTO productos VALUES(1,1,'Correas','correas','activo',NULL),(2,1,'Rodamientos','rodamientos','activo',NULL),(3,2,'Otra empresa','otro','activo',NULL);
 INSERT INTO menus VALUES(1,1,'producto',1,'activo',NULL,'activo'),(2,1,'producto',2,'activo',NULL,'inactivo'),(3,2,'producto',3,'activo',NULL,'activo');
 INSERT INTO categorias VALUES(1,1,'Trapezoidales','correas/trapezoidales',1,'activo',NULL),(2,1,'Sincronas','correas/sincronas',2,'activo',NULL),(3,1,'Editada','editada',3,'activo',NULL),(4,1,'Eliminada','eliminada',4,'eliminado',now()),(5,2,'Bolas','rodamientos/bolas',1,'activo',NULL),(6,2,'Otra','otra',2,'activo',NULL),(7,3,'Ajena','ajena',1,'activo',NULL);
 INSERT INTO menu_item VALUES(1,1,1,'Nombre editado','/products/correas/trapezoidales/',7,'activo',NULL,now(),now()),(2,1,3,'Inactiva conservada','/ruta-editada',8,'inactivo',NULL,now(),now()),(3,2,6,'Baja conservada','/ruta-baja',3,'eliminado',now(),now(),now());
 SELECT setval('menu_item_id_seq',1,true);`)
 await db.exec(reparar);await db.exec(reparar)
 const creada=await db.query("INSERT INTO configuracion_sitio(valor) VALUES('Nuevo') RETURNING id");assert.equal(creada.rows[0].id,18)
 await db.exec("SELECT setval('configuracion_sitio_id_seq',100,true)");await db.exec(reparar);assert.equal((await db.query("SELECT nextval('configuracion_sitio_id_seq') AS n")).rows[0].n,101)
 await db.exec(importar);await db.exec(importar)
 const filas=(await db.query('SELECT * FROM menu_item ORDER BY id')).rows
 assert.equal(filas.length,5);assert.equal(filas[0].nombre,'Nombre editado');assert.equal(filas[1].estado,'inactivo');assert.equal(filas[2].estado,'eliminado')
 assert.equal(filas.find(f=>Number(f.categoria_id)===2).ruta,'/products/correas/sincronas/');assert.equal(filas.find(f=>Number(f.categoria_id)===2).orden,9)
 assert.equal(filas.find(f=>Number(f.categoria_id)===5).ruta,'/products/rodamientos/bolas/');assert.ok(!filas.some(f=>Number(f.categoria_id)===4||Number(f.categoria_id)===7))
 assert.equal((await db.query('SELECT cargar_submenu FROM menus WHERE id=2')).rows[0].cargar_submenu,'inactivo')
 if(process.argv[2]){
  const respaldo=await readFile(process.argv[2],'utf8')
  function datos(tabla){const marca='COPY public.'+tabla+' (';const inicio=respaldo.indexOf(marca);assert.ok(inicio>=0);const cabecera=respaldo.slice(inicio,respaldo.indexOf('\n',inicio)),columnas=cabecera.slice(marca.length,cabecera.indexOf(') FROM')).split(', '),fin=respaldo.indexOf('\n\\.',inicio);return respaldo.slice(respaldo.indexOf('\n',inicio)+1,fin).split('\n').map(l=>Object.fromEntries(l.split('\t').map((v,i)=>[columnas[i],v==='\\N'?null:v])))}
  await db.exec('TRUNCATE menu_item,menus,categorias,productos RESTART IDENTITY CASCADE;')
  for(const [tabla,columnas] of [['productos',['id','empresa_id','nombre','slug','estado','eliminado_en']],['categorias',['id','producto_id','nombre','slug','orden','estado','eliminado_en']],['menus',['id','empresa_id','tipo_registro','registro_id','estado','eliminado_en','cargar_submenu']],['menu_item',['id','menu_id','categoria_id','nombre','ruta','orden','estado','eliminado_en','creado_en','actualizado_en']]]){
   for(const fila of datos(tabla))await db.query('INSERT INTO '+tabla+'('+columnas.join(',')+') VALUES('+columnas.map((_,i)=>'$'+(i+1)).join(',')+')',columnas.map(c=>fila[c]))
  }
  await db.exec("SELECT setval('menu_item_id_seq',4,true)")
  await db.exec(importar);await db.exec(importar)
  const cantidad=(await db.query('SELECT count(*)::int AS n FROM menu_item')).rows[0].n
  assert.equal(cantidad,64);assert.equal((await db.query("SELECT count(*)::int AS n FROM menu_item WHERE ruta LIKE '%/correas/correas/%' OR ruta LIKE '%/rodamientos/rodamientos/%'")).rows[0].n,0)
  console.log('Respaldo recibido: 4 vínculos existentes + 60 nuevos = 64, sin duplicar al repetir.')
 }
 console.log('SQL: secuencia reparada sin retroceder; subenlaces idempotentes, sin duplicar prefijos ni modificar bajas, órdenes o empresa ajena.')
}finally{await db.close()}
