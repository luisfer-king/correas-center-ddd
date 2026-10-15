import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFile, mkdtemp, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { PGlite } from '@electric-sql/pglite'
const temporal=await mkdtemp(join(tmpdir(),'cms-institucional-'))
const archivo=join(temporal,'contenido.sql'),db=new PGlite()
try{
 const r=spawnSync(process.execPath,['--import','tsx','scripts/generar-contenido-institucional.mjs',archivo],{cwd:process.cwd(),env:{...process.env,PUBLIC_EMPRESA_ID:'42'},encoding:'utf8'})
 assert.equal(r.status,0,r.stderr)
 const sql=await readFile(archivo,'utf8')
 await db.exec(`CREATE TABLE empresas(id bigint PRIMARY KEY,estado text,eliminado_en timestamptz);
 CREATE TABLE registros(id bigserial PRIMARY KEY,identificador text UNIQUE,nombre text,descripcion text,orden integer,estado text,eliminado_en timestamptz);
 CREATE TABLE registro_contenido(id bigserial PRIMARY KEY,empresa_id bigint,registro_id bigint,titulo text,descripcion text,orden integer,estado text);
 INSERT INTO empresas VALUES(42,'activo',NULL);`)
 await db.exec(sql);await db.exec(sql)
 assert.equal((await db.query('SELECT COUNT(*)::int AS n FROM registros')).rows[0].n,2)
 assert.equal((await db.query('SELECT COUNT(*)::int AS n FROM registro_contenido')).rows[0].n,2)
 await db.exec("UPDATE registro_contenido SET descripcion='Texto editado'; UPDATE registros SET estado='inactivo' WHERE identificador='privacidad';")
 await db.exec(sql)
 assert.ok((await db.query('SELECT descripcion FROM registro_contenido')).rows.every(r=>r.descripcion==='Texto editado'))
 assert.equal((await db.query("SELECT estado FROM registros WHERE identificador='privacidad'")).rows[0].estado,'inactivo')
 console.log('SQL inicial: aplicación idempotente, contenido editado preservado y bajas sin reactivar. PostgreSQL temporal en memoria.')
}finally{await db.close();await rm(temporal,{recursive:true,force:true})}
