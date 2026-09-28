import { ExigirPermiso } from './exigir-permiso.js'

export class ObtenerCapacidadesRoles {
    constructor(private readonly autorizar: ExigirPermiso) { }
    async ejecutar(actorId: string) {
        const [superAdmin, admin, leer, crear, editar, eliminar, asignar, leerPermisos,
            leerUsuarios, gestionarRolesUsuarios, leerAuditoria, crearUsuario, editarUsuario, eliminarUsuario] = await Promise.all([
                this.autorizar.tieneRolActivo(actorId, ['super_admin']),
                this.autorizar.tieneRolActivo(actorId, ['administrador', 'admin']),
                this.autorizar.tienePermiso(actorId, 'iam.roles.read'),
                this.autorizar.tienePermiso(actorId, 'iam.roles.create'),
                this.autorizar.tienePermiso(actorId, 'iam.roles.update'),
                this.autorizar.tienePermiso(actorId, 'iam.roles.delete'),
                this.autorizar.tienePermiso(actorId, 'iam.roles.permisos.assign'),
                this.autorizar.tienePermiso(actorId, 'iam.permisos.read'),
                this.autorizar.tienePermiso(actorId, 'iam.usuarios.read'),
                this.autorizar.tienePermiso(actorId, 'iam.usuarios.roles.assign'),
                this.autorizar.tienePermiso(actorId, 'iam.auditoria.read'),
                this.autorizar.tienePermiso(actorId, 'iam.usuarios.create'),
                this.autorizar.tienePermiso(actorId, 'iam.usuarios.update'),
                this.autorizar.tienePermiso(actorId, 'iam.usuarios.delete'),
            ])
        return {
            verEliminados: superAdmin && leer,
            verUsuariosEliminados: superAdmin && leerUsuarios,
            leerRoles: leer,
            crearRol: crear,
            editarRol: editar,
            eliminarRol: (superAdmin || admin) && eliminar,
            gestionarPermisos: asignar,
            leerPermisos,
            leerUsuarios,
            crearUsuario, editarUsuario, eliminarUsuario: (superAdmin || admin) && eliminarUsuario,
            cambiarClaveUsuario: superAdmin && editarUsuario,
            gestionarRolesUsuarios,
            leerAuditoria,
        }
    }
}
