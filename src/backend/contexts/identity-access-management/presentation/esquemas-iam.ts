const estado = { type: 'string', enum: ['activo', 'inactivo', 'eliminado'] }
const estadoAsignacion = { type: 'string', enum: ['activo', 'inactivo'] }
const fecha = { type: 'string', format: 'date-time', nullable: true }
const nullable = { type: 'string', nullable: true }
const asignacion = (campo: string) => ({
    type: 'object', additionalProperties: false,
    required: [campo, 'estado'], properties: { [campo]: { type: 'string' }, estado: estadoAsignacion }
})

export const errorSchema = {
    type: 'object', additionalProperties: false,
    required: ['error'], properties: { error: { type: 'string' } }
}
export const errors = {
    400: errorSchema, 401: errorSchema, 403: errorSchema,
    404: errorSchema, 409: errorSchema, 429: errorSchema, 500: errorSchema
}
export const protegido = [{ cookieAuth: [] }]
export const idParams = {
    type: 'object', required: ['id'], additionalProperties: false,
    properties: { id: { type: 'string', pattern: '^[1-9][0-9]*$' } }
}
export const relacionParams = {
    type: 'object', required: ['id', 'relacionId'], additionalProperties: false,
    properties: {
        id: { type: 'string', pattern: '^[1-9][0-9]*$' },
        relacionId: { type: 'string', pattern: '^[1-9][0-9]*$' }
    }
}
export const usuarioParams = {
    type: 'object', required: ['id'], additionalProperties: false,
    properties: { id: { type: 'string', format: 'uuid' } }
}
export const usuarioRolParams = {
    type: 'object', required: ['id', 'rolId'], additionalProperties: false,
    properties: { id: { type: 'string', format: 'uuid' }, rolId: { type: 'string', pattern: '^[1-9][0-9]*$' } }
}

export const rolSchema = {
    type: 'object', additionalProperties: false,
    required: ['id', 'nombre', 'slug', 'descripcion', 'esSistema', 'estado', 'creadoEn', 'actualizadoEn', 'eliminadoEn', 'permisos'],
    properties: {
        id: { type: 'string' }, nombre: { type: 'string' }, slug: { type: 'string' },
        descripcion: nullable, esSistema: { type: 'boolean' }, estado, creadoEn: fecha,
        actualizadoEn: fecha, eliminadoEn: fecha,
        permisos: { type: 'array', items: asignacion('permisoId') }
    }
}
export const permisoSchema = {
    type: 'object', additionalProperties: false,
    required: ['id', 'nombre', 'slug', 'grupo', 'descripcion', 'estado', 'creadoEn', 'actualizadoEn', 'eliminadoEn'],
    properties: {
        id: { type: 'string' }, nombre: { type: 'string' }, slug: { type: 'string' },
        grupo: { type: 'string' }, descripcion: nullable, estado,
        creadoEn: fecha, actualizadoEn: fecha, eliminadoEn: fecha
    }
}
export const usuarioSchema = {
    type: 'object', additionalProperties: false,
    required: ['id', 'nombreCompleto', 'email', 'telefono', 'avatarUrl', 'emailVerifiedAt', 'estado', 'creadoEn', 'actualizadoEn', 'eliminadoEn', 'roles'],
    properties: {
        id: { type: 'string' }, nombreCompleto: { type: 'string' }, email: nullable,
        telefono: nullable, avatarUrl: nullable, emailVerifiedAt: fecha, estado,
        creadoEn: fecha, actualizadoEn: fecha, eliminadoEn: fecha,
        roles: { type: 'array', items: asignacion('rolId') }
    }
}
export const auditoriaSchema = {
    type: 'object', additionalProperties: false,
    required: ['id', 'usuarioId', 'accion', 'tablaAfectada', 'registroId', 'datosAnteriores', 'datosNuevos', 'ipAddress', 'userAgent', 'metadata', 'creadoEn'],
    properties: {
        id: nullable, usuarioId: nullable, accion: { type: 'string', enum: ['Lectura', 'Creación', 'Edición', 'Eliminación'] },
        tablaAfectada: { type: 'string' }, registroId: nullable, datosAnteriores: {}, datosNuevos: {},
        ipAddress: nullable, userAgent: nullable, metadata: {}, creadoEn: fecha
    }
}
export const lista = (items: object) => ({ type: 'array', items })
export const vacio = { type: 'null' }