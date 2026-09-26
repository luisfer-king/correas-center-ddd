import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { PrismaClient } from '../../../../generated/prisma/client.js'
import { PrismaAuditoria } from '../prisma-auditoria.js'

test('el rango de fechas y cursor se aplican en SQL con valores parametrizados antes del límite', async () => {
    let sql = ''
    let valores: readonly unknown[] = []
    const db = {
        $queryRaw: async (consulta: { sql: string; values: readonly unknown[] }) => {
            sql = consulta.sql
            valores = consulta.values
            return []
        }
    } as unknown as PrismaClient
    const desde = new Date('2026-09-26T04:00:00.000Z')
    const hasta = new Date('2026-09-27T04:00:00.000Z')
    assert.deepEqual(await new PrismaAuditoria(db).listar(26, 50n, { desde, hasta }), [])
    assert.match(sql, /WHERE TRUE.*id <.*creado_en >=.*creado_en <.*ORDER BY id DESC LIMIT/s)
    assert.deepEqual(valores, [50n, desde, hasta, 26])
})