import { cuerpo, id, opcional, orden, texto } from './esquemas-catalogo.js'
export const crearProducto = cuerpo({ empresaId: id, nombre: texto, slug: { type: 'string', maxLength: 250 }, imagen: opcional, orden: orden }, ['empresaId', 'nombre', 'imagen', 'orden'])
export const editarProducto = cuerpo({ nombre: texto, imagen: opcional })
