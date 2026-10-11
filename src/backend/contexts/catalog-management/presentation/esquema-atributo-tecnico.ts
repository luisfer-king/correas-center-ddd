import { tipoDato } from './esquemas-gamas.js'
import { cuerpo, id, texto, slug, opcional, orden, ordenNullable, capacidades, valores, destino } from './esquemas-catalogo.js'
export const crearAtributoTecnico = cuerpo({ tipoAtributoId: id, nombre: texto, valores: valores, orden: orden, tipoDato }, ['tipoAtributoId','nombre','valores','orden'])
export const editarAtributoTecnico = cuerpo({ nombre: texto, valores: valores })
