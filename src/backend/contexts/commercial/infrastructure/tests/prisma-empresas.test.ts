import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { PrismaClient } from '../../../../generated/prisma/client.js'
import { Empresa } from '../../domain/empresa.js'
import { PrismaEmpresas } from '../prisma-empresas.js'

const actor = '11111111-1111-4111-8111-111111111111'
const antes = new Date('2026-09-28T12:00:00Z')
const despues = new Date('2026-09-28T12:00:01Z')

test('empresa: permiso revocado dentro de la transacción impide crear y auditar', async () => {
    let escrituras = 0
    const tx = {
        perfil: { findFirst: async () => null },
        empresa: { create: async () => { escrituras++ } },
        $executeRaw: async () => { escrituras++ }
    }
    const db = { $transaction: async (fn: (scope: typeof tx) => Promise<unknown>) => fn(tx) } as unknown as PrismaClient
    await assert.rejects(new PrismaEmpresas(db).crear({ nombre: 'Correas Center', logo: null }, actor),
        /Acceso denegado/)
    assert.equal(escrituras, 0)
})

test('empresa: versión obsoleta impide escritura auditada', async () => {
    const entidad = new Empresa({
        id: 1n, nombre: 'Central', logo: null, estado: 'activo',
        fechas: { creadoEn: antes, actualizadoEn: antes, eliminadoEn: null }
    })
    entidad.editar('Central SCZ', null, despues)
    let auditorias = 0
    const tx = {
        perfil: { findFirst: async () => ({ id: actor }) },
        empresa: {
            findUnique: async () => ({ estado: 'activo', eliminadoEn: null }),
            updateMany: async () => ({ count: 0 })
        },
        $executeRaw: async () => { auditorias++ }
    }
    const db = { $transaction: async (fn: (scope: typeof tx) => Promise<unknown>) => fn(tx) } as unknown as PrismaClient
    await assert.rejects(new PrismaEmpresas(db).guardar(entidad, antes, actor), /modificada/)
    assert.equal(auditorias, 0)
})
