import { Menu } from '../domain/menu.js'
/** Ocultar bajas de ítems sin modificar el agregado cargado por el repositorio. */
export function menuVisibleCms(menu: Menu, incluirEliminados: boolean): Menu {
  if (incluirEliminados) return menu
  return new Menu({ id: menu.id, empresaId: menu.empresaId, grupo: menu.grupo, destino: menu.destino,
    ruta: menu.ruta, icono: menu.icono, mostrar: menu.mostrar, orden: menu.orden, cargarSubmenu: menu.cargarSubmenu,
    estado: menu.estado, fechas: { creadoEn: menu.creadoEn, actualizadoEn: menu.actualizadoEn, eliminadoEn: menu.eliminadoEn },
    items: menu.itemsOrdenados.filter(item => item.estado !== 'eliminado') })
}
