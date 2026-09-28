import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Slug } from '../../../../shared/domain/value-objects.js'
import { CodigoPermiso } from '../../domain/iam-values.js'
import { Permiso } from '../../domain/permiso.js'
import { RolPermiso } from '../../domain/rol-permiso.js'
import { Rol } from '../../domain/rol.js'
import type { RepositorioPermisos } from '../ports/repositorio-permisos.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from '../use-cases/autorizacion/exigir-permiso.js'
import { ActivarRol } from '../use-cases/roles/activar-rol.js'
import { AsignarPermisoRol } from '../use-cases/roles/asignar-permiso-rol.js'
import { EliminarRol } from '../use-cases/roles/eliminar-rol.js'
import { InactivarRol } from '../use-cases/roles/inactivar-rol.js'
import { ListarRoles } from '../use-cases/roles/listar-roles.js'
import { ObtenerCapacidadesRoles } from '../use-cases/roles/obtener-capacidades-roles.js'
import { ObtenerRol } from '../use-cases/roles/obtener-rol.js'
import { RetirarPermisoRol } from '../use-cases/roles/retirar-permiso-rol.js'

const actorId = '11111111-1111-4111-8111-111111111111'
const t0 = new Date('2026-01-01T00:00:00.000Z')
const t1 = new Date('2026-01-01T00:00:01.000Z')
const reloj = { ahora: () => t1 }
function rol(esSistema: boolean): Rol {
    return new Rol({
        id: 1n, nombre: 'Administración', slug: Slug.create(esSistema ? 'super_admin' : 'administracion'),
        descripcion: null, esSistema, estado: 'activo',
        fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null },
        permisos: [new RolPermiso(1n, 2n, t0)],
    })
}
function accesoConRoles(slugs: readonly string[], ...claves: string[]): ExigirPermiso {
    return new ExigirPermiso({
        permisosEfectivos: async () => new Set(claves),
        tieneRolActivo: async (_id, permitidos) => permitidos.some((s) => slugs.includes(s)),
    })
}
const acceso = (...claves: string[]) => accesoConRoles(['super_admin'], ...claves)

test('denegación por defecto: consultar roles no llega al repositorio sin permiso', async () => {
    let consultas = 0
    const repositorio = { listar: async () => { consultas++; return [] } } as unknown as RepositorioRoles
    await assert.rejects(new ListarRoles(repositorio, acceso()).ejecutar(actorId), /Acceso denegado/)
    assert.equal(consultas, 0)
})

test('solo super_admin ve roles eliminados en lista y detalle', async () => {
    const vigente = rol(false)
    const eliminado = new Rol({
        id: 2n, nombre: 'Retirado', slug: Slug.create('retirado'),
        descripcion: null, esSistema: false, estado: 'eliminado',
        fechas: { creadoEn: t0, actualizadoEn: t1, eliminadoEn: t1 }, permisos: []
    })
    const repositorio = {
        listar: async () => [vigente, eliminado],
        buscarPorId: async () => eliminado
    } as unknown as RepositorioRoles
    const admin = accesoConRoles(['administrador'], 'iam.roles.read')
    assert.deepEqual((await new ListarRoles(repositorio, admin).ejecutar(actorId)).map((r) => r.id), [1n])
    await assert.rejects(new ObtenerRol(repositorio, admin).ejecutar(actorId, 2n), /Rol no encontrado/)
    assert.equal((await new ListarRoles(repositorio, acceso('iam.roles.read')).ejecutar(actorId)).length, 2)
    assert.equal((await new ObtenerRol(repositorio, acceso('iam.roles.read')).ejecutar(actorId, 2n)).id, 2n)
})

test('el rol super_admin está oculto por lista e ID a todos los demás', async () => {
    const sistema = rol(true)
    const repositorio = { listar: async () => [sistema], buscarPorId: async () => sistema } as unknown as RepositorioRoles
    const admin = accesoConRoles(['administrador'], 'iam.roles.read')
    assert.deepEqual(await new ListarRoles(repositorio, admin).ejecutar(actorId), [])
    await assert.rejects(new ObtenerRol(repositorio, admin).ejecutar(actorId, sistema.id), /Rol no encontrado/)
    assert.deepEqual(await new ListarRoles(repositorio, acceso('iam.roles.read')).ejecutar(actorId), [sistema])
})

test('baja requiere rol administrador vigente y permiso delete', async () => {
    let escrituras = 0
    const repositorio = {
        buscarPorId: async () => rol(false),
        guardar: async () => { escrituras++ }
    } as unknown as RepositorioRoles
    await assert.rejects(new EliminarRol(repositorio,
        accesoConRoles(['operador'], 'iam.roles.delete'), reloj).ejecutar(actorId, 1n), /Acceso denegado/)
    await assert.rejects(new EliminarRol(repositorio,
        accesoConRoles(['administrador'], 'iam.roles.read'), reloj).ejecutar(actorId, 1n), /Acceso denegado/)
    await new EliminarRol(repositorio,
        accesoConRoles(['administrador'], 'iam.roles.delete'), reloj).ejecutar(actorId, 1n)
    assert.equal(escrituras, 1)
})

