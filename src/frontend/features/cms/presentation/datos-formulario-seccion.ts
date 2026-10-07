import type { CamposCms } from '../api/modelos-cms'
export function textoOpcionalSeccion(valor: string | null | undefined): string | null { return valor?.trim() || null }
export function camposFormularioSeccion(campos: Record<string, string>): CamposCms & { imagen: string | null } {
  return { titulo: textoOpcionalSeccion(campos.titulo), subtitulo: textoOpcionalSeccion(campos.subtitulo), descripcion: textoOpcionalSeccion(campos.descripcion), icono: textoOpcionalSeccion(campos.icono), imagen: textoOpcionalSeccion(campos.imagen) }
}
export function metadataFormularioSeccion(claves: readonly string[], valores: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(claves.filter(k => Object.hasOwn(valores, k)).map(k => [k, valores[k]]))
}
export function etiquetaMetadataSeccion(clave: string): string {
  const conocidas: Record<string,string> = { badge_text: 'Texto del Badge', cta_primary_href: 'Enlace Botón Primario', cta_primary_text: 'Texto Botón Primario', cta_secondary_href: 'Enlace Botón Secundario', cta_secondary_text: 'Texto Botón Secundario' }
  return conocidas[clave] ?? clave.replace(/[_-]+/g, ' ').replace(/^./, c => c.toLocaleUpperCase('es'))
}
