import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { RepositorioSucursales } from '../ports/repositorio-sucursales.js'
import type { RepositorioEmpresas } from '../ports/repositorio-empresas.js'
import type { AutorizacionCrm } from '../acceso-crm.js'
import { Empresa } from '../../domain/empresa.js'
import { Sucursal } from '../../domain/sucursal.js'
import { Ubicacion } from '../../domain/commercial-values.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import { CrearSucursal } from '../use-cases/sucursales/crear-sucursal.js'
import { EditarSucursal } from '../use-cases/sucursales/editar-sucursal.js'

const actor = '11111111-1111-4111-8111-111111111111'
const t0 = new Date('2026-09-28T12:00:00Z')
const autorizacion: AutorizacionCrm = { async ejecutar() {}, async tienePermiso() { return true },
  async tieneRolActivo() { return false } }
const datos = { empresaId: 1n, nombre: 'Central', direccion: 'Calle 1', telefono: '700',
  email: null, horarios: null, mapaIncrustado: null, latitud: null, longitud: null,
  orden: 0, esPrincipal: true }

test('sucursales: no crea para una empresa inactiva', async () => {
  const empresa = new Empresa({ id: 1n, nombre: 'Central', logo: null, estado: 'inactivo',
    fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null } })
  let escrituras = 0
  const empresas = { buscarPorId: async () => empresa } as unknown as RepositorioEmpresas
  const sucursales = { crear: async () => { escrituras++ } } as unknown as RepositorioSucursales
  await assert.rejects(new CrearSucursal(sucursales, empresas, autorizacion)
    .ejecutar(actor, datos), /Empresa no disponible/)
  assert.equal(escrituras, 0)
})

test('sucursales: marcar principal y reordenar utiliza el estado del dominio', async () => {
  const sucursal = new Sucursal({ id: 2n, empresaId: 1n,
    datos: { nombre: 'Central', direccion: 'Calle 1', telefono: '700',
      email: null, horarios: null, mapaIncrustado: null,
      ubicacion: Ubicacion.create(null, null) },
    esPrincipal: false, orden: Orden.create(0), estado: 'activo',
    fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null } })
  let guardados = 0
  const repo = { buscarPorId: async () => sucursal,
    guardar: async () => { guardados++ } } as unknown as RepositorioSucursales
  const editada = await new EditarSucursal(repo, autorizacion, { ahora: () => t0 })
    .ejecutar(actor, 2n, { ...datos, orden: 3 })
  assert.equal(editada.esPrincipal, true)
  assert.equal(editada.orden.value, 3)
  assert.equal(guardados, 1)
})
