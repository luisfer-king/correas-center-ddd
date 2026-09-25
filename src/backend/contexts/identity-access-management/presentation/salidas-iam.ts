import type { EventoAuditoria } from '../domain/evento-auditoria.js'
import type { Perfil } from '../domain/perfil.js'
import type { Permiso } from '../domain/permiso.js'
import type { Rol } from '../domain/rol.js'

const fecha = (v: Date | null) => v?.toISOString() ?? null

export function rolDto(rol: Rol) {
    return {
        id: rol.id.toString(), nombre: rol.nombre, slug: rol.slug.value,
        descripcion: rol.descripcion, esSistema: rol.esSistema, estado: rol.estado,
        creadoEn: fecha(rol.creadoEn), actualizadoEn: fecha(rol.actualizadoEn), eliminadoEn: fecha(rol.eliminadoEn),
        permisos: rol.asignacionesPermisos.map((p) => ({ permisoId: p.permisoId.toString(), estado: p.estado })),
    }
}
export function permisoDto(p: Permiso) {
    return {
        id: p.id.toString(), nombre: p.nombre, slug: p.slug.value, grupo: p.grupo,
        descripcion: p.descripcion, estado: p.estado, creadoEn: fecha(p.creadoEn),
        actualizadoEn: fecha(p.actualizadoEn), eliminadoEn: fecha(p.eliminadoEn)
    }
}
export function usuarioDto(p: Perfil) {
    return {
        id: p.id, nombreCompleto: p.nombreCompleto, email: p.email?.value ?? null,
        telefono: p.telefono, avatarUrl: p.avatarUrl, emailVerifiedAt: fecha(p.emailVerifiedAt),
        estado: p.estado, creadoEn: fecha(p.creadoEn), actualizadoEn: fecha(p.actualizadoEn),
        eliminadoEn: fecha(p.eliminadoEn),
        roles: p.asignacionesRoles.map((r) => ({ rolId: r.rolId.toString(), estado: r.estado }))
    }
}
export function auditoriaDto(e: EventoAuditoria) {
    return {
        id: e.id?.toString() ?? null, usuarioId: e.usuarioId, accion: e.accion,
        tablaAfectada: e.tablaAfectada, registroId: e.registroId,
        datosAnteriores: e.datosAnteriores, datosNuevos: e.datosNuevos,
        ipAddress: e.ipAddress, userAgent: e.userAgent, metadata: e.metadata,
        creadoEn: fecha(e.creadoEn)
    }
}