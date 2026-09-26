import assert from 'node:assert/strict'
import { test } from 'node:test'
import { EventoAuditoria } from '../../domain/evento-auditoria.js'
import type { RepositorioAuditoria } from '../ports/repositorio-auditoria.js'
import { ExigirPermiso } from '../use-cases/exigir-permiso.js'
import { ListarAuditoria } from '../use-cases/listar-auditoria.js'

const actor = '11111111-1111-4111-8111-111111111111'
const acceso = (permitido: boolean) => new ExigirPermiso({
    permisosEfectivos: async () => new Set(permitido ? ['iam.auditoria.read'] : []),
    tieneRolActivo: async () => false,
})
const evento = EventoAuditoria.rehidratar({
    id: 15n, usuarioId: actor, accion: 'Edición', tablaAfectada: 'usuario_rol',
    registroId: actor, datosAnteriores: null, datosNuevos: null,
    ipAddress: null, userAgent: null, metadata: { operacion: 'iam.usuarios.roles.assign' },
    creadoEn: new Date('2026-01-01T00:00:00.000Z'),
})

test('auditoría niega lectura sin permiso y no consulta el repositorio', async () => {
    let consultas = 0
    const repositorio = { listar: async () => { consultas++; return [evento] } } as unknown as RepositorioAuditoria
    await assert.rejects(new ListarAuditoria(repositorio, acceso(false)).ejecutar(actor, 26), /Acceso denegado/)
    assert.equal(consultas, 0)
})

test('auditoría transmite límite y cursor al repositorio para paginar', async () => {
    let parametros: [number, bigint | null] | null = null
    const repositorio = {
        listar: async (limite: number, antesDeId: bigint | null) => {
            parametros = [limite, antesDeId]
            return [evento]
        }
    } as unknown as RepositorioAuditoria
    const resultado = await new ListarAuditoria(repositorio, acceso(true)).ejecutar(actor, 26, 16n)
    assert.deepEqual(parametros, [26, 16n])
    assert.deepEqual(resultado, [evento])
})