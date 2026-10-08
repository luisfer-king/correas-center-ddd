import assert from 'node:assert/strict'
import { test } from 'node:test'
import { construirRutaSubenlace } from '../src/shared/ruta-subenlace'
test('categoría jerárquica conserva una sola vez el producto', () => {
    assert.equal(construirRutaSubenlace('/products/correas/', 'correas/trapezoidales'), '/products/correas/trapezoidales/')
})
test('categoría simple agrega su segmento al producto', () => {
    assert.equal(construirRutaSubenlace('/products/correas/', 'trapezoidales'), '/products/correas/trapezoidales/')
})
test('ruta completa y barras exteriores no duplican prefijo ni padre', () => {
    assert.equal(construirRutaSubenlace('/products/correas/', '/products/correas/trapezoidales/'), '/products/correas/trapezoidales/')
})
test('la unión funciona también para aplicaciones y servicios', () => {
    assert.equal(construirRutaSubenlace('/applications/mineria/', 'mineria/correas'), '/applications/mineria/correas/')
    assert.equal(construirRutaSubenlace('/services/reparacion/', 'reparacion/cilindros'), '/services/reparacion/cilindros/')
})
test('conserva subrutas y compara segmentos completos', () => {
    assert.equal(construirRutaSubenlace('/products/correas/', 'correas/industriales/trapezoidales'), '/products/correas/industriales/trapezoidales/')
    assert.equal(construirRutaSubenlace('/products/correas/', 'correas-especiales'), '/products/correas/correas-especiales/')
})
test('rechaza rutas vacías, externas y navegación relativa', () => {
    for (const slug of ['', '../otra', 'correas/../otra', 'https://otro.test', 'correas//otra', 'otra?x=1']) assert.throws(() => construirRutaSubenlace('/products/correas/', slug), /inválida/)
})
