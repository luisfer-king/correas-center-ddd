import { slugNombre } from '../../../../shared/slug-nombre'
export const gruposFormularioMenu = ['Producto','Aplicacion','Servicio'] as const
export type GrupoFormularioMenu = typeof gruposFormularioMenu[number]
export const prefijosMenu: Record<GrupoFormularioMenu,string> = {Producto:'/products/',Aplicacion:'/applications/',Servicio:'/services/'}
export const tiposMenu: Record<GrupoFormularioMenu,'producto'|'industria'|'servicio'> = {Producto:'producto',Aplicacion:'industria',Servicio:'servicio'}
export function grupoFormularioMenu(valor: unknown): GrupoFormularioMenu | '' {
  const v=String(valor ?? '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
  return ({producto:'Producto',productos:'Producto',aplicacion:'Aplicacion',aplicaciones:'Aplicacion',servicio:'Servicio',servicios:'Servicio'} as Record<string,GrupoFormularioMenu>)[v] ?? ''
}
export function construirRutaMenu(grupo: GrupoFormularioMenu,suffix:string):string {
  const valor=suffix.trim().replace(/^\/+|\/+$/g,'')
  if(!valor || /[\\\s?#]/.test(valor) || valor.split('/').some(s=>!s || s==='.' || s==='..')) throw new Error('Sufijo de ruta inválido')
  return prefijosMenu[grupo]+valor+'/'
}

export function rutaDestinoSubenlace(cargarSubmenu: string | null, rutaPadre: string, rutaHijo: string): string {
  return cargarSubmenu === 'activo' ? rutaHijo : rutaPadre
}

/** Productos/industrias conservan el slug registrado; servicios lo generan desde su nombre. */
export function sufijoElementoMenu(grupo: GrupoFormularioMenu, elemento: { nombre: string; slug?: string }): string {
  const sufijo = grupo === 'Servicio' ? slugNombre(elemento.nombre) : elemento.slug?.trim()
  if (!sufijo) throw new Error('El registro seleccionado no tiene un slug válido')
  construirRutaMenu(grupo,sufijo)
  return sufijo
}
