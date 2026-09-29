import assert from 'node:assert/strict'
import { test } from 'node:test'
import { interpretarMapaSucursal } from '../../src/shared/mapa-sucursal.ts'

test('extrae longitud y latitud del iframe estándar sin invertirlas', () => {
    const mapa = interpretarMapaSucursal('<iframe src="https://www.google.com/maps/embed?pb=!1m18!2d-63.182!3d-17.783" width="600" height="450"></iframe>')
    assert.equal(mapa.latitud, '-17.783'); assert.equal(mapa.longitud, '-63.182')
    assert.ok(mapa.url?.startsWith('https://www.google.com/maps/embed?'))
    assert.ok(!mapa.url?.includes('<iframe'))
})
test('acepta el enlace src y coordenadas en q', () => {
    const mapa = interpretarMapaSucursal('https://maps.google.com/maps?q=-17.8,-63.2&output=embed')
    assert.equal(mapa.latitud, '-17.8'); assert.equal(mapa.longitud, '-63.2')
})
test('limpia las coordenadas al quitar el mapa', () => {
    assert.deepEqual(interpretarMapaSucursal(''), { url: null, latitud: null, longitud: null })
})
test('rechaza enlaces sin coordenadas y coordenadas fuera de rango', () => {
    assert.throws(() => interpretarMapaSucursal('https://www.google.com/maps/embed?pb=sin-coordenadas'), /coordenadas legibles/)
    assert.throws(() => interpretarMapaSucursal('https://www.google.com/maps/embed?q=91,12'), /fuera de rango/)
})
test('rechaza hosts engañosos y protocolos inseguros', () => {
    for (const enlace of ['https://www.google.com.evil.test/maps/embed?q=1,2', 'javascript:alert(1)',
        'http://www.google.com/maps/embed?q=1,2', 'https://usuario@www.google.com/maps/embed?q=1,2'])
        assert.throws(() => interpretarMapaSucursal(enlace))
})
test('no acepta HTML agregado al iframe', () => {
    assert.throws(() => interpretarMapaSucursal('<iframe src="https://www.google.com/maps/embed?q=1,2"></iframe><script>alert(1)</script>'))
})
test('decodifica separadores de atributos HTML', () => {
    assert.equal(interpretarMapaSucursal('<iframe src="https://maps.google.com/maps?output=embed&amp;q=-17,-63"></iframe>').latitud, '-17')
})
