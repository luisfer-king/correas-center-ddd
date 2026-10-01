import { cuerpo, opcional, orden, texto } from './esquemas-catalogo.js'
export const crearMarca = cuerpo({ nombre: texto, slug: { type: 'string', maxLength: 250 }, logo: opcional, orden: orden }, ['nombre', 'logo', 'orden'])
export const editarMarca = cuerpo({ nombre: texto, logo: opcional })
