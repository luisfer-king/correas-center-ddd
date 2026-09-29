import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { RepositorioSuscriptores } from '../ports/repositorio-suscriptores.js'
import type { RepositorioEmpresas } from '../ports/repositorio-empresas.js'
import type { AutorizacionCrm } from '../acceso-crm.js'
import { Empresa } from '../../domain/empresa.js'
import { Suscriptor } from '../../domain/suscriptor.js'
import { Email } from '../../../../shared/domain/value-objects.js'
import { CrearSuscriptor } from '../use-cases/suscriptores/crear-suscriptor.js'
import { DesuscribirSuscriptor } from '../use-cases/suscriptores/desuscribir-suscriptor.js'

const actor = '11111111-1111-4111-8111-111111111111'
const t0 = new Date('2026-09-28T12:00:00Z')
const t1 = new Date('2026-09-28T12:00:01Z')
const acceso: AutorizacionCrm = { async ejecutar() {}, async tienePermiso() { return true },
  async tieneRolActivo() { return false } }

test('suscriptores: email usado por registro eliminado sigue ocupado por UNIQUE', async () => {
  const empresa = new Empresa({ id: 1n, nombre: 'Central', logo: null, estado: 'activo',
    fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null } })
  let buscarEliminados = false
  let guardados = 0
  const repositorio = { buscarPorEmail: async (_email: Email, incluir: boolean) => {
    buscarEliminados = incluir; return { id: 2n }
  }, crear: async () => { guardados++ } } as unknown as RepositorioSuscriptores
  const empresas = { buscarPorId: async () => empresa } as unknown as RepositorioEmpresas
  await assert.rejects(new CrearSuscriptor(repositorio, empresas, acceso)
    .ejecutar(actor, { empresaId: 1n, email: 'CLIENTE@example.com', nombre: null }), /ya registrado/)
  assert.equal(buscarEliminados, true)
  assert.equal(guardados, 0)
})

test('suscriptores: desuscripción repetida no genera una segunda escritura', async () => {
  const suscriptor = new Suscriptor({ id: 1n, empresaId: 1n, email: Email.create('c@example.com'),
    nombre: null, estado: 'activo', emailVerificadoEn: null,
    fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null } })
  let guardados = 0
  const repo = { buscarPorId: async () => suscriptor,
    guardar: async () => { guardados++ } } as unknown as RepositorioSuscriptores
  const caso = new DesuscribirSuscriptor(repo, acceso, { ahora: () => t1 })
  await caso.ejecutar(actor, 1n)
  await caso.ejecutar(actor, 1n)
  assert.equal(suscriptor.estado, 'desuscrito')
  assert.equal(guardados, 1)
})
