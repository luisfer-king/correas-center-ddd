/** Compatibilidad explícita con los permisos agrupados ya instalados. */
const grupos: Record<string, string> = {
  tipos_seccion: 'secciones', contenidos_seccion: 'secciones', metadata_seccion: 'secciones',
  menus: 'menus', items_menu: 'menus', elementos_footer: 'footers',
  configuracion_sitio: 'configuracion', pasos_wizard: 'wizard',
  registros_cms: 'registros', contenidos_registro: 'registros',
}
export function codigosPermisoCms(recurso: string, accion: 'read' | 'manage'): string[] {
  const normalizado = recurso.replaceAll('-', '_')
  const grupo = grupos[normalizado]
  if (!grupo) throw new Error('Recurso CMS inválido')
  return [...new Set([`cms.${normalizado}.${accion}`, `cms.${grupo}.${accion}`])]
}
export async function exigirAlternativaCms(codigos: readonly string[], exigir: (codigo: string) => Promise<void>): Promise<void> {
  for (const codigo of codigos) {
    try { await exigir(codigo); return }
    catch (error) { if (!(error instanceof Error) || error.message !== 'Acceso denegado') throw error }
  }
  throw new Error('Acceso denegado')
}
export async function tieneAlternativaCms(codigos: readonly string[], tiene: (codigo: string) => Promise<boolean>): Promise<boolean> {
  for (const codigo of codigos) if (await tiene(codigo)) return true
  return false
}
