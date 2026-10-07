import assert from 'node:assert/strict'
import { test } from 'node:test'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { FormularioMenu } from '../src/frontend/features/cms/presentation/formulario-menu'
import { gruposFormularioMenu, grupoFormularioMenu, tiposMenu, construirRutaMenu, rutaDestinoSubenlace } from '../src/frontend/features/cms/presentation/datos-menu-formulario'
import { SubenlacesMenu } from '../src/frontend/features/cms/presentation/subenlaces-menu'
Object.assign(globalThis, { React })
test('menú: tres grupos, selección de empresa y registro real, ruta con prefijo', () => {
    assert.deepEqual(gruposFormularioMenu, ['Producto', 'Aplicacion', 'Servicio']); assert.equal(tiposMenu.Aplicacion, 'industria')
    const html = renderToStaticMarkup(<FormularioMenu guardar={async () => { }} ocupado={false} cancelar={() => { }} />)
    assert.equal((html.match(/type="search"/g) ?? []).length, 2); assert.ok(html.includes('Sufijo de ruta')); assert.ok(html.includes('Icono de Lucide')); assert.ok(html.includes('ID real'))
})
test('menú: nombres históricos y sufijos construyen las rutas correctas', () => {
    assert.equal(grupoFormularioMenu('Aplicación'), 'Aplicacion'); assert.equal(construirRutaMenu('Producto', '/correas-industriales/'), '/products/correas-industriales/')
    assert.equal(construirRutaMenu('Aplicacion', 'mineria'), '/applications/mineria/'); assert.throws(() => construirRutaMenu('Producto', '../otro'))
})
test('menú: la ruta histórica se conserva hasta que se elija usar prefijo', () => {
    const html = renderToStaticMarkup(<FormularioMenu editar datos={{ empresaId: '1', grupo: 'Producto', destino: { tipo: 'producto', id: '77' }, ruta: '/productos/correas/' }} guardar={async () => { }} ocupado={false} cancelar={() => { }} />)
    assert.ok(html.includes('Ruta completa')); assert.ok(html.includes('/productos/correas/')); assert.ok(html.includes('value="77"'))
})
test('subenlaces: modal permite agregar y actualizar el listado', () => {
    const html = renderToStaticMarkup(<SubenlacesMenu menuId="1" rutaPadre="/products/correas/" cargarSubmenu="inactivo" gestionar verEliminados={false} cerrar={() => { }} />)
    assert.ok(html.includes('Agregar subenlace')); assert.ok(html.includes('Actualizar'))
})

test('subenlaces: flag activo usa ruta hija; inactivo o null redirige al padre', () => {
    assert.equal(rutaDestinoSubenlace('activo', '/padre/', '/hijo/'), '/hijo/')
    assert.equal(rutaDestinoSubenlace('inactivo', '/padre/', '/hijo/'), '/padre/')
    assert.equal(rutaDestinoSubenlace(null, '/padre/', '/hijo/'), '/padre/')
})
