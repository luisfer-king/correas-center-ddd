import { cuerpo,id,orden,opcional } from './esquemas-catalogo.js'
import { valorNullable } from './esquemas-gamas.js'
const alternativa = {oneOf:[{required:['valor']},{required:['valorPersonalizado']}]}
export const crearAsignacionAtributo = {...cuerpo({categoriaId:id,atributoId:id,valorPersonalizado:opcional,valor:valorNullable,orden},['categoriaId','atributoId','orden']),...alternativa}
export const editarAsignacionAtributo = {...cuerpo({valorPersonalizado:opcional,valor:valorNullable,orden},['orden']),...alternativa}
