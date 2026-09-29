import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { PrismaClient } from '../../../../generated/prisma/client.js'
import { Email } from '../../../../shared/domain/value-objects.js'
import { ContactoEntrante } from '../../domain/contacto-entrante.js'
import { PrismaContactosEntrantes } from '../prisma-contactos-entrantes.js'

const actor = '11111111-1111-4111-8111-111111111111'

test('contacto: respuesta actualiza solo el estado y las fechas, sin reescribir el mensaje', async () => {
    const antes = new Date('2026-09-28T12:00:00Z')
    const despues = new Date('2026-09-28T12:00:01Z')
    const contacto = new ContactoEntrante({
        id: 1n, empresaId: 2n, nombre: 'Ana',
        empresaDeclarada: null, telefono: '700', email: Email.create('ana@example.com'),
        mensaje: 'Consulta privada', estado: 'nuevo',
        fechas: { creadoEn: antes, actualizadoEn: antes, eliminadoEn: null }
    })
    contacto.marcarRespondido(despues)
    let actualizacion: Record<string, unknown> = {}
    const tx = {
        perfil: { findFirst: async () => ({ id: actor }) },
        contactoEntrante: {
            findUnique: async () => ({ empresaId: 2n, estado: 'nuevo', eliminadoEn: null }),
            updateMany: async (arg: { data: Record<string, unknown> }) => {
                actualizacion = arg.data; return { count: 1 }
            }
        },
        $executeRaw: async () => 1
    }
    const db = { $transaction: async (fn: (scope: typeof tx) => Promise<unknown>) => fn(tx) } as unknown as PrismaClient
    await new PrismaContactosEntrantes(db).guardar(contacto, antes, actor)
    assert.deepEqual(Object.keys(actualizacion).sort(), ['actualizadoEn', 'eliminadoEn', 'estado'])
    assert.equal(actualizacion.estado, 'respondido')
})

test('contacto: baja lógica se registra como Eliminación aunque el estado siga siendo nuevo', async () => {
    const antes = new Date('2026-09-28T12:00:00Z')
    const contacto = new ContactoEntrante({
        id: 1n, empresaId: 2n, nombre: 'Ana',
        empresaDeclarada: null, telefono: '700', email: Email.create('ana@example.com'),
        mensaje: 'Consulta privada', estado: 'nuevo',
        fechas: { creadoEn: antes, actualizadoEn: antes, eliminadoEn: null }
    })
    contacto.eliminar(new Date('2026-09-28T12:00:01Z'))
    let accion = ''
    const tx = {
        perfil: { findFirst: async () => ({ id: actor }) },
        contactoEntrante: {
            findUnique: async () => ({ empresaId: 2n, estado: 'nuevo', eliminadoEn: null }),
            updateMany: async () => ({ count: 1 })
        },
        $executeRaw: async (_strings: TemplateStringsArray, ...values: unknown[]) => {
            accion = String(values.find((value) => value === 'Eliminación') ?? '')
            return 1
        }
    }
    const db = { $transaction: async (fn: (scope: typeof tx) => Promise<unknown>) => fn(tx) } as unknown as PrismaClient
    await new PrismaContactosEntrantes(db).guardar(contacto, antes, actor)
    assert.equal(accion, 'Eliminación')
})
