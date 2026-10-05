import { CatalogoFuentesWizardCms } from '../application/validaciones-cms.js'
/** Sin variable el catálogo está vacío: las lecturas funcionan; no se habilitan fuentes implícitas. */
export function fuentesWizardCmsDesdeEntorno(valor = process.env.CMS_FUENTES_WIZARD_JSON) {
  if (valor === undefined) return new CatalogoFuentesWizardCms({})
  let datos: unknown
  try { datos = JSON.parse(valor) } catch { throw new Error('CMS_FUENTES_WIZARD_JSON debe ser un objeto JSON') }
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) throw new Error('CMS_FUENTES_WIZARD_JSON debe ser un objeto JSON')
  const fuentes: Record<string, readonly string[]> = Object.create(null)
  for (const [clave, filtros] of Object.entries(datos)) {
    if (!/^[a-z][a-z0-9_]*$/.test(clave) || !Array.isArray(filtros) || !filtros.every(f => typeof f === 'string' && /^[a-z][a-z0-9_]*$/.test(f))) throw new Error('Fuente o filtro de configuración inválido')
    fuentes[clave] = filtros
  }
  return new CatalogoFuentesWizardCms(fuentes)
}
