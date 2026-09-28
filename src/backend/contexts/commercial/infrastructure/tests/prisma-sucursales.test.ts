import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { PrismaClient } from '../../../../generated/prisma/client.js'
import { Orden } from '../../../../shared/domain/value-objects.js'
import { Ubicacion } from '../../domain/commercial-values.js'
import { PrismaSucursales } from '../prisma-sucursales.js'

const actor = '11111111-1111-4111-8111-111111111111'

test('sucursal principal: bloquea y desmarca las otras dentro de la misma transacción', async () => {
    const pasos: string[] = []
    const fecha = new Date('2026-09-28T12:00:00Z')
    const tx = {
        perfil: { findFirst: async () => { pasos.push('permiso'); return { id: actor } } },
        empresa: { findFirst: async () => { pasos.push('empresa'); return { id: 1n } } },
        $queryRaw: async () => { pasos.push('bloqueo'); return [] },
        sucursal: {
            updateMany: async () => { pasos.push('desmarcar'); return { count: 1 } },
            create: async () => {
                pasos.push('crear'); return {
                    id: 2n, empresaId: 1n,
                    nombre: 'Centro', direccion: 'Calle 1', telefono: '700', email: null,
                    horarios: null, mapaIncrustado: null, latitud: null, longitud: null,
                    esPrincipal: true, orden: 0, estado: 'activo', creadoEn: fecha,
                    actualizadoEn: fecha, eliminadoEn: null
                }
            },
        },
        $executeRaw: async () => { pasos.push('auditoria'); return 1 },
    }
    const db = { $transaction: async (fn: (scope: typeof tx) => Promise<unknown>) => fn(tx) } as unknown as PrismaClient
    const sucursal = await new PrismaSucursales(db).crear({
        empresaId: 1n,
        datos: {
            nombre: 'Centro', direccion: 'Calle 1', telefono: '700', email: null,
            horarios: null, mapaIncrustado: null, ubicacion: Ubicacion.create(null, null)
        },
        esPrincipal: true, orden: Orden.create(0),
    }, actor)
    assert.equal(sucursal.esPrincipal, true)
    assert.deepEqual(pasos, ['permiso', 'empresa', 'bloqueo', 'desmarcar', 'crear', 'auditoria'])
})
