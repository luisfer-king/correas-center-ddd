import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { Prisma } from '../../../../generated/prisma/client.js'
import { exigirPermisoEnTransaccion } from '../exigir-permiso-en-transaccion.js'

test('la baja comprueba permiso y rol administrativo activo en la misma consulta', async () => {
    let condiciones: unknown
    const tx = {
        perfil: {
            findFirst: async (argumentos: { where: { AND: unknown[] } }) => {
                condiciones = argumentos.where.AND
                return null
            }
        }
    } as unknown as Prisma.TransactionClient
    await assert.rejects(exigirPermisoEnTransaccion(tx,
        '11111111-1111-4111-8111-111111111111', 'iam.roles.delete',
        ['super_admin', 'administrador', 'admin']), /Acceso denegado/)
    assert.equal(Array.isArray(condiciones), true)
    assert.equal((condiciones as unknown[]).length, 2)
    const where = JSON.stringify(condiciones)
    assert.match(where, /iam\.roles\.delete/)
    assert.match(where, /super_admin/)
    assert.match(where, /administrador/)
})