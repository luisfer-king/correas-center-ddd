import assert from 'node:assert/strict'
import { test } from 'node:test'
import { EventoAuditoria } from '../../domain/evento-auditoria.js'
import type { RepositorioAuditoria } from '../ports/repositorio-auditoria.js'
import { ListarAuditoria } from '../use-cases/auditoria/listar-auditoria.js'
import { RegistrarLecturaIam } from '../use-cases/auditoria/registrar-lectura-iam.js'
import { ExigirPermiso } from '../use-cases/autorizacion/exigir-permiso.js'

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
    let parametros: [number, bigint | null, Date | null, Date | null] | null = null
    const repositorio = {
        listar: async (limite: number, antesDeId: bigint | null,
            rango?: { desde: Date | null; hasta: Date | null }) => {
            parametros = [limite, antesDeId, rango?.desde ?? null, rango?.hasta ?? null]
            return [evento]
        }
    } as unknown as RepositorioAuditoria
    const desde = new Date('2026-01-01T04:00:00.000Z')
    const hasta = new Date('2026-01-02T04:00:00.000Z')
    const resultado = await new ListarAuditoria(repositorio, acceso(true)).ejecutar(actor, 26, 16n, { desde, hasta })
    assert.deepEqual(parametros, [26, 16n, desde, hasta])
    assert.deepEqual(resultado, [evento])
    await assert.rejects(new ListarAuditoria(repositorio, acceso(true))
        .ejecutar(actor, 26, 16n, { desde: hasta, hasta: desde }), /Rango de fechas inválido/)
})

test('la lectura autorizada registra actor y recurso sin datos sensibles', async () => {
    let registrado: EventoAuditoria | null = null
    const repositorio = { registrar: async (e: EventoAuditoria) => { registrado = e } } as unknown as RepositorioAuditoria
    await new RegistrarLecturaIam(repositorio, { ahora: () => new Date('2026-01-01T00:00:00Z') })
        .ejecutar(actor, 'usuarios', '22222222-2222-4222-8222-222222222222')
    assert.equal(registrado!.accion, 'Lectura')
    assert.equal(registrado!.tablaAfectada, 'perfil')
    assert.equal(registrado!.usuarioId, actor)
    assert.deepEqual(registrado!.metadata, { operacion: 'iam.usuarios.read' })
    assert.equal(registrado!.datosNuevos, null)
})