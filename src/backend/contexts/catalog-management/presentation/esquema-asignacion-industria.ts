import { cuerpo, id, texto, slug, opcional, orden, ordenNullable, capacidades, valores, destino } from './esquemas-catalogo.js'
export const crearAsignacionIndustria = cuerpo({ industriaId: id, destino: destino, orden: orden })
export const editarAsignacionIndustria = cuerpo({ orden: orden })
