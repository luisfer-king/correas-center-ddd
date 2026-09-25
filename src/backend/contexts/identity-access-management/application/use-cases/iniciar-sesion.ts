import { Email } from '../../../../shared/domain/value-objects.js'
import { EventoAuditoria } from '../../domain/evento-auditoria.js'
import { Sesion } from '../../domain/sesion.js'
import type { GeneradorIds } from '../ports/generador-ids.js'
import type { HuellaToken } from '../ports/huella-token.js'
import type { Reloj } from '../ports/reloj.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import type { RepositorioSesiones } from '../ports/repositorio-sesiones.js'
import type { RepositorioUsuarios } from '../ports/repositorio-usuarios.js'
import type { ServicioTokens } from '../ports/servicio-tokens.js'
import type { VerificadorClaveSeguro } from '../ports/verificador-clave-seguro.js'

export class IniciarSesion {
    constructor(
        private readonly usuarios: RepositorioUsuarios,
        private readonly perfiles: RepositorioPerfiles,
        private readonly sesiones: RepositorioSesiones,
        private readonly claves: VerificadorClaveSeguro,
        private readonly tokens: ServicioTokens,
        private readonly huellas: HuellaToken,
        private readonly ids: GeneradorIds,
        private readonly reloj: Reloj,
    ) { }
    async ejecutar(emailInput: string, password: string): Promise<string> {
        const error = new Error('Credenciales inválidas')
        let email: Email
        try { email = Email.create(emailInput) } catch { throw error }
        if (typeof password !== 'string' || password.length === 0) throw error

        const usuario = await this.usuarios.buscarPorEmail(email)
        // Nunca distinguir por respuesta si el email está registrado o tiene clave local.
        if (!usuario?.tieneClaveLocal) {
            await this.claves.verificarAusente(password)
            throw error
        }
        if (!await usuario.verificarClave(password, this.claves)) throw error

        const perfil = await this.perfiles.buscarPorId(usuario.id)
        if (!perfil || perfil.estado !== 'activo' || perfil.eliminadoEn !== null ||
            !perfil.email?.equals(email) || !perfil.emailVerifiedAt) throw error

        const ahora = this.reloj.ahora()
        const expiraEn = new Date(Math.floor((ahora.getTime() + 15 * 60_000) / 1000) * 1000)
        const id = this.ids.nuevo()
        const token = await this.tokens.emitir({
            sesionId: id, usuarioId: usuario.id, emitidoEn: ahora, expiraEn,
        })
        const sesion = new Sesion({
            id, usuarioId: usuario.id, huellaToken: this.huellas.calcular(token),
            expiraEn, revocadaEn: null, estado: 'activo',
            fechas: { creadoEn: ahora, actualizadoEn: ahora, eliminadoEn: null },
        })
        const evento = EventoAuditoria.registrar({
            usuarioId: usuario.id, accion: 'Creación', tablaAfectada: 'sesiones',
            registroId: id, datosAnteriores: null, datosNuevos: { id },
            ipAddress: null, userAgent: null, metadata: { operacion: 'iam.sesiones.iniciar' },
            creadoEn: ahora,
        })
        await this.sesiones.crear(sesion, evento)
        // Entregarlo solo al controlador, que configurará una cookie HttpOnly.
        return token
    }
}