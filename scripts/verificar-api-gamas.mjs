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
import { createApp } from '../src/backend/app.ts'
import { componerCatalogo } from '../src/backend/contexts/catalog-management/infrastructure/componer-catalogo.ts'
const archivo = process.argv[2]
if (!archivo) throw new Error('Uso: node --import tsx scripts/verificar-api-gamas.mjs respaldo.sql')
const memoria = new PGlite(); let servidor, db, app, fallo = false, pruebas = 0
const prueba = async (nombre, fn) => { await fn(); pruebas++; console.log(`OK ${nombre}`) }
try {
    const respaldo = await readFile(archivo, 'utf8')
    const sql = respaldo.replace(/^\\(?:restrict|unrestrict).*$/gm, '').replace(/^COPY ([^\n]+) FROM stdin;\r?\n([\s\S]*?)^\\\.\r?$/gm, (_todo, tabla, datos) => {
        const filas = datos.length === 0 ? [] : datos.replace(/\r?\n$/, '').split(/\r?\n/)
        return filas.length ? `INSERT INTO ${tabla} VALUES ` + filas.map(f => '(' + f.split('\t').map(v => v === '\\N' ? 'NULL' : `E'${v.replaceAll("'", "''")}'`).join(',') + ')').join(',') + ';' : ''
    })
    await memoria.exec(sql)
    await memoria.exec(await readFile(new URL('../prisma/migrations/20261010023000_gamas_categoria_modelo/migration.sql', import.meta.url), 'utf8'))
    servidor = new PGLiteSocketServer({ db: memoria, host: '127.0.0.1', port: 0, maxConnections: 1 })
    await servidor.start()
    const direccion = servidor.getServerConn()
    const connectionString = direccion.startsWith('postgres') ? direccion : `postgresql://postgres:postgres@${direccion}/postgres`
    db = new PrismaClient({ adapter: new PrismaPg({ connectionString, max: 1 }), transactionOptions: { timeout: 20000, maxWait: 10000 } })
    await db.$connect()
    await prueba('SQL de permisos idempotente sin asignar roles ni reactivar permisos', async () => {
        const antes = await db.rolPermiso.count()
        const sqlPermisos = await readFile(new URL('./sql/permisos-gamas-api.sql', import.meta.url), 'utf8')
        await memoria.exec(sqlPermisos)
        const total = await db.permiso.count()
        await db.permiso.update({ where: { slug: 'catalog.atributos_tecnicos.manage' }, data: { estado: 'inactivo' } })
        await memoria.exec(sqlPermisos)
        assert.equal(await db.permiso.count(), total); assert.equal(await db.rolPermiso.count(), antes)
        assert.equal((await db.permiso.findUnique({ where: { slug: 'catalog.atributos_tecnicos.manage' } })).estado, 'inactivo')
    })
    // Fixture IAM exclusivamente en la base temporal: no depende de los roles del respaldo.
    const perfil = await db.perfil.findFirst({ where: { estado: 'activo', eliminadoEn: null }, select: { id: true } })
    assert.ok(perfil, 'El respaldo debe contener un perfil activo')
    const rolPrueba = await db.rol.create({ data: { nombre: 'Prueba aislada gamas', slug: 'prueba_aislada_gamas' } })
    for (const slug of ['catalog.categorias.manage', 'catalog.categorias.read', 'catalog.atributos_tecnicos.manage', 'catalog.asignaciones_atributo.manage']) {
        const permiso = await db.permiso.upsert({ where: { slug }, create: { slug, nombre: slug, grupo: 'prueba-gamas' }, update: { estado: 'activo', eliminadoEn: null } })
        await db.rolPermiso.create({ data: { rolId: rolPrueba.id, permisoId: permiso.id } })
    }
    await db.usuarioRol.create({ data: { usuarioId: perfil.id, rolId: rolPrueba.id } })
    const actor = perfil.id, casos = componerGamas(db), lecturas = new PrismaGamas(db), uow = new PrismaUnidadTrabajoGamas(db)
    const todas = await db.categoria.findMany({ where: { estado: 'activo' }, orderBy: { id: 'asc' }, select: { id: true, productoId: true } })
    const agrupadas = Map.groupBy(todas, c => c.productoId)
    const grupo = [...agrupadas.values()].find(g => g.length >= 5)
    assert.ok(grupo, 'Se necesitan cinco categorías del mismo producto en el respaldo')
    const [ca, cb, cc, cd, ce] = grupo, externa = todas.find(c => c.productoId !== ca.productoId)
    assert.ok(externa)
    const tipo = await db.tipoAtributo.create({ data: { nombre: 'Casos gama', slug: 'casos-gama', permiteValorNumerico: true } })
    const atributos = {}
    for (const tipoDato of ['numero', 'texto', 'booleano']) atributos[tipoDato] = await db.atributoTecnico.create({ data: { tipoAtributoId: tipo.id, nombre: tipoDato, tipoDato } })

    const config = { origen: 'http://localhost:3000', cookie: 'portal', secure: false }
    const iam = { activarRol: { ejecutar: async () => { } }, inactivarRol: { ejecutar: async () => { } }, eliminarRol: { ejecutar: async () => { } }, comprobar: { ejecutar: async token => { if (token !== 'prueba') throw new Error('Sesión inválida'); return { usuarioId: actor } } } }
    app = await createApp({ casos: iam, config, gamas: casos, catalogo: componerCatalogo(db) })
    const base = '/api/portal/catalogo/gamas', headers = { cookie: 'portal=prueba', origin: config.origen, 'x-portal-request': '1', 'user-agent': 'prueba-api-gamas' }
    const http = async (method, url, payload, status = 200) => {
        const r = await app.inject({ method, url, headers, ...(payload === undefined ? {} : { payload }) })
        assert.equal(r.statusCode, status, `${method} ${url}: ${r.body}`); return r.json()
    }
    let gama, version, columna, fila, copia
    await prueba('API integrada en createApp y OpenAPI', async () => {
        await app.ready(); assert.ok(app.swagger().paths['/api/portal/catalogo/gamas/{gamaId}/valores'])
        assert.equal((await app.inject({ url: base + '?productoId=' + ca.productoId })).statusCode, 401)
        assert.equal((await app.inject({ method: 'POST', url: base, headers: { ...headers, origin: 'https://ajeno.test' }, payload: { categoriaId: String(ca.id), titulo: 'A' } })).statusCode, 403)
    })
    await prueba('crear y consultar gama con versión serializada y auditoría HTTP', async () => {
        const r = await http('POST', base, { categoriaId: String(ca.id), titulo: 'API gama' }, 201); gama = r.gamaId; version = r.version
        const dto = await http('GET', base + '/' + gama); assert.equal(dto.version, version); assert.equal(dto.titulo, 'API gama'); assert.deepEqual(dto.filas, [])
        assert.equal((await http('GET', '/api/portal/catalogo/categorias/' + ca.id + '/gama')).id, gama)
        const audit = await db.$queryRaw`SELECT ip_address, user_agent FROM public.auditoria WHERE tabla_afectada='gamas_categoria' AND registro_id=${gama} AND accion::text='Lectura' ORDER BY id DESC LIMIT 1`
        assert.equal(audit[0].user_agent, 'prueba-api-gamas'); assert.equal(audit[0].ip_address, '127.0.0.1')
    })
    await prueba('columna configura plantilla y las versiones obsoletas devuelven 409', async () => {
        const anterior = version, r = await http('POST', base + '/' + gama + '/columnas', { version, atributoId: String(atributos.numero.id), tipoDato: 'numero', grupoId: null, etiqueta: 'Ancho', unidadMedida: 'mm' }, 201)
        version = r.version; columna = r.resultado
        await http('PATCH', base + '/' + gama + '/inactivar', { version: anterior }, 409)
        const ref = await http('GET', '/api/portal/catalogo/productos/' + ca.productoId + '/plantilla-gama'); assert.equal(ref.plantilla.gamaId, gama)
        await http('PATCH', base + '/' + gama + '/columnas/' + columna + '/inactivar', { version }, 409)
    })
    await prueba('crear filas y guardar decimales exactos por HTTP', async () => {
        const r = await http('POST', base + '/' + gama + '/filas', { version, codigo: 'a-1', grupoId: null, nombre: 'A1', descripcion: null, enlaceDetalle: null }, 201); fila = r.resultado; version = r.version
        const g = await http('PUT', base + '/' + gama + '/valores', { version, cambios: [{ filaId: fila, columnaId: columna, valor: { tipo: 'numero', valor: '12345678901234567890.123456789' } }] }); version = g.version
        assert.equal((await http('GET', base + '/' + gama)).valores[0].valor.valor, '12345678901234567890.123456789')
    })
    await prueba('celdas ajenas y lote parcialmente válido revierten todos los cambios', async () => {
        await http('PUT', base + '/' + gama + '/valores', { version, cambios: [{ filaId: fila, columnaId: columna, valor: { tipo: 'numero', valor: '7' } }, { filaId: '9223372036854775807', columnaId: columna, valor: { tipo: 'numero', valor: '8' } }] }, 404)
        const dto = await http('GET', base + '/' + gama); assert.equal(dto.version, version); assert.equal(dto.valores[0].valor.valor, '12345678901234567890.123456789')
    })
    await prueba('copiar plantilla, IDs nuevos, independencia y no sobrescribir', async () => {
        copia = await http('POST', base + '/desde-plantilla', { categoriaId: String(cb.id), copiarFilas: true, copiarValores: true }, 201)
        const dto = await http('GET', base + '/' + copia.gamaId); assert.notEqual(dto.filas[0].id, fila); assert.equal(dto.valores[0].valor.valor, '12345678901234567890.123456789')
        await http('POST', base + '/desde-plantilla', { categoriaId: String(cb.id) }, 409)
        await http('PATCH', base + '/' + copia.gamaId, { version: copia.version, titulo: 'Independiente', descripcion: null, imagen: null })
        assert.equal((await http('GET', base + '/' + gama)).titulo, 'API gama')
    })
    await prueba('guardar null elimina una celda sin inventar cero', async () => {
        const r = await http('PUT', base + '/' + gama + '/valores', { version, cambios: [{ filaId: fila, columnaId: columna, valor: null }] }); version = r.version
        assert.deepEqual((await http('GET', base + '/' + gama)).valores, [])
    })
    await prueba('API técnica acepta booleanos y mantiene el contrato numérico anterior', async () => {
        const recurso = '/api/portal/catalogo/atributos-tecnicos'
        const atributo = await http('POST', recurso, { tipoAtributoId: String(tipo.id), nombre: 'Booleano HTTP', tipoDato: 'booleano', valores: { descripcion: null, valorNumerico: null, unidadMedida: null }, orden: 0 }, 201)
        assert.equal(atributo.tipoDato, 'booleano')
        const asignacion = await http('POST', '/api/portal/catalogo/asignaciones-atributo', { categoriaId: String(ca.id), atributoId: atributo.id, valor: { tipo: 'booleano', valor: false }, orden: 0 }, 201)
        assert.deepEqual(asignacion.valor, { tipo: 'booleano', valor: false }); assert.equal(asignacion.valorPersonalizado, null)
        const a = await http('POST', '/api/portal/catalogo/asignaciones-atributo', { categoriaId: String(ca.id), atributoId: String(atributos.numero.id), valorPersonalizado: '0', orden: 0 }, 201)
        assert.equal(a.valorPersonalizado, '0'); assert.deepEqual(a.valor, { tipo: 'numero', valor: '0' })
        await http('POST', '/api/portal/catalogo/asignaciones-atributo', { categoriaId: String(ca.id), atributoId: atributo.id, valor: { tipo: 'booleano', valor: 'false' }, orden: 0 }, 400)
    })
    await prueba('retirar plantilla exige su versión, baja lógica y copias conservadas', async () => {
        const ruta = '/api/portal/catalogo/productos/' + ca.productoId + '/plantilla-gama', ref = (await http('GET', ruta)).plantilla
        await http('DELETE', ruta, { version: '2000-01-01T00:00:00.000Z' }, 409)
        await http('DELETE', ruta, { version: ref.version })
        await http('PATCH', base + '/' + gama + '/eliminar', { version })
        assert.equal((await http('GET', base + '/' + copia.gamaId)).estado, 'activo')
    })
    await prueba('revocar permiso real produce 403 sin escrituras', async () => {
        // Quita todas las asignaciones al perfil únicamente en esta base desechable.
        await db.usuarioRol.updateMany({ where: { usuarioId: actor }, data: { estado: 'inactivo' } })
        await http('POST', base, { categoriaId: String(cc.id), titulo: 'Denegada' }, 403)
        assert.equal(await db.gamaCategoria.findUnique({ where: { categoriaId: cc.id } }), null)
        await http('GET', base + '?productoId=' + ca.productoId, undefined, 403)
    })
    console.log(`${pruebas} escenarios HTTP correctos. Base temporal descartada.`)
} catch (e) { fallo = true; console.error('Integración HTTP fallida:', e.code ?? e.name, e.message) }
finally { if (app) await app.close(); if (db) await db.$disconnect(); if (servidor) await servidor.stop(); await memoria.close() }
if (fallo) process.exit(1)
