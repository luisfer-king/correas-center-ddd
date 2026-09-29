import { cuerpo, id, texto, slug, opcional, orden, ordenNullable, capacidades, valores, destino } from './esquemas-catalogo.js'
export const crearMarca = cuerpo({ nombre: texto, slug: slug, logo: opcional, orden: orden })
export const editarMarca = cuerpo({ nombre: texto, logo: opcional })
