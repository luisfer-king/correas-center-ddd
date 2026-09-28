import { argon2id, hash } from 'argon2'
import { Email } from '../../../../../shared/domain/value-objects.js'
import { texto, uuid } from '../../../domain/iam-values.js'
import type { RepositorioAdministracionUsuarios } from '../../ports/repositorio-administracion-usuarios.js'
import type { RepositorioPerfiles } from '../../ports/repositorio-perfiles.js'
import { ExigirPermiso } from '../autorizacion/exigir-permiso.js'

export class AdministrarUsuarios {
    constructor(private readonly perfiles: RepositorioPerfiles,
        private readonly escritura: RepositorioAdministracionUsuarios, private readonly autorizar: ExigirPermiso) { }

    private validar(datos: { nombreCompleto: string; email: string; telefono: string | null }) {
        return {
            nombreCompleto: texto(datos.nombreCompleto, 'Nombre completo'),
            email: Email.create(datos.email).value, telefono: datos.telefono?.trim() || null
        }
    }

    async crear(actorId: string, datos: { nombreCompleto: string; email: string; telefono: string | null; password: string }) {
        await this.autorizar.ejecutar(actorId, 'iam.usuarios.create')
        const validos = this.validar(datos)
        if (datos.password.length < 12 || datos.password.length > 256) throw new Error('Contraseña inicial inválida')
        const clave = await hash(datos.password, {
            type: argon2id,
            memoryCost: 19456, timeCost: 2, parallelism: 1
        })
        return this.escritura.crear({ ...validos, hash: clave }, actorId)
    }

    async editar(actorId: string, id: string, datos: {
        nombreCompleto: string; email: string; telefono: string | null; password?: string
    }) {
        await this.autorizar.ejecutar(actorId, 'iam.usuarios.update')
        if (datos.password !== undefined) {
            if (!(await this.autorizar.tieneRolActivo(actorId, ['super_admin']))) throw new Error('Acceso denegado')
            if (datos.password.length < 12 || datos.password.length > 256) throw new Error('Contraseña inicial inválida')
        }
        const perfil = await this.perfiles.buscarPorId(uuid(id))
        if (!perfil || perfil.estado === 'eliminado') throw new Error('Usuario no encontrado')
        const hashNuevo = datos.password === undefined ? {} : {
            hash: await hash(datos.password, {
                type: argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1,
            })
        }
        return this.escritura.actualizar(id, { ...this.validar(datos), ...hashNuevo }, perfil.actualizadoEn, actorId)
    }

    async estado(actorId: string, id: string, accion: 'activar' | 'inactivar' | 'eliminar') {
        const permiso = accion === 'eliminar' ? 'iam.usuarios.delete' : 'iam.usuarios.update'
        await this.autorizar.ejecutar(actorId, permiso)
        if (accion === 'eliminar' && !(await this.autorizar.tieneRolActivo(actorId,
            ['super_admin', 'administrador', 'admin']))) throw new Error('Acceso denegado')
        const perfil = await this.perfiles.buscarPorId(uuid(id))
        if (!perfil) throw new Error('Usuario no encontrado')
        if (accion === 'activar' && perfil.estado !== 'inactivo' ||
            accion === 'inactivar' && perfil.estado !== 'activo' ||
            accion === 'eliminar' && perfil.estado === 'eliminado') throw new Error('Estado de usuario incompatible')
        await this.escritura.cambiarEstado(id, accion === 'activar' ? 'activo' : accion === 'inactivar' ? 'inactivo' : 'eliminado',
            perfil.actualizadoEn, actorId)
    }
}
