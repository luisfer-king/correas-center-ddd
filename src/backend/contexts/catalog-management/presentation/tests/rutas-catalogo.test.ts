import assert from 'node:assert/strict'
import { test } from 'node:test'
import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import type { CasosIam } from '../../../identity-access-management/infrastructure/componer-iam.js'
import type { CasosCatalogo } from '../../infrastructure/componer-catalogo.js'
import { Marca } from '../../domain/marca.js'
import { Orden, Slug } from '../../../../shared/domain/value-objects.js'
import { registrarRutasCatalogo } from '../registrar-rutas-catalogo.js'
const actor = '11111111-1111-4111-8111-111111111111'
const origen = 'http://localhost:5173'
const fecha = new Date('2026-09-20T00:00:00.000Z')
const marca = new Marca({ id: 1n, nombre: 'SKF', slug: Slug.create('skf'), logo: null,
  orden: Orden.create(0), estado: 'activo', fechas: { creadoEn: fecha, actualizadoEn: fecha, eliminadoEn: null } })

test('diez recursos, sesión, origen, esquema y auditoría de lectura', async () => {
  const lecturas: string[] = []
  const listados: string[] = []
  const base = { listar: { ejecutar: async (_actor: string, _pagina: number) => { listados.push(_actor); return [] } },
    obtener: { ejecutar: async () => marca }, crear: { ejecutar: async () => marca }, editar: { ejecutar: async () => marca },
    reordenar: { ejecutar: async () => marca }, activar: { ejecutar: async () => {} },
    inactivar: { ejecutar: async () => {} }, eliminar: { ejecutar: async () => {} } }
  const claves = ['productos','categorias','marcas','tipos-atributo','atributos-tecnicos','industrias','servicios',
    'asignaciones-marca','asignaciones-atributo','asignaciones-industria']
  const catalogo = { ...Object.fromEntries(claves.map(k => [k, base])), marcas: { ...base, listar: { ejecutar: async () => { listados.push(actor); return [marca] } } },
    registrarLectura: { ejecutar: async (_actor: string, recurso: string) => { lecturas.push(recurso) } },
    capacidades: { ejecutar: async () => ({ verEliminados: false, recursos: {} }) } } as unknown as CasosCatalogo
  const iam = { comprobar: { ejecutar: async (token: string) => {
    if (token !== 'valida') throw new Error('Sesión inválida')
    return { usuarioId: actor }
  } } } as unknown as CasosIam
  const app = Fastify()
  await app.register(cookie)
  await app.register(async scope => registrarRutasCatalogo(scope, catalogo, iam, { origen, cookie: 'portal', secure: false }))
  try {
    assert.equal((await app.inject({ method: 'GET', url: '/api/portal/catalogo/marcas' })).statusCode, 401)
    for (const recurso of claves) {
      const query = recurso.startsWith('asignaciones-') ? '?'+ (recurso === 'asignaciones-marca' ? 'productoId' : recurso === 'asignaciones-atributo' ? 'categoriaId' : 'industriaId') + '=1' : ''
      const res = await app.inject({ method: 'GET', url: `/api/portal/catalogo/${recurso}${query}`, headers: { cookie: 'portal=valida' } })
      assert.equal(res.statusCode, 200, recurso)
    }
    assert.equal(listados.length, 10)
    assert.equal(lecturas.length, 10)
    assert.equal((await app.inject({ method: 'GET', url: '/api/portal/catalogo/asignaciones-marca', headers: { cookie: 'portal=valida' } })).statusCode, 400)
    const url = '/api/portal/catalogo/marcas'
    assert.equal((await app.inject({ method: 'POST', url, payload: { nombre: 'SKF', slug: 'skf', logo: null, orden: 0 },
      headers: { cookie: 'portal=valida', origin: 'https://otro.example', 'x-portal-request': '1' } })).statusCode, 403)
    assert.equal((await app.inject({ method: 'POST', url, payload: { nombre: '', slug: 'skf', logo: null, orden: 0 },
      headers: { cookie: 'portal=valida', origin: origen, 'x-portal-request': '1' } })).statusCode, 400)
    const creada = await app.inject({ method: 'POST', url, payload: { nombre: 'SKF', slug: 'skf', logo: null, orden: 0 },
      headers: { cookie: 'portal=valida', origin: origen, 'x-portal-request': '1' } })
    assert.equal(creada.statusCode, 201)
    assert.equal(creada.json().id, '1')
    assert.equal(creada.json().slug, 'skf')
  } finally { await app.close() }
})
