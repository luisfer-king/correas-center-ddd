import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Email, Slug } from '../../../../shared/domain/value-objects.js'
import { Perfil } from '../../domain/perfil.js'
import { Rol } from '../../domain/rol.js'
import { UsuarioRol } from '../../domain/usuario-rol.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { AsignarRolUsuario } from '../use-cases/asignar-rol-usuario.js'
import { ExigirPermiso } from '../use-cases/exigir-permiso.js'
import { ListarUsuarios } from '../use-cases/listar-usuarios.js'
import { ObtenerUsuario } from '../use-cases/obtener-usuario.js'
import { RetirarRolUsuario } from '../use-cases/retirar-rol-usuario.js'

const actor = '11111111-1111-4111-8111-111111111111'
const uid = '22222222-2222-4222-8222-222222222222'
const t0 = new Date('2026-01-01T00:00:00.000Z')
const t1 = new Date('2026-01-01T00:00:01.000Z')
const reloj = { ahora: () => t1 }
const acceso = (superAdmin: boolean, ...permisos: string[]) => new ExigirPermiso({
    permisosEfectivos: async () => new Set(permisos),
    tieneRolActivo: async () => superAdmin,
})
function perfil(estado: 'activo' | 'eliminado' = 'activo') {
    return new Perfil({
        id: uid, nombreCompleto: 'Usuario de prueba', email: Email.create('usuario@example.com'),
        telefono: null, avatarUrl: null, emailVerifiedAt: null, estado,
        fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: estado === 'eliminado' ? t1 : null },
        roles: [new UsuarioRol(uid, 2n, t0)],
    })
}
function rol(estado: 'activo' | 'inactivo' = 'activo', id = 3n) {
    return new Rol({
        id, nombre: 'Operador', slug: Slug.create('operador'), descripcion: null,
        esSistema: false, estado, fechas: { creadoEn: t0, actualizadoEn: t0, eliminadoEn: null }, permisos: [],
    })
}

test('lectura de usuarios exige permiso y solo super_admin puede ver perfiles eliminados', async () => {
    const vigente = perfil()
    const eliminado = perfil('eliminado')
    let consultas = 0
    const repositorio = {
        listar: async () => { consultas++; return [vigente, eliminado] },
        buscarPorId: async () => eliminado,
    } as unknown as RepositorioPerfiles
    await assert.rejects(new ListarUsuarios(repositorio, acceso(false)).ejecutar(actor), /Acceso denegado/)
    assert.equal(consultas, 0)
    assert.deepEqual(await new ListarUsuarios(repositorio, acceso(false, 'iam.usuarios.read')).ejecutar(actor), [vigente])
    await assert.rejects(new ObtenerUsuario(repositorio, acceso(false, 'iam.usuarios.read'))
        .ejecutar(actor, uid), /Usuario no encontrado/)
    assert.deepEqual(await new ListarUsuarios(repositorio, acceso(true, 'iam.usuarios.read')).ejecutar(actor), [vigente, eliminado])
    assert.equal(await new ObtenerUsuario(repositorio, acceso(true, 'iam.usuarios.read')).ejecutar(actor, uid), eliminado)
})

test('retirar y reasignar un rol reutiliza el vínculo y requiere permiso vigente', async () => {
    const usuario = perfil()
    const asignacion = usuario.asignacionesRoles[0]
    const repositorio = {
        buscarPorId: async () => usuario,
        guardar: async () => { guardados++ },
    } as unknown as RepositorioPerfiles
    const roles = { buscarPorId: async () => rol('activo', 2n) } as unknown as RepositorioRoles
    let guardados = 0
    const autorizado = acceso(true, 'iam.usuarios.roles.assign')
    await assert.rejects(new RetirarRolUsuario(repositorio, acceso(true), reloj)
        .ejecutar(actor, uid, 2n), /Acceso denegado/)
    await new RetirarRolUsuario(repositorio, autorizado, reloj).ejecutar(actor, uid, 2n)
    assert.equal(asignacion.estado, 'inactivo')
    await new AsignarRolUsuario(repositorio, roles, autorizado, reloj).ejecutar(actor, uid, 2n)
    assert.equal(usuario.rolesAsignados.length, 1)
    assert.equal(usuario.rolesAsignados[0], asignacion)
    assert.equal(guardados, 2)
})

test('no asigna un rol inactivo a un perfil activo', async () => {
    let escrituras = 0
    const repositorio = { buscarPorId: async () => perfil(), guardar: async () => { escrituras++ } } as unknown as RepositorioPerfiles
    const roles = { buscarPorId: async () => rol('inactivo') } as unknown as RepositorioRoles
    await assert.rejects(new AsignarRolUsuario(repositorio, roles, acceso(true, 'iam.usuarios.roles.assign'), reloj)
        .ejecutar(actor, uid, 3n), /no disponible/)
    assert.equal(escrituras, 0)
})