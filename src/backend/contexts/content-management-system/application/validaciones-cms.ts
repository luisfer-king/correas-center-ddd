import { Orden } from '../../../shared/domain/value-objects.js'
import { destinoCMS, enlaceCMS } from '../domain/cms-values.js'
import type { DestinoCMS } from '../domain/cms-values.js'
import type { TipoFooter } from '../domain/footer-elemento.js'
import type { CargarSubmenu } from '../domain/menu.js'

export function textoCms(valor: string, campo: string): string {
  if (typeof valor !== 'string' || !valor.trim()) throw new Error(`${campo} obligatorio`)
  return valor.trim()
}
export function textoNullableCms(valor: string | null): string | null {
  if (valor !== null && typeof valor !== 'string') throw new Error('Texto inválido')
  return valor
}
export function booleanoCms(valor: boolean): boolean {
  if (typeof valor !== 'boolean') throw new Error('Indicador inválido')
  return valor
}
export function ordenCms(orden: number): Orden { return Orden.create(orden) }
export function destinoEntradaCms(destino: DestinoCMS): DestinoCMS {
  if (destino === null || typeof destino !== 'object') throw new Error('Destino inválido')
  return destinoCMS(destino.tipo, destino.id)
}
export function submenuCms(valor: CargarSubmenu): CargarSubmenu {
  if (valor !== null && valor !== 'activo' && valor !== 'inactivo') throw new Error('Submenú inválido')
  return valor
}
export function tipoFooterCms(tipo: TipoFooter): TipoFooter {
  if (!['producto', 'industria', 'servicio', 'red_social'].includes(tipo)) throw new Error('Tipo de footer inválido')
  return tipo
}
export function footerCms(tipo: TipoFooter, destino: DestinoCMS | null, enlace: string | null) {
  tipoFooterCms(tipo)
  const nuevoDestino = destino === null ? null : destinoEntradaCms(destino)
  if (nuevoDestino !== null && (tipo === 'red_social' || tipo !== nuevoDestino.tipo)) throw new Error('Destino no corresponde al tipo de footer')
  return { destino: nuevoDestino, enlace: enlace === null ? null : enlaceCMS(textoCms(enlace, 'Enlace')) }
}
/** Fuentes y filtros definidos por la composición; no se ejecutan identificadores como SQL. */
export interface FuentesWizardCms { validar(fuente: string, filtro: string | null): void }
export class CatalogoFuentesWizardCms implements FuentesWizardCms {
  private readonly fuentes: ReadonlyMap<string, ReadonlySet<string>>
  constructor(fuentes: Readonly<Record<string, readonly string[]>>) {
    this.fuentes = new Map(Object.entries(fuentes).map(([fuente, filtros]) => [textoCms(fuente, 'Fuente'), new Set(filtros.map(f => textoCms(f, 'Filtro')))]))
  }
  validar(fuente: string, filtro: string | null): void {
    const filtros = this.fuentes.get(fuente)
    if (!filtros || (filtro !== null && !filtros.has(filtro))) throw new Error('Fuente o filtro del wizard no permitido')
  }
}
