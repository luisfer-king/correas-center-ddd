import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { RepositorioLeads } from '../ports/repositorio-leads.js'
import type { RepositorioEmpresas } from '../ports/repositorio-empresas.js'
import type { RepositorioContactosEntrantes } from '../ports/repositorio-contactos-entrantes.js'
import type { AutorizacionCrm } from '../acceso-crm.js'
import { Empresa } from '../../domain/empresa.js'
import { ContactoEntrante } from '../../domain/contacto-entrante.js'
import { Email } from '../../../../shared/domain/value-objects.js'
import { Lead } from '../../domain/lead.js'
import { CrearLead } from '../use-cases/leads/crear-lead.js'
import { AsignarResponsableLead } from '../use-cases/leads/asignar-responsable-lead.js'

const actor = '11111111-1111-4111-8111-111111111111'
const t0 = new Date('2026-09-28T12:00:00Z')
const acceso: AutorizacionCrm = { async ejecutar() {}, async tienePermiso() { return true },
  async tieneRolActivo() { return false } }

test('leads: contacto de otra empresa bloquea la creación', async () => {
  const empresa = new Empresa({ id: 1n, nombre: 'Central', logo: null, estado: 'activo',
    fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null } })
  const contacto = new ContactoEntrante({ id: 2n, empresaId: 3n, nombre: 'Ana',
    empresaDeclarada: null, telefono: '700', email: Email.create('ana@example.com'),
    mensaje: 'Consulta', estado: 'nuevo',
    fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null } })
  let guardados = 0
  const repo = { crear: async () => { guardados++ } } as unknown as RepositorioLeads
  const empresas = { buscarPorId: async () => empresa } as unknown as RepositorioEmpresas
  const contactos = { buscarPorId: async () => contacto } as unknown as RepositorioContactosEntrantes
  await assert.rejects(new CrearLead(repo, empresas, contactos, acceso)
    .ejecutar(actor, { empresaId: 1n, contactoId: 2n, responsableId: null }), /Contacto no disponible/)
  assert.equal(guardados, 0)
})

test('leads: no persiste UUID de responsable inválido', async () => {
  const lead = new Lead({ id: '00000000-0000-4000-8000-000000000001', empresaId: 1n,
    contactoId: null, estado: 'nuevo', responsableId: null,
    creadoEn: t0, actualizadoEn: t0, eliminadoEn: null })
  let guardados = 0
  const repo = { buscarPorId: async () => lead,
    guardar: async () => { guardados++ } } as unknown as RepositorioLeads
  await assert.rejects(new AsignarResponsableLead(repo, acceso, { ahora: () => t0 })
    .ejecutar(actor, lead.id, 'no-es-uuid'), /UUID/)
  assert.equal(guardados, 0)
})
