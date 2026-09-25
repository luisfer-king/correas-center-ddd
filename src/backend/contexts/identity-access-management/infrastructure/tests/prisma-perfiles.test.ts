import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { PrismaClient } from '../../../../generated/prisma/client.js'
import { Perfil } from '../../domain/perfil.js'
import { UsuarioRol } from '../../domain/usuario-rol.js'
import { PrismaPerfiles } from '../prisma-perfiles.js'

const usuarioId = '22222222-2222-4222-8222-222222222222'
const actorId = '11111111-1111-4111-8111-111111111111'
const t0 = new Date('2026-01-01T00:00:00.000Z')
const t1 = new Date('2026-01-01T00:00:01.000Z')

function perfil(): Perfil {
    return new Perfil({
        id: usuarioId, nombreCompleto: 'Cuenta principal', telefono: null, avatarUrl: null,
        email: null, emailVerifiedAt: null, estado: 'activo',
        fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null },
        roles: [new UsuarioRol(usuarioId, 7n, t0)],
    })
}

test('la persistencia no elimina el último super_admin activo', async () => {
    const entidad = perfil()
    entidad.retirarRol(7n, t1)
    let escrituras = 0
    const tx = {
        perfil: {
            findFirst: async () => ({ id: actorId }),
            findUnique: async () => ({ email: null }),
            updateMany: async () => { escrituras++; return { count: 1 } },
        },
        rol: { count: async () => 0, findUnique: async () => ({ id: 7n }) },
        usuarioRol: {
            findUnique: async () => ({ estado: 'activo' }), count: async () => 0,
            upsert: async () => { escrituras++ },
        },
    }
    const db = { $transaction: async (fn: (value: typeof tx) => Promise<unknown>) => fn(tx) } as unknown as PrismaClient
    await assert.rejects(new PrismaPerfiles(db).guardar(entidad, t0, actorId), /último superadministrador/)
    assert.equal(escrituras, 0)
})

test('si el actor perdió su permiso antes del guardado, no se escriben asignaciones', async () => {
    const entidad = perfil()
    entidad.retirarRol(7n, t1)
    let escrituras = 0
    const tx = {
        perfil: {
            findFirst: async () => null,
            updateMany: async () => { escrituras++ },
        },
    }
    const db = { $transaction: async (fn: (value: typeof tx) => Promise<unknown>) => fn(tx) } as unknown as PrismaClient
    await assert.rejects(new PrismaPerfiles(db).guardar(entidad, t0, actorId), /Acceso denegado/)
    assert.equal(escrituras, 0)
})