import { cuerpo, id, texto, slug, opcional, orden, ordenNullable, capacidades, valores, destino } from './esquemas-catalogo.js'
export const crearAsignacionMarca = cuerpo({ productoId: id, marcaId: id, orden: ordenNullable })
export const editarAsignacionMarca = cuerpo({ orden: ordenNullable })
