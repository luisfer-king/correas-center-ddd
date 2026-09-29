import { cuerpo, id, texto, slug, opcional, orden, ordenNullable, capacidades, valores, destino } from './esquemas-catalogo.js'
export const crearCategoria = cuerpo({ productoId: id, nombre: texto, slug: slug, imagen: opcional, descripcion: opcional, descripcionCorta: opcional, uso: opcional, orden: orden })
export const editarCategoria = cuerpo({ nombre: texto, imagen: opcional, descripcion: opcional, descripcionCorta: opcional, uso: opcional })
