import assert from 'node:assert/strict'
import { test } from 'node:test'
import { slugNombre } from '../../../../../shared/slug-nombre.js'
import { Slug } from '../../../../shared/domain/value-objects.js'
import type { AutorizacionCatalogo } from '../acceso-catalogo.js'
import { CrearCategoria } from '../use-cases/categorias/crear-categoria.js'
import { CrearIndustria } from '../use-cases/industrias/crear-industria.js'
import { CrearMarca } from '../use-cases/marcas/crear-marca.js'
import { CrearProducto } from '../use-cases/productos/crear-producto.js'
const auth: AutorizacionCatalogo = { ejecutar: async () => { }, tienePermiso: async () => true, tieneRolActivo: async () => false }
const actor = '11111111-1111-4111-8111-111111111111'
test('slug normaliza tildes, espacios, puntuación y mayúsculas', () => {
    assert.equal(slugNombre('  Correas Dentadas  '), 'correas-dentadas')
    assert.equal(slugNombre('Industría & Cañerías'), 'industria-canerias')
    assert.equal(slugNombre('V.'), 'v')
})
test('productos, marcas e industrias generan el slug del nombre y no confían en el cliente', async () => {
    for (const Tipo of [CrearProducto, CrearMarca, CrearIndustria]) {
        let capturado = ''
        const repo = { crear: async (datos: { slug: Slug }) => { capturado = datos.slug.value; return datos } }
        const caso = new Tipo(repo as never, auth)
        await caso.ejecutar(actor, { empresaId: 1n, nombre: 'Correas Dentadas', slug: 'valor-manual', imagen: null, logo: null, orden: 1 })
        assert.equal(capturado, 'correas-dentadas')
    }
})
test('categoría toma el slug almacenado del producto seleccionado', async () => {
    const repo = { crear: async (datos: { slug: Slug }) => datos }
    const productos = { buscarPorId: async () => ({ estado: 'activo', slug: Slug.create('correas') }) }
    const caso = new CrearCategoria(repo as never, auth, productos as never)
    for (const [nombre, esperado] of [['V', 'correas/v'], ['Dentadas', 'correas/dentadas']]) {
        const categoria = await caso.ejecutar(actor, {
            productoId: 1n, nombre, slug: 'otro/prefijo', imagen: null,
            descripcion: null, descripcionCorta: null, uso: null, orden: 1
        })
        assert.equal(categoria.slug.value, esperado)
    }
})
test('la fábrica de categorías admite ruta sin debilitar Slug.create', () => {
    assert.equal(Slug.rutaCategoria('correas/dentadas').value, 'correas/dentadas')
    assert.throws(() => Slug.create('correas/dentadas'))
    assert.throws(() => Slug.rutaCategoria('../correas'))
})
test('categoría rechaza producto no disponible y no escribe', async () => {
    let escrituras = 0
    const caso = new CrearCategoria({ crear: async () => { escrituras++ } } as never, auth,
        { buscarPorId: async () => null } as never)
    await assert.rejects(caso.ejecutar(actor, {
        productoId: 1n, nombre: 'V', imagen: null,
        descripcion: null, descripcionCorta: null, uso: null, orden: 1
    }), /Referencia no disponible/)
    assert.equal(escrituras, 0)
})
