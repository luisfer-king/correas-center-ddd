import { argon2id, hash } from 'argon2'
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Email } from '../../../../shared/domain/value-objects.js'
import { HashArgon2id } from '../../domain/iam-values.js'
import { Perfil } from '../../domain/perfil.js'
import type { Sesion } from '../../domain/sesion.js'
import { Usuario } from '../../domain/usuario.js'
import { Argon2Verificador } from '../../infrastructure/argon2-verificador.js'
import { Sha256HuellaToken } from '../../infrastructure/sha256-huella-token.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import type { RepositorioSesiones } from '../ports/repositorio-sesiones.js'
import type { RepositorioUsuarios } from '../ports/repositorio-usuarios.js'
import type { ServicioTokens } from '../ports/servicio-tokens.js'
import { CerrarSesion } from '../use-cases/cerrar-sesion.js'
import { ComprobarSesion } from '../use-cases/comprobar-sesion.js'
import { IniciarSesion } from '../use-cases/iniciar-sesion.js'

const id = '11111111-1111-4111-8111-111111111111'
const sid = '22222222-2222-4222-8222-222222222222'
const ahora = new Date('2026-09-25T14:00:00.000Z')
const reloj = { ahora: () => new Date(ahora) }
const email = Email.create('admin@ejemplo.com')

// Prueba de reglas usando Argon2 real y tokens simulados; JWT firmado se validará al instalar jose.
test('login: Argon2id válido crea sesión y auditoría sin almacenar contraseña ni JWT', async () => {
    const clave = 'correcta-solo-para-pruebas'
    const usuario = new Usuario(id, email, HashArgon2id.fromHash(await hash(clave, {
        type: argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1,
    })))
    const perfil = new Perfil({
        id, nombreCompleto: 'Administrador', telefono: null, avatarUrl: null,
        email, emailVerifiedAt: ahora, estado: 'activo', roles: [],
        fechas: { creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null },
    })
    const usuarios = { buscarPorEmail: async (valor: Email) => valor.equals(email) ? usuario : null } as RepositorioUsuarios
    const perfiles = { buscarPorId: async () => perfil } as unknown as RepositorioPerfiles
    const huellas = new Sha256HuellaToken()
    let sesionGuardada: Sesion | null = null
    let eventos = 0
    const sesiones = {
        crear: async (sesion: Sesion, evento: { datosNuevos: unknown }) => {
            sesionGuardada = sesion
            assert.equal(sesion.huellaTokenParaPersistencia, huellas.calcular('jwt-simulado'))
            assert.equal(JSON.stringify(evento.datosNuevos).includes(clave), false)
            eventos++
        },
        buscarPorId: async () => sesionGuardada,
        revocar: async () => { eventos++ },
    } as RepositorioSesiones
    const tokens = {
        emitir: async () => 'jwt-simulado',
        verificar: async () => ({
            usuarioId: id, sesionId: sid, emitidoEn: ahora,
            expiraEn: new Date(ahora.getTime() + 900_000)
        }),
    } as ServicioTokens
    const claves = new Argon2Verificador()
    const iniciar = new IniciarSesion(usuarios, perfiles, sesiones, claves,
        tokens, huellas, { nuevo: () => sid }, reloj)
    await assert.rejects(iniciar.ejecutar(email.value, 'errónea'), /Credenciales inválidas/)
    await assert.rejects(iniciar.ejecutar('ausente@ejemplo.com', clave), /Credenciales inválidas/)
    assert.equal(eventos, 0)
    assert.equal(await iniciar.ejecutar(email.value, clave), 'jwt-simulado')
    assert.equal(eventos, 1)
    const creada = await sesiones.buscarPorId(sid)
    assert.ok(creada?.estaVigente(ahora))
    const comprobar = new ComprobarSesion(tokens, sesiones, perfiles, huellas, reloj)
    assert.equal((await comprobar.ejecutar('jwt-simulado')).usuarioId, id)
    await assert.rejects(comprobar.ejecutar('jwt-alterado'), /Sesión inválida/)
    await new CerrarSesion(comprobar, sesiones, reloj).ejecutar('jwt-simulado')
    assert.equal(eventos, 2)
    await assert.rejects(comprobar.ejecutar('jwt-simulado'), /Sesión inválida/)
})