import { cuerpo, id, texto, slug, opcional, orden, ordenNullable, capacidades, valores, destino } from './esquemas-catalogo.js'
export const crearTipoAtributo = cuerpo({ nombre: texto, slug: slug, descripcion: opcional, icono: opcional, capacidades: capacidades, orden: orden })
export const editarTipoAtributo = cuerpo({ nombre: texto, descripcion: opcional, icono: opcional, capacidades: capacidades })
