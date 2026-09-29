import { cuerpo, id, texto, slug, opcional, orden, ordenNullable, capacidades, valores, destino } from './esquemas-catalogo.js'
export const crearAsignacionAtributo = cuerpo({ categoriaId: id, atributoId: id, valorPersonalizado: opcional, orden: orden })
export const editarAsignacionAtributo = cuerpo({ valorPersonalizado: opcional, orden: orden })
