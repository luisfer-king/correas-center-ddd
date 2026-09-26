// Los bigint del backend se transportan como cadenas decimales.
export type IdIam = string
export type EstadoAsignacion = 'activo' | 'inactivo'
export type EstadoRol = 'activo' | 'inactivo' | 'eliminado'
export interface CapacidadesRoles {
    verEliminados: boolean
    verUsuariosEliminados: boolean
    leerRoles: boolean
    crearRol: boolean
    editarRol: boolean
    eliminarRol: boolean
    gestionarPermisos: boolean
    leerPermisos: boolean
    leerUsuarios: boolean
    crearUsuario: boolean
    editarUsuario: boolean
    eliminarUsuario: boolean
    gestionarRolesUsuarios: boolean
    leerAuditoria: boolean
}

export interface AsignacionPermiso { permisoId: IdIam; estado: EstadoAsignacion }
export interface AsignacionRol { rolId: IdIam; estado: EstadoAsignacion }
export interface RolIam {
    id: IdIam
    nombre: string
    slug: string
    descripcion: string | null
    esSistema: boolean
    estado: EstadoRol
    creadoEn: string | null
    actualizadoEn: string | null
    eliminadoEn: string | null
    permisos: AsignacionPermiso[]
}
export interface PermisoIam {
    id: IdIam
    nombre: string
    slug: string
    grupo: string
    descripcion: string | null
    estado: string
    creadoEn: string | null
    actualizadoEn: string | null
    eliminadoEn: string | null
}
export interface UsuarioIam {
    id: string
    nombreCompleto: string
    email: string | null
    telefono: string | null
    avatarUrl: string | null
    emailVerifiedAt: string | null
    estado: string
    creadoEn: string | null
    actualizadoEn: string | null
    eliminadoEn: string | null
    roles: AsignacionRol[]
}
export interface EventoAuditoriaIam {
    id: IdIam | null
    usuarioId: string | null
    accion: string
    tablaAfectada: string
    registroId: string | null
    datosAnteriores: unknown
    datosNuevos: unknown
    ipAddress: string | null
    userAgent: string | null
    metadata: unknown
    creadoEn: string | null
}
