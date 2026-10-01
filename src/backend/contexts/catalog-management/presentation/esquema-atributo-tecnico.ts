import { cuerpo, id, texto, slug, opcional, orden, ordenNullable, capacidades, valores, destino } from './esquemas-catalogo.js'
export const crearAtributoTecnico = cuerpo({ tipoAtributoId: id, nombre: texto, valores: valores, orden: orden })
export const editarAtributoTecnico = cuerpo({ nombre: texto, valores: valores })
