import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { PrismaClient } from '../../../../generated/prisma/client.js'
import { PrismaMarcasProducto } from '../prisma-marcas-producto.js'
const actor = '11111111-1111-4111-8111-111111111111'
test('lote reutiliza vínculo inactivo, crea nuevo y desasigna sin borrar', async () => {
    const pasos: string[] = []
    const vinculos = [{ id: 1n, productoId: 10n, marcaId: 2n, estado: 'inactivo' }, { id: 2n, productoId: 10n, marcaId: 4n, estado: 'activo' }]
    const tx = {
        perfil: { findFirst: async () => ({ id: actor }) }, producto: { findFirst: async () => ({ id: 10n }) },
        marca: { findFirst: async () => ({ id: 2n }) },
        $queryRaw: async () => { pasos.push('bloqueo'); return [] }, $executeRaw: async () => { pasos.push('auditoria'); return 1 },
        productoMarca: {
            findFirst: async ({ where }: { where: { marcaId: bigint } }) => vinculos.find(v => v.marcaId === where.marcaId) ?? null,
            update: async ({ where, data }: { where: { id: bigint }; data: { estado: string } }) => {
                const fila = vinculos.find(v => v.id === where.id)!; fila.estado = data.estado; pasos.push('actualizar'); return fila
            },
            create: async ({ data }: { data: { productoId: bigint; marcaId: bigint; estado: string } }) => {
                const fila = { ...data, id: 3n }; vinculos.push(fila); pasos.push('crear'); return fila
            },
        },
    }
    const db = {
        $transaction: async (fn: (t: typeof tx) => Promise<void>, opciones: unknown) => {
            assert.deepEqual(opciones, { isolationLevel: 'Serializable' }); return fn(tx)
        }
    } as unknown as PrismaClient
    await new PrismaMarcasProducto(db).actualizar(10n, [2n, 3n], [4n], actor)
    assert.equal(vinculos.length, 3)
    assert.equal(vinculos.find(v => v.marcaId === 2n)?.estado, 'activo')
    assert.equal(vinculos.find(v => v.marcaId === 3n)?.estado, 'activo')
    assert.equal(vinculos.find(v => v.marcaId === 4n)?.estado, 'inactivo')
    assert.equal(pasos[0], 'bloqueo'); assert.equal(pasos.filter(p => p === 'auditoria').length, 3)
})
test('una marca inválida aborta antes de cualquier escritura del lote', async () => {
    let escrituras = 0
    const tx = {
        perfil: { findFirst: async () => ({ id: actor }) }, producto: { findFirst: async () => ({ id: 10n }) },
        marca: { findFirst: async ({ where }: { where: { id: bigint } }) => where.id === 2n ? { id: 2n } : null },
        $queryRaw: async () => [], productoMarca: { create: async () => { escrituras++ } }, $executeRaw: async () => { escrituras++ }
    }
    const db = { $transaction: async (fn: (t: typeof tx) => Promise<void>) => fn(tx) } as unknown as PrismaClient
    await assert.rejects(new PrismaMarcasProducto(db).actualizar(10n, [2n, 999n], [], actor), /Referencia no disponible/)
    assert.equal(escrituras, 0)
})
