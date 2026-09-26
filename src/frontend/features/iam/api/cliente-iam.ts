import { solicitarApi } from '../../../shared/api/cliente-http'
import type { CapacidadesRoles, EventoAuditoriaIam, IdIam, PermisoIam, RolIam, UsuarioIam } from './tipos-iam'

const base = '/api/portal/iam'
const id = (valor: IdIam) => {
    if (!/^[1-9]\d*$/.test(valor)) throw new Error('Identificador IAM inválido')
    return encodeURIComponent(valor)
}
const usuarioId = (valor: string) => encodeURIComponent(valor)
type Senal = { signal?: AbortSignal }
type Ok = { ok: boolean }

export const iamApi = {
    iniciarSesion: (email: string, password: string) =>
        solicitarApi<Ok>('/api/iam/sesion', { metodo: 'POST', cuerpo: { email, password } }),
    comprobarSesion: (opciones?: Senal) =>
        solicitarApi<{ usuarioId: string }>('/api/iam/sesion', opciones),
    cerrarSesion: () => solicitarApi<void>('/api/iam/sesion/cerrar', { metodo: 'POST' }),

    capacidadesRoles: (opciones?: Senal) => solicitarApi<CapacidadesRoles>(`${base}/capacidades-roles`, opciones),

    listarRoles: (opciones?: Senal) => solicitarApi<RolIam[]>(`${base}/roles`, opciones),
    obtenerRol: (rolId: IdIam, opciones?: Senal) => solicitarApi<RolIam>(`${base}/roles/${id(rolId)}`, opciones),
    crearRol: (datos: { nombre: string; slug: string; descripcion: string | null }) =>
        solicitarApi<RolIam>(`${base}/roles`, { metodo: 'POST', cuerpo: datos }),
    editarRol: (rolId: IdIam, datos: { nombre: string; descripcion: string | null }) =>
        solicitarApi<RolIam>(`${base}/roles/${id(rolId)}`, { metodo: 'PATCH', cuerpo: datos }),
    cambiarEstadoRol: (rolId: IdIam, accion: 'activar' | 'inactivar' | 'eliminar') =>
        solicitarApi<Ok>(`${base}/roles/${id(rolId)}/${accion}`, { metodo: 'PATCH' }),
    asignarPermiso: (rolId: IdIam, permisoId: IdIam) =>
        solicitarApi<Ok>(`${base}/roles/${id(rolId)}/permisos/${id(permisoId)}`, { metodo: 'PUT' }),
    retirarPermiso: (rolId: IdIam, permisoId: IdIam) =>
        solicitarApi<Ok>(`${base}/roles/${id(rolId)}/permisos/${id(permisoId)}/retirar`, { metodo: 'PATCH' }),

    listarPermisos: (opciones?: Senal) => solicitarApi<PermisoIam[]>(`${base}/permisos`, opciones),
    obtenerPermiso: (permisoId: IdIam, opciones?: Senal) =>
        solicitarApi<PermisoIam>(`${base}/permisos/${id(permisoId)}`, opciones),
    listarUsuarios: (opciones?: Senal) => solicitarApi<UsuarioIam[]>(`${base}/usuarios`, opciones),
    obtenerUsuario: (uid: string, opciones?: Senal) =>
        solicitarApi<UsuarioIam>(`${base}/usuarios/${usuarioId(uid)}`, opciones),
    asignarRol: (uid: string, rolId: IdIam) =>
        solicitarApi<Ok>(`${base}/usuarios/${usuarioId(uid)}/roles/${id(rolId)}`, { metodo: 'PUT' }),
    retirarRol: (uid: string, rolId: IdIam) =>
        solicitarApi<Ok>(`${base}/usuarios/${usuarioId(uid)}/roles/${id(rolId)}/retirar`, { metodo: 'PATCH' }),
    listarAuditoria: (limite = 50, antesDeId?: IdIam, opciones?: Senal) => {
        const query = new URLSearchParams({ limite: String(limite) })
        if (antesDeId) query.set('antesDeId', id(antesDeId))
        return solicitarApi<EventoAuditoriaIam[]>(`${base}/auditoria?${query}`, opciones)
    },
}