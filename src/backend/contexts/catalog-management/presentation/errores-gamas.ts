/** Mensajes de dominio conocidos; los errores inesperados siguen siendo 500. */
const entrada = new Set([
 'El atributo no admite un valor numérico heredado','El atributo no admite valor numérico heredado','Valor de asignación ambiguo','La asignación admite un solo valor',
 'ID fuera de bigint PostgreSQL','Nombre demasiado largo','Código de gama inválido','Orden de gama inválido','Texto de gama inválido','Enlace de gama inválido','Tipo de dato inválido','Texto técnico inválido','Decimal técnico requiere texto exacto','Booleano técnico inválido','Valor incompatible con el tipo del atributo','Opciones de copia inválidas','Copiar valores o enlaces requiere copiar filas','Posición fuera de la gama','No hay valores para guardar','Celda duplicada en la operación','Reordenación debe incluir todos los elementos vigentes una sola vez',
])
const ausente = new Set(['Gama no disponible','Categoría no disponible','Gama origen no disponible','Plantilla no disponible','Elemento no disponible en la gama','Grupo no disponible en la gama','Fila o columna no disponible en la gama'])
const conflicto = new Set([
 'La categoría ya tiene una gama','Origen incompatible o no disponible','Origen de gama incompatible','Origen de copia no disponible','Grupo del origen no disponible para copiar','La gama origen no tiene columnas activas','El producto no tiene plantilla de gama','No se puede copiar una gama sobre su categoría','Origen modificado; vuelve a cargar la plantilla','Gama modificada por otra operación','Plantilla modificada por otra operación','Plantilla incompatible o no disponible','La plantilla necesita al menos una columna activa','Atributo no disponible o tipo incompatible','Retira o cambia la plantilla antes de inactivar/eliminar la gama','Retira o cambia la plantilla antes de quitar su última columna activa','Orden duplicado en gama','Código duplicado en gama','Atributo duplicado en gama',
])
export function estadoErrorGamas(mensaje:string):number|undefined {
 if(entrada.has(mensaje))return 400
 if(ausente.has(mensaje))return 404
 if(conflicto.has(mensaje))return 409
}
