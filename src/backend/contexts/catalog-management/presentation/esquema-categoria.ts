import { cuerpo, id, opcional, orden, texto } from './esquemas-catalogo.js'
export const crearCategoria = cuerpo({ productoId: id, nombre: texto, slug: { type: 'string', maxLength: 250 }, imagen: opcional, descripcion: opcional, descripcionCorta: opcional, uso: opcional, orden: orden }, ['productoId', 'nombre', 'imagen', 'descripcion', 'descripcionCorta', 'uso', 'orden'])
export const editarCategoria = cuerpo({ nombre: texto, imagen: opcional, descripcion: opcional, descripcionCorta: opcional, uso: opcional })
