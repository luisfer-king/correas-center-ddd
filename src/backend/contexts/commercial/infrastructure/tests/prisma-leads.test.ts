import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { PrismaClient } from '../../../../generated/prisma/client.js'
import { PrismaLeads } from '../prisma-leads.js'

const actor = '11111111-1111-4111-8111-111111111111'

test('lead: contacto de otra empresa impide la creación y la auditoría', async () => {
    let escrituras = 0
    const tx = {
        perfil: { findFirst: async () => ({ id: actor }) },
        empresa: { findFirst: async () => ({ id: 1n }) },
        contactoEntrante: { findFirst: async () => null },
        lead: { create: async () => { escrituras++ } },
        $executeRaw: async () => { escrituras++ }
    }
    const db = { $transaction: async (fn: (scope: typeof tx) => Promise<unknown>) => fn(tx) } as unknown as PrismaClient
    await assert.rejects(new PrismaLeads(db).crear({
        empresaId: 1n,
        contactoId: 10n, responsableId: null
    }, actor), /Contacto no disponible/)
    assert.equal(escrituras, 0)
})
