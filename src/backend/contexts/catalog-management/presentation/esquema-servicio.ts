import { cuerpo, id, texto, slug, opcional, orden, ordenNullable, capacidades, valores, destino } from './esquemas-catalogo.js'
export const crearServicio = cuerpo({ empresaId: id, nombre: texto, descripcion: opcional, imagen: opcional, orden: orden })
export const editarServicio = cuerpo({ nombre: texto, descripcion: opcional, imagen: opcional })
