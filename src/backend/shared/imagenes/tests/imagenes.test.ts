import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mkdtemp, rm, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import sharp from 'sharp'
import Fastify from 'fastify'
import { AlmacenImagenes, normalizarImagen } from '../almacen-imagenes.js'
import { registrarRutasImagenes } from '../registrar-rutas-imagenes.js'
const recursos = ['productos', 'categorias', 'marcas', 'industrias', 'servicios']
async function png() { return sharp({ create: { width: 3, height: 2, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 0 } } }).png().toBuffer() }

test('normaliza una imagen y conserva transparencia', async () => {
  const salida = await normalizarImagen((await png()).toString('base64'))
  const { data, info } = await sharp(salida).raw().toBuffer({ resolveWithObject: true })
  assert.equal(info.channels, 4); assert.equal(data[3], 0)
})
test('rechaza SVG, base64 inválido y archivos corruptos', async () => {
  for (const texto of ['%%%=', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>').toString('base64'), Buffer.from('no es una imagen').toString('base64')])
    await assert.rejects(normalizarImagen(texto))
})
test('almacena cada elemento en su carpeta sin aceptar recorridos de ruta', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'catalogo-img-'))
  try {
    const almacen = new AlmacenImagenes(dir, recursos), b64 = (await png()).toString('base64')
    for (const recurso of recursos) {
      const nombre = await almacen.guardar(recurso, b64)
      assert.equal((await readdir(join(dir, recurso)))[0], nombre)
      assert.ok((await almacen.leer(recurso, nombre)).length)
    }
    await assert.rejects(almacen.guardar('../privado', b64))
    await assert.rejects(almacen.leer('productos', '../secreto.png'))
  } finally { await rm(dir, { recursive: true, force: true }) }
})
test('HTTP: requiere autorización y origen; carga y lectura pública devuelven PNG', async () => {
  const directorio = await mkdtemp(join(tmpdir(), 'catalogo-http-'))
  const app = Fastify()
  registrarRutasImagenes(app, { rutaCarga: '/carga', rutaPublica: '/imagenes', directorio, recursos,
    origen: async (req, reply) => { if (req.headers.origin !== 'http://portal.test') reply.code(403).send({ error: 'Origen denegado' }) },
    autorizar: async (req) => req.headers.authorization === 'permitido',
  })
  try {
    const payload = { base64: (await png()).toString('base64') }
    assert.equal((await app.inject({ method: 'POST', url: '/carga/productos', payload })).statusCode, 403)
    assert.equal((await app.inject({ method: 'POST', url: '/carga/productos', payload, headers: { origin: 'http://portal.test' } })).statusCode, 403)
    assert.equal((await readdir(directorio)).length, 0)
    const carga = await app.inject({ method: 'POST', url: '/carga/productos', payload,
      headers: { origin: 'http://portal.test', authorization: 'permitido' } })
    assert.equal(carga.statusCode, 201)
    const publica = await app.inject({ method: 'GET', url: carga.json().url })
    assert.equal(publica.statusCode, 200); assert.equal(publica.headers['content-type'], 'image/png')
    assert.equal(publica.headers['x-content-type-options'], 'nosniff')
    assert.equal((await app.inject({ method: 'POST', url: '/carga/otro', payload,
      headers: { origin: 'http://portal.test', authorization: 'permitido' } })).statusCode, 404)
  } finally { await app.close(); await rm(directorio, { recursive: true, force: true }) }
})
