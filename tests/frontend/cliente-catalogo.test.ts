import assert from 'node:assert/strict'
import { test } from 'node:test'
import { clienteRecurso, idCatalogo } from '../../src/frontend/features/catalog/api/cliente-catalogo'
import { cuerpoFormulario } from '../../src/frontend/features/catalog/presentation/configuracion-catalogo'
test('IDs se validan antes de crear URLs; asignaciones exigen el filtro correcto', async () => {
    assert.equal(idCatalogo('42'), '42')
    for (const invalido of ['0', '-1', '1/2', '9223372036854775808', '']) assert.throws(() => idCatalogo(invalido))
    assert.throws(() => clienteRecurso('asignaciones-atributo').listar(), /Selecciona categoriaId/)
})
test('cliente convierte el filtro y envía escrituras con las cabeceras del portal', async () => {
    const original = globalThis.fetch
    const peticiones: Array<{ url: string; init: RequestInit }> = []
    globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
        peticiones.push({ url: String(url), init: init ?? {} })
        return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }) as typeof fetch
    try {
        await clienteRecurso('asignaciones-marca').listar(2, { productoId: '7' })
        assert.equal(peticiones[0].url, '/api/portal/catalogo/asignaciones-marca?pagina=2&productoId=7')
        await clienteRecurso('marcas').crear({ nombre: 'SKF', slug: 'skf', logo: null, orden: 0 })
        assert.equal(peticiones[1].init.method, 'POST')
        assert.equal((peticiones[1].init.headers as Headers).get('X-Portal-Request'), '1')
    } finally { globalThis.fetch = original }
})
test('formulario arma objetos anidados y conserva orden nulo cuando corresponde', () => {
    assert.deepEqual(cuerpoFormulario([
        { clave: 'destino.tipo', etiqueta: 'Tipo' }, { clave: 'destino.id', etiqueta: 'Destino' },
        { clave: 'orden', etiqueta: 'Orden', tipo: 'number-nullable' },
    ], { 'destino.tipo': 'servicio', 'destino.id': '8', orden: '' }, false),
        { destino: { tipo: 'servicio', id: '8' }, orden: null })
    assert.deepEqual(cuerpoFormulario([{ clave: 'slug', etiqueta: 'Slug', soloCrear: true },
    { clave: 'nombre', etiqueta: 'Nombre' }], { slug: 'a', nombre: 'Nuevo' }, true), { nombre: 'Nuevo' })
})
