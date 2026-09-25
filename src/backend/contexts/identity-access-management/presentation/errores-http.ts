import type { FastifyInstance } from 'fastify';

export function registrarErroresIam(app: FastifyInstance) {
    app.setErrorHandler((error, request, reply) => {
        const fallo = error as Error & { validation?: unknown; code?: string; statusCode?: number }
        if (fallo.validation) return reply.code(400).send({ error: 'Solicitud inválida' })
        if (fallo.statusCode === 429) return reply.code(429).send({ error: 'Demasiadas solicitudes' })
        const msg = fallo.message
        if (msg === 'Sesión inválida' || msg === 'Credenciales inválidas') {
            return reply.code(401).send({ error: msg })
        }
        if (msg === 'Acceso denegado') return reply.code(403).send({ error: msg })
        if (['Slug inválido', 'Nombre de rol no puede estar vacío', 'UUID inválido',
            'ID inválido'].includes(msg)) return reply.code(400).send({ error: 'Solicitud inválida' })
        if (['Rol no encontrado', 'Permiso no encontrado', 'Usuario no encontrado',
            'Rol o permiso no disponible', 'Usuario o rol no disponible'].includes(msg)) {
            return reply.code(404).send({ error: msg })
        }
        if (['Rol del sistema protegido', 'No se pueden retirar permisos del rol del sistema',
            'El rol del sistema es reservado', 'No se puede retirar el último superadministrador activo',
            'Perfil modificado por otra operación; vuelve a cargarlo',
            'Rol modificado por otra operación; vuelve a cargarlo',
            'No se puede renombrar el rol del sistema', 'No se puede retirar permisos del rol del sistema',
            'Solo se puede inactivar un registro activo', 'Solo se puede activar un registro inactivo',
            'Registro eliminado', 'El registro ya está eliminado', 'Rol inexistente o protegido',
            'No se puede asignar un permiso inexistente o inactivo',
            'No se puede asignar un rol inexistente o inactivo',
            'Rol no activo', 'Perfil no activo', 'Permiso ya asignado', 'Permiso no asignado',
            'El perfil ya tiene el rol', 'El perfil no tiene el rol'].includes(msg) ||
            (error as { code?: string }).code === 'P2002') {
            return reply.code(409).send({ error: 'Operación en conflicto con el estado actual' })
        }
        if ((error as { code?: string }).code === 'P2034') {
            return reply.code(409).send({ error: 'Modificación concurrente; vuelve a cargar los datos' })
        }
        request.log.error({ err: error }, 'Fallo IAM')
        return reply.code(500).send({ error: 'Error interno' })
    })
}