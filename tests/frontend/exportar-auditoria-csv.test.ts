import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { EventoAuditoriaIam } from '../../src/frontend/features/iam/api/tipos-iam.js'
import { csvAuditoria } from '../../src/frontend/features/iam/presentation/exportar-auditoria-csv.js'

test('CSV exporta solo la selección y protege valores que Excel interpreta como fórmulas', () => {
    const evento: EventoAuditoriaIam = {
        id: '42', creadoEn: '2026-09-26T13:00:00.000Z', accion: 'Lectura',
        tablaAfectada: 'rol', registroId: '=SUM(1,2)', usuarioId: null,
        ipAddress: null, userAgent: 'usuario;"prueba"',
        datosAnteriores: null, datosNuevos: null, metadata: { operacion: 'iam.roles.read' },
    }
    const csv = csvAuditoria([evento])
    assert.ok(csv.startsWith('\uFEFF"ID";'))
    assert.equal(csv.trimEnd().split('\r\n').length, 2)
    assert.match(csv, /"'=SUM\(1,2\)"/)
    assert.match(csv, /"usuario;""prueba"""/)
    assert.match(csv, /iam\.roles\.read/)
})