import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { Prisma } from '../../../../generated/prisma/client.js'
import { EventoAuditoria } from '../../domain/evento-auditoria.js'
import { conContextoAuditoriaHttp } from '../contexto-auditoria-http.js'
import { insertarAuditoria } from '../insertar-auditoria.js'

const actor = '11111111-1111-4111-8111-111111111111'
function evento(ipAddress: string | null = null, userAgent: string | null = null) {
    return EventoAuditoria.registrar({
        usuarioId: actor, accion: 'Lectura', tablaAfectada: 'rol', registroId: null,
        datosAnteriores: null, datosNuevos: null, ipAddress, userAgent,
        metadata: { operacion: 'iam.roles.read' }, creadoEn: new Date('2026-09-26T14:00:00.000Z'),
    })
}

test('cada solicitud escribe su propia IP y User-Agent, sin mezclarse bajo concurrencia', async () => {
    const registros: [string | null, string | null][] = []
    const tx = {
        $executeRaw: async (_partes: TemplateStringsArray, ...valores: unknown[]) => {
            registros.push([valores[6] as string | null, valores[7] as string | null])
            return 1
        }
    } as unknown as Prisma.TransactionClient
    await Promise.all([
        conContextoAuditoriaHttp({ ipAddress: '198.51.100.10', userAgent: 'Navegador A' }, async () => {
            await new Promise((resolve) => setTimeout(resolve, 5))
            await insertarAuditoria(tx, evento())
        }),
        conContextoAuditoriaHttp({ ipAddress: '2001:db8::10', userAgent: 'Navegador B' }, async () => {
            await insertarAuditoria(tx, evento())
        }),
    ])
    assert.deepEqual(registros, [
        ['2001:db8::10', 'Navegador B'], ['198.51.100.10', 'Navegador A'],
    ])
    await insertarAuditoria(tx, evento())
    assert.deepEqual(registros.at(-1), [null, null])
})

test('un evento con procedencia explícita conserva sus valores', async () => {
    let procedencia: unknown[] = []
    const tx = {
        $executeRaw: async (_partes: TemplateStringsArray, ...valores: unknown[]) => {
            procedencia = valores
            return 1
        }
    } as unknown as Prisma.TransactionClient
    await conContextoAuditoriaHttp({ ipAddress: '198.51.100.10', userAgent: 'Navegador A' },
        () => insertarAuditoria(tx, evento('203.0.113.7', 'Sistema externo')))
    assert.deepEqual(procedencia.slice(6, 8), ['203.0.113.7', 'Sistema externo'])
})