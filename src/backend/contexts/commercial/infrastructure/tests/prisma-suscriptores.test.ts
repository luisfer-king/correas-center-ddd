import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { PrismaClient } from '../../../../generated/prisma/client.js'
import { Email } from '../../../../shared/domain/value-objects.js'
import { PrismaSuscriptores } from '../prisma-suscriptores.js'

const actor = '11111111-1111-4111-8111-111111111111'

test('suscriptor: alta administrativa conserva email sin verificar', async () => {
    const fecha = new Date('2026-09-28T12:00:00Z')
    let data: Record<string, unknown> = {}
    const tx = {
        perfil: { findFirst: async () => ({ id: actor }) },
        empresa: { findFirst: async () => ({ id: 1n }) },
        suscriptor: {
            create: async (arg: { data: Record<string, unknown> }) => {
                data = arg.data
                return {
                    ...arg.data, id: 5n, emailVerificadoEn: null, eliminadoEn: null,
                    creadoEn: fecha, actualizadoEn: fecha
                }
            }
        }, $executeRaw: async () => 1
    }
    const db = { $transaction: async (fn: (scope: typeof tx) => Promise<unknown>) => fn(tx) } as unknown as PrismaClient
    const creado = await new PrismaSuscriptores(db).crear({
        empresaId: 1n,
        email: Email.create('CLIENTE@example.com'), nombre: null
    }, actor)
    assert.equal(data.emailVerificadoEn, null)
    assert.equal(creado.email.value, 'cliente@example.com')
})
