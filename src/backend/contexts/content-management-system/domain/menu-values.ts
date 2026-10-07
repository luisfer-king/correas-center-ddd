import { idCMS } from './cms-values.js'
export const gruposMenu = ['Producto','Aplicacion','Servicio'] as const
export type GrupoMenu = typeof gruposMenu[number]
export type ReferenciaMenu = Readonly<{ tipo: 'producto' | 'servicio' | 'industria'; id: bigint }>
export function grupoMenu(valor: string): GrupoMenu {
  const clave = typeof valor === 'string' ? valor.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase() : ''
  if (clave === 'producto' || clave === 'productos') return 'Producto'
  if (clave === 'aplicacion' || clave === 'aplicaciones') return 'Aplicacion'
  if (clave === 'servicio' || clave === 'servicios') return 'Servicio'
  throw new Error('Grupo de menú inválido: selecciona Producto, Aplicacion o Servicio')
}
export function aliasesGrupoMenu(grupo: GrupoMenu): string[] {
  const plurales = { Producto: 'Productos', Aplicacion: 'Aplicaciones', Servicio: 'Servicios' }
  const nombres = [grupo, plurales[grupo], ...(grupo === 'Aplicacion' ? ['Aplicación'] : [])]
  return [...new Set(nombres.flatMap(n => [n,n.toLowerCase(),n.toUpperCase()]))]
}
export function referenciaMenu(tipo: ReferenciaMenu['tipo'], id: bigint): ReferenciaMenu {
  if (!['producto','servicio','industria'].includes(tipo)) throw new Error('Tipo de registro de menú inválido')
  return Object.freeze({tipo,id:idCMS(id)})
}
export function tipoGrupoMenu(grupo: GrupoMenu): ReferenciaMenu['tipo'] {
  return ({Producto:'producto',Aplicacion:'industria',Servicio:'servicio'} as const)[grupo]
}
export function validarReferenciaGrupoMenu(grupo: GrupoMenu, destino: ReferenciaMenu): ReferenciaMenu {
  if (!destino || destino.tipo !== tipoGrupoMenu(grupo)) throw new Error('Registro no corresponde al grupo del menú')
  return referenciaMenu(destino.tipo,destino.id)
}
export function iconoLucideMenu(valor: string | null): string | null {
  if (valor === null) return null
  if (typeof valor !== 'string') throw new Error('Icono Lucide inválido')
  const icono = valor.trim(); if (!icono) return null
  if (icono.length > 128 || /^(?:fa|fas|far|fab|fal|fad|fat)(?:[-\s]|$)/i.test(icono) || !/^[A-Za-z][A-Za-z0-9]*(?:-[a-z0-9]+)*$/.test(icono)) throw new Error('Icono Lucide inválido: escribe su nombre sin clases Font Awesome')
  return icono
}
