/** Restaura el respaldo únicamente en una base temporal en memoria. */
import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import {PGlite} from '@electric-sql/pglite'
const archivo=process.argv[2]
if(!archivo)throw new Error('Uso: node --import tsx scripts/verificar-completar-3vx-5vx.mjs respaldo.sql')
const respaldo=await readFile(archivo,'utf8')
const sql=respaldo.replace(/^\\(?:restrict|unrestrict).*$/gm,'').replace(/^COPY ([^\n]+) FROM stdin;\r?\n([\s\S]*?)^\\\.\r?$/gm,(_,tabla,datos)=>{
 const filas=datos.length===0?[]:datos.replace(/\r?\n$/,'').split(/\r?\n/)
 return filas.length?`INSERT INTO ${tabla} VALUES `+filas.map(f=>'('+f.split('\t').map(v=>v==='\\N'?'NULL':`E'${v.replaceAll("'","''")}'`).join(',')+')').join(',')+';':''
})
const parche=await readFile(new URL('./sql/completar-gamas-3vx-5vx.sql',import.meta.url),'utf8')
const db=new PGlite()
const consultar=async q=>(await db.query(q)).rows
const otras="SELECT v.* FROM valores_gama v JOIN filas_gama f ON f.id=v.fila_id WHERE f.codigo NOT IN ('3vx','5vx') ORDER BY fila_id,columna_id"
try{
 await db.exec(sql);await db.exec('SET search_path TO public')
 const antes=JSON.stringify(await consultar(otras))
 await db.exec(parche)
 const valores=await consultar("SELECT f.codigo,c.etiqueta,v.valor_numero,v.valor_texto FROM valores_gama v JOIN filas_gama f ON f.id=v.fila_id JOIN columnas_gama c ON c.id=v.columna_id WHERE f.codigo IN ('3vx','5vx') ORDER BY f.orden,c.orden")
 assert.equal(valores.length,12)
 const valor=(codigo,etiqueta)=>valores.find(v=>v.codigo===codigo&&v.etiqueta===etiqueta)
 assert.equal(Number(valor('3vx','Ancho superior').valor_numero),9.652)
 assert.equal(Number(valor('3vx','Espesor').valor_numero),7.874)
 assert.equal(Number(valor('5vx','Ancho superior').valor_numero),16.002)
 assert.equal(Number(valor('5vx','Espesor').valor_numero),13.462)
 assert.equal(Number(valor('3vx','Longitud mínima catalogada').valor_numero),635)
 assert.equal(Number(valor('3vx','Longitud máxima catalogada').valor_numero),3810)
 assert.equal(Number(valor('5vx','Longitud mínima catalogada').valor_numero),1143)
 assert.equal(Number(valor('5vx','Longitud máxima catalogada').valor_numero),4826)
 for(const codigo of ['3vx','5vx']){assert.equal(valor(codigo,'Designación de longitud').valor_texto,'Le');assert.equal(Number(valor(codigo,'Ángulo').valor_numero),38)}
 assert.equal(JSON.stringify(await consultar(otras)),antes)
 console.log('OK 12 valores oficiales, conversiones y otros perfiles intactos')
 const version=JSON.stringify(await consultar('SELECT * FROM gamas_categoria WHERE categoria_id=1'))
 await db.exec(parche)
 assert.equal(JSON.stringify(await consultar('SELECT * FROM gamas_categoria WHERE categoria_id=1')),version)
 console.log('OK segunda ejecución sin duplicados ni cambio de versión')
 await db.exec("UPDATE valores_gama SET valor_numero=10 WHERE fila_id=(SELECT id FROM filas_gama WHERE codigo='3vx' AND gama_id=1) AND columna_id=(SELECT id FROM columnas_gama WHERE etiqueta='Ancho superior' AND gama_id=1)")
 await db.exec(parche)
 assert.equal(Number((await consultar("SELECT valor_numero FROM valores_gama WHERE fila_id=15 AND columna_id=1"))[0].valor_numero),10)
 console.log('OK preserva edición posterior')
 // Retira SOLO la marca de prueba en memoria para simular datos previos conflictivos.
 await db.exec("DELETE FROM auditoria WHERE metadata->>'semilla'='completar-3vx-5vx-dynamic-x-v1'")
 await assert.rejects(db.exec(parche),/Ya hay un valor diferente/);await db.exec('ROLLBACK')
 assert.equal(Number((await consultar("SELECT valor_numero FROM valores_gama WHERE fila_id=15 AND columna_id=1"))[0].valor_numero),10)
 console.log('OK conflicto previo: rollback sin sobrescribir')
}finally{await db.close()}
