import { Slug } from '../../../../shared/domain/value-objects.js'
import { texto } from '../../domain/iam-values.js'
import type { Rol } from '../../domain/rol.js'
import type { RepositorioRoles } from '../ports/repositorio-roles.js'
import { ExigirPermiso } from './exigir-permiso.js'

export class CrearRol {
    constructor(private readonly roles: RepositorioRoles, private readonly autorizar: ExigirPermiso) { }
    async ejecutar(actorId: string, datos: {
        nombre: string; slug: string; descripcion: string | null
    }): Promise<Rol> {
        await this.autorizar.ejecutar(actorId, 'iam.roles.create')
        const nombre = texto(datos.nombre, 'Nombre de rol')
        const slug = Slug.create(datos.slug).value
        if (slug === 'super_admin') throw new Error('El rol del sistema es reservado')
        return this.roles.crear({ nombre, slug, descripcion: datos.descripcion }, actorId)
    }
}