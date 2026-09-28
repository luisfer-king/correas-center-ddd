import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Email } from '../../../../shared/domain/value-objects.js'
import { Perfil } from '../../domain/perfil.js'
import type { RepositorioAdministracionUsuarios } from '../ports/repositorio-administracion-usuarios.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import { AdministrarUsuarios } from '../use-cases/administrar-usuarios.js'
import { ExigirPermiso } from '../use-cases/exigir-permiso.js'

const actor = 'f1af0afb-bce1-4446-a67b-7197c2231a01'
const usuarioId = 'f1af0afb-bce1-4446-a67b-7197c2231a02'
const ahora = new Date('2026-09-26T12:00:00.000Z')
const perfil = new Perfil({
    id: usuarioId, nombreCompleto: 'Usuaria', telefono: null, avatarUrl: null,
    email: Email.create('usuaria@example.com'), emailVerifiedAt: ahora, estado: 'activo',
    fechas: { creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null }, roles: []
})

function crearCaso(permisos: string[], escribir: Partial<RepositorioAdministracionUsuarios> = {}, esSuper = true) {
    const autorizacion = new ExigirPermiso({
        permisosEfectivos: async () => new Set(permisos),
        tieneRolActivo: async () => esSuper,
    } as never)
    return new AdministrarUsuarios({ buscarPorId: async () => perfil } as unknown as RepositorioPerfiles,
        escribir as RepositorioAdministracionUsuarios, autorizacion)
}

test('alta rechaza sin permiso antes de generar hash o escribir', async () => {
    let escritos = 0
    const caso = crearCaso([], { crear: async () => { escritos++; return perfil } })
    await assert.rejects(caso.crear(actor, {
        nombreCompleto: 'Usuaria', email: 'usuaria@example.com',
        telefono: null, password: 'clave-inicial-larga'
    }), /Acceso denegado/)
    assert.equal(escritos, 0)
})

test('alta genera Argon2id y entrega al repositorio solo el hash', async () => {
    let recibida = ''
    const caso = crearCaso(['iam.usuarios.create'], { crear: async (datos) => { recibida = datos.hash; return perfil } })
    await caso.crear(actor, {
        nombreCompleto: 'Usuaria', email: 'USUARIA@example.com',
        telefono: null, password: 'clave-inicial-larga'
    })
    assert.match(recibida, /^\$argon2id\$/)
    assert.doesNotMatch(recibida, /clave-inicial-larga/)
})

test('solo un estado compatible alcanza el repositorio', async () => {
    let cambios = 0
    const caso = crearCaso(['iam.usuarios.update'], { cambiarEstado: async () => { cambios++ } })
    await assert.rejects(caso.estado(actor, usuarioId, 'activar'), /Estado de usuario incompatible/)
    await caso.estado(actor, usuarioId, 'inactivar')
    assert.equal(cambios, 1)
})

test('editar con contraseña exige rol super_admin vigente además del permiso update', async () => {
    let escritos = 0
    const caso = crearCaso(['iam.usuarios.update'], { actualizar: async () => { escritos++; return perfil } }, false)
    await assert.rejects(caso.editar(actor, usuarioId, {
        nombreCompleto: 'Usuaria',
        email: 'usuaria@example.com', telefono: null, password: 'una-clave-nueva-segura'
    }), /Acceso denegado/)
    assert.equal(escritos, 0)
    await caso.editar(actor, usuarioId, { nombreCompleto: 'Usuaria', email: 'usuaria@example.com', telefono: null })
    assert.equal(escritos, 1)
})

test('editar contraseña envía solo hash Argon2id y no revela la clave en el perfil', async () => {
    let hashGuardado = ''
    const caso = crearCaso(['iam.usuarios.update'], {
        actualizar: async (_id, datos) => {
            hashGuardado = datos.hash ?? ''; return perfil
        }
    })
    const resultado = await caso.editar(actor, usuarioId, {
        nombreCompleto: 'Usuaria',
        email: 'usuaria@example.com', telefono: null, password: 'una-clave-nueva-segura'
    })
    assert.match(hashGuardado, /^\$argon2id\$/)
    assert.doesNotMatch(hashGuardado, /una-clave-nueva-segura/)
    assert.doesNotMatch(JSON.stringify(resultado), /una-clave-nueva-segura|argon2id/)
})
