const texto = { type: 'string', minLength: 1, maxLength: 250 }
const nullable = { type: 'string', nullable: true, maxLength: 2048 }
const fecha = { type: 'string', format: 'date-time', nullable: true }
const estado = { type: 'string', enum: ['activo', 'inactivo', 'eliminado'] }
const fechaCampos = { creadoEn: fecha, actualizadoEn: fecha, eliminadoEn: fecha }
const base = { id: { type: 'string' }, ...fechaCampos }
const objeto = (required: string[], properties: Record<string, object>) =>
  ({ type: 'object', additionalProperties: false, required, properties })

export const erroresCrm = Object.fromEntries([400, 401, 403, 404, 409, 500].map((codigo) =>
  [codigo, objeto(['error'], { error: { type: 'string' } })]))
export const listaCrm = (items: object) => ({ type: 'array', items })
export const okCrm = objeto(['ok'], { ok: { type: 'boolean' } })
export const idCrm = { type: 'string', pattern: '^[1-9][0-9]*$', maxLength: 19 }
export const idLead = { type: 'string', format: 'uuid' }
export const paramsCrm = objeto(['id'], { id: idCrm })
export const paramsLead = objeto(['id'], { id: idLead })
export const paginaCrm = objeto([], { pagina: { type: 'integer', minimum: 1, maximum: 10000 } })
export const cuerpoEmpresa = objeto(['nombre', 'logo'], { nombre: texto, logo: nullable })
export const empresaSchema = objeto(['id', 'nombre', 'logo', 'estado', ...Object.keys(fechaCampos)],
  { ...base, nombre: texto, logo: nullable, estado })

const sucursalCampos = {
  nombre: texto, direccion: texto, telefono: texto, email: { type: 'string', format: 'email', nullable: true },
  horarios: nullable, mapaIncrustado: { type: 'string', nullable: true, maxLength: 16000 },
  latitud: nullable, longitud: nullable, orden: { type: 'integer', minimum: 0 },
  esPrincipal: { type: 'boolean' },
}
export const cuerpoSucursal = objeto(['empresaId', ...Object.keys(sucursalCampos)],
  { empresaId: idCrm, ...sucursalCampos, orden: { type: 'integer', minimum: 1, maximum: 2147483647 }, ordenAutomatico: { type: 'boolean' } })
export const editarSucursal = objeto(Object.keys(sucursalCampos), { ...sucursalCampos, orden: { type: 'integer', minimum: 1, maximum: 2147483647 } })
export const sucursalSchema = objeto(['id', 'empresaId', ...Object.keys(sucursalCampos), 'estado', ...Object.keys(fechaCampos)],
  { ...base, empresaId: idCrm, ...sucursalCampos, estado })

export const cuerpoContacto = objeto(['empresaId', 'nombre', 'empresaDeclarada', 'telefono', 'email', 'mensaje'], {
  empresaId: idCrm, nombre: texto, empresaDeclarada: nullable, telefono: texto,
  email: { type: 'string', format: 'email' }, mensaje: { type: 'string', minLength: 1, maxLength: 16000 },
})
export const contactoSchema = objeto(['id', 'empresaId', 'nombre', 'empresaDeclarada', 'telefono', 'email', 'mensaje', 'estado',
  ...Object.keys(fechaCampos)], {
    ...base, ...cuerpoContacto.properties,
  estado: { type: 'string', enum: ['nuevo', 'respondido', 'archivado'] }
})

export const cuerpoSuscriptor = objeto(['empresaId', 'email', 'nombre'], {
  empresaId: idCrm, email: { type: 'string', format: 'email' }, nombre: nullable,
})
export const editarSuscriptor = objeto(['nombre'], { nombre: nullable })
export const suscriptorSchema = objeto(['id', 'empresaId', 'email', 'nombre', 'estado', 'emailVerificadoEn',
  ...Object.keys(fechaCampos)], {
    ...base, ...cuerpoSuscriptor.properties,
  emailVerificadoEn: fecha, estado: { type: 'string', enum: ['activo', 'inactivo', 'desuscrito'] }
})

export const cuerpoLead = objeto(['empresaId', 'contactoId', 'responsableId'], {
  empresaId: idCrm, contactoId: { ...idCrm, nullable: true },
  responsableId: { ...idLead, nullable: true },
})
export const editarResponsable = objeto(['responsableId'], { responsableId: { ...idLead, nullable: true } })
export const leadSchema = objeto(['id', 'empresaId', 'contactoId', 'responsableId', 'estado', ...Object.keys(fechaCampos)],
  { ...base, ...cuerpoLead.properties, estado: { type: 'string', enum: ['nuevo', 'calificado', 'descartado'] } })
