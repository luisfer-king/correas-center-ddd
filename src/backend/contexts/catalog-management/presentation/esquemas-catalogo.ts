const objeto = (properties: Record<string, object>, required = Object.keys(properties)) => ({ type: 'object', additionalProperties: false, required, properties })
export const id = { type: 'string', pattern: '^[1-9][0-9]*$', maxLength: 19 }
export const texto = { type: 'string', minLength: 1, maxLength: 250 }
export const opcional = { type: 'string', nullable: true, maxLength: 2048 }
export const slug = { type: 'string', pattern: '^[a-z0-9]+(?:[-_][a-z0-9]+)*$', maxLength: 250 }
export const orden = { type: 'integer', minimum: 0 }
export const ordenNullable = { ...orden, nullable: true }
export const capacidades = objeto({ descripcion: { type: 'boolean' }, numero: { type: 'boolean' }, unidad: { type: 'boolean' } })
export const valores = objeto({ descripcion: opcional, valorNumerico: { type: 'string', pattern: '^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$', nullable: true }, unidadMedida: opcional })
export const destino = objeto({ tipo: { type: 'string', enum: ['categoria','servicio'] }, id })
export const params = objeto({ id })
export const pagina = objeto({ pagina: { type: 'integer', minimum: 1, maximum: 10000 } }, [])
export const respuesta = { type: 'object', additionalProperties: true }
export const lista = { type: 'array', items: respuesta }
export const ok = objeto({ ok: { type: 'boolean' } })
export const errores = Object.fromEntries([400,401,403,404,409,500].map(code => [code, objeto({ error: { type: 'string' } })]))
export const cuerpo = objeto
