import { texto, uuid } from '../../../domain/iam-values.js'
import type { RepositorioMiPerfil } from '../../ports/repositorio-mi-perfil.js'
import type { RepositorioPerfiles } from '../../ports/repositorio-perfiles.js'

export class MiPerfil {
    constructor(private readonly perfiles: RepositorioPerfiles, private readonly escritura: RepositorioMiPerfil) { }

    async obtener(actorId: string) {
        const perfil = await this.perfiles.buscarPorId(uuid(actorId))
        if (!perfil || perfil.estado !== 'activo') throw new Error('Perfil no encontrado')
        return perfil
    }

    async editar(actorId: string, datos: { nombreCompleto: string; telefono: string | null }) {
        const perfil = await this.obtener(actorId)
        return this.escritura.actualizar(actorId, {
            nombreCompleto: texto(datos.nombreCompleto, 'Nombre completo'), telefono: datos.telefono?.trim() || null,
        }, perfil.actualizadoEn)
    }

    async cambiarClave(actorId: string, actual: string, nueva: string) {
        uuid(actorId)
        if (nueva.length < 12 || nueva.length > 256 || actual === nueva) throw new Error('Contraseña nueva inválida')
        await this.escritura.cambiarClave(actorId, actual, nueva)
    }
}
