import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { CamposMetadataSeccion } from '../src/frontend/features/cms/presentation/campos-metadata-seccion'
import { camposFormularioSeccion, metadataFormularioSeccion } from '../src/frontend/features/cms/presentation/datos-formulario-seccion'
import { SelectorSeccion } from '../src/frontend/features/cms/presentation/selector-seccion'
Object.assign(globalThis, { React })
test('sección: opcionales vacíos se serializan como null', () => {
    assert.deepEqual(camposFormularioSeccion({ titulo: ' Hero ', subtitulo: ' ', descripcion: '', icono: '', imagen: '' }), { titulo: 'Hero', subtitulo: null, descripcion: null, icono: null, imagen: null })
})
test('metadata: genera los cinco campos de Hero y el objeto solicitado', () => {
    const valores = { badge_text: 'Lider en Soluciones Industriales', cta_primary_href: '/contact', cta_primary_text: 'Solicitar Asesoría', cta_secondary_href: '/products', cta_secondary_text: 'Ver Productos' }
    const claves = Object.keys(valores)
    const html = renderToStaticMarkup(<CamposMetadataSeccion nombre="Hero" claves={claves} valores={valores} cambiar={() => { }} />)
    for (const [clave, valor] of Object.entries(valores)) { assert.ok(html.includes(clave)); assert.ok(html.includes(valor)) }
    assert.equal((html.match(/<input/g) ?? []).length, 5)
    assert.deepEqual(metadataFormularioSeccion(claves, { ...valores, obsoleta: 'no enviar' }), valores)
})
test('metadata opcional: tipo sin claves guarda un objeto vacío', () => { assert.deepEqual(metadataFormularioSeccion([], {}), {}) })
test('metadata: conserva tipos JSON existentes sin cambios', () => {
    const m = { numero: 0, booleano: false, nulo: null, objeto: { x: 1 }, lista: ['a'] }
    assert.deepEqual(metadataFormularioSeccion(Object.keys(m), m), m)
})
test('selectores: búsqueda y selección por ID para empresa y tipo', () => {
    for (const etiqueta of ['Empresa', 'Tipo de sección']) {
        const html = renderToStaticMarkup(<SelectorSeccion etiqueta={etiqueta} valor="" cargar={async () => ({ opciones: [], mas: false })} cambiar={() => { }} />)
        assert.ok(html.includes('type="search"')); assert.ok(html.includes('<select')); assert.ok(html.includes('required'))
    }
})
