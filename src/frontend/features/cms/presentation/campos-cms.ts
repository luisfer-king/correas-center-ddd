import { slugNombre } from '../../../../shared/slug-nombre'
export type CampoCms = { clave: string; etiqueta: string; tipo: 'texto' | 'area' | 'id' | 'numero' | 'booleano' | 'triestado' | 'json' | 'claves' | 'select' | 'slug' | 'orden-auto' | 'icono-lucide'; nullable?: boolean; opciones?: string[]; inicial?: unknown; ayuda?: string }
export type DatosFormularioCms = Record<string, unknown>
export function leerCampoCms(datos: DatosFormularioCms, clave: string): unknown {
 return clave.split('.').reduce<unknown>((valor, parte) => valor && typeof valor === 'object' ? (valor as DatosFormularioCms)[parte] : undefined, datos)
}
export function construirDatosCms(campos: readonly CampoCms[], valores: Record<string,string>): DatosFormularioCms {
 const resultado: DatosFormularioCms = {}
 for (const campo of campos) {
  const texto = valores[campo.clave] ?? ''; let valor: unknown = texto.trim()
  if (campo.tipo === 'slug') { valor = slugNombre(valores.nombre ?? ''); if (!valor) throw new Error('El nombre debe permitir generar un slug válido') }
  else if (campo.tipo === 'orden-auto') { valor = texto === '' ? null : Number(texto); if (valor !== null && (!Number.isSafeInteger(valor) || Number(valor) < 0 || Number(valor) > 2147483647)) throw new Error('Orden inválido') }
  else if (!texto.trim() && campo.nullable) valor = null
  else if (campo.tipo === 'numero') { valor = Number(texto); if (!texto.trim() || !Number.isSafeInteger(valor) || Number(valor) < 0 || Number(valor) > 2147483647) throw new Error(`${campo.etiqueta}: usa un entero entre 0 y 2147483647`) }
  else if (campo.tipo === 'id') { if (!/^[1-9][0-9]{0,18}$/.test(texto.trim()) || BigInt(texto.trim()) > 9223372036854775807n) throw new Error(`${campo.etiqueta}: identificador inválido`) }
  else if (campo.tipo === 'booleano') valor = texto === 'true'
  else if (campo.tipo === 'triestado') valor = texto === '' ? null : texto === 'true'
  else if (campo.tipo === 'claves') { valor = parsearClavesCms(texto); if (new Set(valor as string[]).size !== (valor as string[]).length) throw new Error('Las claves no pueden repetirse') }
  else if (campo.tipo === 'json') { try { valor = JSON.parse(texto) } catch { throw new Error(`${campo.etiqueta}: JSON inválido`) }; if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new Error(`${campo.etiqueta}: se requiere un objeto JSON`) }
  else if (campo.tipo === 'select') { if (!campo.opciones?.includes(String(valor))) throw new Error(`${campo.etiqueta}: selecciona una opción`) }
  else if (!campo.nullable && !String(valor).length) throw new Error(`${campo.etiqueta}: campo obligatorio`)
  if (campo.tipo === 'area' || (campo.tipo === 'texto' && campo.nullable)) valor = valor === null ? null : texto
  const partes = campo.clave.split('.'); let padre = resultado
  for (const parte of partes.slice(0,-1)) { padre[parte] ??= {}; padre = padre[parte] as DatosFormularioCms }
  padre[partes.at(-1)!] = valor
 }
 // El destino es opcional en el footer, obligatorio en el menú.
 if (resultado.destino && (resultado.destino as DatosFormularioCms).id === null) resultado.destino = null
 return resultado
}
export function valoresInicialesCms(campos: readonly CampoCms[], datos: DatosFormularioCms): Record<string,string> {
 return Object.fromEntries(campos.map(c => { const v = leerCampoCms(datos,c.clave) ?? c.inicial ?? (c.tipo === 'numero' ? 0 : c.tipo === 'booleano' ? false : c.tipo === 'json' ? {} : ''); return [c.clave, c.tipo === 'json' ? JSON.stringify(v,null,2) : c.tipo === 'claves' && Array.isArray(v) ? JSON.stringify(v) : String(v)] }))
}

export function parsearClavesCms(texto: string): string[] {
 if (!texto.trim()) return []
 if (texto.trim().startsWith('[')) { const valor: unknown = JSON.parse(texto); if (!Array.isArray(valor) || !valor.every(c=>typeof c==='string' && c.trim() && c===c.trim())) throw new Error('Claves de metadata inválidas'); return valor }
 return texto.split(',').map(c=>c.trim()).filter(Boolean)
}
export function agregarClaveCms(claves: readonly string[], texto: string): string[] {
 const clave = texto.trim()
 if (!clave) throw new Error('Escribe el nombre del campo')
 if (['__proto__','constructor','prototype'].includes(clave)) throw new Error('Ese nombre está reservado')
 if (claves.includes(clave)) throw new Error('Esta clave ya está agregada')
 return [...claves,clave]
}
