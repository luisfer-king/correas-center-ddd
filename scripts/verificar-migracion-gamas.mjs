/** Prueba aislada: restaura el respaldo en PGlite en memoria. Nunca usa DATABASE_URL. */
import { PGlite } from '@electric-sql/pglite'
import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const respaldo = process.argv[2]
if (!respaldo) throw new Error('Uso: node scripts/verificar-migracion-gamas.mjs /ruta/respaldo.sql')
const db = new PGlite()
const origen = await readFile(respaldo, 'utf8')
// pg_dump plano: convierte COPY tabulado a literales escapados de PostgreSQL.
// Conserva null, barras, saltos y precisión numérica. No imprime filas del respaldo.
const sql = origen.replace(/^\\(?:restrict|unrestrict).*$/gm, '').replace(
  /^COPY ([^\n]+) FROM stdin;\r?\n([\s\S]*?)^\\\.\r?$/gm,
  (_todo, tablaColumnas, datos) => {
    const filas = datos.length === 0 ? [] : datos.replace(/\r?\n$/, '').split(/\r?\n/)
    if (!filas.length) return ''
    return `INSERT INTO ${tablaColumnas} VALUES\n` + filas.map(f => '(' + f.split('\t').map(v => v === '\\N' ? 'NULL' : `E'${v.replaceAll("'", "''")}'`).join(',') + ')').join(',\n') + ';'
  }
)
let fallo = false
try {
  await db.exec(sql)
  const tablas = (await db.query("SELECT schemaname, tablename FROM pg_tables WHERE schemaname IN ('public','auth') ORDER BY 1,2")).rows
  const huellas = async () => {
    const resultado = {}
    for (const t of tablas) {
      const nombre = `"${t.schemaname}"."${t.tablename}"`
      // Se comparan las columnas originales, permitiendo las columnas aditivas.
      const columnas = (await db.query('SELECT column_name FROM information_schema.columns WHERE table_schema=$1 AND table_name=$2 ORDER BY ordinal_position', [t.schemaname, t.tablename])).rows.map(c => c.column_name).filter(c => !(['atributos_tecnico', 'categoria_atributo'].includes(t.tablename) && ['tipo_dato','valor_texto','valor_booleano'].includes(c)))
      const seleccion = columnas.map(c => `"${c}"`).join(',')
      const r = await db.query(`SELECT count(*)::int AS total, md5(coalesce(string_agg(j, E'\n' ORDER BY j), '')) AS huella FROM (SELECT row_to_json(x)::text j FROM (SELECT ${seleccion} FROM ${nombre}) x) q`)
      resultado[`${t.schemaname}.${t.tablename}`] = r.rows[0]
    }
    return resultado
  }
  const antes = await huellas()
  const migracion = await readFile(new URL('../prisma/migrations/20261010023000_gamas_categoria_modelo/migration.sql', import.meta.url), 'utf8')
  await db.exec(migracion)
  assert.deepEqual(await huellas(), antes, 'Deben conservarse todos los valores de todas las tablas originales')
  console.log('Respaldo restaurado; migración aplicada; todas las filas originales conservadas.')
  console.log('Productos:', antes['public.productos'].total, 'Categorías:', antes['public.categorias'].total)
  await db.exec('SET search_path TO public')
  console.log((await db.query('SELECT version() AS version')).rows[0].version)
  const categorias = (await db.query('SELECT id, producto_id FROM categorias WHERE producto_id IS NOT NULL ORDER BY id')).rows
  const primera = categorias[0], segunda = categorias.find(c => c.producto_id === primera.producto_id && c.id !== primera.id), ajena = categorias.find(c => c.producto_id !== primera.producto_id)
  assert.ok(segunda && ajena, 'El respaldo de prueba debe tener dos categorías de un producto y una de otro')
  const insertar = async (texto, valores = []) => (await db.query(texto + ' RETURNING id', valores)).rows[0].id
  const g1 = await insertar('INSERT INTO gamas_categoria(categoria_id,producto_id,titulo) VALUES ($1,$2,$3)', [primera.id, primera.producto_id, 'Gama A'])
  const g2 = await insertar('INSERT INTO gamas_categoria(categoria_id,producto_id,titulo,gama_origen_id) VALUES ($1,$2,$3,$4)', [segunda.id, segunda.producto_id, 'Gama B', g1])
  const g3 = await insertar('INSERT INTO gamas_categoria(categoria_id,producto_id,titulo) VALUES ($1,$2,$3)', [ajena.id, ajena.producto_id, 'Gama C'])
  let rechazos = 0
  const rechaza = async (texto, valores, codigo) => {
    await assert.rejects(db.query(texto, valores), error => error.code === codigo)
    rechazos++
  }
  await rechaza('UPDATE gamas_categoria SET gama_origen_id=$1 WHERE id=$2', [g3,g2], '23503')
  await rechaza('UPDATE gamas_categoria SET gama_origen_id=id WHERE id=$1', [g1], '23514')
  await rechaza('UPDATE gamas_categoria SET producto_id=$1 WHERE id=$2', [ajena.producto_id,g1], '23503')
  await rechaza('INSERT INTO plantillas_gama_producto(producto_id,gama_id) VALUES ($1,$2)', [primera.producto_id,g3], '23503')
  await db.query('INSERT INTO plantillas_gama_producto(producto_id,gama_id) VALUES ($1,$2)', [primera.producto_id,g1])
  const tipo = await insertar("INSERT INTO tipo_atributo(nombre,slug) VALUES ('Prueba gama','prueba-gama')")
  const atributo = async (nombre,tipoDato) => insertar('INSERT INTO atributos_tecnico(tipo_atributo_id,nombre,tipo_dato) VALUES ($1,$2,$3)', [tipo,nombre,tipoDato])
  const an = await atributo('Ancho','numero'), at = await atributo('Material','texto'), ab = await atributo('Certificado','booleano')
  const columna = async (g,a,t,o) => insertar('INSERT INTO columnas_gama(gama_id,atributo_id,tipo_dato,orden) VALUES ($1,$2,$3,$4)', [g,a,t,o])
  const cn = await columna(g1,an,'numero',1), ct = await columna(g1,at,'texto',2), cb = await columna(g1,ab,'booleano',3), cAjena = await columna(g2,an,'numero',1)
  const fila = async (g,c,o) => insertar('INSERT INTO filas_gama(gama_id,codigo,nombre,orden) VALUES ($1,$2,$3,$4)', [g,c,c,o])
  const f1 = await fila(g1,'a',1), f2 = await fila(g1,'b',2)
  await rechaza('INSERT INTO filas_gama(gama_id,codigo,nombre,orden) VALUES ($1,$2,$2,1)', [g1,'c'], '23505')
  await rechaza('INSERT INTO filas_gama(gama_id,codigo,nombre,orden) VALUES ($1,$2,$2,0)', [g1,'c'], '23514')
  await rechaza('INSERT INTO columnas_gama(gama_id,atributo_id,tipo_dato,orden) VALUES ($1,$2,$3,4)', [g3,an,'texto'], '23503')
  const grupoAjeno = await insertar("INSERT INTO grupos_columnas_gama(gama_id,codigo,nombre,orden) VALUES ($1,'grupo','Grupo',1)", [g2])
  await rechaza('UPDATE columnas_gama SET grupo_id=$1 WHERE id=$2', [grupoAjeno,cn], '23503')
  const celda = 'INSERT INTO valores_gama(fila_id,columna_id,gama_id,tipo_dato,valor_numero,valor_texto,valor_booleano) VALUES ($1,$2,$3,$4,$5,$6,$7)'
  await rechaza(celda, [f1,cAjena,g1,'numero','1',null,null], '23503')
  await rechaza(celda, [f1,cn,g1,'numero',null,'13',null], '23514')
  await rechaza(celda, [f1,cn,g1,'numero','13','13',null], '23514')
  await rechaza(celda, [f1,cn,g1,'numero',null,null,null], '23514')
  await rechaza(celda, [f1,cn,g1,'numero','NaN',null,null], '23514')
  await db.query(celda, [f1,cn,g1,'numero','12345678901234567890.123456789',null,null])
  await db.query(celda, [f1,ct,g1,'texto',null,'Caucho',null])
  await db.query(celda, [f1,cb,g1,'booleano',null,null,false])
  await db.query(celda, [f2,cn,g1,'numero','0',null,null])
  assert.equal((await db.query('SELECT valor_numero::text AS v FROM valores_gama WHERE fila_id=$1 AND columna_id=$2',[f1,cn])).rows[0].v, '12345678901234567890.123456789')
  assert.equal((await db.query('SELECT valor_booleano FROM valores_gama WHERE fila_id=$1 AND columna_id=$2',[f1,cb])).rows[0].valor_booleano, false)
  await rechaza('UPDATE atributos_tecnico SET tipo_dato=$1 WHERE id=$2', ['texto',an], '23514')
  await db.query('INSERT INTO categoria_atributo(categoria_id,atributo_id,tipo_dato,valor_texto) VALUES ($1,$2,$3,$4)', [primera.id,at,'texto','Reforzado'])
  await rechaza('UPDATE categoria_atributo SET valor_booleano=false WHERE categoria_id=$1 AND atributo_id=$2', [primera.id,at], '23514')
  await db.query("UPDATE filas_gama SET estado='inactivo' WHERE id=$1", [f2])
  await rechaza('INSERT INTO filas_gama(gama_id,codigo,nombre,orden) VALUES ($1,$2,$2,2)', [g1,'c'], '23505')
  await db.query("UPDATE filas_gama SET estado='eliminado',eliminado_en=now() WHERE id=$1", [f2])
  await fila(g1,'b',2)
  console.log(`${rechazos} escrituras inválidas rechazadas; valores tipados y borrado lógico verificados.`)
} catch (error) {
  // Evita que errores del motor impriman el SQL/datos privados del respaldo.
  console.error('Prueba fallida:', error.code ?? error.name, error.message)
  fallo = true
} finally { await db.close() }
if (fallo) process.exit(1)
