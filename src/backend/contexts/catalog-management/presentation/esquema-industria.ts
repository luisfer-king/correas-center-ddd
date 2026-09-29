import { cuerpo, id, texto, slug, opcional, orden, ordenNullable, capacidades, valores, destino } from './esquemas-catalogo.js'
export const crearIndustria = cuerpo({ empresaId: id, nombre: texto, slug: slug, imagen: opcional, orden: orden })
export const editarIndustria = cuerpo({ nombre: texto, imagen: opcional })