test('capacidades de interfaz reflejan rol vigente y permiso, sin concederlos', async () => {
    const operador = await new ObtenerCapacidadesRoles(accesoConRoles(['operador'],
        'iam.roles.read', 'iam.roles.delete')).ejecutar(actorId)
    assert.equal(operador.verEliminados, false)
    assert.equal(operador.eliminarRol, false)
    const admin = await new ObtenerCapacidadesRoles(accesoConRoles(['administrador'],
        'iam.roles.read', 'iam.roles.delete')).ejecutar(actorId)
    assert.equal(admin.verEliminados, false)
    assert.equal(admin.eliminarRol, true)
})

test('el rol del sistema no puede eliminarse, incluso si el actor tiene permiso de baja', async () => {
    const protegido = rol(true)
    let escrituras = 0
    const repositorio = {
        buscarPorId: async () => protegido,
        guardar: async () => { escrituras++ },
    } as unknown as RepositorioRoles
    await assert.rejects(new EliminarRol(repositorio, acceso('iam.roles.delete'), reloj)
        .ejecutar(actorId, 1n), /Rol del sistema protegido/)
    assert.equal(escrituras, 0)
    assert.equal(protegido.estado, 'activo')
})

test('inactivar y reactivar conserva vínculos; eliminado no puede reactivarse', async () => {
    const editable = rol(false)
    const asignacion = editable.asignacionesPermisos[0]
    let guardados = 0
    const repositorio = {
        buscarPorId: async () => editable,
        guardar: async () => { guardados++ },
    } as unknown as RepositorioRoles
    const autorizar = acceso('iam.roles.update', 'iam.roles.delete')
    await new InactivarRol(repositorio, autorizar, reloj).ejecutar(actorId, 1n)
    assert.equal(editable.estado, 'inactivo')
    assert.equal(editable.asignacionesPermisos[0], asignacion)
    await new ActivarRol(repositorio, autorizar, reloj).ejecutar(actorId, 1n)
    assert.equal(editable.estado, 'activo')
    assert.equal(editable.asignacionesPermisos[0], asignacion)
    await new EliminarRol(repositorio, autorizar, reloj).ejecutar(actorId, 1n)
    assert.equal(editable.estado, 'eliminado')
    await assert.rejects(new ActivarRol(repositorio, autorizar, reloj).ejecutar(actorId, 1n), /eliminado|inactivo/i)
    assert.equal(guardados, 3)
})

test('el rol de sistema no puede inactivarse', async () => {
    const sistema = rol(true)
    let guardados = 0
    const repositorio = { buscarPorId: async () => sistema, guardar: async () => { guardados++ } } as unknown as RepositorioRoles
    await assert.rejects(new InactivarRol(repositorio, acceso('iam.roles.update'), reloj)
        .ejecutar(actorId, 1n), /Rol del sistema protegido/)
    assert.equal(guardados, 0)
})

test('retirar y reasignar un permiso reutiliza la fila y requiere autorización vigente', async () => {
    const editable = rol(false)
    const fila = editable.asignacionesPermisos[0]
    let escrituras = 0
    const repositorio = {
        buscarPorId: async () => editable,
        guardar: async () => { escrituras++ },
    } as unknown as RepositorioRoles
    const permiso = new Permiso({
        id: 2n, nombre: 'Consultar', slug: CodigoPermiso.create('iam.roles.read'),
        grupo: 'iam', descripcion: null, estado: 'activo',
        fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null },
    })
    const permisos = { buscarPorId: async () => permiso } as unknown as RepositorioPermisos
    const autorizar = acceso('iam.roles.permisos.assign')
    await new RetirarPermisoRol(repositorio, autorizar, reloj).ejecutar(actorId, 1n, 2n)
    assert.equal(fila.estado, 'inactivo')
    assert.equal(editable.permisosAsignados.length, 0)
    await new AsignarPermisoRol(repositorio, permisos, autorizar, reloj).ejecutar(actorId, 1n, 2n)
    assert.equal(fila.estado, 'activo')
    assert.equal(editable.asignacionesPermisos[0], fila)
    assert.equal(escrituras, 2)
})

test('no asigna un permiso inactivo ni retira vínculos del rol del sistema', async () => {
    const editable = rol(false)
    const sistema = rol(true)
    let escrituras = 0
    const repositorio = {
        buscarPorId: async (id: bigint) => id === 1n ? editable : sistema,
        guardar: async () => { escrituras++ },
    } as unknown as RepositorioRoles
    const permisoInactivo = new Permiso({
        id: 3n, nombre: 'Inactivo', slug: CodigoPermiso.create('iam.inactivo.read'),
        grupo: 'iam', descripcion: null, estado: 'inactivo',
        fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null },
    })
    const permisos = { buscarPorId: async () => permisoInactivo } as unknown as RepositorioPermisos
    const autorizar = acceso('iam.roles.permisos.assign')
    await assert.rejects(new AsignarPermisoRol(repositorio, permisos, autorizar, reloj)
        .ejecutar(actorId, 1n, 3n), /no disponible/)
    await assert.rejects(new RetirarPermisoRol({
        buscarPorId: async () => sistema, guardar: async () => { escrituras++ },
    } as unknown as RepositorioRoles, autorizar, reloj).ejecutar(actorId, 1n, 2n), /rol del sistema/)
    assert.equal(escrituras, 0)
    assert.equal(editable.asignacionesPermisos.length, 1)
    assert.equal(sistema.permisosAsignados.length, 1)
})
