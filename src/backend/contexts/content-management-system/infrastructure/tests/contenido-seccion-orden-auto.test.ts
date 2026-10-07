import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PrismaContenidosSeccion } from '../prisma-contenido-seccion.js'
import { entorno, contexto, antes } from './soporte-pruebas-cms.js'
const datos = (tipoSeccionId = 1n) => ({ empresaId: 1n, tipoSeccionId, campos: { titulo: 'Hero', subtitulo: null, descripcion: null, icono: null, imagen: null }, metadata: {}, mostrar: true })
test('orden: primera sección del tipo empieza en 1 aunque otro tipo tenga orden alto', async () => {
    const env = entorno('contenidoSeccion'); env.tablas.contenidoSeccion[0].orden = 500
    const r = await new PrismaContenidosSeccion(env.db).crear(datos(2n), contexto)
    assert.equal(r.orden.value, 1)
    const q = env.consultas.find(c => c.metodo === 'aggregate')!
    assert.deepEqual(q.args.where, { tipoSeccionId: 2n, eliminadoEn: null })
    assert.equal(env.consultas[0].args.isolationLevel, 'Serializable')
})
test('orden: máximo por tipo incluye inactivos y comparte secuencia entre empresas', async () => {
    const env = entorno('contenidoSeccion'); const fila = env.tablas.contenidoSeccion[0]
    fila.orden = 8; fila.estado = 'inactivo'; fila.empresaId = 9n
    const r = await new PrismaContenidosSeccion(env.db).crear(datos(), contexto)
    assert.equal(r.orden.value, 9)
})
test('orden: baja lógica no aumenta la secuencia', async () => {
    const env = entorno('contenidoSeccion'); env.tablas.contenidoSeccion[0].orden = 100; env.tablas.contenidoSeccion[0].eliminadoEn = antes
    assert.equal((await new PrismaContenidosSeccion(env.db).crear(datos(), contexto)).orden.value, 1)
})
test('orden: rango agotado no escribe ni audita', async () => {
    const env = entorno('contenidoSeccion'); env.tablas.contenidoSeccion[0].orden = 2147483647
    await assert.rejects(new PrismaContenidosSeccion(env.db).crear(datos(), contexto), /fuera de rango/)
    assert.equal(env.consultas.filter(c => c.metodo === 'create').length, 0); assert.equal(env.auditorias.length, 0)
})
