import type { Sesion } from '../../domain/sesion.js'
import type { HuellaToken } from '../ports/huella-token.js'
import type { Reloj } from '../ports/reloj.js'
import type { RepositorioPerfiles } from '../ports/repositorio-perfiles.js'
import type { RepositorioSesiones } from '../ports/repositorio-sesiones.js'
import type { ServicioTokens } from '../ports/servicio-tokens.js'

export type SesionVerificada = Readonly<{ usuarioId: string; sesion: Sesion }>

export class ComprobarSesion {
    constructor(
        private readonly tokens: ServicioTokens,
        private readonly sesiones: RepositorioSesiones,
        private readonly perfiles: RepositorioPerfiles,
        private readonly huellas: HuellaToken,
        private readonly reloj: Reloj,
    ) { }
    async ejecutar(jwt: string): Promise<SesionVerificada> {
        const error = new Error('Sesión inválida')
        let claims
        try { claims = await this.tokens.verificar(jwt) } catch { throw error }
        const ahora = this.reloj.ahora()
        if (claims.emitidoEn.getTime() > ahora.getTime() + 30_000) throw error
        const sesion = await this.sesiones.buscarPorId(claims.sesionId)
        if (!sesion || sesion.usuarioId !== claims.usuarioId ||
            sesion.expiraEn.getTime() !== claims.expiraEn.getTime() ||
            !sesion.estaVigente(ahora) ||
            !this.huellas.coincide(jwt, sesion.huellaTokenParaPersistencia)) throw error
        const perfil = await this.perfiles.buscarPorId(claims.usuarioId)
        if (!perfil || perfil.estado !== 'activo' || perfil.eliminadoEn !== null ||
            !perfil.emailVerifiedAt) throw error
        // Los permisos NO van en el JWT: ExigirPermiso consulta los vigentes para cada acción.
        return { usuarioId: claims.usuarioId, sesion }
    }
}