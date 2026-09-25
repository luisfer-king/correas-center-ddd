import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Slug } from '../../../../shared/domain/value-objects.js'
import { CodigoPermiso } from '../../domain/iam-values.js'
import { Permiso } from '../../domain/permiso.js'
import { RolPermiso } from '../../domain/rol-permiso.js'
import { Rol } from '../../domain/rol.js'
import type { RepositorioPermisos } from '../ports/repositorio-permisos.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { AsignarPermisoRol } from '../use-cases/asignar-permiso-rol.js'
import { EliminarRol } from '../use-cases/eliminar-rol.js'
import { ExigirPermiso } from '../use-cases/exigir-permiso.js'
import { ListarRoles } from '../use-cases/listar-roles.js'
import { RetirarPermisoRol } from '../use-cases/retirar-permiso-rol.js'

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
function acceso(...claves: string[]): ExigirPermiso {
    return new ExigirPermiso({ permisosEfectivos: async () => new Set(claves) })
}

test('denegación por defecto: consultar roles no llega al repositorio sin permiso', async () => {
    let consultas = 0
    const repositorio = { listar: async () => { consultas++; return [] } } as unknown as RepositorioRoles
    await assert.rejects(new ListarRoles(repositorio, acceso()).ejecutar(actorId), /Acceso denegado/)
    assert.equal(consultas, 0)
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