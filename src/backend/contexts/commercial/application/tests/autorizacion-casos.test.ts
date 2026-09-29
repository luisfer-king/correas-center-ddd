import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { AutorizacionCrm } from '../acceso-crm.js'
import { ObtenerCapacidadesCrm } from '../use-cases/autorizacion/obtener-capacidades-crm.js'

test('capacidades CRM reflejan permisos de BD y no confunden gestión con lectura', async () => {
  const autorizacion: AutorizacionCrm = {
    async ejecutar() {},
    async tienePermiso(_actor, codigo) { return codigo === 'crm.empresas.manage' },
    async tieneRolActivo() { return false },
  }
  const capacidades = await new ObtenerCapacidadesCrm(autorizacion)
    .ejecutar('11111111-1111-4111-8111-111111111111')
  assert.equal(capacidades.verEliminados, false)
  assert.deepEqual(capacidades.recursos.empresas, { leer: false, gestionar: true })
  assert.deepEqual(capacidades.recursos.leads, { leer: false, gestionar: false })
})
