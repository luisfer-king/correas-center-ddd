import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { RepositorioContactosEntrantes } from '../ports/repositorio-contactos-entrantes.js'
import type { AutorizacionCrm } from '../acceso-crm.js'
import { ContactoEntrante } from '../../domain/contacto-entrante.js'
import { Email } from '../../../../shared/domain/value-objects.js'
import { MarcarContactoRespondido } from '../use-cases/contactos/marcar-contacto-respondido.js'
import { ArchivarContacto } from '../use-cases/contactos/archivar-contacto.js'

const actor = '11111111-1111-4111-8111-111111111111'
const t0 = new Date('2026-09-28T12:00:00Z')
const t1 = new Date('2026-09-28T12:00:01Z')
function contacto() { return new ContactoEntrante({ id: 1n, empresaId: 2n, nombre: 'Ana',
  empresaDeclarada: null, telefono: '700', email: Email.create('ana@example.com'),
  mensaje: 'Consulta original', estado: 'nuevo',
  fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null } }) }

test('contactos: solo nuevo se marca respondido y mantiene su mensaje original', async () => {
  const entidad = contacto()
  let guardados = 0
  const repo = { buscarPorId: async () => entidad,
    guardar: async () => { guardados++ } } as unknown as RepositorioContactosEntrantes
  const acceso: AutorizacionCrm = { async ejecutar() {}, async tienePermiso() { return true },
    async tieneRolActivo() { return false } }
  await new MarcarContactoRespondido(repo, acceso, { ahora: () => t1 }).ejecutar(actor, 1n)
  assert.equal(entidad.estado, 'respondido')
  assert.equal(entidad.mensaje, 'Consulta original')
  await assert.rejects(new MarcarContactoRespondido(repo, acceso, { ahora: () => t1 })
    .ejecutar(actor, 1n), /nuevo/)
  assert.equal(guardados, 1)
  await new ArchivarContacto(repo, acceso, { ahora: () => t1 }).ejecutar(actor, 1n)
  assert.equal(entidad.estado, 'archivado')
})
